//* instance interactiveMap Class
	google.charts.load("current", {packages:["corechart"]});
	//google.charts.setOnLoadCallback(drawChart);
	/*******************
	TO USE simpleBike.py
	********************/
	
	/*****
	TODO
		+ if info window open and change slider value ==> create function to refresh the data into infowindow
	*****/
		
    //google.maps.event.addDomListener(window, 'load', initApp);
   
    var listCircle = []
	var listListener = []
	var infoWindow;
	var isInfoWindowOpen = false
	var openstationName;	
	var currentDate;
	
	
    function loadData() {
        $.ajax({
            type: 'GET',
            url: "http://localhost:3000/getSimpleBike",
            dataType: "json",
            success: function (data) {
               
                initApp(data)

                //displayPoint(data, 0);
                /* for(var i = 0 ; i < data.length ; i ++){
                    console.log(data[i].data.length)
                    for(var u = 0 ; u < data[i].data.length ; u ++){    
                    }
                } */
            }
        });
    }

    function initApp(data) {
        //var myMap = new interactiveMap("map-canvas", "myData/fictive_data_set.json");
        //myMap.initialize()
       
        var len = data.length - 1

        map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: { lat: 53.349841, lng: -6.260254 },
            zoom: 14
        });
		
		// If we define infowWindow here, we will have only one IW fro the whole application
		// if we want multi IW, need to define the IF in the click event function
		theInfoWindow = new google.maps.InfoWindow();  
		theInfoWindow.addListener("closeclick" , function(){
			isInfoWindowOpen = false
		});
		
		// create circle on the map, stock them,
		// create event click handler for infowindow
        displayPoint(data, 0)
		
		// create slider and refresh data when slider value change
        $("#slider").slider({
            min: 0,
            max: len,
            range: "min",
            value: 0,
            change: function (event, ui) {
                console.log(event, ui.value)
                displayPoint(data, ui.value )
            }
        })		
		
    }
	// remove all data before refresh (evt listener and circle dataset)
	// this function should be called when data changed on the map
	// when data change, they should also be replaced
	function eraseData(){		
		// listCircle =  current visible dataset
        if (listCircle.length > 0 && listListener.length > 0) {
            for (i in listCircle) {
				// setMap null => remove circle
                // listCircle[i].setMap(null)
				listCircle[i].circleObj.setMap(null);
				listListener[i].remove();	
            }
            listCircle = []
			listListener = []
        }
	}
	
	// DisplayPoint on the map
	// param 'list' = [] global data list : results from first ajax requ to REST getSimpleBike
	// param 'dateVal' = INT index depending of the slider position
    function displayPoint(list, dateVal) {
       
		eraseData();
		
		// generate circles 
        for (data in list[dateVal].data) {
			// create circle object for each station		
			myCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                center: list[dateVal].data[data]["position"],
                radius: 15 + list[dateVal].data[data]["ratio-bikes-available"] * 50,
				clickable: true
			});
			// create simple structure object for data instead of []
			d = {
				bikes : list[dateVal].data[data]["available-bikes"],
				stands : list[dateVal].data[data]["available-stands"],
				total : list[dateVal].data[data]["bike-stand-total"],
				name : list[dateVal].data[data]["name"],
				ratio : list[dateVal].data[data]["ratio-bikes-available"]				
			}
			// embed data to circle object.data
			myCircle.data = d;			
			
			// create and stock event listener for each circle
			createEvt(map , myCircle);
			
			// stock data for each circle in an array which will be erased every time data slider are changed
			// data are stoked in 'listCircle' and include the Google.circle object and the data from mongo DB
			tmpdataObj = list[dateVal].data[data]
			mainObj = {
				circleObj : myCircle,
				dataObj : tmpdataObj				
			}			
			listCircle.push(mainObj);          
			
        }
		// display DATA date 
		currentDate = list[dateVal].value
        $(".displayData").text(currentDate)
		$("#nbrDataset").text(list.length + " datasets")
		
		// refresh current info window if already open
		if(isInfoWindowOpen){
			var tmp = returnCurrent(openstationName)
			if(tmp){
				drawChart(tmp)
				openstationName = tmp.data.name						
			}			
		}
		
    }
	// create an google evenet listener on a google.circle object
	// Param 'map' = MAP Google.Maps Object
	// Param 'circle' = CIRCLE google.circle object  + embeded data
	function createEvt(map, circle){
		// click event on the circle
		var l = google.maps.event.addListener(circle, "click", function(evt){
			// if click on a different circle, then open a get data
			if(theInfoWindow.getPosition() != this.getCenter()){
				isInfoWindowOpen = true
				openstationName = this.data.name;
				drawChart(this)				
			}
		})
		listListener.push(l)
	}
	
	// draw the Chart into Infowindow for selected circle
	// param 'circle' = google.circle currentCircle Object with embeded data
	function drawChart(circle){
		// init data for google.pieChart object
		var data = google.visualization.arrayToDataTable([
			['Task', 'station occupancy'],
			['bikes', circle.data.bikes],
			['Stands', circle.data.stands]	
		]);
		// create Dom element for pieChart
		divPie = "<div id='pie' style='width: 100%; height: 100%;  overflow:hidden;'></div>";			
		// create InfoWindow
		theInfoWindow.setPosition(circle.getCenter());	
		theInfoWindow.setContent(divPie)
		theInfoWindow.open(map);
		// display chart object
		var chart = new google.visualization.PieChart(document.getElementById('pie'));
		var options = {
			title: circle.data.name + " " + currentDate
		};
		chart.draw(data, options);
		
	}
	// return the circle selected 
	// param name = STRING station bike name
	function returnCurrent(name){
		// listCircle ==> current dataset (only visble circle)
		for(var i in listCircle){
			if(name == listCircle[i].circleObj.data.name){
				return listCircle[i].circleObj;
			}
		}
		return false;
	}
	
	
	
    loadData()