'using strict';

class Chromosome{
    constructor(genes){
        this.weight = 0;
        this.fitness = 0;
        this.genes = genes||[];
    }
}