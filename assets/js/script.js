//! IMPORTANT:: have to have user input change the API call. For openweathermap.org, you have to use the geocoding API
//! The geocoding API will give you the lat and lon needed to call the weather data

//? My API key is 509e23105bc9e70fb5c519f8f743f99f
//?http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//*^this is geocoding to get the coordinates
//?"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}"
//*^this is the main one


// // TODO: Add catch if input value in the search bar is null 
// // TODO: figure out the dataNumber, may not be necessary
// // TODO: add a reset button to clear local storage
// // TODO: Figure out the API and calling
// TODO: today's weather should have the following: 
    //*city name, date, icon of weather conditions, temperature, humidity, wind speed, UV index. UV index should have color that changes depending on the conditions
// TODO: add cards to the display using API information, as well as changing the display text 
// // TODO: the 5 day forecast cards need to have the following:
    //*date, icon of weather conditions, temperature, wind speed, humidity
// TODO: make the list re-arrangeable 
// TODO:


var weatherSearchBtn = $("#submitBtn");
var citySearchInput =  $("#citySearch");
var cityListEl = $("#cityList");
var resetBtn = $("#resetBtn");
var cityDisplay = $("#cityDisplay");
var todayDate = $("#todayDate");
var currentWeather = $("#currentWeather");
var cardResults = $("#cardResults");



todayDate.text(moment().format("MMMM Do, YYYY"));

weatherSearchBtn.on("click", function(event){
    event.preventDefault;
    addCityToList();
    getGeoCoding(cityEnteredHolder);
});


resetBtn.on("click", function(){
    localStorage.clear();
    location = location;
});


//* i serves as the index and gives each thing the data type
//*this checks to see if there is any localstorage 
var i = 0;
if (localStorage.getItem("list") != null){
    cityListEl.html(localStorage.getItem("list"));
    i = localStorage.getItem("dataNumber");
    console.log(i);
}


var cityEnteredHolder;
//*this function will get the user city input, give it a set of classes/attributes, and then add it to the HTML doc
function addCityToList(){
    var cityEntered = citySearchInput.val().trim();
    
    if (cityEntered == null || cityEntered.length == 0){
        console.log("null value detected")
        return;
    }

    cityEnteredHolder = cityEntered;
    cityDisplay.text(cityEntered)

    var newListEl = $("<li>");
    newListEl.text(cityEntered);
    newListEl.addClass("list-group-item");
    newListEl.attr({
        id: "listButton",
        type: "button",
        "data-number": i});

    cityListEl.append(newListEl);

    localStorage.setItem("list", cityListEl.html()); 

    i++;
    citySearchInput.val("");
    localStorage.setItem("dataNumber", i);
}



//*this function gets the latitude and longitude of the city entered, and then feeds that data into 3 more fetch requests that get the weather, UV, and forecast
function getGeoCoding(cityEntered){

    var geoCodingURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityEntered + "%2C+US&limit=1&appid=9ec76b58d98312c57d26f7da072dd28c" 

    fetch(geoCodingURL)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            for (var i = 0; i < data.length; i++){
                var result = [data[i].lat, data[i].lon];
            }
            getCurrentCityWeather(result);
            getCurrentCityUV(result);
            get5DayForecast(result);
        })

};


//*this function gets the current city's weather and then displays it on the HTML
function getCurrentCityWeather(latAndLonArray){

    var requestURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latAndLonArray[0] + "&lon=" + latAndLonArray[1] + "&appid=509e23105bc9e70fb5c519f8f743f99f"

    fetch(requestURL)
        .then(function(response){
            return response.json()
        })
        .then(function(data){
            console.log("--------------------------")
            console.log("current city weather: ")
            console.log(data)

            dataArray = [data.weather[0].description, kelvinToFahrenheit(data.main.temp).toFixed(2), data.main.humidity, data.wind.speed]

            for (var i = 0; i < dataArray.length; i++){
                var listEl = $("<li>");
                listEl.addClass("col");
                switch (i){
                    case 0:
                        listEl.text(dataArray[0]);
                        break;
                    case 1:
                        listEl.text("Temperature: " + dataArray[1] + "F");
                        break;
                    case 2:
                        listEl.text("Humidity: " + dataArray[2] + "%");
                        break;
                    case 3:
                        listEl.text("Wind speed: " + dataArray[3] + "MPH");
                        break
                    default:
                        break;
                }

                currentWeather.append(listEl);

            }

        })

}

//*this function gets the 5 day forecast, and then puts it on the HTML in a card format 
function get5DayForecast(latAndLonArray){

    var fiveDayForecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latAndLonArray[0] + "&lon=" + latAndLonArray[1] + "&appid=509e23105bc9e70fb5c519f8f743f99f";

    fetch(fiveDayForecastURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log("--------------------------")
            console.log("Five day forecast: ")
            console.log(data)

            for (var i = 1; i < 6; i++){
                var card = $("<div>");
                    card.addClass("card col-lg col-sm-12");
                var cardImg = $("<img>");
                    cardImg.addClass("card-img-top");
                var cardBody = $("<div>");
                    cardBody.addClass("card-body");
                var cardTitle = $("<h5>");
                    cardTitle.text(moment().add(i, 'days').format("MMM D"));
                var cardList = $("<ul>");
                    cardList.addClass("list-unstyled");
                
                for (var j = 0; j < 3; j++){
                    var cardListItem = $("<li>");
                    switch (j){
                        case 0:
                            cardListItem.text("Temperature: " + kelvinToFahrenheit(data.list[i].main.temp).toFixed(2) + "F");
                            break;
                        case 1:
                            cardListItem.text("Humidity: " + data.list[i].main.humidity + "%");
                            break;
                        case 2:
                            cardListItem.text("Wind speed: " + data.list[i].wind.speed + "MPH");
                            break
                        default:
                            break;
                    }
                    cardList.append(cardListItem);
    
                }

                cardBody.append(cardTitle)
                cardBody.append(cardList)
                card.append(cardImg);
                card.append(cardBody);
                cardResults.append(card);
                
            }

        })

}

//*this function gets the UV, and then puts it on the current weather forecast
//!this does not work as my API key does not have access to the 3.0 API since I do not pay for their subscription
function getCurrentCityUV(latAndLonArray){

    var UVrequestURL = "https://api.openweathermap.org/data/3.0/onecall?lat=" + latAndLonArray[0] + "&lon=" + latAndLonArray[1] + "&appid=509e23105bc9e70fb5c519f8f743f99f";

    fetch(UVrequestURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            console.log("--------------------------")
            console.log("UV data: ")
            console.log(data);

        })


}

function kelvinToFahrenheit(kelvin){
    return (9/5) * (kelvin - 273) + 32
}







