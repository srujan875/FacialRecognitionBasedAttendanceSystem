import cv2
import face_recognition
import os
import pickle
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage

cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': "https://faceattendance-b4196-default-rtdb.firebaseio.com/",
    'storageBucket': 'faceattendance-b4196.appspot.com'
})

bucket = storage.bucket()


# Function to download image from Firebase Storage
def download_image(image_name):
    blob = bucket.blob(image_name)
    # Construct the local image path
    local_image_path = os.path.join("Images", os.path.basename(image_name))
    # Create the directory if it doesn't exist
    os.makedirs(os.path.dirname(local_image_path), exist_ok=True)
    # Download the image to a local file
    blob.download_to_filename(local_image_path)
    # Read the image using OpenCV
    img = cv2.imread(local_image_path)
    return img


# Fetch images from Firebase Storage
def fetch_images_from_storage():
    img_list = []
    student_ids = []
    # List all files in Firebase Storage folder
    blobs = bucket.list_blobs()
    for blob in blobs:
        # Extract student ID from the image name
        student_id = os.path.splitext(os.path.basename(blob.name))[0]
        student_ids.append(student_id)
        # Download the image and append it to the list
        img = download_image(blob.name)
        img_list.append(img)
    return img_list, student_ids


# Encode faces in the images
def find_encodings(images_list):
    encode_list = []
    for img in images_list:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        encode = face_recognition.face_encodings(img)[0]
        encode_list.append(encode)
    return encode_list


print("Fetching images from Firebase Storage...")
img_list, student_ids = fetch_images_from_storage()
print("Encoding faces...")
encode_list_known = find_encodings(img_list)

# Combine encodings with student IDs
encode_list_known_with_ids = [encode_list_known, student_ids]

# Save the encoding to a file
with open("EncodeFile.p", 'wb') as file:
    pickle.dump(encode_list_known_with_ids, file)

print("Encoding complete. File saved as EncodeFile.p")
