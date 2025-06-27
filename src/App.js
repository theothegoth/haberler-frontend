import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddChannelForm from './components/AddChannelForm';
import Modal from 'react-modal';
import he from 'he';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/youtube';

Modal.setAppElement('#root'); // accessibility için gerekli

function App() {
  const [videos, setVideos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API_URL}/videos-from-cache?country=TR`);
      setVideos(res.data);
    } catch (error) {
      console.error("Video verileri alınamadı:", error.message);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const openModal = (videoId) => {
    setSelectedVideoId(videoId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedVideoId(null);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Haber Videoları</h1>

      <AddChannelForm onAdded={fetchVideos} />

      {videos.length === 0 && <p className="text-center mt-8">Video bulunamadı.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => (
          <div key={video.videoId} className="border rounded shadow p-4">
            <h3 className="text-lg font-semibold mb-2">{he.decode(video.title)}</h3>
            <p className="text-sm text-gray-600 mb-2">{video.channelTitle} • {new Date(video.publishedAt).toLocaleString()}</p>
            <img
              src={video.thumbnail}
              alt={he.decode(video.title)}
              className="cursor-pointer"
              onClick={() => openModal(video.videoId)}
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Video İzle"
        className="w-full max-w-3xl mx-auto mt-20 bg-white p-4 rounded shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-start"
      >
        <div className="flex justify-end">
          <button onClick={closeModal} className="text-red-600 font-bold text-lg">X</button>
        </div>
        {selectedVideoId && (
          <div className="mt-4 aspect-w-16 aspect-h-9">
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${selectedVideoId}`}
              title="YouTube video player"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App;
