import base64
import os

# Use relative path from the script's location
script_dir = os.path.dirname(os.path.abspath(__file__))
assets_path = script_dir
output_file = os.path.join(assets_path, "images.ts")

def get_b64(filename):
    file_path = os.path.join(assets_path, filename)
    if not os.path.exists(file_path):
        print(f"Warning: {filename} not found in {assets_path}")
        return ""
    with open(file_path, "rb") as f:
        return base64.b64encode(f.read()).decode()

logo = get_b64("ubma-logo.png")
student = get_b64("avatar-student.png")
teacher = get_b64("avatar-teacher.png")

with open(output_file, "w") as f:
    f.write(f'export const UBMA_LOGO = "data:image/png;base64,{logo}";\n')
    f.write(f'export const AVATAR_STUDENT = "data:image/png;base64,{student}";\n')
    f.write(f'export const AVATAR_TEACHER = "data:image/png;base64,{teacher}";\n')

print(f"Generated {output_file}")
