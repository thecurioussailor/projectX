import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTelegramStore } from '../store/useTelegramStore';

interface PublicPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface PublicChannel {
  id: string;
  channelName: string;
  channelDescription: string;
  createdAt: string;
  plans: PublicPlan[];
}

const PublicChannelPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { fetchPublicChannelBySlug, isLoading, error } = useTelegramStore();
  const [channel, setChannel] = useState<PublicChannel | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    const loadChannel = async () => {
      try {
        if (slug) {
          const channelData = await fetchPublicChannelBySlug(slug);
          setChannel(channelData);
          if (channelData.plans.length > 0) {
            setSelectedPlan(channelData.plans[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load channel:", err);
      }
    };

    loadChannel();
  }, [slug, fetchPublicChannelBySlug]);

  const handleSubscribe = () => {
    if (!selectedPlan) return;
    
    // Here you would implement the payment logic
    // This could redirect to a payment gateway or show a payment form
    console.log(`Subscribe to plan: ${selectedPlan}`);
    
    // For now, we'll just alert
    alert(`Subscription request for plan: ${selectedPlan}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7F37D8]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-lg text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Link to="/" className="mt-4 inline-block bg-[#7F37D8] text-white px-4 py-2 rounded-lg">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 p-6 rounded-lg max-w-lg text-center">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">Channel Not Found</h2>
          <p className="text-yellow-600">The channel you're looking for doesn't exist or isn't published yet.</p>
          <Link to="/" className="mt-4 inline-block bg-[#7F37D8] text-white px-4 py-2 rounded-lg">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <header className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">{channel.channelName}</h1>
            <Link to="/" className="text-[#7F37D8] hover:underline">projectX</Link>
          </div>
          <p className="mt-2 text-gray-600">{channel.channelDescription}</p>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4">Subscription Plans</h2>
          
          {channel.plans.length === 0 ? (
            <p className="text-gray-500">No subscription plans available at the moment.</p>
          ) : (
            <div className="space-y-4">
              {channel.plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPlan === plan.id ? 'border-[#7F37D8] bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{plan.name}</h3>
                      <p className="text-gray-600">{plan.duration} days access</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${plan.price}</p>
                      <input
                        type="radio"
                        name="plan"
                        checked={selectedPlan === plan.id}
                        onChange={() => setSelectedPlan(plan.id)}
                        className="ml-2"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleSubscribe}
                  disabled={!selectedPlan}
                  className="bg-[#7F37D8] text-white py-2 px-8 rounded-full hover:bg-[#6C2EB9] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">About This Channel</h2>
          <p className="text-gray-600">
            This channel offers exclusive content and benefits to subscribers.
            Join now to gain access to premium content and updates.
          </p>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Channel created on: {new Date(channel.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicChannelPage; 