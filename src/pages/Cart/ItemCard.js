import React from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import {
  deleteItem,
  drecreaseQuantity,
  increaseQuantity,
} from "../../redux/orebiSlice";

const ItemCard = ({ item, ticketDetail }) => {
  const dispatch = useDispatch();
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
      <div className="col-span-6 mdl:col-span-1 flex items-center justify-center text-lg">
        <p>{ticketDetail ? ticketDetail.type : "N/A"}</p>
      </div>
      <div className="col-span-2 mdl:col-span-1 flex items-center justify-center text-lg">
        <p>LKR{item.ticketPice}</p>
      </div>
      <div className="col-span-3 mdl:col-span-1 flex items-center justify-center text-lg">
        <div className="w-28 h-10 flex items-center justify-between text-lg text-gray-600 border p-3">
          <button
            onClick={() => dispatch(drecreaseQuantity(item._id))}
            className="text-base text-gray-400 hover:text-black duration-300 cursor-pointer"
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() => dispatch(increaseQuantity(item._id))}
            className="text-base text-gray-400 hover:text-black duration-300 cursor-pointer"
          >
            +
          </button>
        </div>
      </div>
      <div className="col-span-3 mdl:col-span-1 flex items-center justify-center text-lg font-titleFont font-semibold text-primeColor">
        <p>LKR{item.quantity * item.price}</p>
      </div>
    </div>
  );
};

export default ItemCard;
