import PayoutRequestsTable from "../components/payouts/PayoutRequestsTable"

const AdminPayoutManagement = () => {
  return (
    <section className="flex flex-col gap-8">
    <div className="flex justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#7F37D8]">Payout Management</h1>
    </div>
    <div>
      <PayoutRequestsTable />
    </div>
</section>
  )
}

export default AdminPayoutManagement