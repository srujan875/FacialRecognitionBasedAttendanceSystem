import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred,{
    'databaseURL':"https://faceattendance-b4196-default-rtdb.firebaseio.com/"
})

ref = db.reference('Students')

data = {
    "16341576":{
        "name":"Srujan",
        "Major": "Computer Science",
        "Year": 2024,
        "mail":"srujan@umkc.edu"
    },
    "1259903":{
        "name": "Shreyan",
        "Major": "Computer Science",
        "Year": 2024,
        "mail": "shreyan@umkc.edu"
    },
    "123456": {
        "name": "Rohit",
        "Major": "Computer Science",
        "Year": 2024,
        "mail": "rohit@umkc.edu"
    },
    "1234":{
        "name":"admin",
        "mail":"admin@umkc.edu"
    }
}


for key,value in data.items():
    ref.child(key).set(value)