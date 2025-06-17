import React from "react";

const JournalistCard = ({ name, twitterHandle, youtubeVideoId }) => {
  return (
    <div className="journalist-card" style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
      <h2>{name}</h2>

      {/* Twitter Embed */}
      <blockquote className="twitter-tweet">
        <a href={`https://twitter.com/${twitterHandle}`}>@{twitterHandle} tweetleri</a>
      </blockquote>

      {/* YouTube Embed */}
      <div style={{ marginTop: "1rem" }}>
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${youtubeVideoId}`}
          title="YouTube video player"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default JournalistCard;
