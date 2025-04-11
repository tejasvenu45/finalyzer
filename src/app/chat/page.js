"use client";

import { useState, useRef, useEffect } from 'react';
import { SendIcon, PlusIcon, SettingsIcon, ThumbsUpIcon, ThumbsDownIcon } from 'lucide-react';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your financial assistant. How can I help you today?",
      isIntro: true
    }
  ]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { role: 'user', content: inputValue }];
    setMessages(newMessages);
    setInputValue('');
    setIsThinking(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputValue })
      });

      const data = await response.json();
      if (data.success) {
        setTimeout(() => {
          setMessages([...newMessages, { role: 'assistant', content: data.data.response }]);
          setIsThinking(false);
        }, 800);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsThinking(false);
    }
  };

  const formatMessage = (content) => {
    let formatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#FFD23F] underline">$1</a>');
    formatted = formatted.replace(/\n/g, '<br />');
    return formatted;
  };

  return (
    <div className="flex h-screen bg-[#F7F7F7] text-[#1F2937]">
      {/* Sidebar */}
      {/* <aside className="w-16 md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4">
          <button className="w-full flex items-center justify-center md:justify-start gap-2 rounded-md py-2 px-3 bg-[#1A936F] text-white font-medium hover:bg-[#157a5a]">
            <PlusIcon size={20} />
            <span className="hidden md:inline">New Chat</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4">
          {/* Future: Chat history 
        </div>
        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center justify-center md:justify-start gap-2 rounded-md py-2 px-3 text-[#1F2937] hover:bg-gray-100">
            <SettingsIcon size={20} />
            <span className="hidden md:inline">Settings</span>
          </button>
        </div>
      </aside> */}

      {/* Chat content */}
      <section className="flex-1 flex flex-col">
        {/* Header */}
        {/* <header className="p-4 border-b border-gray-200 bg-white flex items-center shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#1A936F] flex items-center justify-center text-white font-bold mr-3">
            F
          </div>
          <h1 className="text-lg font-semibold">Finance Assistant</h1>
        </header> */}

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <div key={index} className="max-w-3xl mx-auto">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${message.role === 'user' ? 'bg-[#114B5F] text-white' : 'bg-[#D9F2EA] text-[#114B5F]'}`}>
                  {message.role === 'user' ? 'U' : 'F'}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-700 mb-1">
                    {message.role === 'user' ? 'You' : 'Finance Assistant'}
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
                  </div>

                  {message.role === 'assistant' && !message.isIntro && (
                    <div className="mt-2 flex items-center gap-2 text-gray-500">
                      <button className="hover:text-green-600"><ThumbsUpIcon size={16} /></button>
                      <button className="hover:text-red-600"><ThumbsDownIcon size={16} /></button>
                      <button className="text-xs hover:underline ml-1">Copy</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D9F2EA] flex items-center justify-center text-[#114B5F] flex-shrink-0">F</div>
                <div className="flex-1">
                  <div className="font-medium text-sm text-gray-700 mb-1">Finance Assistant</div>
                  <div className="animate-pulse flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Input */}
        <footer className="p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about budgeting, expenses, savings..."
                className="w-full p-4 pr-12 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-[#1A936F] focus:ring-1 focus:ring-[#1A936F]"
                disabled={isThinking}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isThinking}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-md p-1.5 ${
                  inputValue.trim() && !isThinking
                    ? 'text-[#1A936F] hover:bg-[#E6F4EF]' 
                    : 'text-gray-400'
                }`}
              >
                <SendIcon size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">Responses are for informational purposes and not financial advice.</p>
          </form>
        </footer>
      </section>
    </div>
  );
}
