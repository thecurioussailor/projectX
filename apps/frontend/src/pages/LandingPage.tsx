import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiArrowRight, FiShield, FiGlobe, FiMessageCircle, FiLink } from 'react-icons/fi';
import logo from '../assets/images/tinywalletLogo.png';
import Footer from '../components/landing/Footer';
const LandingPage = () => {
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
      <div>
        {/* Hero Section */}
        <div className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
              <svg
                className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
                fill="currentColor"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <polygon points="50,0 100,0 50,100 0,100" />
              </svg>

              <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
                <div className="sm:text-center lg:text-left">
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block xl:inline">Your complete</span>{' '}
                    <span className="block text-[#7F37D8] xl:inline">digital business suite</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    Manage digital products, shorten links, and integrate with Telegram channels all in one place. Start your digital business journey today.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    {isAuthenticated ? (
                      <div className="rounded-md shadow">
                        <Link
                          to="/dashboard"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#7F37D8] hover:bg-[#6c2eb9] md:py-4 md:text-lg md:px-10"
                        >
                          Go to Dashboard
                        </Link>
                      </div>
                    ) : (
                      <div className="rounded-md shadow">
                        <Link
                          to="/signin"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#7F37D8] hover:bg-[#6c2eb9] md:py-4 md:text-lg md:px-10"
                        >
                          Get started
                        </Link>
                      </div>
                    )}
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <a
                        href="#features"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[#7F37D8] bg-purple-50 hover:bg-purple-100 md:py-4 md:text-lg md:px-10"
                      >
                        Learn more
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
            <img
              className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
              alt="Team working"
            />
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-12 bg-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-[#7F37D8] font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                All-in-one digital business platform
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                Everything you need to build, grow, and manage your digital business in one place.
              </p>
            </div>

            <div className="mt-10">
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#7F37D8] text-white">
                      <FiMessageCircle className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Telegram Integration</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Seamlessly connect your Telegram channels and monetize your audience with subscription plans.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#7F37D8] text-white">
                      <FiGlobe className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Digital Product Management</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Create, sell, and distribute digital products with ease. Manage your entire product catalog.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#7F37D8] text-white">
                      <FiLink className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Link Shortening</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Create branded short links for your marketing campaigns and track click performance.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#7F37D8] text-white">
                      <FiShield className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Secure Payment Processing</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Accept payments securely from customers globally with integrated payment solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-[#7F37D8] font-semibold tracking-wide uppercase">Testimonials</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Trusted by creators worldwide
              </p>
              <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                See what our users are saying about their experience with projectX.
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              <div className="bg-purple-50 p-6 rounded-lg shadow">
                <div className="flex items-start">
                  <div className="ml-4">
                    <p className="text-gray-600 mb-4">
                      "Using projectX has completely transformed my digital product business. I'm now able to manage my Telegram channels and digital products all in one place."
                    </p>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#7F37D8] flex items-center justify-center text-white font-bold">
                        JS
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">John Smith</h3>
                        <p className="text-sm text-gray-500">Digital Creator</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg shadow">
                <div className="flex items-start">
                  <div className="ml-4">
                    <p className="text-gray-600 mb-4">
                      "The Telegram integration is seamless. I've been able to monetize my channel and increase my revenue by 40% in just three months."
                    </p>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#7F37D8] flex items-center justify-center text-white font-bold">
                        SD
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">Sarah Davis</h3>
                        <p className="text-sm text-gray-500">Content Creator</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg shadow">
                <div className="flex items-start">
                  <div className="ml-4">
                    <p className="text-gray-600 mb-4">
                      "The payment processing is secure and reliable. My customers feel confident making purchases, and I love the detailed analytics."
                    </p>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#7F37D8] flex items-center justify-center text-white font-bold">
                        MP
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">Mike Peterson</h3>
                        <p className="text-sm text-gray-500">Digital Entrepreneur</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-[#7F37D8]">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-purple-200">Start your free trial today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/signin"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-[#7F37D8] bg-white hover:bg-gray-50"
                >
                  Get started <FiArrowRight className="ml-2 -mr-1 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;