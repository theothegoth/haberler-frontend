import React from "react";
import JournalistCard from "./components/JournalistCard";

function App() {
  const journalists = [
    {
      name: "Fatih Portakal",
      twitterHandle: "fatihportakal",
      youtubeVideoId: "dQw4w9WgXcQ" // örnek video ID
    },
    {
      name: "İsmail Küçükkaya",
      twitterHandle: "ikucukkaya",
      youtubeVideoId: "eY52Zsg-KVI"
    }
  ];

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h1>Gazetecilerin Sosyal Medya Akışı</h1>
      {journalists.map((j, index) => (
        <JournalistCard key={index} {...j} />
      ))}
    </div>
  );
}

export default App;
