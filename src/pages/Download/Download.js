import React from "react";
import { useLocation } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTicketAlt } from "react-icons/fa";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const Download = () => {
  const location = useLocation();
  const { eventName, eventDate, eventLocation, eventTime, flyerLink } = location.state || {};

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Download Ticket" prevLocation="Home" />
      <div className="flex flex-col items-center py-4">
        {/* Event Details Section */}
        <div className="w-full md:w-2/3 p-6 mb-4 bg-white rounded-lg shadow-lg">
          <h2 className="font-bold text-2xl mb-4">Event Details</h2>
          <div className="space-y-4 text-lg">
            <div className="flex items-center">
              <FaTicketAlt className="mr-2 text-orange-500" />
              <span className="font-semibold">Event Name:</span> {eventName || "N/A"}
            </div>
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2 text-orange-500" />
              <span className="font-semibold">Event Date:</span> {eventDate || "N/A"}
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2 text-orange-500" />
              <span className="font-semibold">Event Location:</span> {eventLocation || "N/A"}
            </div>
            <div className="flex items-center">
              <FaClock className="mr-2 text-orange-500" />
              <span className="font-semibold">Event Time:</span> {eventTime || "N/A"}
            </div>
          </div>
          {flyerLink && (
            <div className="mt-4">
              <img src={flyerLink} alt={`${eventName} Flyer`} className="w-full rounded-lg" />
            </div>
          )}
        </div>

        {/* Download Ticket Section */}
        <div className="w-full md:w-2/3 p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
          <h2 className="font-bold text-2xl mb-4">Download Your Ticket</h2>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded">
            Download Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default Download;
