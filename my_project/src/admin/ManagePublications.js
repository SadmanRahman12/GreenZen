import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManagePublications = () => {
  const [publications, setPublications] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    content: '',
    imageUrl: '',
    tags: '',
    slug: '',
  });
  const [editingPublicationId, setEditingPublicationId] = useState(null);

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/publications');
      setPublications(res.data);
    } catch (err) {
      console.error('Error fetching publications:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    };

    try {
      if (editingPublicationId) {
        await axios.put(
          `http://localhost:5000/api/publications/${editingPublicationId}`,
          formData,
          config
        );
        alert('Publication updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/publications', formData, config);
        alert('Publication added successfully!');
      }
      setFormData({
        title: '',
        author: '',
        content: '',
        imageUrl: '',
        tags: '',
        slug: '',
      });
      setEditingPublicationId(null);
      fetchPublications();
    } catch (err) {
      console.error('Error saving publication:', err);
      alert('Error saving publication.');
    }
  };

  const handleEdit = (publication) => {
    setFormData({
      title: publication.title,
      author: publication.author,
      content: publication.content,
      imageUrl: publication.imageUrl,
      tags: publication.tags.join(', '), // Assuming tags are an array
      slug: publication.slug,
    });
    setEditingPublicationId(publication._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      const token = localStorage.getItem('authToken');
      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      try {
        await axios.delete(`http://localhost:5000/api/publications/${id}`, config);
        alert('Publication deleted successfully!');
        fetchPublications();
      } catch (err) {
        console.error('Error deleting publication:', err);
        alert('Error deleting publication.');
      }
    }
  };

  return (
    <div>
      <h3>{editingPublicationId ? 'Edit Publication' : 'Add New Publication'}</h3>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-form-group">
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="admin-form-group">
          <label>Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className="admin-form-group">
          <label>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
          />
        </div>
        <div className="admin-form-group">
          <label>Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
          />
        </div>
        <div className="admin-form-group">
          <label>Slug</label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="admin-button">
          {editingPublicationId ? 'Update Publication' : 'Add Publication'}
        </button>
        {editingPublicationId && (
          <button
            type="button"
            className="admin-button"
            onClick={() => {
              setEditingPublicationId(null);
              setFormData({
                title: '',
                author: '',
                content: '',
                imageUrl: '',
                tags: '',
                slug: '',
              });
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h3 style={{ marginTop: '30px' }}>Existing Publications</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Slug</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {publications.map((publication) => (
            <tr key={publication._id}>
              <td>{publication.title}</td>
              <td>{publication.author}</td>
              <td>{publication.slug}</td>
              <td className="admin-action-buttons">
                <button onClick={() => handleEdit(publication)} className="edit-btn">Edit</button>
                <button onClick={() => handleDelete(publication._id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePublications;
