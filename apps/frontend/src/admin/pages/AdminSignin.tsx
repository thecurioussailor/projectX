import { useState } from "react";
import { FormEvent } from "react";
import logo from "../../assets/images/bali.jpg"
import { useAdmin } from "../hooks/useAdmin";

const AdminSignin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const { signin, isLoading, error } = useAdmin({
    redirectTo: '/admin/dashboard',
    redirectIfFound: true
  });
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    await signin(username, password);
  };
  
  return (
    <section className="h-screen w-full flex items-center justify-center">
       <div className="w-full max-w-4xl h-2/3 rounded-lg shadow-md overflow-hidden relative">
        <div 
          className="absolute inset-0 bg-no-repeat bg-center bg-cover z-0 opacity-90" 
          style={{ backgroundImage: `url(${logo})` }}
        ></div>
        <div className="relative z-10 h-full">
        <div className="bg-transparent w-full h-full flex">
      <div className="bg-white py-4 px-8 w-2/3">
        <h1 className="text-2xl font-medium text-center text-gray-800 mb-6">SIGN IN</h1>
        <p className="text-center text-gray-600 mb-8">Enter your Username and Password</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="username">Username</label>
            <input 
              id="username" 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center mb-6">
            <input 
              id="remember" 
              type="checkbox" 
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="remember" className="ml-2 block text-gray-700">
              Remember me
            </label>
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full bg-purple-600 text-white py-2 text-sm font-medium rounded-md hover:bg-purple-700 transition duration-300 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'SIGNING IN...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
        </div>
       </div>
    </section>
  )
}

export default AdminSignin