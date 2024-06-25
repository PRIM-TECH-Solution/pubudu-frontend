import React, { useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { jwtDecode } from "jwt-decode";  // Use named import instead of default import

const SignIn = () => {
  const [errUsername, setErrUsername] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);  // New loading state
  const [showPassword, setShowPassword] = useState(false);  // New state for password visibility
  const navigate = useNavigate();

  const handleUsername = (e) => {
    setUsername(e.target.value);
    setErrUsername("");
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    setErrPassword("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // const handleGoogleSignIn = () => {
  //   window.location.href = "https://user-event-web.azurewebsites.net/auth2/authorization/google";
  // };
  
  const login = async (e) => {
    e.preventDefault();
    
    setErrUsername('');
    setErrPassword('');
  
    if (!username) {
      setErrUsername("Enter your Username");
      return;
    }
    if (!password) {
      setErrPassword("Enter your Password");
      return;
    }

    setLoading(true);  // Show loading indicator

    try {
      const res = await axios.post("https://user-event-web.azurewebsites.net/auth/login", {
        username,
        password,
      });
  
      const message = res.data;
      console.log(message);
  
      if (message.startsWith("Login successful")) {
        const token = message.split("Token: ")[1];
        localStorage.setItem('token', token);

        const decoded = jwtDecode(token);  // Use jwtDecode instead of jwt_decode
        const userRole = decoded.role;

        if (userRole === 'ADMIN') {
          navigate('/admindashboard');
        } else if (userRole === 'USER') {
          navigate('/');
        } else {
          navigate('/');
        }
      } else {
        alert(message);
      }
    } catch (err) {
      alert("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);  // Hide loading indicator
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <h1 className="font-titleFont text-3xl font-medium">
              EasyTicket.LK
            </h1>
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">
              Stay signed in for more
            </h1>
            <p className="text-base">When you sign in, you are with us!</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Get Started Browsing Events with EasyTicket.LK
              </span>
              <br />
              Unlock a world of entertainment and stay updated with the latest events.
              Sign in and start your adventure!
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Enjoy Seamless Event Booking with EasyTicket.LK
              </span>
              <br />
              Access exclusive events and enjoy a hassle-free booking experience.
              Sign in and never miss out!
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">
                Stay Connected with EasyTicket.LK
              </span>
              <br />
              Join our community and get the best deals on event tickets.
              Sign in and elevate your experience!
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <Link to="/">
              <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
                © EasyTicket.LK
              </p>
            </Link>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Terms
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Privacy
            </p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">
              Security
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lgl:w-1/2 h-full">
        {successMsg ? (
          <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">
              {successMsg}
            </p>
            <Link to="/signup">
              <button
                className="w-full h-10 bg-primeColor text-gray-200 rounded-md text-base font-titleFont font-semibold 
                tracking-wide hover:bg-black hover:text-white duration-300"
              >
                Sign Up
              </button>
            </Link>
          </div>
        ) : (
          <form className="w-full lgl:w-[450px] h-screen flex items-center justify-center" onSubmit={login}>
            <div className="px-6 py-4 w-full h-[90%] flex flex-col justify-center overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4">
                Sign in
              </h1>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-.5">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Username
                  </p>
                  <input
                    onChange={handleUsername}
                    value={username}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type="text"
                    placeholder="Enter your username"
                  />
                  {errUsername && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errUsername}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-.5 relative">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Password
                  </p>
                  <input
                    onChange={handlePassword}
                    value={password}
                    className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                  />
                  <div className="absolute right-3 top-9 cursor-pointer" onClick={togglePasswordVisibility}>
                    {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                  </div>
                  {errPassword && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-primeColor hover:bg-black text-gray-200 hover:text-white cursor-pointer w-full text-base font-medium h-10 rounded-md duration-300"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
                {/* <button
                  type="button"
                  className="text-blue-600 hover:text-blaczzzk cursor-pointer w-full text-base font-medium h-10 rounded-md duration-300"
                  onClick={handleGoogleSignIn}
                >
                  Continue with Google
                </button> */}

                <p className="text-sm text-center font-titleFont font-medium">
                  Don't have an Account?{" "}
                  <Link to="/signup">
                    <span className="hover:text-blue-600 duration-300">
                      Sign up
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignIn;