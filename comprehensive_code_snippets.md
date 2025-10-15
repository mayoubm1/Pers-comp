# Comprehensive Code Snippets for the AI Companion Project

This document provides a high-level overview of the key code components within the AI Companion project. It is intended to quickly familiarize a new developer or AI collaborator with the structure and functionality of the application.

## **Frontend (Next.js & React)**

The frontend is built with Next.js and React, using TypeScript and Tailwind CSS.

### `app/layout.tsx`: Root Layout

This file defines the main HTML structure of the application, including metadata and font loading.

```tsx
import type React from "react"
import type { Metadata } from "next"
import { Work_Sans, Open_Sans } from "next/font/google"
import "./globals.css"

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["400", "600", "700"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "AI Companion - Your Lifetime Journey Partner",
  description: "A compassionate AI companion for mental health support and personal growth",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${workSans.variable} ${openSans.variable} antialiased`}>
      <body>{children}</body>
    </html>
  )
}
```

### `app/page.tsx`: Main Page

This is the main landing page for the application, featuring the title and the `AIChatAssistant` component.

```tsx
import { AIChatAssistant } from "@/components/ai-chat-assistant"

export default function AICompanion() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-white p-8">
          <h1 className="text-4xl font-bold mb-4 font-heading">TELsTP AI Medical Assistant</h1>
          <p className="text-xl mb-8 font-body">Tawasol Egypt Life Science Technology Park</p>
          <p className="text-lg opacity-80 font-body">
            مساعدك الذكي للطب عن بُعد والإرشاد الصحي
            <br />
            Your AI companion for telemedicine and healthcare guidance
          </p>
          <div className="mt-8 text-sm opacity-60">
            <p>Powered by Mistral AI • Advanced Medical Intelligence • Arabic & English Support</p>
          </div>
        </div>
      </div>
      <AIChatAssistant />
    </div>
  )
}
```

### `components/ai-chat-assistant.tsx`: AI Chat Assistant Component

This is the core frontend component, managing the chat interface, character selection, and user interaction. It also contains the hardcoded data for the 6 AI personas.

```tsx
"use client"

import { useState, useRef, useEffect } from "react"
// ... (imports)

interface Character { /* ... */ }
interface ChatMessage { /* ... */ }

const defaultCharacters: Character[] = [
  // ... (6 character objects)
]

export function AIChatAssistant() {
  // ... (state management for chat)

  const handleSendMessage = async () => {
    // ... (sends message to /api/ai-chat)
  }

  // ... (JSX for character selection and chat window)
}
```

## **Backend (Node.js & Python)**

The backend is a combination of Node.js (Next.js API routes) and a Python/Flask server, handling AI logic, database interaction, and peer-to-peer communication.

### `app/api/ai-chat/route.ts`: Mistral AI Chat API

This API route handles chat messages, generates a dynamic system prompt based on the selected character, and sends the request to the Mistral AI API.

```ts
import { type NextRequest, NextResponse } from "next/server"

const generateSystemPrompt = (character: any): string => {
  // ... (logic to create a system prompt for Mistral)
};

export async function POST(request: NextRequest) {
  const { message, character: characterObject } = await request.json()
  const systemPrompt = generateSystemPrompt(characterObject);

  const mistralResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
    // ... (API call to Mistral)
  })

  // ... (returns Mistral's response)
}
```

### `app/api/gemini-chat/route.ts`: Gemini CLI Chat API

This API route provides an alternative chat backend that executes the `gemini` command-line tool directly.

```ts
import { type NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  const { message, character, language } = await request.json()
  const characterPrompt = `You are ${character.name} ...`;

  const command = `gemini "${characterPrompt}"`
  const { stdout } = await execAsync(command)

  return NextResponse.json({ response: stdout.trim() })
}
```

### `backend/ai_chat.py`: Python AI Chat Service

A Python class that uses the `gemini_client` to provide AI responses, manage conversation history, and perform research-related tasks.

```python
class RealAIChat:
    def __init__(self):
        self.client = gemini_client
        self.system_prompt = "You are M2-3M..."

    def chat(self, message: str, user_id: str = "mayo", session_id: Optional[str] = None, character: str = "research-scientist") -> Dict[str, Any]:
        # ... (logic to get response from gemini_client)

    def analyze_research_data(self, data_description: str, user_id: str = "mayo") -> Dict[str, Any]:
        # ... (uses gemini_client to analyze data)
```

### `backend/gemini_client.py`: Gemini CLI Client

This Python class is a low-level wrapper for the `gemini` command-line tool. It defines prompts for different characters and executes the CLI in a subprocess.

```python
class GeminiCLIClient:
    def __init__(self):
        self.character_prompts = {
            "ibn-sina": "You are Ibn Sina...",
            # ... (other characters)
        }

    def chat(self, message: str, character: str = "ibn-sina", ...):
        system_prompt = self.character_prompts.get(character)
        # ... (creates temp file with prompt)
        result = subprocess.run(['gemini', 'chat', ...], ...)
        # ... (returns result)
```

### `backend/connection_api.py`: Peer-to-Peer Connection API

This Flask blueprint manages communication between different AI instances, allowing for knowledge syncing, experience sharing, and more.

```python
from flask import Blueprint, request, jsonify
from src.connection.hidden_bridge import HiddenBridge

connection_bp = Blueprint('connection', __name__)
hidden_bridge = HiddenBridge()

@connection_bp.route('/sync-knowledge', methods=['POST'])
def sync_knowledge():
    # ... (logic to sync knowledge with a peer)

@connection_bp.route('/share-experience', methods=['POST'])
def share_experience():
    # ... (logic to share an experience with a peer)
```

### `backend/core.py`: Manus AI Engine

The core of the Python backend, integrating the `gemini_client` with memory systems and a knowledge base to process queries and learn from interactions.

```python
class ManusAIEngine:
    def __init__(self):
        self.client = gemini_client

    def process_query(self, query: str, session_id: str, ...):
        relevant_context = self._get_relevant_context(query, session_id)
        response = self._generate_response_gemini(query, relevant_context, ...)
        self._learn_from_interaction(query, response, session_id)
        return response
```

### `backend/memory_system.py`: Memory System Models

This file defines the SQLAlchemy database models for the AI's memory, including short-term, long-term, episodic, and procedural memory.

```python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class ShortTermMemory(db.Model):
    # ... (schema for short-term memory)

class LongTermMemory(db.Model):
    # ... (schema for long-term memory)

class EpisodicMemory(db.Model):
    # ... (schema for episodic memory)

class ProceduralMemory(db.Model):
    # ... (schema for procedural memory)
```
