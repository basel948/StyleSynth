import cv2
import torch
import torchvision.transforms as transforms
import sys
import json

# Define the 5 face shape labels.
face_shape_labels = ["Oval", "Round", "Square", "Heart", "Diamond"]

# Load the model.
model = torch.load("model_85_nn_.pth", map_location=torch.device("cpu"))
model.eval()

# Define preprocessing.
preprocess = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((380, 380)),  # Adjust size if needed
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

if len(sys.argv) < 2:
    print(json.dumps({"error": "No file provided"}))
    sys.exit(1)

filepath = sys.argv[1]
image = cv2.imread(filepath)
if image is None:
    print(json.dumps({"error": f"Could not load image: {filepath}"}))
    sys.exit(1)

# Convert image and preprocess.
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
input_tensor = preprocess(image_rgb)
input_tensor = input_tensor.unsqueeze(0)  # Add batch dimension

with torch.no_grad():
    outputs = model(input_tensor)
    probabilities = torch.softmax(outputs, dim=1)[0]  # for one sample
    result_dict = {label: round(prob.item() * 100, 2) for label, prob in zip(face_shape_labels, probabilities)}

# Print result as valid JSON.
print(json.dumps(result_dict))
