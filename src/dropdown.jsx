import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function Dropdown({ selected, setSelected, items }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prices, setPrices] = useState({});

  //fetches cryptocurrency prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = items.map(item => item.id).join(',');
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
        setPrices(response.data);
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, [items]);
  
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelection = (item) => {
    const price = prices[item.id]?.usd; //get the price of the selected item
    setSelected({ ...item, price }); //pass the item with price to App.js
    setIsOpen(false);
  };
  
  return (
    <div className="dropdown">
      <div className="dropdown-button" onClick={toggleDropdown}>
        <div className="dropdown-content-display">
          {selected.img && (
            <img
              src={selected.img}
              alt={selected.text}
              className="dropdown-icon"
            />
          )}
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {selected.text}
            <span style={{ marginLeft: '10px' }}>
              {selected.id && prices[selected.id]?.usd 
                ? `$${prices[selected.id].usd.toFixed(2)}` //two decimals for selected coin
                : prices[selected.id]?.usd ? `$${prices[selected.id].usd}` : ''}
            </span>
          </span>
        </div>
        {isOpen ? '▲' : '▼'}
      </div>
      {isOpen && (
        <div className="dropdown-content">
          {items.map((item) => (
            <div
              key={item.text}
              className="dropdown-item"
              onClick={() => handleSelection(item)}
            >
              <img src={item.img} alt={item.text} className="dropdown-icon" /> {item.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
