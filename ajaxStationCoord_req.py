from __future__ import division
import requests, sys, os, time
from pymongo import MongoClient

# stationCoord === db collection for station coordinate


#myobjectName = time.strftime("%Y-%m-%d %H:%M")


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


    # declar list array to store all oject
    container = []
    i = 0
    print list
    for i in list:

        # stoire single data as object
        data = {
            "nameStation" : i.get("name"),
            "position" : i.get("position"),
        }

        # add the current data object to the global list
        container.append(data)

    # asssign the whole list to the global dictionary

    print container
    # then insert the dict to the DB
    db.stationCoord.insert(container)

   # print curname

    print("file closed")


