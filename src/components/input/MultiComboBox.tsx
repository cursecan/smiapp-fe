"use client";

import {
  Chip,
  ComboBox,
  EmptyState,
  Input,
  Label,
  ListBox,
  ListBoxLoadMoreItem,
  Spinner,
} from "@heroui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ReactNode, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import { api } from "../../lib/api";

export interface ParsedApiResponse<T> {
  items: T[];
  nextPage?: number | string | null;
}

interface DynamicComboBoxMultipleProps<T extends Record<string, any>> {
  label?: string;
  placeholder?: string;
  /** Endpoint URL dasar untuk pencarian & pagination */
  urlList: string;
  /** Data awal untuk pre-fill (Objek utuh sesuai tipe T) */
  initialValue?: T[];
  /** Key unik penentu ID (contoh: 'id', 'code', 'uuid') */
  itemKey: keyof T;
  /** Key atau fungsi extractor untuk label yang ditampilkan */
  itemLabel: keyof T | ((item: T) => string);
  /** Parameter query pencarian ke API (default: 'search') */
  searchParamName?: string;
  /** Parser kustom untuk menyesuaikan struktur response API backend yang beragam */
  parseResponse?: (response: any) => ParsedApiResponse<T>;
  /** Callback saat daftar pilihan berubah */
  onChange?: (selectedItems: T[]) => void;
  /** Custom render untuk item di dalam dropdown (Opsional) */
  renderItem?: (item: T, isSelected: boolean) => ReactNode;
  className?: string;
}

export function DynamicComboBoxMultiple<T extends Record<string, any>>({
  label = "Pilih Item",
  placeholder = "Cari...",
  urlList,
  initialValue = [],
  itemKey,
  itemLabel,
  searchParamName = "search",
  parseResponse = (res) => ({
    items: res?.results ?? res?.data ?? [],
    nextPage: res?.next ? (res?.page ? res.page + 1 : null) : null,
  }),
  onChange,
  renderItem,
  className = "w-[320px]",
}: DynamicComboBoxMultipleProps<T>) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);

  // Helper extractor untuk mendapatkan string label secara konsisten
  const getLabelText = (item: T): string => {
    if (typeof itemLabel === "function") {
      return itemLabel(item);
    }
    return String(item[itemLabel] ?? "");
  };

  // State Map untuk menampung item terpilih (O(1) lookups)
  const [selectedMap, setSelectedMap] = useState<Map<string | number, T>>(() => {
    const initialMap = new Map<string | number, T>();
    // Menggunakan initialValue langsung tanpa hit API detail
    initialValue.forEach((item) => {
      initialMap.set(item[itemKey], item);
    });
    return initialMap;
  });

  // Fetch Infinite Scroll dengan TanStack Query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [urlList, debouncedSearch, searchParamName],
      queryFn: async ({ pageParam = 1, signal }) => {
        const separator = urlList.includes("?") ? "&" : "?";
        const endpoint = `${urlList}${separator}${searchParamName}=${encodeURIComponent(
          debouncedSearch
        )}&page=${pageParam}`;

        const res = await api(endpoint, { signal });
        return parseResponse(res);
      },
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      initialPageParam: 1,
    });

  // Gabungkan semua item dari seluruh halaman pencarian
  const apiItems = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.items ?? []);
  }, [data]);

  // Lookup Map lokal (API Items + Selected Items)
  const itemLookupMap = useMemo(() => {
    const map = new Map<string | number, T>(selectedMap);
    apiItems.forEach((item) => {
      map.set(item[itemKey], item);
    });
    return map;
  }, [apiItems, selectedMap]);

  // Handler Pilihan Item
  const handleSelect = (key: React.Key | null) => {
    if (!key) return;

    const keyVal = key as string | number;
    const itemToToggle = itemLookupMap.get(keyVal);

    if (!itemToToggle) return;

    const updatedMap = new Map(selectedMap);
    if (updatedMap.has(keyVal)) {
      updatedMap.delete(keyVal);
    } else {
      updatedMap.set(keyVal, itemToToggle);
    }

    setSelectedMap(updatedMap);
    onChange?.(Array.from(updatedMap.values()));
    setSearch("");
  };

  const handleRemove = (keyVal: string | number) => {
    const updatedMap = new Map(selectedMap);
    updatedMap.delete(keyVal);
    setSelectedMap(updatedMap);
    onChange?.(Array.from(updatedMap.values()));
  };

  const selectedItems = Array.from(selectedMap.values());

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <Label>{label}</Label>}

      

      {/* ComboBox UI */}
      <ComboBox
        allowsEmptyCollection
        inputValue={search}
        onInputChange={setSearch}
        onSelectionChange={handleSelect}
      >
        <ComboBox.InputGroup>
          <Input placeholder={placeholder} />
          <ComboBox.Trigger />
        </ComboBox.InputGroup>

        {/* Render Selected Chips */}
        {selectedItems.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1">
            {selectedItems.map((item) => {
              const id = item[itemKey];
              const text = getLabelText(item);
              return (
                <Chip
                  key={id}
                  size="sm"
                  variant="primary"
                  // onClose={() => handleRemove(id)}
                >
                  {text}
                </Chip>
              );
            })}
          </div>
        )}

        <ComboBox.Popover>
          <ListBox
            renderEmptyState={() => {
              if (isLoading) {
                return (
                  <div className="flex items-center justify-center py-4">
                    <Spinner size="sm" />
                  </div>
                );
              }
              return <EmptyState>Data tidak ditemukan</EmptyState>;
            }}
          >
            {apiItems.map((item) => {
              const id = item[itemKey];
              const textLabel = getLabelText(item);
              const isSelected = selectedMap.has(id);

              return (
                <ListBox.Item
                  key={id}
                  id={id}
                  textValue={textLabel}
                  className={isSelected ? "bg-accent/10 font-medium" : ""}
                >
                  {renderItem ? (
                    renderItem(item, isSelected)
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span>{textLabel}</span>
                      {isSelected && <span className="text-xs text-primary">✓</span>}
                    </div>
                  )}
                </ListBox.Item>
              );
            })}

            {/* Pagination Load More */}
            {hasNextPage && (
              <ListBoxLoadMoreItem
                isLoading={isFetchingNextPage}
                onLoadMore={fetchNextPage}
              >
                <div className="flex items-center justify-center gap-2 py-2">
                  <Spinner size="sm" />
                  <span className="text-muted text-xs">Memuat lebih banyak...</span>
                </div>
              </ListBoxLoadMoreItem>
            )}
          </ListBox>
        </ComboBox.Popover>
      </ComboBox>
    </div>
  );
}