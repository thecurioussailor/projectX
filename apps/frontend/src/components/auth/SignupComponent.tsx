import { useState, FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';

const SignupComponent = ({setIsSignin}: {setIsSignin: () => void}) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { signup, isLoading, error } = useAuth();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !fullName || !phone || !password) return;
    await signup(email, fullName, phone, password);
  };
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen">

      {/* Left Section (Signup Invite) */}
      <div className="hidden md:flex flex-col items-center justify-center flex-1 bg-black bg-opacity-50 text-white p-8">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">New Here?</h2>
          <p className="text-sm">Sign up and explore new opportunities!</p>
          <button
            onClick={setIsSignin}
            className="border-2 border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition duration-300"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="flex-1 flex p-6 bg-white">
        <div className="w-full max-w-md space-y-1 h-96 overflow-y-scroll [&::-webkit-scrollbar]:hidden">

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Sign Up</h1>
            <p className="mt-2 text-gray-600 text-sm">Enter your Email, Phone, and Password</p>
          </div>
          {error && (
            <div className="text-red-500">
              {error + ". " + "Try again"}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email Input */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            {/* Name Input */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            {/* Phone Input */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
              />
              <label className="text-gray-700 text-sm">Remember me</label>
            </div>
            <div className="flex items-center">
              <p className="md:hidden text-gray-700 text-sm">Already have an account? <button onClick={setIsSignin} className="text-purple-600 hover:text-purple-700 transition duration-300">Sign In</button></p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default SignupComponent;
