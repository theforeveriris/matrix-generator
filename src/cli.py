#!/usr/bin/env python3
"""
Matrix Generator - Command Line Interface
======================================
Interactive and batch mode for generating matrix patterns.
"""

import argparse
import sys
from typing import List, Optional
from .generator import MatrixGenerator
from .constants import PALETTES, ALGORITHMS


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Matrix Generator - Generate colorful grid patterns"
    )

    parser.add_argument(
        "-s",
        "--size",
        type=int,
        default=8,
        help="Grid size (3-64, default: 8)",
    )
    parser.add_argument(
        "-a",
        "--algorithm",
        type=str,
        choices=ALGORITHMS,
        default="random",
        help="Algorithm to use",
    )
    parser.add_argument(
        "-c",
        "--chaos",
        type=int,
        default=5,
        help="Chaos level (1-10, default: 5)",
    )
    parser.add_argument(
        "-p",
        "--palette",
        type=str,
        choices=list(PALETTES.keys()),
        default="neon",
        help="Color palette",
    )
    parser.add_argument(
        "--seed",
        type=int,
        help="Random seed for reproducible generation",
    )
    parser.add_argument(
        "-i",
        "--interactive",
        action="store_true",
        help="Interactive mode",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=str,
        help="Output file (supports .png, .json, .svg, .css, .gif, .txt)",
    )
    parser.add_argument(
        "--list-palettes",
        action="store_true",
        help="List all available palettes",
    )
    parser.add_argument(
        "--list-algorithms",
        action="store_true",
        help="List all available algorithms",
    )

    args = parser.parse_args()

    if args.list_palettes:
        print("Available palettes:")
        for name in sorted(PALETTES.keys()):
            colors = " ".join(PALETTES[name])
            print(f"  - {name}: {colors}")
        return

    if args.list_algorithms:
        print("Available algorithms:")
        for name in ALGORITHMS:
            print(f"  - {name}")
        return

    if args.interactive:
        interactive_mode()
        return

    grid_size = max(3, min(64, args.size))
    chaos_level = max(1, min(10, args.chaos))

    mg = MatrixGenerator(
        grid_size=grid_size,
        algorithm=args.algorithm,
        chaos_level=chaos_level,
        palette_name=args.palette,
        seed=args.seed,
    )
    mg.generate()
    print(mg.to_ansi())
    print()

    if args.output:
        output_file = args.output
        if output_file.endswith(".png"):
            mg.export_png(output_file)
            print(f"Saved to {output_file}")
        elif output_file.endswith(".json"):
            mg.export_json(output_file)
            print(f"Saved to {output_file}")
        elif output_file.endswith(".svg"):
            mg.export_svg(output_file)
            print(f"Saved to {output_file}")
        elif output_file.endswith(".css"):
            mg.export_css(output_file)
            print(f"Saved to {output_file}")
        elif output_file.endswith(".gif"):
            try:
                mg.export_gif(output_file)
                print(f"Saved to {output_file}")
            except ValueError as e:
                print(f"Error: {e}", file=sys.stderr)
        elif output_file.endswith(".txt"):
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(mg.to_ascii())
            print(f"Saved ASCII art to {output_file}")
        else:
            print(f"Unknown file type: {output_file}", file=sys.stderr)


def interactive_mode() -> None:
    print("=== Matrix Generator - Interactive Mode ===")
    print()

    grid_size = get_input_int("Grid size (3-64)", min_val=3, max_val=64, default=8)
    chaos_level = get_input_int("Chaos level (1-10)", min_val=1, max_val=10, default=5)
    algorithm = get_input_choice("Algorithm", ALGORITHMS, default="random")
    palette_name = get_input_choice("Palette", sorted(list(PALETTES.keys())), default="neon")
    seed = get_input_int_optional("Random seed (empty for random)", default=None)

    print()
    print("Generating...")
    print()

    mg = MatrixGenerator(
        grid_size=grid_size,
        algorithm=algorithm,
        chaos_level=chaos_level,
        palette_name=palette_name,
        seed=seed,
    )
    mg.generate()
    print(mg.to_ansi())
    print()

    while True:
        action = input("\n[r] Regenerate | [s] Save | [q] Quit: ").lower().strip()
        if action == "r":
            print()
            mg.generate()
            print(mg.to_ansi())
            print()
        elif action == "s":
            filename = input("Output filename (e.g. matrix.png/json/svg/css/gif/txt): ").strip()
            if filename:
                try:
                    if filename.endswith(".png"):
                        mg.export_png(filename)
                        print(f"Saved to {filename}")
                    elif filename.endswith(".json"):
                        mg.export_json(filename)
                        print(f"Saved to {filename}")
                    elif filename.endswith(".svg"):
                        mg.export_svg(filename)
                        print(f"Saved to {filename}")
                    elif filename.endswith(".css"):
                        mg.export_css(filename)
                        print(f"Saved to {filename}")
                    elif filename.endswith(".gif"):
                        try:
                            mg.export_gif(filename)
                            print(f"Saved to {filename}")
                        except ValueError as e:
                            print(f"Error: {e}", file=sys.stderr)
                    elif filename.endswith(".txt"):
                        with open(filename, 'w', encoding='utf-8') as f:
                            f.write(mg.to_ascii())
                        print(f"Saved ASCII art to {filename}")
                    else:
                        print("Unknown format! Use .png/.json/.svg/.css/.gif/.txt")
                except Exception as e:
                    print(f"Error saving: {e}", file=sys.stderr)
        elif action == "q":
            break


def get_input_int(prompt: str, min_val: int, max_val: int, default: int) -> int:
    while True:
        try:
            val = input(f"{prompt} [{default}]: ").strip()
            if not val:
                return default
            val_int = int(val)
            if min_val <= val_int <= max_val:
                return val_int
            else:
                print(f"Value must be between {min_val} and {max_val}")
        except ValueError:
            print("Please enter a number")


def get_input_int_optional(prompt: str, default: Optional[int] = None) -> Optional[int]:
    while True:
        try:
            val = input(f"{prompt}: ").strip()
            if not val:
                return default
            return int(val)
        except ValueError:
            print("Please enter a valid number or leave empty")


def get_input_choice(prompt: str, choices: List[str], default: str) -> str:
    print(f"{prompt}:")
    for i, choice in enumerate(choices, 1):
        print(f"  {i}. {choice}")
    while True:
        try:
            val = input(f"Choose [{default}]: ").strip()
            if not val:
                return default
            idx = int(val) - 1
            if 0 <= idx < len(choices):
                return choices[idx]
            else:
                print(f"Please choose between 1 and {len(choices)}")
        except ValueError:
            if val in choices:
                return val
            print(f"Please choose one of: {', '.join(choices)}")


if __name__ == "__main__":
    main()
