addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(document.location.search);
  let urlCity = params.get("city");
  if (urlCity === null) {
    urlCity = "Göteborg";
  }

  // fetch cordinater & stad
  fetch("https://geocoding-api.open-meteo.com/v1/search?name=" + urlCity)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      //samling för allt son ska in i nästa fetch
      const city = result.results[0].name;
      const lat = result.results[0].latitude;
      const long = result.results[0].longitude;
      const timezone = result.results[0].timezone;
      const splitTimezone = timezone.split("/");
      const timezoneContinent = splitTimezone[0];
      const timezoneCity = splitTimezone[1];

      // Lägga till staden i flik titeln
      document.querySelector("title").innerHTML = "Weather | " + city;
      //fetch vädret
      fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=" +
          lat +
          "&longitude=" +
          long +
          "&&hourly=temperature_2m,apparent_temperature,weathercode&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&&timezone=" +
          timezoneContinent +
          "%2F" +
          timezoneCity
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          // samling alla element
          const body = document.querySelector("body");
          const currentCity = document.getElementById("currentCity");
          const icon = document.getElementById("currentIcon");
          const weatherDescription =
            document.getElementById("currentWeatherType");
          const temp = document.getElementById("currentTemp");
          const feelTemp = document.getElementById("currentFeelTemp");
          const sunrise = document.getElementById("currentSunrise");
          const sunset = document.getElementById("currentSunset");
          const minTemp = document.getElementById("currentMinTemp");
          const maxTemp = document.getElementById("currentMaxTemp");
          const nextHourList = document.getElementById("nextHourList");
          const searchButton = document.querySelector("#searchButton");
          const searchValue = document.querySelector("#searchCity");
          //slut element

          //samling all data
          const utcOffset = result.utc_offset_seconds;
          const currentDate = Date.now();
          // gör till UTC timme + '+/-' offset sekunder
          const currentHour = new Date(
            Number(currentDate) + utcOffset * 1000
          ).getUTCHours();
          const currentMinutes = new Date().getUTCMinutes();
          const regExpMatch = /(\d{2}):(\d{2})/;
          const fetchTime = result.hourly.time;
          const celsius = result.hourly_units.temperature_2m;
          const hourlyTemp = result.hourly.temperature_2m;
          const hourlyFeelTemp = result.hourly.apparent_temperature;
          const dailyMinTemp = result.daily.temperature_2m_min;
          const dailyMaxTemp = result.daily.temperature_2m_max;
          const dailySunrise = result.daily.sunrise;
          const dailySunset = result.daily.sunset;
          const sunriseTime = parseInt(dailySunrise[0].match(regExpMatch)[1]);
          const sunsetTime = parseInt(dailySunset[0].match(regExpMatch)[1]);
          const weatherCode = result.hourly.weathercode;
          //slut data

          //prognos nästkommande timmar
          nextHourList.innerHTML = "";
          for (let h = currentHour + 1; h < 25; h++) {
            nextHourList.innerHTML +=
              "<li>" +
              "<p>" +
              fetchTime[h].match(regExpMatch)[1] +
              "</p>" +
              "<p>" +
              hourlyTemp[h] +
              celsius +
              "</p>" +
              "</li>";
          }

          //Loopa igenom 24 timmar
          for (let i = 0; i < 24; i++) {
            // Hämta fetch heltimme och gör om till nummer
            const fetchHour = parseInt(fetchTime[i].match(regExpMatch)[1]);
            console.log(fetchHour);

            // kod för att hamna på rätt rad/timme i arrayen
            if (currentHour === fetchHour) {
              console.log(true);
              console.log(weatherCode[i]);

              // vad ska göras om solen är uppe eller nere
              const isSunset =
                currentHour >= sunsetTime || currentHour < sunriseTime;
              body.style.backgroundColor = isSunset ? "#21282E" : "#DEE1E3";
              body.style.color = isSunset ? "#DEE1E3" : "#21282E";
              searchValue.style.backgroundColor = isSunset
                ? "#DEE1E3"
                : "#21282E";
              searchValue.style.color = isSunset ? "#21282E" : "#DEE1E3";
              searchButton.style.backgroundColor = isSunset
                ? "#DEE1E3"
                : "#21282E";
              searchButton.style.color = isSunset ? "#21282E" : "#DEE1E3";

              // lägga till ikoner och text baserat på väderkoder
              switch (weatherCode[i]) {
                case 0:
                  icon.innerHTML = `<i class="bi bi-${
                    isSunset ? "moon" : "sun"
                  }"></i>`;
                  weatherDescription.innerHTML = "Clear";
                  break;
                case 1:
                case 2:
                  icon.innerHTML = `<i class="bi bi-cloud-${
                    isSunset ? "moon" : "sun"
                  }"></i>`;
                  weatherDescription.innerHTML = "Partly Cloudy";
                  break;
                case 3:
                  icon.innerHTML = '<i class="bi bi-clouds"></i>';
                  weatherDescription.innerHTML = "Cloudy";
                  break;
                case 45:
                case 48:
                  icon.innerHTML = '<i class="bi bi-cloud-fog"></i>';
                  weatherDescription.innerHTML = "Fog";
                  break;
                case 51:
                case 53:
                case 55:
                case 56:
                case 57:
                  icon.innerHTML = '<i class="bi bi-cloud-drizzle"></i>';
                  weatherDescription.innerHTML = "Drizzle";
                  break;
                case 61:
                case 63:
                case 65:
                case 66:
                case 67:
                  icon.innerHTML = '<i class="bi bi-cloud-rain"></i>';
                  weatherDescription.innerHTML = "Rain";
                  break;
                case 71:
                case 73:
                case 75:
                case 77:
                case 85:
                case 86:
                  icon.innerHTML = '<i class="bi bi-cloud-snow"></i>';
                  weatherDescription.innerHTML = "Snow";
                  break;
                case 80:
                case 81:
                case 82:
                  icon.innerHTML = '<i class="bi bi-cloud-rain-heavy"></i>';
                  weatherDescription.innerHTML = "Heavy Rain";
                  break;
                case 95:
                  icon.innerHTML = '<i class="bi bi-cloud-lightning"></i>';
                  weatherDescription.innerHTML = "Thunderstorm";
                  break;
                case 96:
                  icon.innerHTML = '<i class="bi bi-cloud-lightning-rain"></i>';
                  weatherDescription.innerHTML = "Thunderstorm & Rain";
                  break;
              }
              //lägga in realtid data
              temp.innerHTML = hourlyTemp[i] + celsius;
              feelTemp.innerHTML = hourlyFeelTemp[i] + celsius;
            }
            //daglig sol upp & nedgång tider
            sunrise.innerHTML = dailySunrise[0].match(regExpMatch)[0];
            sunset.innerHTML = dailySunset[0].match(regExpMatch)[0];
            //daglig max & min temperatur
            minTemp.innerHTML =
              '<i class="bi bi-thermometer-low"></i>' +
              dailyMinTemp[0] +
              celsius;
            maxTemp.innerHTML =
              '<i class="bi bi-thermometer-high"></i>' +
              dailyMaxTemp[0] +
              celsius;
            //lägger till staden man har sökt på i innehållet + tiden + gör att tiden visas som xx:xx

            function prependZero(t) {
              if (t < 10) {
                return `0${t}`;
              }
              return t;
            }
            currentCity.innerHTML =
              city +
              " | " +
              prependZero(currentHour) +
              ":" +
              prependZero(currentMinutes);
          }
        });
    });
});
