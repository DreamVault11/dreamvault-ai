"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Mic, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2,
  ArrowRight,
  Brain,
  MessageCircle,
  SkipForward,
  Loader2,
  PartyPopper
} from "lucide-react";
import { DreamButton } from "@/components/ui/DreamButton";
import { DreamCard } from "@/components/ui/DreamCard";
import { DreamInput } from "@/components/ui/DreamInput";
import { useRecallAssistant } from "@/lib/hooks/use-recall-assistant";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "ai" | "user";
  text: string;
  category?: string;
}

export const RecallChat: React.FC = () => {
  const {
    start,
    answer,
    currentQuestion,
    currentCategory,
    isComplete: isRecallComplete,
    answers,
    startState,
    answerState,
    sessionState
  } = useRecallAssistant();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, answerState.loading]);

  const startRecall = async () => {
    setIsStarted(true);
    const result = await start();
    if (result) {
      setMessages([
        {
          id: "intro",
          role: "ai",
          text: "Let's explore your dream together. I'll guide you through the details as they surface. Take your time.",
        },
        {
          id: result.question.id,
          role: "ai",
          text: result.question.question,
          category: result.question.category,
        }
      ]);
    }
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || answerState.loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    const result = await answer(text);
    
    if (result) {
      if (result.sessionState.isComplete) {
        // Complete
      } else {
        const aiMessage: ChatMessage = {
          id: result.question.id,
          role: "ai",
          text: result.question.question,
          category: result.question.category,
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    }
  };

  const skipQuestion = () => {
    handleSend("I don't remember specifically.");
  };

  if (!isStarted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-12"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full animate-pulse" />
          <div className="relative p-8 rounded-full bg-white/5 border border-white/10">
            <Brain className="w-16 h-16 text-primary" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-tight">Recall Session</h2>
          <p className="text-foreground/60 max-w-sm mx-auto text-lg leading-relaxed">
            Let's explore your dream together. I'll ask a few questions to help pull the details into focus.
          </p>
        </div>
        <DreamButton variant="gradient" size="lg" className="px-12 py-5 text-xl group" onClick={startRecall}>
          Begin Recall
          <ArrowRight className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" />
        </DreamButton>
      </motion.div>
    );
  }

  if (isComplete) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-8"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ type: "spring", damping: 12 }}
          className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30"
        >
          <PartyPopper className="w-12 h-12 text-primary" />
        </motion.div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-tight">Recall Complete!</h2>
          <p className="text-foreground/60 max-w-sm mx-auto text-lg leading-relaxed">
            Your subconscious landscape has been mapped. We've captured {answers.length} key details from your dream.
          </p>
        </div>

        {/* Summary Preview */}
        <div className="w-full max-w-md grid grid-cols-2 gap-3 pt-6">
          {answers.slice(0, 4).map((ans, i) => (
             <div key={i} className="p-3 rounded-2xl bg-white/5 border border-white/5 text-left">
               <span className="text-[10px] text-white/40 uppercase font-bold block mb-1">{ans.category}</span>
               <span className="text-sm text-white/80 line-clamp-1">{ans.answer}</span>
             </div>
          ))}
        </div>

        <div className="pt-8 w-full max-w-xs space-y-4">
          <DreamButton variant="gradient" className="w-full py-4 text-lg" onClick={() => window.location.href = '/dashboard'}>
            Generate Dream Movie
          </DreamButton>
          <button 
            className="text-foreground/40 hover:text-white transition-colors text-sm"
            onClick={() => window.location.href = '/timeline'}
          >
            Go to Timeline
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-[75vh] md:h-[650px] w-full max-w-3xl mx-auto bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-dream-gradient flex items-center justify-center relative">
            <Sparkles className="w-5 h-5 text-white" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-black" />
          </div>
          <div>
            <h3 className="font-bold text-white">Dream Assistant</h3>
            <p className="text-[10px] text-green-400 uppercase tracking-widest font-bold">Guided Recall</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest block">Session Progress</span>
          <div className="flex items-center gap-3">
             <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-dream-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / recallQuestions.length) * 100}%` }}
                />
             </div>
             <span className="text-xs font-mono text-white/60">{currentStep + 1}/7</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={msg.id + idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
              className={cn(
                "flex w-full",
                msg.role === "ai" ? "justify-start" : "justify-end"
              )}
            >
              <div className={cn(
                "max-w-[80%] px-6 py-4 rounded-3xl text-lg leading-relaxed",
                msg.role === "ai" 
                  ? "bg-white/5 text-white rounded-tl-none border border-white/5" 
                  : "bg-dream-gradient text-white rounded-tr-none shadow-lg"
              )}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white/5 px-6 py-4 rounded-3xl rounded-tl-none flex gap-1">
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer / Input Area */}
      <div className="p-8 pt-0 space-y-6">
        {/* Suggestion Chips */}
        {!isComplete && currentQuestion.options && (
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 no-scrollbar">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSend(option)}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-foreground/60 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap text-sm"
              >
                {option}
              </button>
            ))}
            <button
              onClick={skipQuestion}
              className="px-4 py-2 rounded-full bg-transparent border border-white/5 text-foreground/30 hover:text-white transition-all flex items-center gap-2 text-sm"
            >
              <SkipForward className="w-3 h-3" />
              I don't remember
            </button>
          </div>
        )}

        {!isComplete && !currentQuestion.options && (
           <div className="flex flex-wrap gap-2">
             <button
                onClick={skipQuestion}
                className="px-4 py-2 rounded-full bg-transparent border border-white/5 text-foreground/30 hover:text-white transition-all flex items-center gap-2 text-sm"
              >
                <SkipForward className="w-3 h-3" />
                I don't remember
              </button>
           </div>
        )}

        {/* Input Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <DreamInput 
              placeholder="Type your answer..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(inputValue)}
              className="bg-black/20 border-white/10 h-14"
            />
          </div>
          <button
            onClick={() => handleSend(inputValue)}
            disabled={!inputValue.trim() || isTyping}
            className="w-14 h-14 rounded-full bg-dream-gradient flex items-center justify-center shadow-lg disabled:opacity-50 disabled:grayscale transition-all active:scale-90"
          >
            <Send className="w-6 h-6 text-white" />
          </button>
          <button
            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Mic className="w-6 h-6 text-foreground/40" />
          </button>
        </div>
      </div>
    </div>
  );
};
