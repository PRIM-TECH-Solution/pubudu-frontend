import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images/index";
import ItemCard from "./ItemCard";
import axios from "axios";

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);
  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [ticketDetails, setTicketDetails] = useState([]);
  const [missingEventIdProducts, setMissingEventIdProducts] = useState([]);
  const [failedToFetchDetails, setFailedToFetchDetails] = useState(false);

  useEffect(() => {
    let price = 0;
    products.forEach((item) => {
      price += item.price * item.quantity;
    });
    setTotalAmt(price);
  }, [products]);

  useEffect(() => {
    if (totalAmt <= 200) {
      setShippingCharge(30);
    } else if (totalAmt <= 400) {
      setShippingCharge(25);
    } else if (totalAmt > 401) {
      setShippingCharge(20);
    }
  }, [totalAmt]);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const missingEventIdProducts = products.filter(product => !product.eventId);
        setMissingEventIdProducts(missingEventIdProducts);

        const ticketDetailsPromises = products.map((product) => {
          if (!product.eventId) {
            return Promise.resolve(null);
          }
          return axios.get(`http://localhost:8080/customTicketDetails/${product.eventId}`)
            .then(response => response.data)
            .catch((error) => {
              if (error.response && error.response.status === 404) {
                console.warn(`Ticket details not found for eventId: ${product.eventId}`);
                return null;
              }
              console.error(`Error fetching details for eventId: ${product.eventId}`, error);
              throw error;
            });
        });

        const ticketDetailsResponses = await Promise.all(ticketDetailsPromises);
        setTicketDetails(ticketDetailsResponses);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
        setFailedToFetchDetails(true);
      }
    };

    if (products.length > 0) {
      fetchTicketDetails();
    }
  }, [products]);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Select Your Tickets" />
      {products.length > 0 ? (
        <div className="pb-20">
          {missingEventIdProducts.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Warning!</strong>
              <span className="block sm:inline"> Some products are missing event IDs and will not be processed.</span>
            </div>
          )}
          {failedToFetchDetails && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Notice:</strong>
              <span className="block sm:inline"> Some ticket details could not be fetched. Please try again later.</span>
            </div>
          )}
          <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-6 place-content-center px-6 text-lg font-titleFont font-semibold">
            <h2 className="col-span-2">Your Event Ticket</h2>
            <h2>Ticket Type</h2>
            <h2>Price</h2>
            <h2>Quantity</h2>
            <h2>Sub Total</h2>
          </div>
          <div className="mt-5">
            {products.map((item, index) => (
              <div key={item._id}>
                <ItemCard item={item} ticketDetail={ticketDetails[index]} />
              </div>
            ))}
          </div>
          <button
            onClick={() => dispatch(resetCart())}
            className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
          >
            Reset Order
          </button>

          <div className="flex flex-col mdl:flex-row justify-between border py-4 px-4 items-center gap-2 mdl:gap-0">
            <div className="flex items-center gap-4">
              <input
                className="w-44 mdl:w-52 h-8 px-4 border text-primeColor text-sm outline-none border-gray-400"
                type="text"
                placeholder="Coupon Number"
              />
              <p className="text-sm mdl:text-base font-semibold">Apply Coupon</p>
            </div>
            <p className="text-lg font-semibold">Update Cart</p>
          </div>
          <div className="max-w-7xl gap-4 flex justify-end mt-4">
            <div className="w-96 flex flex-col gap-4">
              <h1 className="text-2xl font-semibold text-right">Ticket totals</h1>
              <div>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Subtotal
                  <span className="font-semibold tracking-wide font-titleFont">
                    LKR{totalAmt}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
                  Extra Charge
                  <span className="font-semibold tracking-wide font-titleFont">
                    LKR{shippingCharge}
                  </span>
                </p>
                <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
                  Total
                  <span className="font-bold tracking-wide text-lg font-titleFont">
                    LKR{totalAmt + shippingCharge}
                  </span>
                </p>
              </div>
              <div className="flex justify-end">
                <Link to="/paymentgateway">
                  <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300">
                    Proceed to Checkout
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
        >
          <div>
            <img
              className="w-80 rounded-lg p-4 mx-auto"
              src={emptyCart}
              alt="emptyCart"
            />
          </div>
          <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
            <h1 className="font-titleFont text-xl font-bold uppercase">
              Your Cart feels lonely.
            </h1>
            <p className="text-sm text-center px-10 -mt-2">
              Your Shopping cart lives to serve. Give it purpose - fill it with
              books, electronics, videos, etc. and make it happy.
            </p>
            <Link to="/shop">
              <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
                Continue Booking
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
