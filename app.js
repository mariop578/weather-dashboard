const API_KEY = "6b673628380c21d2e79a287a06b2af4f";
let lon, lat;
const selectEl = document.getElementById("mySelect");

function handleFormSubmit(e) {
  e.preventDefault();
  selectEl.innerHTML = "";
  const optionsDiv = document.getElementById("optionsContainer");
  optionsDiv.style.visibility = "visible";
  const input = document.getElementById("searchInput");
  const q = input.value;
  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${API_KEY}
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

    lon = data[selectedId].lon;

    lat = data[selectedId].lat;

    // console.log(selectEl.value, lon, lat);
    weatherAPI();
  });
}

function weatherAPI() {
  const apiUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}
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
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
}

// function createCard () {
// }

// I want a function to search up a city and based off the data from the api a select box pops up
// to verify which city in which state.

// Then i want the finialized data to be sent to another function for the weather API to
// Create and remove elements.

// Select options need to be created in JS to change based on which city.
