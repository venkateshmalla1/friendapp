import React, { useState, useEffect, useRef } from 'react';
import Typewriter from 'typewriter-effect';
import {
  MainContainer, SearchBox, NameInput, ActionButton,
  TerminalBox, ProgressBarContainer, ProgressFill,
  ModalOverlay, ModalContent, BlinkingQuote, CloseButton
} from './styledComponents';

// 1. DATA CONFIGURATION
const PEOPLE_DATA = [
  {
    names: ["Divakar", "Divi", "Philosopher"],
    description: "The intellectual backbone of our group. Always questioning, always learning.",
    image: "https://res.cloudinary.com/dk6x9gpyl/image/upload/v1760851215/1758778319750_gozytr.jpg", // Replace with your actual photo links
    quote: "Wisdom begins in wonder.",
    relation: "Brother & Mentor",
    music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
  },
  {
    names: ["Nitin", "Nitu", "Software Developer"],
    description: "The intellectual backbone of our group. Always questioning, always learning.",
    image: "https://res.cloudinary.com/dk6x9gpyl/image/upload/v1759417711/10472085_264601560412229_7802592663526121160_n_tgqx2a.jpg", // Replace with your actual photo links
    quote: "Friend who stands by you in the storm.",
    relation: "Friend & Mentor",
    music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
  },
  {
    names: ["Lucky", "Yashoda", "Radha","Papa", "My love"],
    description: "The most reliable friend. Through thick and thin, we coded and conquered.",
    image: "https://res.cloudinary.com/dk6x9gpyl/image/upload/v1759414700/IMG_20250204_133603_lxjddo.jpg",
    quote: "Friends are the family we choose.",
    relation: "Mother(Yashoda), Daughter, Radha & Best Friend",
    music: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  }
];

const DEFAULT_MUSIC = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

const SYSTEM_LOGS = [
  { p: 10, t: "> Booting Friendship Protocol v2.0..." },
  { p: 25, t: "> Accessing encrypted memory sectors..." },
  { p: 40, t: "> Matching aliases and pet names..." },
  { p: 60, t: "> Calibrating emotional frequency..." },
  { p: 80, t: "> Decoding secret handshake signatures..." },
  { p: 95, t: "> Finalizing handshake. Reveal imminent." }
];

const GreetUser = () => {
  const [input, setInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [match, setMatch] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  
  const audioRef = useRef(new Audio());

  // Handle Search Trigger
  const startProcess = () => {
    const cleanInput = input.trim().toLowerCase();
    const found = PEOPLE_DATA.find(p => p.names.some(n => n.toLowerCase() === cleanInput));
    
    setMatch(found || { 
      names: [input], 
      description: "A guest in my digital world.", 
      quote: "Welcome, stranger!", 
      relation: "Visitor",
      music: DEFAULT_MUSIC 
    });

    audioRef.current.src = found ? found.music : DEFAULT_MUSIC;
    audioRef.current.volume = 0;
    audioRef.current.play().catch(e => console.log("Autoplay blocked: ", e));

    setIsProcessing(true);
    setProgress(0);
    setHasCompleted(false);
  };

  // Progress and Audio Fading Effect
  useEffect(() => {
    let timer;
    if (isProcessing && progress < 100) {
      timer = setTimeout(() => {
        const inc = Math.random() > 0.5 ? 10 : 5;
        const newProgress = Math.min(progress + inc, 100);
        setProgress(newProgress);
        audioRef.current.volume = newProgress / 100;
        
        if (newProgress === 100) {
          setTimeout(() => {
            setIsProcessing(false);
            setShowModal(true);
            setHasCompleted(true);
          }, 800);
        }
      }, 300);
    }
    return () => clearTimeout(timer);
  }, [progress, isProcessing]);

  return (
    <MainContainer>
      <h1 style={{ color: '#00ff41', marginBottom: '10px' }}>FRIENDSHIP_PROTOCOL</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Enter identity to begin authentication.</p>

      <SearchBox>
        <NameInput 
          placeholder="Name / Nickname" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isProcessing}
        />
        <ActionButton onClick={startProcess} disabled={isProcessing || !input}>
          {isProcessing ? "PROCESSING..." : "AUTHENTICATE"}
        </ActionButton>
      </SearchBox>

      {isProcessing && (
        <>
          <ProgressBarContainer>
            <ProgressFill width={progress} />
          </ProgressBarContainer>
          <TerminalBox>
            {SYSTEM_LOGS.filter(l => progress >= l.p).map((l, i) => (
              <div key={i} style={{ color: '#00ff41', marginBottom: '5px' }}>{l.t}</div>
            ))}
          </TerminalBox>
          <img 
            src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueW94dmZ4bmZ4bmZ4bmZ4bmZ4bmZ4bmZ4bmZ4bmZ4bmZ4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxxSAtI5Tgc/giphy.gif" 
            alt="Audio" 
            style={{ width: '60px', marginTop: '20px', filter: 'hue-rotate(90deg)' }}
          />
        </>
      )}

      {/* POPUP REVEAL */}
      {showModal && match && (
        <ModalOverlay>
          <ModalContent>
            <img src={match.image} alt="User" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '2px solid #00ff41' }} />
            <h2 style={{ color: '#fff', margin: '15px 0' }}>
              <Typewriter
                options={{ strings: match.names, autoStart: true, loop: true }}
              />
            </h2>
            <div style={{ color: '#888', textTransform: 'uppercase', fontSize: '0.8rem' }}>{match.relation}</div>
            <BlinkingQuote>"{match.quote}"</BlinkingQuote>
            <p style={{ color: '#ccc', lineHeight: '1.5' }}>{match.description}</p>
            <CloseButton onClick={() => setShowModal(false)}>ACCESS TERMINATED (CLOSE)</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* PERSISTENT VIEW AFTER MODAL CLOSES */}
      {hasCompleted && !showModal && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <h3 style={{color: '#00ff41'}}>IDENTITY CONFIRMED</h3>
            <p>Welcome back, {match.names[0]}. Memory banks are open.</p>
            <button onClick={() => setHasCompleted(false)} style={{background: 'none', border: '1px solid #333', color: '#666', padding: '5px 10px', marginTop: '10px', cursor: 'pointer'}}>Log Out</button>
        </div>
      )}
    </MainContainer>
  );
};

export default GreetUser;