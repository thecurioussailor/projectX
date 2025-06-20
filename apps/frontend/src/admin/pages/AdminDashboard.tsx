import Card from "../components/ui/Card"
import { useDashboard } from "../hooks/useDashboard";
const AdminDashboard = () => {
  const { users, finance, subscriptions, products, verification, telegram } = useDashboard();
  return (
    <section className="flex flex-col gap-8">
        <div className="flex justify-between gap-4">
            <h1 className="text-3xl font-bold text-[#7F37D8]">Admin Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center gap-4">
          <Card text="Users" number={users.totalUsers} gradient="bg-gradient-to-r from-purple-500 to-pink-500"/>
          <Card text="Payouts" number={finance.totalWithdrawalRequests} gradient="bg-gradient-to-r from-violet-500 to-fuchsia-500"/>
          <Card text="Digital Products" number={products.totalDigitalProducts} gradient="bg-gradient-to-r from-green-400 to-teal-500"/>
          <Card text="Payouts Pending" number={finance.pendingWithdrawals} gradient="bg-gradient-to-r from-orange-400 to-red-500"/>
          <Card text="Plans Purchased" number={subscriptions.totalPlatformSubscriptionPlans} gradient="bg-gradient-to-r from-pink-400 to-yellow-400"/>
          <Card text="KYC Pending" number={verification.totalKYCDocuments} gradient="bg-gradient-to-r from-indigo-500 to-purple-500"/>
          <Card text="Telegram" number={telegram.totalTelegramSubscriptions} gradient="bg-gradient-to-r from-emerald-400 to-cyan-400"/>
        </div>
    </section>
  )
}

export default AdminDashboard