//! IMPORTANT:: have to have user input change the API call. For openweathermap.org, you have to use the geocoding API
//! The geocoding API will give you the lat and lon needed to call the weather data


var weatherSearchBtn = $("#submitBtn");
var citySearchInput =  $("#citySearch");
var cityListEl = $("#cityList");
var resetBtn = $("#resetBtn");
var cityDisplay = $("#cityDisplay");
var todayDate = $("#todayDate");

//! My API key is 509e23105bc9e70fb5c519f8f743f99f

//?http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
//*^this is geocoding to get the coordinates

//?"https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}"
//*^this is the main one

"http://api.openweathermap.org/geo/1.0/direct?q={city name}%2C+US&limit=1&appid=509e23105bc9e70fb5c519f8f743f99f"

// weatherSearchBtn.on("click", searchFunction)

todayDate.text(moment().format("MMMM do, YYYY"))

// weatherSearchBtn.on("click", addCityToList);
// weatherSearchBtn.on("click", getGeoCoding(cityEnteredHolder));

weatherSearchBtn.on("click", masterClick);

resetBtn.on("click", function(){
    localStorage.clear();
    location = location;
});

function masterClick(event){
    event.preventDefault;
    addCityToList();
    var latAndLon = getGeoCoding(cityEnteredHolder);
    getCityWeather(latAndLon[0], latAndLon[1]);
};


// // TODO: Add catch if input value in the search bar is null 
// TODO: figure out the dataNumber, may not be necessary
// // TODO: add a reset button to clear local storage
// TODO: Figure out the API and calling
// TODO: today's weather should have the following: 
    //*city name, date, icon of weather conditions, temperature, humidity, wind speed, UV index. UV index should have color that changes depending on the conditions
// TODO: add cards to the display using API information, as well as changing the display text 
// TODO: the 5 day forecast cards need to have the following:
    //*date, icon of weather conditions, temperature, wind speed, humidity
// TODO: make the list re-arrangeable 
// TODO: 

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



//*this function gets the latitude and longitude of the city entered 
var latLonResult;
function getGeoCoding(cityEntered){

    var requestURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityEntered + "%2C+US&limit=1&appid=509e23105bc9e70fb5c519f8f743f99f"
    console.log(requestURL);
    
    fetch(requestURL)
        .then(function(response){
            return response.json();
        })
        .then(function(data){
            for (var i = 0; i < data.length; i++){
                console.log(data[i]);
                var result = [data[i].lat, data[i].lon];
                console.log(result);
                return result;
            }
        });

}



function getCityWeather(lat, lon){
    console.log(latLonResult);

    var requestURL = "https://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + lon + "&appid=509e23105bc9e70fb5c519f8f743f99f"

}







