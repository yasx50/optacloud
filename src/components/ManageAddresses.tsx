import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface Address {
  id: number;
  label: string;
  details: string; // Contains latitude and longitude in string format
  fullAddress?: string;  // Optional full address
}

const ManageAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const navigate = useNavigate(); // Initialize navigate

  // Function to extract latitude and longitude from details string
  const extractCoordinates = (details: string) => {
    const regex = /Lat:\s*(-?\d+\.\d+),\s*Lng:\s*(-?\d+\.\d+)/;
    const match = details.match(regex);
    if (match) {
      const latitude = parseFloat(match[1]);
      const longitude = parseFloat(match[2]);
      return { latitude, longitude };
    }
    return { latitude: null, longitude: null };
  };

  // Function to get the full address from latitude and longitude
  const getFullAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${process.env.REACT_APP_OPENCAGE_API_KEY}`
      );
      const data = response.data.results[0];
      return data ? data.formatted : "Address not found"; // Fallback if address is not found
    } catch (error) {
      console.error("Error fetching full address:", error);
      return "Error fetching address"; // Return a fallback message
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/addresses");
        // Fetch full address for each address and set state
        const updatedAddresses = await Promise.all(
          response.data.map(async (address: Address) => {
            // Extract latitude and longitude from the details string
            const { latitude, longitude } = extractCoordinates(address.details);
            const fullAddress = latitude && longitude ? await getFullAddress(latitude, longitude) : "Address not available";
            return {
              ...address,
              fullAddress, // Add full address to the address data
            };
          })
        );
        setAddresses(updatedAddresses);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  const deleteAddress = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/address/${id}`);
      setAddresses((prev) => prev.filter((address) => address.id !== id));
      alert("Address deleted successfully.");
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Failed to delete address. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Manage Your Addresses</h1>
      
      {/* Add description here */}
      <p className="text-lg text-gray-600 text-center mb-4">
        This page shows you your saved addresses. You can manage them by deleting or viewing full address details.
      </p>

      <ul className="space-y-6">
        {addresses.map((address) => (
          <li
            key={address.id}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col space-y-4 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-800">{address.label}</h2>
              <button
                onClick={() => deleteAddress(address.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
              >
                Delete
              </button>
            </div>
            <p className="text-gray-600">{address.details}</p>
            <p className="text-gray-600">
              Full Address: {address.fullAddress ? address.fullAddress : "Address not available"} {/* Add fallback */}
            </p>
          </li>
        ))}
      </ul>

      {/* Button to navigate to Analyse page */}
      <button
        onClick={() => navigate("/analyse")}
        className="mt-6 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
      >
        Analyse Addresses
      </button>

      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")} // Navigate back to home page
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ManageAddresses;
