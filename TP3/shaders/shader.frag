#ifdef GL_ES
precision highp float;
#endif

uniform float M;
uniform float N;
uniform float sizeM;
uniform float sizeN;

varying vec2 coordinates;

uniform sampler2D tex;

void main() {

	gl_FragColor = texture2D(tex, coordinates);

}