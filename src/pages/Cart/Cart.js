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
          <div className="mt-5">
            {products.map((item) => (
              <div key={item._id}>
                <ItemCard item={item} ticketDetails={ticketDetails} onQuantityChange={handleQuantityChange} />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => dispatch(resetCart())}
              className="py-2 px-10 bg-red-500 text-white font-semibold uppercase hover:bg-red-700 duration-300"
            >
              Reset Order
            </button>

            <Link className="w-full max-w-sm" to="/checkout">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="w-full text-center py-3 text-white text-lg bg-primeColor hover:bg-black duration-300"
              >
                Proceed to Checkout
              </motion.button>
            </Link>
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
