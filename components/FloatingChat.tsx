import React, { useState } from 'react';
import { MessageSquare, X, Send, ShieldCheck, DollarSign } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hello! Have questions about a classified listing or want safety tips for buying locally?',
      time: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isOfferMode, setIsOfferMode] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const { showToast } = useToast();

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: inputValue.trim(),
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'Thanks for your message! Craigslist recommends meeting in person at a well-lit public space, like a police station or coffee shop, and paying with cash or verified escrow.',
          time: 'Just now'
        }
      ]);
    }, 600);
  };

  const handleSendOffer = () => {
    if (!offerAmount) return;
    const msg = `Proposed Quick Offer: $${offerAmount}`;
    setMessages(prev => [...prev, { sender: 'user', text: msg, time: 'Just now' }]);
    setIsOfferMode(false);
    setOfferAmount('');
    showToast(`Offer of $${offerAmount} prepared for seller!`, 'success');
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-xs font-bold">Community Chat</span>
        </button>
      ) : (
        <div className="w-80 sm:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl flex flex-col h-[460px] overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="px-4 py-3 bg-purple-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h4 className="text-xs font-bold font-serif">Community Messenger</h4>
                <p className="text-[10px] text-purple-200">Local Craigslist Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-2.5 bg-gray-50/50 dark:bg-gray-950/40 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-purple-700 text-white rounded-br-xs'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-gray-400 mt-0.5 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-white dark:bg-gray-900">
            <button
              onClick={() => setIsOfferMode(!isOfferMode)}
              className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 rounded-lg text-[10px] font-bold border border-purple-200 dark:border-purple-800 shrink-0 flex items-center gap-1"
            >
              <DollarSign className="w-3 h-3" /> Make Offer
            </button>
            <button
              onClick={() => {
                setInputValue('Is this item still available?');
              }}
              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-[10px] font-semibold shrink-0"
            >
              Still available?
            </button>
            <button
              onClick={() => {
                setInputValue('Where is a safe place to meet?');
              }}
              className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-[10px] font-semibold shrink-0 flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Safe meeting?
            </button>
          </div>

          {/* Inline Offer widget */}
          {isOfferMode && (
            <div className="p-2.5 bg-purple-50 dark:bg-purple-950/70 border-t border-purple-100 dark:border-purple-900 flex items-center gap-2">
              <span className="text-xs font-bold text-purple-800 dark:text-purple-300">$</span>
              <input
                type="number"
                placeholder="Enter offer amount"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="flex-1 bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 rounded-lg px-2.5 py-1 text-xs outline-none"
              />
              <button
                onClick={handleSendOffer}
                className="px-3 py-1 bg-purple-700 text-white rounded-lg text-xs font-bold"
              >
                Send Offer
              </button>
            </div>
          )}

          {/* Input bar */}
          <div className="p-2.5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs outline-none dark:text-white"
            />
            <button
              onClick={handleSend}
              className="p-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
