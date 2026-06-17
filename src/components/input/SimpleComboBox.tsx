import { Collection, ComboBox, EmptyState, Input, Label, ListBox, ListBoxLoadMoreItem, Spinner } from "@heroui/react"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";


interface Character {
  name: string;
  id: string
}

const SimpleComboBox = ({label, fetchUrl, fetchDetailUrl, value=null, query=[], filter=null, onChange=() => {},  ...props}) => {
    const [search, setSearch] = useState("");
    const [selectedKey, setSelectedKey] = useState("")
    const [searchBounce] = useDebounce(search, 600)

    const {data: selectedData} = useQuery({
        queryKey: ['combox-detail3', value],
        queryFn: fetchDetailUrl,
        enabled: !!value && typeof(value) === 'string',
        select: (data) => {
            const resData = data.data
            if (filter) {
                return filter(resData)
            }

            return resData
        }
    })


  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [...query, searchBounce],
    initialPageParam: null,
    queryFn: fetchUrl,
    getNextPageParam: (lastPage) => {
        if (!lastPage.data.next) return undefined

            const url = new URL(lastPage.data.next)
            return Number(url.searchParams.get('page'))
    },
  });

  useEffect(() => {
    if (!selectedData) return 
    
    setSearch(selectedData.name)
    setSelectedKey(selectedData.id)
    
  }, [selectedData])

  const items = useMemo(() => {
    const flatData = data?.pages.flatMap((page) => page.data.results) ?? [];
    if (!filter) {
        return flatData
    }
    const clean = flatData.map(filter)
    return clean
  }, [data]);

  const handleChangeSelect = (e) => {
    setSelectedKey(e)
    const f = items.find(i => i.id===e)
    setSearch(f.name)
    onChange(e)
  }


  return (
    <ComboBox
      allowsEmptyCollection
      inputValue={search}
      onInputChange={setSearch}
      selectedKey={selectedKey}
      onSelectionChange={handleChangeSelect}
      {...props}
    >
        { label && <Label>{label}</Label>}
      
      <ComboBox.InputGroup>
        <Input placeholder={props.placeholder || 'Search...'} />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>

      <ComboBox.Popover>
        <ListBox
          renderEmptyState={() => {
            if (isFetching) {
              return (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              );
            }

            return <EmptyState />;
          }}
        >
          <Collection items={items}>
            {(item: Character) => (
              <ListBox.Item
                key={item?.id}
                id={item?.id}
                textValue={item?.name}
              >
                {item?.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )}
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
  )
}

export default SimpleComboBox