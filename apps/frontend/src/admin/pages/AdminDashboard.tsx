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
          <Card text="Users" number={users.totalUsers} gradient="bg-gradient-to-r from-blue-500 to-purple-500"/>
          <Card text="Payouts" number={finance.totalWithdrawalRequests} gradient="bg-gradient-to-r from-blue-500 to-purple-500"/>
          <Card text="Digital Products" number={products.totalDigitalProducts} gradient="bg-gradient-to-r from-blue-500 to-purple-500"/>
          <Card text="Payouts Pending" number={finance.pendingWithdrawals} gradient="bg-gradient-to-r from-blue-500 to-purple-500"/>
          <Card text="Plans Purchased" number={subscriptions.totalPlatformSubscriptionPlans} gradient="bg-gradient-to-r from-blue-500 to-purple-500"/>
          <Card text="KYC Pending" number={verification.totalKYCDocuments} gradient="bg-gradient-to-r from-blue-500 to-purple-500"/>
          <Card text="Telegram" number={telegram.totalTelegramSubscriptions} gradient="bg-gradient-to-r from-blue-500 to-purple-500"/>
        </div>
    </section>
  )
}

export default AdminDashboard