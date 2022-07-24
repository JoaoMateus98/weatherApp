document.body.style.backgroundImage = "url('./imgs/rainy-day-2.jpg')";
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-button");

// images
const gifContainer = document.querySelector(".gif-here");
const weatherIcon = document.querySelector(".weather-icon");

const cityElement = document.querySelector(".city");

class Weather {
  constructor() {
    this.WEATHER_KEY = "6f60271f6f33f4cdabaca4fdb80f42fd";
    this.description = "no description";
    this.temp = "no temp";
    this.feelsLike = "no feels like";
    this.humidity = "no humidity";
    this.windspeed = "no wind";
    this.displayedUnits = "F";
  }

  async getWeather(city, units) {
    this.displayedUnits = units === "Imperial" ? "F" : "C";
    const displayedWindSpeed = units === "Imperial" ? " mph" : " km/h";
    try {
      const response =
        await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${this.WEATHER_KEY}
        `);
      const responseJson = await response.json();
      console.log(responseJson);
      this.description = {
        name: "weather-description",
        data: responseJson.weather[0].description,
      };
      this.temp = {
        name: "temp",
        data: responseJson.main.temp,
      };
      this.feelsLike = {
        name: "feels-like-data",
        data: responseJson.main.feels_like,
      };
      this.cloudy = {
        name: "cloudy-data",
        data: `${responseJson.clouds.all}%`,
      };
      this.humidity = {
        name: "humidity-data",
        data: `${responseJson.main.humidity}%`,
      };
      this.windspeed = {
        name: "wind-data",
        data: responseJson.wind.speed + displayedWindSpeed,
      };
    } catch {
      console.log("failed to retrive data");
    }

    return [
      this.description,
      this.temp,
      this.feelsLike,
      this.cloudy,
      this.humidity,
      this.windspeed,
    ];
  }
}

async function getGif(searchWord = "sunny") {
  const GiphyAPIKey = "RdeNrqP2SFdSqQvCR8HPNffzSg6TGiot";
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=${GiphyAPIKey}&s=${searchWord}&random_id=0`,
      {
        mode: "cors",
      }
    );
    const imageData = await response.json();
    const gif = imageData.data.images.original.url;
    gifContainer.src = gif;
  } catch {
    const errorGif =
      "https://media0.giphy.com/media/gRWyMr9LBkwc8/giphy.gif?cid=48833f36jw9kd5djt6wi8rh9nzxjcm190r4javolyk9izryb&rid=giphy.gif&ct=g";
    gifContainer.src = errorGif;
  }
}

const weatherClass = new Weather();

function getImages(description) {
  if (description.includes("clear")) {
    getGif("sunny");
    weatherIcon.src = "./imgs/icons/sunny.svg";
  } else if (description.includes("clouds")) {
    getGif("cloudy");
    weatherIcon.src = "./imgs/icons/cloudy.svg";
  } else if (description.includes("rain")) {
    getGif("rainny");
    weatherIcon.src = "./imgs/icons/rainy-day.svg";
  } else {
    console.log("error in get gif and icon");
    getGif();
    weatherIcon.src = "./imgs/icons/sunny.svg";
  }
}

function updateUI(DOMelement, data) {
  const currentELement = document.querySelector(`.${DOMelement}`);
  if (DOMelement === "temp" || DOMelement === "feels-like-data") {
    const newData = Math.round(data);
    currentELement.innerHTML = `${newData}\u00B0${weatherClass.displayedUnits}`;
  } else {
    currentELement.innerHTML = data;
  }
}

function getNewWeather(city = "Rockland", units = "Imperial") {
  cityElement.innerHTML = city;
  weatherClass.getWeather(city, units).then((arr) => {
    arr.forEach((val) => {
      if (val.name === "weather-description") {
        getImages(val.data);
      }
      updateUI(val.name, val.data);
    });
  });
}

getNewWeather();

function search() {
  const searchValue = searchInput.value;
  if (searchValue.length < 3) {
    alert("please enter a valid name");
  } else {
    getNewWeather(searchValue);
  }
}

searchButton.addEventListener("click", () => search());
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    search();
  }
});
