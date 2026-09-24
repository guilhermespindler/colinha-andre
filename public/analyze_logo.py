import sys
try:
    from PIL import Image
    import numpy as np
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow", "numpy"])
    from PIL import Image
    import numpy as np

img = Image.open('logo-principal.png').convert('RGBA')
data = np.array(img)

# Flatten the array to get a list of RGB colors (ignore transparent)
pixels = data.reshape(-1, 4)
solid_pixels = pixels[pixels[:, 3] > 200]

# Find unique colors and their counts
unique_colors, counts = np.unique(solid_pixels[:, :3], axis=0, return_counts=True)

# Sort by count (descending)
sorted_indices = np.argsort(-counts)
print("Top 10 most frequent solid colors (RGB):")
for i in range(min(10, len(sorted_indices))):
    idx = sorted_indices[i]
    print(f"Color: {unique_colors[idx]}, Count: {counts[idx]}")
