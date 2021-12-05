export class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static copyVector3(vector3) {
        return new Vector3(vector3.x, vector3.y, vector3.z);
    }

    static convertArrayOfVector3ToFloatArray(arrayOfVector3) {
        let float_array = [];
        for (let vert = 0; vert < arrayOfVector3.length; vert++) {
            float_array.push(...arrayOfVector3[vert].toArray())
        }
        return float_array;
    }

    toArray() {
        return [
            this.x,
            this.y,
            this.z
        ];
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    setZ(z) {
        this.z = z;
    }
}
