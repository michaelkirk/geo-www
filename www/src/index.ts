import * as wasm from "geo-www";

export async function insertConcaveHullExample(el: HTMLElement) {
    // it's weird that we have to do this... but I think it's required.
    // the wasm module exports are a promise (despite what the type defs say).
    // I *believe* this is an unavoidable condition of working with wasm at the
    // moment, and have yet to see an example to the contrary.
    let geo_www = await wasm;
    geo_www.greet();

    let canvas = new Canvas();
    el.appendChild(canvas.el);

    const points = [
        new Point(200, 200),
        new Point(250, 100),
        new Point(400, 200),
        new Point(130, 250),
    ];

    const linePoints = points.map((p) => p.translated(150.0, -10.0));
    const lineString = new LineString(linePoints);

    let polygonExterior = lineString.translated(100.0, 150.0);
    polygonExterior.pushPoint(polygonExterior.points[0]);
    let polygon = new Polygon(polygonExterior);

    canvas.pushDrawables(points);
    canvas.pushDrawables([lineString]);
    canvas.pushDrawables([polygon]);

    canvas.render();
}

class LineString implements Drawable {
    points: Point[]
    constructor(points: Point[]) {
        this.points = points;
    }

    pushPoint(point: Point) {
        this.points.push(point);
    }

    translated(dx: number, dy: number): LineString {
        return new LineString(this.points.map(p => p.translated(dx, dy)))
    }

    // Drawable
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();

        // TODO: validity
        ctx.moveTo(this.points[0].x, this.points[0].y);

        for (const point of this.points.slice(1)) {
            ctx.lineTo(point.x, point.y);
        }

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

class Polygon implements Drawable {
    exterior: LineString;
    interiors: LineString[];
    constructor(exterior: LineString, interiors: LineString[] = []) {
        this.exterior = exterior;
        this.interiors = interiors;
    }

    // Drawable
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();

        // TODO: validity
        ctx.moveTo(this.exterior.points[0].x, this.exterior.points[0].y);

        for (const point of this.exterior.points.slice(1)) {
            ctx.lineTo(point.x, point.y);
        }

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.save();
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.restore();

    }
}

class Point implements Drawable {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    scaled(f: number) {
        return new Point( this.x * f, this.y * f);
    }

    translated(dx: number, dy: number) {
        return new Point( this.x + dx, this.y + dy);
    }

    // Is this really how you do this?
    copy() {
        return new Point(this.x, this.y);
    }

    // Drawable
    draw(ctx: CanvasRenderingContext2D): void {
        const radius = 10;

        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }
}


interface Drawable {
    draw(ctx: CanvasRenderingContext2D): void;
};

class Canvas {
    drawables: Drawable[];
    el: HTMLCanvasElement;

    constructor() {
        this.el = document.createElement("canvas");
        this.el.width = 800;
        this.el.height = 400;
        this.el.style.backgroundColor = "blue";
        this.drawables = new Array();
    }

    pushDrawables(drawables: Drawable[]) {
        this.drawables.push(...drawables);
    }

    render() {
        const ctx = this.el.getContext('2d')!;
        for (const drawable of this.drawables) {
            drawable.draw(ctx);
        }
    }
}
