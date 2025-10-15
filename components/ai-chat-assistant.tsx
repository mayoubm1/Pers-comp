"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, Send, Mic, MicOff, X } from "lucide-react"

// Defines the structure for an AI character
interface Character {
  id: string
  name: string
  arabicName?: string
  gender: "male" | "female" | "neutral"
  role: string
  description: string
  dataAccess: string[]
  avatar: string
  videoUrl?: string
  growthLevel: number
  specialties: string[]
  isCustomizable: boolean
}

// Defines the structure for a chat message
interface ChatMessage {
  text: string
  sender: "user" | "ai"
  timestamp: Date
  character?: Character // The character who sent the message (for AI)
  emotion?: "neutral" | "happy" | "concerned" | "thinking" | "speaking"
}

// The complete list of all 6 default characters
const defaultCharacters: Character[] = [
  {
    id: "ibn-sina",
    name: "Ibn Sina",
    arabicName: "ابن سينا",
    gender: "male",
    role: "Chief Medical Advisor",
    description: "Classical Islamic physician and philosopher, expert in traditional and modern medicine.",
    dataAccess: ["medical_history", "symptoms", "treatments"],
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/output%20%282%29-p41U1omIINqaCNL7NQLsJBgVPsmNF0.jpeg",
    videoUrl: "",
    growthLevel: 100,
    specialties: ["Internal Medicine", "Philosophy", "Herbal Medicine"],
    isCustomizable: false,
  },
  {
    id: "personal-companion",
    name: "", // User can set a name
    gender: "neutral",
    role: "Personal Wellness Companion",
    description: "Your dedicated personal health and wellness companion that grows with you.",
    dataAccess: ["personal_data", "daily_habits", "mood_tracking"],
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eda8ba25-805d-4e4e-b0c6-e2db0e9a1d29.png-r9EmwMmyIwgJUXjGMIGKxKtAcBglMS.jpeg",
    videoUrl: "",
    growthLevel: 1,
    specialties: ["Personal Care", "Habit Tracking", "Emotional Support"],
    isCustomizable: true,
  },
  {
    id: "specialist-doctor",
    name: "", // User can set a name
    gender: "neutral",
    role: "Medical Specialist",
    description: "Specialized medical expert for complex health conditions.",
    dataAccess: ["medical_records", "lab_results", "genomic_data"],
    avatar: "https://i.pravatar.cc/150?u=specialist-doctor",
    videoUrl: "",
    growthLevel: 50,
    specialties: ["Cardiology", "Neurology", "Oncology"],
    isCustomizable: true,
  },
  {
    id: "wellness-coach",
    name: "", // User can set a name
    gender: "neutral",
    role: "Wellness & Lifestyle Coach",
    description: "Holistic wellness expert focusing on lifestyle and preventive care.",
    dataAccess: ["fitness_data", "nutrition", "sleep_patterns"],
    avatar: "https://i.pravatar.cc/150?u=wellness-coach",
    videoUrl: "",
    growthLevel: 25,
    specialties: ["Nutrition", "Fitness", "Mental Health"],
    isCustomizable: true,
  },
    {
    id: "research-scientist",
    name: "", // User can set a name
    gender: "neutral",
    role: "Life Sciences Researcher",
    description: "A researcher at Tawasol Egypt Life Science Technology Park (TELsTP), providing scientific insights.",
    dataAccess: ["research_papers", "clinical_trials", "scientific_data"],
    avatar: "https://i.pravatar.cc/150?u=research-scientist",
    videoUrl: "",
    growthLevel: 40,
    specialties: ["Genomics", "Biotechnology", "Data Analysis"],
    isCustomizable: true,
  },
  {
    id: "spiritual-guide",
    name: "", // User can set a name
    gender: "neutral",
    role: "Islamic Spiritual Counselor",
    description: "Provides guidance and support based on the Quran and Hadith.",
    dataAccess: ["spiritual_goals", "personal_reflections"],
    avatar: "https://i.pravatar.cc/150?u=spiritual-guide",
    videoUrl: "",
    growthLevel: 60,
    specialties: ["Quranic Studies", "Hadith", "Spiritual Counseling"],
    isCustomizable: true,
  }
]

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [characters, setCharacters] = useState<Character[]>(defaultCharacters)
  const [showCharacterSetup, setShowCharacterSetup] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && !selectedCharacter) {
      setShowCharacterSetup(true)
    } else {
      setShowCharacterSetup(false)
    }
  }, [isOpen, selectedCharacter])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleCharacterCustomization = (characterId: string, updates: Partial<Character>) => {
    setCharacters((prev) => prev.map((char) => (char.id === characterId ? { ...char, ...updates } : char)))
  }

  const selectCharacter = (character: Character) => {
    setSelectedCharacter(character)
    setShowCharacterSetup(false)
    const introMessage: ChatMessage = {
      text: `You are now speaking with ${character.name || character.role}.\nRole: ${character.role}\nSpecialties: ${character.specialties.join(", ")}. How can I help you?`,
      sender: "ai",
      timestamp: new Date(),
      character: character,
    }
    setMessages([introMessage])
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedCharacter) return

    const userMessage: ChatMessage = { text: input, sender: "user", timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, character: selectedCharacter }),
      })

      if (!response.ok) throw new Error("API response was not ok.")

      const data = await response.json()
      const aiMessage: ChatMessage = {
        text: data.response || "Sorry, I encountered an error.",
        sender: "ai",
        timestamp: new Date(),
        character: selectedCharacter,
      }
      setMessages((prev) => [...prev, aiMessage])

    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: ChatMessage = {
        text: "Sorry, I can'''t respond right now.",
        sender: "ai",
        timestamp: new Date(),
        character: selectedCharacter,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (showCharacterSetup) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Your AI Companion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <div key={character.id} className="bg-gray-800 rounded-lg p-4 border border-emerald-500/30 flex flex-col">
                <div className="flex items-center space-x-4 mb-4">
                  <img src={character.avatar} alt={character.name} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500" />
                  <div className="flex-1">
                    {character.isCustomizable ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Set a name..."
                          value={character.name}
                          onChange={(e) => handleCharacterCustomization(character.id, { name: e.target.value })}
                          className="w-full p-2 bg-gray-700 text-white rounded border-gray-600"
                        />
                        <select
                          value={character.gender}
                          onChange={(e) => handleCharacterCustomization(character.id, { gender: e.target.value as any })}
                          className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
                        >
                          <option value="neutral">Neutral</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                    ) : (
                      <h3 className="text-lg font-semibold text-white">{character.name}</h3>
                    )}
                    <p className="text-emerald-400 text-sm">{character.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3 flex-grow">{character.description}</p>
                <button
                  onClick={() => selectCharacter(character)}
                  disabled={character.isCustomizable && !character.name}
                  className="w-full mt-auto p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                  Select {character.name || character.role}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="bg-emerald-600 text-white rounded-full p-4 shadow-lg">
          <MessageCircle className="h-8 w-8" />
        </button>
      )}

      {isOpen && selectedCharacter && (
        <div className="bg-gray-900/95 rounded-lg shadow-2xl w-96 h-[600px] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b border-emerald-500/30">
             <div className="flex items-center space-x-3">
                <img src={selectedCharacter.avatar} alt={selectedCharacter.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                    <h3 className="font-semibold text-white">{selectedCharacter.name || selectedCharacter.role}</h3>
                </div>
             </div>
            <div>
                <button onClick={() => setSelectedCharacter(null)} className="text-gray-400 hover:text-white">Switch</button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white ml-2"><X size={20}/></button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && <img src={msg.character?.avatar} className="w-8 h-8 rounded-full"/>}
                <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                  <p className="text-sm">{msg.text}</p>
                  <div className="text-xs text-gray-400 mt-1">{msg.timestamp.toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
             {isLoading && <div className="text-sm text-gray-400">...</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-emerald-500/30">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button onClick={handleSendMessage} disabled={!input.trim() || isLoading} className="p-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50">
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
