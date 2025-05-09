import { assert } from "./type.utils";
import { fragmentShaderSource, vertexShaderSource } from "./webgl.constants";

export function createVertexBuffer(gl: WebGL2RenderingContext) {
  if (!gl) {
    return null;
  }
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]),
    gl.STATIC_DRAW
  );
  return vertexBuffer;
}

export const createShaderProgram = (gl: WebGL2RenderingContext) => {
  // Create vertex shader
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  assert(vertexShader, "can not create vertex shader");

  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  // Create fragment shader
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  assert(fragmentShader, "can not create fragment shader");

  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  // Create program
  const program = gl.createProgram();
  assert(program, "can not create program");
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  return {
    shaderProgram: program,
    positionLocation: gl.getAttribLocation(program, "position"),
    textureLocation: gl.getUniformLocation(program, "textureSampler"),
  };
};

export function createGetImageBitmapFunction(
  taskCanvas: HTMLCanvasElement | OffscreenCanvas
) {
  const gl = taskCanvas.getContext("webgl2");
  assert(gl, "Can not get webgl2 context");

  const { shaderProgram, positionLocation, textureLocation } =
    createShaderProgram(gl);
  const vertexBuffer = createVertexBuffer(gl);

  return function getImageBitmapFromMaskTexture(
    texture: WebGLTexture
  ): Promise<ImageBitmap> {
    gl.useProgram(shaderProgram);
    gl.viewport(0, 0, taskCanvas.width, taskCanvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(textureLocation, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    return createImageBitmap(taskCanvas);
  };
}
