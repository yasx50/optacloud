
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvent } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SelectLocation: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>([51.505, -0.09]);

  const LocationMarker = () => {
    useMapEvent('click', (event) => {
      const { lat, lng } = event.latlng;
      setSelectedLocation([lat, lng]);
    });

    return selectedLocation ? <Marker position={selectedLocation} /> : null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-orange-50">
      <h1 className="text-orange-700 text-xl font-bold my-4">Select Your Current  Location</h1>
      <MapContainer
        center={selectedLocation || [51.505, -0.09]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}; 

export default SelectLocation;
