import{r as h,j as I}from"./index-DQpgCVlY.js";const w=t=>{const n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return n?[parseInt(n[1],16)/255,parseInt(n[2],16)/255,parseInt(n[3],16)/255]:[1,1,1]},q=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,z=`#version 300 es
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
`,G={timeSpeed:.25,colorBalance:0,warpStrength:1,warpFrequency:5,warpSpeed:2,warpAmplitude:50,blendAngle:0,blendSoftness:.05,rotationAmount:500,noiseScale:2,grainAmount:.1,grainScale:2,grainAnimated:!1,contrast:1.5,gamma:1,saturation:1,centerX:0,centerY:0,zoom:.9,color1:"#FF9FFC",color2:"#5227FF",color3:"#B497CF"},W=(t,n,f)=>{const u=t.createShader(n);if(t.shaderSource(u,f),t.compileShader(u),!t.getShaderParameter(u,t.COMPILE_STATUS))throw new Error(t.getShaderInfoLog(u)||"Shader compile failed");return u},U=t=>{const n=t.createProgram(),f=W(t,t.VERTEX_SHADER,q),u=W(t,t.FRAGMENT_SHADER,z);if(t.attachShader(n,f),t.attachShader(n,u),t.linkProgram(n),t.deleteShader(f),t.deleteShader(u),!t.getProgramParameter(n,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(n)||"Program link failed");return n},N=({className:t="",...n})=>{const f=h.useRef(null),u=h.useRef({...G,...n});return h.useEffect(()=>{u.current={...G,...n}},[n]),h.useEffect(()=>{const c=f.current;if(!c)return;const i=document.createElement("canvas");i.setAttribute("aria-hidden","true"),c.appendChild(i);const e=i.getContext("webgl2",{alpha:!0,antialias:!1,depth:!1,stencil:!1});if(!e)return c.classList.add("grainient-fallback"),()=>{c.removeChild(i)};let m;try{m=U(e)}catch{return c.classList.add("grainient-fallback"),()=>{c.removeChild(i)}}const x=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,x),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.useProgram(m);const y=e.getAttribLocation(m,"position");e.enableVertexAttribArray(y),e.vertexAttribPointer(y,2,e.FLOAT,!1,0,0);const r=Object.fromEntries(["iResolution","iTime","uTimeSpeed","uColorBalance","uWarpStrength","uWarpFrequency","uWarpSpeed","uWarpAmplitude","uBlendAngle","uBlendSoftness","uRotationAmount","uNoiseScale","uGrainAmount","uGrainScale","uGrainAnimated","uContrast","uGamma","uSaturation","uCenterOffset","uZoom","uColor1","uColor2","uColor3"].map(a=>[a,e.getUniformLocation(m,a)])),g=()=>{const a=c.getBoundingClientRect(),o=Math.min(window.devicePixelRatio||1,1.15),l=Math.max(1,Math.floor(a.width*o)),s=Math.max(1,Math.floor(a.height*o));(i.width!==l||i.height!==s)&&(i.width=l,i.height=s,e.viewport(0,0,l,s))},L=a=>{const o=u.current,l=w(o.color1),s=w(o.color2),R=w(o.color3);e.uniform2f(r.iResolution,i.width,i.height),e.uniform1f(r.iTime,a),e.uniform1f(r.uTimeSpeed,o.timeSpeed),e.uniform1f(r.uColorBalance,o.colorBalance),e.uniform1f(r.uWarpStrength,o.warpStrength),e.uniform1f(r.uWarpFrequency,o.warpFrequency),e.uniform1f(r.uWarpSpeed,o.warpSpeed),e.uniform1f(r.uWarpAmplitude,o.warpAmplitude),e.uniform1f(r.uBlendAngle,o.blendAngle),e.uniform1f(r.uBlendSoftness,o.blendSoftness),e.uniform1f(r.uRotationAmount,o.rotationAmount),e.uniform1f(r.uNoiseScale,o.noiseScale),e.uniform1f(r.uGrainAmount,o.grainAmount),e.uniform1f(r.uGrainScale,o.grainScale),e.uniform1f(r.uGrainAnimated,o.grainAnimated?1:0),e.uniform1f(r.uContrast,o.contrast),e.uniform1f(r.uGamma,o.gamma),e.uniform1f(r.uSaturation,o.saturation),e.uniform2f(r.uCenterOffset,o.centerX,o.centerY),e.uniform1f(r.uZoom,o.zoom),e.uniform3f(r.uColor1,l[0],l[1],l[2]),e.uniform3f(r.uColor2,s[0],s[1],s[2]),e.uniform3f(r.uColor3,R[0],R[1],R[2])};let d=0,S=!0,A=!document.hidden,F=0;const O=performance.now(),P=1e3/30,T=a=>{a-F>=P&&(F=a,e.useProgram(m),L((a-O)*.001),e.drawArrays(e.TRIANGLES,0,3)),d=requestAnimationFrame(T)},b=()=>{S&&A&&d===0&&(d=requestAnimationFrame(T))},C=()=>{d!==0&&(cancelAnimationFrame(d),d=0)};let v;const B=()=>g();"ResizeObserver"in window?(v=new ResizeObserver(g),v.observe(c)):window.addEventListener("resize",B);let p;"IntersectionObserver"in window&&(p=new IntersectionObserver(([a])=>{S=a.isIntersecting,S?b():C()}),p.observe(c));const E=()=>{A=!document.hidden,A?b():C()};return document.addEventListener("visibilitychange",E),g(),b(),()=>{C(),v?v.disconnect():window.removeEventListener("resize",B),p&&p.disconnect(),document.removeEventListener("visibilitychange",E),e.deleteBuffer(x),e.deleteProgram(m),c.removeChild(i)}},[]),I.jsx("div",{ref:f,className:`grainient-container ${t}`.trim(),"aria-hidden":"true"})};export{N as default};
