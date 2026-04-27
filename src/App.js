import React from 'react';
import GreetUser from './components/GreetUser/GreetUser';
import { createGlobalStyle } from 'styled-components';

// 1. Resetting default browser margins and setting the base theme
const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #0a0a0a; /* Matches your MainContainer */
    color: #ffffff;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  /* Custom scrollbar for that sleek Hacker look */
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: #0a0a0a;
  }
  ::-webkit-scrollbar-thumb {
    background: #1a5c2b;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #00ff41;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <GreetUser />
    </>
  );
}

export default App;