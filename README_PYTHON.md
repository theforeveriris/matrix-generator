# Matrix Generator - Python Version

Python implementation of the Matrix Generator with CLI and library support.

## Features

- **16 Generation Algorithms**:
  - Standard algorithms: random, gradient, wave, block, diamond, horizontal, vertical, diagonal, spiral, concentric, checker, stripes, triangular
  - New algorithms: game_of_life (Conway's Game of Life), sierpinski (Sierpinski triangle), mandelbrot (Mandelbrot set)
  
- **24 Color Palettes**:
  - Neon, Sunset, Ocean, Forest, Mono, Pastel, Earth, Vintage, Cyber, Nordic, Autumn, Lavender, Mint
  - Pride flag palettes: Trans, Rainbow, Lesbian, Gay, Bisexual, Pan, Nonbinary, Asexual, Genderqueer, Intersex
  
- **Multiple Export Formats**:
  - PNG image
  - SVG vector image
  - JSON data
  - CSS variables
  - ASCII art text
  - GIF animation (for game_of_life algorithm)
  
- **Type Hints**: Full type annotations for better development experience
- **Reproducible Results**: Seed support for deterministic generation

## Installation

```bash
cd matrix-generator

# Optional: Install Pillow for image export
pip install pillow
```

## Usage

### Command Line Interface

#### Interactive Mode (Recommended)
```bash
python -m src.cli -i
```

#### Quick Generation
```bash
# Default generation
python -m src.cli

# Custom parameters
python -m src.cli -s 16 -a gradient -c 2 -p ocean

# With seed for reproducible results
python -m src.cli --seed 42

# Save output
python -m src.cli -s 32 -a spiral -p rainbow -o matrix.png
```

#### List Available Options
```bash
# List all palettes
python -m src.cli --list-palettes

# List all algorithms
python -m src.cli --list-algorithms
```

### As a Python Library

```python
from src import MatrixGenerator, PALETTES, ALGORITHMS

# Create generator
mg = MatrixGenerator(
    grid_size=12,
    algorithm="gradient",
    chaos_level=3,
    palette_name="ocean",
    seed=42  # Optional, for reproducible results
)

# Generate matrix
matrix = mg.generate()

# Print to terminal with ANSI colors
print(mg.to_ansi())

# Export to various formats
mg.export_png("matrix.png")
mg.export_svg("matrix.svg")
mg.export_css("matrix.css")
mg.export_json("matrix.json")

# Save ASCII art
with open("matrix.txt", "w") as f:
    f.write(mg.to_ascii())
```

### Examples

#### Conway's Game of Life
```bash
python -m src.cli -a game_of_life -p neon -s 16 -o life.gif
```

#### Sierpinski Triangle
```bash
python -m src.cli -a sierpinski -p forest -s 32
```

#### Mandelbrot Set
```bash
python -m src.cli -a mandelbrot -p cyber -s 64 -o mandelbrot.png
```

## CLI Reference

```
usage: python -m src.cli [-h] [-s SIZE] [-a ALGORITHM] [-c CHAOS] [-p PALETTE]
                          [--seed SEED] [-i] [-o OUTPUT]
                          [--list-palettes] [--list-algorithms]

Matrix Generator - Generate colorful grid patterns

options:
  -h, --help            show this help message and exit
  -s SIZE, --size SIZE  Grid size (3-64, default: 8)
  -a ALGORITHM, --algorithm ALGORITHM
                        Algorithm to use
  -c CHAOS, --chaos CHAOS
                        Chaos level (1-10, default: 5)
  -p PALETTE, --palette PALETTE
                        Color palette
  --seed SEED           Random seed for reproducible generation
  -i, --interactive     Interactive mode
  -o OUTPUT, --output OUTPUT
                        Output file (supports .png, .json, .svg, .css, .gif, .txt)
  --list-palettes       List all available palettes
  --list-algorithms     List all available algorithms
```

## Algorithms

1. `random`: Fully random color pattern
2. `gradient`: Radial gradient from center
3. `wave`: Sine wave pattern
4. `block`: Block pattern
5. `diamond`: Diamond-shaped gradient
6. `horizontal`: Horizontal gradient
7. `vertical`: Vertical gradient
8. `diagonal`: Diagonal gradient
9. `spiral`: Spiral pattern
10. `concentric`: Concentric circles
11. `checker`: Checkerboard pattern
12. `stripes`: Striped pattern
13. `triangular`: Triangular gradient
14. `game_of_life`: Conway's Game of Life cellular automaton
15. `sierpinski`: Sierpinski triangle fractal
16. `mandelbrot`: Mandelbrot set visualization

## Project Structure

```
matrix-generator/
├── src/
│   ├── __init__.py          # Library exports
│   ├── constants.py         # Palettes, algorithms, constants
│   ├── generator.py         # Core MatrixGenerator class
│   └── cli.py               # Command-line interface
├── README_PYTHON.md         # This file
└── .gitignore
```
