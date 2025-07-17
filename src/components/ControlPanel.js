import React from 'react';
import './ControlPanel.css'; // Kontrol paneli stil dosyanızı buraya import edin

function ControlPanel({
  stoneType, setStoneType,
  stoneSize, setStoneSize, stoneSizeOptions,
  yuvaType, setYuvaType,
  yuvaMetal, setYuvaMetal,
  bandType, setBandType,
  bandMetal, setBandMetal,
  ringSize, setRingSize,
  onBuy
}) {

  const metalColors = {
     YellowGold: '#f5c069',
    
    WhiteGold: '#dfdfdf',
    
    RoseGold: '#e4aa80'
  };

  const handleStoneTypeChange = (newType) => {
    setStoneType(newType);
  };

  const handleStoneSizeChange = (newSize) => {
    setStoneSize(newSize);
  };

  const handleYuvaTypeChange = (newType) => {
    setYuvaType(newType);
  };

  const handleMetalChange = (newMetal, type) => {
    if (type === 'yuva') {
      setYuvaMetal(newMetal);
    } else if (type === 'band') {
      setBandMetal(newMetal);
    }
  };

  const handleBandTypeChange = (newBand) => {
    setBandType(newBand);
  };

  const handleRingSizeChange = (e) => {
    setRingSize(parseInt(e.target.value));
  };

  return (
    <div id="control-panel">
      {/* Taş Tipi Seçimi */}
      <div className="control-section">
        <h3>Stone Type</h3>
        <div className="button-grid stone-grid">
          {['RO', 'EM', 'OV', 'MR', 'PR', 'PE'].map((type) => (
            <button
              key={type}
              className={`stone-btn ${stoneType === type ? 'active' : ''}`}
              onClick={() => handleStoneTypeChange(type)}
              data-stone={type}
            >
              <img src={`https://cdn.siriuspirlanta.com/byd/shape/${type.toLowerCase() === 'ro' ? 'round' : type.toLowerCase() === 'em' ? 'emerald' : type.toLowerCase() === 'ov' ? 'oval' : type.toLowerCase() === 'mr' ? 'marquise' : type.toLowerCase() === 'pr' ? 'princess' : 'pear'}.png`} alt={type} />
              <span>{type === 'RO' ? 'Round' : type === 'EM' ? 'Emerald' : type === 'OV' ? 'Oval' : type === 'MR' ? 'Marquise' : type === 'PR' ? 'Princess' : 'Pear'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Taş Boyutu */}
      <div className="control-section">
        <h3>Stone Size</h3>
        <div className="button-grid size-grid" id="stone-size-buttons">
          {stoneSizeOptions[stoneType]?.map((option) => (
            <button
              key={option.value}
              className={`size-btn ${stoneSize === option.value ? 'active' : ''}`}
              onClick={() => handleStoneSizeChange(option.value)}
              data-size={option.value}
              data-size-code={option.sizeCode}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      {/* Yuva Tipi */}
      <div className="control-section">
        <h3>Setting Type</h3>
        <div className={`button-grid setting-grid-normal ${['RO', 'OV'].includes(stoneType) ? 'hidden' : ''}`} id="normal-yuva-types">
          {[
            { data: 'SY-NO', label: 'SY-NO', img: 'https://cdn.siriuspirlanta.com/byd/sy-no.png'},
            { data: 'SY-ST', label: 'SY-ST', img: 'https://cdn.siriuspirlanta.com/byd/sy-st.png' },
            { data: 'SY-HL', label: 'SY-HL', img: 'https://cdn.siriuspirlanta.com/byd/sy-hl.png' },
            { data: 'SK-NO', label: 'SK-NO', img: 'https://cdn.siriuspirlanta.com/byd/sk-no.png' },
            { data: 'SK-ST', label: 'SK-ST', img: 'https://cdn.siriuspirlanta.com/byd/sk-st.png' },
            { data: 'SH-NO', label: 'SH-NO', img: 'https://cdn.siriuspirlanta.com/byd/sh-no.png' },
          ].map((item) => (
            <button
              key={item.data}
              className={`yuva-btn ${yuvaType === item.data && !(['RO', 'OV'].includes(stoneType)) ? 'active' : ''}`}
              onClick={() => handleYuvaTypeChange(item.data)}
              data-yuva={item.data}
            >
              <img src={item.img} alt={item.label} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className={`button-grid setting-grid-special ${!['RO', 'OV'].includes(stoneType) ? 'hidden' : ''}`} id="special-yuva-types">
          {[
            { data: 'AH-NO', label: 'AH-NO', img: 'https://cdn.siriuspirlanta.com/byd/ah-no.png' },
            { data: 'AY-NO', label: 'AY-NO', img: 'https://cdn.siriuspirlanta.com/byd/ay-no.png '},
            { data: 'AY-ST', label: 'AY-ST', img: 'https://cdn.siriuspirlanta.com/byd/ay-st.png' },
            { data: 'AY-HL', label: 'AY-HL', img: 'https://cdn.siriuspirlanta.com/byd/ay-hl.png' },
            { data: 'AK-NO', label: 'AK-NO', img: 'https://cdn.siriuspirlanta.com/byd/ak-no.png' },
            { data: 'AK-ST', label: 'AK-ST', img: 'https://cdn.siriuspirlanta.com/byd/ak-st.png' },
            { data: 'SH-NO', label: 'SH-NO', img: 'https://cdn.siriuspirlanta.com/byd/sh-no.png' },
          ].map((item) => (
            <button
              key={item.data}
              className={`yuva-btn ${yuvaType === item.data && (['RO', 'OV'].includes(stoneType)) ? 'active' : ''}`}
              onClick={() => handleYuvaTypeChange(item.data)}
              data-yuva={item.data}
            >
              {item.img && <img src={item.img} alt={item.label} />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Yuva Materyali Seçimi */}
      <div className="control-section">
  <h3>Setting Material</h3>
  <div className="button-grid yuva-metal-grid" id="metal-types">
    {Object.keys(metalColors).map((metal) => (
      <button
        key={metal}
        className={`yuva-btn ${yuvaMetal === metal ? 'active' : ''}`}
        onClick={() => handleMetalChange(metal, 'yuva')}
        style={{ backgroundColor: metalColors[metal] }}
        title={metal}
        data-metal={metal}
      >
        <span></span>
      </button>
    ))}
  </div>
</div>





      {/* Kol Tipi */}
      <div className="control-section">
        <h3>Band Style</h3>
        <div className="button-grid band-type-grid" id="band-types">
          {[...Array(4)].map((_, i) => (
            <button
              key={i + 1}
              className={`kolar-btn ${bandType === String(i + 1) ? 'active' : ''}`}
              onClick={() => handleBandTypeChange(String(i + 1))}
              data-band={String(i + 1)}
            >
              Band {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* <div className="control-section">
  <h3>Band Style</h3>
  <div className="button-grid band-type-grid" id="band-types">
    {[...Array(8)].map((_, i) => {
      const bandNumber = String(i + 1);
      const imageUrl = `https://cdn.example.com/bands/${bandNumber}.png`; // Buraya kendi linkini yaz

      return (
        <button
          key={bandNumber}
          className={`kolar-btn ${bandType === bandNumber ? 'active' : ''}`}
          onClick={() => handleBandTypeChange(bandNumber)}
          data-band={bandNumber}
        >
          <img
            src={imageUrl}
            alt={`Band ${bandNumber}`}
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://cdn.example.com/bands/default.png'; // Yedek görsel
            }}
          />
          <span>Band {bandNumber}</span>
        </button>
      );
    })}
  </div>
</div> */}


      {/* Kol Materyali */}
  <div className="control-section">
  <h3>Band Material</h3>
  <div className="button-grid band-metal-grid" id="band-metals">
    {Object.keys(metalColors).map((metal) => (
      <button
        key={metal}
        className={`yuva-btn ${bandMetal === metal ? 'active' : ''}`}
        onClick={() => handleMetalChange(metal, 'band')}
        style={{ backgroundColor: metalColors[metal] }}
        data-metal={metal}
        title={metal}
      >
        <span></span>
      </button>
    ))}
  </div>
  </div>


      {/* Yüzük Boyu ve Satın Al */}
      <div className="control-section">
        <h3>Ring Size</h3>
        <div className="ring-size-container">
          <select className="ring-size-select" value={ringSize} onChange={handleRingSizeChange}>
            {[...Array(10)].map((_, i) => (
              <option key={9 + i} value={9 + i}>
                {9 + i}
              </option>
            ))}
          </select>
          <button id="buy-btn" onClick={onBuy}>
            SELECT
          </button>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;