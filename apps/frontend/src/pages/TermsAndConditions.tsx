import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiFileText, FiMail, FiShield, FiDollarSign, FiUsers, FiAlertCircle } from 'react-icons/fi';
import logo from '../assets/images/tinywalletLogo.png';

const TermsAndConditions = () => {
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Terms and <span className="text-[#7F37D8]">Conditions</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Last updated: April 23, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-purple-50 rounded-lg p-8 mb-8">
          <div className="flex items-start">
            <FiFileText className="h-6 w-6 text-[#7F37D8] mt-1 mr-3 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-[#7F37D8] mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Tinywallet ("Company", "we", "our", "us")! These Terms of Service ("Terms", "Terms of Service") govern your use of our website located at{" "}
                <a href="https://www.tinywallet.in" className="text-[#7F37D8] underline">https://www.tinywallet.in</a>{" "}
                (together or individually "Service") operated by Tinywallet.
              </p>
              <p className="text-gray-700">
                Your agreement with us includes these Terms and our Privacy Policy ("Agreements"). You acknowledge that you have read and understood Agreements, and agree to be bound by them.
              </p>
            </div>
          </div>
        </div>

        {/* Key Sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <FiMail className="h-8 w-8 text-[#7F37D8] mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Communications</h3>
            <p className="text-gray-600 text-sm">You may opt out of receiving marketing communications by emailing us or using unsubscribe links.</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <FiDollarSign className="h-8 w-8 text-[#7F37D8] mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Purchases</h3>
            <p className="text-gray-600 text-sm">Payment information must be accurate. We reserve the right to refuse or cancel orders for various reasons.</p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <FiUsers className="h-8 w-8 text-[#7F37D8] mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscriptions</h3>
            <p className="text-gray-600 text-sm">Subscriptions auto-renew unless cancelled. Valid payment method required for processing.</p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {/* Subscriptions */}
          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[#7F37D8] mb-6">5. Subscriptions</h2>
            <div className="space-y-4 text-gray-700">
              <p>Some parts of Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle").</p>
              <p>At the end of each Billing Cycle, your Subscription will automatically renew under the exact same conditions unless you cancel it or Tinywallet cancels it.</p>
              <div className="bg-white rounded p-4 border-l-4 border-blue-400">
                <p className="font-medium">Cancellation Options:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Through your online account management page</li>
                  <li>By contacting <a href="mailto:tinywallet.in@gmail.com" className="text-[#7F37D8] underline">tinywallet.in@gmail.com</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Free Trial */}
          <div className="bg-green-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[#7F37D8] mb-6">6. Free Trial</h2>
            <div className="space-y-4 text-gray-700">
              <p>Tinywallet may, at its sole discretion, offer a Subscription with a free trial for a limited period of time ("Free Trial").</p>
              <p>You may be required to enter your billing information to sign up for Free Trial. If you do enter billing information, you will not be charged until Free Trial expires.</p>
              <div className="bg-white rounded p-4 border-l-4 border-green-400">
                <p className="font-medium text-green-800">Important:</p>
                <p className="mt-1">On the last day of Free Trial period, unless you cancelled your Subscription, you will be automatically charged the applicable Subscription fees.</p>
              </div>
            </div>
          </div>

          {/* Refunds */}
          <div className="bg-red-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[#7F37D8] mb-6">8. Refunds</h2>
            <div className="bg-white rounded p-4 border-l-4 border-red-400">
              <div className="flex items-center">
                <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <p className="font-semibold text-red-800">No Refund Policy</p>
              </div>
              <p className="text-gray-700 mt-2">
                If the subscription availed by you is a paid plan/subscription, you shall not be eligible for any refund upon cancellation or non-use.
              </p>
            </div>
          </div>

          {/* Content Rights */}
          <div className="bg-purple-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[#7F37D8] mb-6">9. Content</h2>
            <div className="space-y-4 text-gray-700">
              <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content").</p>
              <p>By posting Content on or through Service, You represent and warrant that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Content is yours (you own it) and/or you have the right to use it</li>
                <li>Posting your Content does not violate privacy rights, publicity rights, copyrights, or other rights</li>
              </ul>
              <div className="bg-white rounded p-4 border-l-4 border-purple-400">
                <p className="font-medium">License Grant:</p>
                <p className="mt-1">By posting Content, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through Service.</p>
              </div>
            </div>
          </div>

          {/* Prohibited Uses */}
          <div className="bg-yellow-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[#7F37D8] mb-6">10. Prohibited Uses</h2>
            <div className="space-y-4 text-gray-700">
              <p className="font-medium">You agree not to use Service:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>In violation of applicable laws</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>To harm or exploit minors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>To transmit spam or advertising</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>To impersonate others</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>In fraudulent or harmful ways</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>To interfere with Service operation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Account Responsibility */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[#7F37D8] mb-6">13. Accounts</h2>
            <div className="space-y-4 text-gray-700">
              <p>When you create an account with us, you guarantee that you are above the age of 18, and that the information you provide us is accurate, complete, and current at all times.</p>
              <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for any and all activities that occur under your account.</p>
              <div className="bg-white rounded p-4 border-l-4 border-gray-400">
                <p className="font-medium">Security Notice:</p>
                <p className="mt-1">You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
              </div>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-indigo-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[#7F37D8] mb-6">14. Intellectual Property</h2>
            <div className="flex items-start">
              <FiShield className="h-6 w-6 text-[#7F37D8] mt-1 mr-3 flex-shrink-0" />
              <div className="text-gray-700">
                <p>Service and its original content, features and functionality are and will remain the exclusive property of Tinywallet and its licensors. Service is protected by copyright, trademark, and other laws.</p>
                <p className="mt-4">Our trademarks may not be used in connection with any product or service without the prior written consent of Tinywallet.</p>
              </div>
            </div>
          </div>

          {/* Governing Law */}
          <div className="bg-orange-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-[#7F37D8] mb-6">22. Governing Law</h2>
            <div className="text-gray-700">
              <p>These Terms shall be governed and construed in accordance with the laws of India, which governing law applies to agreement without regard to its conflict of law provisions.</p>
              <p className="mt-4">Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-[#7F37D8] rounded-lg p-8 text-center mt-12">
          <div className="flex items-center justify-center mb-4">
            <FiMail className="h-8 w-8 text-white mr-3" />
            <h2 className="text-2xl font-bold text-white">Contact Us</h2>
          </div>
          <p className="text-purple-100 mb-6">
            Please send your feedback, comments, requests for technical support:
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
      <footer className="bg-gray-800 mt-16">
        <div className="max-w-7xl mx-auto pb-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2023 TINYWALLET. All rights reserved. |{" "}
              <Link to="/privacy" className="text-gray-400 hover:text-gray-300">Privacy</Link> |{" "}
              <Link to="/terms" className="text-gray-400 hover:text-gray-300">Terms</Link> |{" "}
              <Link to="/refund" className="text-gray-400 hover:text-gray-300">Refund</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;