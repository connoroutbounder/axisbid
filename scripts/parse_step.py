#!/usr/bin/env python3
"""
STEP file parser using CadQuery/OpenCASCADE for geometry extraction.
Falls back to basic text parsing if CadQuery is not available.
"""

import sys
import json
import os
from pathlib import Path

def extract_geometry_with_cadquery(step_file: str) -> dict:
    """Extract geometry using CadQuery and OpenCASCADE."""
    try:
        import cadquery as cq
        from OCP.Bnd import Bnd_Box
        from OCP.BRepBndLib import BRepBndLib_Static
    except ImportError:
        raise ImportError("CadQuery not available, falling back to basic parsing")

    try:
        # Load the STEP file
        shape = cq.importers.importStep(step_file)

        if shape is None:
            raise ValueError("Failed to parse STEP file")

        # Get bounding box
        bbox = shape.val.BoundingBox()
        bounding_box = {
            "x": round(bbox.xlen, 2),
            "y": round(bbox.ylen, 2),
            "z": round(bbox.zlen, 2),
        }

        # Calculate volume and surface area
        properties = shape.val.ShapeExtended().Properties()
        volume = properties.Mass if hasattr(properties, 'Mass') else bbox.xlen * bbox.ylen * bbox.zlen * 0.5
        surface_area = properties.SurfaceArea if hasattr(properties, 'SurfaceArea') else 2 * (bbox.xlen * bbox.ylen + bbox.ylen * bbox.zlen + bbox.xlen * bbox.zlen)

        # Count faces, edges
        face_count = len(shape.faces().objects)
        edge_count = len(shape.edges().objects)

        # Estimate holes and pockets from circle/arc detection
        # This is a heuristic - actual hole detection is complex
        wires = shape.wires().objects
        circles = [w for w in wires if hasattr(w, 'ParametricRange')]
        hole_count = max(0, len(circles) - 2)  # Subtract 2 for potential outer boundary

        # Rough pocket count from face analysis
        pocket_count = 0
        if face_count > 6:  # Only complex shapes likely have pockets
            pocket_count = max(0, (face_count - 6) // 2)

        return {
            "bounding_box": bounding_box,
            "volume": round(volume / 1000, 2),  # Convert mm³ to cm³
            "surface_area": round(surface_area / 100, 2),  # Convert mm² to cm²
            "face_count": face_count,
            "edge_count": edge_count,
            "hole_count": hole_count,
            "pocket_count": pocket_count,
        }

    except Exception as e:
        raise RuntimeError(f"CadQuery parsing failed: {str(e)}")


def extract_geometry_basic(step_file: str) -> dict:
    """Basic fallback STEP file parser using text analysis."""
    try:
        with open(step_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        raise IOError(f"Failed to read STEP file: {str(e)}")

    # Count STEP entities
    face_count = content.count('ADVANCED_FACE')
    edge_count = content.count('EDGE_CURVE')
    circle_count = content.count('CIRCLE')
    line_count = content.count('LINE')

    # Extract bounding coordinates if available
    # Look for CARTESIAN_POINT entries for rough bounds
    import re
    points = re.findall(r'CARTESIAN_POINT\s*\(\s*[^,]*,\s*\(([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\)', content)

    if points:
        x_coords = [float(p[0]) for p in points]
        y_coords = [float(p[1]) for p in points]
        z_coords = [float(p[2]) for p in points]

        bbox_x = max(x_coords) - min(x_coords) if x_coords else 100
        bbox_y = max(y_coords) - min(y_coords) if y_coords else 100
        bbox_z = max(z_coords) - min(z_coords) if z_coords else 50
    else:
        # Default estimates based on entity counts
        bbox_x = max(50, min(500, face_count * 5))
        bbox_y = max(50, min(500, face_count * 5))
        bbox_z = max(20, min(300, edge_count * 2))

    # Estimate volume with 40% fill factor
    volume = (bbox_x * bbox_y * bbox_z) / 1000 * 0.4

    # Estimate surface area
    surface_area = 2 * (bbox_x * bbox_y + bbox_y * bbox_z + bbox_x * bbox_z) / 100

    # Estimate holes from circle count
    hole_count = max(0, circle_count - 2)

    # Estimate pockets
    pocket_count = 0
    if face_count > 6:
        pocket_count = max(0, (face_count - 6) // 2)

    return {
        "bounding_box": {
            "x": round(bbox_x, 2),
            "y": round(bbox_y, 2),
            "z": round(bbox_z, 2),
        },
        "volume": round(volume, 2),
        "surface_area": round(surface_area, 2),
        "face_count": max(1, face_count),
        "edge_count": max(1, edge_count),
        "hole_count": hole_count,
        "pocket_count": pocket_count,
    }


def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Usage: parse_step.py <input_file> <output_file>"}))
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    if not os.path.exists(input_file):
        print(json.dumps({"error": f"Input file not found: {input_file}"}))
        sys.exit(1)

    try:
        # Try CadQuery first
        result = extract_geometry_with_cadquery(input_file)
    except (ImportError, RuntimeError) as e:
        # Fall back to basic parsing
        print(f"# Falling back to basic STEP parser: {str(e)}", file=sys.stderr)
        result = extract_geometry_basic(input_file)
    except Exception as e:
        print(json.dumps({"error": f"Unexpected error: {str(e)}"}))
        sys.exit(1)

    # Write result to output file
    try:
        with open(output_file, 'w') as f:
            json.dump(result, f, indent=2)
    except Exception as e:
        print(json.dumps({"error": f"Failed to write output: {str(e)}"}))
        sys.exit(1)

    print(json.dumps({"success": True, "file": output_file}))


if __name__ == "__main__":
    main()
