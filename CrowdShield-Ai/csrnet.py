"""
CrowdShield AI - CSRNet Density Estimation
VGG-16 frontend + dilated convolution backend.
"""

import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
import cv2


class CSRNet(nn.Module):
    def __init__(self):
        super(CSRNet, self).__init__()
        vgg = models.vgg16(weights=models.VGG16_Weights.DEFAULT)
        features = list(vgg.features.children())
        self.frontend = nn.Sequential(*features[:23])
        self.backend = nn.Sequential(
            nn.Conv2d(512, 512, 3, padding=2, dilation=2), nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, 3, padding=2, dilation=2), nn.ReLU(inplace=True),
            nn.Conv2d(512, 512, 3, padding=2, dilation=2), nn.ReLU(inplace=True),
            nn.Conv2d(512, 256, 3, padding=2, dilation=2), nn.ReLU(inplace=True),
            nn.Conv2d(256, 128, 3, padding=2, dilation=2), nn.ReLU(inplace=True),
            nn.Conv2d(128, 64,  3, padding=2, dilation=2), nn.ReLU(inplace=True),
        )
        self.output_layer = nn.Conv2d(64, 1, 1)

    def forward(self, x):
        x = self.frontend(x)
        x = self.backend(x)
        x = self.output_layer(x)
        return x


TRANSFORM = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225]),
])

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"


def load_model(weights_path: str = None) -> CSRNet:
    net = CSRNet().to(DEVICE)
    if weights_path:
        net.load_state_dict(torch.load(weights_path, map_location=DEVICE))
    net.eval()
    return net


def estimate_density(model: CSRNet, image_bgr):
    img_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(img_rgb)
    tensor = TRANSFORM(pil_img).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        density = model(tensor)

    density_np = density.squeeze().cpu().numpy()
    count = int(density_np.sum())
    return density_np, count


def overlay_density_map(frame, density_map):
    h, w = frame.shape[:2]
    heat = cv2.resize(density_map, (w, h))
    heat = cv2.normalize(heat, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
    heat_color = cv2.applyColorMap(heat, cv2.COLORMAP_JET)
    return cv2.addWeighted(frame, 0.6, heat_color, 0.4, 0)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="CSRNet Crowd Density Estimator")
    parser.add_argument("--image", required=True)
    parser.add_argument("--weights", default=None)
    args = parser.parse_args()

    net = load_model(args.weights)
    img = cv2.imread(args.image)
    if img is None:
        print("Could not read image.")
        exit(1)

    density_map, count = estimate_density(net, img)
    result = overlay_density_map(img, density_map)

    print(f"[CSRNet] Estimated crowd count: {count}")
    cv2.imshow("CSRNet Density Map", result)
    cv2.waitKey(0)
    cv2.destroyAllWindows()