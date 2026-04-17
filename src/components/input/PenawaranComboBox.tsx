

import ComboBoxComponent from './ComboBoxComponent'
import { usePenawaranService } from '../../services/penawaran.service'
import { useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'

const PenawaranComboBox = ({value, onChange=()=>{}}) => {
    const [search, setSearch] = useState('')
    const onChangeTextValue = (e) => {
        setSearch(e)
    }

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['wilayah-list-combox', search],
        queryFn: async ({pageParam, queryKey}) => usePenawaranService.getList({pageParam, queryKey}),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            
            if (!lastPage.data.next) return undefined

            const url = new URL(lastPage.data.next)
            return Number(url.searchParams.get('page'))
        }
    })
    
    const items = (data?.pages.flatMap(page => page.data.results) || []).map(i => ({...i, name: i.nama_project}))


  return (
    <ComboBoxComponent
        label={'Surat Penawaran'}
        items={items}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
        onChangeTextValue={onChangeTextValue}
        value={value}
        onChange={onChange}
    />
  )
}

export default PenawaranComboBox