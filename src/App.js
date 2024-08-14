import React, { useState, useEffect, useRef } from "react";
import Slider from "./Slider";
import './App.css'
import Sidebaritems from "./Sidebaritems";
import { toPng } from 'html-to-image';

const DEFAULT_OPTIONS = [
  {
    name: 'Brightness',
    property: 'brightness',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Contrast',
    property: 'contrast',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Saturation',
    property: 'saturate',
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Grayscale',
    property: 'grayscale',
    value: 0,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Sepia',
    property: 'sepia',
    value: 0,
    range: {
      min: 0,
      max: 200
    },
    unit: '%'
  },
  {
    name: 'Hue rotate',
    property: 'hue-rotate',
    value: 0,
    range: {
      min: 0,
      max: 360
    },
    unit: 'deg'
  },
  {
    name: 'Blur',
    property: 'blur',
    value: 0,
    range: {
      min: 0,
      max: 20
    },
    unit: 'px'
  },
]


function App() {
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const selectedOption = options[selectedOptionIndex]
  const [imgfile, setImgfile] = useState(null)
  const [fileList, setFileList] = useState([]);
  const [currentImage, setCurrentImage] = useState('');

  function handleSliderChange({ target }) {
    setOptions(prevOptions => {
      return prevOptions.map((option, index) => {
        if (index !== selectedOptionIndex) return option
        return { ...option, value: target.value}
      })
    })
  }

  function getImageStyle() {
    const filters = options.map(option => {
      return `${option.property}(${option.value}${option.unit})`
    })
    return { filter: filters.join(' ')}
  }

  let handleChooseButton = e => {
    setImgfile(URL.createObjectURL(e.target.files[0]))
    setCurrentImage(imgfile);
    setFileList([...fileList, { original: imgfile, filtered: imgfile }]);
  }

  var sectionStyle = {
    backgroundImage: `url(${imgfile})`,

  };

  const elementRef = useRef(null);

  let handleSaveButton = () => {
    toPng(elementRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.src = currentImage;
    }
  }, [currentImage]);

  return (
    <div className="container">
      <div className="gallary">
        <input type="file" accept="image/*" onChange={handleChooseButton} />
        <img src={imgfile} alt="1" ></img>
      </div>
      <div className="main-image" style={getImageStyle()} ref={elementRef} >
        <div className="main-image" style={ sectionStyle }></div>
      </div>
      <div className="sidebar">
        {options.map((option, index) => {
          return (
            <Sidebaritems
              key={index}
              name={option.name}
              active={index === selectedOptionIndex}
              handleClick={() => setSelectedOptionIndex(index)}
            />
          )
        })}
        <button className="savebutton" onClick={handleSaveButton}>Save</button>
        </div>
        <Slider 
          min={selectedOption.range.min}
          max={selectedOption.range.max}
          value={selectedOption.value}
          handleChange={handleSliderChange}
        />     
    </div>
  );
}

export default App;
