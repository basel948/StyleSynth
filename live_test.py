import cv2
import torch
import torchvision.transforms as transforms

# Define the class labels (adjust if your model was trained on different names)
face_shape_labels = ["Oval", "Round", "Square", "Heart", "Diamond"]

# Load the full model directly from the file
model = torch.load("model_85_nn_.pth", map_location=torch.device("cpu"))
model.eval()

# Define preprocessing transform for the input image
preprocess = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((380, 380)),  # Adjust size if needed based on training
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],  # ImageNet means
                         std=[0.229, 0.224, 0.225])
])

# --- Option 2: Live Webcam Testing ---
cap = cv2.VideoCapture(0)
captured_frame = None

while True:
    ret, frame = cap.read()
    if not ret:
        continue

    cv2.imshow("Live Webcam - Press 'q' to capture", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        captured_frame = frame.copy()  # Capture the current frame
        break

cap.release()
cv2.destroyAllWindows()

if captured_frame is not None:
    # Convert captured frame to RGB and preprocess
    frame_rgb = cv2.cvtColor(captured_frame, cv2.COLOR_BGR2RGB)
    input_tensor = preprocess(frame_rgb)
    input_tensor = input_tensor.unsqueeze(0)  # Add batch dimension

    # Perform inference
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.softmax(outputs, dim=1)
        confidence, predicted_idx = torch.max(probabilities, dim=1)
        predicted_label = face_shape_labels[predicted_idx.item()]

    print("Final Classified Face Shape:", predicted_label, f"(Confidence: {confidence.item():.2f})")
else:
    print("No frame captured.")
