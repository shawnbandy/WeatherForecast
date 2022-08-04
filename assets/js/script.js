//! IMPORTANT:: have to have user input change the API call. For openweathermap.org, you have to use the geocoding API
//! The geocoding API will give you the lat and lon needed to call the weather data


var weatherSearchBtn = $("#submitBtn");
var citySearchInput =  $("#citySearch");
var cityListEl = $("#cityList");




// weatherSearchBtn.on("click", searchFunction)
weatherSearchBtn.on("click", addCityToList);

// function searchFunction(event){
//     event.preventDefault;

//     var requestURL = "https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}"

//     fetch(requestURL)
//         .then(function(response){
//             return response.json;
//         })
//         .then(function(data){
//             for (var i = 0; i < data.length; i++){
//                 console.log(data[i]);
//             }
//         });
// }

var i = 0;
function addCityToList(e){
    e.preventDefault
    var cityEntered = citySearchInput.val();

    var newListEl = $("<li>");
    newListEl.text(cityEntered);
    newListEl.addClass("list-group-item");
    newListEl.attr("data-number", i);

    cityListEl.append(newListEl);

    localStorage.setItem(dataType, i) //!This will have to be changed with the URL of whatever city it was that was searched
    console.log(cityEntered);
    i++;
    citySearchInput.val("");
}



