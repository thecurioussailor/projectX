import { useState, useEffect, FormEvent } from 'react';
import { useLinkStore } from '../store/useLinkStore';
import { FaLink, FaCopy, FaChartLine, FaTrash } from 'react-icons/fa';

const LinkShort = () => {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const { links, currentLink, isLoading, error, createLink, fetchLinks } = useLinkStore();

  useEffect(() => {
    // Fetch links when component mounts
    fetchLinks();
  }, [fetchLinks]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    await createLink(url);
    setUrl(''); // Clear input after successful creation
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    
    // Reset the "Copied" state after 2 seconds
    setTimeout(() => {
      setCopied(null);
    }, 2000);
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#7F37D8]">URL Shortener</h1>
      </div>

      {/* URL shortener form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaLink className="text-[#7F37D8]" />
          <span>Create Short Link</span>
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              Paste your long URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very-long-url-that-needs-shortening"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#7F37D8] focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-[#7F37D8] text-white py-3 px-6 rounded-md hover:bg-[#6C2EB9] transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {currentLink && (
          <div className="mt-6 p-4 border border-green-300 bg-green-50 rounded-md">
            <h3 className="font-medium text-green-800 mb-2">Your shortened URL is ready!</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={currentLink.shortUrl}
                readOnly
                className="flex-1 p-2 border border-gray-300 rounded-md bg-white"
              />
              <button
                onClick={() => copyToClipboard(currentLink.shortUrl, currentLink.id)}
                className="bg-[#7F37D8] text-white p-2 rounded-md hover:bg-[#6C2EB9] transition-colors"
                title="Copy to clipboard"
              >
                <FaCopy />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Share this link with others to redirect them to your original URL.
            </p>
          </div>
        )}
      </div>

      {/* Links list */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaChartLine className="text-[#7F37D8]" />
          <span>Your Links</span>
        </h2>
        
        {links.length === 0 ? (
          <p className="text-gray-500">You haven't created any shortened links yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Short Link
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {links.map((link) => (
                  <tr key={link.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-xs">
                      {link.originalUrl}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <a 
                          href={link.shortUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#7F37D8] hover:underline"
                        >
                          {link.shortUrl.split('/').pop()}
                        </a>
                        <button
                          onClick={() => copyToClipboard(link.shortUrl, link.id)}
                          className={`text-gray-500 hover:text-[#7F37D8] transition-colors ${
                            copied === link.id ? 'text-green-500' : ''
                          }`}
                          title={copied === link.id ? 'Copied!' : 'Copy to clipboard'}
                        >
                          <FaCopy size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {link.clicks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete link"
                      >
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default LinkShort;