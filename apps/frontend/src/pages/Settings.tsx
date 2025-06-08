import PlatformSubscription from "../components/settings/PlatformSubscription"
import Kyc from "../components/settings/Kyc"
import UpdatePassword from "../components/settings/UpdatePassword"
import PaymentMethod from "../components/settings/PaymentMethod"
const Settings = () => {
  return (
    <section className="flex flex-col gap-4 pb-20">
        <div className="flex justify-between gap-4">
            <h1 className="text-3xl font-bold text-[#7F37D8]">Settings</h1>
        </div>
        <div className="flex flex-col gap-4">
          <PlatformSubscription/>
          <Kyc/>
          <UpdatePassword/>
          <PaymentMethod/>
        </div>
    </section>
  )
}

export default Settings