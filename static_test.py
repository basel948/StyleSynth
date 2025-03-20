import cv2
import torch
import torchvision.transforms as transforms
import sys
import json

face_shape_labels = ["Oval", "Round", "Square", "Heart", "Diamond"]

model = torch.load("model_85_nn_.pth", map_location=torch.device("cpu"))
model.eval()

preprocess = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((380, 380)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

if len(sys.argv) < 2:
    print(json.dumps({"error": "Usage: python static_test.py image1.jpg"}))
    sys.exit(1)

filepath = sys.argv[1]
image = cv2.imread(filepath)
if image is None:
    print(json.dumps({"error": f"Could not load image: {filepath}"}))
    sys.exit(1)

image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
input_tensor = preprocess(image_rgb)
input_tensor = input_tensor.unsqueeze(0)

with torch.no_grad():
    outputs = model(input_tensor)
    probabilities = torch.softmax(outputs, dim=1)[0]
    result_dict = {label: round(prob.item() * 100, 2) for label, prob in zip(face_shape_labels, probabilities)}

print(json.dumps(result_dict))
