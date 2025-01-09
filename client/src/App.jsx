import React, { useEffect, useState } from "react";
import "./App.css";
import $ from "jquery";

function App() {
  const [locations, setLocations] = useState([]);
  const [price, setPrice] = useState("");

  useEffect(() => {
    onPageLoad();
  }, []);

  const getBathValue = () => {
    const uiBathrooms = document.getElementsByName("uiBathrooms");
    for (let i = 0; i < uiBathrooms.length; i++) {
      if (uiBathrooms[i].checked) {
        return parseInt(uiBathrooms[i].value, 10);
      }
    }
    return -1;
  };

  const getBHKValue = () => {
    const uiBHK = document.getElementsByName("uiBHK");
    for (let i = 0; i < uiBHK.length; i++) {
      if (uiBHK[i].checked) {
        return parseInt(uiBHK[i].value, 10);
      }
    }
    return -1;
  };

  const onClickedEstimatePrice = () => {
    console.log("Estimate price button clicked");
    const sqft = document.getElementById("uiSqft").value;
    const bhk = getBHKValue();
    const bathrooms = getBathValue();
    const location = document.getElementById("uiLocations").value;

    const url = "http://127.0.0.1:5000/predict_home_price"; // Adjust as per your backend setup

    $.post(
      url,
      {
        total_sqft: parseFloat(sqft),
        bhk: bhk,
        bath: bathrooms,
        location: location,
      },
      function (data, status) {
        console.log(data.estimated_price);
        setPrice(data.estimated_price + " Lakh");
        console.log(status);
      }
    );
  };

  const onPageLoad = () => {
    console.log("document loaded");
    const url = "http://127.0.0.1:5000/get_location_names"; // Adjust as per your backend setup

    $.get(url, function (data, status) {
      console.log("Got response for get_location_names request");
      if (data) {
        setLocations(data.locations || []);
      }
    });
  };

  return (
    <div>
      <div className="img"></div>
      <form className="form">
        <h2>Area (Square Feet)</h2>
        <input
          className="area"
          type="text"
          id="uiSqft"
          name="Squareft"
          defaultValue="1000"
        />

        <h2>BHK</h2>
        <div className="switch-field">
          {[1, 2, 3, 4, 5].map((value) => (
            <React.Fragment key={value}>
              <input
                type="radio"
                id={`radio-bhk-${value}`}
                name="uiBHK"
                value={value}
                defaultChecked={value === 2}
              />
              <label htmlFor={`radio-bhk-${value}`}>{value}</label>
            </React.Fragment>
          ))}
        </div>
      </form>

      <form className="form">
        <h2>Bath</h2>
        <div className="switch-field">
          {[1, 2, 3, 4, 5].map((value) => (
            <React.Fragment key={value}>
              <input
                type="radio"
                id={`radio-bath-${value}`}
                name="uiBathrooms"
                value={value}
                defaultChecked={value === 2}
              />
              <label htmlFor={`radio-bath-${value}`}>{value}</label>
            </React.Fragment>
          ))}
        </div>

        <h2>Location</h2>
        <div>
          <select className="location" id="uiLocations">
            <option value="" disabled>
              Choose a Location
            </option>
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <button
          className="submit"
          onClick={onClickedEstimatePrice}
          type="button"
        >
          Estimate Price
        </button>
        <div id="uiEstimatedPrice" className="result">
          <h2>{price}</h2>
        </div>
      </form>
    </div>
  );
}

export default App;
