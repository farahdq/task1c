import {BufferTypeEnum, DataTypeEnum, DrawModeEnum, ShaderTypeEnum, UsageTypeEnum, WebGLUtils} from "../WebGLUtils.js";
import {Vector3} from "../Geometries/Vector3.js";
import {Color} from "../Geometries/Color.js";

export class Scene {
    geometries = [];
    webGlUtils = null;
    projectionMatrix = null;
    viewMatrix = null;
    rotationMatrix = null;
    vertices = null;
    colors = null;

    vertex_buffer = null;
    color_buffer = null;
    normal_buffer = null;
    camera = [0, 0, 3];
    lookAt = [0, 0, 0];

    constructor(canvas) {
        this._initWebGlUtils(canvas);
        this._initProjectionMatrix();
        this._initViewMatrix();
        this._initRotationMatrix();
        this._initLightSourcePosition();
        this._initTranslate();
    }

    start() {
        this._initVerticesBuffer();
        this._initColorsBuffer();
        this._initNormalsBuffer();
        this._initSpecularBuffer();
        this._startProgram();
        this._bindAttributes();
        this._bindUniforms();

        this.animate();
    }

    addGeometry(geometry) {
        this.geometries.push(geometry);
    }

    _initLightSourcePosition() {
        this.lightSourcePosition = [0, 0, 0];
    }

    _initTranslate() {
        this.translateMatrix = [0, 0, 0]
    }

    _initWebGlUtils(canvas) {
        this.webGlUtils = new WebGLUtils(canvas);
    }

    _initProjectionMatrix() {
        this.projectionMatrix = this.webGlUtils.getProjection(45, 1, 10);
    }

    _initViewMatrix() {
        this.view = glMatrix.mat4.create();
        glMatrix.mat4.lookAt(
            this.view,
            this.camera,      // camera position
            this.lookAt,      // the point where camera looks at
            [0, 1, 0]       // up vector of the camera
        );
    }

    _initRotationMatrix() {
        this.rotationMatrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    }

    _initVerticesBuffer() {
        this.vertices = [];
        for (let geometry = 0; geometry < this.geometries.length; geometry++) {
            this.vertices.push(...this.geometries[geometry].getVertices());
        }
        let float_vertice = Vector3.convertArrayOfVector3ToFloatArray(this.vertices);
        this.vertex_buffer = this.webGlUtils.initBuffer(
            BufferTypeEnum.ARRAY,
            DataTypeEnum.FLOAT,
            float_vertice,
            UsageTypeEnum.STATIC
        );
    }

    _initColorsBuffer() {
        this.colors = [];
        this.geometries.forEach((geometry) => {
            this.colors.push(...geometry.getColors());
        });
        let float_color = Color.convertArrayOfColorsToFloatArray(this.colors);
        this.color_buffer = this.webGlUtils.initBuffer(
            BufferTypeEnum.ARRAY,
            DataTypeEnum.FLOAT,
            float_color,
            UsageTypeEnum.STATIC
        );
    }

    _initNormalsBuffer() {
        this.normals = [];
        for (let geometry = 0; geometry < this.geometries.length; geometry++) {
            this.normals.push(...this.geometries[geometry].getNormals());
        }
        let float_normal = Vector3.convertArrayOfVector3ToFloatArray(this.normals);
        this.normal_buffer = this.webGlUtils.initBuffer(
            BufferTypeEnum.ARRAY,
            DataTypeEnum.FLOAT,
            float_normal,
            UsageTypeEnum.STATIC
        );
    }

    _initSpecularBuffer() {
        this.specular = [];
        for (let geometry = 0; geometry < this.geometries.length; geometry++) {
            this.specular.push(...this.geometries[geometry].getSpecular());
        }
        this.specular_buffer = this.webGlUtils.initBuffer(
            BufferTypeEnum.ARRAY,
            DataTypeEnum.FLOAT,
            this.specular,
            UsageTypeEnum.STATIC
        );
    }

    _startProgram() {
        let vertCode = this._getVertCode();
        let vertShader = this.webGlUtils.createShader(ShaderTypeEnum.VERTEX, vertCode);
        let fragCode = this._getFragCode();
        let fragShader = this.webGlUtils.createShader(ShaderTypeEnum.FRAGMENT, fragCode);
        this.webGlUtils.attachShader(vertShader);
        this.webGlUtils.attachShader(fragShader);
        this.webGlUtils.startProgram();
    }

    _getVertCode() {
        return 'attribute vec3 aCoordinates;' +
            'attribute vec4 aColor;' +
            'attribute vec3 aNormal;' +
            'attribute float aShininessConstant;' +
            'uniform vec3 uTranslate;' +
            'uniform mat4 uProjectionMatrix;' +
            'uniform mat4 uViewMatrix;' +
            'uniform mat4 uRotationMatrix;' +
            'varying vec4 vColor;' +
            'varying vec3 vNormal;' +
            'varying vec3 vCoordinates;' +
            'varying float vShininessConstant;' +
            'void main(void) {' +
            ' gl_Position = uProjectionMatrix * uViewMatrix * uRotationMatrix * vec4(aCoordinates + uTranslate, 1.0);' +
            ' gl_PointSize = 18.0;' +
            ' vColor = aColor;' +
            ' vNormal = aNormal;' +
            ' vShininessConstant = aShininessConstant;' +
            ' vCoordinates = (uRotationMatrix * (vec4(aCoordinates, 1.0))).xyz;' +
            '}';
    }

