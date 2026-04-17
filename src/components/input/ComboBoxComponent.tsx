import { Label, ComboBox, Input, ListBox, EmptyState, Collection, ListBoxLoadMoreItem, Spinner, Avatar, Description } from '@heroui/react'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'

const ComboBoxComponent = ({label, onChangeTextValue=()=>{}, items=[], fetchNextPage=()=>{}, onChange=()=>{}, hasNextPage, isFetchingNextPage, isLoading, ...props}) => {
    const [search, setSearch] = useState('')
    const [debouncedFilter] = useDebounce(search, 600)

    const changeSearcInput = (e) => {
        setSearch(e)
        onChangeTextValue(debouncedFilter)
    }

    const list = {
        items,
        loadingState: isFetchingNextPage ? 'loadingMore' : 'idle',
        loadMore: () => {
            if (hasNextPage) fetchNextPage()
        },
    }

  return (
    <ComboBox
        // isReadOnly={readOnly}
        allowsEmptyCollection
        inputValue={search}
        onInputChange={changeSearcInput}
        fullWidth
        onSelectionChange={onChange}
        selectedKey={props.value?.id}
    >
        <Label>{label}</Label>
        <ComboBox.InputGroup>
            <Input placeholder='Search...' />
            <ComboBox.Trigger />
        </ComboBox.InputGroup>
        <ComboBox.Popover className={'w-100'}>
            <ListBox
                className=''
                renderEmptyState={() => {<EmptyState />}}
            >
                <Collection items={items}>
                    {(item) => {
                        return (
                            <ListBox.Item id={item.id} textValue={item.name}>
                                <div className="flex flex-col flex-1">
                                    <Label>{item.name}</Label>
                                    <Description>Lorem, ipsum dolor.</Description>
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
  )
}

export default ComboBoxComponent