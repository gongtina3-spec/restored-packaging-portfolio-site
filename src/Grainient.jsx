import { useEffect, useRef } from 'react';
import './Grainient.css';

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 1, 1];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);
  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;
  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);
  vec3 colLav=uColor1;
  vec3 colOrg=uColor2;
  vec3 colDark=uColor3;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));
  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;
  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);
  o=vec4(col,1.0);
}
void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}
`;

const defaults = {
  timeSpeed: 0.25,
  colorBalance: 0,
  warpStrength: 1,
  warpFrequency: 5,
  warpSpeed: 2,
  warpAmplitude: 50,
  blendAngle: 0,
  blendSoftness: 0.05,
  rotationAmount: 500,
  noiseScale: 2,
  grainAmount: 0.1,
  grainScale: 2,
  grainAnimated: false,
  contrast: 1.5,
  gamma: 1,
  saturation: 1,
  centerX: 0,
  centerY: 0,
  zoom: 0.9,
  color1: '#FF9FFC',
  color2: '#5227FF',
  color3: '#B497CF',
};

const compileShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || 'Shader compile failed');
  }
  return shader;
};

const createProgram = (gl) => {
  const program = gl.createProgram();
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertex);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragment);
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || 'Program link failed');
  }
  return program;
};

const Grainient = ({ className = '', ...props }) => {
  const containerRef = useRef(null);
  const propsRef = useRef({ ...defaults, ...props });

  useEffect(() => {
    propsRef.current = { ...defaults, ...props };
  }, [props]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
    });

    if (!gl) {
      container.classList.add('grainient-fallback');
      return () => {
        container.removeChild(canvas);
      };
    }

    let program;
    try {
      program = createProgram(gl);
    } catch {
      container.classList.add('grainient-fallback');
      return () => {
        container.removeChild(canvas);
      };
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    gl.useProgram(program);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniforms = Object.fromEntries(
      [
        'iResolution',
        'iTime',
        'uTimeSpeed',
        'uColorBalance',
        'uWarpStrength',
        'uWarpFrequency',
        'uWarpSpeed',
        'uWarpAmplitude',
        'uBlendAngle',
        'uBlendSoftness',
        'uRotationAmount',
        'uNoiseScale',
        'uGrainAmount',
        'uGrainScale',
        'uGrainAnimated',
        'uContrast',
        'uGamma',
        'uSaturation',
        'uCenterOffset',
        'uZoom',
        'uColor1',
        'uColor2',
        'uColor3',
      ].map((name) => [name, gl.getUniformLocation(program, name)]),
    );

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.15);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const setUniforms = (time) => {
      const next = propsRef.current;
      const color1 = hexToRgb(next.color1);
      const color2 = hexToRgb(next.color2);
      const color3 = hexToRgb(next.color3);
      gl.uniform2f(uniforms.iResolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.iTime, time);
      gl.uniform1f(uniforms.uTimeSpeed, next.timeSpeed);
      gl.uniform1f(uniforms.uColorBalance, next.colorBalance);
      gl.uniform1f(uniforms.uWarpStrength, next.warpStrength);
      gl.uniform1f(uniforms.uWarpFrequency, next.warpFrequency);
      gl.uniform1f(uniforms.uWarpSpeed, next.warpSpeed);
      gl.uniform1f(uniforms.uWarpAmplitude, next.warpAmplitude);
      gl.uniform1f(uniforms.uBlendAngle, next.blendAngle);
      gl.uniform1f(uniforms.uBlendSoftness, next.blendSoftness);
      gl.uniform1f(uniforms.uRotationAmount, next.rotationAmount);
      gl.uniform1f(uniforms.uNoiseScale, next.noiseScale);
      gl.uniform1f(uniforms.uGrainAmount, next.grainAmount);
      gl.uniform1f(uniforms.uGrainScale, next.grainScale);
      gl.uniform1f(uniforms.uGrainAnimated, next.grainAnimated ? 1 : 0);
      gl.uniform1f(uniforms.uContrast, next.contrast);
      gl.uniform1f(uniforms.uGamma, next.gamma);
      gl.uniform1f(uniforms.uSaturation, next.saturation);
      gl.uniform2f(uniforms.uCenterOffset, next.centerX, next.centerY);
      gl.uniform1f(uniforms.uZoom, next.zoom);
      gl.uniform3f(uniforms.uColor1, color1[0], color1[1], color1[2]);
      gl.uniform3f(uniforms.uColor2, color2[0], color2[1], color2[2]);
      gl.uniform3f(uniforms.uColor3, color3[0], color3[1], color3[2]);
    };

    let frame = 0;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    let lastRenderAt = 0;
    const startedAt = performance.now();
    const frameInterval = 1000 / 30;

    const render = (now) => {
      if (now - lastRenderAt >= frameInterval) {
        lastRenderAt = now;
        gl.useProgram(program);
        setUniforms((now - startedAt) * 0.001);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      frame = requestAnimationFrame(render);
    };

    const start = () => {
      if (isVisible && isPageVisible && frame === 0) {
        frame = requestAnimationFrame(render);
      }
    };

    const stop = () => {
      if (frame !== 0) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    let resizeObserver;
    const handleResize = () => setSize();
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(setSize);
      resizeObserver.observe(container);
    } else {
      window.addEventListener('resize', handleResize);
    }

    let intersectionObserver;
    if ('IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) start();
        else stop();
      });
      intersectionObserver.observe(container);
    }

    const handleVisibility = () => {
      isPageVisible = !document.hidden;
      if (isPageVisible) start();
      else stop();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    setSize();
    start();

    return () => {
      stop();
      if (resizeObserver) resizeObserver.disconnect();
      else window.removeEventListener('resize', handleResize);
      if (intersectionObserver) intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      container.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} className={`grainient-container ${className}`.trim()} aria-hidden="true" />;
};

export default Grainient;
