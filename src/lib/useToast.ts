import { toast } from "@heroui/react";


export const useToast = () => {
    const success = ({message, description=''}) => {
        toast.success(message, {
            description: description,
            actionProps: {
                children: "Success",
                className: "bg-success text-success-foreground",
                onPress: () =>{},
            },
        })
    }

    const danger = ({message, description=''}) => {
        toast.danger(message, {
            description: description,
            actionProps: {
                children: "Back",
                className: "bg-danger text-danger-foreground",
                onPress: () =>{},
            }
        })
    }

    return {
        success, danger
    }
}