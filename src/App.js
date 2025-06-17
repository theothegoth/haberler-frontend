import React, { useEffect, useState } from "react";

function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // YouTube kanal ID'si
  const channelId = "UC4R8DWoMoI7CAwX8_LjQHig"; // Örnek: YouTube News kanal ID'si

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      // Dün saat 00:00'dan itibaren olan saat (ISO formatında)
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const publishedAfter = yesterday.toISOString();

      try {
        const response = await fetch(
          `http://localhost:5000/api/youtube/videos?channelId=${channelId}&publishedAfter=${publishedAfter}`
        );

        if (!response.ok) {
          throw new Error("Veri çekilirken bir hata oluştu.");
        }

        const data = await response.json();
        if (data.items) {
          setVideos(data.items);
        } else {
          setVideos([]);
        }
      } catch (err) {
        setError(err.message);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [channelId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>YouTube - Son 24 Saatte Yayınlanan Videolar</h2>

      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: "red" }}>Hata: {error}</p>}
      {!loading && videos.length === 0 && <p>Hiç video bulunamadı.</p>}

      <ul>
        {videos.map((video) => (
          <li key={video.id.videoId || video.etag} style={{ marginBottom: "10px" }}>
            <a
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {video.snippet.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
