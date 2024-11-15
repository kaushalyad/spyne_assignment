import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Profile = () => {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/cars', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setCars(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCars();
  }, []);

  const handleDelete = async (carId) => {
    try {
      await api.delete(`/cars/${carId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCars(cars.filter((car) => car._id !== carId));  // Remove the deleted car from the list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Your Cars</h2>
      {
        cars.length === 0 && <p className="text-red-600">! No cars found. Add some by clicking the "Add New Car" button.</p>
      }
      <button onClick={() => navigate('/add-car')} className="bg-blue-800 text-white px-3 rounded-sm py-1">+ Add New Car</button>
      <ul>
        {cars.map((car) => (
          <li key={car._id}>
            <h3>{car.title}</h3>
            <p>{car.description}</p>
            <img src={car.images[0]} alt={car.title} width="100" />
            <button onClick={() => navigate(`/edit-car/${car._id}`)}>Edit</button>
            <button onClick={() => handleDelete(car._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
