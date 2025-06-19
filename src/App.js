import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddChannelForm from './components/AddChannelForm';

function App() {
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    try {
      const res = await axios.get('/api/youtube/videos-from-channels');
      setVideos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div>
      <h1>Haber Videoları</h1>
      <AddChannelForm onAdded={fetchVideos} />

      {videos.length === 0 && <p>Video bulunamadı.</p>}
      {videos.map(video => (
        <div key={video.videoId} style={{border: '1px solid #ccc', margin: 8, padding: 8}}>
          <h3>{video.title}</h3>
          <p>{video.channelTitle} - {new Date(video.publishedAt).toLocaleString()}</p>
          <img src={video.thumbnail} alt={video.title} />
        </div>
      ))}
    </div>
  );
}

export default App;
