import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

export default function MapComponent({ 
  lat, 
  lng, 
  address, 
  height = "200", 
  zoom = 13,
  interactive = false,
  onLocationSelect 
}) {
  const position = [lat || 56.838, lng || 60.605];
  const hasCoords = lat && lng;

  return (
    <MapContainer
      center={position}
      zoom={zoom}
      className="rounded-xl w-full"
      style={{ height: height + 'px' }}
      scrollWheelZoom={interactive}
      zoomControl={interactive}
      dragging={interactive}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {hasCoords && (
        <Marker 
          position={position}
          draggable={interactive}
          eventHandlers={{
            dragend: (e) => {
              if (onLocationSelect) {
                const { lat, lng } = e.target.getLatLng();
                onLocationSelect(lat, lng);
              }
            }
          }}
        >
          <Popup>{address || '📍 Точка на карте'}</Popup>
        </Marker>
      )}
      <MapController center={position} />
    </MapContainer>
  );
}