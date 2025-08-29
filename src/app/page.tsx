'use client';

import { useState } from 'react';
import axios from 'axios';
import { ArrowUp } from "lucide-react";


export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const cleanResponse = (code: string) => {
    return code
      .replace(/```html/gi, '')
      .replace(/```/g, '')
      .trim();
  };

  const generateCode = async () => {
    if (!prompt.trim()) return;

    const newMessages = [...messages, { role: 'user', content: prompt }];
    setMessages(newMessages);
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await axios.post('https://codeide-production.up.railway.app/api/generate', {
        prompt,
      });

      const cleaned = cleanResponse(response.data.code || '');
      setMessages([...newMessages, { role: 'ai', content: cleaned }]);
    } catch (error) {
      console.error('Error generating code:', error);
      setMessages([...newMessages, { role: 'ai', content: '<p>⚠️ Failed to generate response.</p>' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const latestResponse = messages.filter((m) => m.role === 'ai').slice(-1)[0];
  const latestPrompt = messages.filter((m) => m.role === 'user').slice(-1)[0];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
     <div className="w-[300px] bg-gray-200 border-r border-gray-300 flex flex-col">
  <div className="p-4 font-bold text-lg border-b border-gray-700">Chats</div>
  <div className="flex-1 overflow-y-auto">
    {messages
      .filter((m) => m.role === 'user')
      .map((m, i) => (
        <div
          key={i}
          className="p-3 border-b border-gray-300 cursor-pointer hover:bg-gray-300 text-sm break-words break-all whitespace-pre-wrap"
        >
          {m.content}
        </div>
      ))}
  </div>
</div>



      {/* Main Panel */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col space-y-6">
          {latestPrompt && (
            <div className="flex justify-end">
              <div className="max-w-xl px-4 py-2 rounded-2xl bg-blue-600 text-white rounded-br-none">
                {latestPrompt.content}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-gray-500 text-sm animate-pulse">AI is typing...</div>
          )}

          {latestResponse && !isLoading && (
            <div className="flex-1 flex justify-start">
              <div className="w-full bg-white rounded-xl shadow overflow-hidden flex-1">
                <iframe
                  srcDoc={latestResponse.content}
                  className="w-full h-full border-0"
                  title="ai-response"
                />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-6 border-t border-gray-300 bg-gray-100">
          <div className="flex items-center bg-white rounded-2xl px-6 py-5 shadow-xl border border-gray-200 space-x-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Send a message..."
              rows={2}
              className="flex-1 resize-none bg-transparent outline-none text-gray-900 placeholder-gray-500 text-base leading-relaxed"
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), generateCode())}
            />
            <button
              onClick={generateCode}
              disabled={isLoading}
              className="flex items-center justify-center bg-pink-400 hover:bg-pink-500 rounded-full w-12 h-12 transition-all disabled:opacity-50 shadow-md btn-hover"
            >
              <ArrowUp className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>




      </div>
    </div>
  );
}
