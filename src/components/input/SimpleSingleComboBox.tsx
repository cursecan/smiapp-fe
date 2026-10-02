"use client";

import {
  ComboBox,
  Description,
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

interface DynamicComboBoxSingleProps<T extends Record<string, any>> {
  label?: string;
  placeholder?: string;
  urlList: string;
  value?: T | string | number | null;
  itemKey: keyof T;
  itemLabel: keyof T | ((item: T) => string);
  itemDescription?: keyof T | ((item: T) => string);
  searchParamName?: string;
  onChange?: (value: string | number | null, selectedItem?: T | null) => void;
  renderItem?: (item: T, isSelected: boolean) => ReactNode;
  className?: string;
}

export function DynamicComboBoxSingle<T extends Record<string, any>>({
  label,
  placeholder = "Pilih item...",
  urlList,
  value = null,
  itemKey,
  itemLabel,
  itemDescription,
  searchParamName = "search",
  onChange,
  renderItem,
  className = "w-[320px]",
}: DynamicComboBoxSingleProps<T>) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 400);

  // Helper Extractor ID
  const extractValueId = (val: T | string | number | null | undefined): string => {
    if (val === null || val === undefined) return "";
    if (typeof val === "object") {
      return val[itemKey] !== undefined ? String(val[itemKey]) : "";
    }
    return String(val);
  };

  const [selectedKey, setSelectedKey] = useState<string>(() => extractValueId(value));

  // Helper Extractor Label & Description
  const getLabelText = (item: T): string => {
    if (typeof itemLabel === "function") {
      return itemLabel(item);
    }
    return String(item[itemLabel] ?? "");
  };

  const getDescriptionText = (item: T): string | undefined => {
    if (!itemDescription) return undefined;
    if (typeof itemDescription === "function") {
      return itemDescription(item);
    }
    return item[itemDescription] ? String(item[itemDescription]) : undefined;
  };

  // Map Lookup Internal
  const [itemsMap, setItemsMap] = useState<Map<string, T>>(() => {
    const map = new Map<string, T>();
    if (value && typeof value === "object" && value[itemKey] !== undefined) {
      map.set(String(value[itemKey]), value as T);
    }
    return map;
  });

  // Ref onChange untuk mencegah closure stale bug
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Infinite Query Fetching
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [urlList, debouncedSearch, searchParamName],
      queryFn: async ({ pageParam, signal }) => {
        let endpoint = "";
        if (pageParam) {
          endpoint = String(pageParam);
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
        const nextUrl = lastPage?.next ?? lastPage?.data?.next;
        return nextUrl ?? undefined;
      },
      initialPageParam: null as string | null,
      enabled: isOpen || debouncedSearch.length > 0,
    });

  // Flat Array Hasil API
  const apiItems = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page: any) => {
      return page?.data?.results ?? page?.results ?? [];
    });
  }, [data]);

  // Sinkronkan hasil fetch API ke Lookup Map tanpa infinite loop
  useEffect(() => {
    if (apiItems.length > 0) {
      setItemsMap((prev) => {
        const newMap = new Map(prev);
        let hasChanged = false;
        apiItems.forEach((item) => {
          if (item && item[itemKey] !== undefined) {
            const idStr = String(item[itemKey]);
            if (!newMap.has(idStr)) {
              newMap.set(idStr, item);
              hasChanged = true;
            }
          }
        });
        return hasChanged ? newMap : prev;
      });
    }
  }, [apiItems, itemKey]);

  // 🔴 FIX: Sinkronkan state internal saat `value` dari Parent berubah (Diperbaiki dependency-nya)
  useEffect(() => {
    const stringId = extractValueId(value);
    setSelectedKey(stringId);

    // Jika value berupa Objek, daftarkan ke Map
    if (value && typeof value === "object" && value[itemKey] !== undefined) {
      const objVal = value as T;
      setItemsMap((prev) => {
        if (prev.get(stringId) === objVal) return prev;
        return new Map(prev).set(stringId, objVal);
      });
      setSearch(getLabelText(objVal));
      return;
    }

    if (!stringId) {
      setSearch("");
    } else {
      // Ambil label dari map jika sudah ada
      const currentItem = itemsMap.get(stringId);
      if (currentItem) {
        setSearch(getLabelText(currentItem));
      }
    }
  }, [value]); // 👈 `itemsMap` DIBUANG DARI DEPENDENCY UNTUK MENCEGAH INFINITE LOOP

  // Handler Selection Utama
  const handleSelectionChange = (key: React.Key | null) => {
    if (key === null || key === undefined || key === "") {
      setSelectedKey("");
      setSearch("");
      if (onChangeRef.current) {
        onChangeRef.current(null, null);
      }
      return;
    }

    const stringKey = String(key);
    const selectedItem =
      itemsMap.get(stringKey) ||
      apiItems.find((i) => String(i[itemKey]) === stringKey) ||
      null;

    setSelectedKey(stringKey);

    if (selectedItem) {
      setSearch(getLabelText(selectedItem));
    }

    if (onChangeRef.current) {
      const rawId = selectedItem ? selectedItem[itemKey] : key;
      onChangeRef.current(rawId, selectedItem);
    }
  };

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <Label>{label}</Label>}

      <ComboBox
        allowsEmptyCollection
        inputValue={search}
        onInputChange={(val) => setSearch(val)}
        selectedKey={selectedKey || null}
        onSelectionChange={handleSelectionChange}
        onOpenChange={(open) => setIsOpen(open)}
      >
        <ComboBox.InputGroup>
          <Input placeholder={placeholder} />
          <ComboBox.Trigger />
        </ComboBox.InputGroup>

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
              const idStr = String(item[itemKey]);
              const textLabel = getLabelText(item);
              const descLabel = getDescriptionText(item);
              const isSelected = selectedKey === idStr;

              return (
                <ListBox.Item
                  key={idStr}
                  id={idStr}
                  textValue={textLabel}
                  className={isSelected ? "bg-accent/10 font-medium" : ""}
                >
                  {renderItem ? (
                    renderItem(item, isSelected)
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <span>{textLabel}</span>
                        {descLabel && (
                          <Description>{descLabel}</Description>
                        )}
                      </div>
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
                  <span className="text-muted text-xs">
                    Memuat lebih banyak...
                  </span>
                </div>
              </ListBoxLoadMoreItem>
            )}
          </ListBox>
        </ComboBox.Popover>
      </ComboBox>
    </div>
  );
}