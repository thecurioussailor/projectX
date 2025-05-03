import UpdatePassword from "../components/settings/UpdatePassword"

const AdminSettings = () => {
  return (
    <section className="flex flex-col gap-8">
    <div className="flex justify-between gap-4">
      <h1 className="text-3xl font-bold text-[#7F37D8]">Settings</h1>
    </div>
    <div className="">
      <UpdatePassword />
    </div>
</section>
  )
}

export default AdminSettings