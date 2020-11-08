$(document).ready(function() {

//variables

    //current weather
    var key = "a76ba3f8caf1e6f9cb5109aa7d1b7229";

    //get saved cities

    var cities = JSON.parse(localStorage.getItem("CitiesFile"));
    var last = localStorage.getItem("lastConsult");

    if(cities === null)
    {
        var save = [];
        localStorage["CitiesFile"] = JSON.stringify(save);
    }
    else if
    (cities.length >= 1)
    {

        for(city of cities)
        {
            var add = $("<div>");
            add.text(city);
            add.addClass("card p-2 btnCity");
            add.attr("data-name",city);
            $("#menu").append(add);
        }

        setWeather(last);



    }
    else
    {}



//functions

function setWeather(name)
{
    
    $("#main").css("visibility","initial");
    $("#forecast").css("visibility","initial");
    
    if(name != "")
        {
            var city = name;
            
            var urlNow = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid=" + key;
            
            $.ajax({

                url:urlNow,
                method:"GET"
    
            }).then(function(response){
                
                localStorage.setItem("lastConsult",response.name);
                var Mdate = response.dt;
                var Mdt = new Date(Mdate * 1000);
                var mainDate = moment(Mdt).format("DD/MM/YYYY");

                $("#city").text(response.name + " ("+ mainDate +")");
                var icon = "https://openweathermap.org/img/wn/"+ response.weather[0].icon+"@2x.png";
                $("#mainIcon").attr("src",icon);

                var kelvin = 273.15;
                var temp = 32 + (9/5 * (response.main.temp - kelvin));
                $("#temperature").text("Temperature: " + temp.toFixed(2) + " °F");
                var windSpeed = response.wind.speed*2.237;
                $("#humidity").text("Humidity: " + response.main.humidity + "%");
                $("#wind").text("Wind speed: " + windSpeed.toFixed(2) + " MPH");
                $("#uv-index").text("0");
               
                //save city
                var current = JSON.parse(localStorage.getItem("CitiesFile"));
                if(current.indexOf(response.name) == -1)
                {
                    
                    current.push(response.name);
                    localStorage["CitiesFile"] = JSON.stringify(current);

                    var add = $("<div>");
                    add.text(response.name);
                    add.addClass("card p-2 btnCity");
                    add.attr("data-name",response.name);
                    $("#menu").append(add);


                }
                else
                {
                    
                }

                //retrive forecast
                var lat = response.coord.lat;
                var long = response.coord.lon;

                //retrive uv index
                var uvindex = "https://api.openweathermap.org/data/2.5/uvi?lat="+lat+ "&lon="+long+"&appid="+key;
                $.ajax({

                    url:uvindex,
                    method:"GET"
        
                }).then(function(uvresponse){
                    $("#uv-index").text(uvresponse.value);

                    if(uvresponse.value<=2)
                    { 
                        $("#uv-index").removeClass();
                        $("#uv-index").addClass("bg-success h6 p-2 rounded-pill");
                    }
                    else 
                    {
                        if(uvresponse.value<=5)
                        {
                            $("#uv-index").removeClass();
                            $("#uv-index").addClass("bg-warning h6 p-2 rounded-pill");
                        }
                        else if(uvresponse.value<=7)
                        {
                            $("#uv-index").removeClass();
                            $("#uv-index").addClass("bg-orange h6 p-2 rounded-pill");
                        }
                        else
                        {
                            $("#uv-index").removeClass();
                            $("#uv-index").addClass("bg-danger h6 p-2 rounded-pill");
                        }

                    }
                   
                   
                });
                


                //get forecast
                var urlForecast = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude={part}&appid=" + key ;
                
                //set today


                $.ajax({

                    url:urlForecast,
                    method:"GET"
        
                }).then(function(forecast){
                    
                    
                    var daysForcast = forecast.daily;
                   
                    $("#cards").empty();
                   
                    
                    for(var i=0;i<5;i++)
                    {
                        var date = daysForcast[i].dt;
                        var dt = new Date(date * 1000);
                        

                        var forecastCard = $("<div>");
                        var datec = $("<p>");
                        //datec = moment(date).format("DD MM YYYY");
                        datec.text(moment(dt).format("DD/MM/YYYY"));
                        forecastCard.append(datec);

                        var icon = "https://openweathermap.org/img/wn/"+ daysForcast[i].weather[0].icon+"@2x.png";
                        var iconDiv = $("<img>");
                        iconDiv.addClass("mainIcon");
                        iconDiv.attr("src",icon);
                        forecastCard.append(iconDiv);



                        var tempF = $("<p>");
                        var ftemp = 32 + (9/5 * (daysForcast[i].temp.day - 279.15));
                        tempF.text("Temp: " + ftemp.toFixed(2) + "°F");
                        forecastCard.append(tempF);

                        var humidF = $("<p>");
                        humidF.text("Humidity: " + daysForcast[i].humidity + "%");
                        forecastCard.append(humidF);


                        forecastCard.addClass("card bg-primary w-400px forecast mx-2 p-3");
                        $("#cards").append(forecastCard);

                    
                    }


                })
                

            });

        }
        else
        {}
}


//events
    
    $(".btnCity").on("click",function(){
        
        var esto = $(this).attr("data-name");
        setWeather(esto);

    });
    

    $("#searchBtn").on("click",function(){

        var esto = $("#searchInput").val().toLowerCase();
        if(esto != "")
        {
            esto = esto.charAt(0).toUpperCase() + esto.slice(1);

            var current = JSON.parse(localStorage.getItem("CitiesFile"));
            console.log(current.indexOf(esto));
            if(current.indexOf(esto) >= 0)
            {
                alert("City already added");
            }
            else
            {
                
            setWeather(esto);

            }
        }
        else
        {
            alert("Write a city");
        }
        
        

        
       
    })
    

})