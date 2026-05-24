function isValidPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const regex = /^(\+7|8)[0-9]{10}$/;
  return regex.test(cleaned);
}

function isValidEmail(email) {
  if (!email) return true;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidEmailOrPhone(value) {
  if (!value) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(value)) return true;
  const cleaned = value.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^(\+7|8)[0-9]{10}$/;
  return phoneRegex.test(cleaned);
}

function isValidFullName(name) {
  if (!name || name.trim().length < 5) return false;
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return false;
  const regex = /^[а-яА-Яa-zA-Z\s\-]+$/;
  return regex.test(name);
}

function isValidCity(city) {
  return city && city.trim().length >= 2;
}

function isValidOrgName(name) {
  return name && name.trim().length >= 3;
}

function isValidAddress(address) {
  return address && address.trim().length >= 5;
}

function isValidPassword(password) {
  return password && password.length >= 6;
}

module.exports = {
  isValidPhone,
  isValidEmail,
  isValidEmailOrPhone,
  isValidFullName,
  isValidCity,
  isValidOrgName,
  isValidAddress,
  isValidPassword
};