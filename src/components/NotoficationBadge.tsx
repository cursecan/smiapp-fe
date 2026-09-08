import { Bell, Dots9, FloppyDisk } from "@gravity-ui/icons"
import { Avatar, Badge, Button, Disclosure, Popover, Surface } from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import { useNotificationService } from "../services/notification/notificationService"
import { useMemo } from "react"
import { Link as LinkHero } from "@heroui/react"
import { Link } from "@tanstack/react-router"
import { useAuth } from "../auth/AuthProvider"



const DiscloseNotif = ({header='Preview HeroUI Native', data=[]}) => {
    return (
        <Disclosure>
            <Disclosure.Heading>
                <Button slot="trigger" variant="secondary">
                    {/* <QrCode /> */}
                    { header } ({data.length})
                    <Disclosure.Indicator />
                </Button>
            </Disclosure.Heading>
            <Disclosure.Content>
                <Disclosure.Body className="shadow-panel flex flex-col gap-2 max-h-64 overflow-auto">
                    {
                        data.map((i, index) => (
                            <Link className="link text-gray-600" to={i.path} key={i.id}>
                                <p>{i.active_approval.name} - {i.description}</p>
                                <LinkHero.Icon />
                            </Link>
                        ))
                    }
                </Disclosure.Body>
            </Disclosure.Content>
        </Disclosure>
    )
}



const NotoficationBadge = () => {
    const { user } = useAuth()
    const {data} = useQuery({
        queryKey: ['notification'],
        queryFn: ()  => useNotificationService.list(),
        select: (res) => res.data.results,
        refetchInterval: 10000,
        refetchIntervalInBackground: true,
    })


    const notifData = useMemo(() => {
        const grouped = data?.reduce((result, item) => {
            const key = item.title

            if (!result[key]) {
                result[key] = []
            }

            result[key].push(item)

            return result
        }, {})

        return grouped
    })

    
    

  return (
    <Popover>
        <Badge.Anchor>
            <Button isDisabled={data?.length === 0} isIconOnly variant={data?.length === 0 ? 'ghost' : 'primary'}>
                <Bell />
            </Button>
            {
                data?.length != 0 && (
                    <Badge color="danger" size="sm">
                        {data?.length}
                    </Badge>
                )
            }
        </Badge.Anchor>
        <Popover.Content placement="right" className="max-w-90 w-full">
            <Popover.Dialog>
                <Popover.Arrow />
                <Popover.Heading>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                        <Avatar size="md">
                            <Avatar.Image
                            alt=""
                            src="https://img.heroui.chat/image/avatar?w=400&h=400&u=1"
                            />
                            <Avatar.Fallback>SJ</Avatar.Fallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{ user.full_name }</p>
                            <p className="text-sm text-muted">@{user.username}</p>
                        </div>
                        </div>
                    </div>
                </Popover.Heading>
                <div className="mt-3 space-y-4">
                    { 
                        notifData && Object.entries(notifData).map(([group, items]) => {
                            return (
                                <DiscloseNotif key={group} header={group} data={items} />
                            )
                        })
                    }
                </div>

                {/* <div className="flex flex-col gap-4">
                    { 
                        notifData && Object.entries(notifData).map(([group, items]) => {
                            return (
                                <div className="" key={group}>
                                    <Popover.Heading>{group} ({items.length})</Popover.Heading>
                                    <div className="flex flex-col">
                                        {
                                            items.map(i => (
                                                <Link to={i.path} key={i.id}>
                                                    <Surface className="rounded-lg p-2 hover:bg-muted/5">
                                                        <div className="text-xs text-accent">{i.active_approval.name}</div>
                                                        <div className="text-sm text-muted">{i.description}</div>
                                                    </Surface>
                                                </Link>
                                            ))
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div> */}
            </Popover.Dialog>
        </Popover.Content>
    </Popover>
  )
}

export default NotoficationBadge