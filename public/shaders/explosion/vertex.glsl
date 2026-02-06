#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform float u_duration; 

varying vec3 v_position; 
varying float v_scale; 

void main () {  

    float scale = smoothstep(0., 1., u_time * u_duration * 0.2);
    vec3 scaledPosition = position * scale;

    v_position = scaledPosition; 
    v_scale = scale; 

    vec4 modelPosition = modelMatrix * vec4(scaledPosition, 1.);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
}