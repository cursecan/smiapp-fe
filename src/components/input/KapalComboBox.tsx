import { Label, ComboBox, Input, ListBox, EmptyState, Collection, ListBoxLoadMoreItem, Spinner } from '@heroui/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useKapalService } from '../../services/masterdata/kapalService'

const KapalComboBox = ({onSelectionChange, readOnly=false}) => {
    const [search, setSearch] = useState('')
    const [debouncedFilter] = useDebounce(search, 600)
    

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['kapal-list-combox', debouncedFilter],
        queryFn: async ({pageParam, queryKey}) => useKapalService.list({pageParam, queryKey}),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (!lastPage.data.next) return undefined

            const url = new URL(lastPage.data.next)
            return Number(url.searchParams.get('page'))
        }
    })
    
    const items = (data?.pages.flatMap(page => page.data.results) || []).map(i => ({...i, name: i.nama_kapal}))
    const list = {
        items,
        loadingState: isFetchingNextPage ? 'loadingMore' : 'idle',
        loadMore: () => {
            if (hasNextPage) fetchNextPage()
        },
    }
    
    
    
  return (
    
    <ComboBox
        isReadOnly={readOnly}
        onSelectionChange={onSelectionChange}
        allowsEmptyCollection
        inputValue={search}
        onInputChange={setSearch}
    >
        <Label>Kapal</Label>
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

export default KapalComboBox