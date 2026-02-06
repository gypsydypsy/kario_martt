#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359;

uniform float u_time;
uniform float u_radius; 
uniform vec3 u_center; 

varying vec3 v_position;
varying float v_scale;

void main (){
    float dist = 1. - length(v_position) / u_radius;
    dist = smoothstep(0., 1., dist);

    vec3 color1 = vec3(0.2431, 0.0745, 0.0);
    vec3 color2 = vec3(1.0, 0.8824, 0.5529);
    vec3 colorMix = mix(color1, color2, u_time); 
    colorMix = mix(colorMix, color1, dist);

    float alpha = smoothstep(0., 1., dist);
    gl_FragColor = vec4(colorMix, alpha);
}