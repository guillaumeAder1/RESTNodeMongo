var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});

// my bikes DB
db = new Db('bikes1', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'bikes1' database");
        db.collection('report4', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'bikes' collection doesn't exist. Creating it with sample data...");
                //populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving wine: ' + id);
    db.collection('report4', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {

    db.collection('report4', function(err, collection) {
        collection.find().toArray(function(err, items) {		
            res.send(items);
        });
    });
};

/* join the bike AND the station table */
exports.findAllJOIN = function(req, res) {

    db.collection('join_bike', function(err, collection) {
        collection.find().toArray(function(err, items) {		
            res.send(items);
        });
    });
};
exports.findAllJOINstation = function(req, res) {

    db.collection('join_station', function(err, collection) {
        collection.find().toArray(function(err, items) {		
            res.send(items);
        });
    });
};
// Make a JOIN with our two tables
exports.globalJOIN = function(req, res) {

    db.collection('join_bike', function(err, collection) {
        //collection.find({}, { data : { $elemMatch : { "data.stationID" : { $exists: true } }}}).toArray(function(err, items){
		collection.find({"data.stationID" : { $exists: true }}).toArray(function(err, items){
			res.send(items);
		});           
       
    });
	
	// db.collection("join_bike").aggregate([
		// {
		  // $lookup:
			// {
			  // from: "join_station",
			  // localField: "data.stationID",
			  // foreignField: "position",
			  // as: "stationCoord"
			// }
	   // }
	// ]).toArray(function(err, result){
		// console.log(result._id)
		// res.send(result)
	// });
};


/* END --- join the bike AND the station table */


exports.complexQuery = function(req, res){
	db.collection("report4").aggregate([
		{
		  $lookup:
			{
			  from: "stationCoord",
			  localField: "value",
			  foreignField: "nameStation",
			  as: "StationCoordinate"
			}
	   }
	]).toArray(function(err, result){
		res.send(result)
	});
};


exports.allWithStation = function(req, res) {
console.log("allWithStation -------------")
	// JOIN stationCoord and list :: need to keep the collection structure simple 
	db.collection("simpleList").aggregate([
		{
		  $lookup:
			{
			  from: "stationCoord",
			  localField: "name",
			  foreignField: "nameStation",
			  as: "StationCoordinate"
			}
	   }
	]).toArray(function(err, result){
		res.send(result)
	});
	
	
    // db.collection('report4', function(err, collection) {
		// collection.find().toArray(function(err, item){
			// console.log(item)	
			// res.send(item)			
		// })

		//collection.find().forEach(function(item){
			//console.log(item)
			//console.log( "user: " + item.value );
			
			// item.data.aggregate([
				// {
				  // $lookup:
					// {
					  // from: "stationCoord",
					  // localField: "name",
					  // foreignField: "nameStation",
					  // as: "StationCoordinate"
					// }
			   // }
			// ]).toArray(function(err, result){
				// res.send(result)
			// });
		//}).toArray(function(err, item){
			//res.send(item.value)
		//})

        // collection.find().toArray(function(err, items) {
			// console.log(items.length)
			// var ret = [];
			// for(var i = 0 ; i < items.length ; i ++ ){
				// items[i].aggregate([
					// {
					  // $lookup:
						// {
						  // from: "stationCoord",
						  // localField: "name",
						  // foreignField: "nameStation",
						  // as: "StationCoordinate"
						// }
				   // }
				// ]).toArray(function(err, result){
					// //ret.push(result)
					// res.send(result)
				// });
			// }
			// //res.send(ret);
            // //res.send(items[0].data);
        // });
    //});
};

exports.findStation = function(req, res){
	console.log("dlkjvdfkl")
	db.collection("stationCoord", function(err, collection){
		collection.find().toArray(function(err, items){
			res.send(items)
		});
	});
}

exports.addWine = function(req, res) {
    var wine = req.body;
    console.log('Adding wine: ' + JSON.stringify(wine));
    db.collection('report4', function(err, collection) {
        collection.insert(wine, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateWine = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    console.log('Updating wine: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('report4', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
    });
}

exports.deleteWine = function(req, res) {
    var id = req.params.id;
    console.log('Deleting wine: ' + id);
    db.collection('report4', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var wines = [
    {
        name: "CHATEAU DE SAINT COSME",
        year: "2009",
        grapes: "Grenache / Syrah",
        country: "France",
        region: "Southern Rhone",
        description: "The aromas of fruit and spice...",
        picture: "saint_cosme.jpg"
    },
    {
        name: "LAN RIOJA CRIANZA",
        year: "2006",
        grapes: "Tempranillo",
        country: "Spain",
        region: "Rioja",
        description: "A resurgence of interest in boutique vineyards...",
        picture: "lan_rioja.jpg"
    }];

    db.collection('report4', function(err, collection) {
        collection.insert(wines, {safe:true}, function(err, result) {});
    });

};