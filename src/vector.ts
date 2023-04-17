class Vector{
    x:number=0;
    y:number=0;
    constructor(x:number,y:number){
        this.x=x;
        this.y=y;
    }
    public add(v:Vector){
        this.x+=v.x;
        this.y+=v.y;
    }
    sub(v:Vector) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}
	mult(v:Vector) {
		this.x *= v.x;
		this.y *= v.y;
		return this;
	}
	div(v:Vector) {
		this.x /= v.x;
		this.y /= v.y;
		return this;
	}
	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	dist(v:Vector) {
		let dx = this.x - v.x;
		let dy = this.y - v.y;
		return Math.sqrt(dx * dx + dy * dy);
	}
	normalize() {
		let len = this.mag();
		this.x /= len;
		this.y /= len;
		return this;
	}
	clamp(c:[max:number,min:number]) {
		let [max, min] = c;
		this.x = Math.min(Math.max(this.x, min), max)
		this.y = Math.min(Math.max(this.y, min), max)
	}
	copy() {
		return new Vector(this.x, this.y);
	}
	set(v:Vector) {
		this.x = v.x;
		this.y = v.y;
	}
	setXY(x:number, y:number) {
		this.x = x;
		this.y = y;
	}
	toJson():{x:number,y:number}{
		return {
			x:this.x,
			y:this.y,
		}
	}
	equals(v:Vector):boolean{
		return v.x==this.x&&v.y==this.y;
	}
	toArray():number[]{
		return [this.x,this.y];
	}
	static dist(v1:Vector, v2:Vector) {
		let sub = Vector.sub(v1, v2);
		return Vector.mag(sub);
	}
	static mag(v:Vector) {
		return Math.sqrt(v.x * v.x + v.y * v.y);
	}
	static sub(v1:Vector, v2:Vector) {
		return new Vector(v1.x - v2.x, v1.y - v2.y);
	}
	static add(v1:Vector, v2:Vector) {
		return new Vector(v1.x + v2.x, v1.y + v2.y);
	}
	
}

export default Vector;