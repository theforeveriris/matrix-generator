"""
Matrix Generator
===============
A Python library and CLI for generating colorful matrix patterns.
"""

from .constants import PALETTES, ALGORITHMS, DEFAULT_STATE, ASCII_CHARSET
from .generator import MatrixGenerator

__version__ = "2.0.0"
__all__ = [
    "PALETTES",
    "ALGORITHMS",
    "DEFAULT_STATE",
    "ASCII_CHARSET",
    "MatrixGenerator",
]
