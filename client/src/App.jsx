import './App.css'
import Navbar from './Components/NavBar'
import Home from './Pages/Home'
import Movies from './Pages/Movies'
import {BrowserRouter,Routes,Route} from "react-router-dom"
import MyBookings from './Pages/MyBookings'
import Theaters from './Pages/Theaters'
import Profile from './Pages/Profile'
import LoginSignup from './Pages/LoginSignUp'
import MovieDetails from './Pages/MovieDetails.jsx'

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:title" element={<MovieDetails />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/theaters" element={<Theaters />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<LoginSignup />} />
        {/* Placeholder for booking page */}
        <Route path="/booking/:movieId/:theaterId/:showtime" element={<div>Booking Page (TBD)</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
