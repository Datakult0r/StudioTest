// Animation controller for character lip-sync and movements
import React, { useRef, useEffect, useState } from 'react';
import * as PIXI from 'pixi.js';

// AnimationController component for handling character animations
interface AnimationControllerProps {
  character: string;
  isActive: boolean;
  audioData?: Float32Array;
  energyLevel: number;
}

const AnimationController: React.FC<AnimationControllerProps> = ({
  character,
  isActive,
  audioData,
  energyLevel
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const characterSpriteRef = useRef<PIXI.Sprite | null>(null);
  const mouthSpriteRef = useRef<PIXI.Sprite | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Initialize PIXI application
  useEffect(() => {
    if (!containerRef.current || isInitialized) return;
    
    // Create PIXI application
    const app = new PIXI.Application({
      width: 200,
      height: 200,
      transparent: true,
      antialias: true
    });
    
    containerRef.current.appendChild(app.view as unknown as Node);
    appRef.current = app;
    
    // Load character assets
    const characterTexture = PIXI.Texture.from(`/characters/${character.toLowerCase().replace(/\s+/g, '-')}.png`);
    const characterSprite = new PIXI.Sprite(characterTexture);
    characterSprite.anchor.set(0.5);
    characterSprite.x = app.screen.width / 2;
    characterSprite.y = app.screen.height / 2;
    characterSprite.width = 180;
    characterSprite.height = 180;
    app.stage.addChild(characterSprite);
    characterSpriteRef.current = characterSprite;
    
    // Create mouth sprite
    const mouthTexture = PIXI.Texture.from('/assets/mouth-closed.png');
    const mouthSprite = new PIXI.Sprite(mouthTexture);
    mouthSprite.anchor.set(0.5);
    mouthSprite.x = app.screen.width / 2;
    mouthSprite.y = app.screen.height / 2 + 40; // Position mouth on character face
    mouthSprite.width = 30;
    mouthSprite.height = 10;
    app.stage.addChild(mouthSprite);
    mouthSpriteRef.current = mouthSprite;
    
    setIsInitialized(true);
    
    // Cleanup on unmount
    return () => {
      app.destroy(true, true);
      if (containerRef.current && containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
    };
  }, [character, isInitialized]);
  
  // Handle character active state
  useEffect(() => {
    if (!characterSpriteRef.current) return;
    
    // Add subtle animation when character is active
    if (isActive) {
      const animateCharacter = () => {
        if (!characterSpriteRef.current) return;
        
        // Subtle bobbing animation
        characterSpriteRef.current.y = 100 + Math.sin(Date.now() * 0.005) * 3;
        
        requestAnimationFrame(animateCharacter);
      };
      
      animateCharacter();
    } else {
      // Reset position when inactive
      characterSpriteRef.current.y = 100;
    }
  }, [isActive]);
  
  // Handle audio data for lip-sync
  useEffect(() => {
    if (!mouthSpriteRef.current || !isActive || !audioData) return;
    
    // Calculate average volume from audio data
    let sum = 0;
    for (let i = 0; i < audioData.length; i++) {
      sum += Math.abs(audioData[i]);
    }
    const averageVolume = sum / audioData.length;
    
    // Map volume to mouth size
    const mouthHeight = Math.min(30, Math.max(5, averageVolume * 100));
    mouthSpriteRef.current.height = mouthHeight;
    
    // Adjust width based on height to maintain proportion
    mouthSpriteRef.current.width = 30 + (mouthHeight - 5) * 0.5;
    
  }, [audioData, isActive]);
  
  // Handle energy level changes
  useEffect(() => {
    if (!characterSpriteRef.current) return;
    
    // Adjust character appearance based on energy level
    const scale = 0.9 + (energyLevel / 10) * 0.2; // Scale between 0.9 and 1.1
    characterSpriteRef.current.scale.set(scale, scale);
    
    // Adjust tint based on energy level
    const energyColor = Math.floor(255 * (energyLevel / 10)); // More red as energy increases
    const tint = PIXI.utils.rgb2hex([1, 1 - (energyColor / 255) * 0.3, 1 - (energyColor / 255) * 0.3]);
    characterSpriteRef.current.tint = tint;
    
  }, [energyLevel]);
  
  return (
    <div 
      ref={containerRef} 
      className={`character-animation ${isActive ? 'active' : ''}`}
      style={{ width: '200px', height: '200px' }}
    />
  );
};

export default AnimationController;
