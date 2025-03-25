// Frontend integration with OpenAI Realtime API
import React, { useState, useEffect, useRef } from 'react';

// VoiceGenerator component for handling real-time voice generation
interface VoiceGeneratorProps {
  character: string;
  text?: string;
  isPlaying: boolean;
  onPlaybackStart: () => void;
  onPlaybackComplete: () => void;
  onAudioData: (audioData: Float32Array) => void; // For lip-sync
}

const VoiceGenerator: React.FC<VoiceGeneratorProps> = ({
  character,
  text,
  isPlaying,
  onPlaybackStart,
  onPlaybackComplete,
  onAudioData
}) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  
  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);
  
  // Handle text changes and generate voice
  useEffect(() => {
    if (!text || !isPlaying) return;
    
    const generateVoice = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Close any existing event source
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
        
        // Create a new EventSource for SSE
        const eventSource = new EventSource(`/api/voice/stream-speech?character=${encodeURIComponent(character)}&text=${encodeURIComponent(text)}`);
        eventSourceRef.current = eventSource;
        
        let audioChunks: string[] = [];
        
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.status === 'started') {
            onPlaybackStart();
          } else if (data.status === 'streaming') {
            // Collect audio chunks
            audioChunks.push(data.chunk);
            
            // If this is the last chunk, create and play the audio
            if (data.isLast) {
              const audioBase64 = audioChunks.join('');
              const audioBlob = base64ToBlob(audioBase64, 'audio/mp3');
              const url = URL.createObjectURL(audioBlob);
              
              setAudioUrl(url);
              
              // Play the audio and connect to analyser for lip-sync
              if (audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.play();
                
                // Connect to audio context for analysis
                if (audioContextRef.current && analyserRef.current) {
                  const source = audioContextRef.current.createMediaElementSource(audioRef.current);
                  source.connect(analyserRef.current);
                  analyserRef.current.connect(audioContextRef.current.destination);
                  
                  // Start sending audio data for lip-sync
                  const dataArray = new Float32Array(analyserRef.current.frequencyBinCount);
                  const updateAudioData = () => {
                    analyserRef.current!.getFloatTimeDomainData(dataArray);
                    onAudioData(dataArray);
                    
                    if (isPlaying) {
                      requestAnimationFrame(updateAudioData);
                    }
                  };
                  
                  updateAudioData();
                }
              }
            }
          } else if (data.status === 'completed') {
            eventSource.close();
            setIsLoading(false);
          } else if (data.status === 'error') {
            setError(data.message);
            eventSource.close();
            setIsLoading(false);
          }
        };
        
        eventSource.onerror = () => {
          setError('Error connecting to voice stream');
          eventSource.close();
          setIsLoading(false);
        };
        
      } catch (err) {
        setError('Failed to generate voice');
        setIsLoading(false);
        console.error('Voice generation error:', err);
      }
    };
    
    generateVoice();
    
  }, [character, text, isPlaying, onPlaybackStart, onAudioData]);
  
  // Handle audio playback completion
  useEffect(() => {
    const audioElement = audioRef.current;
    
    const handleEnded = () => {
      onPlaybackComplete();
      
      // Clean up audio URL
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    };
    
    if (audioElement) {
      audioElement.addEventListener('ended', handleEnded);
    }
    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleEnded);
      }
    };
  }, [audioUrl, onPlaybackComplete]);
  
  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    
    return new Blob(byteArrays, { type: mimeType });
  };
  
  return (
    <div className="hidden">
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} />
      
      {/* Loading and error states */}
      {isLoading && <div className="sr-only">Loading voice...</div>}
      {error && <div className="sr-only">Error: {error}</div>}
    </div>
  );
};

export default VoiceGenerator;
