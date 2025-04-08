import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTelegramStore } from '../store/useTelegramStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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
  const { fetchPublicChannelBySlug, isLoading, error, subscribeToPlan } = useTelegramStore();
  const [channel, setChannel] = useState<PublicChannel | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const navigate = useNavigate();

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
    if (channel?.id) {
      subscribeToPlan(channel.id, selectedPlan);
      navigate('/purchased');
    } else {
      console.error("Channel ID is undefined");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner/>
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
    <div className="bg-gray-50 w-full">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col gap-6 bg-white p-6 rounded-3xl shadow-sm">
            <header className="p-6 border-b border-gray-200">
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
                      className={`p-4 border rounded-3xl cursor-pointer transition-all ${
                        selectedPlan === plan.id ? 'border-purple-200 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
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
            
            <div className="bg-white p-6">
              <h2 className="text-xl font-semibold mb-4">Disclaimer</h2>
              <p className="text-gray-600">
                This disclaimer outlines that POLMI SOFTWARE SERVICES TECHNOLOGIES PRIVATE LIMITED, as an organization, shall not be held accountable for any content or materials disseminated by a content creator on or via any app or website affiliated with us. By utilizing our services, you acknowledge and agree to the terms set forth in this disclaimer. Learn more.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-purple-50">
              <h1 className="text-xl font-semibold mb-4 py-8">Frequently Asked Questions</h1>
              <Accordion title="Can I receive a refund for my subscription?" content="There would not be any refunds for the subscription service. Subscribers should carefully consider their needs and goals before subscribing, and understand that the creator is not responsible for any gains or losses." />
              <Accordion title="I have made the payment but it's not reflecting?" content="Please contact the customer support team with payment & contact details on support@projectx.vercel.in"/>
              <Accordion title="How I will get confirmation I have been added to the telegram subscription?" content="You will receive a confirmation message on your telegram account after the payment is made." />
              <Accordion title="Which mobile number will be added to telegram?" content="You will Join Now button arfter the payment, make sure you have logged in to proper telegram account before join. selected account will be telgram account." />
            </div>
            <div className="mt-4 text-sm px-6 py-4 border-t border-gray-200 text-gray-500">
              <p>Channel created on: {new Date(channel.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicChannelPage; 

const Accordion = ({title, content}: {title: string, content: string}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4">
      <h2 className="bg-[#7F37D8] rounded-t-3xl text-sm text-white font-semibold px-8 py-4">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          type="button" 
          className="flex items-center justify-between w-full">
          {title}
        </button>
      </h2>
      {isOpen && (
        <div className="py-6 text-sm px-8 rounded-b-3xl transition-all duration-300 ease-in-out bg-white">
          {content}
        </div>
      )}
    </div>
  )
}
