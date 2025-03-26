import DigitalProductTable from "../components/digitalProducts/DigitalProductTable"

const DigitalProduct = () => {
  return (
    <section className="flex flex-col gap-6">
        <div className="flex justify-between gap-4">
            <h1 className="text-3xl font-bold text-[#7F37D8]">Digital Product</h1>
        </div>
        <div className="flex justify-between gap-4 w-full">
          <DigitalProductTable />
        </div>
    </section>
  )
}

export default DigitalProduct