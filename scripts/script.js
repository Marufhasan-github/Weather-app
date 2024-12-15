const apiKey = "b7b5c61bc40320b7340d0c5046fcbbc9";
const appUrl = "https://api.openweathermap.org/data/2.5/weather";

let searchedKeyword;

function search() {
  // Get user input and trim whitespace
  searchedKeyword = document.querySelector("#search-box").value.trim();
  // Use default city if input is empty
  if (!searchedKeyword) {
    searchedKeyword = "Dhaka";
  }
  getWeather(searchedKeyword);
}

// Event listener for search button
document.querySelector("#search-button").addEventListener("click", () => {
  search();
});

document.querySelector("#search-box").addEventListener("keydown", (key) => {
  if (key.key === "Enter") {
    search();
  }
});

async function getWeather(city) {
  document.querySelector(".js-city-name").textContent = "Loading...";
  try {
    const response = await fetch(
      `${appUrl}?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error("City not found or API issue");
    }
    const data = await response.json();

    displayWeather(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.querySelector(".js-city-name").textContent =
      "Error: City not found";
    document.querySelector(".js-temperature").textContent = "";
    document.querySelector(".js-humidity").textContent = "";
    document.querySelector(".js-wind-speed").textContent = "";
  }
}

function displayWeather(data) {
  const dayOrNight = getDayOrNight(data);
  console.log(dayOrNight);

  console.log(data);
  console.log(data.weather[0].main);
  const status = data.weather[0].main;

  if (status === "Clouds") {
    document.querySelector(
      "#weather-img"
    ).src = `images/Clouds-${dayOrNight}.png`;
  } else if (status === "Rain") {
    document.querySelector(
      "#weather-img"
    ).src = `images/Rain-${dayOrNight}.png`;
  } else if (status === "Haze" || status === "Mist") {
    document.querySelector("#weather-img").src = "images/Haze.png";
  } else if (status === "Clear") {
    document.querySelector(
      "#weather-img"
    ).src = `images/Clear-${dayOrNight}.png`;
  } else if (status === "Snow") {
    document.querySelector("#weather-img").src = `images/Snow.png`;
  } else if (status === "Drizzle ") {
    document.querySelector("#weather-img").src = `images/Drizzle.png`;
  } else {
    document.querySelector("#weather-img").src = "images/Clear-Day.png";
  }

  const city = data.name;
  const temperature = data.main.temp.toFixed();
  const humidity = data.main.humidity || "N/A";
  const windSpeed = data.wind.speed || "N/A";

  document.querySelector(".js-city-name").textContent = city;
  document.querySelector(".js-temperature").textContent = `${temperature}°c`;
  document.querySelector(".js-humidity").textContent = `${humidity}%`;
  document.querySelector(".js-wind-speed").textContent = `${windSpeed} km/h`;
}

getWeather("Dhaka");

function getDayOrNight(data) {
  const sunrise = data.sys.sunrise;
  const sunset = data.sys.sunset;
  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime > sunrise && currentTime < sunset) {
    return "Day";
  } else {
    return "Night";
  }
}
