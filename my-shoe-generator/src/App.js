import React from 'react';
import './App.css';
import ImageList from './components/Image_slider';
import { RingLoader } from 'react-spinners';

const App = () => {
  // Assuming you have the necessary state for input values and image URLs
  const [inputValues, setInputValues] = React.useState({ company: '', color: '' });
  const [imageUrls, setImageUrls] = React.useState([]);
  const [error, setError] = React.useState({ company: false, color: false });
  const [loading, setLoading] = React.useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputValues((prevState) => ({
      ...prevState,
      [name]: value
    }));
    setError((prevState) => ({
      ...prevState,
      [name]: false
    }));
  };

  const handleGenerate = () => {
    if (!inputValues.company || !inputValues.color) {
      setError({
        company: !inputValues.company,
        color: !inputValues.color
      });
      return;
    }
    setLoading(true); // set loading to true before fetching images

    fetch('http://localhost:8000/generate/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inputValues)
    })
      .then(response => response.json())
      .then(data => {
        setImageUrls(data.images);
        setLoading(false); // set loading to false after images are fetched
      })
      .catch(error => {
        console.error(error);
        setLoading(false); // also set loading to false if there is an error
      });
  };


  return (
    <div className="container">
      <div className="input-container">
        <h2>SNKRS Generator</h2>
        <div className="input-fields">
          <select
            name="company"
            value={inputValues.company}
            onChange={handleInputChange}
            className={error.company ? 'error' : ''}
          >
            <option value="">Select a company</option>
            <option value="nike">Nike</option>
            <option value="adidas">Adidas</option>
            <option value="puma">Puma</option>
          </select>
          <select
            name="color"
            value={inputValues.color}
            onChange={handleInputChange}
            className={error.color ? 'error' : ''}
          >
            <option value="">Select a color</option>
            <option value="white">White</option>
            <option value="red">Red</option>
            <option value="black">Black</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
          </select>
          <button onClick={handleGenerate}>Generate</button>
        </div>
      </div>

      <div className="image-container">
      {loading ? 
          <div className="spinner">
          <RingLoader color='#007bff'/>
        </div> : // show the spinner when loading
          <ImageList images={imageUrls} />
        }
      </div>
    </div>
  );
};

export default App;
