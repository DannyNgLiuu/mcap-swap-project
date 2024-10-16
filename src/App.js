import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Dropdown from './dropdown'; 

//images
import bitcoinImage from './images/bitcoin.png';
import ethereumImage from './images/ethereum.png';
import solanaImage from './images/solana.png';
import binancecoinImage from './images/bnb.png';
import avalancheImage from './images/avax.png';

const items = [
  { text: 'Bitcoin', img: bitcoinImage, id: 'bitcoin', symbol: 'BTC' },
  { text: 'Ethereum', img: ethereumImage, id: 'ethereum', symbol: 'ETH' },
  { text: 'Solana', img: solanaImage, id: 'solana', symbol: 'SOL' },
  { text: 'Binance Coin', img: binancecoinImage, id: 'binancecoin', symbol: 'BNB' },
  { text: 'Avalanche', img: avalancheImage, id: 'avalanche', symbol: 'AVAX'},
];

export default function App() {
  const [selectedA, setSelectedA] = useState({ text: 'Select A', img: null, id: null });
  const [selectedB, setSelectedB] = useState({ text: 'Select B', img: null, id: null });
  const [marketCapText, setMarketCapText] = useState('');
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
      if (e.relatedTarget === null) {
        if (glowRef.current) {
          glowRef.current.style.opacity = 0; //hides the glow
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

  const handleSwap = () => {
    const temp = selectedA;
    setSelectedA(selectedB);
    setSelectedB(temp);
  };

  useEffect(() => {
    if (selectedA.text !== 'Select A' && selectedB.text !== 'Select B') {
      setMarketCapText(`The price of ${selectedA.symbol} with the market cap of ${selectedB.symbol}`);
    } else {
      setMarketCapText(''); //reset if not both selected
    }
  }, [selectedA, selectedB]);

  return (
    <div className="app-container">
      <h1 className="centered-text">Show the price of A <br /> with the market cap of B</h1>
      <div className="container">
        <div ref={glowRef} className="mouse-glow" />
        <div className="dropdown-container">
          <h2>Select A</h2>
          <Dropdown selected={selectedA} setSelected={setSelectedA} items={items} />
        </div>
        <span
          className="swap-icon"
          onClick={handleSwap}
          style={{ cursor: 'pointer', fontSize: '24px', margin: '0 10px' }}
        >
          ⇄
        </span>
        <div className="dropdown-container">
          <h2>Select B</h2>
          <Dropdown selected={selectedB} setSelected={setSelectedB} items={items} />
        </div>
      </div>
      {marketCapText && (
        <div className="market-cap-box">
          <p>{marketCapText}</p>
        </div>
      )}
    </div>
  );
}
