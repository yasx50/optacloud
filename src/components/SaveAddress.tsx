import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface Address {
  id: number;
  label: string;
  details: string; // Contains latitude and longitude in string format
  fullAddress?: string; // Optional full address
}

const SaveAddress: React.FC = () => {
  const [address, setAddress] = useState({
    label: "",
    houseNumber: "",
    area: "",
    category: "", // Home, Office, Friends & Family
  });
  const navigate = useNavigate();

  // Handle input change for the form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { houseNumber, area, label, category } = address;

    // Construct the address details string
    const details = `House/Flat/Block No.: ${houseNumber}, Apartment/Road/Area: ${area}`;

    try {
      await axios.post("http://localhost:5000/addresses", {
        label,
        details,
        category,
      });
      alert("Address saved successfully.");
      navigate("/"); // Navigate back to home after saving
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Save Your Address</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Label */}
        <div>
          <label className="block text-gray-800" htmlFor="label">
            Label (e.g., Home, Office, etc.)
          </label>
          <input
            type="text"
            id="label"
            name="label"
            value={address.label}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded-md"
            required
          />
        </div>

        {/* House/Flat/Block Number */}
        <div>
          <label className="block text-gray-800" htmlFor="houseNumber">
            House/Flat/Block No.
          </label>
          <input
            type="text"
            id="houseNumber"
            name="houseNumber"
            value={address.houseNumber}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded-md"
            required
          />
        </div>

        {/* Apartment/Road/Area */}
        <div>
          <label className="block text-gray-800" htmlFor="area">
            Apartment/Road/Area
          </label>
          <input
            type="text"
            id="area"
            name="area"
            value={address.area}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded-md"
            required
          />
        </div>

        {/* Address Category */}
        <div>
          <label className="block text-gray-800" htmlFor="category">
            Select Address Category
          </label>
          <select
            id="category"
            name="category"
            value={address.category}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded-md"
            required
          >
            <option value="">Select</option>
            <option value="Home">Home</option>
            <option value="Office">Office</option>
            <option value="Friends & Family">Friends & Family</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
        >
          Save Address
        </button>
      </form>

      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-6 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition-colors duration-300"
      >
        Back to Home
      </button>
    </div>
  );
};

export default SaveAddress;
