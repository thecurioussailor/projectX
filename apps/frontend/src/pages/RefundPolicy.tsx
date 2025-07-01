import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiXCircle, FiMail, FiAlertTriangle, FiSettings } from 'react-icons/fi';
import logo from '../assets/images/tinywalletLogo.png';
import Footer from '../components/landing/Footer';

const RefundPolicy = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="overflow-auto" style={{ height: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/">
                  <img src={logo} alt="TinyWallet" className="w-48" />
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-[#7F37D8] hover:bg-[#6c2eb9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7F37D8]"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/signin"
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-[#7F37D8] hover:bg-[#6c2eb9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7F37D8]"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            🔁 Refund <span className="text-[#7F37D8]">Policy</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Understanding our subscription and refund terms
          </p>
        </div>

        {/* Subscription Renewal Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FiAlertTriangle className="h-5 w-5 text-blue-400 mt-1" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-blue-800">Automatic Renewal</h3>
              <p className="text-blue-700 mt-2">
                By purchasing any paid plan or subscription, you agree that your subscription will automatically renew at the end of each billing cycle unless cancelled by you.
              </p>
            </div>
          </div>
        </div>

        {/* No Refunds Section */}
        <div className="mb-12">
          <div className="bg-red-50 rounded-lg p-8 border-2 border-red-200">
            <div className="flex items-center mb-6">
              <FiXCircle className="h-8 w-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-bold text-red-800">❌ No Refunds Will Be Provided</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p>Once a subscription is cancelled, you will continue to have access to the service until the end of your current billing cycle, but <strong>no refund will be issued</strong> for the remaining period.</p>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p>If you do not use the service after subscribing, you are <strong>still not eligible</strong> for any refund.</p>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p>Partial use or mid-cycle cancellation of the subscription <strong>does not qualify</strong> for a refund.</p>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p>If you delete your account, any remaining subscription time or services will be <strong>forfeited</strong>. No refund will be issued in such cases.</p>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p>Convenience fees, platform charges, or maintenance fees (if applicable) are <strong>non-refundable</strong> once paid.</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Cancel Section */}
        <div className="mb-12">
          <div className="bg-purple-50 rounded-lg p-8">
            <div className="flex items-center mb-6">
              <FiSettings className="h-8 w-8 text-[#7F37D8] mr-3" />
              <h2 className="text-2xl font-bold text-[#7F37D8]">📩 How to Cancel</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start">
                <span className="w-2 h-2 bg-[#7F37D8] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p>You may cancel the subscription through your account settings.</p>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-[#7F37D8] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p>If you subscribed through a third-party platform (e.g., Apple App Store or Google Play), cancellation must be done through that respective platform.</p>
              </div>
              <div className="flex items-start">
                <span className="w-2 h-2 bg-[#7F37D8] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <p>You may also email a cancellation request to <a href="mailto:tinywallet.in@gmail.com" className="text-[#7F37D8] underline font-medium">tinywallet.in@gmail.com</a>.</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-yellow-800 font-semibold">
                <strong>Note:</strong> Cancellation becomes effective only at the end of your current billing period.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="mb-12">
          <div className="bg-orange-50 rounded-lg p-8 border border-orange-200">
            <div className="flex items-center mb-4">
              <FiAlertTriangle className="h-6 w-6 text-orange-500 mr-3" />
              <h2 className="text-xl font-bold text-orange-800">⚠️ Important</h2>
            </div>
            <p className="text-gray-700">
              We do not collect fees or payments from end users except those paid to you (the service provider), and therefore, we do not process refunds on behalf of end users.
            </p>
          </div>
        </div>

        {/* Modifications Section */}
        <div className="mb-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🛠️ Modifications</h2>
            <p className="text-gray-700">
              We reserve the right to update or modify this Refund Policy at any time. Continued use of the service after any such changes implies your acceptance of the updated terms.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-[#7F37D8] rounded-lg p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <FiMail className="h-8 w-8 text-white mr-3" />
            <h2 className="text-2xl font-bold text-white">Need Help?</h2>
          </div>
          <p className="text-purple-100 mb-6">
            If you have any questions about our refund policy or need assistance with cancellation:
          </p>
          <a
            href="mailto:tinywallet.in@gmail.com"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[#7F37D8] bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <FiMail className="mr-2" />
            tinywallet.in@gmail.com
          </a>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default RefundPolicy;