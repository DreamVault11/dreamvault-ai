"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Play, Pause, Check, Wand2 } from "lucide-react";
import { DreamButton } from "@/components/ui/DreamButton";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingDuration(0);
      
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const togglePause = () => {
    if (!mediaRecorderRef.current) return;
    
    if (isPaused) {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
    }
    setIsPaused(!isPaused);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const discardRecording = () => {
    setAudioBlob(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setRecordingDuration(0);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      {!audioBlob && !isRecording && (
        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={startRecording}
            className="w-32 h-32 rounded-full bg-dream-gradient flex items-center justify-center shadow-[0_0_50px_rgba(155,77,255,0.4)] hover:scale-105 transition-transform active:scale-95 group"
          >
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping group-hover:animate-none" />
            <Mic className="w-12 h-12 text-white relative z-10" />
          </button>
          <div className="text-center space-y-2">
            <p className="text-white font-semibold text-lg">Tap to Record</p>
            <p className="text-foreground/40 text-sm">Speak naturally about your dream</p>
          </div>
        </div>
      )}

      {isRecording && (
        <div className="flex flex-col items-center space-y-8 w-full">
          <div className="text-5xl font-mono text-white tracking-tighter">
            {formatDuration(recordingDuration)}
          </div>
          
          <div className="flex items-end justify-center space-x-1.5 h-16">
             {[...Array(16)].map((_, i) => (
               <div 
                 key={i} 
                 className={cn(
                   "w-1.5 bg-primary rounded-full transition-all duration-150",
                   isPaused ? "h-1 opacity-20" : "animate-pulse"
                 )}
                 style={{ 
                   height: isPaused ? '4px' : `${Math.random() * 60 + 10}%`,
                   animationDelay: `${i * 0.05}s`
                 }}
               />
             ))}
          </div>

          <div className="flex items-center space-x-8">
            <button
              onClick={togglePause}
              className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              {isPaused ? <Play className="w-6 h-6 text-white fill-white" /> : <Pause className="w-6 h-6 text-white" />}
            </button>

            <button
              onClick={stopRecording}
              className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center hover:bg-red-500/30 transition-colors group"
            >
              <Square className="w-8 h-8 text-red-500 fill-red-500 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={discardRecording}
              className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors text-foreground/40 hover:text-red-400"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>
          <p className={cn(
            "text-sm font-medium",
            isPaused ? "text-foreground/40" : "text-red-500 animate-pulse"
          )}>
            {isPaused ? "Recording Paused" : "Recording Subconscious..."}
          </p>
        </div>
      )}

      {audioBlob && (
        <div className="flex flex-col items-center space-y-8 w-full max-w-sm">
          <div className="w-full bg-white/5 rounded-[32px] p-8 border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">Recording Ready</span>
              <span className="text-sm font-mono text-white">{formatDuration(recordingDuration)}</span>
            </div>
            
            <audio 
              ref={audioRef} 
              src={previewUrl || ""} 
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />

            <div className="flex items-center justify-center space-x-8">
              <button
                onClick={discardRecording}
                className="p-4 rounded-full hover:bg-white/5 text-foreground/40 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-7 h-7" />
              </button>
              
              <button
                onClick={togglePlayback}
                className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-xl"
              >
                {isPlaying ? <Pause className="w-8 h-8 fill-black" /> : <Play className="w-8 h-8 fill-black ml-1" />}
              </button>

              <button
                className="p-4 rounded-full hover:bg-primary/10 text-primary transition-colors group relative"
                title="Transcribe Voice to Text"
              >
                <Wand2 className="w-7 h-7 group-hover:rotate-12 transition-transform" />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">AI Transcribe</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col w-full space-y-4">
            <DreamButton 
              variant="gradient" 
              className="w-full py-4 text-lg" 
              onClick={() => onRecordingComplete(audioBlob)}
            >
              Save Recording
            </DreamButton>
            <button 
              onClick={discardRecording}
              className="text-sm text-foreground/40 hover:text-white transition-colors"
            >
              Discard and retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
