import { Card, Description, Label, Radio, RadioGroup } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useJenisPekerjaanService } from '../../services/masterdata/jenisPekerjaanService'

const PengadaanBarangRadio = () => {
    const {data, isLoading} = useQuery({
        queryKey: ['jenis-pekerjaan-list-radio'],
        queryFn: async () => {
            return useJenisPekerjaanService.list()
        },
        select: (data) => data.data
    })

    if (isLoading) {
        return <div className="">Loading...</div>
    }


  return (
      <>
        <RadioGroup isRequired defaultValue={data?.results[0].id} name='pekerjaan'>
            <Label>Jenis Pekerjaan</Label>
            {/* <Description>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, ab!
            </Description> */}
                
            {
                data?.results.map(i => {
                    return (
                        <Radio value={i.id} key={i.id}>
                            <Radio.Control>
                                <Radio.Indicator />
                            </Radio.Control>
                            <Radio.Content>
                                <Label>{i.jenis_pekerjaan}</Label>
                                {
                                    i.deskripsi && <Description>{i.deskripsi}</Description>
                                }
                            </Radio.Content>
                        </Radio>
                    )
                })
            }
        </RadioGroup>
    </>
  )
}

export default PengadaanBarangRadio