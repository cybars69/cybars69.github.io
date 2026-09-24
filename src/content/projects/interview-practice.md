---
title: "AI interview practice"
blurb: "A voice interview simulator with resume-aware questions, timed sessions and full transcripts. Eighteen iterations, some of them failures worth writing about."
era: recent
order: 11
image: /images/projects/interview-practice.png
alt: "Diagram: mic, AudioWorklet, Socket.IO, speech-to-text plus LLM, spoken reply"
tags: [FastAPI, Socket.IO, Gemini, React]
kind: "Internal tool · anonymized"
featured: false
---

An internal tool for practising interviews out loud. You upload a resume and a job description, pick a persona (behavioural, backend engineering or system design), and talk to an interviewer that speaks back.

## What it does

- Real-time audio over Socket.IO, speech-to-text in, LLM reply, text-to-speech out.
- Resume and job-description upload (PDF and DOCX) that shape the questions.
- A time budget: as it runs low, the interviewer is told to wrap up gracefully instead of stopping mid-question.
- Sessions saved with full transcripts and audio playback, with relative timestamps.
- JWT auth, MinIO for audio, MySQL for everything else.

## The engineering story

The project kept a numbered walkthrough for each iteration, including the ones marked *failed*. Two of them turned into posts:

- [Streaming microphone audio from a browser, in three attempts](/blog/streaming-mic-audio-three-attempts/), about WebM, WAV, PCM and AudioWorklet.
- [Why my WebSocket kept disconnecting](/blog/websocket-pings-blocked-event-loop/), about blocking calls starving heartbeats.

## Stack

FastAPI, SQLAlchemy, MySQL, Socket.IO, MinIO, Gemini, React, Vite, Mantine, Zustand.
