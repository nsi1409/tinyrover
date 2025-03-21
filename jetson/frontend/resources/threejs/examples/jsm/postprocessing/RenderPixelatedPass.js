import{WebGLRenderTarget as e,MeshNormalMaterial as t,ShaderMaterial as r,Vector2 as a,Vector4 as i,DepthTexture as n,NearestFilter as o,HalfFloatType as l}from"three";import{Pass as d,FullScreenQuad as s}from"./Pass.js";class RenderPixelatedPass extends d{constructor(r,i,d,h={}){super(),this.pixelSize=r,this.resolution=new a,this.renderResolution=new a,this.pixelatedMaterial=this.createPixelatedMaterial(),this.normalMaterial=new t,this.fsQuad=new s(this.pixelatedMaterial),this.scene=i,this.camera=d,this.normalEdgeStrength=h.normalEdgeStrength||.3,this.depthEdgeStrength=h.depthEdgeStrength||.4,this.beautyRenderTarget=new e,this.beautyRenderTarget.texture.minFilter=o,this.beautyRenderTarget.texture.magFilter=o,this.beautyRenderTarget.texture.type=l,this.beautyRenderTarget.depthTexture=new n,this.normalRenderTarget=new e,this.normalRenderTarget.texture.minFilter=o,this.normalRenderTarget.texture.magFilter=o,this.normalRenderTarget.texture.type=l}dispose(){this.beautyRenderTarget.dispose(),this.normalRenderTarget.dispose(),this.pixelatedMaterial.dispose(),this.normalMaterial.dispose(),this.fsQuad.dispose()}setSize(e,t){this.resolution.set(e,t),this.renderResolution.set(e/this.pixelSize|0,t/this.pixelSize|0);let{x:r,y:a}=this.renderResolution;this.beautyRenderTarget.setSize(r,a),this.normalRenderTarget.setSize(r,a),this.fsQuad.material.uniforms.resolution.value.set(r,a,1/r,1/a)}setPixelSize(e){this.pixelSize=e,this.setSize(this.resolution.x,this.resolution.y)}render(e,t){let r=this.fsQuad.material.uniforms;r.normalEdgeStrength.value=this.normalEdgeStrength,r.depthEdgeStrength.value=this.depthEdgeStrength,e.setRenderTarget(this.beautyRenderTarget),e.render(this.scene,this.camera);let a=this.scene.overrideMaterial;e.setRenderTarget(this.normalRenderTarget),this.scene.overrideMaterial=this.normalMaterial,e.render(this.scene,this.camera),this.scene.overrideMaterial=a,r.tDiffuse.value=this.beautyRenderTarget.texture,r.tDepth.value=this.beautyRenderTarget.depthTexture,r.tNormal.value=this.normalRenderTarget.texture,this.renderToScreen?e.setRenderTarget(null):(e.setRenderTarget(t),this.clear&&e.clear()),this.fsQuad.render(e)}createPixelatedMaterial(){return new r({uniforms:{tDiffuse:{value:null},tDepth:{value:null},tNormal:{value:null},resolution:{value:new i(this.renderResolution.x,this.renderResolution.y,1/this.renderResolution.x,1/this.renderResolution.y)},normalEdgeStrength:{value:0},depthEdgeStrength:{value:0}},vertexShader:`
				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,fragmentShader:`
				uniform sampler2D tDiffuse;
				uniform sampler2D tDepth;
				uniform sampler2D tNormal;
				uniform vec4 resolution;
				uniform float normalEdgeStrength;
				uniform float depthEdgeStrength;
				varying vec2 vUv;

				float getDepth(int x, int y) {
					return texture2D( tDepth, vUv + vec2(x, y) * resolution.zw ).r;
				}

				vec3 getNormal(int x, int y) {
					return texture2D( tNormal, vUv + vec2(x, y) * resolution.zw ).rgb * 2.0 - 1.0;
				}

				float depthEdgeIndicator(float depth, vec3 normal) {
					float diff = 0.0;
					diff += clamp(getDepth(1, 0) - depth, 0.0, 1.0);
					diff += clamp(getDepth(-1, 0) - depth, 0.0, 1.0);
					diff += clamp(getDepth(0, 1) - depth, 0.0, 1.0);
					diff += clamp(getDepth(0, -1) - depth, 0.0, 1.0);
					return floor(smoothstep(0.01, 0.02, diff) * 2.) / 2.;
				}

				float neighborNormalEdgeIndicator(int x, int y, float depth, vec3 normal) {
					float depthDiff = getDepth(x, y) - depth;
					vec3 neighborNormal = getNormal(x, y);
					vec3 normalEdgeBias = vec3(1., 1., 1.);
					float normalDiff = dot(normal - neighborNormal, normalEdgeBias);
					float normalIndicator = clamp(smoothstep(-.01, .01, normalDiff), 0.0, 1.0);
					float depthIndicator = clamp(sign(depthDiff * .25 + .0025), 0.0, 1.0);
					return (1.0 - dot(normal, neighborNormal)) * depthIndicator * normalIndicator;
				}

				float normalEdgeIndicator(float depth, vec3 normal) {
					float indicator = 0.0;
					indicator += neighborNormalEdgeIndicator(0, -1, depth, normal);
					indicator += neighborNormalEdgeIndicator(0, 1, depth, normal);
					indicator += neighborNormalEdgeIndicator(-1, 0, depth, normal);
					indicator += neighborNormalEdgeIndicator(1, 0, depth, normal);
					return step(0.1, indicator);
				}

				void main() {
					vec4 texel = texture2D( tDiffuse, vUv );
					float depth = 0.0;
					vec3 normal = vec3(0.0);
					if (depthEdgeStrength > 0.0 || normalEdgeStrength > 0.0) {
						depth = getDepth(0, 0);
						normal = getNormal(0, 0);
					}
					float dei = 0.0;
					if (depthEdgeStrength > 0.0)
						dei = depthEdgeIndicator(depth, normal);
					float nei = 0.0;
					if (normalEdgeStrength > 0.0)
						nei = normalEdgeIndicator(depth, normal);
					float Strength = dei > 0.0 ? (1.0 - depthEdgeStrength * dei) : (1.0 + normalEdgeStrength * nei);
					gl_FragColor = texel * Strength;
				}
			`})}}export{RenderPixelatedPass};