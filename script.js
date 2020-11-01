$(document).ready(function() {

//variables

    //current weather
    var key = "a76ba3f8caf1e6f9cb5109aa7d1b7229";

    //get saved cities

    var cities = JSON.parse(localStorage.getItem("CitiesFile"));

    if(cities === null)
    {
        var save = [];
        localStorage["CitiesFile"] = JSON.stringify(save);
    }
    else{

        for(city of cities)
        {
            var add = $("<div>");
            add.text(city);
            add.addClass("card p-2");
            $("#menu").append(add);
        }

    }



//functions

//events

    $("#searchBtn").on("click",function(){

        if($("#searchInput").val() != "")
        {
            var city = $("#searchInput").val();
            
            var urlNow = "http://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid=" + key;
            
            $.ajax({

                url:urlNow,
                method:"GET"
    
            }).then(function(response){
                console.log(response);
                
                var Mdate = response.dt;
                var Mdt = new Date(Mdate * 1000);
                var mainDate = moment(Mdt).format("DD/MM/YYYY");

                $("#city").text(response.name + " ("+ mainDate +")");
                var kelvin = 273.15;
                var temp = 32 + (9/5 * (response.main.temp - kelvin));
                $("#temperature").text("Temperature: " + temp.toFixed(2) + " °F");
                var windSpeed = response.wind.speed*2.237;
                $("#humidity").text(response.main.humidity + "%");
                $("#wind").text("Wind speed: " + windSpeed.toFixed(2) + " MPH");
                $("#uv-index").text("0");
               
                //save city
                var current = JSON.parse(localStorage.getItem("CitiesFile"));
                if(current.indexOf(response.name) == -1)
                {
                    alert("no existe");
                    current.push(response.name);
                    localStorage["CitiesFile"] = JSON.stringify(current);

                    var add = $("<div>");
                    add.text(response.name);
                    add.addClass("card p-2");
                    $("#menu").append(add);


                }
                else
                {
                    alert("City already added");
                }


              

                //retrive forecast
                var lat = response.coord.lat;
                var long = response.coord.lon;

                var urlForecast = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude={part}&appid=" + key ;
                
                //set today


                $.ajax({

                    url:urlForecast,
                    method:"GET"
        
                }).then(function(forecast){
                    
                    
                    var daysForcast = forecast.daily;
                   
                    $("#cards").empty();
                   
                    
                    for(var i=1;i<6;i++)
                    {
                        var date = daysForcast[i].dt;
                        var dt = new Date(date * 1000);
                        console.log(daysForcast[i]);

                        var forecastCard = $("<div>");
                        var datec = $("<p>");
                        //datec = moment(date).format("DD MM YYYY");
                        datec.text(moment(dt).format("DD/MM/YYYY"));
                        forecastCard.append(datec);

                        var tempF = $("<p>");
                        var ftemp = 32 + (9/5 * (daysForcast[i].temp.day - 279.15));
                        tempF.text("Temp: " + ftemp.toFixed(2) + "°F");
                        forecastCard.append(tempF);

                        var humidF = $("<p>");
                        humidF.text("Humidity: " + daysForcast[i].humidity + "%");
                        forecastCard.append(humidF);


                        forecastCard.addClass("card bg-primary w-400px forecast mx-2");
                        $("#cards").append(forecastCard);

                    
                    }


                })
                

            });

        }
        else
        {}
       
    })
    

})