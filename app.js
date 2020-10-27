//DOM elements
const date = document.querySelector('.date');
const city = document.querySelector('.city');
const temp = document.querySelector('.temp');
const iconBig = document.getElementById('iconBig');
const weekInfo = document.querySelector('.weather__weekInfo');
//variables
const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function setDate() {
    const currentDay = new Date();

    const currentDayName = weekDays[currentDay.getDay()];
    const currentMonth = months[currentDay.getMonth()].substr(0, 3);

    return `${currentDayName} ${currentDay.getDate()} <br> ${currentMonth}`;
}


function setTimezone(data) {
    const timezone = data.timezone;
    const timezoneArray = timezone.split('/');
    const city = timezoneArray[1];
    const continent = timezoneArray[0];
    return `${city},<br>${continent}`;
}
function setTemp(data) {
    const temp = data.current.temp;
    return `${temp.toFixed(0)}&deg;C`;
}
function setIconBig(data) {
    const iconId = data.current.weather[0].icon;
    return `http://openweathermap.org/img/wn/${iconId}@2x.png`;
}

function getDaily(data) {
    const daily = data.daily;
    daily.forEach(element => {
        const UNIX_timestamp = element.dt;
        const newDate = new Date(UNIX_timestamp * 1000);
        const day = newDate.getDay();
        const temp = element.temp.day;
        const iconId = element.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
        const weatherItem = document.createElement('div');

        weatherItem.classList.add('weekInfo__item');
        weatherItem.innerHTML = `<div class="day">${weekDays[day]}</div>
        <img src="${iconUrl}" alt="icon">
        <div class="degrees">${temp.toFixed(0)} &deg; C</div>`;
        weekInfo.appendChild(weatherItem);
    });
}




document.addEventListener('DOMContentLoaded', () => {
    date.innerHTML = setDate();

    let lat;
    let long;
    const API_KEY = '962c04134f11536c1e9d62e03539f530';

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&units=metric&exclude=hourly,minutely&appid=${API_KEY}`;
            fetch(url)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    city.innerHTML = setTimezone(data);
                    temp.innerHTML = setTemp(data);
                    getDaily(data);
                    iconBig.src = setIconBig(data);
                })
        });
    }
});
