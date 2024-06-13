import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import axios from "axios";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = location.state || {};
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (orderId) {
      const downloadETicket = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/orders/generateQR/${orderId}`, {
            responseType: "blob",
          });

          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `e-ticket-${orderId}.pdf`);
          document.body.appendChild(link);
          link.click();

          // Show the success message after downloading the ticket
          setShowMessage(true);
        } catch (error) {
          console.error("Error downloading e-ticket:", error);
        }
      };

      downloadETicket();
    }
  }, [orderId]);

  const handleBookAnotherEvent = () => {
    navigate("/events");
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  return (
    <div className="max-w-container mx-auto px-4 py-6">
      <Breadcrumbs title="Booking Successful" prevLocation="Home" />
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="p-6 bg-white rounded-lg shadow-lg w-full md:w-1/2 flex flex-col items-center">
          <FaCheckCircle className="text-green-500 text-6xl mb-4" />
          <h2 className="text-3xl font-bold mb-4">Booking Successful!</h2>
          <p className="text-lg">Thank you for your purchase. Your booking has been confirmed.</p>
        </div>
        <div className="w-full md:w-1/2 flex flex-col items-center space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Download Ticket
          </button>
          <button
            onClick={handleBookAnotherEvent}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Book Another Event
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showMessage && (
        <div className="fixed bottom-4 right-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg shadow-lg flex items-center space-x-4">
          <p>Your E-ticket has been sent to your email successfully.</p>
          <button
            onClick={handleCloseMessage}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingSuccess;
