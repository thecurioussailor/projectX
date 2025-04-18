import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTelegramStore } from '../store/useTelegramStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Extended interface for the full order details returned by the API
interface ExtendedOrderDetails {
  id: string;
  userId: number;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  orderId: string;
  telegramPlan?: {
    name: string;
    duration: number;
    channel?: {
      channelName: string;
    };
  };
  digitalProduct?: {
    title: string;
    description: string;
  };
  transaction?: {
    status: string;
  };
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { getOrderStatus, isLoading } = useTelegramStore();
  const [orderDetails, setOrderDetails] = useState<ExtendedOrderDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderId = searchParams.get('orderId');
        if (!orderId) {
          setError('Order ID not found');
          return;
        }

        const response = await getOrderStatus(orderId);
        // API returns data inside a data property
        setOrderDetails(response as unknown as ExtendedOrderDetails);
      } catch (err) {
        console.error('Failed to fetch order details:', err);
        setError('Failed to fetch order details');
      }
    };

    fetchOrderDetails();
  }, [searchParams, getOrderStatus]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/dashboard" className="bg-[#7F37D8] text-white py-2 px-6 rounded-full hover:bg-[#6C2EB9] inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 text-center mb-6">Your subscription has been activated successfully.</p>
        
        {orderDetails && (
          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Order ID:</span>
              <span className="font-medium">{orderDetails.id}</span>
            </div>
            
            {orderDetails.telegramPlan && (
              <>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Channel:</span>
                  <span className="font-medium">{orderDetails.telegramPlan.channel?.channelName || 'N/A'}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Plan:</span>
                  <span className="font-medium">{orderDetails.telegramPlan.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{orderDetails.telegramPlan.duration} days</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Amount:</span>
              <span className="font-medium">₹{Number(orderDetails.amount).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Status:</span>
              <span className="font-medium text-green-500">{orderDetails.status}</span>
            </div>
          </div>
        )}
        
        <div className="flex justify-center">
          <Link to="/purchased" className="bg-[#7F37D8] text-white py-2 px-6 rounded-full hover:bg-[#6C2EB9] inline-block">
            Go to Purchases
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;