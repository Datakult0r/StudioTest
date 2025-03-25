// Integration of OpenAI Realtime API with character dialogue system
import React, { useState, useEffect } from 'react';
import VoiceGenerator from './VoiceGenerator';
import LipSync from './LipSync';

// CharacterDialogue component for managing character speech and interactions
interface CharacterDialogueProps {
  character: {
    name: string;
    personality: string;
    voiceType: string;
    energyLevel: number;
  };
  newsItem: {
    title: string;
    summary: string;
    category: string;
    source: string;
  } | null;
  isActive: boolean;
  onSpeechComplete: () => void;
}

const CharacterDialogue: React.FC<CharacterDialogueProps> = ({
  character,
  newsItem,
  isActive,
  onSpeechComplete
}) => {
  const [dialogueText, setDialogueText] = useState<string | null>(null);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioData, setAudioData] = useState<Float32Array | null>(null);
  
  // Generate character dialogue based on news item
  useEffect(() => {
    if (isActive && newsItem && !dialogueText && !isGeneratingText) {
      const generateDialogue = async () => {
        try {
          setIsGeneratingText(true);
          
          // Call backend API to generate character response
          const response = await fetch('/api/voice/generate-response', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              character: character.name,
              newsItem
            })
          });
          
          if (!response.ok) {
            throw new Error('Failed to generate dialogue');
          }
          
          const data = await response.json();
          setDialogueText(data.response);
          setIsPlaying(true);
          
        } catch (error) {
          console.error('Error generating dialogue:', error);
          // Fallback dialogue in case of error
          setDialogueText(`As ${character.name}, I have thoughts on this news item.`);
          setIsPlaying(true);
        } finally {
          setIsGeneratingText(false);
        }
      };
      
      generateDialogue();
    }
  }, [character, newsItem, isActive, dialogueText, isGeneratingText]);
  
  // Reset dialogue when character becomes inactive
  useEffect(() => {
    if (!isActive) {
      setDialogueText(null);
      setIsPlaying(false);
    }
  }, [isActive]);
  
  // Handle playback start
  const handlePlaybackStart = () => {
    console.log(`${character.name} started speaking`);
  };
  
  // Handle playback complete
  const handlePlaybackComplete = () => {
    setIsPlaying(false);
    setDialogueText(null);
    onSpeechComplete();
  };
  
  // Handle audio data for lip-sync
  const handleAudioData = (data: Float32Array) => {
    setAudioData(data);
  };
  
  return (
    <div className="character-dialogue">
      {/* Voice generator component (hidden) */}
      {isActive && dialogueText && (
        <VoiceGenerator
          character={character.name}
          text={dialogueText}
          isPlaying={isPlaying}
          onPlaybackStart={handlePlaybackStart}
          onPlaybackComplete={handlePlaybackComplete}
          onAudioData={handleAudioData}
        />
      )}
      
      {/* Lip-sync component */}
      {isActive && isPlaying && audioData && (
        <LipSync
          isPlaying={isPlaying}
          characterName={character.name}
        />
      )}
      
      {/* For debugging - can be removed in production */}
      <div className="sr-only">
        {isActive && dialogueText ? `Speaking: ${dialogueText}` : 'Silent'}
      </div>
    </div>
  );
};

export default CharacterDialogue;
