const API_KEY = "6b673628380c21d2e79a287a06b2af4f";

const selectEl = document.getElementById("mySelect");
const input = document.getElementById("searchInput");

function handleFormSubmit(e) {
  e.preventDefault();
  // selectEl.innerHTML = "";
  // Remove existing options except the first one
  while (selectEl.options.length > 1) {
    selectEl.remove(1);
  }
  const optionsDiv = document.getElementById("optionsContainer");
  optionsDiv.style.visibility = "visible";
  const q = input.value;
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${API_KEY}
  `;
  // console.log(q);

  fetch(geoUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      createOptions(data);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function createOptions(data) {
  data.forEach((element, index) => {
    const optionEl = document.createElement("option");
    // console.log(element);
    optionEl.value = element.state;
    optionEl.text = element.state;
    optionEl.id = index;
    selectEl.appendChild(optionEl);
  });

  selectEl.addEventListener("change", function () {
    const selectedIndex = selectEl.selectedIndex;

    const selectedOption = selectEl.options[selectedIndex];

    const selectedId = selectedOption.id;

    const lon = data[selectedId].lon;

    const lat = data[selectedId].lat;

    console.log(selectEl.value, lon, lat);
    weatherAPI(lat, lon);
  });
}

function weatherAPI(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}
  `;
  console.log(apiUrl);
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      createCard(data);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

function createCard(data) {
  const cityName = data.city.name;
  const kelvTemp = data.list[0].main.feels_like;
  const ferTemp = kelvinToFahrenheit(kelvTemp);
  const wind = data.list[0].wind.speed;
  const humid = data.list[0].main.humidity;
  const searchedCity = input.value;
  const capitalizedCity =
    searchedCity.charAt(0).toUpperCase() + searchedCity.slice(1);
  const state = selectEl.value;
  // Card
  const card = document.createElement("div");
  card.class = "card";
  // Title City and Date
  const h1 = document.createElement("h1");
  h1.innerText = capitalizedCity;
  const h2 = document.createElement("h2");
  if (capitalizedCity === cityName) {
    h2.innerText = state;
  } else h2.innerText = cityName;
  // Temparute
  const tempP = document.createElement("p");
  tempP.innerText = "Feels like : " + ferTemp + " Degrees";

  // Wind
  const windP = document.createElement("p");
  windP.innerText = "Wind Speed : " + wind + "MPH";

  //Humidity
  const humiP = document.createElement("p");
  humiP.innerText = "Humidity : " + humid + "%";

  // Append elements
  const cardContainer = document.getElementById("cardContainer");
  card.appendChild(h1);
  card.appendChild(h2);
  card.appendChild(tempP);
  card.appendChild(windP);
  card.appendChild(humiP);
  cardContainer.appendChild(card);
}

function kelvinToFahrenheit(kelvin) {
  const fahrenheit = ((kelvin - 273.15) * 9) / 5 + 32;
  return Math.ceil(fahrenheit);
}

// I want a function to search up a city and based off the data from the api a select box pops up
// to verify which city in which state.

// Then i want the finialized data to be sent to another function for the weather API to
// Create and remove elements.

// Select options need to be created in JS to change based on which city.
