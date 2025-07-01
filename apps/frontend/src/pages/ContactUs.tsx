import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/tinywalletLogo.png';
import Footer from '../components/landing/Footer';

const ContactUs = () => {
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
            Website <span className="text-[#7F37D8]">Disclaimer</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Last updated: April 24, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-purple-50 rounded-lg p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[#7F37D8] mb-6">Website Disclaimer</h2>
            <p className="text-gray-700 mb-6">
              The information provided by Tinywallet ("Company", "we", "our", "us") on{" "}
              <a href="https://www.tinywallet.in" className="text-[#7F37D8] underline">
                https://www.tinywallet.in
              </a>{" "}
              (the "Site") is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.
            </p>
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <p className="text-red-800 font-semibold">
                UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.
              </p>
            </div>

            <h3 className="text-xl font-bold text-[#7F37D8] mb-4">External Links Disclaimer</h3>
            <p className="text-gray-700 mb-6">
              The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties or links to websites and features. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-yellow-800 font-semibold">
                WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING.
              </p>
            </div>

            <h3 className="text-xl font-bold text-[#7F37D8] mb-4">Professional Disclaimer</h3>
            <p className="text-gray-700 mb-4">
              The Site cannot and does not contain financial advice. The information is provided for general informational and educational purposes only and is not a substitute for professional financial advice.
            </p>
            <p className="text-gray-700 mb-6">
              Content published on{" "}
              <a href="https://www.tinywallet.in" className="text-[#7F37D8] underline">
                https://www.tinywallet.in
              </a>{" "}
              is intended to be used and must be used for informational purposes only. It is very important to do your own analysis before making any decision based on your own personal circumstances.
            </p>

            <h3 className="text-xl font-bold text-[#7F37D8] mb-4">Affiliates Disclaimer</h3>
            <p className="text-gray-700 mb-6">
              The Site may contain links to affiliate websites, and we may receive an affiliate commission for any purchases or actions made by you on the affiliate websites using such links.
            </p>

            <h3 className="text-xl font-bold text-[#7F37D8] mb-4">Testimonials Disclaimer</h3>
            <p className="text-gray-700 mb-4">
              The Site may contain testimonials by users of our products and/or services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users, and may not necessarily be representative of all users of our products and/or services.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-blue-800 font-semibold">
                YOUR INDIVIDUAL RESULTS MAY VARY.
              </p>
            </div>

            <h3 className="text-xl font-bold text-[#7F37D8] mb-4">Errors and Omissions Disclaimer</h3>
            <p className="text-gray-700 mb-6">
              While we have made every attempt to ensure that the information contained in this site has been obtained from reliable sources, Tinywallet is not responsible for any errors or omissions or for the results obtained from the use of this information.
            </p>

            <h3 className="text-xl font-bold text-[#7F37D8] mb-4">Logos and Trademarks Disclaimer</h3>
            <p className="text-gray-700 mb-6">
              All logos and trademarks of third parties referenced on{" "}
              <a href="https://www.tinywallet.in" className="text-[#7F37D8] underline">
                https://www.tinywallet.in
              </a>{" "}
              are the trademarks and logos of their respective owners. Any inclusion of such trademarks or logos does not imply or constitute any approval, endorsement or sponsorship of Tinywallet by such owners.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-[#7F37D8] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
          <p className="text-purple-100 mb-6">
            Should you have any feedback, comments, requests for technical support or other inquiries, please contact us:
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
      <Footer />
    </div>
  );
};

export default ContactUs;