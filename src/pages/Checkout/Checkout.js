import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import paymentCard from "../../assets/images/payment.png";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Import jwtDecode correctly

const CheckoutPage = () => {
  const location = useLocation();
  const { eventId } = location.state || {};
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
    return `${Date.now()}${Math.floor(Math.random() * 10000)}`;
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
    const orderSummaryData = {
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
      // Post the order to the order-summary endpoint
      const orderSummaryResponse = await axios.post(
        "http://localhost:8080/order-summary",
        orderSummaryData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Order summary created successfully:", orderSummaryResponse.data);

      // Fetch the created order summary using the order ID
      const orderDetailsResponse = await axios.get(
        `http://localhost:8080/order-summary/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderDetails = orderDetailsResponse.data;
      const { merchantId, hash } = orderDetails;

      // Create and submit the Pay Here form
      const payHereForm = document.createElement("form");
      payHereForm.method = "POST";
      payHereForm.action = "https://sandbox.payhere.lk/pay/checkout";

      const inputs = [
        { name: "merchant_id", value: merchantId },
        { name: "return_url", value: `http://localhost:3000/download/${orderId}` },
        { name: "cancel_url", value: `http://localhost:3000/cancel/${orderId}?XscLNA=${orderId}&FCslDm=${hash}` },
        { name: "notify_url", value: "http://localhost:8080/payment/notify" },
        { name: "order_id", value: orderId },
        { name: "items", value: "Ticket Purchase" },
        { name: "currency", value: "LKR" },
        { name: "amount", value: totalSubtotal },
        { name: "first_name", value: userDetails.firstName },
        { name: "last_name", value: userDetails.lastName },
        { name: "email", value: userDetails.email },
        { name: "phone", value: userDetails.phone },
        { name: "address", value: userDetails.city },
        { name: "city", value: userDetails.city },
        { name: "country", value: userDetails.country },
        { name: "hash", value: hash },
        { name: "NIC", value: userDetails.nic },
      ];

      inputs.forEach((inputData) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = inputData.name;
        input.value = inputData.value;
        payHereForm.appendChild(input);
      });

      document.body.appendChild(payHereForm);
      payHereForm.submit();
    } catch (error) {
      console.error("Error during order submission:", error);
      navigate("/checkout", { state: { error: error.message } });
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
          <h2 className="font-bold text-3xl mb-4 underline">Order Summary</h2>
          <div className="flex flex-col space-y-4">
            {selectedTickets.map((ticket, index) => (
              <div key={index} className="p-4 border rounded">
                <h3 className="font-semibold text-lg">{ticket.ticketType}</h3>
                <p className="text-gray-700">Quantity: {ticket.quantity}</p>
                <p className="text-gray-700">Price: LKR {calculateSubtotal(ticket)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h3 className="font-bold text-xl">Total: LKR {totalSubtotal}</h3>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="agreeToTerms" className="text-gray-700">
              I agree to the <span className="text-blue-500 underline cursor-pointer">Terms and Conditions</span>
            </label>
          </div>
          <button
            onClick={handleOrderSubmit}
            className="mt-4 w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!agreedToTerms}
          >
            Place Order
          </button>
          <button
            onClick={handleBack}
            className="mt-2 w-full p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Back to Cart
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <img src={paymentCard} alt="payment methods" className="w-1/2 md:w-1/4" />
      </div>
    </div>
  );
};

export default CheckoutPage;
