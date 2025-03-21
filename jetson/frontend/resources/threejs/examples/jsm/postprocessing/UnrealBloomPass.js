import{AdditiveBlending as e,Color as r,HalfFloatType as t,MeshBasicMaterial as s,ShaderMaterial as i,UniformsUtils as a,Vector2 as o,Vector3 as l,WebGLRenderTarget as n}from"three";import{Pass as u,FullScreenQuad as h}from"./Pass.js";import{CopyShader as m}from"../shaders/CopyShader.js";import{LuminosityHighPassShader as d}from"../shaders/LuminosityHighPassShader.js";class UnrealBloomPass extends u{constructor(u,f,c,v){super(),this.strength=void 0!==f?f:1,this.radius=c,this.threshold=v,this.resolution=void 0!==u?new o(u.x,u.y):new o(256,256),this.clearColor=new r(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let g=Math.round(this.resolution.x/2),p=Math.round(this.resolution.y/2);this.renderTargetBright=new n(g,p,{type:t}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let T=0;T<this.nMips;T++){let b=new n(g,p,{type:t});b.texture.name="UnrealBloomPass.h"+T,b.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(b);let x=new n(g,p,{type:t});x.texture.name="UnrealBloomPass.v"+T,x.texture.generateMipmaps=!1,this.renderTargetsVertical.push(x),g=Math.round(g/2),p=Math.round(p/2)}let _=d;this.highPassUniforms=a.clone(_.uniforms),this.highPassUniforms.luminosityThreshold.value=v,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new i({uniforms:this.highPassUniforms,vertexShader:_.vertexShader,fragmentShader:_.fragmentShader}),this.separableBlurMaterials=[];let M=[3,5,7,9,11];g=Math.round(this.resolution.x/2),p=Math.round(this.resolution.y/2);for(let S=0;S<this.nMips;S++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(M[S])),this.separableBlurMaterials[S].uniforms.invSize.value=new o(1/g,1/p),g=Math.round(g/2),p=Math.round(p/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=f,this.compositeMaterial.uniforms.bloomRadius.value=.1;let C=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=C,this.bloomTintColors=[new l(1,1,1),new l(1,1,1),new l(1,1,1),new l(1,1,1),new l(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;let B=m;this.copyUniforms=a.clone(B.uniforms),this.blendMaterial=new i({uniforms:this.copyUniforms,vertexShader:B.vertexShader,fragmentShader:B.fragmentShader,blending:e,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new r,this.oldClearAlpha=1,this.basic=new s,this.fsQuad=new h(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let r=0;r<this.renderTargetsVertical.length;r++)this.renderTargetsVertical[r].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,r){let t=Math.round(e/2),s=Math.round(r/2);this.renderTargetBright.setSize(t,s);for(let i=0;i<this.nMips;i++)this.renderTargetsHorizontal[i].setSize(t,s),this.renderTargetsVertical[i].setSize(t,s),this.separableBlurMaterials[i].uniforms.invSize.value=new o(1/t,1/s),t=Math.round(t/2),s=Math.round(s/2)}render(e,r,t,s,i){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();let a=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),i&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=t.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=t.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this.fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=UnrealBloomPass.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[l]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=UnrealBloomPass.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[l]),e.clear(),this.fsQuad.render(e),o=this.renderTargetsVertical[l];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,i&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=a}getSeperableBlurMaterial(e){let r=[];for(let t=0;t<e;t++)r.push(.39894*Math.exp(-.5*t*t/(e*e))/e);return new i({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new o(.5,.5)},direction:{value:new o(.5,.5)},gaussianCoefficients:{value:r}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new i({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}UnrealBloomPass.BlurDirectionX=new o(1,0),UnrealBloomPass.BlurDirectionY=new o(0,1);export{UnrealBloomPass};