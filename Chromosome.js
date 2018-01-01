'using strict';

class Chromosome{
    constructor(genes, id){
        this.id = id;
        this.weight = 0;
        this.fitness = 0;
        this.genes = genes||[];
    }
}