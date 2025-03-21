import{NoColorSpace as e,FloatType as t}from"three";import r from"../../common/nodes/NodeUniformsGroup.js";import i from"../../common/nodes/NodeSampler.js";import{NodeSampledTexture as n,NodeSampledCubeTexture as s}from"../../common/nodes/NodeSampledTexture.js";import o from"../../common/UniformBuffer.js";import u from"../../common/StorageBuffer.js";import{getVectorLength as a,getStrideLength as l}from"../../common/BufferUtils.js";import{NodeBuilder as d,CodeNode as p,NodeMaterial as g,FunctionNode as m}from"../../../nodes/Nodes.js";import{getFormat as f}from"../utils/WebGPUTextureUtils.js";import h from"./WGSLNodeParser.js";let gpuShaderStageLib={vertex:GPUShaderStage.VERTEX,fragment:GPUShaderStage.FRAGMENT,compute:GPUShaderStage.COMPUTE},supports={instance:!0},wgslTypeLib={float:"f32",int:"i32",uint:"u32",bool:"bool",color:"vec3<f32>",vec2:"vec2<f32>",ivec2:"vec2<i32>",uvec2:"vec2<u32>",bvec2:"vec2<bool>",vec3:"vec3<f32>",ivec3:"vec3<i32>",uvec3:"vec3<u32>",bvec3:"vec3<bool>",vec4:"vec4<f32>",ivec4:"vec4<i32>",uvec4:"vec4<u32>",bvec4:"vec4<bool>",mat3:"mat3x3<f32>",imat3:"mat3x3<i32>",umat3:"mat3x3<u32>",bmat3:"mat3x3<bool>",mat4:"mat4x4<f32>",imat4:"mat4x4<i32>",umat4:"mat4x4<u32>",bmat4:"mat4x4<bool>"},wgslMethods={dFdx:"dpdx",dFdy:"- dpdy",mod:"threejs_mod",lessThanEqual:"threejs_lessThanEqual",inversesqrt:"inverseSqrt"},wgslPolyfill={lessThanEqual:new p(`
fn threejs_lessThanEqual( a : vec3<f32>, b : vec3<f32> ) -> vec3<bool> {
	return vec3<bool>( a.x <= b.x, a.y <= b.y, a.z <= b.z );
}
`),mod:new p(`
fn threejs_mod( x : f32, y : f32 ) -> f32 {
	return x - y * floor( x / y );
}
`),repeatWrapping:new p(`
fn threejs_repeatWrapping( uv : vec2<f32>, dimension : vec2<u32> ) -> vec2<u32> {
	let uvScaled = vec2<u32>( uv * vec2<f32>( dimension ) );
	return ( ( uvScaled % dimension ) + dimension ) % dimension;
}
`)};class WGSLNodeBuilder extends d{constructor(e,t,r=null){super(e,t,new h,r),this.uniformGroups={},this.builtins={}}build(){let{object:e,material:t}=this;return null!==t?g.fromMaterial(t).build(this):this.addFlow("compute",e),super.build()}needsColorSpaceToLinear(t){return!0===t.isVideoTexture&&t.colorSpace!==e}_generateTextureSample(e,t,r,i,n=this.shaderStage){return"fragment"!==n?this.generateTextureLod(e,t,r):i?`textureSample( ${t}, ${t}_sampler, ${r}, ${i} )`:`textureSample( ${t}, ${t}_sampler, ${r} )`}_generateVideoSample(e,t,r=this.shaderStage){if("fragment"===r)return`textureSampleBaseClampToEdge( ${e}, ${e}_sampler, vec2<f32>( ${t}.x, 1.0 - ${t}.y ) )`;console.error(`WebGPURenderer: THREE.VideoTexture does not support ${r} shader.`)}_generateTextureSampleLevel(e,t,r,i,n,s=this.shaderStage){return"fragment"===s&&!1===this.isUnfilterable(e)?`textureSampleLevel( ${t}, ${t}_sampler, ${r}, ${i} )`:this.generateTextureLod(e,t,r,i)}generateTextureLod(e,t,r,i="0"){return this._include("repeatWrapping"),`textureLoad( ${t}, threejs_repeatWrapping( ${r}, textureDimensions( ${t}, 0 ) ), i32( ${i} ) )`}generateTextureLoad(e,t,r,i,n="0u"){return i?`textureLoad( ${t}, ${r}, ${i}, ${n} )`:`textureLoad( ${t}, ${r}, ${n} )`}isUnfilterable(e){return!0===e.isDataTexture&&e.type===t}generateTexture(e,t,r,i,n=this.shaderStage){return!0===e.isVideoTexture?this._generateVideoSample(t,r,n):this.isUnfilterable(e)?this.generateTextureLod(e,t,r,"0",i,n):this._generateTextureSample(e,t,r,i,n)}generateTextureCompare(e,t,r,i,n,s=this.shaderStage){if("fragment"===s)return`textureSampleCompare( ${t}, ${t}_sampler, ${r}, ${i} )`;console.error(`WebGPURenderer: THREE.DepthTexture.compareFunction() does not support ${s} shader.`)}generateTextureLevel(e,t,r,i,n,s=this.shaderStage){return!0===e.isVideoTexture?this._generateVideoSample(t,r,s):this._generateTextureSampleLevel(e,t,r,i,n,s)}getPropertyName(e,t=this.shaderStage){if(!0===e.isNodeVarying&&!0===e.needsInterpolation){if("vertex"===t)return`varyings.${e.name}`}else if(!0===e.isNodeUniform){let r=e.name,i=e.type;return"texture"===i||"cubeTexture"===i?r:"buffer"===i||"storageBuffer"===i?`NodeBuffer_${e.id}.${r}`:e.groupNode.name+"."+r}return super.getPropertyName(e)}_getUniformGroupCount(e){return Object.keys(this.uniforms[e]).length}getUniformFromNode(e,t,d,p=null){let g=super.getUniformFromNode(e,t,d,p),m=this.getDataFromNode(e,d);if(void 0===m.uniformGPU){let f,h=this.bindings[d];if("texture"===t||"cubeTexture"===t){let c=null;if("texture"===t?c=new n(g.name,g.node):"cubeTexture"===t&&(c=new s(g.name,g.node)),c.store=!0===e.isStoreTextureNode,c.setVisibility(gpuShaderStageLib[d]),"fragment"===d&&!1===this.isUnfilterable(e.value)&&!1===c.store){let x=new i(`${g.name}_sampler`,g.node);x.setVisibility(gpuShaderStageLib[d]),h.push(x,c),f=[x,c]}else h.push(c),f=[c]}else if("buffer"===t||"storageBuffer"===t){let v=new("storageBuffer"===t?u:o)("NodeBuffer_"+e.id,e.value);v.setVisibility(gpuShaderStageLib[d]),h.push(v),f=v}else{let S=e.groupNode,b=S.name,y=this.uniformGroups[d]||(this.uniformGroups[d]={}),T=y[b];if(void 0===T&&((T=new r(b,S)).setVisibility(gpuShaderStageLib[d]),y[b]=T,h.push(T)),!0===e.isArrayUniformNode)for(let $ of(f=[],e.nodes)){let N=this.getNodeUniform($,t);N.boundary=a(N.itemSize),N.itemSize=l(N.itemSize),T.addUniform(N),f.push(N)}else f=this.getNodeUniform(g,t),T.addUniform(f)}m.uniformGPU=f,"vertex"===d&&(this.bindingsOffset.fragment=h.length)}return g}isReference(e){return super.isReference(e)||"texture_2d"===e||"texture_cube"===e||"texture_storage_2d"===e}getBuiltin(e,t,r,i=this.shaderStage){let n=this.builtins[i]||(this.builtins[i]=new Map);return!1===n.has(e)&&n.set(e,{name:e,property:t,type:r}),t}getVertexIndex(){return"vertex"===this.shaderStage?this.getBuiltin("vertex_index","vertexIndex","u32","attribute"):"vertexIndex"}buildFunctionNode(e){let t=e.layout,r=this.flowShaderNode(e),i=[];for(let n of t.inputs)i.push(n.name+" : "+this.getType(n.type));let s=`fn ${t.name}( ${i.join(", ")} ) -> ${this.getType(t.type)} {
${r.vars}
${r.code}
	return ${r.result};
}`;return new m(s)}getInstanceIndex(){return"vertex"===this.shaderStage?this.getBuiltin("instance_index","instanceIndex","u32","attribute"):"instanceIndex"}getFrontFacing(){return this.getBuiltin("front_facing","isFront","bool")}getFragCoord(){return this.getBuiltin("position","fragCoord","vec4<f32>")+".xy"}getFragDepth(){return"output."+this.getBuiltin("frag_depth","depth","f32","output")}isFlipY(){return!1}getBuiltins(e){let t=[],r=this.builtins[e];if(void 0!==r)for(let{name:i,property:n,type:s}of r.values())t.push(`@builtin( ${i} ) ${n} : ${s}`);return t.join(",\n	")}getAttributes(e){let t=[];if("compute"===e&&this.getBuiltin("global_invocation_id","id","vec3<u32>","attribute"),"vertex"===e||"compute"===e){let r=this.getBuiltins("attribute");r&&t.push(r);let i=this.getAttributesArray();for(let n=0,s=i.length;n<s;n++){let o=i[n],u=o.name,a=this.getType(o.type);t.push(`@location( ${n} ) ${u} : ${a}`)}}return t.join(",\n	")}getStructMembers(e){let t=[],r=e.getMemberTypes();for(let i=0;i<r.length;i++){let n=r[i];t.push(`	@location( ${i} ) m${i} : ${n}<f32>`)}return t.join(",\n")}getStructs(e){let t=[],r=this.structs[e];for(let i=0,n=r.length;i<n;i++){let s=r[i],o=`struct ${s.name} {
`;o+=this.getStructMembers(s),o+="\n}",t.push(o)}return t.join("\n\n")}getVar(e,t){return`var ${t} : ${this.getType(e)}`}getVars(e){let t=[],r=this.vars[e];if(void 0!==r)for(let i of r)t.push(`	${this.getVar(i.type,i.name)};`);return`
${t.join("\n")}
`}getVaryings(e){let t=[];if("vertex"===e&&this.getBuiltin("position","Vertex","vec4<f32>","vertex"),"vertex"===e||"fragment"===e){let r=this.varyings,i=this.vars[e];for(let n=0;n<r.length;n++){let s=r[n];if(s.needsInterpolation){let o=`@location( ${n} )`;/^(int|uint|ivec|uvec)/.test(s.type)&&(o+=" @interpolate( flat )"),t.push(`${o} ${s.name} : ${this.getType(s.type)}`)}else"vertex"===e&&!1===i.includes(s)&&i.push(s)}}let u=this.getBuiltins(e);u&&t.push(u);let a=t.join(",\n	");return"vertex"===e?this._getWGSLStruct("VaryingsStruct","	"+a):a}getUniforms(e){let t=this.uniforms[e],r=[],i=[],n=[],s={},o=this.bindingsOffset[e];for(let u of t)if("texture"===u.type||"cubeTexture"===u.type){let a=u.node.value;"fragment"===e&&!1===this.isUnfilterable(a)&&!0!==u.node.isStoreTextureNode&&(!0===a.isDepthTexture&&null!==a.compareFunction?r.push(`@binding( ${o++} ) @group( 0 ) var ${u.name}_sampler : sampler_comparison;`):r.push(`@binding( ${o++} ) @group( 0 ) var ${u.name}_sampler : sampler;`));let l;l=!0===a.isCubeTexture?"texture_cube<f32>":!0===a.isDataArrayTexture?"texture_2d_array<f32>":!0===a.isDepthTexture?"texture_depth_2d":!0===a.isVideoTexture?"texture_external":!0===u.node.isStoreTextureNode?"texture_storage_2d<"+f(a)+", write>":"texture_2d<f32>",r.push(`@binding( ${o++} ) @group( 0 ) var ${u.name} : ${l};`)}else if("buffer"===u.type||"storageBuffer"===u.type){let d=u.node,p=this.getType(d.bufferType),g=d.bufferCount,m=`	${u.name} : array< ${p}${g>0?", "+g:""} >
`,h=d.isStorageBufferNode?"storage,read_write":"uniform";i.push(this._getWGSLStructBinding("NodeBuffer_"+d.id,m,h,o++))}else{let c=this.getType(this.getVectorType(u.type)),x=u.groupNode.name,v=s[x]||(s[x]={index:o++,snippets:[]});if(!0===Array.isArray(u.value)){let S=u.value.length;v.snippets.push(`uniform ${c}[ ${S} ] ${u.name}`)}else v.snippets.push(`	${u.name} : ${c}`)}for(let b in s){let y=s[b];n.push(this._getWGSLStructBinding(b,y.snippets.join(",\n"),"uniform",y.index))}let T=r.join("\n");return T+=i.join("\n"),T+=n.join("\n")}buildCode(){let e=null!==this.material?{fragment:{},vertex:{}}:{compute:{}};for(let t in e){let r=e[t];r.uniforms=this.getUniforms(t),r.attributes=this.getAttributes(t),r.varyings=this.getVaryings(t),r.structs=this.getStructs(t),r.vars=this.getVars(t),r.codes=this.getCodes(t);let i="// code\n\n";i+=this.flowCode[t];let n=this.flowNodes[t],s=n[n.length-1],o=s.outputNode,u=void 0!==o&&!0===o.isOutputStructNode;for(let a of n){let l=this.getFlowData(a),d=a.name;if(d&&(i.length>0&&(i+="\n"),i+=`	// flow -> ${d}
	`),i+=`${l.code}
	`,a===s&&"compute"!==t){if(i+="// result\n\n	","vertex"===t)i+=`varyings.Vertex = ${l.result};`;else if("fragment"===t){if(u)r.returnType=o.nodeType,i+=`return ${l.result};`;else{let p="	@location(0) color: vec4<f32>",g=this.getBuiltins("output");g&&(p+=",\n	"+g),r.returnType="OutputStruct",r.structs+=this._getWGSLStruct("OutputStruct",p),r.structs+="\nvar<private> output : OutputStruct;\n\n",i+=`output.color = ${l.result};

	return output;`}}}}r.flow=i}null!==this.material?(this.vertexShader=this._getWGSLVertexCode(e.vertex),this.fragmentShader=this._getWGSLFragmentCode(e.fragment)):this.computeShader=this._getWGSLComputeCode(e.compute,(this.object.workgroupSize||[64]).join(", "))}getMethod(e){return void 0!==wgslPolyfill[e]&&this._include(e),wgslMethods[e]||e}getType(e){return wgslTypeLib[e]||e}isAvailable(e){return!0===supports[e]}_include(e){wgslPolyfill[e].build(this)}_getWGSLVertexCode(e){return`${this.getSignature()}
${e.uniforms}
${e.varyings}
var<private> varyings : VaryingsStruct;
${e.codes}
@vertex
fn main( ${e.attributes} ) -> VaryingsStruct {
	${e.vars}
	${e.flow}
	return varyings;
}
`}_getWGSLFragmentCode(e){return`${this.getSignature()}
${e.uniforms}
${e.structs}
${e.codes}
@fragment
fn main( ${e.varyings} ) -> ${e.returnType} {
	${e.vars}
	${e.flow}
}
`}_getWGSLComputeCode(e,t){return`${this.getSignature()}
var<private> instanceIndex : u32;
${e.uniforms}
${e.codes}
@compute @workgroup_size( ${t} )
fn main( ${e.attributes} ) {
	instanceIndex = id.x;
	${e.vars}
	${e.flow}
}
`}_getWGSLStruct(e,t){return`
struct ${e} {
${t}
};`}_getWGSLStructBinding(e,t,r,i=0,n=0){let s=e+"Struct";return`${this._getWGSLStruct(s,t)}
@binding( ${i} ) @group( ${n} )
var<${r}> ${e} : ${s};`}}export default WGSLNodeBuilder;