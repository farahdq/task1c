
export class WebGLUtils {
    canvas = null;
    glContext = null;

    background_red = 0;
    background_green = 0;
    background_blue = 0;
    background_alpha = 0;

    shaderProgram = null;

    constructor(canvas) {
        this.canvas = canvas;
        this.glContext = this.canvas.getContext('experimental-webgl');
    }

    initBuffer(bufferType, dataType, sourceData, usageType) {
        let buffer = this.glContext.createBuffer();

        let bufferTarget = null;
        switch (bufferType) {
            case BufferTypeEnum.ARRAY :
                bufferTarget = this.glContext.ARRAY_BUFFER;
                break;
            case BufferTypeEnum.ELEMENT :
                bufferTarget = this.glContext.ELEMENT_ARRAY_BUFFER;
                break;
        }

        this.glContext.bindBuffer(bufferTarget, buffer);

        let bufferData = null;
        switch (dataType) {
            case DataTypeEnum.INT:
                bufferData = new Uint16Array(sourceData);
                break;
            case DataTypeEnum.FLOAT :
                bufferData = new Float32Array(sourceData);
                break;
        }

        let bufferUsage = null;
        switch (usageType) {
            case UsageTypeEnum.STATIC:
                bufferUsage = this.glContext.STATIC_DRAW;
                break;
            case UsageTypeEnum.DYNAMIC :
                bufferUsage = this.glContext.DYNAMIC_DRAW;
                break;
            case UsageTypeEnum.STREAM :
                bufferUsage = this.glContext.STREAM_DRAW;
                break;
        }

        this.glContext.bufferData(bufferTarget, bufferData, bufferUsage);

        this.glContext.bindBuffer(bufferTarget, null);

        return buffer;
    }

    attachShader(shader) {
        if (this.shaderProgram == null) {
            this.shaderProgram = this.glContext.createProgram();
        }
        this.glContext.attachShader(this.shaderProgram, shader);
    }

    bindBuffer(type, buffer) {
        let bufferTarget = null;
        switch (type) {
            case BufferTypeEnum.ARRAY :
                bufferTarget = this.glContext.ARRAY_BUFFER;
                break;
            case BufferTypeEnum.ELEMENT :
                bufferTarget = this.glContext.ELEMENT_ARRAY_BUFFER;
                break;
        }
        this.glContext.bindBuffer(bufferTarget, buffer);
    }

    unbindBuffer(type) {
        let bufferTarget = null;
        switch (type) {
            case BufferTypeEnum.ARRAY :
                bufferTarget = this.glContext.ARRAY_BUFFER;
                break;
            case BufferTypeEnum.ELEMENT :
                bufferTarget = this.glContext.ELEMENT_ARRAY_BUFFER;
                break;
        }
        this.glContext.bindBuffer(bufferTarget, null);
    }

    bindAttributes(bufferType, buffer, attribName, size, dataType) {
        if (this.shaderProgram == null) {
            console.log('There is no active shader program');
        }

        let bufferTarget = null;
        switch (bufferType) {
            case BufferTypeEnum.ARRAY :
                bufferTarget = this.glContext.ARRAY_BUFFER;
                break;
            case BufferTypeEnum.ELEMENT :
                bufferTarget = this.glContext.ELEMENT_ARRAY_BUFFER;
                break;
        }
        this.glContext.bindBuffer(bufferTarget, buffer);

        let glDataType = null;
        switch (dataType) {
            case DataTypeEnum.INT:
                glDataType = this.glContext.INT;
                break;
            case DataTypeEnum.FLOAT :
                glDataType = this.glContext.FLOAT;
                break;
        }

        let attrib = this.glContext.getAttribLocation(this.shaderProgram, attribName);
        this.glContext.vertexAttribPointer(attrib, size, glDataType, false, 0, 0);
        this.glContext.enableVertexAttribArray(attrib);
    }

