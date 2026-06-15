import CasbonItem from "./CasbonItem"

const CasbonList = ({data=[]}) => {
  return (
    <div className="space-y-3">
        {
            data.map(i => {
                return (
                    <CasbonItem item={i} key={i.id} />

                )
            })
        }

    </div>
  )
}

export default CasbonList