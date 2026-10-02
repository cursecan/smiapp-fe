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
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

import { api } from "../../lib/api";
import { Check } from "@gravity-ui/icons";

export interface DrfPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface DynamicComboBoxMultipleProps<T extends Record<string, any>> {
  label?: string;
  placeholder?: string;
  urlList: string;
  initialValue?: T[];
  itemKey: keyof T;
  itemLabel: keyof T | ((item: T) => string);
  searchParamName?: string;
  onChange?: (selectedItems: T[]) => void;
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
  onChange,
  renderItem,
  className = "w-[320px]",
}: DynamicComboBoxMultipleProps<T>) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 400);

  // Helper extractor label
  const getLabelText = (item: T): string => {
    if (typeof itemLabel === "function") {
      return itemLabel(item);
    }
    return String(item[itemLabel] ?? "");
  };

  // 1. Inisialisasi Map dari Initial Value
  const [selectedMap, setSelectedMap] = useState<Map<string, T>>(() => {
    const initialMap = new Map<string, T>();
    initialValue.forEach((item) => {
      if (item && item[itemKey] !== undefined) {
        initialMap.set(String(item[itemKey]), item);
      }
    });
    return initialMap;
  });

  // Sync state selectedMap jika initialValue berubah dari Parent (Async Fetching / Reset Form)
  useEffect(() => {
    if (initialValue && initialValue.length > 0) {
      setSelectedMap((prevMap) => {
        const newMap = new Map(prevMap);
        initialValue.forEach((item) => {
          if (item && item[itemKey] !== undefined) {
            newMap.set(String(item[itemKey]), item);
          }
        });
        return newMap;
      });
    }
  }, [initialValue, itemKey]);

  // Keep reference onChange terbaru untuk menghindari closure bug
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Fetching dengan TanStack Query
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [urlList, debouncedSearch, searchParamName],
      queryFn: async ({ pageParam, signal }) => {
        let endpoint = "";
        if (pageParam) {
          endpoint = String(pageParam)
          // .replace(/^http:\/\//i, "https://");
        } else {
          const separator = urlList.includes("?") ? "&" : "?";
          endpoint = `${urlList}${separator}${searchParamName}=${encodeURIComponent(
            debouncedSearch
          )}`;
        }
        const res = await api(endpoint, { signal });
        return res;
      },
      getNextPageParam: (lastPage: any) => {
        // Mendukung penanganan struktur res langsung atau res.data
        const nextUrl = lastPage?.next ?? lastPage?.data?.next;
        return nextUrl ?? undefined;
      },
      initialPageParam: null as string | null,
    });

  // Ekstraksi item yang mendukung response langsung maupun wrapped (Axios res.data)
  const apiItems = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: any) => {
      return page?.data?.results ?? page?.results ?? [];
    });
  }, [data]);

  // 2. Lookup Map Komprehensif
  const itemLookupMap = useMemo(() => {
    const map = new Map<string, T>();

    // Masukkan selectedMap terlebih dahulu
    selectedMap.forEach((item, key) => {
      map.set(String(key), item);
    });

    // Masukkan hasil API
    apiItems.forEach((item) => {
      if (item && item[itemKey] !== undefined) {
        map.set(String(item[itemKey]), item);
      }
    });

    return map;
  }, [apiItems, selectedMap, itemKey]);

  // 3. Handler Selection Utama
  const handleSelectionChange = (key: React.Key | null) => {
    if (key === null || key === undefined || key === "") return;

    const stringKey = String(key);
    const itemToToggle = itemLookupMap.get(stringKey);

    if (!itemToToggle) {
      console.warn("Item tidak ditemukan di lookup map untuk key:", stringKey);
      return;
    }

    const updatedMap = new Map(selectedMap);

    if (updatedMap.has(stringKey)) {
      updatedMap.delete(stringKey);
    } else {
      updatedMap.set(stringKey, itemToToggle);
    }

    const newSelectedItems = Array.from(updatedMap.values());

    // Update Local State
    setSelectedMap(updatedMap);

    // Trigger Callback ke Parent dengan ref aman
    if (onChangeRef.current) {
      onChangeRef.current(newSelectedItems);
    }

    // Reset teks pencarian
    setSearch("");
  };

  const handleRemove = (keyVal: string | number) => {
    const stringKey = String(keyVal);
    const updatedMap = new Map(selectedMap);
    updatedMap.delete(stringKey);

    const newSelectedItems = Array.from(updatedMap.values());
    setSelectedMap(updatedMap);

    if (onChangeRef.current) {
      onChangeRef.current(newSelectedItems);
    }
  };

  const selectedItems = Array.from(selectedMap.values());

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <Label>{label}</Label>}

      {/* ComboBox Component */}
      <ComboBox
        allowsEmptyCollection
        inputValue={search}
        onInputChange={(val) => setSearch(val)}
        selectedKey={null}
        onSelectionChange={handleSelectionChange}
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
                  key={String(id)}
                  size="lg"
                  variant="flat"
                  onClose={() => handleRemove(id)}
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
              const id = String(item[itemKey]);
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
                      {isSelected && <Check className="size-4" />}
                    </div>
                  )}
                </ListBox.Item>
              );
            })}

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