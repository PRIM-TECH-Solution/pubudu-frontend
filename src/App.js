import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  createRoutesFromElements,
  Route,
  Navigate,
  ScrollRestoration,
} from "react-router-dom";
import Footer from "./components/home/Footer/Footer";
import FooterBottom from "./components/home/Footer/FooterBottom";
import Header from "./components/home/Header/Header";
import HeaderBottom from "./components/home/Header/HeaderBottom";
import SpecialCase from "./components/SpecialCase/SpecialCase";
import About from "./pages/About/About";
import SignIn from "./pages/Account/SignIn";
import SignUp from "./pages/Account/SignUp";
import GuestBooking from "./pages/Guest Booking/GuestBooking";
import Cart from "./pages/Cart/Cart";
import Contact from "./pages/Contact/Contact";
import Home from "./pages/Home/Home";
import Checkout from "./pages/Checkout/Checkout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Payment from "./pages/payment/Payment";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Shop from "./pages/Shop/Shop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainComponent from "./components/home/Products/MainComponent";
import CreateEvent from "./pages/Admin/CreateEvent";
import EventList from "./pages/Admin/EventList";
import AdminPanel from "./pages/Admin/AdminPanel";
import Services from "./pages/Admin/Services";
import {jwtDecode} from "jwt-decode";  // Correct import

const token = localStorage.getItem('token');
let userRole = '';

if (token) {
  try {
    const decoded = jwtDecode(token);
    userRole = decoded.role;
  } catch (error) {
    console.error('Invalid token', error);
    localStorage.removeItem('token');
  }
}

const isAdmin = userRole === 'ADMIN';

const Layout = () => (
  <div>
    <ToastContainer
      position="top-right"
      autoClose={1000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
    <Header />
    <HeaderBottom />
    <SpecialCase />
    <ScrollRestoration />
    <Outlet />
    <Footer />
    <FooterBottom />
  </div>
);

const AdminRoute = ({ element }) => {
  return isAdmin ? element : <Navigate to="/" />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:_id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/paymentgateway" element={<Payment />} />
        <Route path="/products" element={<MainComponent />} />
      </Route>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/guestbooking" element={<GuestBooking />}></Route>
      <Route path="/admindashboard" element={<AdminRoute element={<AdminDashboard />} />} />
      <Route path="/adminpanel" element={<AdminRoute element={<AdminPanel />} />} />
      <Route path="/eventcreation" element={<AdminRoute element={<CreateEvent />} />} />
      <Route path="/eventlist" element={<AdminRoute element={<EventList />} />} />
      <Route path="/services" element={<AdminRoute element={<Services />} />} />
    </Route>
  )
);

function App() {
  return (
    <div className="font-bodyFont">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;



// import {
//   createBrowserRouter,
//   RouterProvider,
//   Outlet,
//   createRoutesFromElements,
//   Route,
//   ScrollRestoration,
// } from "react-router-dom";
// import Footer from "./components/home/Footer/Footer";
// import FooterBottom from "./components/home/Footer/FooterBottom";
// import Header from "./components/home/Header/Header";
// import HeaderBottom from "./components/home/Header/HeaderBottom";
// import SpecialCase from "./components/SpecialCase/SpecialCase";
// import About from "./pages/About/About";
// import SignIn from "./pages/Account/SignIn";
// import SignUp from "./pages/Account/SignUp";
// import Cart from "./pages/Cart/Cart";
// import GuestBooking from "./pages/Guest Booking/GuestBooking";
// import Contact from "./pages/Contact/Contact";
// import Home from "./pages/Home/Home";
// import Checkout from "./pages/Checkout/Checkout";
// import Offer from "./pages/Offer/Offer";
// import Payment from "./pages/payment/Payment";
// import ProductDetails from "./pages/ProductDetails/ProductDetails";
// import Shop from "./pages/Shop/Shop";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import MainComponent from "./components/home/Products/MainComponent";
// import CreateEvent from "./pages/Admin/CreateEvent";
// import EventList from "./pages/Admin/EventList";
// import AdminPanel from "./pages/Admin/AdminPanel";
// import Services from "./pages/Admin/Services";
// import AdminDashboard from "./pages/Admin/AdminDashboard";
// const Layout = () => {
//   return (
//     <div>
//       <ToastContainer
//         position="top-right"
//         autoClose={1000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//       />
//       <Header />
//       <HeaderBottom />
//       <SpecialCase />
//       <ScrollRestoration />
//       <Outlet />
//       <Footer />
//       <FooterBottom />
//     </div>
//   );
// };

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route>
//       <Route path="/" element={<Layout />}>
//         {/* ==================== Header Navlink Start here =================== */}
//         <Route index element={<Home />}></Route>
//         <Route path="/shop" element={<Shop />}></Route>
//         <Route path="/about" element={<About />}></Route>
//         <Route path="/contact" element={<Contact />}></Route>
//         <Route path="/checkout" element={<Checkout />}></Route>
//         {/* ==================== Header Navlink End here ===================== */}
//         <Route path="/category/:category" element={<Offer />}></Route>
//         <Route path="/product/:_id" element={<ProductDetails />}></Route>
//         <Route path="/cart" element={<Cart />}></Route>
//         <Route path="/paymentgateway" element={<Payment />}></Route>
//         <Route path="/products" element={<MainComponent />}></Route> {/* New Route */}
//       </Route>
//       <Route path="/signup" element={<SignUp />}></Route>
//       <Route path="/signin" element={<SignIn />}></Route>
//       <Route path="/guestbooking" element={<GuestBooking />}></Route>
//       <Route path="/admindashboard" element={<AdminDashboard />}></Route>
//       <Route path="/adminpanel" element={<AdminPanel />}></Route>
//       <Route path="/eventcreation" element={<CreateEvent />}></Route>
//       <Route path="/eventlist" element={<EventList />}></Route>
//       <Route path="/services" element={<Services />}></Route>
//     </Route>
//   )
// );

// function App() {
//   return (
//     <div className="font-bodyFont">
//       <RouterProvider router={router} />
//     </div>
//   );
// }

// export default App;
