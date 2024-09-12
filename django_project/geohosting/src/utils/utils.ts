import axios from "axios";


export const setAxiosAuthToken = token => {
  if (typeof token !== "undefined" && token) {
    // Apply for every request
    axios.defaults.headers.common["Authorization"] = "Token " + token;
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};


export const getCurrencyBasedOnLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const locationData = await response.json();
    const userCountry = locationData.country_code;

    let newCurrency = 'USD';
    if (userCountry === 'ZA') newCurrency = 'ZAR';
    else if (['AT', 'BE', 'FR', 'DE', 'IT', 'ES', 'NL', 'PT'].includes(userCountry)) newCurrency = 'EUR';

    return newCurrency;
  } catch (error) {
    console.error('Error determining location or currency:', error);
    return 'USD';
  }
};
