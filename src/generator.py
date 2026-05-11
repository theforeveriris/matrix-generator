"""
Matrix Generator - Core Generator
==================================
Main class for generating matrix patterns with various algorithms.
"""

import math
import random
import json
from typing import List, Optional, Tuple, Any
from .constants import PALETTES, ALGORITHMS, ASCII_CHARSET


class MatrixGenerator:
    def __init__(
        self,
        grid_size: int = 8,
        algorithm: str = "random",
        chaos_level: int = 5,
        palette_name: str = "neon",
        custom_colors: Optional[List[str]] = None,
        seed: Optional[int] = None,
    ) -> None:
        self.grid_size: int = grid_size
        self.algorithm: str = algorithm
        self.chaos_level: int = chaos_level
        self.palette_name: str = palette_name
        self.custom_colors: List[str] = custom_colors or []
        self.seed: Optional[int] = seed
        self.matrix: Optional[List[List[str]]] = None
        self._rng: Optional[random.Random] = None
        
        if seed is not None:
            self._rng = random.Random(seed)
        else:
            self._rng = random.Random()

    @property
    def colors(self) -> List[str]:
        if self.palette_name == "custom" and self.custom_colors:
            return self.custom_colors
        return PALETTES.get(self.palette_name, PALETTES["neon"])

    def generate(self) -> List[List[str]]:
        self.matrix = []
        
        if self.algorithm == "game_of_life":
            self._generate_game_of_life()
        elif self.algorithm == "sierpinski":
            self._generate_sierpinski()
        elif self.algorithm == "mandelbrot":
            self._generate_mandelbrot()
        else:
            self._generate_standard_algorithms()
        
        return self.matrix

    def _generate_standard_algorithms(self) -> None:
        center_x: float = (self.grid_size - 1) / 2
        center_y: float = (self.grid_size - 1) / 2

        for row in range(self.grid_size):
            row_colors: List[str] = []
            for col in range(self.grid_size):
                index: int = row * self.grid_size + col
                color: str = self._get_color_by_index(index, center_x, center_y)
                row_colors.append(color)
            self.matrix.append(row_colors)

    def _generate_game_of_life(self) -> None:
        grid: List[List[bool]] = []
        for _ in range(self.grid_size):
            row: List[bool] = []
            for _ in range(self.grid_size):
                row.append(self._rng.random() < 0.3)
            grid.append(row)
        
        steps: int = 5
        for _ in range(steps):
            grid = self._step_game_of_life(grid)
        
        for row in range(self.grid_size):
            row_colors: List[str] = []
            for col in range(self.grid_size):
                if grid[row][col]:
                    idx: int = self._rng.randint(0, len(self.colors) - 1)
                    row_colors.append(self.colors[idx])
                else:
                    row_colors.append("#ebe7e0")
            self.matrix.append(row_colors)

    def _step_game_of_life(self, grid: List[List[bool]]) -> List[List[bool]]:
        new_grid: List[List[bool]] = []
        for row in range(self.grid_size):
            new_row: List[bool] = []
            for col in range(self.grid_size):
                neighbors: int = self._count_live_neighbors(grid, row, col)
                alive: bool = grid[row][col]
                if alive:
                    new_row.append(2 <= neighbors <= 3)
                else:
                    new_row.append(neighbors == 3)
            new_grid.append(new_row)
        return new_grid

    def _count_live_neighbors(self, grid: List[List[bool]], row: int, col: int) -> int:
        count: int = 0
        for dr in [-1, 0, 1]:
            for dc in [-1, 0, 1]:
                if dr == 0 and dc == 0:
                    continue
                nr, nc = row + dr, col + dc
                if 0 <= nr < self.grid_size and 0 <= nc < self.grid_size:
                    if grid[nr][nc]:
                        count += 1
        return count

    def _generate_sierpinski(self) -> None:
        for row in range(self.grid_size):
            row_colors: List[str] = []
            for col in range(self.grid_size):
                if (row & col) == 0:
                    idx: int = (row + col) % len(self.colors)
                    row_colors.append(self.colors[idx])
                else:
                    row_colors.append("#ebe7e0")
            self.matrix.append(row_colors)

    def _generate_mandelbrot(self) -> None:
        scale: float = 3.0
        offset_x: float = -2.0
        offset_y: float = -1.5
        
        for row in range(self.grid_size):
            row_colors: List[str] = []
            for col in range(self.grid_size):
                x0: float = offset_x + (col / (self.grid_size - 1)) * scale
                y0: float = offset_y + (row / (self.grid_size - 1)) * scale
                x: float = 0.0
                y: float = 0.0
                iteration: int = 0
                max_iter: int = 100
                
                while x * x + y * y < 4 and iteration < max_iter:
                    xtemp: float = x * x - y * y + x0
                    y = 2 * x * y + y0
                    x = xtemp
                    iteration += 1
                
                if iteration == max_iter:
                    row_colors.append("#ebe7e0")
                else:
                    idx: int = iteration % len(self.colors)
                    row_colors.append(self.colors[idx])
            self.matrix.append(row_colors)

    def _get_color_by_index(self, index: int, center_x: float, center_y: float) -> str:
        row: int = index // self.grid_size
        col: int = index % self.grid_size

        chaos_roll: float = self._rng.random() * 10

        if chaos_roll < self.chaos_level:
            return self._rng.choice(self.colors)

        color_index: int = self._calculate_color_index(row, col, center_x, center_y)
        color_index = max(0, min(len(self.colors) - 1, color_index))
        return self.colors[color_index]

    def _calculate_color_index(self, row: int, col: int, center_x: float, center_y: float) -> int:
        colors_len: int = len(self.colors)

        if self.algorithm == "random":
            return int(self._rng.random() * colors_len)

        elif self.algorithm == "gradient":
            dist: float = math.sqrt((col - center_x) ** 2 + (row - center_y) ** 2)
            max_dist: float = math.sqrt(center_x ** 2 + center_y ** 2)
            t: float = min(1, dist / max_dist) if max_dist > 0 else 0
            return int(t * (colors_len - 1))

        elif self.algorithm == "wave":
            wave: float = math.sin(col * 0.8) * math.cos(row * 0.8)
            wave_norm: float = (wave + 1) / 2
            return int(wave_norm * (colors_len - 1))

        elif self.algorithm == "block":
            block_size: int = max(1, self.grid_size // 2)
            block_x: int = col // block_size
            block_y: int = row // block_size
            return (block_x + block_y) % colors_len

        elif self.algorithm == "diamond":
            diamond_dist: float = abs(col - center_x) + abs(row - center_y)
            max_diamond_dist: int = self.grid_size - 1
            diamond_t: float = diamond_dist / max_diamond_dist if max_diamond_dist > 0 else 0
            return int(diamond_t * (colors_len - 1))

        elif self.algorithm == "horizontal":
            t: float = col / (self.grid_size - 1) if self.grid_size > 1 else 0
            return int(t * (colors_len - 1))

        elif self.algorithm == "vertical":
            t: float = row / (self.grid_size - 1) if self.grid_size > 1 else 0
            return int(t * (colors_len - 1))

        elif self.algorithm == "diagonal":
            diag_sum: int = col + row
            max_diag: int = (self.grid_size - 1) * 2
            t: float = diag_sum / max_diag if max_diag > 0 else 0
            return int(t * (colors_len - 1))

        elif self.algorithm == "spiral":
            dx: float = col - center_x
            dy: float = row - center_y
            angle: float = math.atan2(dy, dx)
            spiral_norm: float = ((angle + math.pi) / (2 * math.pi) + 0.5) % 1
            return int(spiral_norm * (colors_len - 1))

        elif self.algorithm == "concentric":
            dx: float = col - center_x
            dy: float = row - center_y
            conc_dist: float = math.sqrt(dx * dx + dy * dy)
            max_conc: float = math.sqrt(center_x ** 2 + center_y ** 2) if center_x > 0 else 1
            conc_norm: float = (conc_dist / max_conc + (col % 2) * 0.1) % 1
            return int(conc_norm * (colors_len - 1))

        elif self.algorithm == "checker":
            checker_index: int = ((col // 2) + (row // 2)) % 2
            return checker_index * (colors_len - 1)

        elif self.algorithm == "stripes":
            color_index: int = int((row % 3) / 2 * (colors_len - 1))
            if col % 2 == 0:
                color_index = int(color_index / 2)
            return color_index

        elif self.algorithm == "triangular":
            tri_dist: float = min(col, row) + abs(col - row) * 0.5
            max_tri: int = self.grid_size
            tri_norm: float = tri_dist / max_tri
            return int(tri_norm * (colors_len - 1))

        else:
            return int(self._rng.random() * colors_len)

    def to_ansi(self, cell_width: int = 2) -> str:
        if not self.matrix:
            self.generate()

        output: List[str] = []
        for row in self.matrix:
            row_output: List[str] = []
            for color in row:
                ansi_color: str = self._hex_to_ansi_bg(color)
                reset: str = "\033[0m"
                row_output.append(f"{ansi_color}{' ' * cell_width}{reset}")
            output.append("".join(row_output))
        return "\n".join(output)

    def to_ascii(self, charset: str = ASCII_CHARSET) -> str:
        if not self.matrix:
            self.generate()

        output: List[str] = []
        for row in self.matrix:
            row_output: List[str] = []
            for color in row:
                idx: int = self.colors.index(color) if color in self.colors else 0
                char_idx: int = idx % len(charset)
                row_output.append(charset[char_idx])
            output.append("".join(row_output))
        return "\n".join(output)

    @staticmethod
    def _hex_to_ansi_bg(hex_color: str) -> str:
        hex_color = hex_color.lstrip("#")
        r: int = int(hex_color[0:2], 16)
        g: int = int(hex_color[2:4], 16)
        b: int = int(hex_color[4:6], 16)
        return f"\033[48;2;{r};{g};{b}m"

    def export_png(self, filename: str, cell_size: int = 40) -> str:
        try:
            from PIL import Image, ImageDraw
        except ImportError:
            raise ImportError("PIL/Pillow is required for PNG export. Install with 'pip install pillow'")

        if not self.matrix:
            self.generate()

        img_size: int = self.grid_size * cell_size
        img = Image.new("RGB", (img_size, img_size), "#ebe7e0")
        draw = ImageDraw.Draw(img)

        for row_idx, row in enumerate(self.matrix):
            for col_idx, color in enumerate(row):
                x: int = col_idx * cell_size
                y: int = row_idx * cell_size
                draw.rectangle([x, y, x + cell_size, y + cell_size], fill=color)

        img.save(filename)
        return filename

    def export_svg(self, filename: str, cell_size: int = 40) -> str:
        if not self.matrix:
            self.generate()
        
        img_size: int = self.grid_size * cell_size
        svg_content: List[str] = [
            f'<?xml version="1.0" encoding="UTF-8"?>',
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{img_size}" height="{img_size}">',
            f'<rect width="100%" height="100%" fill="#ebe7e0"/>',
        ]
        
        for row_idx, row in enumerate(self.matrix):
            for col_idx, color in enumerate(row):
                x: int = col_idx * cell_size
                y: int = row_idx * cell_size
                svg_content.append(
                    f'<rect x="{x}" y="{y}" width="{cell_size}" height="{cell_size}" fill="{color}"/>'
                )
        
        svg_content.append('</svg>')
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write('\n'.join(svg_content))
        
        return filename

    def export_css(self, filename: str, class_name: str = "matrix-grid") -> str:
        if not self.matrix:
            self.generate()
        
        css_content: List[str] = [
            ":root {",
        ]
        
        for i, color in enumerate(self.colors):
            css_content.append(f'  --{class_name}-color-{i}: {color};')
        
        css_content.extend([
            "}",
            "",
            f".{class_name} {{",
            f"  display: grid;",
            f"  grid-template-columns: repeat({self.grid_size}, 1fr);",
            f"  gap: 0;",
            f"  width: fit-content;",
            f"}}",
            "",
            f".{class_name}-cell {{",
            f"  aspect-ratio: 1;",
            f"  width: 40px;",
            f"}}",
        ])
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write('\n'.join(css_content))
        
        return filename

    def export_json(self, filename: str) -> str:
        from datetime import datetime
        if not self.matrix:
            self.generate()
        
        data: Dict[str, Any] = {
            "version": "2.0",
            "generated": datetime.now().isoformat(),
            "seed": self.seed,
            "grid": {"size": self.grid_size, "total": self.grid_size * self.grid_size},
            "settings": {"algorithm": self.algorithm, "chaosLevel": self.chaos_level},
            "palette": {"name": self.palette_name, "colors": self.colors},
            "cells": self.matrix,
        }
        
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        
        return filename

    def export_gif(self, filename: str, cell_size: int = 40, frames: int = 10, fps: int = 5) -> str:
        try:
            from PIL import Image, ImageDraw
        except ImportError:
            raise ImportError("PIL/Pillow is required for GIF export. Install with 'pip install pillow'")
        
        if self.algorithm != "game_of_life":
            raise ValueError("GIF export only works with 'game_of_life' algorithm for animation!")
        
        images: List[Image.Image] = []
        
        grid: List[List[bool]] = []
        for _ in range(self.grid_size):
            row: List[bool] = []
            for _ in range(self.grid_size):
                row.append(self._rng.random() < 0.3)
            grid.append(row)
        
        for _ in range(frames):
            img_size: int = self.grid_size * cell_size
            img = Image.new("RGB", (img_size, img_size), "#ebe7e0")
            draw = ImageDraw.Draw(img)
            
            for row_idx in range(self.grid_size):
                for col_idx in range(self.grid_size):
                    x: int = col_idx * cell_size
                    y: int = row_idx * cell_size
                    if grid[row_idx][col_idx]:
                        idx: int = (row_idx + col_idx) % len(self.colors)
                        draw.rectangle([x, y, x + cell_size, y + cell_size], fill=self.colors[idx])
            
            images.append(img)
            grid = self._step_game_of_life(grid)
        
        if images:
            images[0].save(
                filename,
                save_all=True,
                append_images=images[1:],
                duration=1000 // fps,
                loop=0
            )
        
        return filename
