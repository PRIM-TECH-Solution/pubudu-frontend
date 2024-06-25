import React, { useState, useEffect } from "react";
import axios from "axios";

const SplitTicketsPopup = ({ orderDetails, eventDetails, onClose , onSplitTicketsSent }) => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [emailTickets, setEmailTickets] = useState([]);
  const [sendingStatus, setSendingStatus] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const fetchTicketTypes = async () => {
      try {
        const response = await axios.get(`https://easyticket-payment.azurewebsites.net/order-summary/ticket-types/${orderDetails.order_id}`);
        const ticketTypesData = response.data.map((type, index) => ({ id: index, ticketType: type.toUpperCase() }));
        setTicketTypes(ticketTypesData);
        setEmailTickets(ticketTypesData.map(ticket => ({ ...ticket, email: "" })));
      } catch (error) {
        console.error("Error fetching ticket types:", error);
      }
    };

    fetchTicketTypes();
  }, [orderDetails.order_id]);

  const handleChange = (id, value) => {
    setEmailTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === id ? { ...ticket, email: value } : ticket
      )
    );
  };

  const handleSendAll = async () => {
    setIsSending(true);
    setSendingStatus(
      emailTickets.reduce((acc, ticket) => {
        acc[ticket.id] = "sending";
        return acc;
      }, {})
    );

    const ticketsData = emailTickets.map(ticket => ({
      orderId: orderDetails.order_id,
      ticketType: ticket.ticketType,
      nic: orderDetails.nic,
      eventName: eventDetails.eventName,
      eventDate: eventDetails.eventDate,
      eventTime: eventDetails.eventTime,
      email: ticket.email,
      amount: orderDetails.amount,
    }));

    try {
      await axios.post("https://easyticket-qr.azurewebsites.net/tickets/create", ticketsData);
      await axios.post(`https://easyticket-qr.azurewebsites.net/api/generateQRAndSendEmail/${orderDetails.order_id}`);

      setSendingStatus(
        emailTickets.reduce((acc, ticket) => {
          acc[ticket.id] = "sent";
          return acc;
        }, {})
      );
      setIsSent(true);
      onSplitTicketsSent();
    } catch (error) {
      setSendingStatus(
        emailTickets.reduce((acc, ticket) => {
          acc[ticket.id] = "failed";
          return acc;
        }, {})
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Split Tickets</h2>
        <p className="mb-4">You have ordered {ticketTypes.length} tickets. Split them here:</p>
        {emailTickets.map((ticket, index) => (
          <div key={index} className="mb-4">
            <p className="mb-2">{ticket.ticketType}</p>
            <input
              type="email"
              placeholder="Enter email"
              value={ticket.email}
              onChange={(e) => handleChange(ticket.id, e.target.value)}
              className="border p-2 rounded w-full"
              readOnly={isSent}
            />
          </div>
        ))}
        <button
          onClick={handleSendAll}
          disabled={isSending || isSent}
          className={`w-full mt-4 py-2 px-4 rounded ${isSending || isSent ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white font-bold`}
        >
          {isSending ? "Sending..." : isSent ? "Sent" : "Send All"}
        </button>
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 px-4 rounded bg-red-500 hover:bg-red-600 text-white font-bold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SplitTicketsPopup;
