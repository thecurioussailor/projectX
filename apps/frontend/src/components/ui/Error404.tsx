import { TfiFaceSad } from "react-icons/tfi"
import { Link } from "react-router-dom"

const Error404 = ({error}: {error: string}) => {
  return (
    <div className="h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="w-1/2 flex flex-col gap-8 text-[#7F37D8] items-center justify-center p-6">
            <TfiFaceSad size={100} />
            <h1 className="text-9xl font-bold">404</h1>
            <p className="text-gray-600">{error}</p>
            <Link to="/" className="mt-4 inline-block bg-[#7F37D8] text-white px-4 py-2 rounded-lg">
                Return to Home
            </Link>
        </div>
    </div>
  )
}

export default Error404