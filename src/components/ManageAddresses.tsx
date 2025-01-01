import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Address {
  id: number;
  label: string;
  details: string; // Contains latitude and longitude in string format
  fullAddress?: string;  // Optional full address
}

const ManageAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const navigate = useNavigate();

  // Function to extract latitude and longitude from details string
  const extractCoordinates = (details: string) => {
    // Adjusting regex to handle both "Lat:" and "Lng:" formats, including potential spaces
    const regex = /Lat:\s*(-?\d+\.\d+),\s*Lng:\s*(-?\d+\.\d+)/;
    console.log("Extracting from details:", details);  // Log details to check the format
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
    if (latitude && longitude) {
      try {
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=4e1557ee96a642aca119983640a64e24`
        );
        const data = response.data.results[0];
        console.log(data)
        return data ? data.formatted : "Address not found"; // Fallback if address is not found
      } catch (error) {
        console.error("Error fetching full address:", error);
        return "Error fetching address";
      }
    } else {
      return "Invalid coordinates"; // Return message if coordinates are invalid
    }
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/addresses`);
        const updatedAddresses = await Promise.all(
          response.data.map(async (address: Address) => {
            // Check the coordinates in the details
            const { latitude, longitude } = extractCoordinates(address.details);
            console.log("Latitude:", latitude, "Longitude:", longitude);  // Log the extracted coordinates

            // Get the full address if coordinates are valid
            const fullAddress = latitude && longitude ? await getFullAddress(latitude, longitude) : "Address not available";
            console.log("full address",fullAddress)
            return {
              ...address,
              fullAddress, 
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/address/${id}`);
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
              Full Address: {address.fullAddress ? address.fullAddress : "Address not available"}
            </p>
          </li>
        ))}
      </ul>

      <button
        onClick={() => navigate("/analyse")}
        className="mt-6 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
      >
        Analyse Addresses
      </button>

      <button
        onClick={() => navigate("/")}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
      >
        Back to Home
      </button>
    </div>
  );
};

export default ManageAddresses;
