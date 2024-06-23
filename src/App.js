import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [location, setLocation] = useState({});
  const [error, setError] = useState(null);
  const [address, setAddress] = useState('');

  const geolocationAPI = navigator.geolocation;

  const getLocation = () => {
    if (!geolocationAPI) {
      setError('Geolocation API is not available in your browser!');
    } else {
      geolocationAPI.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const timestamp = new Date(position.timestamp).toLocaleString();
          setLocation({ latitude, longitude, accuracy, timestamp });
          getAddress(latitude, longitude);
        },
        (error) => {
          setError(error.message);
        }
      );
    }
  };

  const getAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key={YOUR API KEY}`);
      const address = response.data.results[0]?.formatted;
      setAddress(address);
    } catch (error) {
      setError('Unable to retrieve address information.');
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Geolocation Information</h1>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <div>
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
            <p>Accuracy: {location.accuracy} meters</p>
            <p>Timestamp: {location.timestamp}</p>
            <p>Address: {address}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;