import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import paymentCard from "../../assets/images/payment.png";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedTickets, ticketDetails } = location.state || {};
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    country: "",
    city: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        console.error("Token has expired");
        return;
      }

      try {
        const userId = decodedToken.user_id;
        const response = await axios.get(`http://localhost:8080/auth/getUser/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data;
        setUserDetails({
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          phone: userData.phone,
          nic: userData.nic,
          country: userData.country,
          city: userData.city,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const calculateSubtotal = (ticket) => {
    if (ticket && ticket.ticketType) {
      const ticketDetail = ticketDetails.find(
        (detail) => detail.ticketType === ticket.ticketType
      );
      return ticketDetail ? ticketDetail.ticketPrice * ticket.quantity : 0;
    }
    return 0;
  };

  const totalSubtotal = selectedTickets?.reduce(
    (acc, ticket) => acc + calculateSubtotal(ticket),
    0
  );

  const handleBack = () => {
    navigate("/cart");
  };

  const generateUniqueOrderId = () => {
    // Create a unique order ID using the current timestamp and a random number
    return `ORDER-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };

  const handleOrderSubmit = async () => {
    if (!agreedToTerms) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.user_id;

    // Create a unique order ID
    const orderId = generateUniqueOrderId();

    // Create order data according to OrderSumEntity structure
    const orderData = {
      order_id: orderId, // Include the unique order ID
      amount: totalSubtotal,
      currency: "LKR",
      nic: userDetails.nic,
      first_name: userDetails.firstName,
      last_name: userDetails.lastName,
      email: userDetails.email,
      phone: userDetails.phone,
      address: userDetails.city,
      city: userDetails.city,
      country: userDetails.country,
    };

    try {
      // Post the order to the server
      const response = await axios.post("http://localhost:8080/order-summary", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Order created successfully:", response.data);
      // Navigate to order confirmation page with the order data
      navigate("/download", { state: { order: response.data } });
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Checkout" prevLocation="Select Your Tickets" />
      <div className="flex flex-col md:flex-row w-full py-4">
        <div className="w-full md:w-1/2 p-4 border-r">
          <h2 className="font-bold text-3xl mb-4 underline">Billing Details</h2>
          <form className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="firstName" className="mb-1 font-semibold text-base text-gray-700">First Name</label>
              <input
                id="firstName"
                className="w-full p-2 border rounded text-base"
                type="text"
                value={userDetails.firstName}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="lastName" className="mb-1 font-semibold text-base text-gray-700">Last Name</label>
              <input
                id="lastName"
                className="w-full p-2 border rounded text-base"
                type="text"
                value={userDetails.lastName}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 font-semibold text-base text-gray-700">Email Address</label>
              <input
                id="email"
                className="w-full p-2 border rounded text-base"
                type="email"
                value={userDetails.email}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone" className="mb-1 font-semibold text-base text-gray-700">Phone No</label>
              <input
                id="phone"
                className="w-full p-2 border rounded text-base"
                type="text"
                value={userDetails.phone}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="nic" className="mb-1 font-semibold text-base text-gray-700">NIC / Passport / Driving License</label>
              <input
                id="nic"
                className="w-full p-2 border rounded text-base"
                type="text"
                value={userDetails.nic}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="country" className="mb-1 font-semibold text-base text-gray-700">Country</label>
              <input
                id="country"
                className="w-full p-2 border rounded text-base"
                type="text"
                value={userDetails.country}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="city" className="mb-1 font-semibold text-base text-gray-700">City</label>
              <input
                id="city"
                className="w-full p-2 border rounded text-base"
                type="text"
                value={userDetails.city}
                readOnly
              />
            </div>
          </form>
        </div>

        <div className="w-full md:w-1/2 p-4">
          <h2 className="font-bold text-3xl mb-4 underline">Booking Summary</h2>
          {selectedTickets?.map((ticket, index) => (
            <div key={index} className="flex justify-between py-2 border-b">
              <div className="text-2xl">{ticket.quantity}x {ticket.ticketType}(s)</div>
              <div className="text-2xl">{calculateSubtotal(ticket)} LKR</div>
            </div>
          ))}
          <div className="flex justify-between py-2 border-b">
            <div className="text-2xl">Sub Total</div>
            <div className="text-2xl">{totalSubtotal} LKR</div>
          </div>
          <div className="flex justify-between py-2 border-b font-bold border-t-2 pt-4">
            <div className="text-2xl bg-gray-200 p-2 rounded">Total</div>
            <div className="text-2xl bg-gray-200 p-2 rounded">{totalSubtotal} LKR</div>
          </div>
          <div className="flex justify-center my-4">
            <img src={paymentCard} alt="Payment Methods" className="h-8" />
          </div>
          
          <div className="flex items-center my-4 justify-center">
            <input 
              type="checkbox" 
              className="mr-2 justify-center" 
              checked={agreedToTerms} 
              onChange={() => setAgreedToTerms(!agreedToTerms)} 
            />
            <p className="text-sm justify-center">
              I accept and agree to{" "}
              <button
                onClick={(e) => e.preventDefault()}
                className="text-blue-600 underline justify-center"
              >
                Terms and Conditions
              </button>
            </p>
          </div>
          {!agreedToTerms && (
            <p className="text-red-600 text-sm mt-4 text-center">
              In order to proceed, you should agree to T & C by clicking the above box
            </p>
          )}
          <div className="flex justify-center mt-6 space-x-4 ">
            <button 
              onClick={handleBack} 
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Back
            </button>
            <button 
              onClick={handleOrderSubmit} // Update the onClick event
              className={`bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded ${!agreedToTerms ? 'opacity-50 cursor-not-allowed' : ''}`} 
              disabled={!agreedToTerms}
            >
              Proceed to pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
