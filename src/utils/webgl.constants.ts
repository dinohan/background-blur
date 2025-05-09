export const vertexShaderSource = `
attribute vec2 position;
varying vec2 texCoords;

void main() {
  texCoords = (position + 1.0) / 2.0;
  texCoords.y = 1.0 - texCoords.y;
  gl_Position = vec4(position, 0, 1.0);
}
`;

export const fragmentShaderSource = `
precision highp float;
varying vec2 texCoords;
uniform sampler2D textureSampler;

void main() {
    float a = texture2D(textureSampler, texCoords).r;

    // a = step(0.99, a);

    gl_FragColor = vec4(a, a, a, a);
}
`;
