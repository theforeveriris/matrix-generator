#!/usr/bin/env python3
"""
Matrix Generator - Example Usage
================================
Examples of using the MatrixGenerator library.
"""

from src import MatrixGenerator, ALGORITHMS


def example_basic() -> None:
    """Basic usage example."""
    print("=== Basic Example ===")
    mg = MatrixGenerator(grid_size=8, algorithm="gradient", palette_name="ocean")
    mg.generate()
    print(mg.to_ansi())
    print()


def example_with_seed() -> None:
    """Reproducible example with seed."""
    print("=== Reproducible Example (Seed 42) ===")
    mg = MatrixGenerator(
        grid_size=10,
        algorithm="wave",
        palette_name="neon",
        seed=42
    )
    mg.generate()
    print(mg.to_ansi())
    print()


def example_new_algorithms() -> None:
    """Test the new algorithms."""
    for algo in ["game_of_life", "sierpinski", "mandelbrot"]:
        print(f"=== Algorithm: {algo} ===")
        mg = MatrixGenerator(
            grid_size=12,
            algorithm=algo,
            palette_name="rainbow",
            seed=123
        )
        mg.generate()
        print(mg.to_ansi())
        print()


def example_export() -> None:
    """Example of exporting to different formats."""
    print("=== Export Example ===")
    
    mg = MatrixGenerator(
        grid_size=16,
        algorithm="spiral",
        palette_name="sunset",
        seed=999
    )
    mg.generate()
    
    print("ASCII art:")
    print(mg.to_ascii())
    print()
    
    # Note: PNG, SVG, CSS, JSON export requires writing to file
    # See README for more examples


if __name__ == "__main__":
    example_basic()
    example_with_seed()
    example_new_algorithms()
    example_export()
