import React, { useState, useEffect } from 'react';

// LipSync component to handle mouth animations based on audio
interface LipSyncProps {
  audioUrl?: string;
  isPlaying: boolean;
  characterName: string;
}

const LipSync: React.FC<LipSyncProps> = ({ audioUrl, isPlaying, characterName }) => {
  const [mouthState, setMouthState] = useState<'closed' | 'slightly' | 'medium' | 'wide'>('closed');
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  
  // Initialize audio context and analyzer
  useEffect(() => {
    if (typeof window !== 'undefined' && isPlaying && audioUrl) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyzerNode = context.createAnalyser();
      analyzerNode.fftSize = 256;
      
      const bufferLength = analyzerNode.frequencyBinCount;
      const dataArr = new Uint8Array(bufferLength);
      
      setAudioContext(context);
      setAnalyser(analyzerNode);
      setDataArray(dataArr);
      
      // Load and play audio
      fetch(audioUrl)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          const source = context.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(analyzerNode);
          analyzerNode.connect(context.destination);
          source.start(0);
        })
        .catch(error => console.error('Error loading audio:', error));
    }
    
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioUrl, isPlaying]);
  
  // Analyze audio and update mouth state
  useEffect(() => {
    if (!analyser || !dataArray || !isPlaying) return;
    
    const updateMouthState = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      
      // Map average volume to mouth state
      if (average < 20) {
        setMouthState('closed');
      } else if (average < 60) {
        setMouthState('slightly');
      } else if (average < 120) {
        setMouthState('medium');
      } else {
        setMouthState('wide');
      }
      
      requestAnimationFrame(updateMouthState);
    };
    
    updateMouthState();
  }, [analyser, dataArray, isPlaying]);
  
  // Character-specific mouth styles
  const getMouthStyle = () => {
    const baseStyle = {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'black',
      borderRadius: '50%',
      transition: 'all 0.05s ease'
    } as React.CSSProperties;
    
    // Adjust size based on mouth state
    switch (mouthState) {
      case 'closed':
        return { ...baseStyle, width: '20px', height: '3px', bottom: '30%' };
      case 'slightly':
        return { ...baseStyle, width: '24px', height: '8px', bottom: '28%' };
      case 'medium':
        return { ...baseStyle, width: '28px', height: '14px', bottom: '26%' };
      case 'wide':
        return { ...baseStyle, width: '32px', height: '20px', bottom: '24%' };
      default:
        return baseStyle;
    }
  };
  
  return (
    <div style={getMouthStyle()} className={`mouth-${characterName.toLowerCase().replace(/\s+/g, '-')}`} />
  );
};

export default LipSync;
