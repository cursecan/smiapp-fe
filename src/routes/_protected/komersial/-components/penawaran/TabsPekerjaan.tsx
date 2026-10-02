import { Tabs } from "@heroui/react"

const TabsPekerjaan = () => {
  return (
    <Tabs>
      <Tabs.ListContainer>
        <Tabs.List>
          <Tabs.Tab id={'default'}>
            Default
          </Tabs.Tab>

        </Tabs.List>
      </Tabs.ListContainer>

      <Tabs.Panel id={'default'}>
        <div className="">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque nostrum, voluptatum nemo commodi sit veritatis culpa voluptate quod ipsa quos esse quas molestias, labore, autem sapiente enim nam sunt sequi.
        </div>
      </Tabs.Panel>
    </Tabs>
  )
}

export default TabsPekerjaan