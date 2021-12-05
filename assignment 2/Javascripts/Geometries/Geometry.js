import {Color} from "./Color.js";
import {Vector3} from "./Vector3.js";

export default class Geometry {
    static randomColor = false;
    vertices = null;
    normals = null;
    indices = null;

    constructor(color) {
        this.color = color;
    }

    initNormals() {
        // console.log(this.vertices);
        // console.log(this.indices);
        this.normals = [];
        for (let vert = 0; vert < this.indices.length; vert += 6) {
            let point1 = this.vertices[this.indices[vert]];
            let point2 = this.vertices[this.indices[vert + 1]];
            let point3 = this.vertices[this.indices[vert + 2]];

            let vector1 = new Vector3(point2.x - point1.x, point2.y - point1.y, point2.z - point1.z);
            let vector2 = new Vector3(point3.x - point1.x, point3.y - point1.y, point3.z - point1.z);
            if (point1.z === point2.z && point2.z === point3.z) {
                this.addNormals(
                    new Vector3(
                        1000000 * ((vector2.y * vector1.z) - (vector2.z * vector1.y)),
                        1000000 * ((vector2.z * vector1.x) - (vector2.x * vector1.z)),
                        1000000 * ((vector2.x * vector1.y) - (vector2.y * vector1.x)),
                    )
                )
            }
            else {
                this.addNormals(
                    new Vector3(
                        1000000 * ((vector1.y * vector2.z) - (vector1.z * vector2.y)),
                        1000000 * ((vector1.z * vector2.x) - (vector1.x * vector2.z)),
                        1000000 * ((vector1.x * vector2.y) - (vector1.y * vector2.x)),
                    )
                )
            }

        }
        // console.log(this.normals);
    }

    getVertices() {
        let faceVertices = [];
        for (let index = 0; index < this.indices.length; index++) {
            faceVertices.push(Vector3.copyVector3(this.vertices[this.indices[index]]));
        }
        return faceVertices;
    }

    getNormals() {
        let faceNormals = [];
        for (let index = 0; index < this.indices.length; index++) {
            faceNormals.push(Vector3.copyVector3(this.normals[Math.floor(index / 6)]));
        }
        return faceNormals;
    }

    getSpecular(){
    }

    getColors() {
        let colors = [];
        this.indices.forEach((value) => {
            if (Geometry.randomColor) {
                colors.push(
                    new Color(
                        Math.random(),
                        Math.random(),
                        Math.random(),
                        1
                    )
                )
            } else {
                colors.push(this.color);
            }
        });
        return colors;
    }

    addVertex(vertex) {
        this.vertices.push(vertex);
    }

    addNormals(normal) {
        this.normals.push(normal);
    }

    addVertices(vertices) {
        this.vertices.push(...vertices);
    }

    addIndex(index) {
        this.indices.push(index);
    }

    addIndices(indices) {
        this.indices.push(...indices);
    }
}
