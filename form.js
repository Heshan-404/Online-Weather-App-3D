let x;
let y;
let tempInC = true;
let tempInF = false;
let key = `af297e1e140241f482131106240703`;
var temp_c = "27.4";
var temp_f = "57.4";
var current_temp_mode = "c";
var timeZone = "Asia/Colombo";

showSearchedLocation("Panadura");
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("locationSubmitForm");

  if (form) {
    form.onsubmit = function (event) {
      event.preventDefault();
      let searchValue = document.getElementById("inputLocation").value;
      showSearchedLocation(searchValue);
    };
  }
});

async function updateTemperature(x) {
  if (x == "c") {
    current_temp_mode = "c";
  } else {
    current_temp_mode = "f";
  }
  setTemp();
}

function setTemp() {
  current_temp_mode == "c"
    ? (document.getElementById("temp").innerHTML = temp_c)
    : (document.getElementById("temp").innerHTML = temp_f);

  if (current_temp_mode == "f") {
    document.getElementById("btn-change-temprature-f").style.opacity = 1;
    document.getElementById("btn-change-temprature-c").style.opacity = 0.3;
  } else {
    document.getElementById("btn-change-temprature-f").style.opacity = 0.3;
    document.getElementById("btn-change-temprature-c").style.opacity = 1;
  }
}

async function showSearchedLocation(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${key}&q=${location}`
    );
    
    const data = await response.json();
    if (data["error"]) {
    } else if (data["current"]) {
      x = data["location"]["lat"];
      y = data["location"]["lon"];
      initializeMap(x, y);
      document
        .getElementById("weather-status-img")
        .setAttribute("src", `${data["current"]["condition"]["icon"]}`);
      document.getElementById("city").innerHTML = data["location"]["name"];
      temp_c = data["current"]["temp_c"];
      temp_f = data["current"]["temp_f"];
      if (current_temp_mode == "c") {
        document.getElementById("temp").innerHTML = temp_c;
      } else {
        document.getElementById("temp").innerHTML = temp_f;
      }
      
      document.getElementById("Precipitation").innerHTML =
      data["current"]["precip_mm"] * 100 + " %";
      document.getElementById("Humidity").innerHTML =
      data["current"]["humidity"] + " %";
      document.getElementById("Wind").innerHTML =
      data["current"]["wind_kph"] + " Km/h";
      document.getElementById("country").innerHTML =
      data["location"]["country"];
      document.getElementById("region").innerHTML = data["location"]["region"];
      
      timeZone = data["location"]["tz_id"];
      
      updateDateTime(timeZone);
      fetchForecastData(location);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function updateDateTime(timeZone) {
  // Get the current time in the specified time zone
  const now = new Date().toLocaleString("en-US", { timeZone });

  // Format the date and time separately
  const date = new Date(now)
    .toLocaleDateString("en-US", {
      timeZone,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-"); // Replace all slashes with hyphens

  const time = new Date(now).toLocaleTimeString("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dayOfWeek = new Date(now).toLocaleDateString("en-US", {
    timeZone,
    weekday: "short",
  });
  // Update the HTML elements
  document.getElementById("date").innerHTML = date;
  document.getElementById("time").innerHTML = time;
  document.getElementById("day").innerHTML = dayOfWeek;
}
async function fetchForecastData(currenttLocation) {
  const today = new Date();

  for (var i = 1; i <= 7; i++) {
    // Loop from 1 to 7
    await new Promise((resolve, reject) => {
      var date = new Date(today);
      date.setDate(date.getDate() + i);
      var year = date.getFullYear();
      var month = (date.getMonth() + 1).toString().padStart(2, "0");
      var day = date.getDate().toString().padStart(2, "0");
      var formattedDate = year + "-" + month + "-" + day;

      fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${currenttLocation}&dt=${formattedDate}`
      )
        .then((response) => response.json())
        .then((data) => {
          // Update the corresponding elements in your HTML
          document.getElementById(`future-forecast-date-${i}`).innerHTML =
            data["forecast"]["forecastday"][0]["date"];
          document.getElementById(`future-weather-status-img-${i}`).src =
            data["forecast"]["forecastday"][0]["day"]["condition"]["icon"];
          document.getElementById(`future-forecast-status-${i}`).innerHTML =
            data["forecast"]["forecastday"][0]["day"]["condition"]["text"];
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

var map;
function initializeMap(latitude, longitude) {
    if (map) {
        map.remove();
    }
    map = L.map('map').setView([latitude, longitude], 16); // Set initial coordinates and zoom level

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    var marker = L.marker([latitude, longitude]).addTo(map); // Add a marker at specified coordinates
}
// You can still use setInterval to update the time periodically if needed:
setInterval(() => {
  // Assuming you have the timeZone stored somewhere (e.g., after calling showSearchedLocation)
  updateDateTime(timeZone);
}, 1000);
