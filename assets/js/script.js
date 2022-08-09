
//? My API key is 509e23105bc9e70fb5c519f8f743f99f


// // TODO: Add catch if input value in the search bar is null 
// // TODO: figure out the dataNumber, may not be necessary
// // TODO: add a reset button to clear local storage
// // TODO: Figure out the API and calling
// // TODO: today's weather should have the following: 
    // // *city name, date, icon of weather conditions, temperature, humidity, wind speed, UV index. UV index should have color that changes depending on the conditions
// // TODO: add cards to the display using API information, as well as changing the display text 
// // TODO: the 5 day forecast cards need to have the following:
    // // *date, icon of weather conditions, temperature, wind speed, humidity
// TODO: make the list re-arrangeable 
// // TODO: make everything save to localstorage

// // TODO: Fix bug where the list buttons don't work on refresh
// // TODO: fix bug where the city list won't appear off of localstorage
// // TODO: fix bug where off of refresh, the weather page won't update


//*on window load, sets the list and the weather page to last entry
    $(window).on("load", function(){
        if (localStorage.getItem("list") != null){
            console.log("list is not null");
            console.log(localStorage.getItem("list"));
            cityListEl.html(localStorage.getItem("list"));
            cityDisplay.text(localStorage.getItem("cityName"));
        }else{
            console.log("null")
        }
        
        if (localStorage.getItem("weatherPage") != null){
            console.log("previous weather page is exists");
            cardResults.empty();
            currentWeather.empty();
            cityDisplay.text(localStorage.getItem("cityName"));
            getGeoCoding(localStorage.getItem("weatherPage"));
        }
    })


    





var weatherSearchBtn = $("#submitBtn");
var citySearchInput =  $("#citySearch");
var cityListEl = $("#cityList");
var resetBtn = $("#resetBtn");
var cityDisplay = $("#cityDisplay");
var stateDisplay = $("#stateDisplay");
var todayDate = $("#todayDate");
var currentWeather = $("#currentWeather");
var cardResults = $("#cardResults");
var weatherPage = $("#weatherPage");
var listButton = $("#listButton");

todayDate.text(moment().format("MMMM Do, YYYY"));

//*disables hitting enter inside the form because it somehow refreshes the page.
$("form").keydown(function(event){
    return event.keyCode != 13;
})



//*on button click, clears the current weather page and cards, adds city to the list, and then sets all of the weather information to city entered
weatherSearchBtn.on("click", function(event){
    console.log("pressed");
    event.preventDefault;
    
    localStorage.clear("weatherPage");

    cardResults.empty();
    currentWeather.empty();

    addCityToList();
    localStorage.setItem("weatherPage", cityEnteredHolder);
    localStorage.setItem("cityName", cityEnteredHolder);
    getGeoCoding(cityEnteredHolder);

    localStorage.setItem("list", cityListEl.html()); 
});

//*same feature as above, but works for the list buttons
$(document).on("click", "#listButton" ,function(event){
    event.preventDefault;

    console.log("btn clicked");

    localStorage.clear("weatherPage");

    cityDisplay.text(event.target.innerText);
    console.log(event.target.innerText);

    cardResults.empty();
    currentWeather.empty();

    localStorage.setItem("weatherPage", event.target.innerText);
    localStorage.setItem("cityName", event.target.innerText);

    getGeoCoding(event.target.innerText);

    localStorage.setItem("list", cityListEl.html()); 

})


//*resets local storage
resetBtn.on("click", function(){
    localStorage.clear();
    location.reload(true)
});

//*array of all cities that are on the list
var cityArray = [];
if (localStorage.getItem("cityArray") != null){
    var cityArray = JSON.parse(localStorage.getItem("cityArray"));
    console.log("city array after LS")
    console.log(cityArray);
}

var cityEnteredHolder;
//*this function will get the user city input, give it a set of classes/attributes, and then add it to the HTML doc
function addCityToList(){
    var cityEntered = citySearchInput.val().trim();
    
    if (cityEntered == null || cityEntered.length == 0){
        console.log("null value detected")
        return;
    }
    for (var i = 0; i < specialCharsAndNums.split("").length; i++){
        if (cityEntered.includes(specialCharsAndNums[i])){
            console.log("non-alphabetical letter detected");
            return;
        }
    }
    cityEnteredHolder = cityEntered;
    cityDisplay.text(cityEntered);

    for (var i = 0; i < cityArray.length; i ++){
        if (cityEntered.toLowerCase() === cityArray[i].toLowerCase()){
            return;
        }
    }
    cityArray.push(cityEntered);

    var newListEl = $("<li>");
    newListEl.text(cityEntered);
    newListEl.addClass("list-group-item");
    newListEl.attr({
        id: "listButton",
        type: "button",
    });
    
    cityListEl.append(newListEl);

    //*resets the search input and stores the list into the array
    citySearchInput.val("");
    localStorage.setItem("cityArray", JSON.stringify(cityArray));
    console.log(cityArray);

}

