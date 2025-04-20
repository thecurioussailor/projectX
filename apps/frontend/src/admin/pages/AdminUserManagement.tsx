import UsersTable from "../components/userMnt/UsersTable"

const AdminUserManagement = () => {
  return (
    <section className="flex flex-col gap-8">
    <div className="flex justify-between gap-4">
        <h1 className="text-3xl font-bold text-[#7F37D8]">User Management</h1>
    </div>
    <div className="">
      <UsersTable />
    </div>
</section>
  )
}

export default AdminUserManagement