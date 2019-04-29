#! C:\Python27\python.exe
"""
Demonstration of the GazeTracking library.
Check the README.md for complete documentation.
"""

import cv2
import os
import time
import winsound
from gaze_tracking import GazeTracking

#
# Video capture functions
#

# Set resolution for the video capture
# Function adapted from https://kirr.co/0l6qmh
def change_res(cap, width, height):
    cap.set(3, width)
    cap.set(4, height)

# Standard Video Dimensions Sizes
STD_DIMENSIONS =  {
    "480p": (640, 480),
    "720p": (1280, 720),
    "1080p": (1920, 1080),
    "4k": (3840, 2160),
}


# grab resolution dimensions and set video capture to it.
def get_dims(cap, res='1080p'):
    width, height = STD_DIMENSIONS["480p"]
    if res in STD_DIMENSIONS:
        width,height = STD_DIMENSIONS[res]
    ## change the current caputre device
    ## to the resulting resolution
    change_res(cap, width, height)
    return width, height

# Video Encoding, might require additional installs
# Types of Codes: http://www.fourcc.org/codecs.php
VIDEO_TYPE = {
    'avi': cv2.VideoWriter_fourcc(*'XVID'),
    #'mp4': cv2.VideoWriter_fourcc(*'H264'),
    'mp4': cv2.VideoWriter_fourcc(*'XVID'),
}

def get_video_type(filename):
    filename, ext = os.path.splitext(filename)
    if ext in VIDEO_TYPE:
      return  VIDEO_TYPE[ext]
    return VIDEO_TYPE['avi']

#
# Gaze tracking code
#

gaze = GazeTracking()
webcam = cv2.VideoCapture(0)
filename = 'video.avi'
frames_per_second = 10
res = '480p'
out = cv2.VideoWriter(filename, get_video_type(filename), frames_per_second+1, get_dims(webcam, res))
#overlay = cv2.imread('overlay2.png') 

pupils_lost = False
activity_threshold = 20
continuous_detected = 0
continuous_undetected = 0
blink_count = 0
left_look_count = 0
right_look_count = 0
frame_count = 0
fps = 0
origin_time = time.clock()
origin_frame_count = 0
start = time.time()
text = ""
data_filename = "data_out.csv"

with open(data_filename, 'a+') as f:
    f.write(time.ctime()+"\n\n")
    while webcam.isOpened():
        # We get a new frame from the webcam
        _, frame = webcam.read()
        # key = cv2.waitKey(int((1/int(fps))*1000))
        key = cv2.waitKey(10)
        frame_count += 1
        origin_frame_count += 1
        
        if time.time() - start > 2:
            end = time.time()
            fps = frame_count // (end - start)
            start = time.time()
            frame_count = 0
            print(fps)

        # We send this frame to GazeTracking to analyze it
        gaze.refresh(frame)

        textsize = cv2.getTextSize(text, cv2.FONT_HERSHEY_DUPLEX, 1, 2)[0]
        multiplier = 1
        textX = (frame.shape[1] - textsize[0]) // (2 * multiplier)

        cv2.putText(frame, text, (textX, 30), cv2.FONT_HERSHEY_DUPLEX, multiplier, (244, 66, 66), 2)
        cv2.imshow("Recording", frame)

        frame = gaze.annotated_frame()

        if not(gaze.pupils_located):
            continuous_undetected += 1
            continuous_detected = 0
        elif gaze.pupils_located:
            continuous_detected += 1
            continuous_undetected = 0

        if continuous_detected > activity_threshold / 2:
            continuous_detected = activity_threshold
        if continuous_undetected > activity_threshold:
            continuous_undetected = activity_threshold

        if continuous_detected == activity_threshold and pupils_lost:
            pupils_lost = False
        if continuous_undetected == activity_threshold and not(pupils_lost):
            pupils_lost = True
            winsound.Beep(1500, 100)
            winsound.Beep(1500, 100)

        if gaze.eye_left == None or gaze.eye_right == None:
            face_lost = True
        else:
            face_lost = False

        if pupils_lost and face_lost:
            text = "Please position your head in the frame"
        elif pupils_lost:
            text = "Please keep eyes and visible and open"
        else:
            text = ""
            if gaze.is_blinking():
                blink_count += 1
            if gaze.is_left():
                left_look_count += 1    
            if gaze.is_right():
                right_look_count +=1
        left_pupil_loc = gaze.pupil_left_coords()
        right_pupil_loc = gaze.pupil_right_coords()

        data = [time.ctime(), origin_frame_count, time.clock(), not(face_lost), gaze.pupils_located, fps, left_pupil_loc, right_pupil_loc, gaze.is_blinking(), blink_count, left_look_count, right_look_count]
        # cv2.putText(frame, "Left pupil:  " + str(left_pupil_loc), (90, 130), cv2.FONT_HERSHEY_DUPLEX, 0.5, (147, 58, 31), 1)
        # cv2.putText(frame, "Right pupil: " + str(right_pupil_loc), (90, 165), cv2.FONT_HERSHEY_DUPLEX, 0.5, (147, 58, 31), 1)

        # print("Overlay", overlay.shape, "Frame", frame.shape)
        # resized = cv2.resize(overlay, (frame.shape[1], frame.shape[0]))
        # print("Resized", resized.shape, "Frame", frame.shape)
        # cv2.add(overlay, frame)
        out.write(frame)
        f.write(','.join([str(x) for x in data])+"\n")

        if cv2.waitKey(1) == 27:
            break

webcam.release()
out.release()
cv2.destroyAllWindows()