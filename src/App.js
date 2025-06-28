import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddChannelForm from './components/AddChannelForm';
import Modal from 'react-modal';
import he from 'he';

// Kategori listesini import et (frontend utils klasöründen)
import { videoCategories } from './utils/videoCategories';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/youtube';

Modal.setAppElement('#root');

function App() {
  const [videos, setVideos] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState('list'); // 'list' veya 'grid'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' tüm kategoriler için

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

  // Seçili kategoriye göre videoları filtrele
  const filteredVideos = selectedCategory === 'all'
    ? videos
    : videos.filter(video => video.category === Number(selectedCategory));

  return (
    <div className="container mx-auto px-4 py-6 max-w-screen-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Haber Videoları</h1>

      {/* Görünüm geçiş butonları */}
      <div className="flex justify-center mb-4">
        <button
          className={`px-5 py-2 rounded-l-md border border-blue-600 font-semibold transition-colors duration-300 ${
            selectedLayout === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100'
          }`}
          onClick={() => setSelectedLayout('list')}
        >
          Liste Görünüm
        </button>
        <button
          className={`px-5 py-2 rounded-r-md border border-blue-600 font-semibold transition-colors duration-300 ${
            selectedLayout === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100'
          }`}
          onClick={() => setSelectedLayout('grid')}
        >
          Gazete Görünüm
        </button>
      </div>

      {/* Kategori seçimi */}
      <div className="mb-6 flex justify-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-400 rounded-md px-4 py-2"
        >
          <option value="all">Tüm Kategoriler</option>
          {Object.entries(videoCategories).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <AddChannelForm onAdded={fetchVideos} />

      {filteredVideos.length === 0 && (
        <p className="text-center mt-8 text-gray-500 text-lg">Video bulunamadı.</p>
      )}

      {selectedLayout === 'list' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <div
              key={video.videoId}
              className="border rounded-lg shadow-md p-4 bg-white flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-2 leading-tight">{he.decode(video.title)}</h3>
              <p className="text-sm text-gray-600 mb-3 truncate">{video.channelTitle} • {new Date(video.publishedAt).toLocaleString()}</p>
              <img
                src={video.thumbnail}
                alt={he.decode(video.title)}
                className="cursor-pointer rounded-md object-cover w-full h-48"
                onClick={() => openModal(video.videoId)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {filteredVideos.map(video => {
            const like = video.likeCount || 0;
            let colSpan = 2, rowSpan = 1;
            if (like > 10000) { colSpan = 3; rowSpan = 2; }
            else if (like > 1000) { colSpan = 2; rowSpan = 2; }
            else if (like > 100) { colSpan = 1; rowSpan = 1; }

            return (
              <div
                key={video.videoId}
                className={`col-span-${colSpan} row-span-${rowSpan} border rounded-lg shadow-md p-3 bg-white flex flex-col`}
                style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}` }}
              >
                <h3 className="text-md font-semibold mb-1 truncate">{he.decode(video.title)}</h3>
                <p className="text-sm text-gray-600 mb-2 truncate">{video.channelTitle}</p>

                <div
                  className="aspect-w-16 aspect-h-9 overflow-hidden rounded-md cursor-pointer flex-shrink-0"
                  onClick={() => openModal(video.videoId)}
                >
                  <img
                    src={video.thumbnail}
                    alt={he.decode(video.title)}
                    className="w-full h-full object-cover transition duration-300 ease-in-out hover:brightness-90"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Video İzle"
        className="w-full max-w-3xl mx-auto mt-20 bg-white p-4 rounded-lg shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-start z-50"
      >
        <div className="flex justify-end">
          <button
            onClick={closeModal}
            className="text-red-600 font-bold text-xl hover:text-red-800 transition"
            aria-label="Kapat"
          >
            &times;
          </button>
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
