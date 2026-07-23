import { Button, Spinner } from "@heroui/react"


const SubmitButton = ({
    icon=null,
    label='Submit',
    isLoading=false,
    isDisabled=false,
    loadingText='Loading',
    onPress=()=>{},
    ...props
}) => {

  return (
    <Button onPress={onPress} isDisabled={isLoading || isDisabled} {...props}>
        { icon && icon}
        {
            isLoading && (
                <div className="flex items-center  gap-2">
                    <Spinner color="current" /> {loadingText}
                </div>
            )
        }
        { !isLoading && label }
    </Button>
  )
}

export default SubmitButton