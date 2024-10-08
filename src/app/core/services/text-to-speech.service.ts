import { Injectable } from '@angular/core';
import { SocketRealTimeCommunicationService } from './socket-real-time-communication.service';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {

  private voice: SpeechSynthesisVoice | null = null;
  private isSpeaking = false;

  constructor(public SocketRealTimeService: SocketRealTimeCommunicationService) {
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices();
      this.voice = voices.find(voice => voice.name === 'Google US English') 
        || voices.find(voice => voice.lang === 'en-US') 
        || voices[0];
    };
  }

  speak(text: string, onEndCallback?: () => void): void {
    console.log('speak() called with text:', text);
    
    // Cancel any ongoing speech synthesis
    window.speechSynthesis.cancel();
    this.isSpeaking = true;
    this.SocketRealTimeService.isAudioIsBeingPlaying$.next(true); // Notify that audio has started

    // Split text into chunks (sentences) to improve reliability with longer text
    const textChunks = text.split(/(?<=[.!?])\s+/); // Split at sentence boundaries
    this.speakChunksSequentially(textChunks, onEndCallback);
  }

  private speakChunksSequentially(chunks: string[], onEndCallback?: () => void, index: number = 0): void {
    if (index >= chunks.length) {
      this.isSpeaking = false;
      this.SocketRealTimeService.isAudioIsBeingPlaying$.next(false); // Notify that audio has ended
      console.log('Finished speaking all chunks.');
      if (onEndCallback) onEndCallback();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = 'en-US';
    utterance.voice = this.voice 
      || window.speechSynthesis.getVoices().find(voice => voice.lang === 'en-US') 
      || window.speechSynthesis.getVoices()[0];
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      console.log(`Started speaking chunk ${index + 1}:`, chunks[index]);
    };

    utterance.onend = () => {
      console.log(`Finished speaking chunk ${index + 1}`);
      this.speakChunksSequentially(chunks, onEndCallback, index + 1);
    };

    window.speechSynthesis.speak(utterance);
  }

  stop(): void {
    console.log('Stopping any ongoing speech.');
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    this.isSpeaking = false;
    this.SocketRealTimeService.isAudioIsBeingPlaying$.next(false); // Notify that audio has stopped
  }
}
