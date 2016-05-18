from __future__ import division
import requests, sys, os, time
from pymongo import MongoClient


# GET DATA FOR BIKES STATION - NEED TO BE RUN JUST ONCE

myobjectName = time.strftime("%Y-%m-%d %H:%M")

r = requests.get('https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=cd68da53009a674d943220ef0a67623682aa00ce')

print len(r.json())

print r.status_code

client = MongoClient()

db = client.bikes1

if r.status_code == 200:

    list = r.json()

    path = r"C:\Users\gader\Documents\__projects\PythonClass\exportBike\exp_dublinBike_1_{}.csv".format(time.time())

    pathTrue = os.path.exists(path)


    # declar list array to store all oject
    container = []
    i = 0
    # empty collection if existe already
    db.join_station.drop()

    for i in list:

        # stoire single data as object
        station = {
            "nameStation" : i.get("name"),
            "position" : i.get("position")
        }

        res = db.join_station.insert_one(station)



print "station collection done"


