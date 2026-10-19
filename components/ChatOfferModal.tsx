import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  DollarSign, 
  Sparkles, 
  CheckCheck, 
  AlertTriangle,
  Clock,
  UserCheck
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Listing } from '../types';

interface ChatOfferModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'buyer' | 'seller';
  text: string;
  timestamp: string;
}

export const ChatOfferModal: React.FC<ChatOfferModalProps> = ({ listing, isOpen, onClose }) => {
  const { showToast } = useToast();
  const [offerAmount, setOfferAmount] = useState('');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'seller',
      text: `Hi! Thanks for checking out my listing for "${listing.title}". Feel free to ask any questions or schedule a public inspection.`,
      timestamp: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const rawPriceNum = parseInt(listing.price.replace(/[^0-9]/g, '')) || 100;
  const quickOffers = [
    { label: 'Full Price', val: `${rawPriceNum}` },
    { label: '-10% Offer', val: `${Math.round(rawPriceNum * 0.9)}` },
    { label: '-15% Offer', val: `${Math.round(rawPriceNum * 0.85)}` }
  ];

  const quickQuestions = [
    'Is this item still available?',
    'Can I inspect it in person today?',
    'Does it come with original accessories?'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const newBuyerMsg: Message = {
      id: `b-${Date.now()}`,
      sender: 'buyer',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newBuyerMsg]);
    setInputText('');

    // Simulate seller real-time reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let sellerReply = `Yes, it's available! I can meet near ${listing.location} in a safe public spot.`;
      if (text.toLowerCase().includes('offer') || text.includes('$')) {
        sellerReply = `Thanks for the offer! That sounds reasonable if you can pick it up today or tomorrow.`;
      }
      setMessages(prev => [
        ...prev,
        {
          id: `s-${Date.now()}`,
          sender: 'seller',
          text: sellerReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerAmount) return;
    handleSendMessage(`Hi! I'd like to make an offer of $${offerAmount} for "${listing.title}". Would that work for you?`);
    setOfferAmount('');
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[600px] max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 bg-gray-50/70 dark:bg-gray-850">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-11 h-11 rounded-xl object-cover border border-gray-200 dark:border-gray-700 shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-gray-900 dark:text-gray-100 truncate">
                  {listing.seller?.name || 'Verified Craigslist Seller'}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.2 rounded-md">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                Listing: <strong>{listing.title}</strong> — <span className="text-purple-700 dark:text-purple-400 font-bold">{listing.price}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Safety banner */}
        <div className="bg-amber-50 dark:bg-amber-950/30 px-4 py-2 border-b border-amber-100 dark:border-amber-900/40 flex items-center gap-2 text-[11px] text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="truncate">Safety Rule: Never wire funds or pay with gift cards. Inspect in a public location.</span>
        </div>

        {/* Messages body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fdfdfd] dark:bg-gray-950">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'buyer' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'buyer'
                    ? 'bg-purple-700 text-white rounded-br-xs'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200/80 dark:border-gray-700 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1 flex items-center gap-1">
                <span>{msg.timestamp}</span>
                {msg.sender === 'buyer' && <CheckCheck className="w-3 h-3 text-purple-600" />}
              </span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-2xl w-24 text-[10px] text-gray-400 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 font-medium">typing</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Offer & Questions Bar */}
        <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 space-y-2">
          
          {/* Quick chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] font-bold text-gray-400 shrink-0">Offers:</span>
            {quickOffers.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(`Hi, would you accept $${q.val} for this?`)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 transition-colors shrink-0"
              >
                ${q.val} ({q.label})
              </button>
            ))}

            <span className="text-[10px] font-bold text-gray-400 shrink-0 ml-2">Quick:</span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-purple-500 transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input field & send button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Type your message to seller..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs font-medium dark:text-white outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
