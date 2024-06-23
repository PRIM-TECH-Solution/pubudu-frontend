import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // Correct import if jwtDecode is not a default export

const ProfilePage = () => {
  const [users, setUsers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    nic: "",
    country: "",
    city: "",
    userId:""
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      let decodedToken;
      try {
        decodedToken = jwtDecode(token);
      } catch (error) {
        console.error("Failed to decode token:", error);
        return;
      }

      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        console.error("Token has expired");
        return;
      }

      try {
        const userId = decodedToken.user_id;
        const response = await axios.get(`https://user-event.azurewebsites.net/auth/getUser/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data;
        console.log("Fetched user data:", userData); // Log fetched data for debugging
        setUserDetails({
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          phone: userData.phone,
          nic: userData.nic,
          country: userData.country,
          city: userData.city,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);
  const handleDelete = async (user) => {
    // Logic for deleting the event
    await axios.delete(`https://user-event.azurewebsites.net/auth/${user.userId}`);
    setUsers(users.filter(e => e.userId !== user.userId));
};

const handleUpdate = (user) => {
  // Logic for updating the event
  alert(`Updating user with ID: ${user.userId}`);
};

  return (
    <div className="max-w-container mx-auto px-4">
      
      <div className="flex flex-col md:flex-row w-full py-4">
        <div className="w-full md:w-1/2 p-4 border-r">
          <h2 className="font-bold text-3xl mb-4 underline">My Profile Details</h2>
          <form className="space-y-4">
            {/* Render user details as readonly fields */}
            {Object.keys(userDetails).map((key) => (
              <div key={key} className="flex flex-col">
                <label htmlFor={key} className="mb-1 font-semibold text-base text-gray-700">
                  {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                </label>
                <input
                  id={key}
                  className="w-full p-2 border rounded text-base"
                  type="text"
                  value={userDetails[key]}
                  readOnly
                />
              </div>
            ))}
          </form>
        </div>
        <div className="w-full md:w-1/2 p-4">
        <dev className="flex flex-col items-center justify-center">
        <img src={require('../../assets/images/Profile.jpg')} alt="Profile" className="max-w-full h-auto mb-4" />
        </dev>
         
          
          <button
            onClick={handleUpdate}
            className="mt-2 w-full p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            
          >
            Update My Account
          </button>
          <button
            onClick={handleDelete}
            className="mt-2 w-full p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;