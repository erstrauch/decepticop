"""
Demonstration of the GazeTracking library.
Check the README.md for complete documentation.
"""

import cv2
# import winsound
from gaze_tracking import GazeTracking

gaze = GazeTracking()
webcam = cv2.VideoCapture(0)
#overlay = cv2.imread('overlay2.png') 

def loop():
    continuous_detected = 0
    continuous_undetected = 0
    activity_threshold = 20
    pupils_lost = False
    blink_count = 0
    left_look_count = 0
    right_look_count = 0

    while True:
        # We get a new frame from the webcam
        _, frame = webcam.read()

        # We send this frame to GazeTracking to analyze it
        gaze.refresh(frame)

        frame = gaze.annotated_frame()
        text = ""

        if not(gaze.pupils_located):
            continuous_undetected += 1
            continuous_detected = 0
        elif gaze.pupils_located:
            continuous_detected += 1
            continuous_undetected = 0

        if continuous_detected > activity_threshold:
            continuous_detected = activity_threshold
        if continuous_undetected > activity_threshold:
            continuous_undetected = activity_threshold

        if continuous_detected == activity_threshold and pupils_lost:
            pupils_lost = False
        if continuous_undetected == activity_threshold and not(pupils_lost):
            pupils_lost = True
            # winsound.Beep(1500, 100)

        if pupils_lost:
            text = "Please position your head in the frame"
        else:
            text = ""
            if gaze.is_blinking():
                blink_count += 1
            if gaze.is_left():
                left_look_count += 1    
            if gaze.is_right():
                right_look_count +=1

        textsize = cv2.getTextSize(text, cv2.FONT_HERSHEY_DUPLEX, 1, 2)[0]
        multiplier = 1
        textX = (frame.shape[1] - textsize[0]) // (2 * multiplier)
        # textY = (frame.shape[0] + textsize[1]) // (2 * multiplier)

        # if gaze.is_blinking():
        #     text = "Blinking"
        # elif gaze.is_right():
        #     text = "Looking right"
        # elif gaze.is_left():
        #     text = "Looking left"
        # elif gaze.is_center():
        #     text = "Looking center"

        cv2.putText(frame, text, (textX, 30), cv2.FONT_HERSHEY_DUPLEX, multiplier, (244, 66, 66), 2)

        left_pupil = gaze.pupil_left_coords()
        right_pupil = gaze.pupil_right_coords()
        # cv2.putText(frame, "Left pupil:  " + str(left_pupil), (90, 130), cv2.FONT_HERSHEY_DUPLEX, 0.5, (147, 58, 31), 1)
        # cv2.putText(frame, "Right pupil: " + str(right_pupil), (90, 165), cv2.FONT_HERSHEY_DUPLEX, 0.5, (147, 58, 31), 1)

        # print("Overlay", overlay.shape, "Frame", frame.shape)
        # resized = cv2.resize(overlay, (frame.shape[1], frame.shape[0]))
        # print("Resized", resized.shape, "Frame", frame.shape)
        # cv2.add(overlay, frame)
        cv2.imshow("Demo", frame)

        if cv2.waitKey(1) == 27:
            break

def once():
    _, frame = webcam.read()

    # We send this frame to GazeTracking to analyze it
    gaze.refresh(frame)

    frame = gaze.annotated_frame()
    text = ""

    print(gaze)
    return gaze

# result = once()
loop()