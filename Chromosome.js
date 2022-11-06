'using strict';

class Chromosome{
    constructor(genes, id, generation){
        this.id = id;
        this.weight = 0;
        this.fitness = 0;
        this.genes = genes||[];
        this.generation = generation;
    }
}