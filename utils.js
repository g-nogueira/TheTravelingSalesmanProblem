'using strict';

function shuffleList(list) {
    // let temp = list.slice();
    // return temp.sort(() => 0.5 - Math.random());

    let input = list.slice();
    const length = input.length;
     
    for (let i = length-1; i >=0; i--) {
     
        const randomIndex = Math.floor(Math.random()*(i+1)); 
        const itemAtIndex = input[randomIndex]; 
         
        input[randomIndex] = input[i]; 
        input[i] = itemAtIndex;
    }
    return input;
}

/**
 * @summary Generates random coordinates betwen given x, y values.
 * @param {Object} maxValues The max coordinates values.
 * @param {number} maxValues.x The maximum coordinates in the x axis.
 * @param {number} maxValues.y The maximum coordinates in the y axis.
 * @param {number} quantity The size of the array returned.
 */
function generateRndCoords(maxValues, quantity) {

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
 * @param {Object} point1 The first coordinate.
 * @param {Object} point2 The second coordinate.
 */
function calcDistance(point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}