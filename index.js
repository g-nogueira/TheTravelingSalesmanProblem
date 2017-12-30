'using strict';

let popSize = 100;
let citiesQtd = 10;
let generationsQtd = 200;
let mutationProb = 0.3;
let gridSize = { x: 100, y: 100 };

//generateGrid(gridSize);
const cities = generateRndCoords(gridSize, citiesQtd);
let population = generatePopulation(popSize); //of Chromosomes.
let parents = [];
let tempOffspring = [];


//#region Optimization loop
for (let i = 0; i < generationsQtd; i++) {
    population = calculateFitness(population); //Calculates the fitness of the population and returns itself.
    parents = generateParents(population); //Array of parents. Each group has one "male" and one "female" chromosome.
    tempOffspring = generateOffspring(parents); //Generate offspring through parents' array.
    tempOffspring.forEach((el, g, array) => {
        let t = i;
        if (hasUndefined(el.genes)) {
            debugger;
        }
    });

    population = mutateOffspring(tempOffspring, mutationProb); //Mutates by chance the offspring and returns itself.
}
population = calculateFitness(population); //Calculates the fitness of the population and returns itself.
let temp = population.map(el => el.fitness)
let best = temp.reduce((a, b) => Math.min(a, b));
let bestChromosome = population.find(el => el.fitness = best); //⚠ Shown here gene repetition
console.log(population);
//#endregion


/************************************************************************************
 *                              IMPLEMENTATION
 *   
 * ⚠ It is repeating genes. Check 🔎 "generateParents" function.
 * ⚠ CORRECTED - Last gene of every parent is generated as the same. Check 🔎 "generateParents" function.
 *
 * ✔ 1. Generate a set of Chromosomes (Population) formed by a random generated genes
 * ✔ 2. Calculate the fitness of each chromosome by getting the total distance traveled
 *      The distances are represented by negative numbers, so the larger distance will be the smaller fitness
 * ✔ 3. Select by chance random chromosomes to be parents
 * ✔ 4. Crossover parents to generate offspring
 * ✔ 5. Mutate offspring by chance.
 * 
 ************************************************************************************/

/**
 * @summary Generates the initial population with given size
 * @param {number} size The size of the population
 */
function generatePopulation(size) {

    let chromosomes = [];
    //generates n times chromosomes
    for (let x = 0; x < size; x++) {

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

        for (let z = 0; z < genesLength - 1; z++) {
            el.fitness += 0 - calcDistance(el.genes[z], el.genes[z + 1]);
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

    //set the weight as the id of each chromosome based on the fitness
    newChroms.forEach((chrom, c) => chrom.weight = (chrom.fitness / totalFitness) + ((newChroms[c - 1]) ? newChroms[c - 1].weight : 0));

    for (let a = 0; a < popSize; a++) {

        let p = [];

        for (let b = 0; b < 2; b++) {
            const rnd = Math.random();
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
    // parents.forEach((el, g, array) => {
    //     el.forEach(elm => {
    //         if (hasUndefined(elm.genes)) {
    //             debugger;
    //         }
    //     });
    // });
    const genesLength = parents[0][0].genes.length;
    const genesToCross = Math.ceil(genesLength * 0.3);
    let offspring = [];

    parents.forEach(el => {

        //Gets 3 genes and push to a new array;
        let tempGenes = el[0].genes.slice(genesLength - 1 - genesToCross, genesLength - 1);
        const genesToInsert = el[1].genes.slice(0, genesLength - 1 - genesToCross);
        genesToInsert.forEach((el, d) => tempGenes.splice(d, 0, el));
        tempGenes.push(el[1].genes[genesLength - 1]);
        parentPartGenes = cities.filter(el => !tempGenes.includes(el));

        let z = 0;
        tempGenes.forEach((el, f) => {

            //Searches for an element el, starting after the element: searcher for duplicates
            if (tempGenes.includes(el, f + 1)) {
                tempGenes[f] = parentPartGenes[z];
                if (!tempGenes[f]) {
                    debugger;
                }
                z + 1;
            }
        });

        offspring.push(new Chromosome(tempGenes));
    });

    return offspring;
}

/**
 * @summary Mutates each offspring based on mutation probability.
 * @param {Array} offspring The offspring array.
 * @param {number} probability The mutation probability value.
 */
function mutateOffspring(offspring, probability) {

    let offsp = offspring.slice();
    const geneSize = offsp[0].genes.length;

    offsp.forEach(el => {

        const rnd = Math.random();

        if (probability >= rnd) {
            const rnd01 = Math.floor(Math.random() * geneSize);
            let rnd02 = 0;
            do {
                rnd02 = Math.floor(Math.random() * geneSize);
            } while (rnd02 === rnd01);

            // [el.genes[rnd01], el.genes[rnd02]] = [el.genes[rnd02], el.genes[rnd01]];
            const a = el.genes[rnd01];
            const b = el.genes[rnd02];
            el.genes[rnd01] = b;
            el.genes[rnd02] = a;
        }

    });

    return offsp;
}

function hasUndefined(list) {
    return !list.every(el => el);
}