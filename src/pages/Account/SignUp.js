import React, { useState } from "react";
import { BsCheckCircleFill, BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import UserService from "../../services/UserService";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    country: "",
    city: "",
    nic: "",
    phone: "",
    role: "USER"
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const EmailValidation = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!user.first_name) newErrors.first_name = "Enter your first name";
    if (!user.last_name) newErrors.last_name = "Enter your last name";
    if (!user.phone) newErrors.phone = "Enter your mobile number";
    if (!user.nic) newErrors.nic = "Enter your NIC number";
    if (!user.email) newErrors.email = "Enter your email";
    else if (!EmailValidation(user.email)) newErrors.email = "Enter a valid email";
    if (!user.country) newErrors.country = "Enter your country";
    if (!user.city) newErrors.city = "Enter your city";
    if (!user.username) newErrors.username = "Enter your user name";
    if (!user.password) newErrors.password = "Create a password";
    else if (user.password.length < 6) newErrors.password = "Passwords must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveUser = (e) => {
    e.preventDefault();
    if (!checked) {
      setError('Please accept the Terms of Use & Privacy Policy.');
      return;
    }
  
    if (validateForm()) {
      setLoading(true); // Start loading
      UserService.saveUser(user)
        .then((response) => {
          console.log('User saved:', response);
          setSuccessMsg('User successfully created!');
          navigate('/signin');
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            console.error('User already exists');
            alert('User already exists. Please try a different email.');
          } else {
            console.error('Error saving user:', error);
            alert('An error occurred while saving the user. Please try again later.');
          }
        })
        .finally(() => {
          setLoading(false); // Stop loading
        });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full h-screen flex items-center justify-start">
      <div className="w-1/2 hidden lgl:inline-flex h-full text-white">
        <div className="w-[450px] h-full bg-primeColor px-10 flex flex-col gap-6 justify-center">
          <Link to="/">
            <h1 className="font-titleFont text-3xl font-medium">EasyTicket.LK</h1>
          </Link>
          <div className="flex flex-col gap-1 -mt-1">
            <h1 className="font-titleFont text-xl font-medium">Get started for free</h1>
            <p className="text-base">Create your account to access more</p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">Get Started Browsing Events with EasyTicket.LK</span>
              <br />
              Unlock a world of entertainment and stay updated with the latest events. Sign in and start your adventure!
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">Enjoy Seamless Event Booking with EasyTicket.LK</span>
              <br />
              Access exclusive events and enjoy a hassle-free booking experience. Sign in and never miss out!
            </p>
          </div>
          <div className="w-[300px] flex items-start gap-3">
            <span className="text-green-500 mt-1">
              <BsCheckCircleFill />
            </span>
            <p className="text-base text-gray-300">
              <span className="text-white font-semibold font-titleFont">Stay Connected with EasyTicket.LK</span>
              <br />
              Join our community and get the best deals on event tickets. Sign in and elevate your experience!
            </p>
          </div>
          <div className="flex items-center justify-between mt-10">
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">© EasyTicket.LK</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Terms</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Privacy</p>
            <p className="text-sm font-titleFont font-semibold text-gray-300 hover:text-white cursor-pointer duration-300">Security</p>
          </div>
        </div>
      </div>
      <div className="w-full lgl:w-[500px] h-full flex flex-col justify-center">
        {successMsg ? (
          <div className="w-[500px]">
            <p className="w-full px-4 py-10 text-green-500 font-medium font-titleFont">{successMsg}</p>
            <Link to="/signin">
              <button className="w-full h-10 bg-primeColor rounded-md text-gray-200 text-base font-titleFont font-semibold tracking-wide hover:bg-black hover:text-white duration-300">
                Sign in
              </button>
            </Link>
          </div>
        ) : (
          <form className="w-full lgl:w-[500px] h-screen flex items-center justify-center">
            <div className="px-6 py-4 w-full h-[96%] flex flex-col justify-start overflow-y-scroll scrollbar-thin scrollbar-thumb-primeColor">
              <h1 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-2xl mdl:text-3xl mb-4">
                Create your account
              </h1>
              <div className="flex flex-col gap-3">
                {["first_name", "last_name", "phone", "nic", "email", "country", "city", "username"].map((field) => (
                  <div key={field} className="flex flex-col gap-.5">
                    <p className="font-titleFont text-base font-semibold text-gray-600">
                      {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </p>
                    <input
                      name={field}
                      value={user[field]}
                      onChange={handleChange}
                      className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                      type="text"
                      placeholder={`Enter your ${field.split('_').join(' ')}`}
                    />
                    {errors[field] && (
                      <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                        <span className="font-bold italic mr-1">!</span>
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-.5 relative">
                  <p className="font-titleFont text-base font-semibold text-gray-600">
                    Password
                  </p>
                  <div className="relative">
                    <input
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      className="w-full h-8 placeholder:text-sm placeholder:tracking-wide px-4 text-base font-medium placeholder:font-normal rounded-md border-[1px] border-gray-400 outline-none"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className="absolute top-1/2 right-3 transform -translate-y-1/2 cursor-pointer text-gray-600"
                    >
                      {showPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
                    </span>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500 font-titleFont font-semibold px-4">
                      <span className="font-bold italic mr-1">!</span>
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    onChange={(e) => setChecked(e.target.checked)}
                    className="w-4 h-4"
                    type="checkbox"
                  />
                  <p className="text-sm text-gray-600">
                    I accept the{" "}
                    <span className="font-semibold text-primeColor">Terms of Use</span> &{" "}
                    <span className="font-semibold text-primeColor">Privacy Policy</span>
                  </p>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  onClick={saveUser}
                  disabled={loading || !checked}
                  className={`w-full h-10 rounded-md text-gray-200 text-base font-titleFont font-semibold tracking-wide duration-300 ${
                    checked ? 'bg-primeColor hover:bg-black hover:text-white' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Signing up...' : 'Sign up'} {/* Display loading text when loading */}
                </button>
                <p className="text-sm text-center text-gray-600">
                  Already have an account?{" "}
                  <Link to="/signin">
                    <span className="font-semibold text-primeColor hover:text-black hover:underline underline-offset-2 decoration-[1px] cursor-pointer duration-300">
                      Sign in
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

export default SignUp;