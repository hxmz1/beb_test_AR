import os
import numpy as np
from PIL import Image
import trimesh

# Paths
INPUT_IMAGE_PATH = "../../public/images/menu/tacos.png"
OUTPUT_GLB_PATH = "../../../public/models/tacos_cuboid.glb"

# Ensure output directory exists
os.makedirs(os.path.dirname(OUTPUT_GLB_PATH), exist_ok=True)

def create_textured_cuboid(image_path, width=2.0, height=None, depth=0.1):
    """Create a cuboid mesh with the given image texture on the front face.
    
    Args:
        image_path: path to the texture image
        width: width of the cuboid (x-axis)
        height: height of the cuboid (y-axis). If None, scaled to match image aspect.
        depth: depth of the cuboid (z-axis) - thickness
    """
    # Load image to get aspect ratio
    img = Image.open(image_path)
    img_width, img_height = img.size
    if height is None:
        height = width * (img_height / img_width)
    
    # Define vertices for a cuboid centered at origin
    # We'll create 8 vertices
    #   x: -width/2 to width/2
    #   y: -height/2 to height/2
    #   z: -depth/2 to depth/2
    x = width / 2
    y = height / 2
    z = depth / 2
    
    vertices = np.array([
        [-x, -y, -z],  # 0
        [ x, -y, -z],  # 1
        [ x,  y, -z],  # 2
        [-x,  y, -z],  # 3
        [-x, -y,  z],  # 4
        [ x, -y,  z],  # 5
        [ x,  y,  z],  # 6
        [-x,  y,  z],  # 7
    ])
    
    # Define faces (triangles) for the cuboid
    # Each face is two triangles
    faces = np.array([
        # front face (z = -z)
        [0, 1, 2], [0, 2, 3],
        # back face (z = z)
        [4, 6, 5], [4, 7, 6],
        # left face (x = -x)
        [0, 3, 7], [0, 7, 4],
        # right face (x = x)
        [1, 5, 6], [1, 6, 2],
        # top face (y = y)
        [3, 2, 6], [3, 6, 7],
        # bottom face (y = -y)
        [0, 4, 5], [0, 5, 1],
    ])
    
    # Create mesh
    mesh = trimesh.Trimesh(vertices=vertices, faces=faces)
    
    # UV mapping: we need to map the image to the front face only.
    # We'll create a texture that covers the entire cuboid, but we only care about the front.
    # For simplicity, we'll assign UVs such that the front face gets the full image,
    # and other faces get a solid color (we'll use a default color).
    
    # We'll create a material with a base color texture and set the UVs accordingly.
    # However, trimesh's visual system is per-vertex or per-face? We'll use TextureUVs.
    
    # We need to assign UV coordinates to each vertex such that the front face is correctly mapped.
    # Let's define UVs for each vertex.
    # We'll define the UV range [0,1] for the image.
    # For the front face (vertices 0,1,2,3), we want to map the image.
    # We'll set:
    #   vertex 0: (0, 1)  # bottom-left
    #   vertex 1: (1, 1)  # bottom-right
    #   vertex 2: (1, 0)  # top-right
    #   vertex 3: (0, 0)  # top-left
    # For the other vertices, we can set arbitrary UVs, but we need to avoid seams.
    # We'll set them to (0,0) for simplicity, but they will not be visible if we only texture the front.
    # Alternatively, we can create a texture that is atlased for all faces, but that's complex.
    
    # We'll create a UV array for each vertex.
    uvs = np.zeros((len(vertices), 2))
    # Front face
    uvs[0] = [0.0, 1.0]  # bottom-left
    uvs[1] = [1.0, 1.0]  # bottom-right
    uvs[2] = [1.0, 0.0]  # top-right
    uvs[3] = [0.0, 0.0]  # top-left
    # Other faces: we'll set to (0,0) but note that this may cause texture stretching.
    # For a better result, we could assign each face its own texture region, but we skip for now.
    
    # Now we need to assign the texture to the mesh.
    # We'll create a material and assign the UVs.
    from trimesh.visual import TextureVisuals
    
    # Create a TextureUVs visual
    mesh.visual = TextureVisuals(uv=uvs, image=img)
    
    return mesh

def main():
    print("Creating textured cuboid...")
    mesh = create_textured_cuboid(INPUT_IMAGE_PATH, width=2.0, depth=0.1)
    
    print(f"Saving GLB to {OUTPUT_GLB_PATH}")
    mesh.export(OUTPUT_GLB_PATH)
    
    print("Done!")

if __name__ == "__main__":
    main()
