
#
import os
import pickle
import numpy as np
import cv2
import time
import face_recognition
import cvzone
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import storage
import numpy as np
from datetime import datetime
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db
from firebase_admin import storage

# Establishing firebase connection

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred,{
    'databaseURL':"https://faceattendance-b4196-default-rtdb.firebaseio.com/",
    'storageBucket':'faceattendance-b4196.appspot.com'
})

# Loading the storage bucket
bucket = storage.bucket()

cap = cv2.VideoCapture(1)
cap.set(3, 640)
cap.set(4, 480)

# Generating the encode file
os.system("python3 encode.py")

# Loading  the encoding file
print("Loading Encode File ...")
file = open('EncodeFile.p', 'rb')
encodeListKnownWithIds = pickle.load(file)
file.close()
encodeListKnown, studentIds = encodeListKnownWithIds
# print(studentIds)
print("Encode File Loaded")

modeType = 0
counter = 0
id = -1
imgStudent = []

# Main loop
last_attendance_check_time = time.time()  # Initialize last attendance check time
while True:
    success, img = cap.read()

    imgS = cv2.resize(img, (0, 0), None, 0.25, 0.25)
    imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)

    faceCurFrame = face_recognition.face_locations(imgS)
    encodeCurFrame = face_recognition.face_encodings(imgS, faceCurFrame)

    # imgBackground[162:162 + 480, 55:55 + 640] = img

    if faceCurFrame:
        face_found = False  # Flag to track if a face is found in the current frame
        for encodeFace, faceLoc in zip(encodeCurFrame, faceCurFrame):
            matches = face_recognition.compare_faces(encodeListKnown, encodeFace)
            faceDis = face_recognition.face_distance(encodeListKnown, encodeFace)

            matchIndex = np.argmin(faceDis)

            if matches[matchIndex] and faceDis[matchIndex] < 0.6:  # Adjust the threshold as needed
                face_found = True
                y1, x2, y2, x1 = faceLoc
                y1, x2, y2, x1 = y1 * 4, x2 * 4, y2 * 4, x1 * 4
                bbox = 55 + x1, 162 + y1, x2 - x1, y2 - x1
                center_x = (x1 + x2) // 2
                center_y = y2
                # imgBackground = cvzone.cornerRect(imgBackground, bbox, rt=0)
                id = studentIds[matchIndex]
                if counter == 0:
                    counter = 1
                event_id = "1224"
                if counter != 0:
                    if counter == 1:
                        student_info = db.reference(f'Students/{id}').get()
                        student_registered = db.reference(f'Registrations/{event_id}/{id}').get()
                        print('printing 3')
                        print(student_registered)
                        if student_registered:
                            student_name = student_info.get("name", "")
                            student_major = student_info.get("Major", "")
                            current_date = datetime.now().strftime("%Y-%m-%d")
                            attendance_ref = db.reference(f'Attendance/{event_id}')
                            existing_attendance = attendance_ref.get()
                            if existing_attendance is None or id not in existing_attendance:
                                attendance_ref.update({id: student_name})
                                print(f"Attendance recorded for student {id}: {student_name}")
                            else:
                                print(f"Attendance already recorded for student {id} for event {event_id} on {current_date}")
                            cv2.putText(img, "Attendance already recorded for "+str({id}).strip('{}'), (center_x, center_y),
                                        cv2.FONT_HERSHEY_COMPLEX, 0.5, (255, 255, 255), 1)

                        else:
                            print(f"Student with ID {id} not registered for the event")
                            cv2.putText(img, "Student not registered for event", (50, 50), cv2.FONT_HERSHEY_COMPLEX,
                                        0.5, (0, 0, 255), 1)

                        # Display student's name and major

        if not face_found:
            cv2.putText(img, "Student face not registered", (50, 50), cv2.FONT_HERSHEY_COMPLEX, 0.5, (0, 0, 255), 1)

    # Display attendance status every 5 seconds
    if time.time() - last_attendance_check_time >= 5:
        if counter != 0:
            if student_info:
                student_name = student_info.get("name", "")
                student_major = student_info.get("Major", "")
                current_date = datetime.now().strftime("%Y-%m-%d")
                event_id = "event1"

                attendance_ref = db.reference(f'Attendance/{current_date}/{event_id}')
                existing_attendance = attendance_ref.get()
                if existing_attendance is None or id not in existing_attendance:
                    cv2.putText(img, "Attendance recorded", (10, 30), cv2.FONT_HERSHEY_COMPLEX, 0.5,
                                (0, 255, 0), 1)
                else:
                    cv2.putText(img, "Attendance already recorded", (10, 30), cv2.FONT_HERSHEY_COMPLEX, 0.5,
                                (0, 0, 255), 1)
        last_attendance_check_time = time.time()  # Update last attendance check time

    cv2.imshow("Face Attendance", img)
    cv2.waitKey(1)


