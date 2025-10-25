import React, { useState } from 'react';
import axios from 'axios';

const CreateNotice = ({ onNoticeCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/notices', formData);
      setFormData({ title: '', content: '', priority: 'medium' });
      onNoticeCreated();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create notice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-aqua bg-opacity-10 border-2 border-aqua">
      <h3 className="text-xl font-semibold text-ocean mb-4">Create New Notice</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-ocean mb-2">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter notice title"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-ocean mb-2">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows="4"
            value={formData.content}
            onChange={handleChange}
            className="input-field"
            placeholder="Enter notice content"
          />
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-ocean mb-2">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="input-field"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Creating...' : 'Create Notice'}
        </button>
      </form>
    </div>
  );
};

export default CreateNotice;
