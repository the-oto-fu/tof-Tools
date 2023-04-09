import React from 'react'
import { useUserMedia } from "../../useUserMedia";

const Camera = () => {
  const { stream, error } = useUserMedia({ audio: false, video: true });

  return (
    <div className="camera-capture">
      <h1>Hello GetUserMedia</h1>
      {error ? (
        <p>error</p>
      ) : (
        <video
          autoPlay
          ref={video => {
            if (video) {
              video.srcObject = stream;
            }
          }}
        />
      )}
    </div>
  );
}

export default Camera