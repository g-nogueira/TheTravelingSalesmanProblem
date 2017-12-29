'using strict';

let popSize = 100;
let citiesQtd = 10;
let generationsQtd = 1000;
let mutationProb = 0.3;
let gridSize = { x: 100, y: 100 };

//generateGrid(gridSize);
const cities = generateRndCoords(gridSize, citiesQtd);

//#region Population initialization
let population = generatePopulation(popSize); //of Chromosomes.
population = calculateFitness(population); //Calculates the fitness of the population and returns itself.
console.log(population);

const parents = generateParents(population); //Array of parents. Each group has one "male" and one "female" chromosome.
const tempOffspring = generateOffspring(parents); //Generate offspring through parents' array.
//#endregion

//#region Optimization loop
// for (let i = 0; i < generationsQtd; i++) {
//     const parents = generateParents(population); //Array of parents. Each group has one "male" and one "female" chromosome.
//     const tempOffspring = generateOffspring(parents); //Generate offspring through parents' array.
//     population = mutateOffspring({ offspring: tempOffspring, mutationProb: mutationProb }); //Mutates by chance the offspring and returns itself.
// }
//#endregion


/************************************************************************************
 *                              IMPLEMENTATION
 *   
 * ⚠ Last gene of every parent is generated as the same. Check 🔎 "generateParents" function.
 *
 * ✔ 1. Generate a set of Chromosomes (Population) formed by a random generated genes
 * ✔ 2. Calculate the fitness of each chromosome by getting the total distance traveled
 *      The distances are represented by negative numbers, so the larger distance will be the smaller fitness
 * ✔ 3. Select by chance random chromosomes to be parents
 * ✔ 4. Crossover parents to generate offspring
 * ✖ 5. Mutate offspring by chance.
 * 
 ************************************************************************************/

/**
 * @summary Generates the initial population with given size
 * @param {number} size The size of the population
 */
function generatePopulation(size) {

    let chromosomes = [];
    //generates n times chromosomes
    for (let i = 0; i < size; i++) {

        const genes = shuffleList(cities);
        const chromosome = new Chromosome(genes);

        chromosomes.push(chromosome);
    }

    return chromosomes;
}

/**
 * @summary Calculates the fitness of each chromosome in the provided array.
 * @param {Array} Population The chromosomes array.
 * @returns {Array} New population based on old one with the fitness calculated.
 * @
 */
function calculateFitness(population) {

    const genesLength = population[0].genes.length;
    const pop = population;
    pop.forEach((el, index) => {

        for (let i = 0; i < genesLength - 1; i++) {
            el.fitness += 0 - calcDistance(el.genes[i], el.genes[i + 1]);
        }

    });

    return pop;
}

/**
 * @summary Generates parents from given population
 * @param {Array} population A population array
 * @returns {Array} Parents array.
 */
function generateParents(population) {
    let parents = [];
    const newChroms = population.slice();
    const totalFitness = population.reduce((acc, cur) => { return acc + cur.fitness }, 0);

    newChroms.forEach(chrom => chrom.weight = chrom.fitness / totalFitness); //set the id as the weight of each chromosome based on the fitness
    newChroms.sort((a, b) => a.weight - b.weight);

    const max = newChroms[popSize - 1].weight; //the max possible random value

    for (let i = 0; i < popSize; i++) {

        let p = [];

        for (let i = 0; i < 2; i++) {
            const rnd = Math.random() * max;
            p.push(newChroms.find(chrom => chrom.weight >= rnd));
        }
        parents.push(p);
    }
    return parents;
}

/**
 * @summary Generates offspring from given parents.
 * @param {Array} parents A parents array
 * @returns {Array} Offspring array.
 */
function generateOffspring(parents) {
    const genesLength = parents[0][0].genes.length;
    const genesToCross = Math.ceil(genesLength * 0.3);
    let offspring = [];

    parents.forEach(el => {

        //Gets 3 genes and push to a new array;
        let tempGenes = el[0].genes.slice(genesLength - 1 - genesToCross, genesLength - 1);

        let parentPartGenes = el[1].genes.slice(genesLength - 1 - genesToCross, genesLength - 1);
        const genesToInsert = el[1].genes.slice(0, genesLength - 1 - genesToCross);

        genesToInsert.forEach((el, i) => tempGenes.splice(i, 0, el));
        tempGenes.push(el[1].genes[genesLength - 1]);

        parentPartGenes = parentPartGenes.filter(el => !tempGenes.includes(el));

        let z = 0;
        tempGenes.forEach((el, i) => {

            //Searches for an element el, starting after the element: searcher for duplicates
            if (tempGenes.includes(el, i + 1)) {
                tempGenes[i] = parentPartGenes[z];
                ++z;
            }
        });

        offspring.push(new Chromosome(tempGenes));
    });

    return offspring;
}