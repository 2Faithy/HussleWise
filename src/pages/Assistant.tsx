import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Camera, MessageSquareText, TrendingUp, Package } from 'lucide-react';
import { useBusinessData } from '../context/BusinessDataContext';
import { answerBusinessQuestion, generatePromoMessage } from '../utils/assistantEngine';
import { simulatePhotoAnalysis } from '../utils/visionStub';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isPromo?: boolean;
}

const QUICK_ACTIONS = [
  { label: "How much did I make today?", icon: TrendingUp },
  { label: "Who owes me money?", icon: MessageSquareText },
  { label: "What's low in stock?", icon: Package },
  { label: "Give me a growth tip", icon: Sparkles },
];

export default function Assistant() {
  const { sales, expenses, debts, inventory, businessProfile, addInventoryItem } = useBusinessData();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hi! I'm your Husslewise assistant. Ask me anything about your business — sales, debts, stock, or growth tips. I can also write WhatsApp promos or help you add inventory from a photo.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const [promoMode, setPromoMode] = useState(false);
  const [promoItem, setPromoItem] = useState('');
  const [promoDiscount, setPromoDiscount] = useState('10%');
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const addMessage = (role: ChatMessage['role'], content: string, isPromo = false) => {
    setMessages((prev) => [...prev, { id: `m${Date.now()}-${Math.random()}`, role, content, isPromo }]);
  };

  const handleSend = (text?: string) => {
    const question = (text ?? input).trim();
    if (!question) return;

    addMessage('user', question);
    setInput('');

    // Intercept promo requests
    if (/promo|advert|flash sale|marketing message/.test(question.toLowerCase())) {
      setPromoMode(true);
      addMessage('assistant', "I'd love to help write a promo! What item is it for, and what discount are you offering?");
      return;
    }

    setThinking(true);
    setTimeout(() => {
      const answer = answerBusinessQuestion(question, { sales, expenses, debts, inventory });
      addMessage('assistant', answer);
      setThinking(false);
    }, 600); // small delay so it feels like it's "thinking"
  };

  const handleGeneratePromo = () => {
    if (!promoItem.trim()) return;
    const message = generatePromoMessage(businessProfile.businessName, promoItem, promoDiscount);
    addMessage('assistant', message, true);
    setPromoMode(false);
    setPromoItem('');
  };

  const handleSharePromo = (message: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    addMessage('user', `📷 Uploaded a photo: ${file.name}`);
    setAnalyzingPhoto(true);
    addMessage('assistant', 'Analyzing your photo...');

    try {
      const result = await simulatePhotoAnalysis(file);
      setAnalyzingPhoto(false);

      setMessages((prev) => {
        const withoutAnalyzing = prev.filter((m) => m.content !== 'Analyzing your photo...');
        return [
          ...withoutAnalyzing,
          {
            id: `m${Date.now()}`,
            role: 'assistant',
            content: `Here's what I found: "${result.name}" — I'll estimate ${result.quantity} ${result.unit} at ${result.sellingPrice ? `₦${result.sellingPrice}` : 'an estimated price'} each. Want me to add this to your inventory? You can edit the details afterward.`,
          },
        ];
      });

      setPendingInventorySuggestion(result);
    } catch (err) {
      setAnalyzingPhoto(false);
      setMessages((prev) => {
        const withoutAnalyzing = prev.filter((m) => m.content !== 'Analyzing your photo...');
        return [
          ...withoutAnalyzing,
          {
            id: `m${Date.now()}`,
            role: 'assistant',
            content: "Sorry, I couldn't analyze that photo. Try a clearer, well-lit shot of the product.",
          },
        ];
      });
    }
    e.target.value = '';
  };

  const [pendingInventorySuggestion, setPendingInventorySuggestion] = useState<{
    name: string; quantity: number; unit: string; costPrice: number; sellingPrice: number;
  } | null>(null);

  const handleAcceptInventorySuggestion = () => {
    if (!pendingInventorySuggestion) return;
    addInventoryItem({ ...pendingInventorySuggestion, lowStockThreshold: 5 });
    addMessage('assistant', `Added "${pendingInventorySuggestion.name}" to your inventory! You can fine-tune the price and quantity anytime on the Inventory page.`);
    setPendingInventorySuggestion(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="font-headline text-2xl md:text-3xl font-bold text-brand-ink mb-1 flex items-center gap-2">
          <Sparkles size={24} className="text-brand-primary" /> AI Assistant
        </h1>
        <p className="font-body text-sm text-brand-ink/60">Ask questions, get growth tips, write promos, or add inventory from a photo.</p>
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => handleSend(label)}
            className="flex items-center gap-1.5 font-body text-xs font-bold text-brand-primary bg-white border border-brand-primary/15 px-3.5 py-2 rounded-full hover:bg-brand-bg/30 transition"
          >
            <Icon size={13} /> {label}
          </button>
        ))}
        <button
          onClick={() => { setPromoMode(true); addMessage('assistant', "Let's write a promo! What item is it for, and what discount are you offering?"); }}
          className="flex items-center gap-1.5 font-body text-xs font-bold text-brand-primary bg-white border border-brand-primary/15 px-3.5 py-2 rounded-full hover:bg-brand-bg/30 transition"
        >
          <MessageSquareText size={13} /> Write a WhatsApp promo
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 font-body text-xs font-bold text-brand-primary bg-white border border-brand-primary/15 px-3.5 py-2 rounded-full hover:bg-brand-bg/30 transition"
        >
          <Camera size={13} /> Add inventory from photo
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 bg-white rounded-2xl border border-brand-primary/10 p-5 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 font-body text-sm whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-brand-primary text-brand-bg rounded-br-sm'
                  : 'bg-brand-bg/20 text-brand-ink rounded-bl-sm'
              }`}
            >
              {msg.content}
              {msg.isPromo && (
                <button
                  onClick={() => handleSharePromo(msg.content)}
                  className="mt-3 flex items-center gap-1.5 font-body text-xs font-bold bg-green-600 text-white px-3 py-2 rounded-lg hover:opacity-90 transition"
                >
                  Share via WhatsApp
                </button>
              )}
            </div>
          </div>
        ))}

        {pendingInventorySuggestion && (
          <div className="flex justify-start">
            <button
              onClick={handleAcceptInventorySuggestion}
              className="font-body text-xs font-bold bg-brand-primary text-brand-bg px-4 py-2.5 rounded-lg hover:opacity-90 transition"
            >
              + Add "{pendingInventorySuggestion.name}" to Inventory
            </button>
          </div>
        )}

        {thinking && (
          <div className="flex justify-start">
            <div className="bg-brand-bg/20 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              <span className="w-1.5 h-1.5 bg-brand-ink/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-brand-ink/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-brand-ink/40 rounded-full animate-bounce" />
            </div>
          </div>
        )}
      </div>

      {/* Promo builder inline form */}
      {promoMode && (
        <div className="bg-white rounded-2xl border border-brand-primary/10 p-4 mb-4 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-35">
            <label className="font-body text-xs font-bold text-brand-ink/60 mb-1 block">Item</label>
            <input
              type="text"
              value={promoItem}
              onChange={(e) => setPromoItem(e.target.value)}
              placeholder="e.g. Tomatoes"
              className="w-full font-body text-sm px-3 py-2 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            />
          </div>
          <div className="w-28">
            <label className="font-body text-xs font-bold text-brand-ink/60 mb-1 block">Discount</label>
            <input
              type="text"
              value={promoDiscount}
              onChange={(e) => setPromoDiscount(e.target.value)}
              placeholder="10%"
              className="w-full font-body text-sm px-3 py-2 rounded-lg border border-brand-primary/20 bg-brand-bg/10 focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            />
          </div>
          <button
            onClick={handleGeneratePromo}
            className="font-body text-sm font-bold bg-brand-primary text-brand-bg px-5 py-2.5 rounded-lg hover:opacity-90 transition"
          >
            Generate
          </button>
          <button
            onClick={() => setPromoMode(false)}
            className="font-body text-sm font-bold text-brand-ink/50 px-3 py-2.5"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your business..."
          disabled={analyzingPhoto}
          className="flex-1 font-body text-sm px-4 py-3 rounded-lg border border-brand-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/40 disabled:opacity-50"
        />
        <button
          onClick={() => handleSend()}
          className="shrink-0 w-11 h-11 flex items-center justify-center bg-brand-primary text-brand-bg rounded-lg hover:opacity-90 transition"
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}