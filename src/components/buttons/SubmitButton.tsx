import { Button, Spinner } from "@heroui/react"


const SubmitButton = ({
    icon,
    label='Submit',
    isLoading=false,
    isDisabled=false,
    onPress=()=>{},
    ...props
}) => {

  return (
    <Button onPress={onPress} isDisabled={isLoading || isDisabled} {...props}>
        { icon && icon}
        {
            isLoading && (
                <div className="flex items-center  gap-2">
                    <Spinner color="current" /> Loading
                </div>
            )
        }
        { !isLoading && label }
    </Button>
  )
}

export default SubmitButton