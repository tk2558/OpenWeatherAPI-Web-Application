const apiURL = 'https://api.openweathermap.org/data/2.5/weather?units=imperial&q=';
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

const bg = document.querySelector(".container");
const sunrise = document.querySelector(".sunrise");
const sunset = document.querySelector(".sunset");

var time = new Date();
var curr_time = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

var DayTime;
var curWeather;

let animated = false;
let animatedSR = false;
let animatedSS = false;

function setUp(hour) {
    if (6 <= hour && hour < 12) { // Morning Hours
        DayTime = true;
        bg.style.background = "linear-gradient(to top, #ffdacb 0%, #ace0f9 100%)";
    }
    else if (12 <= hour && hour < 17) { // Afternoon Hours
        DayTime = true;
        bg.style.background = "linear-gradient(to top, #74ebd5 0%, #9face6 100%)";
    }
    else if (17 <= hour && hour < 20) { // Evening Hours
        DayTime = true;
        bg.style.background = "linear-gradient(to top, #fa709a 0%, #ffc441 100%)";
    }
    else { // Night Hours
        DayTime = false;
        bg.style.background = "linear-gradient(to top, #30cfd0 0%, #330867 100%)";
    }
}

function convert_time(UnixTimestamp) {
    const sunDate = new Date(UnixTimestamp * 1000);
    const sunTime = sunDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return sunTime;
}

function startRain(xPos, yPos) {
    const waterDrop = document.createElement('div');
    waterDrop.className = 'water-drop';

    waterDrop.style.left = `${xPos}px`;
    waterDrop.style.top = `${yPos}px`;
    bg.appendChild(waterDrop);

    waterDrop.addEventListener('animationend', () => {
        bg.removeChild(waterDrop);
    });
}

function spawnWaterDroplets() {
    startRain(24, 20); // Spawn the first water droplet

    setTimeout(() => { // Spawn the second water droplet with delay
        startRain(427, 282);
    }, 400);

    setTimeout(() => { // Spawn the third water droplet with delay
        startRain(94, 582);
        animated = false; // Reset the animated flag
    }, 900);
}

weatherIcon.addEventListener("click", function () {
    if (curWeather == "Clear" && DayTime) { // Day Clear Animation
        this.classList.toggle("spin");
    }
    else if (curWeather == "Clear" && !DayTime) { // Night Clear Animation
        if (!animated) {
            animated = true;
            weatherIcon.style.animation = 'tilt 1.25s ease-in-out';
        }
    }
    else if (curWeather == "Clouds") { // Clouds Animation
        if (!animated) {
            animated = true;
            weatherIcon.style.animation = 'flip 2s forwards';
        }
    }
    else if (curWeather == "Drizzle") { // Drizzle Animation
        if (!animated) {
            animated = true;
            startRain(340, 200)
        }
    }
    else if (curWeather == "Mist") { // Mist Fade Animation
        if (!animated) {
            animated = true;
            weatherIcon.style.animation = 'fadeInOut 2s ease-in-out';
        }
    }
    else if (curWeather == "Rain") { // Rain Drops Animation
        if (!animated) {
            animated = true;
            spawnWaterDroplets();
        }
    }
    else if (curWeather == "Thunderstorm") { // Thunder Flash Animation
        if (!animated) {
            animated = true;
            bg.style.animation = 'flash .85s linear';
        }
    }
    else if (curWeather == "Snow") { // Snow  Animation
        if (!animated) {
            animated = true;
            weatherIcon.style.animation = 'shake .6s ease-in-out';
        }
    }

    // Reset the animation class after it finishes
    weatherIcon.addEventListener('animationend', () => {
        weatherIcon.style.animation = '';
        animated = false;
    });

    bg.addEventListener('animationend', () => {
        bg.style.animation = '';
        animated = false;
    });
});

sunrise.addEventListener("click", function () {
    if (!animatedSR) {
        animatedSR = true;
        sunrise.style.animation = 'jump 1.2s ease-in-out';
    };
    sunrise.addEventListener('animationend', () => {
        sunrise.style.animation = '';
        animatedSR = false;
    });
});

sunset.addEventListener("click", function () {
    if (!animatedSS) {
        animatedSS = true;
        sunset.style.animation = 'sink 1.2s ease-in-out';
    };
    sunset.addEventListener('animationend', () => {
        sunset.style.animation = '';
        animatedSS = false;
    });
});

searchBtn.addEventListener("click", function () {
    getWeather(searchBox.value);
});

searchBox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        getWeather(searchBox.value);
    }
});

// Fetch the API key from the server
async function getApiKey() {
    const response = await fetch('/api/key');
    const data = await response.json();
    return data.apiKey;
}

async function getWeather(city) {
    const apiKey = await getApiKey();
    const response = await fetch(apiURL + city + `&appid=${apiKey}`);
    console.log(apiURL + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        document.querySelector(".sun-card").style.display = "none";
    }

    else {
        var data = await response.json();
        console.log(data);
        document.querySelector(".location").innerHTML = data.name;
        document.querySelector(".temperature").innerHTML = Math.round(data.main.temp) + "&deg;";
        document.querySelector(".time").innerHTML = curr_time;


        document.querySelector(".SR_time").innerHTML = convert_time(data.sys.sunrise);
        document.querySelector(".SS_time").innerHTML = convert_time(data.sys.sunset);

        curWeather = data.weather[0].main;
        //curWeather = "Mist";

        switch (curWeather) {
            case "Clouds":
                weatherIcon.src = DayTime ? "img/day_cloudy.png" : "img/night_cloudy.png";
                break;
            case "Drizzle":
                weatherIcon.src = DayTime ? "img/day_drizzle.png" : "img/night_drizzle.png";
                break;
            case "Mist":
                weatherIcon.src = "img/misty.png";
                break;
            case "Rain":
                weatherIcon.src = "img/rain.png";
                break;
            case "Snow":
                weatherIcon.src = "img/snow.png";
                break;
            case "Thunderstorm":
                weatherIcon.src = "img/thunderstorm.png";
                break;

            default: // Default to Clear
                weatherIcon.src = DayTime ? "img/day_clear.png" : "img/night_clear.png";
                break;
        }
        document.querySelector(".error").style.display = "none";
        document.querySelector(".weather").style.display = "flex";
        document.querySelector(".sun-card").style.display = "flex";
    }
}
setUp(time.getHours());