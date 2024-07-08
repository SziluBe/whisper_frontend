import * as React from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';

export default function App() {

  async function getData() {
    try {
      const response = await fetch('https://api.runpod.ai/v2/kpfxevjxqeqod5/runsync?=', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': '...'
        },
        // body: '{\n  "input": {\n    "model": "large-v3",\n    "audio_base64": "..."\n  }\n}',
        body: JSON.stringify({
          'input': {
            'model': 'large-v3',
            'audio_base64': '...'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error.message);
    }
  }
  
  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement('audio');
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);

  };

  return (
    <div>
      <AudioRecorder
        onRecordingComplete={addAudioElement}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
          // autoGainControl,
          // channelCount,
          // deviceId,
          // groupId,
          // sampleRate,
          // sampleSize,
        }}
        onNotAllowedOrFound={(err) => console.table(err)}
        // downloadOnSavePress={true}
        downloadFileExtension="webm"
        mediaRecorderOptions={{
          audioBitsPerSecond: 128000,
        }}
        showVisualizer={true}
      />
      <br />
    </div>
  );
}
