
import React, { useState, useEffect } from 'react';

interface TypingAnimationProps {
  texts: string[];
  typingSpeed?: number;
  pauseTime?: number;
  fadeTime?: number;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  texts,
  typingSpeed = 100,
  pauseTime = 1000,
  fadeTime = 500,
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTyping) {
      // Typing animation
      const currentText = texts[currentIndex];
      if (displayText.length < currentText.length) {
        timer = setTimeout(() => {
          setDisplayText(currentText.substring(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing, pause before fade out
        timer = setTimeout(() => {
          setIsVisible(false);
        }, pauseTime);
      }
    } else if (!isVisible) {
      // Fade out completed, reset text and move to next phrase
      timer = setTimeout(() => {
        setDisplayText('');
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsVisible(true);
        setIsTyping(true);
      }, fadeTime);
    }

    return () => clearTimeout(timer);
  }, [displayText, currentIndex, isTyping, isVisible, texts, typingSpeed, pauseTime, fadeTime]);

  // When text is fully displayed, trigger the fade out process
  useEffect(() => {
    const currentText = texts[currentIndex];
    if (displayText === currentText && isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, pauseTime);
      return () => clearTimeout(timer);
    }
  }, [displayText, currentIndex, texts, isTyping, pauseTime]);

  return (
    <div 
      className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      aria-live="polite"
    >
      <span className="font-bold text-2xl md:text-4xl text-brand-blue">{displayText}</span>
      <span className={`ml-0.5 inline-block w-1 h-6 bg-brand-blue ${isTyping ? 'animate-pulse-slow' : 'opacity-0'}`}></span>
    </div>
  );
};

export default TypingAnimation;
