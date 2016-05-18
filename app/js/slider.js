var slider = (function(){
	// PRIVAT stuff
	
	var slider;
	
	var createSlider = function(divId){
		console.log(divId)
		$("#" + divId).slider({
            min: 0,
            max: 5,
            range: "min",
            value: 0,
            change: function (event, ui) {
                // console.log(event, ui.value)
                // displayPoint(data, ui.value )
				
				mapApp.displayPoint(ui.value);
            }
        })		
	}
	
	
	
	return {
		// PUBLIC stuff
		initSlider: function(param1){
			createSlider(param1);
			console.log("sldier ok")
		}
		
		
	
	};
	
})();