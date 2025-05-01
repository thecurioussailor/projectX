import Card from "../components/ui/Card"

const AdminDashboard = () => {
  return (
    <section className="flex flex-col gap-8">
        <div className="flex justify-between gap-4">
            <h1 className="text-3xl font-bold text-[#7F37D8]">Admin Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center gap-4">
          <Card text="Revenue" number={100} gradient="bg-gradient-to-r from-blue-500 to-purple-500"/>
          <Card text="Users" number={100} gradient="bg-gradient-to-r from-blue-500 to-purple-500"/>
          <Card text="Total Sales" number={100} gradient="bg-gradient-to-r from-blue-500 to-purple-500"/>
          <Card text="Payouts Pending" number={100} gradient="bg-gradient-to-r from-blue-500 to-purple-500"/>
          <Card text="Plans Purchased" number={100} gradient="bg-gradient-to-r from-blue-500 to-purple-500"/>
          <Card text="Support Tickets" number={100} gradient="bg-gradient-to-r from-blue-500 to-purple-500"/>
        </div>
    </section>
  )
}

export default AdminDashboard