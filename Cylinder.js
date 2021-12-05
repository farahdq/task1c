import {RegularPolygonPrism} from "./RegularPolygonPrism.js";

export class Cylinder extends RegularPolygonPrism {
    static NUMBER_OF_VERTICE = 240;

    constructor(position, height, color, lowerRadius, upperRadius) {
        super(position, height, Cylinder.NUMBER_OF_VERTICE, color, lowerRadius, upperRadius);
    }
}
