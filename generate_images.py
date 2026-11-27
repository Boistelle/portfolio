
import os
import json

folder = "ImgArchive"

extensions = (".png", ".jpg", ".jpeg", ".webp", ".avif")

images = [
    f"{folder}/{file}"
    for file in sorted(os.listdir(folder))
    if file.lower().endswith(extensions)
]

with open("images.json", "w", encoding="utf-8") as f:
    json.dump(images, f, indent=4)

print(f"{len(images)} images trouvées !")
