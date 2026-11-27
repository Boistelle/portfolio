
import os
import json

folder = "ImgGif"

extensions = (".gif",)

if not os.path.isdir(folder):
    raise FileNotFoundError(f"Dossier introuvable : {folder}")

images = [
    f"{folder}/{file}"
    for file in sorted(os.listdir(folder))
    if file.lower().endswith(extensions)
]

with open("imagesgif.json", "w", encoding="utf-8") as f:
    json.dump(images, f, indent=4)

print(f"{len(images)} GIFs trouvés !")
