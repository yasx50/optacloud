import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Map: React.FC = () => {
    const [position, setPosition] = useState<[number, number] | null>(null);
    const [decodedAddress, setDecodedAddress] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [addressDetails, setAddressDetails] = useState({
        houseNumber: "",
        area: "",
        category: "Home", // Default category
    });
    const navigate = useNavigate();

    // Search address based on input query
    const searchAddress = async () => {
        if (!searchQuery.trim()) {
            alert("Please enter an address to search!");
            return;
        }

        try {
            const response = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${searchQuery}&key=4e1557ee96a642aca119983640a64e24`
            );
            const data = response.data.results[0];
            if (data) {
                const lat = data.geometry.lat;
                const lng = data.geometry.lng;
                setPosition([lat, lng]);
                alert(`Found address: ${searchQuery}`);
            } else {
                alert("No results found for the address.");
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            alert("Failed to fetch address. Please try again.");
        }
    };

    // Request user's location and update the map center
    const requestLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPosition([latitude, longitude]); // Update map center to user's location
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to retrieve your location.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        requestLocation(); // Request location when the component mounts
    }, []);

    const LocationMarker = () => {
        useMapEvents({
            click: async (e) => {
                const lat = e.latlng.lat;
                const lng = e.latlng.lng;
                setPosition([lat, lng]);

                // Fetch address from reverse geocoding
                try {
                    const response = await axios.get(
                        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=4e1557ee96a642aca119983640a64e24`
                    );
                    const data = response.data.results[0];
                    if (data) {
                        setDecodedAddress(data.formatted);
                    } else {
                        alert("No address found for the selected location.");
                    }
                } catch (error) {
                    console.error("Error decoding location:", error);
                    alert("Failed to decode location. Please try again.");
                }
            },
        });

        return position ? <Marker position={position}></Marker> : null;
    };

    const saveAddress = async () => {
        if (!position) {
            alert("Please select a location!");
            return;
        }

        const addressData = {
            label: addressDetails.category, // Use category as label
            details: `Lat: ${position[0]}, Lng: ${position[1]}`,
            houseNumber: addressDetails.houseNumber,
            area: addressDetails.area,
            category: addressDetails.category,
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/address`, addressData);
            alert(`Address saved: ${response.data.label}`);
            setShowModal(false); // Close the modal after saving
        } catch (error) {
            console.error("Error saving address:", error);
            alert("Failed to save address. Please try again.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Select Your Other Location</h1>

            {/* Map Component */}
            <div className="mt-6">
                <input
                    type="text"
                    placeholder="Search for an address"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={searchAddress}
                    className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                    Search Address
                </button>
            </div>

            
            {!showModal && (
                <MapContainer
                    center={position || [51.505, -0.09]} // Fallback to default if no position is set
                    zoom={13}
                    style={{ height: "400px", width: "100%" }}
                    className={`rounded-lg shadow-md ${showModal ? "pointer-events-none" : ""}`}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker />
                </MapContainer>
            )}

            {/* Search Address */}

            {/* Show Selected Position */}
            {position && (
                <div className="mt-6 p-4 border rounded-lg shadow-md bg-white">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Selected Location:</h2>
                    <p className="text-gray-600">Latitude: {position[0]}</p>
                    <p className="text-gray-600">Longitude: {position[1]}</p>
                    {decodedAddress && <p className="text-gray-600">Address: {decodedAddress}</p>}
                    <button
                        onClick={() => setShowModal(true)} // Open the modal when clicking Save Address
                        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                    >
                        Save Address
                    </button>
                </div>
            )}

            <button
                onClick={() => navigate("/manage")}
                className="mt-6 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
            >
                Manage Addresses
            </button>

            {/* Modal for entering additional address details */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Address Details</h2>
                        <input
                            type="text"
                            placeholder="House/Flat/Block No."
                            value={addressDetails.houseNumber}
                            onChange={(e) =>
                                setAddressDetails((prev) => ({
                                    ...prev,
                                    houseNumber: e.target.value,
                                }))
                            }
                            className="w-full p-3 border border-gray-300 rounded-md mb-4"
                        />
                        <input
                            type="text"
                            placeholder="Apartment/Road/Area"
                            value={addressDetails.area}
                            onChange={(e) =>
                                setAddressDetails((prev) => ({
                                    ...prev,
                                    area: e.target.value,
                                }))
                            }
                            className="w-full p-3 border border-gray-300 rounded-md mb-4"
                        />
                        <div className="mb-4">
                            <label className="text-gray-700">Category:</label>
                            <select
                                value={addressDetails.category}
                                onChange={(e) =>
                                    setAddressDetails((prev) => ({
                                        ...prev,
                                        category: e.target.value,
                                    }))
                                }
                                className="w-full p-3 border border-gray-300 rounded-md"
                            >
                                <option value="Home">Home</option>
                                <option value="Office">Office</option>
                                <option value="Friends & Family">Friends & Family</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowModal(false)} // Close the modal
                                className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveAddress}
                                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                            >
                                Save Address
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Map;
