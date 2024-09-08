let x;
let y;
let tempInC = true;
let tempInF = false;
let key = `af297e1e140241f482131106240703`;
var temp_c = "27.4";
var temp_f = "57.4";
var current_temp_mode = "c";
var timeZone = "Asia/Colombo";
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
      // Handle error (e.g., display an error message)
    } else if (data["current"]) {
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

      // Get the time zone from the API response
      timeZone = data["location"]["tz_id"];

      // Update the date and time elements
      updateDateTime(timeZone);
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

// You can still use setInterval to update the time periodically if needed:
setInterval(() => {
  // Assuming you have the timeZone stored somewhere (e.g., after calling showSearchedLocation)
  updateDateTime(timeZone);
}, 1000);
