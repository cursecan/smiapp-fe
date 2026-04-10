import { Label, ComboBox, Input, ListBox, EmptyState, Collection, ListBoxLoadMoreItem, Spinner } from '@heroui/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useWilayahService } from '../../services/masterdata/wilayahService'
import { useDebounce } from 'use-debounce'

const WilayahComboBox = () => {
    const [search, setSearch] = useState('')
    const [debouncedFilter] = useDebounce(search, 600)
    

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['wilayah-list-combox', debouncedFilter],
        queryFn: async ({pageParam, queryKey}) => useWilayahService.list({pageParam, queryKey}),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (!lastPage.data.next) return undefined

            const url = new URL(lastPage.data.next)
            return Number(url.searchParams.get('page'))
        }
    })
    
    const items = (data?.pages.flatMap(page => page.data.results) || []).map(i => ({...i, name: i.lokasi}))
    const list = {
        items,
        loadingState: isFetchingNextPage ? 'loadingMore' : 'idle',
        loadMore: () => {
            if (hasNextPage) fetchNextPage()
        },
    }
    
    
  return (
    <ComboBox
        allowsEmptyCollection
        inputValue={search}
        onInputChange={setSearch}
    >
        <Label>Wilayah</Label>
        <ComboBox.InputGroup>
            <Input placeholder='Search...' />
            <ComboBox.Trigger />
        </ComboBox.InputGroup>
        <ComboBox.Popover>
            <ListBox 
                renderEmptyState={() => {<EmptyState />}}
            >
                <Collection items={list.items}>
                    {(item) => {
                        return (
                            <ListBox.Item id={item.id} textValue={item.name}>
                                { item.name }
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
  )
}

export default WilayahComboBox