import{GPUTextureViewDimension as e,GPUIndexFormat as i,GPUFilterMode as t,GPUPrimitiveTopology as r,GPULoadOp as a,GPUStoreOp as n}from"./WebGPUConstants.js";class WebGPUTexturePassUtils{constructor(e){this.device=e;let i=`
struct VarysStruct {
	@builtin( position ) Position: vec4<f32>,
	@location( 0 ) vTex : vec2<f32>
};

@vertex
fn main( @builtin( vertex_index ) vertexIndex : u32 ) -> VarysStruct {

	var Varys : VarysStruct;

	var pos = array< vec2<f32>, 4 >(
		vec2<f32>( -1.0,  1.0 ),
		vec2<f32>(  1.0,  1.0 ),
		vec2<f32>( -1.0, -1.0 ),
		vec2<f32>(  1.0, -1.0 )
	);

	var tex = array< vec2<f32>, 4 >(
		vec2<f32>( 0.0, 0.0 ),
		vec2<f32>( 1.0, 0.0 ),
		vec2<f32>( 0.0, 1.0 ),
		vec2<f32>( 1.0, 1.0 )
	);

	Varys.vTex = tex[ vertexIndex ];
	Varys.Position = vec4<f32>( pos[ vertexIndex ], 0.0, 1.0 );

	return Varys;

}
`,r=`
@group( 0 ) @binding( 0 )
var imgSampler : sampler;

@group( 0 ) @binding( 1 )
var img : texture_2d<f32>;

@fragment
fn main( @location( 0 ) vTex : vec2<f32> ) -> @location( 0 ) vec4<f32> {

	return textureSample( img, imgSampler, vTex );

}
`,a=`
@group( 0 ) @binding( 0 )
var imgSampler : sampler;

@group( 0 ) @binding( 1 )
var img : texture_2d<f32>;

@fragment
fn main( @location( 0 ) vTex : vec2<f32> ) -> @location( 0 ) vec4<f32> {

	return textureSample( img, imgSampler, vec2( vTex.x, 1.0 - vTex.y ) );

}
`;this.mipmapSampler=e.createSampler({minFilter:t.Linear}),this.flipYSampler=e.createSampler({minFilter:t.Nearest}),this.transferPipelines={},this.flipYPipelines={},this.mipmapVertexShaderModule=e.createShaderModule({label:"mipmapVertex",code:i}),this.mipmapFragmentShaderModule=e.createShaderModule({label:"mipmapFragment",code:r}),this.flipYFragmentShaderModule=e.createShaderModule({label:"flipYFragment",code:a})}getTransferPipeline(e){let t=this.transferPipelines[e];return void 0===t&&(t=this.device.createRenderPipeline({vertex:{module:this.mipmapVertexShaderModule,entryPoint:"main"},fragment:{module:this.mipmapFragmentShaderModule,entryPoint:"main",targets:[{format:e}]},primitive:{topology:r.TriangleStrip,stripIndexFormat:i.Uint32},layout:"auto"}),this.transferPipelines[e]=t),t}getFlipYPipeline(e){let t=this.flipYPipelines[e];return void 0===t&&(t=this.device.createRenderPipeline({vertex:{module:this.mipmapVertexShaderModule,entryPoint:"main"},fragment:{module:this.flipYFragmentShaderModule,entryPoint:"main",targets:[{format:e}]},primitive:{topology:r.TriangleStrip,stripIndexFormat:i.Uint32},layout:"auto"}),this.flipYPipelines[e]=t),t}flipY(i,t,r=0){let s=t.format,{width:o,height:l}=t.size,p=this.getTransferPipeline(s),m=this.getFlipYPipeline(s),d=this.device.createTexture({size:{width:o,height:l,depthOrArrayLayers:1},format:s,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.TEXTURE_BINDING}),u=i.createView({baseMipLevel:0,mipLevelCount:1,dimension:e.TwoD,baseArrayLayer:r}),c=d.createView({baseMipLevel:0,mipLevelCount:1,dimension:e.TwoD,baseArrayLayer:0}),v=this.device.createCommandEncoder({}),$=(e,i,t)=>{let r=e.getBindGroupLayout(0),s=this.device.createBindGroup({layout:r,entries:[{binding:0,resource:this.flipYSampler},{binding:1,resource:i}]}),o=v.beginRenderPass({colorAttachments:[{view:t,loadOp:a.Clear,storeOp:n.Store,clearValue:[0,0,0,0]}]});o.setPipeline(e),o.setBindGroup(0,s),o.draw(4,1,0,0),o.end()};$(p,u,c),$(m,c,u),this.device.queue.submit([v.finish()]),d.destroy()}generateMipmaps(i,t,r=0){let s=this.getTransferPipeline(t.format),o=this.device.createCommandEncoder({}),l=s.getBindGroupLayout(0),p=i.createView({baseMipLevel:0,mipLevelCount:1,dimension:e.TwoD,baseArrayLayer:r});for(let m=1;m<t.mipLevelCount;m++){let d=this.device.createBindGroup({layout:l,entries:[{binding:0,resource:this.mipmapSampler},{binding:1,resource:p}]}),u=i.createView({baseMipLevel:m,mipLevelCount:1,dimension:e.TwoD,baseArrayLayer:r}),c=o.beginRenderPass({colorAttachments:[{view:u,loadOp:a.Clear,storeOp:n.Store,clearValue:[0,0,0,0]}]});c.setPipeline(s),c.setBindGroup(0,d),c.draw(4,1,0,0),c.end(),p=u}this.device.queue.submit([o.finish()])}}export default WebGPUTexturePassUtils;