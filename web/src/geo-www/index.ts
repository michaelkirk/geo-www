function insertConcaveHullExample(el: HTMLElement) {
    let canvas = new Canvas();
    el.appendChild(canvas.el);
    canvas.render();

    console.log("hello world" + el);
}

class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Canvas {
    points: Point[];
    el: HTMLCanvasElement;

    constructor() {
        this.el = document.createElement("canvas");
        this.el.width = 800;
        this.el.height = 400;
        this.el.style.backgroundColor = "blue";
        this.points = Array(
            new Point(200, 200),
            new Point(250, 100),
            new Point(400, 200),
            new Point(130, 250),
        );
    }

    render() {
        for (const point of this.points) {
            const context = this.el.getContext('2d')!;
            const radius = 10;

            context.beginPath();
            context.arc(point.x, point.y, radius, 0, 2 * Math.PI, false);
            context.fillStyle = 'green';
            context.fill();
            context.lineWidth = 2;
            context.strokeStyle = '#003300';
            context.stroke();
        }
    }
}
