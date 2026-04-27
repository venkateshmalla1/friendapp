import styled, { keyframes } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; text-shadow: 0 0 10px #00ff41; }
  50% { opacity: 0.4; text-shadow: none; }
`;

// Layout Components
export const MainContainer = styled.div`
  min-height: 100vh;
  background-color: #0a0a0a;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  font-family: 'Inter', sans-serif;
`;

export const SearchBox = styled.div`
  width: 100%;
  max-width: 400px;
  margin-bottom: 30px;
  display: flex;
  gap: 10px;
`;

export const NameInput = styled.input`
  flex: 1;
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #00ff41;
  outline: none;
  &:focus { border-color: #00ff41; }
`;

export const ActionButton = styled.button`
  padding: 12px 20px;
  background: #00ff41;
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  &:disabled { background: #1a5c2b; cursor: not-allowed; }
`;

// Terminal & Progress
export const TerminalBox = styled.div`
  background: #000;
  width: 100%;
  max-width: 450px;
  height: 150px;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #00ff41;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  overflow: hidden;
  margin-top: 20px;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  max-width: 450px;
  height: 8px;
  background: #222;
  border-radius: 4px;
  margin-top: 10px;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: #00ff41;
  width: ${props => props.width}%;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px #00ff41;
`;

// Modal Components
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.95);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #111;
  padding: 40px;
  border-radius: 20px;
  border: 1px solid #333;
  text-align: center;
  max-width: 500px;
  width: 90%;
  animation: ${popIn} 0.5s cubic-bezier(0.26, 1.36, 0.74, 1);
`;

export const BlinkingQuote = styled.blockquote`
  color: #00ff41;
  font-size: 1.2rem;
  font-style: italic;
  margin: 20px 0;
  animation: ${blink} 2s infinite;
`;

export const CloseButton = styled.button`
  margin-top: 20px;
  background: transparent;
  color: #666;
  border: 1px solid #333;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  &:hover { color: #fff; border-color: #fff; }
`;