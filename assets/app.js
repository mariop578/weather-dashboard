const API_KEY = "6b673628380c21d2e79a287a06b2af4f";

const fiveDayDiv = document.getElementById("fiveday");
const selectEl = document.getElementById("mySelect");
const input = document.getElementById("searchInput");

function handleFormSubmit(e) {
  e.preventDefault();
  const optionsDiv = document.getElementById("optionsContainer");
  optionsDiv.style.visibility = "visible";

  const q = input.value;
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${API_KEY}`;
  geoApi(geoUrl);
}

async function geoApi(geoUrl) {
  try {
    const response = await fetch(geoUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    createOptions(data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function createOptions(data) {
  selectEl.options.length = 1;
  data.forEach((element, index) => {
    const optionEl = document.createElement("option");
    optionEl.value = element.state;
    optionEl.text = element.state;
    optionEl.id = index;
    selectEl.appendChild(optionEl);
  });
  selectEl.removeEventListener("change", handleSelect);
  selectEl.addEventListener("change", (event) => handleSelect(event, data));
}

function handleSelect(event, data) {
  const selectedIndex = selectEl.selectedIndex;
  const selectedOption = selectEl.options[selectedIndex];
  const selectedId = selectedOption.id;
  const lon = data[selectedId].lon;
  const lat = data[selectedId].lat;
  console.log(selectEl.value, lon, lat);
  const fiveDayDiv = document.getElementById("fivetitle");
  fiveDayDiv.style.visibility = "visible";
  weatherAPI(lat, lon);
}

async function weatherAPI(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    createCard(data);
    console.log(data);
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

function createCard(data) {
  const cityName = data.city.name;
  const kelvTemp = data.list[0].main.feels_like;
  const ferTemp = kelvinToFahrenheit(kelvTemp);
  const wind = data.list[0].wind.speed;
  const humid = data.list[0].main.humidity;
  const searchedCity = input.value;
  const capitalizedCity = capitalizeAfterSpace(searchedCity);
  const state = selectEl.value;
  // Card
  const card = document.createElement("div");
  card.id = "card";
  // Title City and Date
  const h1 = document.createElement("h1");
  h1.innerText = capitalizedCity;
  const h2 = document.createElement("h2");
  if (capitalizedCity === cityName) {
    h2.innerText = state;
  } else h2.innerText = cityName;
  // Temparute
  const tempP = document.createElement("p");
  tempP.innerText = "Feels like : " + ferTemp + "°";

  // Wind
  const windP = document.createElement("p");
  windP.innerText = "Wind Speed : " + wind + "MPH";

  //Humidity
  const humiP = document.createElement("p");
  humiP.innerText = "Humidity : " + humid + "%";

  // Append elements
  const cardContainer = document.getElementById("cardContainer");
  cardContainer.innerHTML = "";
  fiveDayDiv.innerHTML = "";
  card.appendChild(h1);
  card.appendChild(h2);
  card.appendChild(tempP);
  card.appendChild(windP);
  card.appendChild(humiP);
  cardContainer.appendChild(card);
  const selelectedList = [
    data.list[0],
    data.list[7],
    data.list[15],
    data.list[23],
    data.list[31],
  ];
  // 5 day cards
  selelectedList.forEach((element) => {
    const temp = element.main.feels_like;
    const ferTemp = kelvinToFahrenheit(temp);
    const humid = element.main.humidity;
    const wind = element.wind.speed;
    const dt = element.dt_txt;
    const formDt = dt.slice(0, -9);
    const id = element.weather[0].id;
    const desc = element.weather[0].description;
    console.log(temp, humid, wind, dt, id, desc);
    const card = document.createElement("div");
    const dtH3 = document.createElement("h3");
    const tempP = document.createElement("p");
    const humidP = document.createElement("p");
    const windP = document.createElement("p");
    const descP = document.createElement("p");
    const emojiP = document.createElement("p");
    dtH3.textContent = formDt;
    tempP.textContent = `Feels Like: ${ferTemp}° `;
    humidP.textContent = `Humidity: ${humid}%`;
    windP.textContent = `Wind Speed: ${wind}MPH`;
    descP.textContent = desc;
    emojiP.innerHTML = getEmoji(id);
    card.appendChild(dtH3);
    card.appendChild(emojiP);
    card.appendChild(descP);
    card.appendChild(tempP);
    card.appendChild(windP);
    card.appendChild(humidP);
    card.classList.add("five-cards");
    fiveDayDiv.appendChild(card);
  });
}

function kelvinToFahrenheit(kelvin) {
  const fahrenheit = ((kelvin - 273.15) * 9) / 5 + 32;
  return Math.ceil(fahrenheit);
}

function capitalizeAfterSpace(i) {
  return i
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getEmoji(id) {
  switch (true) {
    case id >= 200 && id < 300:
      return "🌩️";
    case id >= 300 && id < 400:
      return "🌧️";
    case id >= 500 && id < 600:
      return "🌧️";
    case id >= 600 && id < 700:
      return "❄️";
    case id >= 700 && id < 800:
      return "🌫️";
    case id === 800:
      return "☀️";
    case id >= 801 && id <= 810:
      return "☁️";
    default:
      return "?";
  }
}
