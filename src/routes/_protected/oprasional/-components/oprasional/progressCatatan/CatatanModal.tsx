import { Button, Description, Label, Surface, Table, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../../../components/modals/ModalComponent"
import { CodePullRequestCheck } from "@gravity-ui/icons"
import { useFormatDate } from "../../../../../../utils/dateFormat"

const CatatanModal = ({catatan=[]}) => {
    const state = useOverlayState()

  return (
    <ModalComponent
        size={'lg'}
        state={state}
        buttonTrigger={
            <Button isDisabled={catatan.length===0} onPress={state.setOpen} isIconOnly size="sm" variant="tertiary">
                <CodePullRequestCheck />
            </Button>
        }
        heading={'Progress'}
    >
        <Surface className="space-y-6 flex flex-col">
            <Description>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, consectetur.
            </Description>
            <Table>
                <Table.ScrollContainer>
                    <Table.Content>
                        <Table.Header>
                            <Table.Column isRowHeader>
                                Catatan
                            </Table.Column>
                            <Table.Column isRowHeader>
                                Progress
                            </Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {
                                catatan.map(i => {
                                    return (
                                        <Table.Row key={i.id}>
                                            <Table.Cell className={'flex flex-col'}>
                                                <Description>{ useFormatDate(i.create_at)}</Description>
                                                <Label>{i.keterangan}</Label>
                                            </Table.Cell>
                                            <Table.Cell>{i.progress}%</Table.Cell>
                                        </Table.Row>
                                    )
                                })
                            }
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        </Surface>
    </ModalComponent>
  )
}

export default CatatanModal