'using strict';


class Canvas {
    /**
     * @param {HTMLCanvasElement} canvas.canvas TThe canvas element.
     * 
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.context2D = this.canvas.getContext('2d');
        this.properties = {};
    }

    /**
     * 
     * @param {object} properties The canvas parameters.
     * @param {string} properties.color The color of the background.
     * @param {number} properties.width The width of the canvas.
     * @param {number} properties.height The height of the canvas.
     * @param {number} properties.xStart The start place of the canvas in the x axis.
     * @param {number} properties.yStart The start place of the canvas in the y axis.
     */
    initialize(properties = {}) {

        if (this.properties) {
            this.clear();
        }

        this.properties.color = properties.color || this.properties.color || "black";
        this.properties.xStart = properties.xStart || this.properties.xStart || 10;
        this.properties.yStart = properties.yStart || this.properties.yStart || 10;
        this.properties.width = properties.width || this.properties.width || 500;
        this.properties.height = properties.height || this.properties.height || 500;

        this.canvas.setAttribute('width', this.properties.width + 10);
        this.canvas.setAttribute('height', this.properties.height + 10);
        this.context2D.fillStyle = this.properties.color;
        this.context2D.fillRect(this.properties.xStart, this.properties.yStart, this.properties.width, this.properties.height);
    }

    /**
     * 
     * @param {object} center The x, y coordinates of the center of the circle.
     * @param {number} center.x The x coordinate of the center of the circle.
     * @param {number} center.y The y coordinate of the center of the circle.
     * @param {object} properties The circle parameters. 
     * @param {number} properties.radius The radius of the circle.
     * @param {string} properties.color of the stroke.
     * @param {string} properties.style "stroke" or "fill" circle.
     */
    drawCircle(properties, center) {
        properties.color = properties.color || 'white';
        properties.style = properties.style || 'stroke';

        this.context2D.arc(center.x, center.y, properties.radius, 0, 2 * Math.PI);

        const style = {
            stroke: () => {
                this.context2D.strokeStyle = properties.color;
                this.context2D.stroke();
            },
            fill: () => {
                this.context2D.fillStyle = properties.color;
                this.context2D.fill();
            }
        };
        style[properties.style]();

    }

    /**
     * 
     * @param {object} center The x, y coordinates of the center of the circles.
     * @param {object} properties The circle parameters. 
     * @param {number} properties.radius The radius of the circle.
     * @param {string} properties.color of the stroke.
     * @param {string} properties.style Stroke or fill circle.
     * @param {Array} coordinates The list of coordinates to draw.
     */
    drawCircles(properties, coordinates) {
        this.context2D.beginPath();
        coordinates.forEach((coord, i) => {
            this.context2D.moveTo(coord.x + 5, coord.y);
            this.drawCircle({ radius: properties.radius, color: properties.color, style: properties.style }, { x: coord.x, y: coord.y });
        });
    }

    drawPath(coordOne, coordTwo) {
        this.context2D.beginPath();
        this.context2D.moveTo(coordOne.value.x, coordOne.value.y);
        this.context2D.lineTo(coordTwo.value.x, coordTwo.value.y);
        this.context2D.stroke();
    }

    drawPaths(coordinates) {
        this.context2D.beginPath();
        let done = false;
        let list = utils.yieldList(coordinates);
        let list1 = utils.yieldList(coordinates);
        list1.next();

        while (!done) {
            const path = list.next();
            const path1 = list1.next();
            this.context2D.moveTo(path.value.x, path.value.y);
            if (!path1.done) {
                this.context2D.lineTo(path1.value.x, path1.value.y);
            }
            done = path1.done;
        }
        this.context2D.stroke();
    }

    clear() {
        this.context2D.clearRect(this.properties.xStart, this.properties.yStart, this.properties.width, this.properties.height);
    }

}