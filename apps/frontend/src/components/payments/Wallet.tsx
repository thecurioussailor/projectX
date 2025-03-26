import MoneyCard from "./MoneyCard"

const Wallet = () => {
  return (
    <div className="flex justify-between gap-4 bg-white rounded-3xl w-full shadow-lg">
            <div className="flex flex-col w-full">
                <div className="flex flex-col px-8 py-8">
                    <h1 className="text-xl font-semibold">Wallet</h1>
                </div>

                
                <div className="flex flex-wrap gap-12 py-8 px-8 border-t border-gray-200">
                    <MoneyCard amount="100" gradient="bg-gradient-to-r from-blue-500 to-purple-500" />
                    <MoneyCard amount="100" gradient="bg-gradient-to-r from-blue-500 to-purple-500" />
                    <MoneyCard amount="100" gradient="bg-gradient-to-r from-blue-500 to-purple-500" />
                </div>
                
            </div>
        </div>
  )
}

export default Wallet