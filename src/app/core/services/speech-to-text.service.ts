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
    // this.SocketRealTimeCommunication.connectionSilienceDetection()

    try {
      const response = await fetch(`${this.jobUrl}clients/assembly-token`);
      const data = await response.json();

      if (data.error) {
        return;
      }

      const { token } = data.data;

      // this.socket = new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);
      // endUtteranceSilenceThreshold: 3000,

      this.socket = new RealtimeTranscriber({
        token,
        disablePartialTranscripts: true,
        endUtteranceSilenceThreshold: 2000,
      })



      this.socket.on("open", (message: any) => {
        this.startRecording();
      });


      this.socket.on('transcript', (info: any) => {

        this.transcriptResponse += info.text; // Correctly concatenate info.text

        console.log('info****************************************************************************outside', this.transcriptResponse);
        this.subtitle$.next(this.transcriptResponse)
        this.SocketRealTimeCommunication.SilienceDetech$.pipe(
          filter((resp) => resp.bool === true)
        ).subscribe({
          next: (data: any) => {

            
            if (this.transcriptResponse.length && this.transcriptResponse !== undefined) {
              
              this.translationData$.next(this.transcriptResponse);
              this.SocketRealTimeCommunication.sendAnswer(this.transcriptResponse)

              this.transcriptResponse = '';
              this.SocketRealTimeCommunication.closeSilienceDetectionWebSocket()

            }

            this.SocketRealTimeCommunication.SilienceDetech$.next({ bool: false, completeBlob: [] });
          }
        });
      });


      this.socket.on('onclose', (info: any) => {
        this.closeWebSocket();
      });

    } catch (error) {
      console.error('Error:', error);
    }
    this.socket.connect();
  }


  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        timeSlice: 1000,
        ondataavailable: async (blob) => {

          //  this.sendAudioChunk(blob)
           this.SocketRealTimeCommunication.sendBargeInAudioBlob(blob)
           this.SocketRealTimeCommunication.isAudioIsBeingPlaying$.pipe(filter((resp) => resp === false)
           ).subscribe({
             next: (resp: any) => {
               this.socket?.send(blob);
          
          this.SocketRealTimeCommunication.sendConnectionSilienceDetectionSocket(blob)
          // console.log('true || false', resp)
             }
           })
          //  this.SocketRealTimeCommunication.sendConnectionSilience3SecondsDetectionSocket(blob);

        }
      });

      // Subscribe to silence detection results


      if (this.recorder) {
        this.recorder.startRecording();
      }
    } catch (err) {
      console.error('Recording error:', err);
    }
  }








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
