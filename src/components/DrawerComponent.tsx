import { Button, Drawer } from "@heroui/react"

const DrawerComponent = ({children, buttonTrigger, footerButtons, heading, state, hideHeader=false, hideFooter=false}) => {
  return (
    <Drawer>
        { buttonTrigger && buttonTrigger }
        <Drawer.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
            <Drawer.Content placement="right">
                <Drawer.Dialog className="w-4xl">
                    {
                        !hideHeader && (
                            <Drawer.Header>
                                <Drawer.Heading>{heading || 'Heading'}</Drawer.Heading>
                            </Drawer.Header>
                        )
                    }
                    <Drawer.Body>
                        { children }
                    </Drawer.Body>
                    { 
                        !hideFooter && (
                            <Drawer.Footer>
                                { footerButtons && footerButtons}
                            </Drawer.Footer>

                        )
                    }
                </Drawer.Dialog>
            </Drawer.Content>
        </Drawer.Backdrop>
    </Drawer>
  )
}

export default DrawerComponent