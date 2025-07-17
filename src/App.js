// App.js
import React, { useState, useEffect, useCallback } from 'react';
import ThreeScene from './components/ThreeScene';
import ControlPanel from './components/ControlPanel';
import './App.css';

function App() {

  document.title = "Rosy Ring Configurator";

  const [stoneType, setStoneType] = useState('RO');
  const [stoneSize, setStoneSize] = useState('5');
  const [yuvaType, setYuvaType] = useState('AH-NO');
  const [yuvaMetal, setYuvaMetal] = useState('YellowGold');
  const [bandType, setBandType] = useState('4');
  const [bandMetal, setBandMetal] = useState('YellowGold');
  const [ringSize, setRingSize] = useState(14);
  const [stoneCode,setStoneCode] = useState("6868");

  const stoneSizeOptions = {
    'RO': [ { value: '1', text: '0.30 ct', sizeCode: '4343' }, { value: '2', text: '0.50 ct', sizeCode: '5252' }, { value: '3', text: '0.70 ct', sizeCode: '5757' }, { value: '4', text: '1.00 ct', sizeCode: '6565' }, { value: '5', text: '1.20 ct', sizeCode: '6868' } ],
    'EM': [ { value: '1', text: '0.30 ct', sizeCode: '5030' }, { value: '2', text: '0.50 ct', sizeCode: '6040' }, { value: '3', text: '0.70 ct', sizeCode: '6545' }, { value: '4', text: '1.00 ct', sizeCode: '7050' }, { value: '5', text: '1.50 ct', sizeCode: '8560' } ],
    'OV': [ { value: '1', text: '0.25 ct', sizeCode: '5035' }, { value: '2', text: '0.50 ct', sizeCode: '6545' }, { value: '3', text: '0.75 ct', sizeCode: '7555' }, { value: '4', text: '1.00 ct', sizeCode: '8060' }, { value: '5', text: '1.25 ct', sizeCode: '9065' } ],
    'MR': [ { value: '1', text: '0.30 ct', sizeCode: '6530' }, { value: '2', text: '0.50 ct', sizeCode: '8040' }, { value: '3', text: '0.70 ct', sizeCode: '9045' }, { value: '4', text: '1.00 ct', sizeCode: '1050' }, { value: '5', text: '1.20 ct', sizeCode: '1155' } ],
    'PR': [ { value: '1', text: '0.30 ct', sizeCode: '3535' }, { value: '2', text: '0.50 ct', sizeCode: '4343' }, { value: '3', text: '0.75 ct', sizeCode: '5050' }, { value: '4', text: '1.00 ct', sizeCode: '5555' }, { value: '5', text: '1.25 ct', sizeCode: '6060' } ],
    'PE': [ { value: '1', text: '0.30 ct', sizeCode: '6040' }, { value: '2', text: '0.50 ct', sizeCode: '7550' }, { value: '3', text: '0.75 ct', sizeCode: '8555' }, { value: '4', text: '1.00 ct', sizeCode: '9060' }, { value: '5', text: '1.25 ct', sizeCode: '1065' } ]
  };

  const currentStoneSizeCode = stoneSizeOptions[stoneType]?.find(o => o.value === stoneSize)?.sizeCode || '';

  const threeJsProps = {
    stoneType,
    stoneSize,
    stoneCode: currentStoneSizeCode,
    yuvaType,
    yuvaMetal,
    bandType,
    bandMetal,
  };

  useEffect(() => {
    const defaultSize = stoneSizeOptions[stoneType]?.[stoneSizeOptions[stoneType].length - 1]?.value;
    if (defaultSize) setStoneSize(defaultSize);
  }, [stoneType]);

  useEffect(() => {
    if (stoneType === 'RO' || stoneType === 'OV') {
      if (!['AH-NO', 'AY-NO', 'AY-ST', 'AY-HL', 'AK-NO', 'AK-ST'].includes(yuvaType)) {
        setYuvaType('AH-NO');
      }
    } else {
      if (!['SY-NO', 'SY-ST', 'SY-HL', 'SK-NO', 'SK-ST', 'SH-NO'].includes(yuvaType)) {
        setYuvaType('SY-NO');
      }
    }
  }, [stoneType, yuvaType]);

  const handleBuy = useCallback(() => {
    const selectedStoneSizeText = stoneSizeOptions[stoneType].find(
      (option) => option.value === stoneSize
    ).text;
    alert(
  `Summary:\nStone Type: ${stoneType}\nStone Size: ${selectedStoneSizeText}\nSetting Type: ${yuvaType}\nSetting Material: ${yuvaMetal}\nBand Type: ${bandType}\nBand Material: ${bandMetal}\nRing Size: ${ringSize}`
);

  }, [stoneType, stoneSize, yuvaType, yuvaMetal, bandType, bandMetal, ringSize]);

  return (
    <div className="App">
      <div id="view-container">
        <div className="viewport" id="view-3d"><ThreeScene cameraType="3D" {...threeJsProps} /></div>
        <div className="viewport" id="view-x"><ThreeScene cameraType="X" {...threeJsProps} /></div>
        <div className="viewport" id="view-y"><ThreeScene cameraType="Y" {...threeJsProps} /></div>
        <div className="viewport" id="view-z"><ThreeScene cameraType="Z" {...threeJsProps} /></div>
      </div>

      <ControlPanel
        stoneType={stoneType}
        setStoneType={setStoneType}
        stoneSize={stoneSize}
        setStoneSize={setStoneSize}
        stoneSizeOptions={stoneSizeOptions}
        yuvaType={yuvaType}
        setYuvaType={setYuvaType}
        yuvaMetal={yuvaMetal}
        setYuvaMetal={setYuvaMetal}
        bandType={bandType}
        setBandType={setBandType}
        bandMetal={bandMetal}
        setBandMetal={setBandMetal}
        ringSize={ringSize}
        setRingSize={setRingSize}
        onBuy={handleBuy}
      />
    </div>
  );
}






export default App;