//*this function gets the latitude and longitude of the city entered, and then feeds that data into 3 more fetch requests that get the weather, UV, and forecast
function getGeoCoding(cityEntered){

    var geoCodingURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityEntered + "%2C+US&limit=1&appid=9ec76b58d98312c57d26f7da072dd28c" 

    fetch(geoCodingURL)
        .then(function(response){
            return response.json()
            
        })
        .then(function(data){
            //*gets the lat/lon and then pushes those values into the other API fetch requests
            if (data[0] == null){
                alert("This is not a US city.");
            }

            for (var i = 0; i < data.length; i++){
                var result = [data[i].lat, data[i].lon];
                var state = data[i].state;
            }
            stateDisplay.text(state);
            getCurrentCityWeather(result);
            getCurrentCityUV(result);
            get5DayForecast(result);
            }   
        )

};


//*this function gets the current city's weather and then displays it on the HTML
function getCurrentCityWeather(latAndLonArray){
    //*uses lat and lon to get the weather
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latAndLonArray[0] + "&lon=" + latAndLonArray[1] + "&appid=509e23105bc9e70fb5c519f8f743f99f"

    fetch(requestURL)
        .then(function(response){
            return response.json()
        })
        .then(function(data){

            //*
            dataArray = [
                data.weather[0].icon, 
                kelvinToFahrenheit(data.main.temp).toFixed(2), 
                data.main.humidity, 
                data.wind.speed
            ]

            //*sets HTML elements depending on switch case
            for (var i = 0; i < dataArray.length; i++){
                var listEl = $("<li>");
                listEl.addClass("col");
                switch (i){
                    case 0:
                        var image = $("<img>")
                        image.attr("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
                        listEl.append(image)
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

    $("#weeklyForecast").attr("style", "display");

    var fiveDayForecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latAndLonArray[0] + "&lon=" + latAndLonArray[1] + "&appid=509e23105bc9e70fb5c519f8f743f99f";

    fetch(fiveDayForecastURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){

           //*adds the weekly weather at 12PM for 5 days, and sets the html depending on the switch case
            var day = 1;
            for (var i = 5; i < 40; i+=8){

                var card = $("<div>");
                    card.addClass("card col-lg col-sm-12 align-items-center");
                    card.attr("style", "background-color: #C2DED1")
                var cardImg = $("<img>");
                    cardImg.addClass("card-img-top");
                    cardImg.attr("src", "http://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png")
                    cardImg.addClass("w-50 h-50")
                var cardBody = $("<div>");
                    cardBody.addClass("card-body");
                var cardTitle = $("<h5>");
                    cardTitle.text(moment().add(day, 'days').format("MMM D"));
                    day +=1;
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

                
                cardBody.append(cardTitle);
                card.append(cardImg);
                cardBody.append(cardList);
                card.append(cardImg);
                card.append(cardBody);
                cardResults.append(card);


            }
            

        })
}

//*this only works by making it data/2.5 and not data/3.0
function getCurrentCityUV(latAndLonArray){

    var UVrequestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latAndLonArray[0] + "&lon=" + latAndLonArray[1] + "&appid=509e23105bc9e70fb5c519f8f743f99f";

    fetch(UVrequestURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            //*sets the UV and gives it a background color depending on the value

            var uvSpan = $("<span>")
                uvSpan.attr("style", "width: 10%;")
            var unListEl = $("<li>");
            unListEl.addClass("col text-light");
                uvSpan.text("UV: " +data.current.uvi);
                    if (data.current.uvi < 2.1){
                        uvSpan.attr("style", "background-color: green;")
                    }else if (data.current.uvi < 8 && data.current.uvi > 2.1){
                        uvSpan.attr("style", "background-color: orange;")
                    }else if (data.current.uvi > 8){
                        uvSpan.attr("style", "background-color: red;")
                    }


            unListEl.append(uvSpan);
            currentWeather.append(unListEl);
        })
        

}

//*all data pulled is in kelvin for some reason
function kelvinToFahrenheit(kelvin){
    return (9/5) * (kelvin - 273) + 32
}

//*if I have time I'll try to work on this
// $(function(){
//     var selection = [
//         "Montgomery",
//         "Juneau",
//         "Phoenix",
//         "Little Rock",
//         "Sacramento",
//         "Denver",
//         "Hartford",
//         "Dover",
//         "Tallahassee",
//         "Atlanta",
//         "Honolulu",
//         "Boise",
//         "Springfield",
//         "Indianapolis",
//         "Des Moines",
//         "Topeka",
//         "Frankfort",
//         "Baton Rouge",
//         "Augusta",
//         "Annapolis",
//         "Boston",
//         "Lansing",
//         "St. Paul",
//         "Jackson",
//         "Jefferson City",
//         "Helena",
//         "Washington D.C.",
//         "Lincoln",
//         "Carson City",
//         "Concord",
//         "Trenton",
//         "Santa Fe",
//         "Albany",
//         "Raleigh",
//         "Bismarck",
//         "Columbus",
//         "Oklahoma City",
//         "Salem",
//         "Harrisburg",
//         "Providence",
//         "Columbia",
//         "Pierre",
//         "Nashville",
//         "Austin",
//         "Salt Lake City",
//         "Montpelier",
//         "Richmond",
//         "Olympia",
//         "Charleston",
//         "Madison",
//         "Cheyenne"
//     ];
//     $("#citySearch").autocomplete({source: selection});
// });


var specialCharsAndNums = "1234567890-=[],./~!@#$%^&*()_+{}|:<>?";


