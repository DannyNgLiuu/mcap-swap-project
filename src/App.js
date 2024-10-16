import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Dropdown from './dropdown';
import axios from 'axios';

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
  { text: 'Avalanche', img: avalancheImage, id: 'avalanche-2', symbol: 'AVAX'},
];

export default function App() {
  const [selectedA, setSelectedA] = useState({ text: 'Select A', img: null, id: null, price: null });
  const [selectedB, setSelectedB] = useState({ text: 'Select B', img: null, id: null, price: null });
  const [marketCapText, setMarketCapText] = useState('');
  const [marketCapA, setMarketCapA] = useState(null);
  const [marketCapB, setMarketCapB] = useState(null);
  const glowRef = useRef(null);

  //cache object to store market cap values
  const marketCapCache = useRef({});

  //fetch market caps for selected coins
  useEffect(() => {
    const fetchMarketCaps = async () => {
      if (selectedA.id && selectedB.id) {
        const cacheKeyA = selectedA.id;
        const cacheKeyB = selectedB.id;

        //check the cache first
        if (marketCapCache.current[cacheKeyA] && marketCapCache.current[cacheKeyB]) {
          setMarketCapA(marketCapCache.current[cacheKeyA]);
          setMarketCapB(marketCapCache.current[cacheKeyB]);
        } else {
          try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${selectedA.id},${selectedB.id}&vs_currencies=usd&include_market_cap=true`);
            const marketCapAValue = response.data[selectedA.id].usd_market_cap;
            const marketCapBValue = response.data[selectedB.id].usd_market_cap;

            //update state and cache
            setMarketCapA(marketCapAValue);
            setMarketCapB(marketCapBValue);
            marketCapCache.current[cacheKeyA] = marketCapAValue; //cache the value
            marketCapCache.current[cacheKeyB] = marketCapBValue; //cache the value
          } catch (error) {
            console.error("Error fetching market caps:", error);
          }
        }
      }
    };

    fetchMarketCaps();
  }, [selectedA, selectedB]);

  useEffect(() => {
    if (selectedA.text !== 'Select A' && selectedB.text !== 'Select B') {
      //format the market caps without decimals
      const formattedMarketCapA = marketCapA?.toLocaleString('en-US', { maximumFractionDigits: 0 }) || "0";
      const formattedMarketCapB = marketCapB?.toLocaleString('en-US', { maximumFractionDigits: 0 }) || "0";

      const priceOfSelectedA = selectedA.price || 0;
      const marketCapAValue = parseFloat(marketCapA) || 1; // Avoid division by zero
      const marketCapBValue = parseFloat(marketCapB) || 1; // Avoid division by zero

      //clculation
      const result = (marketCapBValue / marketCapAValue) * priceOfSelectedA;
      const multipler = (marketCapBValue / marketCapAValue);
      const formattedResult = result.toLocaleString('en-US', { maximumFractionDigits: 2 });
      const formattedMultiplier = multipler.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

      const colorMultiplier = parseFloat(formattedMultiplier) >= 1.00 ? 'green' : 'red';

      const formattedText = `
      <div style="font-size: 30px; margin-bottom: 25px;">
        The price of ${selectedA.symbol} with the market cap of ${selectedB.symbol} <br />
      </div>
      <div style="font-size: 50px; font-weight: bold; margin-bottom: 25px;">
        $${formattedResult} <span style="color: ${colorMultiplier}; font-size: 35px;">(${formattedMultiplier}x)</span> <br />
      </div>
      <div style="font-size: 30px; margin-bottom: 10px;">
        ${selectedA.symbol} mcap $${formattedMarketCapA} <br />
      </div>
      <div style="font-size: 30px;">
        ${selectedB.symbol} mcap $${formattedMarketCapB}
      </div>
    `;

      setMarketCapText(formattedText);
    } else {
      setMarketCapText('');
    }
  }, [selectedA, selectedB, marketCapA, marketCapB]);

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
        <div className="market-cap-box" dangerouslySetInnerHTML={{ __html: marketCapText }} />
      )}
    </div>
  );  
}
