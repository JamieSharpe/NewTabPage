var ctx = 0;
var radius = 0;
var rss2json = "https://api.rss2json.com/v1/api.json?rss_url=";
var bbcWeatherDerby = [
    "https://weather-broker-cdn.api.bbci.co.uk/en/forecast/rss/3day/2651347"
];
var weatherCounter = 0;


function drawClock() {
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
    updateTime();
}


function drawFace(ctx, radius) {
    var grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#333');
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius * 0.1;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = '#333';
    ctx.fill();
}


function drawNumbers(ctx, radius) {
    var ang;
    var num;
    ctx.font = radius * 0.25 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (num = 1; num < 13; num++) {
        ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
    }
}


function drawTime(ctx, radius) {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    //hour
    hour = hour % 12;
    hour = (hour * Math.PI / 6) +
        (minute * Math.PI / (6 * 60)) +
        (second * Math.PI / (360 * 60));
    drawHand(ctx, hour, radius * 0.5, radius * 0.07);
    //minute
    minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    drawHand(ctx, minute, radius * 0.8, radius * 0.07);
    // second
    second = (second * Math.PI / 30);
    drawHand(ctx, second, radius * 0.9, radius * 0.02);
}


function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}


function insertObject(jsonObj, idColumn) {

    // Create the base category container
    $("<div/>", {
        "class": 'card mb-4 box-shadow text-uppercase',
        html: `
                <div class="card-header text-center">
                    ${jsonObj.title}
                </div>
                <div class="card-body text-left">
                        <ul id="${jsonObj.id}" class="card-text" style="list-style-type:none;">
                        </ul>
                </div>
        `
    }).appendTo("#" + idColumn);

    // Insert all of the links into the category
    $.each(jsonObj.links, function (index, item) {

        var favicon = "";
        if (item.favicon == null) {
            favicon = "https://plus.google.com/_/favicon?domain=" + item.link;
        } else {
            favicon = item.favicon;
        }

        $("<li/>", {
            html: `<a href="${item.link}">
                        <button type="button" class= "btn btn-link" style="padding:0;" tabindex="-1">
                            <img src="${favicon}" width="16" height="16" class="align-middle"/>
                            - ${item.text}
                        </button>
                    </a>
            `
        }).appendTo("#" + jsonObj.id);
    });

    // Add shortcut key to focus on link in that category
    var shortcutChar = jsonObj.title[0].toLowerCase();
    Mousetrap.bind(shortcutChar, function () {
        $("#" + jsonObj.id).children("li").children("a")[0].focus();
    });
}


function insertQuote() {

    // Inserts a random quote at the top of the page
    // Quote link -- "https://talaikis.com/api/quotes/random/"
    var quoteLink = "http://quotes.stormconsultancy.co.uk/random.json";
    $.getJSON(quoteLink, function (data) {
        $("<p/>", {
            html: `${data.quote}
                    <br/>
                    - <a href="${data.permalink}" tabindex="-1"> ${data.author}</a>
            `
        }).appendTo("#quote");
    });
}


function updateTime() {
    moment.locale("en-gb");
    var curDay = moment().format('dddd');
    var curDate = moment().format('MMMM Do YYYY');
    var curTime = moment().format('H:mm:ss');
    $("#curTime")[0].innerText = curDay + "\n" + curDate + "\n" + curTime;
}


function updateWeather(url) {
    console.log('updating weather');

    $.ajax({
        type: 'GET',
        url: rss2json + bbcWeatherDerby[0],
        dataType: 'jsonp',
        success: (data) => {
            var weather = data.items[weatherCounter].title;
            weather = weather.replace(/\(.*?\)/g, "");
            weather = weather.replace(", ", "\n");
            weather = weather.replace(/°C/g, "°C\n");
            weather = weather.replace(/imum/g, "");
            weather = weather.replace(/erature/g, "");
            $("#weather")[0].innerText = weather;
            weatherCounter = (weatherCounter + 1) % data.items.length;
        }
    });
}


function insertWeather() {

    // Inserts the current weather on the left column
    $("<div/>", {
        "class": 'card mb-4 box-shadow',
        html: `
        <div class="card-header text-uppercase text-center">
        Time - Weather
        </div>
        <div id = "weatherCard"
        class = "card-body card-text text-center"
        style = "padding:-1em;">
            <canvas id="canvas" width="170" height="170" style="background-color:#343434"></canvas>
            <h4 id="curTime"></h4>
            <p id="weather"></p>
        </div>
        `
    }).appendTo("#col0");
}


$(document).ready(function () {

    // Load all of the categories/links
    insertObject(News, "col1");
    insertObject(University, "col2");
    insertObject(Social, "col2");
    insertObject(Media, "col3");
    insertObject(Personal, "col3");
    insertQuote();
    insertWeather();

    var canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    radius = canvas.height / 2;
    ctx.translate(radius, radius);
    radius = radius * 0.90
    drawClock();
    updateTime();
    updateWeather();
    setInterval(drawClock, 500);
    setInterval(updateWeather, 10000);
});
