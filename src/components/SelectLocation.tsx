import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SelectLocation: React.FC = () => {
  const indiaCenter: [number, number] = [20.5937, 78.9629]; // Coordinates for India's geographic center
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const LocationMarker = () => {
    useMapEvent('click', (event) => {
      const { lat, lng } = event.latlng;
      setSelectedLocation([lat, lng]);
    });

    return selectedLocation ? <Marker position={selectedLocation} /> : null;
  };

  const saveLocation = async () => {
    if (selectedLocation) {
      const locationData = {
        label: 'Current Location',
        details: `Latitude: ${selectedLocation[0]}, Longitude: ${selectedLocation[1]}`,
      };

      try {
        setSaving(true);

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/address`, locationData);

        alert(`Location saved successfully! ID: ${response.data.id}`);
      } catch (error) {
        console.error('Error saving location:', error);
        if (error.response) {
          alert(`Error: ${error.response.data.message || error.message}`);
        } else {
          alert(`An error occurred: ${error.message}`);
        }
      } finally {
        setSaving(false);
      }
    } else {
      alert('Please select a location on the map.');
    }
  };

  const addOtherLocation = () => {
    navigate('/other-location');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-gray-100">
      <h1 className="text-orange-400 text-2xl font-bold my-4">Select Your Current Location</h1>
      <p className="text-gray-400 mb-4">
        Tap on the map to choose your location. Confirm it when you're ready.
      </p>
      <MapContainer
        center={indiaCenter}
        zoom={5}
        style={{ height: '400px', width: '100%' }}
        className="rounded-lg shadow-lg overflow-hidden"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <LocationMarker />
      </MapContainer>

      {selectedLocation && (
        <div className="mt-4 w-full max-w-xs space-y-4">
          <p className="text-orange-400">
            Selected Location: Latitude {selectedLocation[0]}, Longitude {selectedLocation[1]}
          </p>

          {/* Save Location Button */}
          <button
            onClick={saveLocation}
            className={`w-full px-6 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 transition duration-200 ${
              saving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Location'}
          </button>

          {/* Add Other Location Button */}
          <button
            onClick={addOtherLocation}
            className="w-full py-3 bg-purple-500 text-gray-900 font-bold rounded-lg shadow-lg hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-200"
            aria-label="Add other location"
          >
            Add Other Location
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectLocation;
