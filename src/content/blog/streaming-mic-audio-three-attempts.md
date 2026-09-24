---
title: "Streaming microphone audio from a browser, in three attempts"
description: "WebM chunks, WAV, decoded PCM and finally an AudioWorklet. What broke, why, and what the two failed write-ups got wrong."
date: 2026-09-24
tags: [Audio, WebAudio, Socket.IO, Debugging]
---

I built a voice interview simulator. You talk, a backend transcribes you, an LLM replies, a voice speaks the answer. The plan was to stream audio chunks to the server while you speak, so responses could start sooner and, later, show live transcription.

Getting audio from a microphone to a server **intact** took three attempts after the naive one. Two of them I documented as finished solutions, and both were wrong.

## The problem: chunks that aren't files

The obvious approach is `MediaRecorder` with a short timeslice (I used 500 ms), sending each chunk over a WebSocket. On the server, concatenate the chunks and you have the recording.

You don't. WebM is a container. Only the **first** chunk carries the header (the EBML metadata). Every later chunk is just cluster data. Gluing them together works only if they arrive in order and the first is present, and decoding any single later chunk on its own is impossible. What I got on the backend was corrupt or silent audio.

## Attempt 1: switch to WAV

WAV is easy to combine: one header, then raw samples. Take the first chunk's header and concatenate the rest. The write-up had a nice table of the RIFF layout, a size comparison (16 kHz mono for 10 seconds is about 320 KB, against 50 to 80 KB for Opus, so the extra bandwidth is negligible) and a browser support table.

**Why it failed:** the table was wrong where it mattered. I had assumed `MediaRecorder` would happily record `audio/wav`. Browsers don't support recording WAV that way, so the "fallback" (WebM again, with only a console warning) was the path that actually ran, and the corruption came straight back.

## Attempt 2: decode each chunk to PCM in the browser

Keep WebM, but decode every chunk with `AudioContext.decodeAudioData`, convert Float32 to Int16, send PCM. Raw PCM concatenates safely, and the backend just adds a WAV header. The write-up was titled "Final Solution" and listed six green ticks.

**Why it failed:** `decodeAudioData` needs a decodable file. A WebM chunk without the header isn't one, so every chunk after the first failed to decode, which is the original problem in a new costume.

## Attempt 3, the one that worked: skip the codec entirely

The lesson was to stop encoding something I would immediately need to decode. An **AudioWorklet** gives you raw samples from the microphone as they arrive. There is nothing to reassemble because there was never a container.

A sketch of the idea:

```js
// pcm-capture-processor.js (runs on the audio thread)
class PcmCapture extends AudioWorkletProcessor {
  buffer = [];
  process(inputs) {
    const channel = inputs[0][0];
    if (channel) this.buffer.push(...channel);
    if (this.buffer.length >= 1600) {          // about 100 ms at 16 kHz
      const pcm = new Int16Array(this.buffer.length);
      this.buffer.forEach((s, i) => {
        const c = Math.max(-1, Math.min(1, s));
        pcm[i] = c < 0 ? c * 32768 : c * 32767;
      });
      this.port.postMessage(pcm.buffer, [pcm.buffer]);
      this.buffer = [];
    }
    return true;
  }
}
registerProcessor('pcm-capture', PcmCapture);
```

The page creates a dedicated 16 kHz `AudioContext`, which is what speech-to-text wants anyway, and forwards each buffer over the socket.

The best part: **no backend change was needed.** The server already stored PCM chunks and, when the answer was complete, concatenated them and prepended a WAV header. Attempt 2's backend half survived; only the capture half was wrong.

## What I'd do differently

- **Verify the browser does what your design assumes before writing the design up.** One `isTypeSupported('audio/wav')` call in a console would have killed attempt 1 in ten seconds.
- **Be suspicious of a doc that says "final solution" before it has run.** It should say "proposed" until a real run produces the log line it promises.
- **Keep the contract stable and swap the implementation.** PCM chunks in, WAV out was the right boundary, and it's why the fix was a frontend-only change.
