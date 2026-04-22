import { Bot, BookOpen, SendHorizonal, Target } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { getEcoAssistantReply, getOfflineEcoReply } from '../lib/ai'

const sdgCards = [
  {
    title: 'SDG 11: Sustainable Cities',
    description:
      'Better waste sorting keeps neighborhoods cleaner, healthier, and more resilient for everyone.',
  },
  {
    title: 'SDG 12: Responsible Consumption',
    description:
      'Recycling and reducing waste helps communities use resources efficiently and lower landfill pressure.',
  },
  {
    title: 'SDG 13: Climate Action',
    description:
      'Smart waste management reduces emissions from open burning and overflowing dumpsites.',
  },
]

const tips = [
  'Rinse containers before recycling to avoid contamination.',
  'Separate glass from general waste to keep recycling streams clean.',
  'Flatten plastic bottles to save bin space and improve collection efficiency.',
]

export default function LearnPage() {
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "I'm your Eco Assistant. Ask me anything about recycling and waste sorting.",
    },
  ])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)

  const sendMessage = async () => {
    const trimmedMessage = input.trim()
    if (!trimmedMessage || isSending) return

    const userMessage = { from: 'user', text: trimmedMessage }
    setMessages((previous) => [...previous, userMessage])
    setInput('')
    setIsSending(true)

    try {
      const reply = await getEcoAssistantReply(trimmedMessage)
      setMessages((previous) => [...previous, { from: 'bot', text: reply }])
    } catch (error) {
      toast.error(error.message || 'AI assistant unavailable.')
      setMessages((previous) => [
        ...previous,
        {
          from: 'bot',
          text: `${getOfflineEcoReply(trimmedMessage)} (Offline fallback reply)`,
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-eco-700" />
          <h2 className="text-lg font-semibold text-slate-900">Environmental Learning Hub</h2>
        </div>
        <div className="space-y-3">
          {sdgCards.map((card) => (
            <article key={card.title} className="rounded-xl border border-eco-100 bg-eco-50/50 p-4">
              <h3 className="text-sm font-semibold text-eco-800">{card.title}</h3>
              <p className="mt-1 text-sm text-slate-700">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-earth-200 bg-earth-100/70 p-5">
        <div className="mb-2 flex items-center gap-2">
          <Target className="h-5 w-5 text-earth-700" />
          <h3 className="text-base font-semibold text-earth-700">3 Quick Waste Sorting Tips</h3>
        </div>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Bot className="h-5 w-5 text-eco-700" />
          <h3 className="text-base font-semibold text-slate-900">Eco Assistant</h3>
        </div>

        <div className="mb-3 h-64 space-y-2 overflow-y-auto rounded-xl bg-slate-50 p-3">
          {messages.map((message, index) => (
            <div
              key={`${message.from}-${index}`}
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                message.from === 'user'
                  ? 'ml-auto bg-eco-600 text-white'
                  : 'bg-white text-slate-700 shadow-sm'
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') sendMessage()
            }}
            placeholder="Ask about plastic, glass, or waste..."
            disabled={isSending}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-eco-500 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={isSending}
            className="rounded-xl bg-eco-600 p-2.5 text-white transition hover:bg-eco-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
        {isSending ? <p className="mt-2 text-xs text-slate-500">Eco Assistant is thinking...</p> : null}
      </section>
    </div>
  )
}
