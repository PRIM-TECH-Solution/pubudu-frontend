import React from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import {
  deleteItem,
  drecreaseQuantity,
  increaseQuantity,
} from "../../redux/orebiSlice";

const ItemCard = ({ item, ticketDetails }) => {
  const dispatch = useDispatch();
  
  // Find the corresponding ticket details for the current item
  const itemTicketDetails = ticketDetails.filter(
    (detail) => detail.eventId === item.eventId
  );

  return (
    <div className="w-full grid grid-cols-6 mb-4 border py-2">
      <div className="flex col-span-6 mdl:col-span-2 items-center gap-4 ml-4">
        <ImCross
          onClick={() => dispatch(deleteItem(item._id))}
          className="text-primeColor hover:text-red-500 duration-300 cursor-pointer"
        />
        <img className="w-32 h-32" src={item.image} alt="productImage" />
        <h1 className="font-titleFont font-semibold">{item.name}</h1>
      </div>
      <div className="col-span-6 mdl:col-span-1 flex items-center justify-center text-lg font-semibold">
        <p>{item.ticketType}</p>
      </div>
      <div className="col-span-6 mdl:col-span-1 flex items-center justify-center text-lg font-semibold">
        <p>LKR{item.price}</p>
      </div>
      <div className="col-span-6 mdl:col-span-1 flex items-center justify-center gap-6 text-lg">
        <span
          onClick={() => dispatch(drecreaseQuantity({ _id: item._id }))}
          className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center cursor-pointer hover:bg-gray-300 duration-200"
        >
          -
        </span>
        <span>{item.quantity}</span>
        <span
          onClick={() => dispatch(increaseQuantity({ _id: item._id }))}
          className="w-6 h-6 bg-gray-100 text-xl flex items-center justify-center cursor-pointer hover:bg-gray-300 duration-200"
        >
          +
        </span>
      </div>
      <div className="col-span-6 mdl:col-span-1 flex items-center justify-center text-lg font-semibold">
        <p>LKR{item.price * item.quantity}</p>
      </div>
      {/* Display ticket details if available */}
      {itemTicketDetails.length > 0 && (
        <div className="col-span-6 p-4 bg-gray-100 rounded-md">
          <h3 className="font-semibold">Ticket Details:</h3>
          <ul>
            {itemTicketDetails.map((detail) => (
              <li key={detail.ticketType}>
                {detail.ticketType}: LKR{detail.ticketPrice}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ItemCard;
