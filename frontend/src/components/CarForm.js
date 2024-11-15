import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';

const CarForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  const [car, setCar] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchCar = async () => {
        try {
          const response = await api.get(`/cars/${id}`);
          setCar(response.data);
          setTitle(response.data.title);
          setDescription(response.data.description);
          setTags(response.data.tags.join(', '));
        } catch (err) {
          console.error('Error fetching car details', err);
        }
      };

      fetchCar();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags.split(','));

    try {
      if (id) {
        await api.put(`/cars/${id}`, formData);
        alert('Car updated');
      } else {
        await api.post('/cars', formData);
        alert('Car added');
      }
      navigate('/profile');
    } catch (err) {
      console.error('Error saving car', err);
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Car' : 'Add New Car'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Car Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Car Description"
          required
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated)"
        />
        <input
          type="file"
          multiple
          onChange={(e) => setImages([...e.target.files])}
        />
        <button type="submit">{id ? 'Update Car' : 'Add Car'}</button>
      </form>
    </div>
  );
};

export default CarForm;
