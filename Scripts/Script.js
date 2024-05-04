"use strict";

// [+] For Better Performance
const $ = document;

// [+] Define Variable
const loadingSection   = $.querySelector(".loading");
const searchInput      = $.querySelector(".search-box__input");
const searchButton     = $.querySelector(".search-box__button");
const weatherLocation  = $.querySelector(".weather-content__location");
const weatherTime      = $.querySelector(".weather-content__time");
const weatherTemp      = $.querySelector(".weather-content__temp");
const weatherFlow      = $.querySelector(".weather-content__status--value");
const weatherFlowShape = $.querySelector(".weather-content__status--icon");
const weatherWindSpeed = $.querySelector(".weather-content__wind-speed--value");

// [+] API
const ipAPI = "https://api.ipify.org/?format=json";
const locationAPI = "http://ip-api.com/json/";
const apiKeys = "E8RWYZM9M8ELKZCNHVLVWZGL2";

// [+] Functions
function clearInput(){
    searchInput.value = "";
}
function setCurrentTime(){
    const date = new Date();
    let year, month, day, dateDay, monthIndex, dayIndex;
    year = date.getFullYear();
    dateDay = date.getDate();

    monthIndex = date.getMonth();
    dayIndex = date.getDay();

    switch (monthIndex){
        case 0 :
            month = "January";
            break;
        case 1 :
            month = "February";
            break;
        case 2 :
            month = "March";
            break;
        case 3 :
            month = "April";
            break;
        case 4 :
            month = "May";
            break;
        case 5 :
            month = "June";
            break;
        case 6 :
            month = "July";
            break;
        case 7 :
            month = "August";
            break;
        case 8 :
            month = "September";
            break;
        case 9 :
            month = "October";
            break;
        case 10 :
            month = "November";
            break;
        case 11 :
            month = "November";
            break;
    }
    switch (dayIndex){
        case 0 :
            day = "Sunday";
            break;
        case 1 :
            day = "Monday";
            break;
        case 2 :
            day = "Tuesday";
            break;
        case 3 :
            day = "Wednesday";
            break;
        case 4 :
            day = "Thursday";
            break;
        case 5 :
            day = "Friday";
            break;
        case 6 :
            day = "Saturday";
            break;
    }

    weatherTime.innerHTML = `${day} ${dateDay} ${month} ${year}`;
    getPrivateIP();
}

function keydownOnInputHandler(){
    let searchValue = searchInput.value;
    let targetValue = searchValue[0].toUpperCase();
    targetValue += searchValue.slice(1, searchValue.length+1).toLowerCase();
    searchInput.value = targetValue.toString();
}

function inputValidection(){
    let searchValue = searchInput.value.trim();
    if(searchValue){
        getWeatherFunction(searchValue)
    }
}

function getPrivateIP(){
    fetch(ipAPI, {method : "GET"})
        .then(resolved => (resolved.status === 200) && resolved.json())
        .then(data => {
            let ip = data.ip;
            getAddressByIp(ip)
        })
        .catch(errorToConnection);
}

function getAddressByIp(ip){
    fetch(locationAPI + ip, {method : "GET"})
        .then(resolved => (resolved.status === 200) && resolved.json())
        .then(data => getWeatherFunction(data.country, data.countryCode))
        .catch(errorToConnection);
}

function getWeatherFunction(location, countryCode){
    let getWeatherFetch = fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${apiKeys}&contentType=json`);

    getWeatherFetch
        .then(resolved => (resolved.status === 200) && resolved.json())
        .then(data => showWeatherStatus(location, countryCode,data.currentConditions.temp, data.currentConditions.conditions, data.currentConditions.icon, data.currentConditions.windspeed))
        .catch(errorToLoadWeather);
}

function showWeatherStatus(location, countryCode, tempF, skyFlow, icon, windSpeed){
    let tempC = ((tempF - 32) / 1.8);
    tempC = tempC.toFixed(1);
    tempC += "°C";
    windSpeed += "km/h"

    countryCode = (countryCode) ? ", " + countryCode : "";
    weatherLocation.innerHTML = location + countryCode;
    weatherTemp.innerHTML = tempC;
    weatherFlow.innerHTML = skyFlow;
    weatherWindSpeed.innerHTML = windSpeed;
    setWeatherFlowIcon(icon)
}

function setWeatherFlowIcon(icon){
    weatherFlowShape.setAttribute("src", `Asset/Icons/${icon}.svg`);
    closeLoading();
    clearInput();
}

// [+] Modal Config
function showModal(icon, title, caption){
    return swal.fire({
        icon : icon,
        title:title,
        text:caption,
        padding:"10px 15px",
        allowEscapeKey:false,
        allowEnterKey:false
    });

}

function errorToConnection(err){
    showModal("error", "Connection problem !", "A problem was found with your connection, check your internet")
        .then((resolved) => {
            if(resolved.isConfirmed){
                window.location.reload();
            }
        });
    $.body.removeAttribute("class");
}
function errorToLoadWeather(err){
    showModal("error", "Oops !", "A problem occurred. Please try again");
    $.body.removeAttribute("class");
    clearInput();
}

// [+] Close Loading Section
function closeLoading(){
    loadingSection.classList.add("loading--hide");
}

// [+] Events
window.addEventListener("load", setCurrentTime);
searchInput.addEventListener("keydown", event => (event.key === "Enter") && (inputValidection()))
searchInput.addEventListener("keyup", keydownOnInputHandler);
searchButton.addEventListener("click", inputValidection);