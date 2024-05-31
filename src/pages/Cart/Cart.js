import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { resetCart } from "../../redux/orebiSlice";
import { emptyCart } from "../../assets/images/index";
import ItemCard from "./ItemCard";

const Cart = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.orebiReducer.products);
  const [totalAmt, setTotalAmt] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [ticketDetails, setTicketDetails] = useState([]);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const eventIds = products.map((item) => item.eventId);
        const responses = await Promise.all(
          eventIds.map(eventId =>
            axios.get(`http://localhost:8080/eventcards/customTicketDetails/${eventId}`)
          )
        );

        const fetchedDetails = responses.flatMap(response => response.data);
        setTicketDetails(fetchedDetails);
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      }
    };

    fetchTicketDetails();
  }, [products]);

  const handleQuantityChange = (newSelectedTickets) => {
    let newTotalAmt = 0;
    newSelectedTickets.forEach(ticket => {
      const ticketDetail = ticketDetails.find(detail => detail.ticketType === ticket.ticketType);
      if (ticketDetail) {
        newTotalAmt += ticketDetail.ticketPrice * ticket.quantity;
      }
    });
    setTotalAmt(newTotalAmt);
  };

  useEffect(() => {
    if (totalAmt <= 200) {
      setShippingCharge(30);
    } else if (totalAmt <= 400) {
      setShippingCharge(25);
    } else if (totalAmt > 401) {
      setShippingCharge(20);
    }
  }, [totalAmt]);

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Select Your Tickets" />
      {products.length > 0 ? (
        <div className="pb-20">
          <div className="">
            {/* <h2 className="col-span-2">Your Event Ticket</h2>
            <h2>Ticket Type</h2>
            <h2>Price</h2>
            <h2>Quantity</h2>
            <h2>Sub Total</h2> */}
          </div>
          <div className="mt-5">
            {products.map((item) => (
              <div key={item._id}>
                <ItemCard item={item} ticketDetails={ticketDetails} onQuantityChange={handleQuantityChange} />
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
              <p className="text-sm mdl:text-base font-semibold">
                Apply Coupon
              </p>
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
                  Total Amount
                  <span className="font-bold tracking-wide text-lg font-titleFont">
                    LKR{totalAmt + shippingCharge}
                  </span>
                </p>
              </div>
              <Link className="w-full" to="/checkout">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full text-center py-3 text-white text-lg bg-primeColor hover:bg-black duration-300"
                >
                  Process To Checkout
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ y: 70, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="w-full flex flex-col items-center justify-center gap-4 pb-20">
            <img
              className="w-1/3 object-cover"
              src={emptyCart}
              alt="emptyCartImg"
            />
            <p className="text-lg text-primeColor font-titleFont font-semibold">
              Your Event Ticket is empty!
            </p>
            <Link className="w-full md:w-96" to="/">
              <button className="w-full text-center py-3 text-white text-lg bg-primeColor hover:bg-black duration-300">
                Go Back
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Cart;
