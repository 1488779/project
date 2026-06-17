const EARTH_RADIUS = 6371;

const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  if (!lat1 || !lng1 || !lat2 || !lng2) return null;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS * c;

  return Math.round(distance * 10) / 10;
};

const formatDistance = (distance) => {
  if (distance === null || distance === undefined) return '—';
  if (distance < 1) {
    return `${Math.round(distance * 1000)} м`;
  }
  return `${distance} км`;
};

module.exports = { calculateDistance, formatDistance };