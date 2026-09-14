import zlib
import struct
import math

width = 600
height = 400
# White background RGBA
pixels = bytearray([255, 255, 255, 255] * (width * height))

def set_pixel(x, y, r, g, b, a=255):
    if 0 <= x < width and 0 <= y < height:
        idx = (y * width + x) * 4
        # simple alpha blending
        if a == 255:
            pixels[idx] = r
            pixels[idx+1] = g
            pixels[idx+2] = b
            pixels[idx+3] = 255
        else:
            bg_r, bg_g, bg_b = pixels[idx], pixels[idx+1], pixels[idx+2]
            alpha = a / 255.0
            pixels[idx] = int(r * alpha + bg_r * (1 - alpha))
            pixels[idx+1] = int(g * alpha + bg_g * (1 - alpha))
            pixels[idx+2] = int(b * alpha + bg_b * (1 - alpha))

def draw_rect(x1, y1, x2, y2, r, g, b):
    for y in range(max(0, y1), min(height, y2)):
        for x in range(max(0, x1), min(width, x2)):
            set_pixel(x, y, r, g, b)

def draw_circle(cx, cy, radius, r, g, b, stroke=0, fill=True):
    for y in range(max(0, int(cy - radius - stroke - 1)), min(height, int(cy + radius + stroke + 2))):
        for x in range(max(0, int(cx - radius - stroke - 1)), min(width, int(cx + radius + stroke + 2))):
            d = math.hypot(x - cx, y - cy)
            if fill and d <= radius:
                set_pixel(x, y, r, g, b)
            elif stroke > 0 and abs(d - radius) <= stroke / 2.0:
                set_pixel(x, y, r, g, b)

