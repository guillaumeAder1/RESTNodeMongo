var express = require('express'),
    wine = require('./routes/wines'),
	bike = require("./routes/bike");
	

var app = express();

// Allow cross domain
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
}



app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
	// cross domain
	app.use(allowCrossDomain);
});



app.get("/getSimpleBike", bike.getSimpleBike)



app.get('/wines', wine.findAll);
app.get('/stationCoord', wine.findStation);


app.get("/complexQ", wine.complexQuery);

/**/
app.get("/findAllJOIN", wine.findAllJOIN)
app.get("/findAllJOINstation", wine.findAllJOINstation)
app.get("/globalJOIN", wine.globalJOIN)
/**/



app.get("/allWithStation", wine.allWithStation);

app.get('/wines/:id', wine.findById);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
app.delete('/wines/:id', wine.deleteWine);

app.listen(3000);
console.log('Listening on port 3000...');

// URL to test : http://localhost:3000/wines
// Mongo : data -- collecction = report4
// 			station coordinate collection = stationCoord
/*
TO do :
	run mongo.exe
	run mongod.exe
	
*/		