    bindUniforms1f(uniformName, data) {
        if (this.shaderProgram == null) {
            console.log('There is no active shader program');
        }

        let uniform = this.glContext.getUniformLocation(this.shaderProgram, uniformName);
        this.glContext.uniform1f(uniform, data);
    }

    bindUniforms3f(uniformName, data) {
        if (this.shaderProgram == null) {
            console.log('There is no active shader program');
        }

        let uniform = this.glContext.getUniformLocation(this.shaderProgram, uniformName);
        this.glContext.uniform3fv(uniform, data);
    }

    bindMatrix4Uniforms(uniformName, dataType, data, transpose = false) {
        if (this.shaderProgram == null) {
            console.log('There is no active shader program');
        }

        let matrixData = null;
        switch (dataType) {
            case DataTypeEnum.INT:
                matrixData = new Uint16Array(data);
                break;
            case DataTypeEnum.FLOAT :
                matrixData = new Float32Array(data);
                break;
        }

        let uniform = this.glContext.getUniformLocation(this.shaderProgram, uniformName);
        this.glContext.uniformMatrix4fv(uniform, transpose, matrixData);
    }

    bindMatrix3Uniforms(uniformName, dataType, data, transpose = false) {
        if (this.shaderProgram == null) {
            console.log('There is no active shader program');
        }

        let matrixData = null;
        switch (dataType) {
            case DataTypeEnum.INT:
                matrixData = new Uint16Array(data);
                break;
            case DataTypeEnum.FLOAT :
                matrixData = new Float32Array(data);
                break;
        }

        let uniform = this.glContext.getUniformLocation(this.shaderProgram, uniformName);
        this.glContext.uniformMatrix3fv(uniform, transpose, matrixData);
    }

    createShader(type, shaderCode) {
        let shaderType = null;
        switch (type) {
            case ShaderTypeEnum.VERTEX :
                shaderType = this.glContext.VERTEX_SHADER;
                break;
            case ShaderTypeEnum.FRAGMENT :
                shaderType = this.glContext.FRAGMENT_SHADER;
                break;
        }
        let shader = this.glContext.createShader(shaderType);
        this.glContext.shaderSource(shader, shaderCode);
        this.glContext.compileShader(shader);
        var compiled = this.glContext.getShaderParameter(shader, this.glContext.COMPILE_STATUS);
        if (!compiled) {
            console.error(this.glContext.getShaderInfoLog(shader));
        }
        return shader;
    }

    drawArray(mode, first, count) {
        // Set the view port
        this.glContext.viewport(0, 0, this.canvas.width, this.canvas.height);

        let drawMode = this.resolveDrawMode(mode);

        this.glContext.drawArrays(drawMode, first, count);
    }

    drawIndices(mode, length, offset = 0) {
        // Set the view port
        this.glContext.viewport(0, 0, this.canvas.width, this.canvas.height);

        let drawMode = this.resolveDrawMode(mode);

        this.glContext.drawElements(drawMode, length, this.glContext.UNSIGNED_SHORT, offset);
    }

    resolveDrawMode(mode) {
        let drawMode = null;
        switch (mode) {
            case DrawModeEnum.POINT :
                drawMode = this.glContext.POINTS;
                break;
            case DrawModeEnum.LINES :
                drawMode = this.glContext.LINES;
                break;
            case DrawModeEnum.LINE_STRIP :
                drawMode = this.glContext.LINE_STRIP;
                break;
            case DrawModeEnum.LINE_LOOP :
                drawMode = this.glContext.LINE_LOOP;
                break;
            case DrawModeEnum.TRIANGLES :
                drawMode = this.glContext.TRIANGLES;
                break;
            case DrawModeEnum.TRIANGLE_STRIP :
                drawMode = this.glContext.TRIANGLE_STRIP;
                break;
            case DrawModeEnum.TRIANGLE_FAN :
                drawMode = this.glContext.TRIANGLE_FAN;
                break;
        }
        return drawMode;
    }

    startProgram() {
        if (this.shaderProgram == null) {
            console.log('There is no active shader program');
        }
        this.glContext.linkProgram(this.shaderProgram);
        this.glContext.useProgram(this.shaderProgram);
    }

