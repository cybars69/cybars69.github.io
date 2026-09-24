---
title: "Why my WebSocket kept disconnecting"
description: "Ping timeouts, restarting sessions and rapid reconnect loops. The fix wasn't a timeout setting; it was a blocking call."
date: 2026-09-24
tags: [Python, Socket.IO, asyncio, Debugging]
---

The voice interview app had three symptoms that looked unrelated:

1. The interview **restarted from the greeting** whenever the socket reconnected.
2. The server log showed connections opening and closing rapidly before one finally stuck.
3. Disconnects arrived with no explanation in the logs.

## Round one: treat the symptoms

The first pass was the obvious one, and it was sensible:

- Track whether the interview had started, and only emit `start_interview` once. On reconnect, don't restart.
- Configure ping and pong explicitly: a 25 second interval and a 60 second timeout.
- Configure reconnection with a backoff from 1 to 5 seconds, five attempts at most.
- Lock the transport to WebSocket only, and set a 20 second connection timeout.
- Log every connect, disconnect (with reason), error and reconnect attempt, so the next disconnect is explainable.

The first was a real bug and it stayed fixed. The rest helped and didn't cure it. I labelled that write-up "failed" for a reason.

## Round two: the actual cause

Speech-to-text and text-to-speech calls took **10 to 20 seconds**, and I was making them directly inside async handlers. An async handler that calls a blocking function doesn't yield. While it waited, the event loop was frozen, so the server couldn't answer ping messages, so the client decided the connection was dead and dropped it. Tuning the ping timeout only moved where the problem showed up.

The fix is one line per call:

```python
transcript = await asyncio.to_thread(speech_to_text, audio)
reply_audio = await asyncio.to_thread(text_to_speech, reply)
```

Blocking work runs on a thread pool, the loop keeps answering heartbeats, and the disconnects stop.

## The second bug hiding behind the first

Even with stable pings, a real network blip still killed the interview, because on disconnect I deleted the session immediately. When the client came back a moment later, the server had forgotten it existed: "Invalid session".

The fix was to mark the session as disconnected and keep it, then add a `reconnect_session` event that attaches the surviving session to the new socket ID. The client now emits `start_interview` once and `reconnect_session` from then on.

## Takeaways

- If pings time out, **look for blocking code before touching timeout values**.
- State tied to a socket ID is state tied to a connection. Real sessions need their own identity that survives reconnects.
- Log the reason for every disconnect. Half of the debugging was working out which of three causes I was looking at.
