import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Cpu, Send, ArrowLeft } from 'lucide-react';

const API_URL = 'http://localhost:8000';

const ChatBot = ({ setActiveTab, currentDisease }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hola, Agrónomo. Soy AGRI-MIND, tu asistente de fitopatología. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: input.trim(),
        disease: currentDisease || null,
        context: currentDisease ? `El usuario acaba de detectar ${currentDisease}` : null
      });

      if (response.data.success) {
        const assistantMessage = {
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage = {
          role: 'assistant',
          content: `⚠️ ${response.data.error || 'Error al procesar tu mensaje. Por favor, verifica que el backend esté corriendo y Gemini API configurada.'}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      const errorMessage = {
        role: 'assistant',
        content: '⚠️ Error de conexión. Verifica que el backend esté corriendo en http://localhost:8000',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-black pt-12 px-4 pb-24 animate-fadeIn font-mono">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <button
          onClick={() => setActiveTab('home')}
          className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 bg-emerald-900/30 rounded-lg border border-emerald-500/30 flex items-center justify-center">
          <Cpu className="w-6 h-6 text-emerald-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-white font-bold text-lg">AGRI-MIND</h2>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-600 text-[10px] tracking-wider">
              {isLoading ? 'PROCESANDO...' : 'EN LÍNEA - v4.2'}
            </span>
          </div>
        </div>
      </div>

      {currentDisease && (
        <div className="mb-4 px-2">
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3">
            <span className="text-[9px] text-emerald-600 uppercase tracking-wider block mb-1">Contexto Activo</span>
            <span className="text-emerald-400 text-xs font-bold">{currentDisease}</span>
          </div>
        </div>
      )}

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
        <div className="flex justify-center py-2">
          <span className="text-gray-600 text-[10px] uppercase tracking-widest">
            Sesión Iniciada {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${
              msg.role === 'assistant'
                ? 'bg-emerald-900/20 border border-emerald-900 text-emerald-500'
                : 'bg-gray-800 border border-gray-700 text-white'
            }`}>
              {msg.role === 'assistant' ? 'AI' : 'YO'}
            </div>
            <div className={`p-3 rounded-lg max-w-[85%] ${
              msg.role === 'assistant'
                ? 'bg-gray-900 border border-gray-800 rounded-tl-none'
                : 'bg-emerald-900/20 border border-emerald-500/30 rounded-tr-none'
            }`}>
              <p className={`text-xs leading-relaxed whitespace-pre-wrap ${
                msg.role === 'assistant' ? 'text-gray-300' : 'text-emerald-100'
              }`}>
                {msg.content}
              </p>
              <span className="text-[8px] text-gray-600 mt-2 block">
                {msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded bg-emerald-900/20 border border-emerald-900 flex-shrink-0 flex items-center justify-center text-[10px] text-emerald-500 font-bold">
              AI
            </div>
            <div className="bg-gray-900 border border-gray-800 p-3 rounded-lg rounded-tl-none">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribir comando..."
          disabled={isLoading}
          className="w-full bg-gray-900 border border-gray-800 text-white text-xs p-4 pr-12 rounded-xl focus:outline-none focus:border-emerald-500/50 transition-colors disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-2 p-2 bg-emerald-500/10 rounded-lg text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Sugerencias rápidas */}
      <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {[
          '¿Cómo prevenir Fusarium?',
          'Tratamientos orgánicos',
          'Rotación de cultivos'
        ].map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => setInput(suggestion)}
            className="text-[10px] bg-gray-900 border border-gray-800 text-gray-400 px-3 py-2 rounded-lg hover:border-emerald-500/50 hover:text-emerald-400 transition-colors whitespace-nowrap flex-shrink-0"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatBot;
