import { useState, FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../ui/Toast";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

const SigninComponent = ({ setIsSignin }: { setIsSignin: () => void }) => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { signin, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const {showToast} = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone || !password) return;
    setLoading(true);
    
    try {
      const success = await signin(emailOrPhone, password, loginMethod);
      if (success) {
        showToast('Login successful', 'success');
        navigate('/dashboard');
      } else {
        // Error message will be available in the error state from useAuth
        showToast(error || 'Login failed', 'error');
      }
    } catch {
      showToast('An unexpected error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">

      {/* Left Section (Form) */}
      <div className="flex-1 flex p-6 bg-white">
        <div className="w-full max-w-md space-y-1">

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Sign In</h1>
            <p className="mt-2 text-gray-600 text-sm">
              Enter your {loginMethod === "email" ? "Email" : "Phone"} and Password
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Login Method Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setLoginMethod("email")}
                className={`flex-1 py-2 rounded-md text-sm font-medium ${
                  loginMethod === "email" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("phone")}
                className={`flex-1 py-2 rounded-md text-sm font-medium ${
                  loginMethod === "phone" ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"
                }`}
              >
                Phone
              </button>
            </div>

            {/* Email/Phone input */}
            <div>
              <label className="block text-gray-700 mb-1 text-sm">
                {loginMethod === "email" ? "Email Address" : "Phone Number"}
              </label>
              <input
                type={loginMethod === "email" ? "email" : "tel"}
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
                placeholder={loginMethod === "email" ? "you@example.com" : "Enter your phone number"}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Password input */}
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

            {/* Remember me */}
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
              <p className="md:hidden text-gray-700 text-sm">Don't have an account? <button onClick={setIsSignin} className="text-purple-600 hover:text-purple-700 transition duration-300">Sign Up</button></p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <span className="flex items-center gap-2 text-white w-full justify-center"><FaSpinner className="animate-spin" /> Signing In...</span> : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section (Signup Invite) */}
      <div className="hidden md:flex flex-col items-center justify-center flex-1 bg-black bg-opacity-50 text-white p-8">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">New Here?</h2>
          <p className="text-sm">Sign up and explore new opportunities!</p>
          <button
            onClick={setIsSignin}
            className="border-2 border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>

    </div>
  );
}

export default SigninComponent;
