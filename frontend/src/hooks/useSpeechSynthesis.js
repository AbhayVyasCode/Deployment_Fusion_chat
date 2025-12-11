import { useState, useEffect } from 'react';

const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Load voices when they are available
  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    
    // The 'voiceschanged' event is fired when the list of voices is ready
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    loadVoices(); // Initial load

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = (text) => {
    // This is the crucial fix: cancel any ongoing speech before starting a new one.
    window.speechSynthesis.cancel();
    
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);

    // Optional: Select a specific voice if available
    const preferredVoice = voices.find(voice => voice.name.includes('Google US English'));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = () => {
        console.error("Speech synthesis error.");
        setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return { speak, isSpeaking };
};

export default useSpeechSynthesis;