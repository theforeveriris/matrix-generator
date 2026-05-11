
import math
import random
from .constants import PALETTES, ALGORITHMS


class MatrixGenerator:
    def __init__(self, grid_size=8, algorithm="random", chaos_level=5, palette_name="neon", custom_colors=None):
        self.grid_size = grid_size
        self.algorithm = algorithm
        self.chaos_level = chaos_level
        self.palette_name = palette_name
        self.custom_colors = custom_colors or []
        self.matrix = None

    @property
    def colors(self):
        if self.palette_name == "custom" and self.custom_colors:
            return self.custom_colors
        return PALETTES.get(self.palette_name, PALETTES["neon"])

    def generate(self):
        self.matrix = []
        center_x = (self.grid_size - 1) / 2
        center_y = (self.grid_size - 1) / 2

        for row in range(self.grid_size):
            row_colors = []
            for col in range(self.grid_size):
                index = row * self.grid_size + col
                color = self._get_color_by_index(index, center_x, center_y)
                row_colors.append(color)
            self.matrix.append(row_colors)

        return self.matrix

    def _get_color_by_index(self, index, center_x, center_y):
        row = index // self.grid_size
        col = index % self.grid_size

        chaos_roll = random.random() * 10

        if chaos_roll < self.chaos_level:
            return random.choice(self.colors)

        color_index = self._calculate_color_index(row, col, center_x, center_y)
        color_index = max(0, min(len(self.colors) - 1, color_index))
        return self.colors[color_index]

    def _calculate_color_index(self, row, col, center_x, center_y):
        colors_len = len(self.colors)

        if self.algorithm == "random":
            return int(random.random() * colors_len)

        elif self.algorithm == "gradient":
            dist = math.sqrt((col - center_x) ** 2 + (row - center_y) ** 2)
            max_dist = math.sqrt(center_x ** 2 + center_y ** 2)
            t = min(1, dist / max_dist) if max_dist > 0 else 0
            return int(t * (colors_len - 1))

        elif self.algorithm == "wave":
            wave = math.sin(col * 0.8) * math.cos(row * 0.8)
            wave_norm = (wave + 1) / 2
            return int(wave_norm * (colors_len - 1))

        elif self.algorithm == "block":
            block_size = max(1, self.grid_size // 2)
            block_x = col // block_size
            block_y = row // block_size
            return (block_x + block_y) % colors_len

        elif self.algorithm == "diamond":
            diamond_dist = abs(col - center_x) + abs(row - center_y)
            max_diamond_dist = self.grid_size - 1
            diamond_t = diamond_dist / max_diamond_dist if max_diamond_dist > 0 else 0
            return int(diamond_t * (colors_len - 1))

        elif self.algorithm == "horizontal":
            t = col / (self.grid_size - 1) if self.grid_size > 1 else 0
            return int(t * (colors_len - 1))

        elif self.algorithm == "vertical":
            t = row / (self.grid_size - 1) if self.grid_size > 1 else 0
            return int(t * (colors_len - 1))

        elif self.algorithm == "diagonal":
            diag_sum = col + row
            max_diag = (self.grid_size - 1) * 2
            t = diag_sum / max_diag if max_diag > 0 else 0
            return int(t * (colors_len - 1))

        elif self.algorithm == "spiral":
            dx = col - center_x
            dy = row - center_y
            angle = math.atan2(dy, dx)
            spiral_norm = ((angle + math.pi) / (2 * math.pi) + 0.5) % 1
            return int(spiral_norm * (colors_len - 1))

        elif self.algorithm == "concentric":
            dx = col - center_x
            dy = row - center_y
            conc_dist = math.sqrt(dx * dx + dy * dy)
            max_conc = math.sqrt(center_x ** 2 + center_y ** 2) if center_x > 0 else 1
            conc_norm = (conc_dist / max_conc + (col % 2) * 0.1) % 1
            return int(conc_norm * (colors_len - 1))

        elif self.algorithm == "checker":
            checker_index = ((col // 2) + (row // 2)) % 2
            return checker_index * (colors_len - 1)

        elif self.algorithm == "stripes":
            color_index = int((row % 3) / 2 * (colors_len - 1))
            if col % 2 == 0:
                color_index = int(color_index / 2)
            return color_index

        elif self.algorithm == "triangular":
            tri_dist = min(col, row) + abs(col - row) * 0.5
            max_tri = self.grid_size
            tri_norm = tri_dist / max_tri
            return int(tri_norm * (colors_len - 1))

        else:
            return int(random.random() * colors_len)

    def to_ansi(self, cell_width=2):
        if not self.matrix:
            self.generate()

        output = []
        for row in self.matrix:
            row_output = []
            for color in row:
                ansi_color = self._hex_to_ansi_bg(color)
                reset = "\033[0m"
                row_output.append(f"{ansi_color}{' ' * cell_width}{reset}")
            output.append("".join(row_output))
        return "\n".join(output)

    def to_text(self, charset="█▓▒░·"):
        if not self.matrix:
            self.generate()

        output = []
        for row in self.matrix:
            row_output = []
            for i, _ in enumerate(row):
                idx = i % len(charset)
                row_output.append(charset[idx])
            output.append("".join(row_output))
        return "\n".join(output)

    @staticmethod
    def _hex_to_ansi_bg(hex_color):
        hex_color = hex_color.lstrip("#")
        r = int(hex_color[0:2], 16)
        g = int(hex_color[2:4], 16)
        b = int(hex_color[4:6], 16)
        return f"\033[48;2;{r};{g};{b}m"

    def export_png(self, filename, cell_size=40):
        try:
            from PIL import Image, ImageDraw
        except ImportError:
            raise ImportError("PIL/Pillow is required for PNG export. Install with 'pip install pillow'")

        if not self.matrix:
            self.generate()

        img_size = self.grid_size * cell_size
        img = Image.new("RGB", (img_size, img_size), "#ebe7e0")
        draw = ImageDraw.Draw(img)

        for row_idx, row in enumerate(self.matrix):
            for col_idx, color in enumerate(row):
                x = col_idx * cell_size
                y = row_idx * cell_size
                draw.rectangle([x, y, x + cell_size, y + cell_size], fill=color)

        img.save(filename)
        return filename

    def export_json(self, filename):
        import json
        if not self.matrix:
            self.generate()
        data = {
            "version": "1.0",
            "generated": "",
            "grid": {"size": self.grid_size, "total": self.grid_size * self.grid_size},
            "settings": {"algorithm": self.algorithm, "chaosLevel": self.chaos_level},
            "palette": {"name": self.palette_name, "colors": self.colors},
            "cells": self.matrix,
        }
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        return filename
