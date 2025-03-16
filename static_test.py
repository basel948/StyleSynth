import cv2
import sys
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

# Check if user provided image paths
if len(sys.argv) < 2:
    print("Usage: python static_test.py image1.jpg image2.jpg ...")
    sys.exit(1)

# Process each image provided as an argument
for image_path in sys.argv[1:]:
    image = cv2.imread(image_path)
    if image is None:
        print(f"Could not load image: {image_path}")
        continue

    # Convert the image to RGB as expected by the model
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    
    # Preprocess the image
    input_tensor = preprocess(image_rgb)
    input_tensor = input_tensor.unsqueeze(0)  # Add batch dimension

    # Perform inference
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.softmax(outputs, dim=1)
        confidence, predicted_idx = torch.max(probabilities, dim=1)
        predicted_label = face_shape_labels[predicted_idx.item()]

    # Log the result in the terminal
    print(f"Image: {image_path} -> Predicted Face Shape: {predicted_label} (Confidence: {confidence.item():.2f})")
