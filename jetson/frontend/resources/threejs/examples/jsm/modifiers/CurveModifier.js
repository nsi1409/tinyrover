let CHANNELS=4,TEXTURE_WIDTH=1024,TEXTURE_HEIGHT=4;import{DataTexture as e,RGBAFormat as t,FloatType as r,RepeatWrapping as i,Mesh as s,InstancedMesh as a,NearestFilter as n,DynamicDrawUsage as o,Matrix4 as f}from"three";export function initSplineTexture(s=1){let a=new Float32Array(4096*s*4),o=new e(a,1024,4*s,t,r);return o.wrapS=i,o.wrapY=i,o.magFilter=n,o.needsUpdate=!0,o}export function updateSplineTexture(e,t,r=0){let i=Math.floor(1024);t.arcLengthDivisions=i/2,t.updateArcLengths();let s=t.getSpacedPoints(i),a=t.computeFrenetFrames(i,!0);for(let n=0;n<i;n++){let o=Math.floor(n/1024),f=n%1024,l=s[n];setTextureValue(e,f,l.x,l.y,l.z,0+o+4*r),setTextureValue(e,f,(l=a.tangents[n]).x,l.y,l.z,1+o+4*r),setTextureValue(e,f,(l=a.normals[n]).x,l.y,l.z,2+o+4*r),setTextureValue(e,f,(l=a.binormals[n]).x,l.y,l.z,3+o+4*r)}e.needsUpdate=!0}function setTextureValue(e,t,r,i,s,a){let{data:n}=e.image,o=4096*a;n[4*t+o+0]=r,n[4*t+o+1]=i,n[4*t+o+2]=s,n[4*t+o+3]=1}export function getUniforms(e){return{spineTexture:{value:e},pathOffset:{type:"f",value:0},pathSegment:{type:"f",value:1},spineOffset:{type:"f",value:161},spineLength:{type:"f",value:400},flow:{type:"i",value:1}}}export function modifyShader(e,t,r=1){e.__ok||(e.__ok=!0,e.onBeforeCompile=e=>{if(e.__modified)return;e.__modified=!0,Object.assign(e.uniforms,t);let i=`
		uniform sampler2D spineTexture;
		uniform float pathOffset;
		uniform float pathSegment;
		uniform float spineOffset;
		uniform float spineLength;
		uniform int flow;

		float textureLayers = ${4*r}.;
		float textureStacks = 1.;

		${e.vertexShader}
		`.replace("#include <beginnormal_vertex>","").replace("#include <defaultnormal_vertex>","").replace("#include <begin_vertex>","").replace(/void\s*main\s*\(\)\s*\{/,`
void main() {
#include <beginnormal_vertex>

vec4 worldPos = modelMatrix * vec4(position, 1.);

bool bend = flow > 0;
float xWeight = bend ? 0. : 1.;

#ifdef USE_INSTANCING
float pathOffsetFromInstanceMatrix = instanceMatrix[3][2];
float spineLengthFromInstanceMatrix = instanceMatrix[3][0];
float spinePortion = bend ? (worldPos.x + spineOffset) / spineLengthFromInstanceMatrix : 0.;
float mt = (spinePortion * pathSegment + pathOffset + pathOffsetFromInstanceMatrix)*textureStacks;
#else
float spinePortion = bend ? (worldPos.x + spineOffset) / spineLength : 0.;
float mt = (spinePortion * pathSegment + pathOffset)*textureStacks;
#endif

mt = mod(mt, textureStacks);
float rowOffset = floor(mt);

#ifdef USE_INSTANCING
rowOffset += instanceMatrix[3][1] * 4.;
#endif

vec3 spinePos = texture2D(spineTexture, vec2(mt, (0. + rowOffset + 0.5) / textureLayers)).xyz;
vec3 a =        texture2D(spineTexture, vec2(mt, (1. + rowOffset + 0.5) / textureLayers)).xyz;
vec3 b =        texture2D(spineTexture, vec2(mt, (2. + rowOffset + 0.5) / textureLayers)).xyz;
vec3 c =        texture2D(spineTexture, vec2(mt, (3. + rowOffset + 0.5) / textureLayers)).xyz;
mat3 basis = mat3(a, b, c);

vec3 transformed = basis
	* vec3(worldPos.x * xWeight, worldPos.y * 1., worldPos.z * 1.)
	+ spinePos;

vec3 transformedNormal = normalMatrix * (basis * objectNormal);
			`).replace("#include <project_vertex>",`vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
				gl_Position = projectionMatrix * mvPosition;`);e.vertexShader=i})}export class Flow{constructor(e,t=1){let r=e.clone(),i=initSplineTexture(t),n=getUniforms(i);r.traverse(function(e){(e instanceof s||e instanceof a)&&(e.material=e.material.clone(),modifyShader(e.material,n,t))}),this.curveArray=Array(t),this.curveLengthArray=Array(t),this.object3D=r,this.splineTexure=i,this.uniforms=n}updateCurve(e,t){if(e>=this.curveArray.length)throw Error("Index out of range for Flow");let r=t.getLength();this.uniforms.spineLength.value=r,this.curveLengthArray[e]=r,this.curveArray[e]=t,updateSplineTexture(this.splineTexure,t,e)}moveAlongCurve(e){this.uniforms.pathOffset.value+=e}}let matrix=new f;export class InstancedFlow extends Flow{constructor(e,t,r,i){let s=new a(r,i,e);s.instanceMatrix.setUsage(o),s.frustumCulled=!1,super(s,t),this.offsets=Array(e).fill(0),this.whichCurve=Array(e).fill(0)}writeChanges(e){matrix.makeTranslation(this.curveLengthArray[this.whichCurve[e]],this.whichCurve[e],this.offsets[e]),this.object3D.setMatrixAt(e,matrix),this.object3D.instanceMatrix.needsUpdate=!0}moveIndividualAlongCurve(e,t){this.offsets[e]+=t,this.writeChanges(e)}setCurve(e,t){if(isNaN(t))throw Error("curve index being set is Not a Number (NaN)");this.whichCurve[e]=t,this.writeChanges(e)}}