    _getFragCode() {
        return 'precision mediump float;' +
            'varying vec4 vColor;' +
            'varying vec3 vNormal;' +
            'varying vec3 vCoordinates;' +
            'varying float vShininessConstant;' +
            'uniform vec3 uLightConstant;' +       // It represents the light color
            'uniform vec3 uCameraPosition;' +
            'uniform float uAmbientIntensity;' +   // It represents the light intensity
            'uniform vec3 uLightPosition;' +
            'uniform mat3 uNormalRotation;' +
            'void main(void) {' +
            '   vec3 ambient = uLightConstant * uAmbientIntensity;' +
            '   vec3 lightDirection = (uNormalRotation * uLightPosition) - vCoordinates;' +
            '   vec3 normalizedLight = normalize(lightDirection);' +  // [2., 0., 0.] becomes a unit vector [1., 0., 0.]' +
            '   vec3 normalizedNormal = normalize(uNormalRotation * vNormal);' +
            '   float cosTheta = dot(normalizedNormal, normalizedLight);' +
            '   vec3 diffuse = vec3(0, 0, 0);' +
            '   if (cosTheta > 0.) {' +
            '       float diffuseIntensity = cosTheta;' +
            '       diffuse = uLightConstant * diffuseIntensity;' +
            '   }' +
            '   vec3 reflector = reflect(-lightDirection, normalizedNormal);' +
            '   vec3 normalizedReflector = normalize(reflector);' +
            '   vec3 normalizedViewer = normalize(uCameraPosition - vCoordinates);' +
            '   float cosPhi = dot(normalizedReflector, normalizedViewer);' +
            '   vec3 specular = vec3(0., 0., 0.);' +
            '   if (cosPhi > 0.) {' +
            '       float specularIntensity = pow(cosPhi, vShininessConstant);' +
            '       specular = uLightConstant * specularIntensity;' +
            '   }' +
            '   vec3 phong = ambient + diffuse + specular;' +
            '   gl_FragColor = vec4(phong.x * vColor.x, phong.y * vColor.y, phong.z * vColor.z, vColor.w);' +
            '}';
    }

    _bindAttributes() {
        this._bindVertexBuffer();
        this._bindColorBuffer();
        this._bindNormalBuffer();
        this._bindSpecularBuffer();
    }

    _bindVertexBuffer() {
        this.webGlUtils.bindAttributes(
            BufferTypeEnum.ARRAY,
            this.vertex_buffer,
            'aCoordinates',
            3,
            DataTypeEnum.FLOAT
        );
    }

    _bindColorBuffer() {
        this.webGlUtils.bindAttributes(
            BufferTypeEnum.ARRAY,
            this.color_buffer,
            'aColor',
            4,
            DataTypeEnum.FLOAT
        );
    }

    _bindNormalBuffer() {
        this.webGlUtils.bindAttributes(
            BufferTypeEnum.ARRAY,
            this.normal_buffer,
            'aNormal',
            3,
            DataTypeEnum.FLOAT
        );
    }

    _bindSpecularBuffer() {
        this.webGlUtils.bindAttributes(
            BufferTypeEnum.ARRAY,
            this.specular_buffer,
            'aShininessConstant',
            1,
            DataTypeEnum.FLOAT
        );
    }

    _bindUniforms() {
        this.webGlUtils.bindMatrix4Uniforms(
            'uProjectionMatrix',
            DataTypeEnum.FLOAT,
            this.projectionMatrix
        )
        this.webGlUtils.bindMatrix4Uniforms(
            'uViewMatrix',
            DataTypeEnum.FLOAT,
            this.view
        )
        this.webGlUtils.bindMatrix4Uniforms(
            'uRotationMatrix',
            DataTypeEnum.FLOAT,
            this.rotationMatrix
        )
        this.webGlUtils.bindUniforms3f(
            'uLightConstant',
            [1.0, 1.0, 1.0]
        )
        this.webGlUtils.bindUniforms1f(
            'uAmbientIntensity',
            0.218
        )
        this.webGlUtils.bindUniforms3f(
            'uLightPosition',
            this.lightSourcePosition
        )
        this.webGlUtils.bindUniforms3f(
            'uTranslate',
            this.translateMatrix
        )
        this.webGlUtils.bindUniforms3f(
            'uCameraPosition',
            this.camera
        )

        let uNormalRotation = glMatrix.mat3.create()
        glMatrix.mat3.normalFromMat4(uNormalRotation, this.rotationMatrix);
        this.webGlUtils.bindMatrix3Uniforms(
            'uNormalRotation',
            DataTypeEnum.FLOAT,
            uNormalRotation
        )
    }

    animate() {
        this._render();
    }

    _render() {
        this.webGlUtils.setBackgroundColor(0.263, 0.5, 0.5, 1.0);
        this.webGlUtils.enableDepthTest();
        this.webGlUtils.enableBlending();
        this.webGlUtils.drawArray(DrawModeEnum.TRIANGLES, 0, this.vertices.length)
    }

}
