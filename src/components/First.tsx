import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const LocationButtons: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Add loading state
  const navigate = useNavigate();

  // Function to enable GPS
  const enableGPS = () => {
    setLoading(true); // Set loading to true
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setLoading(false); // Set loading to false after fetching location
        },
        (error) => {
          console.error('Error enabling GPS:', error);
          alert('Unable to retrieve your location. Please check your GPS settings.');
          setLoading(false); // Set loading to false in case of error
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setLoading(false); // Set loading to false if geolocation is not supported
    }
  };

  // Function to navigate to manual location selection page
  const selectLocationManually = () => {
    navigate('/select-location');
  };

  // Function to save the location and redirect
  const confirmCurrentLocation = () => {
    if (userLocation) {
      // Send POST request to save the current location
      const locationData = {
        label: 'Current Location',
        details: `Latitude: ${userLocation[0]}, Longitude: ${userLocation[1]}`
      };

      axios
        .post(`${import.meta.env.VITE_API_URL}/address`, locationData)
        .then(() => {
          // Redirect user to /other-location after successful POST request
          navigate('/other-location');
        })
        .catch((error) => {
          console.error('Error saving location:', error);
          alert('Failed to save location. Please try again.');
        });
    }
  };

  // Function to navigate to other location page
  const addOtherLocation = () => {
    navigate('/other-location');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-orange-50">
      <div className="flex-grow">
        {/* Conditional rendering based on userLocation */}
        {loading ? (
          <p className="text-center text-orange-700 p-4">Fetching your location...</p>
        ) : userLocation ? (
          <MapContainer
            center={userLocation}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
            aria-label="User's Location Map"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
            <Marker position={userLocation}>
              <Popup>Your Current Location</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p className="text-center text-orange-700 p-4">Enable GPS to view your location on the map.</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center my-8">
        <h1 className="text-4xl font-extrabold text-center text-orange-700 mb-4">OptaCloud</h1>
        <p className="text-orange-700 text-lg mt-4">Assignment for Yash Yadav</p>
        <a
          href="https://yash50.me"
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-700 underline mt-2"
          aria-label="Visit Yash Yadav's portfolio"
        >
          Visit My Portfolio
        </a>
      </div>

      <div className="flex justify-between p-4 bg-orange-100">
        <button
          onClick={enableGPS}
          className="w-1/2 mx-1 py-3 bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300"
          aria-label="Enable GPS and view current location"
        >
          Enable GPS
        </button>
        <button
          onClick={selectLocationManually}
          className="w-1/2 mx-1 py-3 bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300"
          aria-label="Manually select location"
        >
          Select Location Manually
        </button>
      </div>

      <div className="flex justify-between p-4 bg-orange-100">
        <button
          onClick={confirmCurrentLocation}
          className="w-3/4 mx-1 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300"
          aria-label="Confirm your current location"
        >
          Confirm Current Location
        </button>
        <button
          onClick={addOtherLocation}
          className="w-1/2 mx-1 py-3 bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300"
          aria-label="Add other location"
        >
          Add Other Location
        </button>
      </div>
    </div>
  );
};

export default LocationButtons;
