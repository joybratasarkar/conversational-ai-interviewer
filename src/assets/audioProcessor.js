class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
      this.port.onmessage = (event) => {
        const input = event.data; // Input ArrayBuffer from the main thread
        this.processAudioData(input);
      };
    }
  
    processAudioData(audioData) {
      // Example: process the audioData as required (e.g., reduce volume)
      this.port.postMessage(audioData); // Send the processed data back
    }
  
    process(inputs, outputs, parameters) {
      return true; // Keep the processor alive
    }
  }
  
  registerProcessor('audio-processor', AudioProcessor);
  