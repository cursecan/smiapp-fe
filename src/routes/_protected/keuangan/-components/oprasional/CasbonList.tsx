import { Table } from "@heroui/react"
import CasbonItem from "./CasbonItem"

const CasbonList = ({data=[]}) => {
  return (
    <Table>
        <Table.ScrollContainer>
            <Table.Content>
                <Table.Header>
                    <Table.Column isRowHeader>
                        Casbon
                    </Table.Column>
                    <Table.Column className={'w-0 truncate'}>
                        Nominal
                    </Table.Column>
                    <Table.Column className={'w-0 truncate'}>
                        Status
                    </Table.Column>
                    <Table.Column className={'w-0 truncate'}></Table.Column>
                </Table.Header>
                <Table.Body>
                    {
                        data.map(i => {
                            return (
                                <CasbonItem item={i} key={i.id} />

                            )
                        })
                    }
                </Table.Body>
            </Table.Content>
        </Table.ScrollContainer>
    </Table>
  )
}

export default CasbonList