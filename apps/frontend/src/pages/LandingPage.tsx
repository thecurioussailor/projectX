import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
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
                  <>
                    <div className="rounded-md shadow">
                      <Link
                        to="/signin"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#7F37D8] hover:bg-[#6c2eb9] md:py-4 md:text-lg md:px-10"
                      >
                        Get started
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-[#f8f4fe]">
        <div className="h-full flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#7F37D8] mb-4">Features</h2>
            <ul className="space-y-4 text-left">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#7F37D8] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Digital Product Management</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#7F37D8] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Link Shortening</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#7F37D8] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Telegram Integration</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-[#7F37D8] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Secure Payment Processing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;