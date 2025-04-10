const Error = ({ error }: { error: string }) => {
  return (
    <div className="w-full h-[calc(100vh-350px)] flex justify-center items-center">
        <div className="bg-white pb-8 w-1/2 rounded-3xl">
            <h2 className="text-3xl font-semibold text-[#7F37D8] py-8 border-b px-6 border-gray-200 mb-2">Error</h2>
            <p className="text-gray-600 px-6 py-4">{error}</p>
        </div>
    </div>
  )
}

export default Error