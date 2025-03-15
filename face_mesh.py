import cv2
import mediapipe as mp

# Initialize MediaPipe Face Mesh and Drawing modules
mp_face_mesh = mp.solutions.face_mesh
mp_drawing = mp.solutions.drawing_utils

face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=False,
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)

# Define key landmark indices for face shape analysis
KEY_INDICES = {
    "Chin": 152,
    "Left Jaw": 234,
    "Right Jaw": 454,
    "Left Cheek": 93,
    "Right Cheek": 323,
    "Forehead": 10
}

cap = cv2.VideoCapture(0)

while True:
    success, frame = cap.read()
    if not success:
        break

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(frame_rgb)

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            # Draw the complete face mesh
            mp_drawing.draw_landmarks(
                image=frame,
                landmark_list=face_landmarks,
                connections=mp_face_mesh.FACEMESH_TESSELATION,
                landmark_drawing_spec=None,
                connection_drawing_spec=mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=1, circle_radius=1)
            )
            
            # Annotate key landmarks
            h, w, _ = frame.shape
            for label, index in KEY_INDICES.items():
                landmark = face_landmarks.landmark[index]
                x, y = int(landmark.x * w), int(landmark.y * h)
                cv2.circle(frame, (x, y), 3, (0, 0, 255), -1)  # mark the point in red
                cv2.putText(frame, label, (x - 20, y - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)
                
    cv2.imshow('MediaPipe Face Mesh with Key Landmarks', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
