import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/youtube';

function AddChannelForm({ onAdded }) {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!input.trim()) {
      setMessage('Lütfen bir kanal adı, URL veya ID girin.');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/add-channel`, {
        input: input.trim(),
        country: 'TR'
      });
      setMessage(res.data.message);
      setInput('');
      if (onAdded) onAdded();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Bir hata oluştu.');
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="flex items-center max-w-md mx-auto">
        <input
          type="text"
          placeholder="@kanaladi, kanal ID veya YouTube kanal URL'si"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-700 transition"
        >
          Kanal Ekle
        </button>
      </form>
      {message && (
        <p className="mt-2 text-center text-sm text-red-600">{message}</p>
      )}
    </div>
  );
}

export default AddChannelForm;
