import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, debounceTime, filter, first, take } from 'rxjs';
import * as RecordRTC from 'recordrtc';
import { RealtimeTranscriber } from 'assemblyai';
import { RealtimeService } from 'assemblyai';
import { SocketRealTimeCommunicationService } from './socket-real-time-communication.service';
import { TextToSpeechService } from './tect-to-speech.service';


@Injectable({
  providedIn: 'root'
})
export class RealtimeSpeechToTextTranscriptionService {
  private socket: any;
  private recorder: RecordRTC | null = null;
  public translationData$ = new BehaviorSubject<string | null>(null);
  public subtitle$ = new BehaviorSubject<string | null>(null);

  jobUrl = environment.job_base_url1
  private previousBlob: Blob | null = null;
  private previousBlobHash: string | null = null;
  private previousBlobBytes: Uint8Array | null = null;
  private worker!: Worker;
  private accumulatedBlobs: Blob[] = [];
  public transcriptResponse: string | any = ''
  constructor(
    private SocketRealTimeCommunication: SocketRealTimeCommunicationService,
    private speechToText: TextToSpeechService,

  ) {


  }

  async connectWebSocket(): Promise<void> {
    try {
      const response = await fetch(`${this.jobUrl}clients/assembly-token`);
      const data = await response.json();

      if (data.error) {
        console.error('Assembly token fetch error:', data.error);
        return;
      }

      const { token } = data.data;

      this.socket = new RealtimeTranscriber({
        token,
        disablePartialTranscripts: true,
        endUtteranceSilenceThreshold: 2000,
      });

      // 🔵 Log when connection is opened
      this.socket.on("open", () => {
        console.log("✅ WebSocket connected to AssemblyAI");
        console.log(this.socket);

        this.startRecording(); // ✅ `this` is now your class


      });

      // 🔴 Log when connection is closed
      this.socket.on("close", (event: any) => {
        console.warn("❌ WebSocket connection closed:", event);
        this.closeWebSocket();
      });

      // 🔴 Log errors if any
      this.socket.on("error", (error: any) => {
        console.error("⚠️ WebSocket encountered an error:", error);
      });

      // 🟡 Handle transcript
      this.socket.on("transcript", (info: any) => {
        this.transcriptResponse += info.text;
        console.log("📝 Transcript received:", this.transcriptResponse);
        this.subtitle$.next(this.transcriptResponse);

        this.SocketRealTimeCommunication.SilienceDetech$.pipe(
          filter((resp) => resp.bool === true),
        ).subscribe({
          next: (data: any) => {

            if (this.transcriptResponse?.length) {
              debugger;
              this.translationData$.next(this.transcriptResponse);
              // this.SocketRealTimeCommunication.sendAnswer(this.transcriptResponse);
              this.transcriptResponse = '';
              this.SocketRealTimeCommunication.closeSilienceDetectionWebSocket();
            }
            this.SocketRealTimeCommunication.SilienceDetech$.next({ bool: false, completeBlob: [] });
          }
        });
      });

      this.socket.connect(); // Initiate connection
      console.log("⏳ Attempting WebSocket connection...");

    } catch (error) {
      console.error("❌ Failed to connect WebSocket:", error);
    }
  }


  // async startRecording(): Promise<void> {
  //   try {
  //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  //     this.recorder = new RecordRTC(stream, {
  //       type: 'audio',
  //       mimeType: 'audio/webm',
  //       recorderType: RecordRTC.StereoAudioRecorder,
  //       desiredSampRate: 16000,
  //       numberOfAudioChannels: 1,
  //       timeSlice: 1000, // 1-second chunks
  //       ondataavailable: async (blob) => {
  //         try {
  //           
  //                       this.socket.send(blob); // int16Buffer is an ArrayBuffer

  //           const arrayBuffer = await blob.arrayBuffer();

  //           const audioContext = new AudioContext({ sampleRate: 16000 });
  //           const decoded = await audioContext.decodeAudioData(arrayBuffer);

  //           const float32Array = decoded.getChannelData(0); // mono

  //           // Convert Float32 PCM to 16-bit PCM (Int16Array)
  //           const int16Buffer = this.convertFloat32ToInt16(float32Array);

  //           // ✅ Send to AssemblyAI WebSocket
  //           if (this.socket && this.socket.readyState === WebSocket.OPEN) {
  //             this.socket.send(blob); // int16Buffer is an ArrayBuffer
  //           }

  //           // Optional: still send blob or float32 for silence detection
  //           // this.sendAudioChunk(blob);
  //           this.SocketRealTimeCommunication.sendConnectionSilienceDetectionSocket(float32Array.buffer);

  //         } catch (e) {
  //           console.error("Error processing audio blob:", e);
  //         }
  //       }
  //     });

  //     this.recorder.startRecording();

  //   } catch (err) {
  //     console.error("Recording error:", err);
  //   }
  // }




  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        timeSlice: 1000, // 1-second chunks
        ondataavailable: async (blob: Blob) => {
          try {
            if (!this.socket || typeof this.socket.sendAudio !== 'function') {
              console.warn("Socket is not ready or sendAudio is not available");
              return;
            }

            const arrayBuffer = await blob.arrayBuffer();

            const audioContext = new AudioContext({ sampleRate: 16000 });
            const decoded = await audioContext.decodeAudioData(arrayBuffer);
            const float32Array = decoded.getChannelData(0);

            const int16Buffer = this.convertFloat32ToInt16(float32Array);
            console.log('final', this.socket);

            // this.socket.send(blob); // int16Buffer is an ArrayBuffer
            this.sendAudioChunk(blob);

            // For silence detection logic
            this.SocketRealTimeCommunication.sendConnectionSilienceDetectionSocket(float32Array.buffer);

          } catch (e) {
            console.error("Error processing audio blob:", e);
          }
        }
      });

      this.recorder.startRecording();
    } catch (err) {
      console.error("Recording error:", err);
    }
  }


  convertFloat32ToInt16(buffer: Float32Array): ArrayBuffer {
    const l = buffer.length;
    const result = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      result[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return result.buffer;
  }








  // sendAudioChunk(buffer: any): void {
  //   const chunkSize = 16384;
  //   const totalChunks = Math.ceil(buffer.byteLength / chunkSize);

  //   for (let i = 0; i < totalChunks; i++) {
  //     const start = i * chunkSize;
  //     const end = Math.min(start + chunkSize, buffer.byteLength);
  //     const chunk = buffer.slice(start, end);

  //     if (this.socket?.readyState === WebSocket.OPEN) {
  //       this.socket.send(chunk);
  //     } else {
  //       console.warn("WebSocket is not open. Cannot send audio chunk.");
  //     }
  //   }
  // }

  sendAudioChunk(blob: Blob): void {
    const chunkSize = 16384;
    const reader = new FileReader();

    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      const totalChunks = Math.ceil(buffer.byteLength / chunkSize);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, buffer.byteLength);
        const chunk = buffer.slice(start, end);
        this.socket?.send(chunk);
      }
    };

    reader.readAsArrayBuffer(blob);
  }


  closeWebSocket(): void {
    if (this.socket) {
      this.translationData$.next(null);
      this.socket.forceEndUtterance()
    }

    if (this.recorder) {
      this.recorder.stopRecording(() => {
        // Handle any post-recording actions here
      });
      this.recorder = null;
    }
  }
}
