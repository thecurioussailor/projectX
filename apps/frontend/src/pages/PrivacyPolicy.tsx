import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/tinywalletLogo.png';

const PrivacyPolicy = () => {
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
            Privacy <span className="text-[#7F37D8]">Policy</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Last updated: February 24, 2025
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-purple-50 rounded-lg p-8 mb-8">
          <p className="text-gray-700 text-lg">
            This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
          </p>
          <p className="text-gray-700 text-lg mt-4">
            We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
          </p>
        </div>

        {/* Definitions Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#7F37D8] mb-6">Interpretation and Definitions</h2>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Definitions</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#7F37D8]">Account</h4>
                  <p className="text-gray-600 text-sm">A unique account created for You to access our Service or parts of our Service.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#7F37D8]">Company</h4>
                  <p className="text-gray-600 text-sm">Refers to Tinywallet, Shayona, Surat, Gujarat - 395003.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#7F37D8]">Cookies</h4>
                  <p className="text-gray-600 text-sm">Small files placed on Your device containing browsing history details.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#7F37D8]">Personal Data</h4>
                  <p className="text-gray-600 text-sm">Any information that relates to an identified or identifiable individual.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-[#7F37D8]">Service</h4>
                  <p className="text-gray-600 text-sm">Refers to the Website.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#7F37D8]">Usage Data</h4>
                  <p className="text-gray-600 text-sm">Data collected automatically from use of the Service.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#7F37D8]">Website</h4>
                  <p className="text-gray-600 text-sm">Tinywallet, accessible from https://tinywallet.in</p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#7F37D8]">You</h4>
                  <p className="text-gray-600 text-sm">The individual accessing or using the Service.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Collection Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#7F37D8] mb-6">Collecting and Using Your Personal Data</h2>
          
          <div className="space-y-6">
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Data We Collect</h3>
              <p className="text-gray-700 mb-4">
                While using Our Service, We may ask You to provide certain personally identifiable information, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Email address</li>
                <li>First name and last name</li>
                <li>Phone number</li>
                <li>Usage Data</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Usage Data</h3>
              <p className="text-gray-700 mb-4">
                Usage Data is collected automatically when using the Service and may include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Your Device's Internet Protocol address (IP address)</li>
                <li>Browser type and version</li>
                <li>Pages of our Service that You visit</li>
                <li>Time and date of Your visit</li>
                <li>Time spent on pages</li>
                <li>Unique device identifiers</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Social Media Services</h3>
              <p className="text-gray-700 mb-4">
                The Company allows You to create an account through:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded p-3 text-center">
                  <span className="text-[#7F37D8] font-medium">Google</span>
                </div>
                <div className="bg-white rounded p-3 text-center">
                  <span className="text-[#7F37D8] font-medium">Facebook</span>
                </div>
                <div className="bg-white rounded p-3 text-center">
                  <span className="text-[#7F37D8] font-medium">Instagram</span>
                </div>
                <div className="bg-white rounded p-3 text-center">
                  <span className="text-[#7F37D8] font-medium">Twitter</span>
                </div>
                <div className="bg-white rounded p-3 text-center">
                  <span className="text-[#7F37D8] font-medium">LinkedIn</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How We Use Data Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#7F37D8] mb-6">Use of Your Personal Data</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-gray-700 mb-4">The Company may use Personal Data for the following purposes:</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-[#7F37D8] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Service provision:</strong> To provide and maintain our Service</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-[#7F37D8] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Account management:</strong> To manage Your registration as a user</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-[#7F37D8] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Contract performance:</strong> For purchase contracts and services</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-[#7F37D8] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Communication:</strong> To contact You with updates and information</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-[#7F37D8] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Marketing:</strong> To provide news and special offers</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Cookies Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#7F37D8] mb-6">Tracking Technologies and Cookies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Essential Cookies</h3>
              <p className="text-gray-700 text-sm">
                These cookies are essential to provide services and enable website features.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Functionality Cookies</h3>
              <p className="text-gray-700 text-sm">
                Remember your choices and provide a more personalized experience.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Notice Acceptance</h3>
              <p className="text-gray-700 text-sm">
                Identify if users have accepted the use of cookies on the Website.
              </p>
            </div>
          </div>
        </div>

        {/* Data Security Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#7F37D8] mb-6">Security of Your Personal Data</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6">
            <p className="text-gray-700">
              The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.
            </p>
          </div>
        </div>

        {/* Children's Privacy */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-[#7F37D8] mb-6">Children's Privacy</h2>
          <div className="bg-red-50 border-l-4 border-red-400 p-6">
            <p className="text-gray-700">
              Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-[#7F37D8] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-purple-100 mb-6">
            If you have any questions about this Privacy Policy, You can contact us:
          </p>
          <a
            href="mailto:tinywallet.in@gmail.com"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-[#7F37D8] bg-white hover:bg-gray-50 transition-colors duration-200"
          >
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

export default PrivacyPolicy;