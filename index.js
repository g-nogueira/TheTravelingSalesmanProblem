/**
 * The complete Triforce, or one or more components of the Triforce.
 * @typedef {Object} Chromosome
 * @property {number} id - Indicates whether the Courage component is present.
 * @property {number} fitness - Indicates whether the Courage component is present.
 * @property {{x: number, y: number}[]} genes - Indicates whether the Power component is present.
 * @property {number} weight - Indicates whether the Wisdom component is present.
 * @property {number} generation - Indicates whether the Wisdom component is present.
 */
(function () {
  "using strict";

  const section = document.getElementById("chromosomesSection");
  const inputCitiesJSON = document.getElementById("citiesJSON");
  const inputBestChromosome = document.getElementById("bestChromosome");
  const btnGetBestChromosome = document.getElementById("getBestChromosome");


  let popSize = document.getElementById("popSize").value;
  let citiesQtd = document.getElementById("citiesQtd").value;
  let generationsQtd = document.getElementById("generations").value;
  let mutationProb = document.getElementById("mutationProb").value;
  let gridSize = { x: 700, y: 400 };
  let showOnCanvasTime = 10;

  let cities;
  let canvas;
  let population;

  watchUI();
  onClickEvents();

  function startAlgorithm() {
    section.innerHTML = "";
    cities = inputCitiesJSON.value ? JSON.parse(inputCitiesJSON.value) : utils.generateRndCoords(gridSize, citiesQtd);
    inputCitiesJSON.value = JSON.stringify(cities);
    canvas = new Canvas(document.getElementById("canvas"));
    population = generateInitialPopulation(popSize); //of Chromosomes.

    let parents = [];
    let tempOffspring = [];

    //Optimization loop
    for (let i = 0; i < generationsQtd; i++) {
      population = calculateFitness(population); //Calculates the fitness of the population and returns itself.
      parents = findParents(population); //Array of parents. Each group has one "male" and one "female" chromosome.
      tempOffspring = generateOffspring(parents); //Generate offspring through parents' array.
      population = mutateOffspring(tempOffspring, mutationProb); //Mutates by chance the offspring and returns itself.
      population.forEach(el => {
        el.generation = i;
      })

    }
    population = calculateFitness(population); //Calculates the fitness of the population and returns itself.

    showCanvas();
  }

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
   * @returns {Chromosome[]}
   */
  function generateInitialPopulation(size) {
    let chromosomes = [];
    //generates n times chromosomes
    for (let x = 0; x < size; x++) {
      const genes = utils.shuffleList(cities);
      const chromosome = new Chromosome(genes, x, 0);

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
        el.fitness += 0 - utils.calcDistance(el.genes[z], el.genes[z + 1]);
      }
    });

    return pop;
  }

  /**
   * @summary Generates parents from given population
   * @param {Array} population A population array
   * @returns {Array} Parents array.
   */
  function findParents(population) {
    let parentsPool = [];
    const newChroms = population.slice();
    const totalFitness = population.reduce((acc, cur) => {
      return acc + cur.fitness;
    }, 0);

    // Sets the weight as the id of each chromosome based on the fitness
    // The weight is the value used to choose weighted random parents.
    newChroms.forEach((chrom, c) => (chrom.weight = chrom.fitness / totalFitness)); // + (newChroms[c - 1]?.weight || 0));

    for (let a = 0; a < popSize; a++) {
      let parents = [];

      for (let b = 0; b < 2; b++) {
        parents.push(_weightedRandom(newChroms));
      }
      parentsPool.push(parents);
    }

    return parentsPool;
  }



  /**
   *
   * @param {Chromosome[]} options
   * @returns
   */
  function _weightedRandom(options) {
    var i;

    var weights = [];

    for (i = 0; i < options.length; i++) weights[i] = options[i].weight + (weights[i - 1] || 0);

    var random = Math.random() * weights[weights.length - 1];

    for (i = 0; i < weights.length; i++) if (weights[i] > random) break;

    return options[i];
  }

  /**
   * @summary Generates offspring from given parents.
   * @param {Chromosome[]} parents A parents array
   * @returns {Chromosome[]} Offspring array.
   */
  function generateOffspring(parents) {
    const genesLength = parents[0][0].genes.length;
    const genesToCross = Math.ceil(genesLength * 0.3); // Crosses 30% of the genes
    //[01,02,03,04,05,06,07,08,09,10]
    //[11,12,13,14,15,16,17,18,19,20]
    //[01,02,03,04,05,06,17,18,19,20]
    let offspring = [];

    parents.forEach((el, i) => {
      //Gets 3 genes and push to a new array;
      let fatherGenes = el[0].genes.slice(genesLength - 1 - genesToCross, genesLength - 1); //Get the last 3 genes from the parent
      const motherGenes = el[1].genes.slice(0, genesLength - 1 - genesToCross); // Get the first 6 genes from the mother
      motherGenes.forEach((el, i) => fatherGenes.splice(i, 0, el)); // Joins the father's gene with the mother's gene
      fatherGenes.push(el[1].genes[genesLength - 1]);
      parentPartGenes = cities.filter((el) => !fatherGenes.includes(el));

      let z = 0;
      fatherGenes.forEach((el, f) => {
        //Searches for an element el, starting after the element: searcher for duplicates
        if (fatherGenes.includes(el, f + 1)) {
          fatherGenes[f] = parentPartGenes[z];
          if (!fatherGenes[f]) {
            debugger;
          }
          ++z;
        }
      });

      offspring.push(new Chromosome(fatherGenes, i));
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

    offsp.forEach((el) => {
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
    return !list.every((el) => el);
  }

  function showCanvas() {
    canvas.properties.width = gridSize.x + 50;
    canvas.properties.height = gridSize.y + 50;
    canvas.drawCircles({ radius: 5 }, cities);

    let i = 0;
    const id = setInterval(() => {
      canvas.initialize();
      canvas.drawCircles({ radius: 5 }, cities);
      canvas.drawPaths(population[i].genes);

      addChromosomeToDisplay(population[i]);
      ++i;
      if (i >= population.length - 1) {
        clearInterval(id);
        btnGetBestChromosome.click();
      }
    }, showOnCanvasTime);
  }

  /**
   * 
   * @param {Chromosome} chromosome 
   */
  function addChromosomeToDisplay(chromosome) {
    const div = document.createElement("div");

    div.setAttribute("id", chromosome.id);

    div.onmouseenter = () => {
      div.setAttribute("style", "color: white; background-color: black;");
      canvas.clear();
      canvas.initialize();
      canvas.drawCircles({ radius: 5 }, cities);
      canvas.drawPaths(chromosome.genes);
    };

    div.onmouseleave = () => div.setAttribute("style", "color: black; background-color:white;");
    div.appendChild(document.createTextNode(`{Fitness: ${chromosome.fitness} - Id: ${chromosome.id}}`));
    section.appendChild(div);
  }

  function onClickEvents() {
    btnGetBestChromosome.addEventListener("click", () => {
      let temp = population.map((el) => el.fitness);
      let best = temp.reduce((a, b) => Math.max(a, b));
      let bestChromosome = population.find((el) => el.fitness == best);

      inputBestChromosome.value = JSON.stringify(bestChromosome);
      canvas.initialize();
      canvas.drawCircles({ radius: 5 }, cities);
      canvas.drawPaths(bestChromosome.genes);
    });

    document.getElementById("restartAlgo").addEventListener("click", () => {
        startAlgorithm();
    });
  }

  function watchUI() {
    const updateLabel = (e) => {
        let value = e.target.value;
        let label = e.target.labels[0].querySelector("[data-updatable]");

        label.innerHTML = value;
    }

    document.getElementById("popSize").addEventListener("input", updateLabel);
    document.getElementById("citiesQtd").addEventListener("input", updateLabel);
    document.getElementById("generations").addEventListener("input", updateLabel);
    document.getElementById("mutationProb").addEventListener("input", updateLabel);
  }
})();
