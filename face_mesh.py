import cv2
import mediapipe as mp
import math

def euclidean_distance(point1, point2):
    """
    Calculate the Euclidean distance between two (x, y) points.
    """
    return math.sqrt((point2[0] - point1[0])**2 + (point2[1] - point1[1])**2)

def classify_face_shape(jaw_width, face_length, cheek_width):
    """
    Rough rule-based classifier for 7 face shapes:
    oval, round, square, diamond, heart, pear, and oblong.
    
    - length_to_jaw_ratio = face_length / jaw_width
    - ratio_jaw_cheek = jaw_width / cheek_width
    
    Adjust thresholds as needed based on testing.
    """
    if jaw_width == 0 or cheek_width == 0:
        return "Undefined"
    
    length_to_jaw_ratio = face_length / jaw_width
    ratio_jaw_cheek = jaw_width / cheek_width  # close to 1 means similar widths

    # Obvious elongated face
    if length_to_jaw_ratio > 1.3:
        return "Oblong"
    
    # Round: nearly equal face length and width, and similar jaw and cheek widths
    if 0.95 <= length_to_jaw_ratio <= 1.1 and abs(ratio_jaw_cheek - 1.0) < 0.05:
        return "Round"
    
    # Square: similar jaw and cheek widths and moderate length
    if abs(ratio_jaw_cheek - 1.0) < 0.05 and length_to_jaw_ratio <= 1.25:
        return "Square"
    
    # If jaw is noticeably narrower than the cheek (cheekbones more prominent)
    if ratio_jaw_cheek < 0.95:
        # Heart shape often has a wider upper face with a narrow jaw
        if length_to_jaw_ratio < 1.15:
            return "Heart"
        else:
            return "Diamond"
    
    # If jaw is noticeably wider than the cheek
    if ratio_jaw_cheek > 1.05:
        return "Pear"
    
    # Otherwise, default to oval
    return "Oval"

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
            h, w, _ = frame.shape

            def landmark_to_point(landmark_index):
                lm = face_landmarks.landmark[landmark_index]
                return (int(lm.x * w), int(lm.y * h))
            
            chin_pt = landmark_to_point(KEY_INDICES["Chin"])
            left_jaw_pt = landmark_to_point(KEY_INDICES["Left Jaw"])
            right_jaw_pt = landmark_to_point(KEY_INDICES["Right Jaw"])
            left_cheek_pt = landmark_to_point(KEY_INDICES["Left Cheek"])
            right_cheek_pt = landmark_to_point(KEY_INDICES["Right Cheek"])
            forehead_pt = landmark_to_point(KEY_INDICES["Forehead"])
            
            # Calculate distances
            jaw_width = euclidean_distance(left_jaw_pt, right_jaw_pt)
            face_length = euclidean_distance(forehead_pt, chin_pt)
            cheek_width = euclidean_distance(left_cheek_pt, right_cheek_pt)
            
            # Print debugging info
            if jaw_width != 0 and cheek_width != 0:
                length_to_jaw_ratio = face_length / jaw_width
                print(f"Jaw Width: {jaw_width:.2f}, Face Length: {face_length:.2f}, Cheek Width: {cheek_width:.2f}")
                print(f"Length/Jaw Ratio: {length_to_jaw_ratio:.2f}")
            
            # Classify face shape based on computed distances
            face_shape = classify_face_shape(jaw_width, face_length, cheek_width)
            
            # Draw lines for visualization
            cv2.line(frame, forehead_pt, chin_pt, (255, 0, 0), 2)
            cv2.line(frame, left_jaw_pt, right_jaw_pt, (255, 0, 0), 2)
            
            # Overlay the face shape label on the frame
            cv2.putText(frame, f"Shape: {face_shape}", (30, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)

    cv2.imshow('MediaPipe Face Mesh with Face Shape Classification', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
