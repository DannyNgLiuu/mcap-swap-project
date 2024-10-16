import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Dropdown from './dropdown';

export default function App() {
  const [selectedA, setSelectedA] = useState({ text: 'Select A', img: null });
  const [selectedB, setSelectedB] = useState({ text: 'Select B', img: null });
  const glowRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
        glowRef.current.style.opacity = 1; //glowing circle around the mouse
      }
    };

    const handleMouseOut = (e) => {
      //hides glow around mouse if it's off the screen
      if (e.relatedTarget === null) {
        if (glowRef.current) {
          glowRef.current.style.opacity = 0; //hide the glow
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  //swaps the selected coins by the click of the swap symbol
  const handleSwap = () => {
    const temp = selectedA;
    setSelectedA(selectedB);
    setSelectedB(temp);
  };

  return (
    <div className="app-container">
      <h1 className="centered-text">Show the price of A <br /> with the market cap of B</h1>
      <div className="container">
        <div ref={glowRef} className="mouse-glow" />
        <h2>Select A</h2>
        <Dropdown selected={selectedA} setSelected={setSelectedA} />
        <span
          className="swap-icon"
          onClick={handleSwap}
          style={{ cursor: 'pointer', fontSize: '24px', margin: '0 10px' }}
        >
          ⇄
        </span>
        <h2>Select B</h2>
        <Dropdown selected={selectedB} setSelected={setSelectedB} />
      </div>
    </div>
  );
}
