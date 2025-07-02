import { useState,useEffect,useRef } from 'react';
import './App.css';
import PropTypes from "prop-types";

/*Images*/
import searchIcon from "./assets/search.png";
import clearIcon from "./assets/clear.jpeg";
import cloudIcon from "./assets/cloud.jpeg";
import drizzleIcon from "./assets/drizzle.jpeg";
import rainIcon from "./assets/rain.jpeg";
import windIcon from "./assets/wind.jpeg";
import snowIcon from "./assets/snow.jpeg";
import humidityIcon from "./assets/humidity.png";


const WeatherDetails=({icon,temp,city,country,lat,log,humidity,wind,description})=>{
  return (
    <>
  <div className="image">
    <img src={icon} alt="Image" />
  </div>
  <div className="description">{description}</div>
  <div className="temp">{temp}°C</div>
  <div className="location">{city}</div>
  <div className="country">{country}</div>
  <div className="cord">
    <div>
      <span className="lat">Lattitude</span>
      <span>{lat}</span>
    </div>
    <div>
      <span className="log">Longitute</span>
      <span>{log}</span>
    </div>
  </div>
  <div className="data-container">
    <div className="element1">
      <img src={humidityIcon} alt="humidity" className="icon" />
      <div className="data">
        <div className="humidity-percent">{humidity}%</div>
        <div className="text">Humidity</div>
      </div>
      
    </div>
    <div className="element2">
      <img src={windIcon} alt="wind" className="icon" />
      <div className="data">
        <div className="wind-percent">{wind}km/h</div>
        <div className="text">Wind Speed</div>
      </div>
      
    </div>
    
  </div>

  
  </>
  );
};

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  log: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
};


function App() {
    let api_key="fadb266532437c572e9c680f52080945";

  const[text,setText]=useState("Chennai")
  const[icon, setIcon]= useState(snowIcon);
  const[temp, setTemp]= useState(0);
  const[city,setCity]=useState("Chennai");
  const[country,setCountry]=useState("IN");
  const[lat,setLat]=useState(0);
  const[log,setLog]=useState(0);
  const[humidity,setHumidity]=useState(0);
  const[wind,setWind]=useState(0);
  const[description,setDescription]=useState("Search for valid results");
  const[cityNotFound, setCityNotFound]=useState(false);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState(null);
  const inputRef = useRef(null);

  const weatherIconMap={
    "01d": clearIcon,
    "01n": clearIcon,
    "02d":cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "010d": rainIcon,
    "010n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,



  };
  
  const search=async ()=>{
    setLoading(true);
    setError(null);
    setCityNotFound(false);
  
  let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

  try{

    let res=await fetch(url);
    let data=await res.json();
    console.log(data);
    if(data.cod==="404"){
      console.error("City not found");
      setCityNotFound(true);
      setLoading(false);
      return;
    }
    setDescription(data.weather[0].description);
    setHumidity(data.main.humidity);
    setWind(data.wind.speed);
    setTemp(Math.round(data.main.temp)); // Use Celsius directly, no conversion needed
    setCity(data.name);
    setCountry(data.sys.country);
    setLat(data.coord.lat);
    setLog(data.coord.lon);
    const weatherIconCode=data.weather[0].icon;
    setDescription(data.weather[0].description);
    setIcon(weatherIconMap[weatherIconCode] || clearIcon);
    setCityNotFound(false);

  }
  catch(error){
console.error("An error occured:", error.message);
setError("An error occurred while fetching weather data.");
  }finally{
    setLoading(false);

  }
};


const handleCity=(e)=>{
    setText(e.target.value);
    setError(null);
    setCityNotFound(false);
  };

const handleKeyDown=(e)=>{
  if(e.key==="Enter" && !loading){
    search();
  }
};
useEffect(function (){
  search();
  if(inputRef.current){
    inputRef.current.focus();
  }
}, []);
  return (
    <>
      <div className="container">
        <div className={`input-container${cityNotFound || error ? ' input-error' : ''}`}> 
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
            ref={inputRef}
            disabled={loading}
            aria-label="Search City"
          />
          <div className="search-icon" onClick={()=>!loading && search()} style={{opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto'}}>
            <img src={searchIcon} alt="Search"/>
          </div>
        </div>
        {!loading &&  !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind} description={description}/>}
        {loading && <div className="loading-message"><span className="loader"></span> Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City not found</div>}
      </div>
    </>
  )
}

export default App
