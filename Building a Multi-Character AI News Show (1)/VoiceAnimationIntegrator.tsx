// Integration of voice and animation systems
import React, { useState, useEffect } from 'react';
import AnimationController from './AnimationController';
import AudioProcessor from './AudioProcessor';
import VoiceGenerator from './VoiceGenerator';

// VoiceAnimationIntegrator component to connect voice and animation
interface VoiceAnimationIntegratorProps {
  character: {
    name: string;
    personality: string;
    voiceType: string;
    energyLevel: number;
  };
  isActive: boolean;
  dialogueText?: string;
  onSpeechComplete: () => void;
}

const VoiceAnimationIntegrator: React.FC<VoiceAnimationIntegratorProps> = ({
  character,
  isActive,
  dialogueText,
  onSpeechComplete
}) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  
  // Start voice generation when character becomes active
  useEffect(() => {
    if (isActive && dialogueText) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      setAudioUrl(null);
      setAudioData(null);
    }
  }, [isActive, dialogueText]);
  
  // Handle voice generation completion
  const handlePlaybackComplete = () => {
    setIsPlaying(false);
    setAudioUrl(null);
    setAudioData(null);
    onSpeechComplete();
  };
  
  // Handle audio data for lip-sync
  const handleAudioData = (data: Float32Array) => {
    setAudioData(data);
  };
  
  // Handle audio URL from voice generator
  const handleAudioGenerated = (url: string) => {
    setAudioUrl(url);
  };
  
  return (
    <div className="voice-animation-integrator">
      {/* Voice generator component */}
      {isActive && dialogueText && (
        <VoiceGenerator
          character={character.name}
          text={dialogueText}
          isPlaying={isPlaying}
          onPlaybackStart={() => console.log(`${character.name} started speaking`)}
          onPlaybackComplete={handlePlaybackComplete}
          onAudioData={handleAudioData}
          onAudioGenerated={handleAudioGenerated}
        />
      )}
      
      {/* Audio processor for lip-sync */}
      {isActive && audioUrl && (
        <AudioProcessor
          audioUrl={audioUrl}
          isPlaying={isPlaying}
          onAudioData={handleAudioData}
        />
      )}
      
      {/* Animation controller */}
      <AnimationController
        character={character.name}
        isActive={isActive}
        audioData={audioData || undefined}
        energyLevel={character.energyLevel}
      />
    </div>
  );
};

export default VoiceAnimationIntegrator;
