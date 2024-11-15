import React from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const CarCard = ({ car }) => {
  const handleDelete = async () => {
    try {
      await api.delete(`/cars/${car._id}`);
      alert('Car deleted');
      window.location.reload();
    } catch (err) {
      console.error('Error deleting car', err);
    }
  };

  return (
    <div>
      <h3>{car.title}</h3>
      <p>{car.description}</p>
      <img src={car.images[0]} alt={car.title} style={{ width: '100px' }} />
      <div>
        <Link to={`/edit-car/${car._id}`}>Edit</Link>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default CarCard;
