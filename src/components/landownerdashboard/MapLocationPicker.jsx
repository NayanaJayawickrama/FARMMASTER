import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AlertModal from '../AlertModal';
import { useAlert } from '../../hooks/useAlert';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ position, setPosition, onLocationSelect, showWarning }) {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      
      // Check if the clicked location is within Sri Lanka boundaries
      if (lat < 5.9 || lat > 9.9 || lng < 79.4 || lng > 81.9) {
        showWarning("Please select a location within Sri Lanka only.");
        return;
      }
      
      const newPosition = [lat, lng];
      setPosition(newPosition);
      
      // Reverse geocoding to get address - restrict to Sri Lanka
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&countrycodes=lk&addressdetails=1`)
        .then(response => response.json())
        .then(data => {
          // Verify the result is in Sri Lanka
          if (data && data.address && data.address.country_code === 'lk') {
            const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            onLocationSelect(address, newPosition);
          } else {
            showWarning("Please select a location within Sri Lanka only.");
            setPosition(null);
          }
        })
        .catch(() => {
          const address = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          onLocationSelect(address, newPosition);
        });
    },
  });

  return position ? <Marker position={position} /> : null;
}

const MapLocationPicker = ({ onLocationSelect, initialLocation = "" }) => {
  // Sri Lanka center coordinates
  const [position, setPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]); // Sri Lanka center
  const [searchQuery, setSearchQuery] = useState(initialLocation);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef();
  const { alert, showWarning, hideAlert } = useAlert();

  // Search for locations
  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Search specifically in Sri Lanka with additional filters
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + " Sri Lanka")}&countrycodes=lk&limit=8&addressdetails=1&bounded=1&viewbox=79.4,9.9,81.9,5.9`
      );
      const data = await response.json();
      
      // Filter results to ensure they are in Sri Lanka
      const filteredResults = data.filter(result => 
        result.address && result.address.country_code === 'lk'
      );
      
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchLocation(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLocationSelect = (address, coordinates) => {
    setSearchQuery(address);
    setSearchResults([]);
    setShowMap(false);
    onLocationSelect(address);
  };

  const selectSearchResult = (result) => {
    const address = result.display_name;
    const coordinates = [parseFloat(result.lat), parseFloat(result.lon)];
    setPosition(coordinates);
    setMapCenter(coordinates);
    handleLocationSelect(address, coordinates);
  };

  const openMapPicker = () => {
    setShowMap(true);
    setSearchResults([]);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a location in Sri Lanka..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-green-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
          <button
            type="button"
            onClick={openMapPicker}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            Select Location
          </button>
        </div>

        {/* Search Loading */}
        {isSearching && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 p-3 shadow-lg z-50">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              Searching...
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg z-50">
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => selectSearchResult(result)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-800">{result.name || result.display_name.split(',')[0]}</div>
                <div className="text-sm text-gray-600 truncate">{result.display_name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl h-96 flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Select Location on Map</h3>
              <button
                onClick={() => setShowMap(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 relative">
              <MapContainer
                center={mapCenter}
                zoom={position ? 15 : 8}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
                maxBounds={[[5.9, 79.4], [9.9, 81.9]]} // Sri Lanka boundaries
                maxBoundsViscosity={1.0} // Prevent dragging outside bounds
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                  position={position}
                  setPosition={setPosition}
                  onLocationSelect={handleLocationSelect}
                  showWarning={showWarning}
                />
              </MapContainer>
              
              {/* Instructions */}
              <div className="absolute top-2 left-2 bg-white p-3 rounded-lg shadow-lg max-w-xs">
                <p className="text-sm text-gray-700">
                📍 Click anywhere on the map to select that location in Sri Lanka
                </p>
              </div>
              
              {/* Sri Lanka Info */}
              <div className="absolute bottom-2 left-2 bg-green-100 p-2 rounded-lg shadow-lg">
                <p className="text-xs text-green-800 font-medium">
                  🇱🇰 Showing Sri Lanka only
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alert.isOpen}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        buttonText={alert.buttonText}
      />
    </div>
  );
};

export default MapLocationPicker;
