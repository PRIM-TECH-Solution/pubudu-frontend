import React from "react";
import { useLocation } from "react-router-dom";

const DownloadPage = () => {
  const location = useLocation();
  const { order, selectedTickets, ticketDetails } = location.state || {};

  if (!order || !selectedTickets || !ticketDetails) {
    return <div>No order details available.</div>;
  }

  const calculateSubtotal = (ticket) => {
    const ticketDetail = ticketDetails.find(detail => detail.ticketType === ticket.ticketType);
    return ticketDetail ? ticketDetail.ticketPrice * ticket.quantity : 0;
  };

  return (
    <div className="max-w-container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold mb-8">Order Summary</h2>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold">Order ID: {order.order_id}</h3>
        <p className="text-xl">Amount: {order.amount} LKR</p>
        <p className="text-xl">Currency: {order.currency}</p>
      </div>
      <div className="mb-8">
        <h3 className="text-2xl font-semibold">Selected Tickets</h3>
        {selectedTickets.map((ticket, index) => (
          <div key={index} className="flex justify-between py-2 border-b">
            <span className="text-xl">{ticket.quantity}x {ticket.ticketType}(s)</span>
            <span className="text-xl">{calculateSubtotal(ticket)} LKR</span>
          </div>
        ))}
        <div className="flex justify-between py-2 border-b">
          <span className="text-xl font-bold">Total</span>
          <span className="text-xl font-bold">{selectedTickets.reduce((acc, ticket) => acc + calculateSubtotal(ticket), 0)} LKR</span>
        </div>
      </div>
      <div className="mt-8">
        <button
          onClick={() => window.print()}
          className="py-4 px-8 bg-blue-500 hover:bg-blue-600 text-white text-lg font-titleFont"
        >
          Download / Print
        </button>
      </div>
    </div>
  );
};

export default DownloadPage;
