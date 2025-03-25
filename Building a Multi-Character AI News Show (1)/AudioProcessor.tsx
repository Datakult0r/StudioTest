// Audio processing utility for lip-sync animation
import React, { useEffect, useRef, useState } from 'react';

// AudioProcessor component for analyzing audio and driving lip-sync
interface AudioProcessorProps {
  audioUrl?: string;
  isPlaying: boolean;
  onAudioData: (data: Float32Array) => void;
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  audioUrl,
  isPlaying,
  onAudioData
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize audio context and analyzer
  useEffect(() => {
    if (typeof window === 'undefined' || isInitialized) return;
    
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInitialized]);
  
  // Handle audio URL changes
  useEffect(() => {
    if (!audioUrl || !isInitialized || !isPlaying) return;
    
    const audioElement = new Audio(audioUrl);
    audioRef.current = audioElement;
    
    // Connect audio element to analyzer
    if (audioContextRef.current && analyserRef.current) {
      // Disconnect previous source if exists
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
      }
      
      // Create new source node
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioElement);
      sourceNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      
      // Play audio
      audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      
      // Start analyzing audio
      startAudioAnalysis();
    }
    
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioUrl, isInitialized, isPlaying]);
  
  // Start audio analysis loop
  const startAudioAnalysis = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    
    const analyzeAudio = () => {
      if (!analyserRef.current || !isPlaying) return;
      
      // Get audio data
      analyserRef.current.getFloatTimeDomainData(dataArray);
      
      // Send data to parent component
      onAudioData(dataArray);
      
      // Continue loop
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    };
    
    analyzeAudio();
  };
  
  return null; // This component doesn't render anything
};

export default AudioProcessor;
