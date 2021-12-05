import {GeometryObject} from "./GeometryObject.js";
import {Cylinder} from "../Geometries/Cylinder.js";
import {Vector3} from "../Geometries/Vector3.js";
import {Color} from "../Geometries/Color.js";

export class ParfumeBottle extends GeometryObject {
    static SOLID_CREAM = new Color(
        0.9, 0.75, 0.54,1
    )
    static SMALL_BLACK = new Color(
        0.01,
        0.01,
        0.01,
        1
    )
    static BODY_RED = new Color(
        200 / 255,
        10 / 255,
        75 / 255,
        1
    )

    constructor(position, specular, rotation = null) {
        super(position, specular, rotation);
        this._initGeometry();
    }

    translate(vector3) {
        super.translate(vector3);
        this._initGeometry();
    }

    _initGeometry() {
        this.geometries = [
            //Flap tutup
            new Cylinder(
                new Vector3(this.position.x, this.position.y, this.position.z + 0.6845),
                0.115,
                ParfumeBottle.SOLID_CREAM,
                
            ),
      
            //Base tutup
            new Cylinder(
                new Vector3(this.position.x, this.position.y, this.position.z + 0.49575),
                0.2625,
                ParfumeBottle.SOLID_CREAM,
                0.2625
            ),
        
            new Cylinder(
                new Vector3(this.position.x, this.position.y, this.position.z + 0.3410635),
                0.015625,
                ParfumeBottle.SMALL_BLACK,
                0.2325,
                0.225,
            ),
     
            //Body
            new Cylinder(
                new Vector3(this.position.x, this.position.y, this.position.z + 0.264125),
                0.1,
                ParfumeBottle.BODY_RED,
                0.375
            ),
            new Cylinder(
                new Vector3(this.position.x, this.position.y, this.position.z + 0.014125),
                0.4,
                ParfumeBottle.BODY_RED,
                0.375
            ),
            new Cylinder(
                new Vector3(this.position.x, this.position.y, this.position.z - 0.285875),
                0.2,
                ParfumeBottle.BODY_RED,
                0.375
            ),
            new Cylinder(
                new Vector3(this.position.x, this.position.y, this.position.z - 0.385875),
                0.99,
                ParfumeBottle.BODY_RED,
                0.375
            ),
        
        ];
    }
}
