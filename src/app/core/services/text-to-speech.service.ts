import { Injectable } from '@angular/core';
import { SocketRealTimeCommunicationService } from './socket-real-time-communication.service';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  private voice: SpeechSynthesisVoice | null = null;
  private isSpeaking = false;
  private voicesLoaded = false;

  constructor(public SocketRealTimeService: SocketRealTimeCommunicationService) {
    this.loadVoices();
  }

  private loadVoices(): void {
    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      this.voice = voices.find(voice => voice.name === 'Google UK English Female')
                 || voices.find(voice => voice.lang === 'en-US')
                 || voices[0];

      this.voicesLoaded = true;
      console.table(voices);
    };

    // Immediate call if already loaded
    load();

    // Otherwise, wait for voiceschanged event
    window.speechSynthesis.onvoiceschanged = () => {
      load();
    };
  }

  public speak(text: string, onEndCallback?: () => void): void {
    console.log('speak() called with text:', text);

    if (!this.voicesLoaded) {
      console.warn('Voices not loaded yet. Retrying in 100ms.');
      setTimeout(() => this.speak(text, onEndCallback), 100);
      return;
    }

    // Cancel any existing utterance
    window.speechSynthesis.cancel();
    this.isSpeaking = true;
    this.SocketRealTimeService.isAudioIsBeingPlaying$.next(true);

    const textChunks = this.splitIntoChunks(text, 200);
    this.speakChunksSequentially(textChunks, onEndCallback);
  }

  private splitIntoChunks(text: string, maxChunkLength: number): string[] {
    const chunks: string[] = [];
    let currentChunk = '';

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

  private speakChunksSequentially(
    chunks: string[],
    onEndCallback?: () => void,
    index: number = 0
  ): void {
    if (index >= chunks.length) {
      this.isSpeaking = false;
      this.SocketRealTimeService.SilienceDetech$.next({ bool: false, completeBlob: [] });
      this.SocketRealTimeService.isAudioIsBeingPlaying$.next(false);
      console.log('✅ Finished speaking all chunks.');
      if (onEndCallback) onEndCallback();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = 'en-US';
    utterance.voice = this.voice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      console.log(`🟢 Speaking chunk ${index + 1}:`, chunks[index]);
    };

    utterance.onend = () => {
      this.SocketRealTimeService.SilienceDetech$.next({ bool: false, completeBlob: [] });
      console.log(`✅ Finished chunk ${index + 1}`);
      setTimeout(() => this.speakChunksSequentially(chunks, onEndCallback, index + 1), 50);
    };

    utterance.onerror = (event) => {
      console.error(`❌ Error in chunk ${index + 1}:`, event.error);
      setTimeout(() => this.speakChunksSequentially(chunks, onEndCallback, index + 1), 50);
    };

    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    console.log('⛔ Stopping speech...');
    window.speechSynthesis.cancel();
    this.isSpeaking = false;
    this.SocketRealTimeService.SilienceDetech$.next({ bool: false, completeBlob: [] });
    this.SocketRealTimeService.isAudioIsBeingPlaying$.next(false);
  }
}
