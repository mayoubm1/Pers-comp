
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface Character {
  id: string
  name: string
  nameAr: string
  specialty: string
  specialtyAr: string
  avatar: string
  video: string
  personality: string
  voice: string
}

const StargateInterface = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const characters: Character[] = [
      {
        id: "nefertiti",
        name: "Dr. Nefertiti",
        nameAr: "د. نفرتيتي",
        specialty: "Ancient Medicine & Wellness",
        specialtyAr: "الطب القديم والعافية",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/egyptian-queen-ancient-egypt.jpg-okWyBDkGbGv2qQHGJlGpSJrMXY7kff.jpeg",
        video:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c91d30f1-b678-486d-a91b-eace74074746%20%281%29-ItWFsbcInhhmISd9xmvCYguZZWCitF.mp4",
        personality: "wise, nurturing, connects ancient wisdom with modern medicine",
        voice: "female-ar-eg",
      },
      {
        id: "cleopatra",
        name: "Dr. Cleopatra",
        nameAr: "د. كليوباترا",
        specialty: "Royal Healthcare & Diagnostics",
        specialtyAr: "الرعاية الصحية الملكية والتشخيص",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/output%20%282%29-p41U1omIINqaCNL7NQLsJBgVPsmNF0.jpeg",
        video:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c91d30f1-b678-486d-a91b-eace74074746%20%281%29-ItWFsbcInhhmISd9xmvCYguZZWCitF.mp4",
        personality: "authoritative, intelligent, comprehensive medical knowledge",
        voice: "female-ar-eg",
      },
      {
        id: "sarah",
        name: "Dr. Sarah",
        nameAr: "د. سارة",
        specialty: "Modern Medicine & Technology",
        specialtyAr: "الطب الحديث والتكنولوجيا",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eda8ba25-805d-4e4e-b0c6-e2db0e9a1d29.png-r9EmwMmyIwgJUXjGMIGKxKtAcBglMS.jpeg",
        video:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c91d30f1-b678-486d-a91b-eace74074746%20%281%29-ItWFsbcInhhmISd9xmvCYguZZWCitF.mp4",
        personality: "modern, tech-savvy, evidence-based approach",
        voice: "female-en-us",
      },
      {
        id: "mohamed",
        name: "Dr. Mohamed",
        nameAr: "د. محمد",
        specialty: "Telemedicine & Digital Health",
        specialtyAr: "الطب عن بُعد والصحة الرقمية",
        avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pp.jpg-l7OSYOq0UcHdNi5wWLrF3ze6Ji1eDa.jpeg",
        video:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2dfb29c5-449a-4367-bc7f-a828c0cd02dc-4btUEjUjKnpXdy0u5aJg16aqSQvHto.mp4",
        personality: "professional, empathetic, technology-focused",
        voice: "male-ar-eg",
      },
      {
        id: "seasons",
        name: "Dr. Harmony",
        nameAr: "د. هارموني",
        specialty: "Holistic Health & Wellness",
        specialtyAr: "الصحة الشاملة والعافية",
        avatar:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/img%20%2824%29-ZBaqxyFQ2i0DySyAZgMxH0YALea3VK.webp",
        video:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c91d30f1-b678-486d-a91b-eace74074746%20%281%29-ItWFsbcInhhmISd9xmvCYguZZWCitF.mp4",
        personality: "holistic, seasonal wellness expert, natural healing",
        voice: "female-en-us",
      },
       {
        id: "synapse",
        name: "Synapse",
        nameAr: "تشابك",
        specialty: "Cognitive Resilience & Neural Connection",
        specialtyAr: "المرونة المعرفية والاتصال العصبي",
        avatar: "https://res.cloudinary.com/dneamcgig/image/upload/v1757413789/Picsart_25-09-09_13-02-01-511_incjqv.png",
        video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c91d30f1-b678-486d-a91b-eace74074746%20%281%29-ItWFsbcInhhmISd9xmvCYguZZWCitF.mp4",
        personality: "luminous, resilient, a weaver of networks, fights isolation",
        voice: "female-en-us",
      },
      {
        id: "lumen",
        name: "Lumen",
        nameAr: "نور",
        specialty: "Neuro-Regeneration & Memory Restoration",
        specialtyAr: "تجديد الخلايا العصبية واستعادة الذاكرة",
        avatar: "https://res.cloudinary.com/dneamcgig/image/upload/v1757413788/Picsart_25-09-09_13-04-20-305_umwxuo.png",
        video: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c91d30f1-b678-486d-a91b-eace74074746%20%281%29-ItWFsbcInhhmISd9xmvCYguZZWCitF.mp4",
        personality: "a beacon of hope, illuminates forgotten pathways, battles the black plague",
        voice: "female-ar-eg",
      }
    ]
    setSelectedCharacter(characters[0])
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      {selectedCharacter && (
        <motion.div
          key={selectedCharacter.id}
          className="w-full max-w-4xl bg-black rounded-3xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative h-96">
            <video
              key={selectedCharacter.video}
              className="absolute top-0 left-0 w-full h-full object-cover"
              autoPlay
              loop
              muted={isMuted}
              playsInline
            >
              <source src={selectedCharacter.video} type="video/mp4" />
            </video>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-black/20" />
            <div className="absolute bottom-6 left-6 text-left">
              <h1 className="text-4xl font-bold">{selectedCharacter.name}</h1>
              <p className="text-xl text-yellow-300">{selectedCharacter.specialty}</p>
            </div>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-4 right-4 bg-black/50 p-2 rounded-full backdrop-blur-sm"
            >
              {isMuted ? "Unmute" : "Mute"}
            </button>
          </div>
          <div className="p-6 bg-gray-900/50 backdrop-blur-xl">
            <p className="text-lg italic">"{selectedCharacter.personality}"</p>
          </div>
        </motion.div>
      )}

      <div className="flex space-x-4 mt-8">
        {/* Character selection logic can be added here */}
      </div>
    </div>
  )
}

export default StargateInterface
