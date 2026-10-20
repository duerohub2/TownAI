from pathlib import Path
from PIL import Image

SOURCE = Path('/home/ubuntu/upload/984FE3CF-81C2-4DC8-9A98-1CA5A704D48D.png')
OUT = Path('/home/ubuntu/townai/assets/user/ai_living_city')
OUT.mkdir(parents=True, exist_ok=True)

img = Image.open(SOURCE).convert('RGBA')
img.save(OUT / 'source_master.png')

# Category crops retain the supplied artwork and are useful for future expansion.
categories = {
    'terrain_tiles': (0, 28, 375, 326),
    'nature': (375, 28, 803, 326),
    'buildings': (803, 28, 1536, 326),
    'building_parts': (0, 354, 375, 588),
    'furniture_interior': (375, 354, 920, 588),
    'street_objects': (920, 354, 1536, 588),
    'characters': (0, 610, 750, 795),
    'equipment': (750, 610, 950, 795),
    'animals': (950, 610, 1210, 795),
    'economy_business': (1210, 610, 1536, 795),
    'government_community': (0, 820, 350, 1024),
    'ai_living_system': (350, 820, 750, 1024),
    'effects': (750, 820, 950, 1024),
    'animation_sprites': (950, 820, 1220, 1024),
    'ui_game_assets': (1220, 820, 1536, 1024),
}

for name, box in categories.items():
    img.crop(box).save(OUT / f'{name}.png')

# Hand-selected source rectangles from the supplied contact sheet.
# Coordinates are kept here as source data so the slicing can be repeated or tuned.
sprites = {
    # Nature: broadleaf tree, evergreen, flower tree, crystal.
    'tree_broadleaf': (392, 36, 435, 111),
    'tree_evergreen': (501, 31, 544, 112),
    'tree_flowering': (584, 32, 628, 112),
    'crystal_blue': (738, 194, 800, 258),
    # Buildings: compact homes, shop, civic tower.
    'house_red_roof': (817, 39, 858, 111),
    'house_blue_roof': (876, 39, 918, 111),
    'shop_red_awning': (814, 132, 853, 200),
    'civic_tower': (1450, 31, 1516, 140),
    # Street objects and economy.
    'street_lamp': (931, 365, 962, 440),
    'fountain': (1102, 365, 1167, 438),
    'market_stall': (1314, 377, 1368, 440),
    # Characters: player avatar and recognizable professions.
    'character_adventurer': (18, 611, 42, 680),
    'character_farmer': (180, 611, 204, 680),
    'character_doctor': (309, 611, 334, 680),
    'character_player_avatar': (701, 708, 725, 785),
    'animal_dog': (969, 621, 1020, 674),
    'animal_chicken': (1086, 621, 1138, 675),
}

def remove_near_white(im: Image.Image) -> Image.Image:
    px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            brightness = (r + g + b) / 3.0
            spread = max(r, g, b) - min(r, g, b)
            # The supplied sheet uses a lightly textured paper background. Remove
            # bright low-saturation paper while keeping saturated sprite colors.
            if brightness > 145 and spread < 34:
                px[x, y] = (r, g, b, 0)
            elif brightness > 185 and spread < 62:
                px[x, y] = (r, g, b, 0)
    return im

for name, box in sprites.items():
    crop = img.crop(box)
    crop = remove_near_white(crop)
    crop.save(OUT / f'{name}.png')

print(f'Created {len(categories)} category sheets and {len(sprites)} sprites in {OUT}')
