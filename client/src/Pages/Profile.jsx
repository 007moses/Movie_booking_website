import React, { useState, useEffect } from 'react';
import '../Styles/Profile.css';


const Profile = () => {
  // Sample user data (replace with API call)
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1-555-123-4567',
  });

  // Sample recent bookings (subset from MyBookings.jsx, replace with API call)
  const [recentBookings, setRecentBookings] = useState([
    {
      id: 1,
      movieTitle: 'Interstellar',
      theater: 'City Cinema',
      showtime: '2025-04-28 18:00',
      seats: ['A1', 'A2'],
    },
    {
      id: 2,
      movieTitle: 'The Dark Knight',
      theater: 'Starplex',
      showtime: '2025-04-29 20:00',
      seats: ['B3'],
    },
  ]);

  // State for editing profile
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  // Simulate fetching user data and bookings from API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);
  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('http://localhost:5000/api/user/profile', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUser(response.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  

  return (
    <div className="profile-page">
      <h1 className="profile-title">My Profile</h1>
      <div className="profile-container">
        {/* Profile Info Section */}
        <div className="profile-info">
          <h2 className="section-title">Personal Information</h2>
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="edit-btn"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Recent Bookings Section */}
        <div className="recent-bookings">
          <h2 className="section-title">Recent Bookings</h2>
          {recentBookings.length === 0 ? (
            <p className="no-bookings">No recent bookings found.</p>
          ) : (
            <div className="bookings-list">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <h3 className="booking-movie-title">{booking.movieTitle}</h3>
                  <p className="booking-details">
                    <strong>Theater:</strong> {booking.theater}
                  </p>
                  <p className="booking-details">
                    <strong>Showtime:</strong> {booking.showtime}
                  </p>
                  <p className="booking-details">
                    <strong>Seats:</strong> {booking.seats.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          )}
          <a href="/bookings" className="view-all-btn">
            View All Bookings
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;