
function insertObject(jsonObj, idColumn) {

    $("<div/>", {
        "class": 'card mb-4 box-shadow text-uppercase',
        html: `
                <div class="card-header text-center">
                    <h4>${jsonObj.title}</h4>
                </div>
                <div class="card-body text-left">
                        <ul id="${jsonObj.id}" class="card-text" style="list-style-type:none;">
                        </ul>
                </div>
        `
    }).appendTo("#" + idColumn);

    $.each(jsonObj.links, function (index, item) {

        $("<li/>", {
            html: `<a href="${item.link}">
                        <button type="button" class= "btn btn-link" style="padding:0;">
                            <img src="https://plus.google.com/_/favicon?domain=${item.link}" class="align-middle"/>
                            - ${item.text}
                        </button>
                    </a>
            `
        }).appendTo("#" + jsonObj.id);
    });
}


function insertQuote() {

    // Quote link -- "https://talaikis.com/api/quotes/random/"
    var quoteLink = "http://quotes.stormconsultancy.co.uk/random.json";
    $.getJSON(quoteLink, function (data) {
        $("<p/>", {
            html: `${data.quote}
                    <br/>
                    - <a href="${data.permalink}"> ${data.author}</a>
            `
        }).appendTo("#quote");
    });
}


function insertWeather() {

    $("<div/>", {
        "class": 'card mb-4 box-shadow',
        html: `
                <div class="card-header text-uppercase text-center">
                    <h4>Weather</h4>
                </div>
                <div id="weatherCard" class="card-body card-text" style="padding:-1em;">
                </div>
        `
    }).appendTo("#col0");

    $.getJSON("http://api.openweathermap.org/data/2.5/weather?q=Derby&appid=" + weatherAPIID + "&units=metric", function (data) {

        var sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
        var sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
        var windSpeedMph = (data.wind.speed * 2.2369).toFixed(1);
        $("<ul/>", {
            "class": "list-group list-group-flush",
            html: `<li class="list-group-item">Description: ${data.weather[0].main}<br/>${data.weather[0].description}</li>
                    <li class="list-group-item">Cloud Cover: ${data.clouds.all}%</li>
                    <li class="list-group-item">Visibility: ${data.visibility}m</li>
                    <li class="list-group-item">Temperature: ${data.main.temp}°C <br/> min: ${data.main.temp_min}°C <br/> max:${data.main.temp_max}°C</li>
                    <li class="list-group-item">Wind Speed: ${windSpeedMph} mph <br/> Direction: ${data.wind.deg}°</li>
                    <li class="list-group-item">Sunrise: ${sunrise} <br/> Sunset: ${sunset}</li>
                    <li class="list-group-item">${data.name} - ${data.sys.country}</li>
            `
        }).appendTo("#weatherCard");
    });
}


$(document).ready(function () {

    insertObject(News, "col1");
    insertObject(University, "col2");
    insertObject(Social, "col2");
    insertObject(Media, "col3");
    insertObject(Utilities, "col3");
    insertQuote();
    insertWeather();
});
