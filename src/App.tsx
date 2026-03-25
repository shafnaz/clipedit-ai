import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Clipboard, Image as ImageIcon, Send, Loader2, RefreshCw, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Initialize Gemini API
// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface RowData {
  id: string;
  pastedImage: string | null;
  prompt: string;
  resultImage: string | null;
  isLoading: boolean;
  error: string | null;
}

interface RowProps {
  data: RowData;
  onUpdate: (id: string, updates: Partial<RowData>) => void;
  onProcess: (id: string) => void | Promise<void>;
  isActive: boolean;
  onFocus: () => void;
}

const Row: React.FC<RowProps> = ({ 
  data, 
  onUpdate, 
  onProcess, 
  isActive, 
  onFocus 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [data.prompt]);

  const handleResetRow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(data.id, {
      pastedImage: null,
      prompt: '',
      resultImage: null,
      isLoading: false,
      error: null
    });
  };

  return (
    <div 
      onClick={onFocus}
      className={`grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl border-2 transition-all duration-300 ${
        isActive ? 'border-orange-500/50 bg-zinc-900/50 shadow-lg shadow-orange-500/5' : 'border-zinc-800 bg-transparent'
      }`}
    >
      {/* Input Image */}
      <div className="relative group">
        <div className="relative bg-zinc-900 rounded-2xl p-6 border border-zinc-800 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <Clipboard className="w-4 h-4" /> Input
            </h2>
            <div className="flex items-center gap-3">
              {data.pastedImage && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onUpdate(data.id, { pastedImage: null }); }}
                  className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
              <button 
                onClick={handleResetRow}
                className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-red-400 transition-colors"
              >
                Reset Row
              </button>
            </div>
          </div>

          <div className="flex-1 aspect-square md:aspect-auto rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden relative min-h-[200px]">
            {data.pastedImage ? (
              <img 
                src={data.pastedImage} 
                alt="Pasted" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-center p-4">
                <ImageIcon className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500 text-[9px] uppercase tracking-widest leading-relaxed">
                  {isActive ? 'Paste Image (Ctrl+V)' : 'Click to Focus & Paste'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prompt Field */}
      <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 flex flex-col">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-2">
          <Send className="w-4 h-4" /> Prompt
        </h2>
        <textarea
          ref={textareaRef}
          value={data.prompt}
          onChange={(e) => onUpdate(data.id, { prompt: e.target.value })}
          placeholder="Describe the transformation..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm focus:outline-none focus:border-orange-500/50 transition-colors resize-none font-sans overflow-hidden min-h-[120px]"
        />
        
        <button
          onClick={(e) => { e.stopPropagation(); onProcess(data.id); }}
          disabled={data.isLoading || !data.pastedImage || !data.prompt}
          className="w-full mt-4 bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
        >
          {data.isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>Process Row</>
          )}
        </button>
        
        {data.error && (
          <div className="mt-4 space-y-2">
            <p className="text-red-500 text-[10px] font-mono bg-red-500/10 p-3 rounded-lg border border-red-500/20 uppercase tracking-wider leading-relaxed">
              Error: {data.error}
            </p>
            <button 
              onClick={(e) => { e.stopPropagation(); onProcess(data.id); }}
              className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-3 h-3" /> Try Again
            </button>
          </div>
        )}
      </div>

      {/* Result Image */}
      <div className="relative group">
        <div className="relative h-full bg-zinc-900 rounded-2xl p-6 border border-zinc-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${data.isLoading ? 'animate-spin' : ''}`} /> Result
            </h2>
            {data.resultImage && (
              <button 
                onClick={(e) => { e.stopPropagation(); onUpdate(data.id, { resultImage: null }); }}
                className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex-1 rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden min-h-[200px]">
            <AnimatePresence mode="wait">
              {data.resultImage ? (
                <motion.img 
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={data.resultImage} 
                  alt="Result" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-8"
                >
                  {data.isLoading ? (
                    <div className="space-y-4">
                      <Loader2 className="w-10 h-10 text-orange-500 mx-auto animate-spin" />
                      <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest animate-pulse">Generating...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-full border-2 border-zinc-800 flex items-center justify-center mx-auto mb-3">
                        <ImageIcon className="w-5 h-5 text-zinc-700" />
                      </div>
                      <p className="text-zinc-500 text-[9px] font-mono uppercase tracking-widest">Awaiting</p>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {data.resultImage && (
            <a 
              href={data.resultImage} 
              download={`transformed-${data.id}.png`}
              className="mt-4 text-center text-[10px] font-mono uppercase tracking-widest text-zinc-500 hover:text-white transition-colors underline underline-offset-4"
            >
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [rows, setRows] = useState<RowData[]>([
    { id: '1', pastedImage: null, prompt: '', resultImage: null, isLoading: false, error: null }
  ]);
  const [activeRowId, setActiveRowId] = useState<string>('1');

  const updateRow = (id: string, updates: Partial<RowData>) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, ...updates } : row));
  };

  const handleRowCountChange = (count: number) => {
    const newCount = Math.max(1, Math.min(10, count));
    setRows(prev => {
      if (newCount > prev.length) {
        const additional = Array.from({ length: newCount - prev.length }, (_, i) => ({
          id: (prev.length + i + 1).toString(),
          pastedImage: null,
          prompt: '',
          resultImage: null,
          isLoading: false,
          error: null
        }));
        return [...prev, ...additional];
      } else {
        return prev.slice(0, newCount);
      }
    });
  };

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            updateRow(activeRowId, { pastedImage: event.target?.result as string, error: null });
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  }, [activeRowId]);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const processRow = async (id: string) => {
    const row = rows.find(r => r.id === id);
    if (!row || !row.pastedImage || !row.prompt) return;

    updateRow(id, { isLoading: true, error: null });
    console.log(`[ClipEdit] Row ${id}: Starting transformation...`);

    try {
      // Create fresh instance to ensure up-to-date auth
      const aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const base64Data = row.pastedImage.split(',')[1];
      const mimeType = row.pastedImage.split(';')[0].split(':')[1];

      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('The request timed out after 60 seconds. Please try again.')), 60000)
      );

      const apiPromise = aiInstance.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: mimeType } },
            { text: row.prompt },
          ],
        },
      });

      const response = await Promise.race([apiPromise, timeoutPromise]) as any;
      console.log(`[ClipEdit] Row ${id}: Received response.`);

      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            updateRow(id, { resultImage: `data:image/png;base64,${part.inlineData.data}`, error: null });
            foundImage = true;
            console.log(`[ClipEdit] Row ${id}: Transformation successful.`);
            break;
          }
        }
      }

      if (!foundImage) {
        const errorMsg = 'The model did not return an image. Try a different prompt or check your API key.';
        updateRow(id, { error: errorMsg });
        console.warn(`[ClipEdit] Row ${id}: ${errorMsg}`);
      }
    } catch (err: any) {
      console.error(`[ClipEdit] Row ${id} error:`, err);
      let errorMsg = err.message || 'An error occurred during processing.';
      
      // Handle common auth errors specifically
      if (errorMsg.includes('401') || errorMsg.toLowerCase().includes('unauthorized')) {
        errorMsg = 'Authentication error (401). Please ensure your Gemini API key is valid and has not expired.';
      } else if (errorMsg.includes('429')) {
        errorMsg = 'Rate limit exceeded (429). Please wait a moment before trying again.';
      }
      
      updateRow(id, { error: errorMsg });
    } finally {
      updateRow(id, { isLoading: false });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans p-4 md:p-8 flex flex-col items-center">
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full mb-12 text-center"
      >
        <h1 className="text-5xl font-bold tracking-tighter mb-2 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent uppercase">
          ClipEdit AI
        </h1>
        <p className="text-zinc-500 font-mono text-[10px] tracking-[0.3em] uppercase mb-8">
          Multi-Row Image Transformation
        </p>

        <div className="flex items-center justify-center gap-4 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 w-fit mx-auto">
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">Rows</span>
          </div>
          <input 
            type="number" 
            min="1" 
            max="10"
            value={rows.length}
            onChange={(e) => handleRowCountChange(parseInt(e.target.value) || 1)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 w-20 text-center text-sm focus:outline-none focus:border-orange-500/50 transition-colors font-mono"
          />
        </div>
      </motion.header>

      <main className="max-w-7xl w-full flex flex-col gap-8">
        {rows.map((row) => (
          <Row 
            key={row.id}
            data={row}
            isActive={activeRowId === row.id}
            onFocus={() => setActiveRowId(row.id)}
            onUpdate={updateRow}
            onProcess={processRow}
          />
        ))}
      </main>

      <footer className="mt-16 text-zinc-600 text-[9px] font-mono uppercase tracking-[0.3em]">
        Powered by Gemini 2.5 Flash Image
      </footer>
    </div>
  );
}
