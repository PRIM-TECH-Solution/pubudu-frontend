import React, { useState, useEffect } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import {
  deleteItem,
  //decreaseQuantity,
  //increaseQuantity,
} from "../../redux/orebiSlice";

const ItemCard = ({ item, ticketDetails, onQuantityChange }) => {
  const dispatch = useDispatch();

  const [selectedTickets, setSelectedTickets] = useState([]);

  useEffect(() => {
    const initialTickets = ticketDetails.map(detail => ({
      ticketType: detail.ticketType,
      quantity: item.ticketType === detail.ticketType ? item.quantity : 0
    }));
    setSelectedTickets(initialTickets);
  }, [item.ticketType, item.quantity, ticketDetails]);

  const handleQuantityChange = (index, increment) => {
    const newSelectedTickets = [...selectedTickets];
    if (increment) {
      newSelectedTickets[index].quantity += 1;
    } else {
      if (newSelectedTickets[index].quantity > 0) {
        newSelectedTickets[index].quantity -= 1;
      }
    }
    setSelectedTickets(newSelectedTickets);
    onQuantityChange(newSelectedTickets);
  };

  const calculateSubtotal = (ticket) => {
    if (ticket && ticket.ticketType) {
      const ticketDetail = ticketDetails.find(detail => detail.ticketType === ticket.ticketType);
      return ticketDetail ? ticketDetail.ticketPrice * ticket.quantity : 0;
    }
    return 0;
  };

  const totalSubtotal = selectedTickets.reduce((acc, ticket) => acc + calculateSubtotal(ticket), 0);

  return (
    <div className="w-full border py-2 mb-4">
      <div className="flex items-center gap-4 ml-4">
        <ImCross
          onClick={() => dispatch(deleteItem(item._id))}
          className="text-primeColor hover:text-red-500 duration-300 cursor-pointer"
        />
        <img className="w-32 h-32" src={item.image} alt="productImage" />
        <h1 className="font-titleFont font-semibold">{item.name}</h1>
      </div>
      {ticketDetails.map((ticketDetail, index) => (
        <div key={index} className="flex items-center justify-between px-4 py-2 border-t">
          <div className="flex items-center gap-4">
            <p>{ticketDetail.ticketType}</p>
            <p>LKR{ticketDetail.ticketPrice}</p>
          </div>
          <div className="flex items-center gap-6">
            <span
              onClick={() => handleQuantityChange(index, false)}
              className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center cursor-pointer hover:bg-gray-300 duration-200"
            >
              -
            </span>
            <span>{selectedTickets[index] ? selectedTickets[index].quantity : 0}</span>
            <span
              onClick={() => handleQuantityChange(index, true)}
              className="w-6 h-6 bg-gray-100 text-xl flex items-center justify-center cursor-pointer hover:bg-gray-300 duration-200"
            >
              +
            </span>
            <p>LKR{calculateSubtotal(selectedTickets[index])}</p>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-end px-4 py-2 border-t">
        <p className="font-semibold">Total: LKR{totalSubtotal}</p>
      </div>
    </div>
  );
};

export default ItemCard;
