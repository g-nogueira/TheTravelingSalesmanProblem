'using strict';

let x = undefined;
//⚠ SINGLETON CLASS
class Utils {
    constructor() {
        if (this !== x && x) {
            return utils;
        }
    }

    /**
     * @summary Randomly shuffles given array.
     * @param {Array} list The list to randomly shuffle
     */
    shuffleList(list) {
        // let temp = list.slice();
        // return temp.sort(() => 0.5 - Math.random());

        let input = list.slice();
        const length = input.length;

        for (let i = length - 1; i >= 0; i--) {

            const randomIndex = Math.floor(Math.random() * (i + 1));
            const itemAtIndex = input[randomIndex];

            input[randomIndex] = input[i];
            input[i] = itemAtIndex;
        }
        return input;
    }

    /**
     * @summary Generates random coordinates betwen given x, y values.
     * @param {object} maxValues The max coordinates values.
     * @param {number} maxValues.x The maximum coordinates in the x axis.
     * @param {number} maxValues.y The maximum coordinates in the y axis.
     * @param {number} quantity The size of the array returned.
     */
    generateRndCoords(maxValues, quantity) {

        let coordinates = [];
        for (let i = 0; i < quantity; i++) {
            const x = Math.floor(Math.random() * maxValues.x);
            const y = Math.floor(Math.random() * maxValues.y);

            coordinates.push({ x: x, y: y });
        }
        return coordinates;
    }

    /**
     * @summary Calculates the distance between two given points.
     * @param {object} point1 The first coordinate.
     * @param {object} point2 The second coordinate.
     */
    calcDistance(point1, point2) {
        try {
            return Math.sqrt(((point2.x - point1.x) ** 2) + ((point2.y - point1.y) ** 2));
        } catch (error) {
            window.alert(error);
            return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
        }
    }

    /**
     * 
     * @param {object} canvas The canvas parameters.
     * @param {HTMLCanvasElement} canvas.canvas TThe canvas element.
     * @param {string} canvas.color The color of the background.
     * @param {number} canvas.width The width of the canvas.
     * @param {number} canvas.height The height of the canvas.
     * @param {number} canvas.xStart The start place of the canvas in the x axis.
     * @param {number} canvas.yStart The start place of the canvas in the y axis.
     */
    drawCanvas(canvas) {
        
        canvas.canvas.setAttribute('width', canvas.width + 10);
        canvas.canvas.setAttribute('height', canvas.height + 10);
        const ctx = canvas.canvas.getContext('2d');
        ctx.fillStyle = canvas.color;
        ctx.fillRect(canvas.xStart, canvas.yStart, canvas.width, canvas.height);
    }

    /**
     * 
     * @param {object} center The x, y coordinates of the center of the circle.
     * @param {number} center.x The x coordinate of the center of the circle.
     * @param {number} center.y The y coordinate of the center of the circle.
     * @param {object} params The circle parameters. 
     * @param {number} params.radius The radius of the circle.
     * @param {HTMLCanvasElement} params.canvas The canvas element.
     * @param {string} params.color of the stroke.
     * @param {string} params.style Stroke or fill circle.
     */
    drawCircle(params, center) {
        const ctx = params.canvas.getContext('2d');
        ctx.arc(center.x, center.y, params.radius, 0, 2 * Math.PI);

        const style = {
            stroke: () => {
                ctx.strokeStyle = params.color;
                ctx.stroke();
            },
            fill: () => {
                ctx.fillStyle = params.color;
                ctx.fill();
            }
        };
        style[params.style]();

    }
}

const utils = new Utils();
x = utils;
Object.defineProperty(utils, "__proto__", {
    enumerable: true,
    configurable: false,
    writable: false
});