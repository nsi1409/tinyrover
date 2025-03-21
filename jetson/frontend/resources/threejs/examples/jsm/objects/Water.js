import{Color as e,FrontSide as r,Matrix4 as o,Mesh as t,PerspectiveCamera as i,Plane as a,ShaderMaterial as n,UniformsLib as l,UniformsUtils as s,Vector3 as u,Vector4 as m,WebGLRenderTarget as c}from"three";class Water extends t{constructor(t,d={}){super(t),this.isWater=!0;let v=this,$=void 0!==d.textureWidth?d.textureWidth:512,f=void 0!==d.textureHeight?d.textureHeight:512,p=void 0!==d.clipBias?d.clipBias:0,x=void 0!==d.alpha?d.alpha:1,g=void 0!==d.time?d.time:0,w=void 0!==d.waterNormals?d.waterNormals:null,_=void 0!==d.sunDirection?d.sunDirection:new u(.70707,.70707,0),h=new e(void 0!==d.sunColor?d.sunColor:16777215),y=new e(void 0!==d.waterColor?d.waterColor:8355711),C=void 0!==d.eye?d.eye:new u(0,0,0),S=void 0!==d.distortionScale?d.distortionScale:20,M=void 0!==d.side?d.side:r,D=void 0!==d.fog&&d.fog,b=new a,z=new u,P=new u,W=new u,N=new o,L=new u(0,0,-1),R=new m,T=new u,F=new u,U=new m,j=new o,k=new i,V=new c($,f),B={name:"MirrorShader",uniforms:s.merge([l.fog,l.lights,{normalSampler:{value:null},mirrorSampler:{value:null},alpha:{value:1},time:{value:0},size:{value:1},distortionScale:{value:20},textureMatrix:{value:new o},sunColor:{value:new e(8355711)},sunDirection:{value:new u(.70707,.70707,0)},eye:{value:new u},waterColor:{value:new e(5592405)}}]),vertexShader:`
				uniform mat4 textureMatrix;
				uniform float time;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				#include <common>
				#include <fog_pars_vertex>
				#include <shadowmap_pars_vertex>
				#include <logdepthbuf_pars_vertex>

				void main() {
					mirrorCoord = modelMatrix * vec4( position, 1.0 );
					worldPosition = mirrorCoord.xyzw;
					mirrorCoord = textureMatrix * mirrorCoord;
					vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
					gl_Position = projectionMatrix * mvPosition;

				#include <beginnormal_vertex>
				#include <defaultnormal_vertex>
				#include <logdepthbuf_vertex>
				#include <fog_vertex>
				#include <shadowmap_vertex>
			}`,fragmentShader:`
				uniform sampler2D mirrorSampler;
				uniform float alpha;
				uniform float time;
				uniform float size;
				uniform float distortionScale;
				uniform sampler2D normalSampler;
				uniform vec3 sunColor;
				uniform vec3 sunDirection;
				uniform vec3 eye;
				uniform vec3 waterColor;

				varying vec4 mirrorCoord;
				varying vec4 worldPosition;

				vec4 getNoise( vec2 uv ) {
					vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
					vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
					vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
					vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
					vec4 noise = texture2D( normalSampler, uv0 ) +
						texture2D( normalSampler, uv1 ) +
						texture2D( normalSampler, uv2 ) +
						texture2D( normalSampler, uv3 );
					return noise * 0.5 - 1.0;
				}

				void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {
					vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );
					float direction = max( 0.0, dot( eyeDirection, reflection ) );
					specularColor += pow( direction, shiny ) * sunColor * spec;
					diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;
				}

				#include <common>
				#include <packing>
				#include <bsdfs>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <lights_pars_begin>
				#include <shadowmap_pars_fragment>
				#include <shadowmask_pars_fragment>

				void main() {

					#include <logdepthbuf_fragment>
					vec4 noise = getNoise( worldPosition.xz * size );
					vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );

					vec3 diffuseLight = vec3(0.0);
					vec3 specularLight = vec3(0.0);

					vec3 worldToEye = eye-worldPosition.xyz;
					vec3 eyeDirection = normalize( worldToEye );
					sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );

					float distance = length(worldToEye);

					vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;
					vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion ) );

					float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );
					float rf0 = 0.3;
					float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );
					vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;
					vec3 albedo = mix( ( sunColor * diffuseLight * 0.3 + scatter ) * getShadowMask(), ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance);
					vec3 outgoingLight = albedo;
					gl_FragColor = vec4( outgoingLight, alpha );

					#include <tonemapping_fragment>
					#include <colorspace_fragment>
					#include <fog_fragment>	
				}`},E=new n({name:B.name,uniforms:s.clone(B.uniforms),vertexShader:B.vertexShader,fragmentShader:B.fragmentShader,lights:!0,side:M,fog:D});E.uniforms.mirrorSampler.value=V.texture,E.uniforms.textureMatrix.value=j,E.uniforms.alpha.value=x,E.uniforms.time.value=g,E.uniforms.normalSampler.value=w,E.uniforms.sunColor.value=h,E.uniforms.waterColor.value=y,E.uniforms.sunDirection.value=_,E.uniforms.distortionScale.value=S,E.uniforms.eye.value=C,v.material=E,v.onBeforeRender=function(e,r,o){if(P.setFromMatrixPosition(v.matrixWorld),W.setFromMatrixPosition(o.matrixWorld),N.extractRotation(v.matrixWorld),z.set(0,0,1),z.applyMatrix4(N),T.subVectors(P,W),T.dot(z)>0)return;T.reflect(z).negate(),T.add(P),N.extractRotation(o.matrixWorld),L.set(0,0,-1),L.applyMatrix4(N),L.add(W),F.subVectors(P,L),F.reflect(z).negate(),F.add(P),k.position.copy(T),k.up.set(0,1,0),k.up.applyMatrix4(N),k.up.reflect(z),k.lookAt(F),k.far=o.far,k.updateMatrixWorld(),k.projectionMatrix.copy(o.projectionMatrix),j.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),j.multiply(k.projectionMatrix),j.multiply(k.matrixWorldInverse),b.setFromNormalAndCoplanarPoint(z,P),b.applyMatrix4(k.matrixWorldInverse),R.set(b.normal.x,b.normal.y,b.normal.z,b.constant);let t=k.projectionMatrix;U.x=(Math.sign(R.x)+t.elements[8])/t.elements[0],U.y=(Math.sign(R.y)+t.elements[9])/t.elements[5],U.z=-1,U.w=(1+t.elements[10])/t.elements[14],R.multiplyScalar(2/R.dot(U)),t.elements[2]=R.x,t.elements[6]=R.y,t.elements[10]=R.z+1-p,t.elements[14]=R.w,C.setFromMatrixPosition(o.matrixWorld);let i=e.getRenderTarget(),a=e.xr.enabled,n=e.shadowMap.autoUpdate;v.visible=!1,e.xr.enabled=!1,e.shadowMap.autoUpdate=!1,e.setRenderTarget(V),e.state.buffers.depth.setMask(!0),!1===e.autoClear&&e.clear(),e.render(r,k),v.visible=!0,e.xr.enabled=a,e.shadowMap.autoUpdate=n,e.setRenderTarget(i);let l=o.viewport;void 0!==l&&e.state.viewport(l)}}}export{Water};