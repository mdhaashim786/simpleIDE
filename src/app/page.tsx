'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateCode = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('https://codeide-production.up.railway.app/api/generate', {
        prompt
      });
      setGeneratedCode(response.data.code);
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel - Chat Interface */}
      <div className="w-1/2 bg-gray-900 text-white p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Describe Your Website</h2>
        
        <div className="flex-1 mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., 'build me a hello world website with a blue header'"
            className="w-full h-32 p-3 bg-gray-800 border border-gray-700 rounded text-white resize-none"
          />
        </div>
        
        <button
          onClick={generateCode}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded font-medium"
        >
          {isLoading ? 'Generating...' : 'Generate Website'}
        </button>
        
        {generatedCode && (
          <div className="mt-4 flex-1">
            <h3 className="text-lg font-medium mb-2">Generated Code:</h3>
            <pre className="bg-gray-800 p-3 rounded text-sm overflow-auto max-h-64">
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}
      </div>

      {/* Right Panel - Live Preview */}
      <div className="w-1/2 bg-white">
        <div className="h-full">
          {generatedCode ? (
            <iframe
              srcDoc={generatedCode}
              className="w-full h-full border-0"
              title="Website Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Your generated website will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}