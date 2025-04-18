import PurchasedTable from "../components/purchased/PurchasedItemsTable"

const Purchased = () => {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between gap-4">
          <h1 className="text-3xl font-bold text-[#7F37D8]"> Purchased </h1>
      </div>
      <div className="flex justify-between gap-4">
        <PurchasedTable />  
      </div>
    </section>
  )
}

export default Purchased