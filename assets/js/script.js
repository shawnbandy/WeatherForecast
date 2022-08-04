


var weatherSearchBtn = $("#submitBtn");





weatherSearchBtn.on("click", searchFunction)

function searchFunction(){

    var requestURL = "https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}"

    fetch(requestURL)
        .then(function(response){
            return response.json;
        })
        .then(function(data){
            for (var i = 0; i < data.length; i++){
                console.log(data[i]);
            }
        });
}

