from __future__ import division
import requests, sys, os, time
from pymongo import MongoClient


myobjectName = time.strftime("%Y-%m-%d %H:%M")


r = requests.get('https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=cd68da53009a674d943220ef0a67623682aa00ce')

print len(r.json())

print r.status_code

client = MongoClient()

db = client.bikes1

# use to empty the table
#db.report4.drop()

#db.acteurs.insert({"address" : "5 rue deodeodjo", "name" : "dkhfjdklsjfls"})

print db
if r.status_code == 200:

    list = r.json()

    path = r"C:\Users\gader\Documents\__projects\PythonClass\exportBike\exp_dublinBike_1_{}.csv".format(time.time())

    pathTrue = os.path.exists(path)

    if not pathTrue:
        file1 = open(path, "w")
        file1.write("NAME, bike_stands_total, available_bike_stands, available_bikes, bike_occupancy_ratio");
        print("file open")

    # declar list array to store all oject
    container = []
    i = 0
    for i in list:
        occupBike = i.get("available_bikes") / i.get("bike_stands");
        file1.write("\n{},{},{},{}, {}".format(i.get("name"), i.get("bike_stands"), i.get("available_bike_stands"), i.get("available_bikes"), occupBike ))
        #db.report1.insert("\n{},{},{},{}, {}".format(i.get("name"), i.get("bike_stands"), i.get("available_bike_stands"), i.get("available_bikes"), occupBike ))

        # stoire single data as object


        station = {
            "nameStation" : i.get("name"),
            "position" : i.get("position")
        }

        res = db.join_station.insert_one(station)
        print res.inserted_id

        data = {
            "name" : i.get("name"),
            "bike-stand-total" : i.get("bike_stands"),
            "available-bikes" : i.get("available_bikes"),
            "available-stands" : i.get("available_bike_stands"),
            "ratio-bikes-available" : occupBike,
            "stationID" : res.inserted_id
        }
        #print db.join_station.findOne({"nameStation" : i.get("name") })

        # add the current data object to the global list
        container.append(data)

    # asssign the whole list to the global dictionary
    finalRes = {'value': myobjectName, 'data' : container}
    print finalRes
    # then insert the dict to the DB
    db.join_bike.insert(finalRes)


   # print curname
    file1.close()
    print("file closed")


