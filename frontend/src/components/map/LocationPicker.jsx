import { useState } from 'react';
import MapComponent from './MapComponent';

const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
    );
    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Ошибка геокодирования:', error);
    return null;
  }
};

export default function LocationPicker({ onLocationSelect, initialAddress, initialLat, initialLng }) {
  const [address, setAddress] = useState(initialAddress || '');
  const [lat, setLat] = useState(initialLat || null);
  const [lng, setLng] = useState(initialLng || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGeocode = async () => {
    if (!address.trim()) {
      setError('Введите адрес');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await geocodeAddress(address);
      if (result) {
        setLat(result.lat);
        setLng(result.lng);
        if (onLocationSelect) {
          onLocationSelect(result.lat, result.lng, address);
        }
      } else {
        setError('Адрес не найден');
      }
    } catch (err) {
      setError('Ошибка при поиске адреса');
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (lat, lng) => {
    setLat(lat);
    setLng(lng);
    if (onLocationSelect) {
      onLocationSelect(lat, lng, address);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Введите адрес..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3a7d44] focus:ring-opacity-30"
        />
        <button
          onClick={handleGeocode}
          disabled={loading}
          className="bg-[#3a7d44] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#5a9e66] transition-colors disabled:opacity-50"
        >
          {loading ? 'Поиск...' : 'Найти'}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <MapComponent
        lat={lat}
        lng={lng}
        address={address}
        height="250"
        interactive={true}
        onLocationSelect={handleMapClick}
      />

      {lat && lng && (
        <div className="flex gap-4 text-xs text-gray-500">
          <span>Широта: {lat.toFixed(6)}</span>
          <span>Долгота: {lng.toFixed(6)}</span>
        </div>
      )}
    </div>
  );
}

export { geocodeAddress };