    setBackgroundColor(red, green, blue, alpha) {
        this.background_red = red;
        this.background_green = green;
        this.background_blue = blue;
        this.background_alpha = alpha;

        // Clear the canvas
        this.glContext.clearColor(
            this.background_red,
            this.background_green,
            this.background_blue,
            this.background_alpha
        );

        // Clear the color buffer bit
        this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);
    }

    enableDepthTest() {
        this.glContext.enable(this.glContext.DEPTH_TEST);
    }

    enableBlending() {
        this.glContext.enable(this.glContext.BLEND);
        this.glContext.blendFunc(
            this.glContext.ONE,
            this.glContext.ONE_MINUS_SRC_ALPHA
        );
    }

    getProjection(angle, zMin, zMax, a = null) {
        if (a == null) {
            a = this.canvas.width / this.canvas.height;
        }
        let ang = Math.tan((angle * .5) * Math.PI / 180);//angle*.5
        return [
            0.5 / ang, 0, 0, 0,
            0, 0.5 * a / ang, 0, 0,
            0, 0, -(zMax + zMin) / (zMax - zMin), -1,
            0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
        ];
    }

    rotateZ(matrix, radians) {
        let c = Math.cos(radians);
        let s = Math.sin(radians);
        let matrixValue0 = matrix[0], matrixValue4 = matrix[4], matrixValue8 = matrix[8];

        matrix[0] = c * matrix[0] - s * matrix[1];
        matrix[4] = c * matrix[4] - s * matrix[5];
        matrix[8] = c * matrix[8] - s * matrix[9];
        matrix[1] = c * matrix[1] + s * matrixValue0;
        matrix[5] = c * matrix[5] + s * matrixValue4;
        matrix[9] = c * matrix[9] + s * matrixValue8;
    }

    rotateX(matrix, radians) {
        let c = Math.cos(radians);
        let s = Math.sin(radians);
        let matrixValue1 = matrix[1], matrixValue5 = matrix[5], matrixValue9 = matrix[9];

        matrix[1] = matrix[1] * c - matrix[2] * s;
        matrix[5] = matrix[5] * c - matrix[6] * s;
        matrix[9] = matrix[9] * c - matrix[10] * s;

        matrix[2] = matrix[2] * c + matrixValue1 * s;
        matrix[6] = matrix[6] * c + matrixValue5 * s;
        matrix[10] = matrix[10] * c + matrixValue9 * s;
    }

    rotateY(matrix, radians) {
        let c = Math.cos(radians);
        let s = Math.sin(radians);
        let matrixValue0 = matrix[0], matrixValue4 = matrix[4], matrixValue8 = matrix[8];

        matrix[0] = c * matrix[0] + s * matrix[2];
        matrix[4] = c * matrix[4] + s * matrix[6];
        matrix[8] = c * matrix[8] + s * matrix[10];

        matrix[2] = c * matrix[2] - s * matrixValue0;
        matrix[6] = c * matrix[6] - s * matrixValue4;
        matrix[10] = c * matrix[10] - s * matrixValue8;
    }

}

export class BufferTypeEnum {
    static ARRAY = 'array_buffer';
    static ELEMENT = 'element_array_buffer';
}

export class UsageTypeEnum {
    static STATIC = 'static';
    static DYNAMIC = 'dynamic';
    static STREAM = 'stream';
}

export class DataTypeEnum {
    static FLOAT = 'float';
    static INT = 'int';
}

export class ShaderTypeEnum {
    static VERTEX = 'vertex';
    static FRAGMENT = 'fragment';
}

export class DrawModeEnum {
    static POINT = 'point';
    static LINE_STRIP = 'line_strip';
    static LINE_LOOP = 'line_loop';
    static LINES = 'lines';
    static TRIANGLES = 'triangles';
    static TRIANGLE_STRIP = 'triangles_strip';
    static TRIANGLE_FAN = 'triangles_fan';
}
