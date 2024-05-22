// src/components/home/Products/ProductInfo.js
import React from "react";
import { addToCart } from "../../../redux/orebiSlice";

const ProductInfo = ({ productInfo, dispatch }) => {
  const highlightStyle = {
    color: "#d0121a", 
    fontWeight: "bold", 
  };

  const renderDescription = () => {
    if (!productInfo.des) {
      return null;
    }

    const description = productInfo.des.split(/:(.*?)-/).map((part, index) => {
      return (
        <span key={index} style={index % 2 === 1 ? highlightStyle : {}}>
          {part}
        </span>
      );
    });

    return <>{description}</>;
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-4xl font-semibold">{productInfo.productName}</h2>
      <p className="text-2xl font-semibold">
        {productInfo.ticketdetails} 
        {/* <span className="text-xl font-semibold line-through ml-2">540</span> */}
        {/* <span className="text-xs ml-2 inline-flex items-center px-3 py-1 rounded-full bg-green-600 text-white">
          Save 100
        </span> */}
        <span className="text-lg ml-2">Location: {productInfo.location}</span>
      </p>
      
      <hr />
      <p className="text-base text-gray-600">{renderDescription()}</p>
      <div className="flex items-center">
        <p className="text-sm mr-2"> Ratings </p>
        {[...Array(4)].map((_, index) => (
          <svg
            key={index}
            className="w-4 h-4 text-yellow-300 ms-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        ))}
        <svg
          className="w-4 h-4 ms-1 text-gray-300 dark:text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 22 20"
        >
          <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
        </svg>
      </div>

      <p className="font-medium text-lg">
        <span className="font-normal">Category:</span> {productInfo.color}
      </p>
      <button
        onClick={() =>
          dispatch(
            addToCart({
              _id: productInfo._id,
              name: productInfo.productName,
              quantity: 1,
              image: productInfo.img,
              description: productInfo.des,
              badge: productInfo.badge,
              price: productInfo.price,
              colors: productInfo.color,
              time: productInfo.time,
              location: productInfo.location,
            })
          )
        }
        className="w-full py-4 bg-blue-500 hover:bg-blue-600 duration-300 text-white text-lg font-titleFont"
      >
        Book Your Ticket
      </button>
    </div>
  );
};

export default ProductInfo;
