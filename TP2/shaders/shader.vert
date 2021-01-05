attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float M;
uniform float N;
uniform float sizeM;
uniform float sizeN;

varying vec2 coordinates;

void main() {

	coordinates = (vec2(M, N) + aTextureCoord) * vec2(1.0/sizeM, 1.0/sizeN);

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

}