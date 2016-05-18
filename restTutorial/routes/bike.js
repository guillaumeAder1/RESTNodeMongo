var mongo = require('mongodb');

var mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/bikes1")


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

exports.getSimpleBike = function(req, res) {

    db.collection('simpleBike', function(err, collection) {
        collection.find().toArray(function(err, items) {		
            res.send(items);
        });
    });
};


exports.findStation = function(req, res){
	
	db.collection("stationCoord", function(err, collection){
		collection.find().toArray(function(err, items){
			res.send(items)
		});
	});
}

exports.addBike = function(req, res) {
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


