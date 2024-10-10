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
      console.table(voices);

      //   this.voice = voices.find(voice => voice.name === 'Google UK English Male')
      //     || voices.find(voice => voice.lang === 'en-US')
      //     || voices[0];
      // };

      this.voice = voices.find(voice => voice.name === 'Google UK English Female')
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

    // Split the text into chunks
    const textChunks = this.splitIntoChunks(text, 200); // Split into 200-character chunks
    this.speakChunksSequentially(textChunks, onEndCallback);
  }

  private splitIntoChunks(text: string, maxChunkLength: number): string[] {
    const chunks: string[] = [];
    let currentChunk = '';

    // Split the text based on punctuation marks and length
    text.split(/(?<=[,.;!?])\s+/).forEach(part => {
      if ((currentChunk + part).length <= maxChunkLength) {
        currentChunk += part + ' ';
      } else {
        chunks.push(currentChunk.trim());
        currentChunk = part + ' ';
      }
    });
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
  }

  private speakChunksSequentially(chunks: string[], onEndCallback?: () => void, index: number = 0): void {
    if (index >= chunks.length) {
      this.isSpeaking = false;
      this.SocketRealTimeService.sendClearAudio();
      this.SocketRealTimeService.SilienceDetech$.next({ bool: false, completeBlob: [] });
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
    utterance.rate = 1.0; // Adjust the rate if needed
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      console.log(`Started speaking chunk ${index + 1}:`, chunks[index]);
    };

    utterance.onend = () => {
      this.SocketRealTimeService.sendClearAudio();
      this.SocketRealTimeService.SilienceDetech$.next({ bool: false, completeBlob: [] });
      console.log(`Finished speaking chunk ${index + 1}`);
      setTimeout(() => this.speakChunksSequentially(chunks, onEndCallback, index + 1), 50); // Add slight delay if needed
    };

    utterance.onerror = (event) => {
      console.error(`Speech synthesis error for chunk ${index + 1}:`, event.error);
      // Continue with the next chunk even if there’s an error
      this.speakChunksSequentially(chunks, onEndCallback, index + 1);
    };

    window.speechSynthesis.speak(utterance);
  }

  stop(): void {
    this.SocketRealTimeService.sendClearAudio();
    console.log('Stopping any ongoing speech.');

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    this.isSpeaking = false;
    this.SocketRealTimeService.SilienceDetech$.next({ bool: false, completeBlob: [] });

    this.SocketRealTimeService.isAudioIsBeingPlaying$.next(false); // Notify that audio has stopped
  }
}
