import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddCar from './components/AddCar';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import PrivateRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-car" element={<PrivateRoute><AddCar /></PrivateRoute>} />
        <Route path="/" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
