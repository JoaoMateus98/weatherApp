document.body.style.backgroundImage = "url('./imgs/rainy-day-2.jpg')";

class Weather {
  constructor() {
    this.WEATHER_KEY = "6f60271f6f33f4cdabaca4fdb80f42fd";
    this.description = "no description";
    this.temp = "no temp";
    this.feelsLike = "no feels like";
    this.humidity = "no humidity";
    this.windspeed = "no wind";
  }

  async getWeather(city, units) {
    const displayedUnits = units === "Imperial" ? "F" : "C";
    const displayedWindSpeed = units === "Imperial" ? " mph" : " km/h";
    try {
      const response =
        await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${this.WEATHER_KEY}
        `);
      const responseJson = await response.json();
      console.log(responseJson);
      this.description = {
        name: "description",
        data: responseJson.weather[0].description,
      };
      this.temp = {
        name: "temperature",
        data: responseJson.main.temp + displayedUnits,
      };
      this.feelsLike = {
        name: "feels like",
        data: responseJson.main.feels_like + displayedUnits,
      };
      this.cloudy = {
        name: "cloudy",
        data: `${responseJson.clouds.all}%`,
      };
      this.humidity = {
        name: "humidity",
        data: `${responseJson.main.humidity}%`,
      };
      this.windspeed = {
        name: "wind speed",
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

const weatherClass = new Weather();

function getNewWeather(city = "Rockland", units = "Imperial") {
  weatherClass.getWeather(city, units).then((arr) => {
    arr.forEach((val) => {
      console.log(val);
    });
  });
}

getNewWeather();
