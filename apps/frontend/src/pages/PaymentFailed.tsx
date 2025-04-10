import { Link, useSearchParams } from 'react-router-dom';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const errorMessage = searchParams.get('error') || 'Your payment could not be processed. Please try again.';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Payment Failed</h1>
        <p className="text-gray-600 text-center mb-6">{errorMessage}</p>
        
        {orderId && (
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Order ID:</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Status:</span>
              <span className="font-medium text-red-500">Failed</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
          <Link to="/" className="bg-gray-200 text-gray-800 py-2 px-6 rounded-full hover:bg-gray-300 text-center">
            Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()} 
            className="bg-[#7F37D8] text-white py-2 px-6 rounded-full hover:bg-[#6C2EB9] text-center"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;