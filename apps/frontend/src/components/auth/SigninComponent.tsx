import { useState, FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";

const SigninComponent = ({setIsSignin}: {setIsSignin: () => void}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { signin, isLoading, error } = useAuth();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    await signin(username, password);
  };
  
  return (
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
      <div className="w-1/3 flex flex-col justify-between items-center bg-black bg-opacity-40 py-12 h-full text-white">
        <div className="w-full flex flex-col justify-center items-center">
          <h2 className="text-3xl font-medium mb-6">New User?</h2>
          <p className="text-center mb-8 text-xs">Sign up and discover great amount of new opportunities!</p>
        </div>
        <button 
          onClick={setIsSignin}
          className="border-2 border-white text-white py-3 px-12 rounded-full hover:bg-white hover:text-gray-800 transition duration-300">
          SIGN UP
        </button>
      </div>
    </div>
  )
}

export default SigninComponent