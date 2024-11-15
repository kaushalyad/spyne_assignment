import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import CarCard from './CarCard';

const CarList = () => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/cars');
        setCars(response.data);
      } catch (err) {
        console.error('Error fetching cars', err);
      }
    };

    fetchCars();
  }, []);

  return (
    <div>
      <h2>Your Car Collection</h2>
      <Link to="/add-car">Add a new Car</Link>
      <div>
        {cars.map((car) => (
          <CarCard key={car._id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default CarList;
