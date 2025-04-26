import KycDocumentsTable from "../components/kyc/KycDocumentsTable"

const AdminKyc = () => {
  return (
    <section className="flex flex-col gap-8">
    <div className="flex justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#7F37D8]">KYC Documents</h1>
    </div>
    <div>
      <KycDocumentsTable />
    </div>
</section>
  )
}

export default AdminKyc