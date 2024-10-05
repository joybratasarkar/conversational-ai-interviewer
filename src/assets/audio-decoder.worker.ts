/// <reference lib="webworker" />

self.addEventListener('message', (event: MessageEvent) => {
  const { base64Data } = event.data;

  try {
    // Convert base64 to ArrayBuffer
    const arrayBuffer = base64ToArrayBuffer(base64Data);

    // Post the ArrayBuffer back to the main thread
    self.postMessage(arrayBuffer, [arrayBuffer]);
  } catch (error) {
    console.error('Error converting base64 to ArrayBuffer in worker:', error);
  }
});

// Utility function to convert base64 string to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64); // decode base64 string
  const length = binaryString.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
