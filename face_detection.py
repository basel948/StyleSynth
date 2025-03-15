import cv2
import mediapipe as mp

# 1. Initialize MediaPipe face detection
mp_face_detection = mp.solutions.face_detection
mp_drawing = mp.solutions.drawing_utils

face_detection = mp_face_detection.FaceDetection(model_selection=0, min_detection_confidence=0.5)

# 2. Start webcam capture
cap = cv2.VideoCapture(0)

while True:
    success, frame = cap.read()
    if not success:
        break  # End if no frame captured

    # Convert the BGR image to RGB for MediaPipe
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # 3. Process the frame with MediaPipe
    results = face_detection.process(frame_rgb)

    # 4. If faces are found, draw bounding boxes or keypoints
    if results.detections:
        for detection in results.detections:
            # Draw bounding box and key points on the frame
            mp_drawing.draw_detection(frame, detection)

    # 5. Display the resulting frame
    cv2.imshow('AI Hairstylist - Face Detection', frame)

    # Press 'q' to exit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Cleanup
cap.release()
cv2.destroyAllWindows()
