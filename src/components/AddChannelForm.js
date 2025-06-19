import React, { useState } from 'react';
import axios from 'axios';

function AddChannelForm({ onAdded }) {
  const [channelId, setChannelId] = useState('');
  const [channelTitle, setChannelTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/youtube/add-channel', {
        channelId,
        channelTitle,
        country: 'TR' // İstersen burayı dinamik yapabilirsin
      });
      setMessage(res.data.message);
      setChannelId('');
      setChannelTitle('');
      if (onAdded) onAdded();
    } catch (error) {
      setMessage(error.response?.data?.error || 'Hata oluştu');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{marginTop: '1rem'}}>
      <input
        placeholder="Kanal ID"
        value={channelId}
        onChange={e => setChannelId(e.target.value)}
        required
        style={{marginRight: '0.5rem'}}
      />
      <input
        placeholder="Kanal Adı"
        value={channelTitle}
        onChange={e => setChannelTitle(e.target.value)}
        required
        style={{marginRight: '0.5rem'}}
      />
      <button type="submit">Kanala Ekle</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default AddChannelForm;
