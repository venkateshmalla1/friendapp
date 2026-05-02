// src/components/GreetUser/GreetUser.js
import React, { useState, useEffect, useRef } from "react";
import Typewriter from "typewriter-effect";
import {
  MainContainer, SearchBox, NameInput, ActionButton,
  TerminalBox, ProgressBarContainer, ProgressFill,
  ModalOverlay, ModalContent, BlinkingQuote, CloseButton
} from './styledComponents';
import { getPeople, getPersonByName } from '../../api';

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
  const [people, setPeople] = useState([]);

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.preload = "auto";
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getPeople();
        setPeople(res.data || []);
      } catch (err) {
        console.error("Failed to load people", err);
        setPeople([]);
      }
    };
    fetchAll();
  }, []);

  const startProcess = async () => {
    const cleanInput = input.trim();
    if (!cleanInput) return;

    setIsProcessing(true);
    setProgress(0);
    setHasCompleted(false);
    setShowModal(false);

    // Try backend name lookup (case-insensitive route on server)
    try {
      const res = await getPersonByName(cleanInput);
      setMatch(res.data);
      audioRef.current.src = res.data.music || DEFAULT_MUSIC;
    } catch (err) {
      // Not found -> stranger fallback
      setMatch({
        names: [cleanInput],
        description: "A guest in my digital world.",
        quote: "Welcome, stranger!",
        relation: "Visitor",
        image: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder",
        music: DEFAULT_MUSIC
      });
      audioRef.current.src = DEFAULT_MUSIC;
    }

    audioRef.current.volume = 0;
    audioRef.current.play().catch(e => console.log("Audio play blocked", e));

    // start progress simulation
    setTimeout(() => setProgress(6), 120);
  };

  useEffect(() => {
    if (!isProcessing) return;
    if (progress >= 100) {
      setIsProcessing(false);
      setShowModal(true);
      setHasCompleted(true);
      return;
    }

    const timer = setTimeout(() => {
      const inc = Math.random() > 0.5 ? 10 : 6;
      const next = Math.min(100, progress + inc);
      setProgress(next);
      if (audioRef.current) {
        audioRef.current.volume = Math.min(1, next / 100);
      }
    }, 300 + Math.random() * 200);

    return () => clearTimeout(timer);
  }, [progress, isProcessing]);

  useEffect(() => {
    if (!isProcessing && progress >= 100) {
      const t = setTimeout(() => setShowModal(true), 600);
      return () => clearTimeout(t);
    }
  }, [isProcessing, progress]);

  const closeModal = () => {
    setShowModal(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <MainContainer>
      <h1 style={{ color: "#00ff41", marginBottom: 8 }}>FRIENDSHIP_PROTOCOL</h1>
      <p style={{ color: "#9fb3c8", marginBottom: 18 }}>Enter identity to begin authentication.</p>

      <SearchBox>
        <NameInput
          placeholder="Name or Nickname"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isProcessing}
        />
        <ActionButton onClick={startProcess} disabled={isProcessing || !input.trim()}>
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
              <div key={i}>{l.t}</div>
            ))}
          </TerminalBox>

          <div style={{ marginTop: 12 }}>
            <img
              src="https://media.giphy.com/media/3o7TKMGpxxSAtI5Tgc/giphy.gif"
              alt="processing"
              style={{ width: 56, borderRadius: 8, filter: "hue-rotate(80deg)" }}
            />
          </div>
        </>
      )}

      {showModal && match && (
        <ModalOverlay>
          <ModalContent>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={match.image}
                alt={match.names?.[0] || "profile"}
                style={{ width: 200, height: 200, objectFit: "cover", borderRadius: 12, border: "2px solid #00ff41" }}
              />
            </div>

            <h2 style={{ color: "#fff", marginTop: 14 }}>
              <Typewriter
                options={{
                  strings: match.names || [input],
                  autoStart: true,
                  loop: true,
                  delay: 60,
                  deleteSpeed: 30
                }}
              />
            </h2>

            <div style={{ color: "#9fb3c8", textTransform: "uppercase", fontSize: 12, marginTop: 6 }}>
              {match.relation}
            </div>

            <BlinkingQuote>"{match.quote}"</BlinkingQuote>

            <p style={{ color: "#cfe8f5", lineHeight: 1.5, marginTop: 8 }}>{match.description}</p>

            <CloseButton onClick={closeModal}>ACCESS TERMINATED CLOSE</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}

      {hasCompleted && !showModal && match && (
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <h3 style={{ color: "#00ff41" }}>IDENTITY CONFIRMED</h3>
          <p style={{ color: "#9fb3c8" }}>Welcome back, {match.names?.[0] || input}.</p>
          <button
            onClick={() => {
              setHasCompleted(false);
              setInput("");
              setMatch(null);
            }}
            style={{
              marginTop: 10,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#cfe8f5",
              padding: "8px 12px",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            LOG OUT
          </button>
        </div>
      )}
    </MainContainer>
  );
};

export default GreetUser;
