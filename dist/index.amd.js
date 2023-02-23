define((function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    class Vector {
        constructor(x, y) {
            this.x = 0;
            this.y = 0;
            this.x = x;
            this.y = y;
        }
        add(v) {
            this.x += v.x;
            this.y += v.y;
        }
        sub(v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        }
        mult(v) {
            this.x *= v.x;
            this.y *= v.y;
            return this;
        }
        div(v) {
            this.x /= v.x;
            this.y /= v.y;
            return this;
        }
        mag() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
        dist(v) {
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
        clamp(c) {
            let [max, min] = c;
            this.x = Math.min(Math.max(this.x, min), max);
            this.y = Math.min(Math.max(this.y, min), max);
        }
        copy() {
            return new Vector(this.x, this.y);
        }
        set(v) {
            this.x = v.x;
            this.y = v.y;
        }
        setXY(x, y) {
            this.x = x;
            this.y = y;
        }
        toJson() {
            return {
                x: this.x,
                y: this.y,
            };
        }
        toArray() {
            return [this.x, this.y];
        }
        static dist(v1, v2) {
            let sub = Vector.sub(v1, v2);
            return Vector.mag(sub);
        }
        static mag(v) {
            return Math.sqrt(v.x * v.x + v.y * v.y);
        }
        static sub(v1, v2) {
            return new Vector(v1.x - v2.x, v1.y - v2.y);
        }
    }

    class Point extends Vector {
        constructor(x, y) {
            super(x, y);
        }
        toArray() {
            return [this.x, this.y];
        }
    }
    /**
     * 包裹图片Rect的矩阵点，通常为4个点
     */
    class Vertex {
        constructor(points) {
            this.points = new Array();
            this.points = points.map((item) => {
                const [x, y] = item;
                return new Point(x, y);
            });
        }
        setPoints(points) {
            this.points = points;
        }
        getPoints() {
            return this.points;
        }
        /**
         * @description 根据传入角度，旋转该类的顶点
         * @param angle
         * @param rect
         */
        rotate(angle, rect) {
            const cos_ = Math.cos(angle), sin_ = Math.sin(angle);
            const rotateAngle = (point) => {
                const x = point.x * cos_ - point.y * sin_;
                const y = point.x * sin_ + point.y * cos_;
                return [x, y];
                // const mf = [
                // 	[cos_, (sin_*-1) , 0],
                // 	[sin_, cos_, 0],
                // 	[0, 0, 1]
                // ];
            };
            const len = this.points.length;
            for (let i = 0; i < len; i++) {
                const point = this.points[i];
                const [x, y] = rotateAngle(point);
                point.x = x + rect.position.x;
                point.y = y + rect.position.y;
            }
        }
        /**
         * @description 矫正位置
         * @param rect
         */
        correctPosition(rect) {
            const len = this.points.length;
            for (let i = 0; i < len; i++) {
                const point = this.points[i];
                point.x += rect.position.x;
                point.y += rect.position.y;
            }
        }
        drawPoints(paint) {
            this.points.forEach((point) => {
                paint.fillRect(point.x, point.y, 3, 3);
            });
        }
    }

    class Line {
        constructor(p1, p2) {
            this.p1 = p1;
            this.p2 = p2;
        }
    }
    class CheckInside {
        onLine(l1, p) {
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
        checkInsideArc(p1, p2, radius) {
            return Vector.dist(p1, p2) < radius;
        }
        direction(a, b, c) {
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
        isIntersect(l1, l2) {
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
            let tmp = new Point(9999, p.y);
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

    class CatchPointUtil {
        /**
         *
         * @param imageBox
         * @param event
         * @returns
         */
        static catchImageBox(imageBoxList, position) {
            const len = imageBoxList.length - 1;
            for (let i = len; i >= 0; i--) {
                const item = imageBoxList[i];
                if (CatchPointUtil.inArea(item.rect, position)) {
                    return item;
                }
            }
            return null;
        }
        static inArea(rect, position) {
            const points = rect.vertex.getPoints();
            const point = new Point(position.x, position.y);
            return !!CatchPointUtil._checkInside.checkInside(points, 4, point);
        }
        /**
         * @param {Vector} p1
         * @param {Vector} p2
         * @param {Object} radius
         */
        static checkInsideArc(p1, p2, radius) {
            return Vector.dist(p1, p2) < radius;
        }
    }
    CatchPointUtil._checkInside = new CheckInside;

    class Drag {
        constructor() {
            this.rect = null;
        }
        catchImageBox(rect, position) {
            this.rect = rect;
            this.offset = {
                offsetx: this.rect.position.x - position.x,
                offsety: this.rect.position.y - position.y,
            };
        }
        cancel() {
            this.rect = null;
        }
        update(position) {
            if (this.rect == null)
                return;
            if (this.rect.beforeDrag != null)
                this.rect.beforeDrag(this.rect);
            this.rect.position.setXY(~~(position.x + this.offset.offsetx), ~~(position.y + this.offset.offsety));
            if (this.rect.onDrag != null)
                this.rect.onDrag(this.rect);
        }
    }

    class GestiEventManager {
        getEvent(kit) {
            if (typeof (window) != "undefined") {
                const isMobile = /Mobile/.test(navigator.userAgent);
                if (isMobile)
                    return new GestiTouchEvent(kit);
                return new GestiMouseEvent(kit);
            }
            else if (typeof (wx) != "undefined") {
                return null;
            }
            return new GestiTouchEvent(kit);
        }
    }
    class GestiTouchEvent {
        constructor(kit) {
            this.disabled = false;
            this.kit = kit;
        }
        disable() {
            this.disabled = true;
        }
        twoFingers(touches) {
            const e1 = touches[0];
            const e2 = touches[1];
            const vector1 = new Vector(e1.clientX, e1.clientY);
            const vector2 = new Vector(e2.clientX, e2.clientY);
            return [vector1, vector2];
        }
        down(down) {
            window.addEventListener('touchstart', (_e) => {
                if (this.disabled)
                    return;
                const touches = _e.targetTouches;
                if (touches.length >= 2) {
                    down.bind(this.kit)(this.twoFingers(touches));
                }
                else {
                    const e = touches[0];
                    const vector = new Vector(e.clientX, e.clientY);
                    down.bind(this.kit)(vector);
                }
            });
            return this;
        }
        up(up) {
            window.addEventListener('touchend', (_e) => {
                if (this.disabled)
                    return;
                const e = _e.changedTouches[0];
                const vector = new Vector(e.clientX, e.clientY);
                up.bind(this.kit)(vector);
            });
            return this;
        }
        move(move) {
            window.addEventListener('touchmove', (_e) => {
                if (this.disabled)
                    return;
                const touches = _e.targetTouches;
                if (touches.length >= 2) {
                    move.bind(this.kit)(this.twoFingers(touches));
                }
                else {
                    const e = touches[0];
                    const vector = new Vector(e.clientX, e.clientY);
                    move.bind(this.kit)(vector);
                }
            });
            return this;
        }
        wheel(whell) {
            //手机端不用适配
        }
    }
    class GestiMouseEvent {
        constructor(kit) {
            this.kit = kit;
        }
        disable() {
            throw new Error("Method not implemented.");
        }
        twoFingers(touches) {
            return [];
        }
        down(down) {
            window.addEventListener('mousedown', (e) => {
                const vector = new Vector(e.clientX, e.clientY);
                if (this.disabled)
                    return;
                down.bind(this.kit)(vector);
            });
            return this;
        }
        up(up) {
            window.addEventListener('mouseup', (e) => {
                const vector = new Vector(e.clientX, e.clientY);
                if (this.disabled)
                    return;
                up.bind(this.kit)(vector);
            });
            return this;
        }
        move(move) {
            window.addEventListener('mousemove', (e) => {
                const vector = new Vector(e.clientX, e.clientY);
                if (this.disabled)
                    return;
                move.bind(this.kit)(vector);
            });
            return this;
        }
        wheel(wheel) {
            window.addEventListener('wheel', (e) => {
                wheel.bind(this.kit)(e);
            });
        }
    }

    class Gesture {
        constructor() {
            this.imageBox = null;
            this.oldRect = null;
            this.oldDist = 0;
            this.oldAngle = -1;
        }
        isTwoFingers(touches) {
            if (Array.isArray(touches) && touches.length == 2)
                return true;
            return false;
        }
        onStart(imageBox, start) {
            this.imageBox = imageBox;
            this.oldRect = this.imageBox.rect.copy();
            this.start = start;
            /**
             * 解构得到两个 @Vector,算出它们的距离，并赋值给 @oldDist
             */
            const [a, b] = this.start;
            this.oldDist = Vector.dist(a, b);
            const v = Vector.sub(a, b);
            this.oldAngle = Math.atan2(v.y, v.x) - this.imageBox.rect.getAngle;
        }
        cancel() {
            this.imageBox = null;
            this.oldRect = null;
        }
        update(positions) {
            if (this.imageBox == null)
                return;
            const [a, b] = positions;
            const dist = Vector.dist(a, b);
            const scale = dist / this.oldDist;
            const newWidth = this.oldRect.size.width * scale, newHeight = this.oldRect.size.height * scale;
            this.imageBox.rect.setSize(newWidth, newHeight);
            const v = Vector.sub(a, b);
            const angle = Math.atan2(v.y, v.x) - this.oldAngle;
            this.imageBox.rect.setAngle(angle);
        }
    }

    class Size {
        constructor(width, height) {
            this.width = width;
            this.height = height;
        }
        toVector() {
            return new Vector(this.width, this.height);
        }
    }
    class Rect {
        constructor(params) {
            this.angle = 0;
            const { width, height, x, y } = params;
            this.size = new Size(width, height);
            this.position = new Vector(x || 0, y || 0);
        }
        updateVertex() {
            const half_w = this.size.width * .5, half_h = this.size.height * .5;
            this.vertex = new Vertex([
                [-half_w, -half_h],
                [+half_w, -half_h],
                [+half_w, +half_h],
                [-half_w, +half_h],
            ]);
            this.vertex.rotate(this.getAngle, this);
        }
        setPotision(x, y) {
            this.position.x = x;
            this.position.y = y;
        }
        setScale(scale) {
            this.size.width *= scale;
            this.size.height *= scale;
        }
        setSize(width, height) {
            this.size.width = width;
            this.size.height = height;
        }
        setAngle(angle) {
            /**
             * 在设置角度同时，以45度为矫正参考，吸附
             */
            let _angle = +angle.toFixed(2);
            this.angle = _angle;
            const _45 = 0.78;
            const limit = 0.1;
            const scale = (this.angle / 0.78) >> 0;
            this.angle = Math.abs(_angle - scale * _45) < limit ? scale * _45 : _angle;
        }
        get getAngle() {
            return this.angle;
        }
        copy() {
            return new Rect({
                width: this.size.width,
                height: this.size.height,
                x: this.position.x,
                y: this.position.y
            });
        }
    }

    /*使用Canvas渲染一些小部件*/
    class Widgets {
        /**
         * @param {Object} paint
         * @param {Vector} offset
         */
        static drawGrag(paint, offset) {
            const scale = .08;
            const { offsetx, offsety } = offset;
            // 填充三角形
            paint.beginPath();
            paint.fillStyle = "#c1c1c1";
            paint.moveTo(25 * scale + offsetx, 25 * scale + offsety);
            paint.lineTo(105 * scale + offsetx, 25 * scale + offsety);
            paint.lineTo(25 * scale + offsetx, 105 * scale + offsety);
            paint.fill();
            paint.moveTo(125 * scale + offsetx, 125 * scale + offsety);
            paint.lineTo(125 * scale + offsetx, 45 * scale + offsety);
            paint.lineTo(45 * scale + offsetx, 125 * scale + offsety);
            paint.closePath();
            paint.fill();
        }
        static drawMirror(paint, offset) {
            const scale = .3;
            const { offsetx, offsety } = offset;
            paint.beginPath();
            paint.fillStyle = "#c1c1c1";
            paint.moveTo(10 * scale + offsetx, 5 * scale + offsety);
            paint.lineTo(0 * scale + offsetx, 15 * scale + offsety);
            paint.lineTo(10 * scale + offsetx, 25 * scale + offsety);
            paint.moveTo(30 * scale + offsetx, 5 * scale + offsety);
            paint.lineTo(40 * scale + offsetx, 15 * scale + offsety);
            paint.lineTo(30 * scale + offsetx, 25 * scale + offsety);
            paint.moveTo(17 * scale + offsetx, 0 * scale + offsety);
            paint.lineTo(23 * scale + offsetx, 0 * scale + offsety);
            paint.lineTo(23 * scale + offsetx, 30 * scale + offsety);
            paint.lineTo(17 * scale + offsetx, 30 * scale + offsety);
            paint.closePath();
            paint.fill();
        }
        static drawClose(paint, offset) {
            const scale = .7;
            const { offsetx, offsety } = offset;
            paint.beginPath();
            paint.strokeStyle = "#c1c1c1";
            paint.lineWidth = 2;
            paint.moveTo(0 * scale + offsetx, 0 * scale + offsety);
            paint.lineTo(10 * scale + offsetx, 10 * scale + offsety);
            paint.moveTo(10 * scale + offsetx, 0 * scale + offsety);
            paint.lineTo(0 * scale + offsetx, 10 * scale + offsety);
            paint.stroke();
            paint.lineWidth = 1;
            paint.closePath();
        }
    }

    class DragButton {
        constructor(imageBox) {
            this.oldImageBoxRect = null;
            this.oldRadius = 0;
            this.oldAngle = 0;
            this.radius = 10;
            this.disable = false;
            this.update(imageBox);
        }
        get getOldAngle() {
            return this.oldAngle;
        }
        update(imageBox) {
            this.imageBox = imageBox;
            const { width, height } = this.imageBox.rect.size;
            let oldButtonRect;
            if (this.imageBox.getDragButton != null)
                oldButtonRect = this.imageBox.getDragButton.rect.copy();
            this.rect = new Rect({
                x: width * .5,
                y: height * .5,
                width: this.radius,
                height: this.radius,
            });
            this.oldRadius = Vector.mag(this.rect.position);
            this.oldAngle = Math.atan2(~~this.rect.position.y, ~~this.rect.position.x);
            if (this.imageBox.getDragButton != null)
                this.rect.position = oldButtonRect.position;
            /**
             * @param {ImageRect} newRect 新的万向点Rect三个月还有
             * @description 万向点的坐标是基于 @ImageBox 内的Rect @ImageRect 的，所以得到的一直是相对坐标
             */
            this.rect.onDrag = (newRect) => {
                /*拖拽缩放*/
                this.changeScale(newRect);
                this.rect = newRect;
                //this.hide();
            };
        }
        changeScale(newRect) {
            const oldRect = this.oldImageBoxRect;
            const offsetx = newRect.position.x - oldRect.position.x, offsety = newRect.position.y - oldRect.position.y;
            /*等比例缩放*/
            const scale = Vector.mag(new Vector(offsetx, offsety)) / this.oldRadius;
            /*不适用于scale函数，需要基于原大小改变*/
            const newWidth = ~~(oldRect.size.width * scale), newHeight = ~~(oldRect.size.height * scale);
            this.imageBox.rect.setSize(newWidth, newHeight);
            /*this.oldAngle为弧度，偏移量*/
            const angle = Math.atan2(offsety, offsetx) - this.oldAngle;
            this.imageBox.rect.setAngle(angle);
        }
        onSelected() {
            this.oldImageBoxRect = this.imageBox.rect.copy();
        }
        hide() {
            this.disable = true;
        }
        show() {
            this.disable = false;
        }
        draw(paint) {
            if (this.disable)
                return;
            const { width, height } = this.imageBox.rect.size;
            const halfRadius = this.radius * .75;
            const halfWidth = width >> 1, halfHeight = height >> 1;
            //镜像
            {
                paint.beginPath();
                paint.fillStyle = "#fff";
                paint.arc(-halfWidth, halfHeight, this.radius, 0, Math.PI * 2);
                paint.closePath();
                paint.fill();
                Widgets.drawMirror(paint, {
                    offsetx: -halfWidth - halfRadius + 1,
                    offsety: height / 2 - halfRadius + 3
                });
            }
            //叉叉
            {
                paint.beginPath();
                paint.fillStyle = "#fff";
                paint.arc(halfWidth, -halfHeight, this.radius, 0, Math.PI * 2);
                paint.closePath();
                paint.fill();
                Widgets.drawClose(paint, {
                    offsetx: halfWidth - halfRadius + 4,
                    offsety: -height / 2 - 3
                });
            }
            //拖拽
            {
                paint.beginPath();
                paint.fillStyle = "#fff";
                paint.arc(halfWidth, halfHeight, this.radius, 0, Math.PI * 2);
                paint.closePath();
                paint.fill();
                Widgets.drawGrag(paint, {
                    offsetx: halfWidth - halfRadius + 2,
                    offsety: halfHeight - halfRadius + 2
                });
            }
        }
    }

    class ImageBox {
        set setDragButton(dragButton) {
            this.dragButton = dragButton;
        }
        get getDragButton() {
            return this.dragButton;
        }
        constructor(image) {
            this.selected = false;
            this.scale = 1;
            this.key = +new Date();
            this.isMirror = false;
            this.disabled = false;
            this.image = image.data;
            this.ximage = image;
            this.rect = new Rect(image.toJson());
            this.beforeRect = this.rect.copy();
        }
        update(paint) {
            this.drawImage(paint);
        }
        drawImage(paint) {
            paint.beginPath();
            paint.save();
            paint.translate(this.rect.position.x, this.rect.position.y);
            paint.rotate(this.rect.getAngle);
            if (this.isMirror)
                paint.scale(-1, 1);
            paint.drawImage(this.image, this.rect.position.x, this.rect.position.y, this.rect.size.width, this.rect.size.height);
            // paint.fillRect(-this.rect.size.width / 2, -this.rect.size.height / 2, this.rect.size.width,
            // 	this.rect.size.height);
            if (this.isMirror)
                paint.scale(-1, 1);
            if (this.selected) {
                this.drawStroke(paint);
                this.drawAnchorpoint(paint);
            }
            paint.restore();
            paint.translate(0, 0);
            /*更新顶点数据*/
            this.rect.updateVertex();
            /*渲染顶点*/
            //this.rect.vertex.drawPoints(paint);
            paint.closePath();
        }
        drawStroke(paint) {
            paint.lineWidth = 1;
            paint.strokeStyle = "#fff";
            paint.strokeRect(-this.rect.size.width >> 1, -this.rect.size.height >> 1, this.rect.size.width + 1, this.rect.size.height +
                1);
            paint.stroke();
        }
        drawAnchorpoint(paint) {
            const rect = this.rect;
            const x = rect.position.x, y = rect.position.y;
            if (this.dragButton == null) {
                this.dragButton = new DragButton(this);
            }
            if (this.selected) {
                const len = Vector.mag(rect.size.toVector());
                const newx = Math.cos(this.rect.getAngle + this.dragButton.getOldAngle) * (len >> 1) + x;
                const newy = Math.sin(this.rect.getAngle + this.dragButton.getOldAngle) * (len >> 1) + y;
                this.dragButton.rect.setPotision(~~newx, ~~newy);
            }
            this.dragButton.draw(paint);
        }
        checkFuncButton(eventPosition) {
            const button = this.dragButton;
            /**
             * 选中拖拽按钮直接返回拖拽按钮
             */
            const isSelectDragButton = CatchPointUtil.checkInsideArc(button.rect.position, eventPosition, button
                .radius);
            if (isSelectDragButton)
                return button;
            /**
             * 没有选中拖拽按钮判断点击了哪个功能按钮
             */
            const vertexs = this.getVertex();
            const checkPoint = () => {
                const len = vertexs.length;
                for (let i = 0; i < len; i++) {
                    const point = vertexs[i];
                    if (CatchPointUtil.checkInsideArc(point, eventPosition, button.radius))
                        return i;
                }
                return -1;
            };
            const selectedPointNdx = checkPoint();
            if (selectedPointNdx == -1)
                return false;
            switch (selectedPointNdx) {
                case 0:
                    break;
                case 1:
                    {
                        this.hide();
                    }
                    break;
                case 3:
                    {
                        this.isMirror = !this.isMirror;
                    }
                    break;
            }
            return true;
            //	const isSelectDragButton:boolean
        }
        hide() {
            this.disabled = true;
        }
        getVertex() {
            return this.rect.vertex.getPoints();
        }
        onSelected() {
            this.selected = true;
        }
        cancel() {
            this.selected = false;
        }
        onUp(paint) {
            //console.log("up",this.rect.position)
            /*在抬起鼠标时，ImageBox还没有被Calcel，为再次聚焦万向按钮做刷新数据*/
            this.dragButton.update(this);
        }
        enlarge() {
            this.scale = 1;
            this.scale += .1;
            this.doScale();
        }
        narrow() {
            this.scale = 1;
            this.scale -= .1;
            this.doScale();
        }
        doScale() {
            this.rect.size.width *= this.scale;
            this.rect.size.height *= this.scale;
            /*每次改变大小后都需要刷新按钮的数据*/
            this.dragButton.update(this);
        }
    }

    /*
        使用代理模式重写Painter，兼容原生Painter
    */
    class Painter {
        constructor(paint) {
            this.paint = null;
            this.paint = paint;
        }
        //仅限window
        get canvas() {
            if (typeof (window) != "undefined")
                return this.paint.canvas;
            return undefined;
        }
        set fillStyle(style) {
            this.paint.fillStyle = style;
        }
        set lineWidth(width) {
            this.paint.lineWidth = width;
        }
        set strokeStyle(style) {
            this.paint.strokeStyle = style;
        }
        draw() {
            var _a;
            (_a = this.paint) === null || _a === void 0 ? void 0 : _a.draw();
        }
        strokeRect(x, y, w, h) {
            this.paint.strokeRect(x, y, w, h);
        }
        fillRect(x, y, w, h) {
            this.paint.fillRect(x, y, w, h);
        }
        stroke() {
            this.paint.stroke();
        }
        clearRect(x, y, w, h) {
            if (typeof (uni) != 'undefined')
                this.draw();
            else
                this.paint.clearRect(x, y, w, h);
        }
        save() {
            this.paint.save();
        }
        rotate(angle) {
            this.paint.rotate(angle);
        }
        beginPath() {
            this.paint.beginPath();
        }
        closePath() {
            this.paint.closePath();
        }
        restore() {
            this.paint.restore();
        }
        translate(x, y) {
            this.paint.translate(x, y);
        }
        fill() {
            this.paint.fill();
        }
        arc(x, y, radius, start, end) {
            this.paint.arc(x, y, radius, start, end);
        }
        drawImage(image, x, y, width, height) {
            this.paint.drawImage(image, -width / 2, -height / 2, width, height);
        }
        scale(a, b) {
            this.paint.scale(a, b);
        }
        moveTo(x, y) {
            this.paint.moveTo(x, y);
        }
        lineTo(x, y) {
            this.paint.lineTo(x, y);
        }
        getImageData(x, y, w, h) {
            return this.paint.getImageData(x, y, w, h);
        }
        /*清空画布|刷新画布*/
        update() {
        }
    }

    var EventHandlerState;
    (function (EventHandlerState) {
        EventHandlerState[EventHandlerState["down"] = 0] = "down";
        EventHandlerState[EventHandlerState["up"] = 1] = "up";
        EventHandlerState[EventHandlerState["move"] = 2] = "move";
    })(EventHandlerState || (EventHandlerState = {}));
    class ImageToolkit {
        constructor(paint, rect) {
            this.imageBoxList = new Array();
            this.eventHandlerState = EventHandlerState.up;
            this.drag = new Drag();
            this.gesture = new Gesture();
            this.selectedImageBox = null;
            this.isMultiple = false;
            const { x: offsetx, y: offsety, width, height } = rect;
            this.offset = new Vector(offsetx || 0, offsety || 0);
            this.canvasRect = new Rect(rect);
            this.paint = new Painter(paint);
            this.bindEvent();
        }
        bindEvent() {
            this.eventHandler = new GestiEventManager().getEvent(this);
            if (this.eventHandler == null)
                return;
            this.eventHandler.down(this.down).move(this.move).up(this.up).wheel(this.wheel);
            this.debug(["Event Bind,", this.eventHandler]);
        }
        cancelEvent() {
            if (this.eventHandler == null)
                return;
            this.eventHandler.disable();
        }
        down(v) {
            var _a, _b;
            this.debug(["Event Down,", v]);
            this.eventHandlerState = EventHandlerState.down;
            const event = this.correctEventPosition(v);
            if ((_a = this.selectedImageBox) !== null && _a !== void 0 ? _a : false) {
                if (Array.isArray(event)) {
                    return this.gesture.onStart(this.selectedImageBox, event);
                }
                if (this.checkFuncButton(event))
                    return;
            }
            const selectedImageBox = CatchPointUtil.catchImageBox(this.imageBoxList, event);
            if (selectedImageBox !== null && selectedImageBox !== void 0 ? selectedImageBox : false) {
                if (!this.isMultiple && ((_b = this.selectedImageBox) !== null && _b !== void 0 ? _b : false)) {
                    this.selectedImageBox.cancel();
                }
                this.selectedImageBox = selectedImageBox;
                this.selectedImageBox.onSelected();
                this.drag.catchImageBox(this.selectedImageBox.rect, event);
            }
            this.update();
        }
        move(v) {
            this.debug(["Event Move,", v]);
            if (this.eventHandlerState === EventHandlerState.down) {
                const event = this.correctEventPosition(v);
                //手势
                if (Array.isArray(event)) {
                    this.gesture.update(event);
                    this.update();
                    return;
                }
                //拖拽
                this.drag.update(event);
            }
            this.update();
        }
        up(v) {
            var _a;
            this.debug(["Event Up,", v]);
            this.eventHandlerState = EventHandlerState.up;
            this.drag.cancel();
            if ((_a = this.selectedImageBox) !== null && _a !== void 0 ? _a : false) {
                this.selectedImageBox.onUp(this.paint);
            }
        }
        wheel(e) {
            const { deltaY } = e;
            if (this.selectedImageBox != null) {
                if (deltaY < 0)
                    this.selectedImageBox.enlarge();
                else
                    this.selectedImageBox.narrow();
            }
            this.update();
        }
        correctEventPosition(vector) {
            let _vector = new Array;
            if (Array.isArray(vector)) {
                vector.map((item) => {
                    _vector.push(item.sub(this.offset));
                });
                return _vector;
            }
            return vector.sub(this.offset);
        }
        checkFuncButton(eventPosition) {
            const _dragButton = this.selectedImageBox.checkFuncButton(eventPosition);
            const dragButton = _dragButton;
            if (dragButton.constructor.name == "DragButton") {
                const button = dragButton;
                button.onSelected();
                this.drag.catchImageBox(button.rect, eventPosition);
                return true;
            }
            this.selectedImageBox.cancel();
            this.drag.cancel();
            this.gesture.cancel();
            this.selectedImageBox = null;
            return false;
        }
        update() {
            this.debug("Update the Canvas");
            this.paint.clearRect(0, 0, this.canvasRect.size.width, this.canvasRect.size.height);
            this.imageBoxList.forEach((item) => {
                if (!item.disabled)
                    item.update(this.paint);
            });
        }
        addImage(ximage) {
            this.debug("Add a Ximage");
            if (ximage.constructor.name != "XImage")
                throw Error("不是XImage类");
            const image = ximage;
            image.width *= image.scale;
            image.height *= image.scale;
            image.x = this.canvasRect.size.width >> 1;
            image.y = this.canvasRect.size.height >> 1;
            const imageBox = new ImageBox(image);
            this.imageBoxList.push(imageBox);
            this.update();
        }
        // public toBlob(params: { x?: number, y?: number, width?: number, height?: number, type?: "image/jpeg" | "image/png" | "image/jpg" }): Promise<Blob> {
        //     return new Promise(async (r, e) => {
        //         try {
        //             const data = this.paint.getImageData(params?.x || 0, params?.y || 0, params?.width || this.canvasRect.size.width, params?.height || this.canvasRect.size.height);
        //             const blob = new Blob([data.data], { type: params?.type || "image/png" });
        //             r(blob);
        //         } catch (_e) { e(_e) }
        //     });
        // }
        debug(message) {
            if (!Gesti$1.debug)
                return;
            if (Array.isArray(message))
                console.warn("Gesti debug: ", ...message);
            else
                console.warn("Gesti debug: ", message);
        }
    }

    class XImage {
        constructor(params) {
            this.width = 0;
            this.height = 0;
            this.x = 0;
            this.y = 0;
            this.scale = 1;
            const { data, width, height, scale } = params;
            if (!data || !width || !height)
                throw Error("宽或高不能为0");
            this.data = data;
            this.width = width;
            this.height = height;
            this.scale = scale || 1;
        }
        toJson() {
            return {
                x: this.x,
                y: this.y,
                width: this.width,
                height: this.height,
            };
        }
    }

    /**
     * 初始化该 @Gesti 实例时，由于平台不确定，用户必须传入 @CanvasRenderingContext2D 画笔作为
     */
    class Gesti {
        /*
         * @description 初始化 @Gesti 所代理的画布高宽，在h5端可直接传入 HTMLCanvasElement 自动解析高宽
         * @param @CanvasRenderingContext2D paint
         * @param rect
         */
        init(canvas = null, paint = null, rect = null) {
            if (!canvas && !rect)
                throw Error("未指定Canvas大小或Canvas节点");
            if (typeof (document) != "undefined" && canvas) {
                const canvasRect = canvas.getBoundingClientRect();
                if (canvasRect) {
                    const g = canvas.getContext("2d");
                    this.kit = new ImageToolkit(g, canvasRect);
                    return;
                }
            }
            if (rect)
                this.kit = new ImageToolkit(paint, rect);
        }
        addImage(ximage) {
            return __awaiter(this, void 0, void 0, function* () {
                if (ximage.constructor.name == 'Promise') {
                    const _ximage = yield ximage;
                    this.kit.addImage(_ximage);
                    return true;
                }
                //使用any类型强制转换
                const _ximage = ximage;
                this.kit.addImage(_ximage);
                return true;
            });
        }
        createImage(image, options) {
            return new Promise((r, e) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const bimp = yield createImageBitmap(image);
                    const { width, height } = bimp;
                    const ximage = new XImage({
                        data: bimp,
                        width: (options === null || options === void 0 ? void 0 : options.width) || width,
                        height: (options === null || options === void 0 ? void 0 : options.height) || height,
                        scale: (options === null || options === void 0 ? void 0 : options.scale) || 1,
                        maxScale: (options === null || options === void 0 ? void 0 : options.maxScale) || 10,
                        minScale: (options === null || options === void 0 ? void 0 : options.minScale) || .1,
                    });
                    r(ximage);
                }
                catch (error) {
                    r(error);
                }
            }));
        }
    }
    Gesti.XImage = XImage;
    Gesti.debug = false;
    var Gesti$1 = Gesti;

    return Gesti$1;

}));
