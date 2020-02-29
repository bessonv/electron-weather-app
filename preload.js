const fs = require('fs')
var unirest = require('unirest');

const dayOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
const month = ["", "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Октября", "Сентября", "Ноября", "Декабря"]
const conditionsRus = {
    "clear": ["ясно", "image-sun"], 
    "partly-cloudy": ["малооблачно", "image-cloudy"], 
    "cloudy": ["облачно с прояснениями", "image-cloudy"], 
    "overcast": ["пасмурно", "image-cloud"], 
    "partly-cloudy-and-light-rain": ["небольшой дождь", "image-raining"], 
    "partly-cloudy-and-rain": ["дождь", "image-raining"], 
    "overcast-and-rain": ["сильный дождь", "image-storm"], 
    "overcast-thunderstorms-with-rain": ["сильный дождь, гроза", "image-storm"], 
    "cloudy-and-light-rain": ["небольшой дождь", "image-raining"], 
    "overcast-and-light-rain": ["небольшой дождь", "image-raining"], 
    "cloudy-and-rain": ["дождь", "image-raining"], 
    "overcast-and-wet-snow": ["дождь со снегом", "image-snow_rain"], 
    "partly-cloudy-and-light-snow": ["небольшой снег", "image-snow"], 
    "partly-cloudy-and-snow": ["снег", "image-snow"], 
    "overcast-and-snow": ["снегопад", "image-snow"], 
    "cloudy-and-light-snow": ["небольшой снег", "image-snow"], 
    "overcast-and-light-snow": ["небольшой снег", "image-snow"], 
    "cloudy-and-snow": ["снег", "image-snow"] 
}

window.addEventListener('DOMContentLoaded', () => {
    let weatherData;

    const req = unirest("GET", "https://api.weather.yandex.ru/v1/forecast?");
    req.query({
        lat: 57.626559,
        lon: 39.893804,
        lang: "ru_RU",
        limit: 7,
        hours: false
    })
    req.headers({
        "X-Yandex-API-Key": "ed7889a9-c3cb-44b1-8c04-b550dd11347d"
    })
    req.then(res => {
        if (res.error) throw new Error(res.error)

        weatherData = res.body;
        loadValuesOnPage()
        fs.writeFile("./data/old_weather_data.json", JSON.stringify(res.body), err => {
            if (err) throw new Error(err)
        });
    }).catch(err => {
        console.log(err.name, err.message)
        alert('Проблемы с интернет соединением. Загружены сохраненные до этого результаты.')
        let oldData = fs.readFileSync("data/old_weather_data.json")
        weatherData = JSON.parse(oldData)
        loadValuesOnPage()
    })
    

    const loadValuesOnPage = () => {
        const date = new Date(weatherData.now_dt)

        const replaceText = (selector, text) => {
            const element = document.getElementById(selector);
            if (element) element.innerText = text
        }

        const addToTable = (table, values) => {
            let row = table.insertRow()
            values.forEach(cellValue => {
                let cell = row.insertCell()
                cell.innerText = cellValue
            })
        }

        replaceText ('time', `${date.getHours()}:${date.getMinutes()}`)
        replaceText ('day', dayOfWeek[date.getDay()])
        replaceText ('date', `${date.getDate()} ${month[date.getMonth()]}`)
        replaceText ('temp', weatherData.fact.temp)
        replaceText ('feels-temp', weatherData.fact.feels_like)
        replaceText ('pressure', weatherData.fact.pressure_mm)
        replaceText ('condition', conditionsRus[weatherData.fact.condition][0])
        replaceText ('wind', weatherData.fact.wind_speed)
        replaceText ('sunrise', weatherData.forecasts[0].sunrise)
        replaceText ('sunset',  weatherData.forecasts[0].sunset)

        const conditionImage = document.getElementById('image-icon')
        conditionImage.classList.add(conditionsRus[weatherData.fact.condition][1])

        const table = document.getElementById('weather-forecasts')
        for (let day of weatherData.forecasts) {
            const dayDate = new Date(day.date)
            let values = [
                `${dayDate.getDate()} ${month[dayDate.getMonth()]}`,
                dayOfWeek[dayDate.getDay()],
                conditionsRus[day.parts.day.condition][0],
                `${day.parts.day.temp_avg} ℃`,
                `${day.parts.day.pressure_mm} мм рт. ст.`,
                `${day.parts.day.wind_speed} м/с`
            ]
            addToTable(table, values)
        }
    }
})
