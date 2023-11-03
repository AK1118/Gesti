import Vector from "../../core/lib/vector";
import { Point } from "../../core/lib/vertex";
class Line {
	//Point p1, p2;
    p1:Point;
    p2:Point;
	constructor(p1:Point, p2:Point) {
		this.p1 = p1;
		this.p2 = p2;
	}

};

class CheckInside {
	onLine(l1:Line, p:Point) {
		// Check whether p is on the line or not
		if (p.x <= Math.max(l1.p1.x, l1.p2.x) &&
			p.x <= Math.min(l1.p1.x, l1.p2.x) &&
			(p.y <= Math.max(l1.p1.y, l1.p2.y) &&
				p.y <= Math.min(l1.p1.y, l1.p2.y)))
			return true;

		return false;
	}
	/**
	 * @param {Vector} p1
	 * @param {Vector} p2
	 * @param {Object} radius
	 */
	checkInsideArc(p1:Vector, p2:Vector, radius:number) {
		return Vector.dist(p1, p2) < radius;
	}
	direction(a:Point, b:Point, c:Vector) {
		let val = (b.y - a.y) * (c.x - b.x) -
			(b.x - a.x) * (c.y - b.y);

		if (val == 0)

			// Colinear
			return 0;

		else if (val < 0)

			// Anti-clockwise direction
			return 2;

		// Clockwise direction
		return 1;
	}

	isIntersect(l1:Line, l2:Line) {
		// Four direction for two lines and points of other line
		let dir1 = this.direction(l1.p1, l1.p2, l2.p1);
		let dir2 = this.direction(l1.p1, l1.p2, l2.p2);
		let dir3 = this.direction(l2.p1, l2.p2, l1.p1);
		let dir4 = this.direction(l2.p1, l2.p2, l1.p2);

		// When intersecting
		if (dir1 != dir2 && dir3 != dir4)
			return true;

		// When p2 of line2 are on the line1
		if (dir1 == 0 && this.onLine(l1, l2.p1))
			return true;

		// When p1 of line2 are on the line1
		if (dir2 == 0 && this.onLine(l1, l2.p2))
			return true;

		// When p2 of line1 are on the line2
		if (dir3 == 0 && this.onLine(l2, l1.p1))
			return true;

		// When p1 of line1 are on the line2
		if (dir4 == 0 && this.onLine(l2, l1.p2))
			return true;

		return false;
	}

	checkInside(poly, n, p) {

		// When polygon has less than 3 edge, it is not polygon
		if (n < 3)
			return false;

		// Create a point at infinity, y is same as point p
		let tmp = new Point(
			9999,
		     p.y
		);
		let exline = new Line(p, tmp);
		let count = 0;
		let i = 0;
		do {

			// Forming a line from two consecutive points of
			// poly
			let side = new Line(poly[i], poly[(i + 1) % n]);
			if (this.isIntersect(side, exline)) {

				// If side is intersects exline
				if (this.direction(side.p1, p, side.p2) == 0)
					return this.onLine(side, p);
				count++;
			}
			i = (i + 1) % n;
		} while (i != 0);

		// When count is odd
		return count & 1;
	}
}
export default CheckInside;
// Driver code
// let polygon = [new Point(0, 0), new Point(10, 0), new Point(10, 10), new Point(0, 10)];
// let p = new Point(5, 3);
// let n = 4;

// //  call
// if (checkInside(polygon, n, p))
// 	console.log("Point is inside.");
// else
// 	console.log("Point is outside.");

// This code is contributed by poojaagarwal2.
