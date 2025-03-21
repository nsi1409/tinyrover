import{AdditiveBlending as e,HalfFloatType as r,ShaderMaterial as t,UniformsUtils as s,Vector2 as i,WebGLRenderTarget as n}from"three";import{Pass as a,FullScreenQuad as o}from"./Pass.js";import{ConvolutionShader as l}from"../shaders/ConvolutionShader.js";class BloomPass extends a{constructor(i=1,a=25,m=4){super(),this.renderTargetX=new n(1,1,{type:r}),this.renderTargetX.texture.name="BloomPass.x",this.renderTargetY=new n(1,1,{type:r}),this.renderTargetY.texture.name="BloomPass.y",this.combineUniforms=s.clone(CombineShader.uniforms),this.combineUniforms.strength.value=i,this.materialCombine=new t({name:CombineShader.name,uniforms:this.combineUniforms,vertexShader:CombineShader.vertexShader,fragmentShader:CombineShader.fragmentShader,blending:e,transparent:!0});let d=l;this.convolutionUniforms=s.clone(d.uniforms),this.convolutionUniforms.uImageIncrement.value=BloomPass.blurX,this.convolutionUniforms.cKernel.value=l.buildKernel(m),this.materialConvolution=new t({name:d.name,uniforms:this.convolutionUniforms,vertexShader:d.vertexShader,fragmentShader:d.fragmentShader,defines:{KERNEL_SIZE_FLOAT:a.toFixed(1),KERNEL_SIZE_INT:a.toFixed(0)}}),this.needsSwap=!1,this.fsQuad=new o(null)}render(e,r,t,s,i){i&&e.state.buffers.stencil.setTest(!1),this.fsQuad.material=this.materialConvolution,this.convolutionUniforms.tDiffuse.value=t.texture,this.convolutionUniforms.uImageIncrement.value=BloomPass.blurX,e.setRenderTarget(this.renderTargetX),e.clear(),this.fsQuad.render(e),this.convolutionUniforms.tDiffuse.value=this.renderTargetX.texture,this.convolutionUniforms.uImageIncrement.value=BloomPass.blurY,e.setRenderTarget(this.renderTargetY),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.materialCombine,this.combineUniforms.tDiffuse.value=this.renderTargetY.texture,i&&e.state.buffers.stencil.setTest(!0),e.setRenderTarget(t),this.clear&&e.clear(),this.fsQuad.render(e)}setSize(e,r){this.renderTargetX.setSize(e,r),this.renderTargetY.setSize(e,r)}dispose(){this.renderTargetX.dispose(),this.renderTargetY.dispose(),this.materialCombine.dispose(),this.materialConvolution.dispose(),this.fsQuad.dispose()}}let CombineShader={name:"CombineShader",uniforms:{tDiffuse:{value:null},strength:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float strength;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = strength * texel;

		}`};BloomPass.blurX=new i(.001953125,0),BloomPass.blurY=new i(0,.001953125);export{BloomPass};