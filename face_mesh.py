import cv2
from transformers import AutoFeatureExtractor, AutoModelForImageClassification, pipeline

# Load the pre-trained face shape classification model from Hugging Face
feature_extractor = AutoFeatureExtractor.from_pretrained("fahd9999/face_shape_classification")
model = AutoModelForImageClassification.from_pretrained("fahd9999/face_shape_classification")
classifier = pipeline("image-classification", model=model, feature_extractor=feature_extractor)

cap = cv2.VideoCapture(0)

while True:
    success, frame = cap.read()
    if not success:
        break

    # Convert the frame from BGR to RGB
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    # Optionally, you might crop the face region if needed
    # For now, we'll use the whole frame
    result = classifier(frame_rgb)
    face_shape = result[0]['label']  # Get the highest probability label
    
    # Overlay the predicted face shape on the frame
    cv2.putText(frame, f"Shape: {face_shape}", (30, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2)
    
    cv2.imshow('Face Shape Classification', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
