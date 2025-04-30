import { useState } from "react"
import SigninComponent from "../components/auth/SigninComponent"
import SignupComponent from "../components/auth/SignupComponent"
import logo from "../assets/images/bali.jpg"

const Signin = () => {
  const [showSignup, setShowSignup] = useState(false);
  
  const toggleAuthMode = () => {
    setShowSignup(!showSignup);
  };
  
  return (
    <section className="h-screen w-full flex items-center justify-center p-4 md:p-0">
       <div className="w-full md:max-w-2xl lg:max-w-4xl h-3/4 md:h-2/3 rounded-lg shadow-md overflow-hidden relative">
        <div 
          className="absolute inset-0 bg-no-repeat bg-center bg-cover z-0 opacity-90" 
          style={{ backgroundImage: `url(${logo})` }}
        ></div>
        <div className="relative z-10 h-full">
          {showSignup 
            ? <SignupComponent setIsSignin={toggleAuthMode} /> 
            : <SigninComponent setIsSignin={toggleAuthMode} />
          }
        </div>
       </div>
    </section>
  )
}

export default Signin