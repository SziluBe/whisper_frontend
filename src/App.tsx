import * as React from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';

export default function App() {

  function blobToBase64(blob : Blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  async function getData(audio_base64 : string, api_key : string) {
    try {
      console.log("audio base64: " + audio_base64);
      const response = await fetch('https://api.runpod.ai/v2/{endpoint_id}/runsync?=', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': api_key
        },
        // body: '{\n  "input": {\n    "model": "large-v3",\n    "audio_base64": "..."\n  }\n}',
        body: JSON.stringify({
          'input': {
            'model': 'large-v3',
            'audio_base64': audio_base64,
            // 'audio': audio,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      console.log(json);
      return json;
    } catch (error) {
      console.error(error.message);
    }
  }
  
  async function addAudioElement(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement('audio');
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);

    const audio_base64 = await blobToBase64(blob);

    // slice at 35 to remove metadata at the start
    const response = await getData(audio_base64.slice(35), "...");
    const recognised_text = String(response.output.transcription);

    console.log("recognised text: " + recognised_text);

    // document.createElement()
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
        downloadOnSavePress={true}
        downloadFileExtension="webm"
        // downloadFileExtension="mp3"
        mediaRecorderOptions={{
          audioBitsPerSecond: 128000,
        }}
        showVisualizer={true}
      />
      <br />
    </div>
  );
}
