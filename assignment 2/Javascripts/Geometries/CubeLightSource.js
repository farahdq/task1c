import {RegularPolygonPrism} from "./RegularPolygonPrism.js";
import Geometry from "./Geometry.js";
import {Vector3} from "./Vector3.js";

export class CubeLightSource extends Geometry {
    constructor(position, side, color,specular) {
        super(color);
        this.side = side;
        this.specular = specular;
        this.halfSide = side * 0.5;
        this.position = position;
        this.initVertices();
        this.initIndices()
        this.initNormals()
    }

    translate(vector3) {
        this.position.x += vector3.x;
        this.position.y += vector3.y;
        this.position.z += vector3.z;
        this.initVertices();
    }

    initVertices() {
        this.vertices = [];
        this.initUpperFaceVertices();
        this.initLowerFaceVertices();
    }

    initUpperFaceVertices() {
        this.addVertex(new Vector3(this.position.x - this.halfSide, this.position.y + this.halfSide, this.position.z + this.side / 2)) //A
        this.addVertex(new Vector3(this.position.x + this.halfSide, this.position.y + this.halfSide, this.position.z + this.side / 2)) //B
        this.addVertex(new Vector3(this.position.x + this.halfSide, this.position.y - this.halfSide, this.position.z + this.side / 2)) //C
        this.addVertex(new Vector3(this.position.x - this.halfSide, this.position.y - this.halfSide, this.position.z + this.side / 2)) //D
    }

    initLowerFaceVertices() {
        this.addVertex(new Vector3(this.position.x - this.halfSide, this.position.y + this.halfSide, this.position.z - this.side / 2)) //E
        this.addVertex(new Vector3(this.position.x + this.halfSide, this.position.y + this.halfSide, this.position.z - this.side / 2)) //F
        this.addVertex(new Vector3(this.position.x + this.halfSide, this.position.y - this.halfSide, this.position.z - this.side / 2)) //G
        this.addVertex(new Vector3(this.position.x - this.halfSide, this.position.y - this.halfSide, this.position.z - this.side / 2)) //H
    }

    initIndices() {
        this.indices = [];
        this.addIndices([0, 1, 2]); //A B C
        this.addIndices([0, 3, 2]); //A D C
        this.addIndices([0, 4, 5]); //A E F
        this.addIndices([0, 1, 5]); //A B F
        this.addIndices([1, 5, 6]); //B F G
        this.addIndices([1, 2, 6]); //B C G
        this.addIndices([5, 4, 7]); //F E H
        this.addIndices([5, 6, 7]); //F G H
        this.addIndices([0, 4, 7]); //A E H
        this.addIndices([0, 3, 7]); //A D H
        this.addIndices([3, 2, 6]); //D C G
        this.addIndices([3, 7, 6]); //D H G

    }

    initNormals() {
        this.normals = [];
        this.addNormals(new Vector3(this.position.x, this.position.y, this.position.z - 1000))
        this.addNormals(new Vector3(this.position.x, this.position.y, this.position.z - 1000))
        this.addNormals(new Vector3(this.position.x, this.position.y - 1000, this.position.z))
        this.addNormals(new Vector3(this.position.x, this.position.y - 1000, this.position.z))
        this.addNormals(new Vector3(this.position.x - 1000, this.position.y, this.position.z))
        this.addNormals(new Vector3(this.position.x - 1000, this.position.y, this.position.z))
        this.addNormals(new Vector3(this.position.x, this.position.y, this.position.z + 1000))
        this.addNormals(new Vector3(this.position.x, this.position.y, this.position.z + 1000))
        this.addNormals(new Vector3(this.position.x + 1000, this.position.y, this.position.z))
        this.addNormals(new Vector3(this.position.x + 1000, this.position.y, this.position.z))
        this.addNormals(new Vector3(this.position.x, this.position.y + 1000, this.position.z))
        this.addNormals(new Vector3(this.position.x, this.position.y + 1000, this.position.z))
    }

    getNormals() {
        this.faceNormals = [];
        for (let index = 0; index < this.indices.length; index++) {
            this.faceNormals.push(Vector3.copyVector3(this.normals[Math.floor(index / 3)]));
        }
        return this.faceNormals;
    }

    getSpecular() {
        let specular = Array(this.faceNormals.length).fill(this.specular)
        return specular;
    }
}
