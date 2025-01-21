import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const LocationButtons: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const enableGPS = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setLoading(false);
        },
        (error) => {
          console.error('Error enabling GPS:', error);
          alert('Unable to retrieve your location. Please check your GPS settings.');
          setLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  const selectLocationManually = () => {
    navigate('/select-location');
  };

  const confirmCurrentLocation = () => {
    if (userLocation) {
      const locationData = {
        label: 'Current Location',  
        details: `Latitude: ${userLocation[0]}, Longitude: ${userLocation[1]}`,
      };

      axios
        .post(`${import.meta.env.VITE_API_URL}/address`, locationData)
        .then(() => {
          navigate('/other-location');
        })
        .catch((error) => {
          console.error('Error saving location:', error);
          alert('Failed to save location. Please try again.');
        });
    }
  };

  const addOtherLocation = () => {
    navigate('/other-location');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-900 text-gray-200">
      <header className="bg-gray-800 text-center py-6 shadow-lg">
        <h1 className="text-3xl font-bold">GeoQuest</h1>
        <p className="text-sm mt-2 italic">
          "Wherever you are, let your location tell your story."
        </p>
      </header>

      <main className="flex-grow p-6">
        {loading ? (
          <p className="text-center text-gray-400 p-4">
            "Searching for your location... hang tight!"
          </p>
        ) : userLocation ? (
          <>
            <p className="text-center mb-4 text-gray-300">
              "Here's where your journey begins."
            </p>
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
          </>
        ) : (
          <p className="text-center text-gray-400 p-4">
            "Enable GPS to uncover the map of your life."
          </p>
        )}
      </main>

      <footer className="p-6 bg-gray-800">
        <div className="flex flex-col gap-4">
          <button
            onClick={enableGPS}
            className="w-full py-3 bg-teal-500 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-300"
            aria-label="Enable GPS and view current location"
          >
            Enable GPS
          </button>

          <button
            onClick={selectLocationManually}
            className="w-full py-3 bg-indigo-500 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300"
            aria-label="Manually select location"
          >
            Select Location Manually
          </button>

          {userLocation && (
            <button
              onClick={confirmCurrentLocation}
              className="w-full py-3 bg-emerald-500 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-300"
              aria-label="Confirm your current location"
            >
              Confirm Current Location
            </button>
          )}

          <button
            onClick={addOtherLocation}
            className="w-full py-3 bg-purple-500 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300"
            aria-label="Add other location"
          >
            Add Other Location
          </button>
        </div>
        <p className="text-center text-gray-500 mt-4 italic">
          "Every location has a story to tell—what's yours?"
        </p>
      </footer>
    </div>
  );
};

export default LocationButtons;
