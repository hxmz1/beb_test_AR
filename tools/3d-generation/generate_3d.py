import os
import numpy as np
from PIL import Image
import torch
import torchvision.transforms as transforms
import trimesh
import cv2

# Paths
INPUT_IMAGE_PATH = "public/images/menu/tacos.png"
OUTPUT_GLB_PATH = "public/models/tacos.glb"

# Ensure output directory exists
os.makedirs(os.path.dirname(OUTPUT_GLB_PATH), exist_ok=True)

# Load MiDaS model from local clone
MIDAS_PATH = os.path.join("tools", "3d-generation", "MiDaS")
if not os.path.exists(MIDAS_PATH):
    raise Exception(f"MiDaS repository not found at {MIDAS_PATH}. Please clone it.")

# Add the MiDaS path to sys.path so we can import its modules
import sys
sys.path.append(MIDAS_PATH)

from midas.midas_net import MidasNet
from midas.transforms import Resize, NormalizeImage, PrepareForNet

def load_midas_model():
    """Load the MiDaS model for depth estimation."""
    model_path = os.path.join(MIDAS_PATH, "weights", "midas_v21_384.pt")
    if not os.path.exists(model_path):
        raise Exception(f"MiDaS weights not found at {model_path}. Please download the weights.")
    model = MidasNet(model_path, non_negative=True)
    model.eval()
    return model

def estimate_depth(model, image):
    """Estimate depth from an image using MiDaS."""
    # Prepare image for MiDaS using the default transform from the repo
    transform = transforms.Compose([
        lambda img: {"image": img / 255.0},
        Resize(
            384,
            384,
            resize_target=None,
            keep_aspect_ratio=True,
            ensure_multiple_of=32,
            resize_method="upper_bound",
            image_interpolation_method=cv2.INTER_CUBIC,
        ),
        NormalizeImage(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        PrepareForNet(),
        lambda sample: torch.from_numpy(sample["image"]).unsqueeze(0),
    ])
    
    # Convert PIL image to numpy array
    img = np.array(image)
    # Transform
    img_input = transform({"image": img})["image"]
    
    # Predict
    with torch.no_grad():
        depth = model(img_input)
        depth = depth.squeeze().cpu().numpy()
    
    return depth

def create_mesh_from_depth(depth_map, texture_image):
    """Create a textured mesh from depth map and texture image."""
    h, w = depth_map.shape
    
    # Normalize depth to a reasonable range (0 to 1) and then scale
    # We'll scale depth to [-1, 1] for simplicity
    depth_normalized = (depth_map - depth_map.min()) / (depth_map.max() - depth_map.min() + 1e-8)
    depth_scaled = depth_normalized * 2.0 - 1.0  # Now in [-1, 1]
    
    # Create vertices: we'll use a grid where x and y are normalized to [-1, 1]
    # and z is the depth value.
    # We'll also scale the x and y by the aspect ratio to avoid stretching.
    aspect = w / h
    x = np.linspace(-1, 1, w)
    y = np.linspace(-1, 1, h)
    xv, yv = np.meshgrid(x, y)
    
    vertices = np.stack([xv, yv, depth_scaled], axis=-1).reshape(-1, 3)
    
    # Create faces (triangles) for a grid
    faces = []
    for i in range(h - 1):
        for j in range(w - 1):
            # Top-left vertex index
            idx = i * w + j
            # Two triangles per cell
            faces.append([idx, idx + 1, idx + w])          # Triangle 1
            faces.append([idx + 1, idx + w + 1, idx + w])  # Triangle 2
    faces = np.array(faces)
    
    # Texture coordinates (UV) from the image
    # We'll map the entire image to the mesh, so UV from 0 to 1
    u = np.linspace(0, 1, w)
    v = np.linspace(0, 1, h)
    uv = np.array(np.meshgrid(u, v)).T.reshape(-1, 2)
    
    # Create trimesh mesh
    mesh = trimesh.Trimesh(vertices=vertices, faces=faces)
    
    # Assign UVs and texture to the mesh's visual
    # Convert texture image to numpy array
    texture_array = np.array(texture_image)
    # Create a material with the texture
    from trimesh.visual import textureUVs
    mesh.visual = textureUVs(uv=uv, image=Image.fromarray(texture_array))
    
    return mesh

def main():
    print("Loading MiDaS model...")
    model = load_midas_model()
    
    print(f"Loading image from {INPUT_IMAGE_PATH}")
    image_pil = Image.open(INPUT_IMAGE_PATH).convert("RGB")
    
    print("Estimating depth...")
    depth = estimate_depth(model, image_pil)
    
    print("Creating mesh...")
    mesh = create_mesh_from_depth(depth, image_pil)
    
    print(f"Saving GLB to {OUTPUT_GLB_PATH}")
    mesh.export(OUTPUT_GLB_PATH)
    
    print("Done!")

if __name__ == "__main__":
    main()
