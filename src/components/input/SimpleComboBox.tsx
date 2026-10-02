"use client";

import {
  Chip,
  Collection,
  ComboBox,
  Description,
  EmptyState,
  Input,
  Label,
  ListBox,
  ListBoxLoadMoreItem,
  Spinner,
} from "@heroui/react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

export interface ComboBoxItem {
  id: string;
  name: string;
  description?: string;
}

interface SimpleComboBoxProps {
  label?: string;
  placeholder?: string;
  fetchUrl: (params: { pageParam?: number | null; queryKey: any[] }) => Promise<any>;
  fetchDetailUrl?: (params: { queryKey: any[] }) => Promise<any>;
  /**
   * Untuk single mode: string | null (contoh: "1")
   * Untuk multi mode: string[] (contoh: ["1", "2"])
   */
  value?: string | string[] | null;
  query?: any[];
  filter?: (item: any) => ComboBoxItem;
  multi?: boolean;
  onChange?: (value: any) => void;
  [key: string]: any;
}

const SimpleComboBox = ({
  label,
  placeholder,
  fetchUrl,
  fetchDetailUrl,
  value = null,
  query = [],
  filter,
  multi = false,
  onChange = () => {},
  ...props
}: SimpleComboBoxProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [searchBounce] = useDebounce(search, 500);

  // Normalisasi state kunci terpilih (Single -> string, Multi -> Set<string>)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(() => {
    if (multi && Array.isArray(value)) return new Set(value);
    if (!multi && typeof value === "string" && value) return new Set([value]);
    return new Set();
  });

  // Keep track item terisi untuk rendering Chips (terutama pada mode Multi)
  const [selectedItemsMap, setSelectedItemsMap] = useState<Map<string, ComboBoxItem>>(new Map());

  // 1. Sync nilai dari prop 'value' luar ke state internal
  useEffect(() => {
    if (multi && Array.isArray(value)) {
      setSelectedKeys(new Set(value));
    } else if (!multi && typeof value === "string" && value) {
      setSelectedKeys(new Set([value]));
    } else if (!value) {
      setSelectedKeys(new Set());
      setSearch("");
    }
  }, [value, multi]);

  // Parameter untuk fetch detail saat ada initial value
  const singleValueParam = !multi && typeof value === "string" ? value : null;

  // 2. Query Detail (Fetch item awal jika diberikan ID dari parent)
  const { data: fetchedDetailData } = useQuery({
    queryKey: ["combobox-detail", singleValueParam],
    queryFn: fetchDetailUrl,
    enabled: !!singleValueParam && !!fetchDetailUrl,
    select: (res) => {
      const resData = res?.data ?? res;
      return filter ? filter(resData) : resData;
    },
  });

  // Sync teks input & item map ketika data detail single-value selesai diambil
  useEffect(() => {
    if (fetchedDetailData && !multi) {
      setSearch(fetchedDetailData.name ?? "");
      setSelectedItemsMap((prev) => new Map(prev).set(fetchedDetailData.id, fetchedDetailData));
    }
  }, [fetchedDetailData, multi]);

  // 3. Fetch List Data dengan Infinite Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [...query, searchBounce],
    initialPageParam: 1,
    queryFn: fetchUrl,
    enabled: isOpen || searchBounce.length > 0,
    getNextPageParam: (lastPage) => {
      const nextUrl = lastPage?.data?.next ?? lastPage?.next;
      if (!nextUrl) return undefined;
      try {
        const url = new URL(nextUrl);
        const page = url.searchParams.get("page");
        return page ? Number(page) : undefined;
      } catch {
        return undefined;
      }
    },
  });

  // Flatten dan Filter items dari paged responses
  const items = useMemo(() => {
    const flatData = data?.pages.flatMap((page) => page?.data?.results ?? page?.results ?? []) ?? [];
    if (!filter) return flatData;
    return flatData.map(filter);
  }, [data, filter]);

  // Update item Map setiap kali item baru termuat dari query
  useEffect(() => {
    if (items.length > 0) {
      setSelectedItemsMap((prev) => {
        const newMap = new Map(prev);
        items.forEach((item) => newMap.set(String(item.id), item));
        return newMap;
      });
    }
  }, [items]);

  // 4. Handler Pemilihan Item
  const handleSelectionChange = (keys: React.Key | React.Key[] | null) => {
    // 1. Handling ketika nilai kosong/null/undefined
  if (!keys || (typeof keys === "object" && "size" in keys && keys.size === 0)) {
    setSelectedKeys(new Set());
    setSearch("");
    onChange(multi ? [] : null);
    return;
  }

  // 2. Normalisasi input parameter menjadi Array of String
  let extractedKeys: string[] = [];

  if (Array.isArray(keys)) {
    // Jika parameter berupa Array: ['1', '2']
    extractedKeys = keys.map(String);
  } else if (keys instanceof Set) {
    // Jika parameter berupa Set: Set('1', '2')
    extractedKeys = Array.from(keys).map(String);
  } else if (typeof keys === "object" && keys !== null && "anchorKey" in keys) {
    // Jika parameter berupa Selection objek khas React Aria/HeroUI
    extractedKeys = Array.from(keys as Set<React.Key>).map(String);
  } else if (keys !== "all") {
    // Jika parameter berupa Primitive Key tunggal: "1" atau 1
    extractedKeys = [String(keys)];
  }

  // 3. Logic untuk Mode MULTI
  if (multi) {
    // Menggabungkan atau memperbarui Set pilihan
    const nextKeys = new Set(extractedKeys);

    setSelectedKeys(nextKeys);
    setSearch(""); // Reset teks pencarian agar user bisa mencari item lain
    onChange(Array.from(nextKeys)); // Mengirim array string ke parent/Form
  } 
  
  // 4. Logic untuk Mode SINGLE
  else {
    const singleKey = extractedKeys[0] ?? "";
    setSelectedKeys(new Set([singleKey]));

    // Cari item untuk mengisi nilai teks pencarian
    const selectedItem =
      selectedItemsMap.get(singleKey) ||
      items.find((i) => String(i.id) === singleKey);

    if (selectedItem) {
      setSearch(selectedItem.name);
    }

    onChange(singleKey || null);
  }
  };

  // Handler Hapus Chip/Tag pada Mode Multi
  const handleRemoveChip = (idToRemove: string) => {
    const nextKeys = new Set(selectedKeys);
    nextKeys.delete(idToRemove);
    setSelectedKeys(nextKeys);
    onChange(Array.from(nextKeys));
  };

  const currentSingleKey = !multi && selectedKeys.size > 0 ? Array.from(selectedKeys)[0] : "";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <ComboBox
        allowsEmptyCollection
        inputValue={search}
        onInputChange={setSearch}
        selectedKey={currentSingleKey}
        // onSelectionChange={handleSelectionChange}
        onOpenChange={(open) => setIsOpen(open)}
        selectionMode={!multi ? 'single' : 'multiple'}
        onChange={handleSelectionChange}
        {...props}
      >
        {label && <Label>{label}</Label>}


        <ComboBox.InputGroup>
          <Input placeholder={placeholder || "Search..."} />
          <ComboBox.Trigger />
        </ComboBox.InputGroup>

        {/* Tampilan Chips untuk Mode Multi-Select */}
        {multi && (
          <ComboBox.Value />
        )}

        <ComboBox.Popover>
          <ListBox
            renderEmptyState={() => {
              if (isFetching && !isFetchingNextPage) {
                return (
                  <div className="flex justify-center py-4">
                    <Spinner size="sm" />
                  </div>
                );
              }
              return <EmptyState />;
            }}
          >
            <Collection items={items}>
              {(item: ComboBoxItem) => {
                const isSelected = selectedKeys.has(String(item?.id));
                return (
                  <ListBox.Item
                    key={item?.id}
                    id={item?.id}
                    textValue={item?.name}
                    className={isSelected && multi ? "bg-default-100 font-medium" : ""}
                  >
                    <div className="flex flex-col">
                      <Label>{item?.name}</Label>
                      {item?.description && (
                        <Description>{item?.description}</Description>
                      )}
                    </div>
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                );
              }}
            </Collection>

            {hasNextPage && (
              <ListBoxLoadMoreItem
                isLoading={isFetchingNextPage}
                onLoadMore={() => fetchNextPage()}
              >
                <div className="flex items-center justify-center gap-2 py-2">
                  <Spinner size="sm" />
                  <span className="text-sm text-default-500">
                    Loading more...
                  </span>
                </div>
              </ListBoxLoadMoreItem>
            )}
          </ListBox>
        </ComboBox.Popover>
      </ComboBox>
    </div>
  );
};

export default SimpleComboBox;