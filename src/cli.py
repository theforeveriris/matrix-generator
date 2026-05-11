#!/usr/bin/env python3
import argparse
import sys
import random
from .generator import MatrixGenerator
from .constants import PALETTES, ALGORITHMS


def main():
    parser = argparse.ArgumentParser(
        description="Matrix Generator - Generate colorful grid patterns"
    )

    parser.add_argument(
        "-s",
        "--size",
        type=int,
        default=8,
        help="Grid size (3-32, default: 8)",
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
        "-i",
        "--interactive",
        action="store_true",
        help="Interactive mode",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=str,
        help="Output file (supports .png, .json)",
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
        for name in PALETTES:
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

    grid_size = max(3, min(32, args.size))
    chaos_level = max(1, min(10, args.chaos))

    mg = MatrixGenerator(
        grid_size=grid_size,
        algorithm=args.algorithm,
        chaos_level=chaos_level,
        palette_name=args.palette,
    )
    mg.generate()
    print(mg.to_ansi())
    print()

    if args.output:
        if args.output.endswith(".png"):
            mg.export_png(args.output)
            print(f"Saved to {args.output}")
        elif args.output.endswith(".json"):
            mg.export_json(args.output)
            print(f"Saved to {args.output}")
        else:
            print(f"Unknown file type: {args.output}", file=sys.stderr)


def interactive_mode():
    print("=== Matrix Generator - Interactive Mode ===")
    print()

    grid_size = get_input_int("Grid size (3-32)", min_val=3, max_val=32, default=8)
    chaos_level = get_input_int("Chaos level (1-10)", min_val=1, max_val=10, default=5)
    algorithm = get_input_choice("Algorithm", ALGORITHMS, default="random")
    palette_name = get_input_choice("Palette", list(PALETTES.keys()), default="neon")

    print()
    print("Generating...")
    print()

    mg = MatrixGenerator(
        grid_size=grid_size,
        algorithm=algorithm,
        chaos_level=chaos_level,
        palette_name=palette_name,
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
            filename = input("Output filename (e.g. matrix.png): ").strip()
            if filename:
                if filename.endswith(".png"):
                    mg.export_png(filename)
                    print(f"Saved to {filename}")
                elif filename.endswith(".json"):
                    mg.export_json(filename)
                    print(f"Saved to {filename}")
                else:
                    print("Unknown format. Use .png or .json")
        elif action == "q":
            break


def get_input_int(prompt, min_val, max_val, default):
    while True:
        try:
            val = input(f"{prompt} [{default}]: ").strip()
            if not val:
                return default
            val = int(val)
            if min_val <= val <= max_val:
                return val
            else:
                print(f"Value must be between {min_val} and {max_val}")
        except ValueError:
            print("Please enter a number")


def get_input_choice(prompt, choices, default):
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
