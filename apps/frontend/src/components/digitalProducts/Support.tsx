const Support = () => {
  return (
    <div>
        <div>
            <h1 className="text-2xl font-bold">Support</h1>
        </div>
        <div>
            <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" className="w-full py-1 px-2 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" id="phone" className="w-full py-1 px-2 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="whatsapp">Whatsapp</label>
                    <input type="tel" id="whatsapp" className="w-full py-1 px-2 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="telegram">Telegram</label>
                    <input
                        type="url"
                        id="telegram"
                        placeholder="https://t.me/username"
                        className="w-full py-1 px-2 border border-gray-300 outline-none rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
                        required
                    />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Support