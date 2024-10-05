import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  count: number = 0

  private socket: WebSocket | any;
  private recorder: RecordRTC | null = null;
  public speechTranslated$ = new Subject<any>();
  public speechTranslatedEnd$ = new BehaviorSubject<boolean>(false);

  private audioContext!: AudioContext;
  private bufferSize = 16384; // Adjust buffer size according to your needs
  private audioSource!: AudioBufferSourceNode;
  private audioBuffer!: AudioBuffer;
  private audioOffset = 0;
  constructor(private http: HttpClient) {

  }
  private receivedAudioChunks: ArrayBuffer[] = []; // Store received audio chunks

  async connectWebSocket(): Promise<void> {
    try {
      // if(this.count<1)
      //   {
      const voiceId = 'cgSgspJ2msm6clMCkdW9';
      const model = 'eleven_turbo_v2';
      const wsUrl = `wss://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream-input?model_id=${model}`;
      
      this.socket = new WebSocket(wsUrl);

      this.onmessage()
      this.onError()




    } catch (error) {
      console.error('Error:', error);
      // Handle error as needed
    }
  }
  onError() {
    this.socket.onerror = (error: Event) => {
      console.error(`WebSocket Error: ${error}`);
    }
  }
  onmessage() {
    this.socket.onmessage = (event: MessageEvent) => {
      console.log('data has came',event);
      
      this.handleMessage(event);
    };
  }
   async checkConnection() {
    
    // if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      
      await this.connectWebSocket();
    // }
  }
  async onOpenSocket(message: any) {
    try {
      await this.checkConnection();
      this.socket.onopen = () => {

      // console.log('message', message);
      this.sendBosMessage();
      this.sendTextMessage(message);
      // 
      this.sendEosMessage();
          };
    } catch (error) {
      console.error('Error in WebSocket connection:', error);
    }
  }

  closeSocket() {
    this.socket.onclose = (event: CloseEvent) => {
      if (event.wasClean) {
        console.info(`Connection closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.warn('Connection died');
      }
    };
  }
  sendBosMessage(): void {
    if (this.socket) {
      const xi_api_key = '276857a0ab4e1591f665a8c17041f75f'

      const bosMessage = {
        "text": " ",
        "voice_settings": {
          "stability": 0.5,
          "similarity_boost": 0.8
        },
        "use_speaker_boost": true,

        "xi_api_key": xi_api_key,
      };
      this.socket.send(JSON.stringify(bosMessage));
    }
  }

  sendTextMessage(text: string): void {
    if (this.socket) {
      const textMessage = {
        "text": text,
        "try_trigger_generation": true,
      };
      
      this.socket.send(JSON.stringify(textMessage));
    }
  }

  sendEosMessage(): void {
    if (this.socket) {
      const eosMessage = {
        "text": ""
      };
      
      this.socket.send(JSON.stringify(eosMessage));
    }
  }

  handleMessage(event: MessageEvent): void {
    const response = JSON.parse(event.data);
    // console.log('response',response);
    if (response.audio) {
      // this.receivedAudioChunks.push(response.audio);
      this.speechTranslated$.next(response.audio)
    }
    else if (response.isFinal===true) {
      // this.closeSocket()
      // this.sendEosMessage();
      this.speechTranslatedEnd$.next(true)
    }
    else {
      console.log("No audio data in the response");
    }

  }



}
