import Geometry from "../Geometries/Geometry.js";

export class GeometryObject extends Geometry {
    constructor(position, specular, rotation = null) {
        super();
        this.geometries = [];
        this.position = position;
        this.rotation = rotation;
        this.specular = specular;
        this.verticeChanged = true;
        this.normalChanged = true;
        if (rotation != null) {
            this._initRotationMatrix();
        }
    }

    addGeometry(geometry) {
        this.geometries.push(geometry);
    }

    setRotation(rotation) {
        this.rotation = rotation;
        this._initRotationMatrix();
        this._markChanged();
    }

    rotate(vector3) {
        this.rotation.x += vector3.x;
        this.rotation.y += vector3.y;
        this.rotation.z += vector3.z;
        this._initRotationMatrix();
        this._markChanged();
    }

    translate(vector3) {
        this.position.x += vector3.x;
        this.position.y += vector3.y;
        this.position.z += vector3.z;
        this._markChanged();
    }

    getVertices() {
        if (this.verticeChanged) {
            this.faceVertice = [];
            for (let geometry = 0; geometry < this.geometries.length; geometry++) {
                this.faceVertice.push(...this.geometries[geometry].getVertices());
            }
            if (this.rotation != null) {
                for (let vert = 0; vert < this.faceVertice.length; vert++) {
                    let point = [this.faceVertice[vert].x - this.position.x, this.faceVertice[vert].y - this.position.y, this.faceVertice[vert].z - this.position.z];
                    let result = math.multiply(this.rotation_matrix, point);
                    result = math.add(result, this.position.toArray())
                    this.faceVertice[vert].setX(result[0]);
                    this.faceVertice[vert].setY(result[1]);
                    this.faceVertice[vert].setZ(result[2]);
                }
            }
            this.verticeChanged = false;
        }
        return this.faceVertice;
    }

    getNormals() {
        if (this.normalChanged) {
            this.faceNormals = [];
            for (let geometry = 0; geometry < this.geometries.length; geometry++) {
                this.faceNormals.push(...this.geometries[geometry].getNormals());
            }
            if (this.rotation != null) {
                for (let vert = 0; vert < this.faceNormals.length; vert++) {
                    let point = [this.faceNormals[vert].x - this.position.x, this.faceNormals[vert].y - this.position.y, this.faceNormals[vert].z - this.position.z];
                    let result = math.multiply(this.rotation_matrix, point);
                    result = math.add(result, this.position.toArray())
                    this.faceNormals[vert].setX(result[0]);
                    this.faceNormals[vert].setY(result[1]);
                    this.faceNormals[vert].setZ(result[2]);
                }
            }
            this.normalChanged = false;
        }
        return this.faceNormals;
    }

    getSpecular() {
        let specular = Array(this.faceVertice.length).fill(this.specular)
        return specular;
    }

    getColors() {
        let colors = [];
        this.geometries.forEach((geometry) => {
            colors.push(...geometry.getColors())
        })
        return colors;
    }

    _initRotationMatrix() {
        let sin_gamma = Math.sin(this.rotation.x * Math.PI / 180.0);
        let cos_gamma = Math.cos(this.rotation.x * Math.PI / 180.0);
        let sin_beta = Math.sin(this.rotation.y * Math.PI / 180.0);
        let cos_beta = Math.cos(this.rotation.y * Math.PI / 180.0);
        let sin_alpha = Math.sin(this.rotation.z * Math.PI / 180.0);
        let cos_alpha = Math.cos(this.rotation.z * Math.PI / 180.0);
        this.rotation_matrix = [
            [cos_alpha * cos_beta, cos_alpha * sin_beta * sin_gamma - sin_alpha * cos_gamma, cos_alpha * sin_beta * cos_gamma + sin_alpha * sin_gamma],
            [sin_alpha * cos_beta, sin_alpha * sin_beta * sin_gamma + cos_alpha * cos_gamma, sin_alpha * sin_beta * cos_gamma - cos_alpha * sin_gamma],
            [-1 * sin_beta, cos_beta * sin_gamma, cos_beta * cos_gamma],
        ];
    }

    _markChanged() {
        this.normalChanged = this.verticeChanged = true;
    }
}
