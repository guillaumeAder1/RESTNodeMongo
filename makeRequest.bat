REM execute a simplebike.py BUT need to strat mongo AND node.js first
start mongod.exe
start mongo.exe
python simpleBike.py
tskill mongod
tskill mongo
Exit 0