import { Bell, Dots9, FloppyDisk } from "@gravity-ui/icons"
import { Badge, Button, Popover, Surface } from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import { useNotificationService } from "../services/notification/notificationService"
import { useMemo } from "react"
import { Link as LinkHero } from "@heroui/react"
import { Link } from "@tanstack/react-router"

const NotoficationBadge = () => {
    const {data} = useQuery({
        queryKey: ['notification'],
        queryFn: ()  => useNotificationService.list(),
        select: (res) => res.data.results,
        refetchInterval: 10000,
        refetchIntervalInBackground: true,
    })

    console.log(data);

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

    console.log(notifData);
    
    

  return (
    <Popover>
        <Badge.Anchor>
            <Button isIconOnly variant={data?.length === 0 ? 'ghost' : 'secondary'}>
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
        <Popover.Content placement="right" className="max-w-64">
            <Popover.Dialog>
                <Popover.Arrow />
                <div className="flex flex-col gap-4">
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
                </div>
            </Popover.Dialog>
        </Popover.Content>
    </Popover>
  )
}

export default NotoficationBadge