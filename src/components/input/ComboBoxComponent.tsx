import { Label, ComboBox, Input, ListBox, EmptyState, Collection, ListBoxLoadMoreItem, Spinner, Avatar, Description } from '@heroui/react'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useInfiniteQuery } from '@tanstack/react-query'

const ComboBoxComponent = ({label, onChange=()=>{}, fnQuery, keyName, filter, value, ...props}) => {
    const [search, setSearch] = useState()
    const [debouncedFilter] = useDebounce(search, 600)
    const [selectedKey, setSelectedKey] = useState(value || '')
    
    
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: [keyName, debouncedFilter],
        queryFn: ({pageParam, queryKey}) => fnQuery(pageParam, queryKey),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            
            if (!lastPage.data.next) return undefined

            const url = new URL(lastPage.data.next)
            return Number(url.searchParams.get('page'))
        }
    })
    
    const items = (data?.pages.flatMap(page => page.data.results) || []).map(filter)

    const list = {
        items,
        loadingState: isFetchingNextPage ? 'loadingMore' : 'idle',
        loadMore: () => {
            if (hasNextPage) fetchNextPage()
        },
    }

    const selectedItem = items?.find(i=>i.id===selectedKey)

    const onChangeValue = (e) => {
        // console.log(e);
        // setSearch(selectedItem?.name)
        setSelectedKey(e)
        onChange(e)
    }

    useEffect(() => {
        if (value) {
            setSelectedKey(value)
        }

    }, [value])

  return (
    <>
    <ComboBox
        allowsEmptyCollection
        inputValue={search}
        // onInputChange={setSearch}
        fullWidth
        onSelectionChange={(key) => onChangeValue(key)}
        selectedKey={selectedKey}
    >
        {
            label && <Label>{label}</Label>
        }
        <ComboBox.InputGroup>
            <Input placeholder='Search...' />
            <ComboBox.Trigger />
        </ComboBox.InputGroup>
        <ComboBox.Popover className={'w-100'}>
            <ListBox
                renderEmptyState={() => {<EmptyState />}}
            >
                <Collection items={items}>
                    {(item) => {
                        return (
                            <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                                <div className="flex flex-col flex-1">
                                    <Label>{item.name}</Label>
                                    {
                                        !!item.description && <Description>{item.description}</Description>
                                    }
                                    
                                </div>
                                <ListBox.ItemIndicator />
                            </ListBox.Item>
                        )
                    }}
                </Collection>
                <ListBoxLoadMoreItem
                    isLoading={list.loadingState === "loadingMore"}
                    onLoadMore={list.loadMore}
                >
                    <div className="flex items-center justify-center gap-2 py-2">
                        <Spinner size="sm" />
                        <span className="muted text-sm">Loading more...</span>
                    </div>
                </ListBoxLoadMoreItem>
            </ListBox>
        </ComboBox.Popover>
    </ComboBox>
    {/* <p className="text-sm text-black">Selected: {selectedItem?.name || "None"}</p> */}
    </>
  )
}

export default ComboBoxComponent