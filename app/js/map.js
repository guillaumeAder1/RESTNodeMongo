var mapApp = (function(){
	// PRIVAT stuff
	
	var map;
	var curdata;
	var listCircle = [];
	var listListener = [];
	
	var createMap = function(divId){
		// INIT Google.map
		map = new google.maps.Map(document.getElementById(divId), {
            center: { lat: 53.349841, lng: -6.260254 },
            zoom: 14
        });
		
		// If we define infowWindow here, we will have only one IW fro the whole application
		// if we want multi IW, need to define the IF in the click event function
		theInfoWindow = new google.maps.InfoWindow();  
		theInfoWindow.addListener("closeclick" , function(){
			// isInfoWindowOpen = false
		});
		
	}
	
	var ajaxReq = function (action){
		$.ajax({
            type: 'GET',
            url: "http://localhost:3000/" + action,
            dataType: "json",
            success: function (data) {
               
				curdata = data;				
				_displayPoint(0)

            }
        });
	}
	
	// remove all data before refresh (evt listener and circle dataset)
	// this function should be called when data changed on the map
	// when data change, they should also be replaced
	var eraseData = function(){		
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
	
	var _displayPoint = function(index){
		console.log(curdata, index)
		eraseData()
		
		for (data in curdata[index].data) {
			// create circle object for each station		
			var myCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                center: curdata[index].data[data]["position"],
                radius: 15 + curdata[index].data[data]["ratio-bikes-available"] * 50,
				clickable: true
			});		
			
			myCircle.data = formatData(curdata[index].data[data])
			var obj = {
				circleObj : myCircle
			}
			createEvt(myCircle)
			listCircle.push(obj)	
		}		
			
	}
	
	// create an google evenet listener on a google.circle object
	// Param 'map' = MAP Google.Maps Object
	// Param 'circle' = CIRCLE google.circle object  + embeded data
	var createEvt = function(circle){
		// click event on the circle
		var l = google.maps.event.addListener(circle, "click", function(evt){
			// if click on a different circle, then open a get data
			if(theInfoWindow.getPosition() != this.getCenter()){
				// isInfoWindowOpen = true
				// openstationName = this.data.name;
				// drawChart(this)
				theInfoWindow.setPosition(circle.getCenter());	
				//theInfoWindow.setContent(divPie)
				theInfoWindow.open(map);
			}
		})
		listListener.push(l)
	}
	
	// format data object with only uselfull value
	var formatData = function(obj){
		// create simple structure object for data instead of []
		d = {
			bikes : obj["available-bikes"],
			stands : obj["available-stands"],
			total : obj["bike-stand-total"],
			name : obj["name"],
			ratio : obj["ratio-bikes-available"]				
		}
		return d;
	}
	
	return {
		// PUBLIC stuff
		initMap: function(param1){
			createMap(param1);
		},
		
		actionMap: function(value){
			console.log(value);
		},
		
		getData: function(val){
			ajaxReq(val);
		},
		
		displayPoint: function(index){
			_displayPoint(index);
			
			console.log(curdata)
		}
	
	};
	
})();