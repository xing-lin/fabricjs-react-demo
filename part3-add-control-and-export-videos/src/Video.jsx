import React, { useRef, useState } from 'react';
import { FabricImage } from 'fabric';

export function Video({ canvas, canvasRef }) {
  const [videoSrc, setVideoSrc] = useState(null);
  const [fabricVideo, setFabricVideo] = useState(null);
  const [recordingChunks, setRecordingChunks] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [loadPercentage, setLoadedPercentage] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setLoadedPercentage(0);
      setVideoSrc(null);
      setUploadMessage('');

      const url = URL.createObjectURL(file);
      setVideoSrc(url);

      const videoElement = document.createElement('video');

      videoElement.src = url;
      videoElement.crossOrigin = 'anonymous';

      videoElement.addEventListener('loadeddata', () => {
        const videoWidth = videoElement.videoWidth;
        const videoHeight = videoElement.videoHeight;
        videoElement.width = videoWidth;
        videoElement.height = videoHeight;

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const scale = Math.min(
          canvasWidth / videoWidth,
          canvasHeight / videoHeight
        );

        canvas.renderAll();

        const fabricImage = new FabricImage(videoElement, {
          left: 0,
          top: 0,
          scaleX: scale,
          scaleY: scale,
        });

        setFabricVideo(fabricImage);
        canvas.add(fabricImage);
        canvas.renderAll();

        setUploadMessage('Uploaded');

        setTimeout(() => {
          setUploadMessage('');
        }, 3000);

        videoElement.addEventListener('progress', () => {
          if (videoElement.buffered.length > 0) {
            const bufferedEnd = videoElement.buffered.end(
              videoElement.buffered.length - 1
            );
            const loadPercentage = (bufferedEnd / videoElement.duration) * 100;
            setLoadedPercentage(loadPercentage);
          }
        });

        videoElement.addEventListener('error', (error) => {
          console.error('Video load error:', error);
        });

        videoRef.current = videoElement;
      });
    }
  };

  const handlePlayPauseVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();

        videoRef.current.addEventListener('timeupdate', () => {
          fabricVideo.setElement(videoRef.current);
          canvas.renderAll();
        });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleStopVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      canvas.renderAll();
    }
  };

  const handleStartRecording = () => {
    const stream = canvasRef.current.captureStream();
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs=vp9',
    });

    mediaRecorderRef.current.ondataavailable = handleDataAvailable;
    mediaRecorderRef.current.start();
    setIsRecording(true);

    canvas.getObjects().forEach((object) => {
      object.hasControls = false;
      object.selectable = true;
    });

    canvas.renderAll();

    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);

    canvas.getObjects().forEach((object) => {
      object.hasControls = true;
    });

    canvas.renderAll();

    clearInterval(recordingIntervalRef.current);
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordingChunks((prevChunks) => [...prevChunks, event.data]);
    }
  };

  const handleExportVideo = () => {
    const blob = new Blob(recordingChunks, { type: 'video/webm' });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported_video.webm';
    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    setRecordingChunks([]);
  };

  return (
    <>
      <input type="file" accept="video/mp4" onChange={handleVideoUpload} />
      {videoSrc && (
        <div>
          <button onClick={handlePlayPauseVideo}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={handleStopVideo}>Stop</button>

          <div>Progress: {loadPercentage.toFixed(2)}%</div>
          <div>uploadMessage: {uploadMessage}</div>
          <button onClick={handleStartRecording}>Start Recording</button>
          <button onClick={handleStopRecording}>Stop Recording</button>
          <button onClick={handleExportVideo}>Export Video</button>
          {isRecording ? (
            <div>Recording in progress...</div>
          ) : (
            <div>Recording stopped.</div>
          )}
          <div>Recording Time: {recordingTime} seconds</div>
        </div>
      )}
    </>
  );
}
