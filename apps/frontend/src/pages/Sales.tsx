import SalesTable from "../components/sales/SalesTable"

const Sales = () => {
  return (
    <section className="flex flex-col gap-4 pb-16">
        <div className="flex justify-between gap-4">
            <h1 className="text-3xl font-bold text-[#7F37D8]">Sales</h1>
        </div>
        <div className="flex justify-between gap-4">
          <SalesTable />
        </div>
    </section>
  )
}

export default Sales