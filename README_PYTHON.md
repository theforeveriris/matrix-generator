# Matrix Generator - Python Version

Python implementation of the Matrix Generator with CLI and library support.

## Installation

```bash
cd matrix-generator/src
# Optional: Install pillow for PNG export
pip install pillow
```

## Usage

### Command Line Interface

#### Basic Usage
```bash
# Interactive mode (recommended)
python -m src.cli -i

# Quick default generation
python -m src.cli
```

#### Command Line Arguments
```bash
# Specify parameters
python -m src.cli -s 12 -a gradient -c 3 -p ocean

# Save to file
python -m src.cli -s 16 -a spiral -p rainbow -o matrix.png
python -m src.cli -s 16 -a spiral -p rainbow -o matrix.json
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
    grid_size=8,
    algorithm="gradient",
    chaos_level=5,
    palette_name="neon"
)

# Generate matrix
matrix = mg.generate()

# Print ANSI colors
print(mg.to_ansi())

# Export
mg.export_png("matrix.png")
mg.export_json("matrix.json")
```

### Algorithms Available
- random
- gradient
- wave
- block
- diamond
- horizontal
- vertical
- diagonal
- spiral
- concentric
- checker
- stripes
- triangular

### Palettes Available
24 preset color palettes including neon, sunset, ocean, forest, mono, pastel, earth, vintage, cyber, nordic, autumn, lavender, mint, and various pride flags.
