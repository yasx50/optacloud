import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Analyse: React.FC = () => {
  const [addresses, setAddresses] = useState<any[]>([]); // Replace 'any' with your address type
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null); // State for user's current location
  const navigate = useNavigate(); // Initialize navigate function

  // Fetch current location using Geolocation API
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting current location:", error);
            // Default to a generic location if the geolocation fails
            setCurrentLocation({ lat: 20.5937, lng: 78.9629 });
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
        // Default to a generic location if geolocation is not available
        setCurrentLocation({ lat: 20.5937, lng: 78.9629 });
      }
    };

    getCurrentLocation();
  }, []);

  // Fetch all saved addresses from your backend
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/addresses"); // Adjust the URL as needed
        setAddresses(response.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  // Function to safely extract latitude and longitude from the address details
  const extractCoordinates = (details: string) => {
    const regex = /Lat:\s*(-?\d+\.\d+),\s*Lng:\s*(-?\d+\.\d+)/;
    const match = details.match(regex);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2]),
      };
    }
    return null;
  };

  if (!currentLocation) {
    return <div>Loading your location...</div>; // Loading state while waiting for geolocation
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Analyse Saved Addresses</h1>
      <p className="text-center text-gray-600 mb-6">
        This page will show you all your saved locations on the map.
      </p>

      <MapContainer
        center={[currentLocation.lat, currentLocation.lng]} // Set map center to current location
        zoom={13}
        style={{ height: "400px", width: "100%" }}
        className="rounded-lg shadow-md"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {addresses.map((address, index) => {
          const coordinates = extractCoordinates(address.details);
          if (coordinates) {
            return (
              <Marker key={index} position={[coordinates.latitude, coordinates.longitude]}>
                <Popup>{address.label}</Popup>
              </Marker>
            );
          }
          return null; // Skip if coordinates are invalid or not available
        })}
      </MapContainer>

      {/* Go to Home Page Button */}
      <button
        onClick={() => navigate("/")} // Navigate to home page
        className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
      >
        Go to Home Page
      </button>
    </div>
  );
};

export default Analyse;
