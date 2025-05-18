import React, { useState, useEffect } from 'react';
import "../Styles/Theaters.css"
import axios from 'axios';

const Theaters = () => {
  // Sample theater data (replace with API call)
  const [theaters, setTheaters] = useState([
    {
      id: 1,
      name: 'City Cinema',
      address: '123 Main St, Downtown, Cityville',
      amenities: ['IMAX', '3D', 'Dolby Atmos'],
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 2,
      name: 'Starplex Theater',
      address: '456 Oak Ave, Suburbia, Cityville',
      amenities: ['4K', 'Recliner Seats'],
      image: 'https://images.unsplash.com/photo-1485095329183-d0797cdc5676?q=80&w=2070&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Galaxy Multiplex',
      address: '789 Pine Rd, Uptown, Cityville',
      amenities: ['IMAX', 'VIP Lounge', 'Dolby Atmos'],
      image: 'https://images.unsplash.com/photo-1570172619644-d4f5fc6ef052?q=80&w=2070&auto=format&fit=crop',
    },
  ]);

  // Simulate fetching theaters from API
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/theaters');
        setTheaters(response.data);
      } catch (error) {
        console.error('Error fetching theaters:', error);
      }
    };
    fetchTheaters();
  }, []);

  return (
    <div className="theaters-page">
      <h1 className="theaters-title">Our Theaters</h1>
      {theaters.length === 0 ? (
        <p className="no-theaters">No theaters found.</p>
      ) : (
        <div className="theaters-grid">
          {theaters.map((theater) => (
            <div key={theater.id} className="theater-card">
              <img
                src={theater.image}
                alt={theater.name}
                className="theater-image"
              />
              <div className="theater-info">
                <h2 className="theater-name">{theater.name}</h2>
                <p className="theater-address">{theater.address}</p>
                <p className="theater-amenities">
                  <strong>Amenities:</strong> {theater.amenities.join(', ')}
                </p>
                <a
                  href={`/showtimes/${theater.id}`}
                  className="showtimes-btn"
                >
                  View Showtimes
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Theaters;