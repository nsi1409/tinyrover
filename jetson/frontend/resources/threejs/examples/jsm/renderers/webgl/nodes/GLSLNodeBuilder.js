import{MathNode as e,GLSLNodeParser as t,NodeBuilder as r,NodeMaterial as o,FunctionNode as n}from"../../../nodes/Nodes.js";import i from"../../common/UniformBuffer.js";import s from"../../common/nodes/NodeUniformsGroup.js";import{NodeSampledTexture as u,NodeSampledCubeTexture as a}from"../../common/nodes/NodeSampledTexture.js";import{IntType as l}from"three";let glslMethods={[e.ATAN2]:"atan",textureDimensions:"textureSize"},precisionLib={low:"lowp",medium:"mediump",high:"highp"},supports={instance:!0},defaultPrecisions=`
precision highp float;
precision highp int;
precision mediump sampler2DArray;
precision lowp sampler2DShadow;
`;class GLSLNodeBuilder extends r{constructor(e,r,o=null){super(e,r,new t,o),this.uniformGroups={}}getMethod(e){return glslMethods[e]||e}getPropertyName(e,t){return e.isOutputStructVar?"":super.getPropertyName(e,t)}buildFunctionNode(e){let t=e.layout,r=this.flowShaderNode(e),o=[];for(let i of t.inputs)o.push(this.getType(i.type)+" "+i.name);let s=`${this.getType(t.type)} ${t.name}( ${o.join(", ")} ) {

	${r.vars}

${r.code}
	return ${r.result};

}`;return new n(s)}generateTextureLoad(e,t,r,o,n="0"){return o?`texelFetch( ${t}, ivec3( ${r}, ${o} ), ${n} )`:`texelFetch( ${t}, ${r}, ${n} )`}generateTexture(e,t,r,o){return e.isTextureCube?`textureCube( ${t}, ${r} )`:e.isDepthTexture?`texture( ${t}, ${r} ).x`:(o&&(r=`vec3( ${r}, ${o} )`),`texture( ${t}, ${r} )`)}generateTextureLevel(e,t,r,o){return`textureLod( ${t}, ${r}, ${o} )`}generateTextureCompare(e,t,r,o,n,i=this.shaderStage){if("fragment"===i)return`texture( ${t}, vec3( ${r}, ${o} ) )`;console.error(`WebGPURenderer: THREE.DepthTexture.compareFunction() does not support ${i} shader.`)}getVars(e){let t=[],r=this.vars[e];if(void 0!==r)for(let o of r)o.isOutputStructVar||t.push(`${this.getVar(o.type,o.name)};`);return t.join("\n	")}getUniforms(e){let t=this.uniforms[e],r=[],o={};for(let n of t){let i=null,s=!1;if("texture"===n.type){let u=n.node.value;i=u.compareFunction?`sampler2DShadow ${n.name};`:!0===u.isDataArrayTexture?`sampler2DArray ${n.name};`:`sampler2D ${n.name};`}else if("cubeTexture"===n.type)i=`samplerCube ${n.name};`;else if("buffer"===n.type){let a=n.node,l=this.getType(a.bufferType),d=a.bufferCount;i=`${a.name} {
	${l} ${n.name}[${d>0?d:""}];
};
`}else i=`${this.getVectorType(n.type)} ${n.name};`,s=!0;let m=n.node.precision;if(null!==m&&(i=precisionLib[m]+" "+i),s){i="	"+i;let f=n.groupNode.name;(o[f]||(o[f]=[])).push(i)}else i="uniform "+i,r.push(i)}let p="";for(let g in o){let h=o[g];p+=this._getGLSLUniformStruct(e+"_"+g,h.join("\n"))+"\n"}return p+r.join("\n")}getTypeFromAttribute(e){let t=super.getTypeFromAttribute(e);if(/^[iu]/.test(t)&&e.gpuType!==l){let r=e;e.isInterleavedBufferAttribute&&(r=e.data);let o=r.array;!1==(o instanceof Uint32Array||o instanceof Int32Array)&&(t=t.slice(1))}return t}getAttributes(e){let t="";if("vertex"===e){let r=this.getAttributesArray(),o=0;for(let n of r)t+=`layout( location = ${o++} ) in ${n.type} ${n.name};
`}return t}getStructMembers(e){let t=[],r=e.getMemberTypes();for(let o=0;o<r.length;o++){let n=r[o];t.push(`layout( location = ${o} ) out ${n} m${o};`)}return t.join("\n")}getStructs(e){let t=[],r=this.structs[e];if(0===r.length)return"layout( location = 0 ) out vec4 fragColor;\n";for(let o=0,n=r.length;o<n;o++){let i=r[o],s="\n";s+=this.getStructMembers(i),s+="\n",t.push(s)}return t.join("\n\n")}getVaryings(e){let t="",r=this.varyings;if("vertex"===e)for(let o of r){let n=o.type;t+=`${"int"===n||"uint"===n?"flat ":""}${o.needsInterpolation?"out":"/*out*/"} ${n} ${o.name};
`}else if("fragment"===e){for(let i of r)if(i.needsInterpolation){let s=i.type;t+=`${"int"===s||"uint"===s?"flat ":""}in ${s} ${i.name};
`}}return t}getVertexIndex(){return"uint( gl_VertexID )"}getInstanceIndex(){return"uint( gl_InstanceID )"}getFrontFacing(){return"gl_FrontFacing"}getFragCoord(){return"gl_FragCoord"}getFragDepth(){return"gl_FragDepth"}isAvailable(e){return!0===supports[e]}isFlipY(){return!0}_getGLSLUniformStruct(e,t){return`
layout( std140 ) uniform ${e} {
${t}
};`}_getGLSLVertexCode(e){return`#version 300 es

${this.getSignature()}

// precision
${defaultPrecisions}

// uniforms
${e.uniforms}

// varyings
${e.varyings}

// attributes
${e.attributes}

// codes
${e.codes}

void main() {

	// vars
	${e.vars}

	// flow
	${e.flow}

	gl_PointSize = 1.0;

}
`}_getGLSLFragmentCode(e){return`#version 300 es

${this.getSignature()}

// precision
${defaultPrecisions}

// uniforms
${e.uniforms}

// varyings
${e.varyings}

// codes
${e.codes}

${e.structs}

void main() {

	// vars
	${e.vars}

	// flow
	${e.flow}

}
`}buildCode(){let e=null!==this.material?{fragment:{},vertex:{}}:{compute:{}};for(let t in e){let r="// code\n\n";r+=this.flowCode[t];let o=this.flowNodes[t],n=o[o.length-1];for(let i of o){let s=this.getFlowData(i),u=i.name;u&&(r.length>0&&(r+="\n"),r+=`	// flow -> ${u}
	`),r+=`${s.code}
	`,i!==n||"compute"===t||(r+="// result\n	","vertex"===t?(r+="gl_Position = ",r+=`${s.result};`):"fragment"!==t||i.outputNode.isOutputStructNode||(r+="fragColor = ",r+=`${s.result};`))}let a=e[t];a.uniforms=this.getUniforms(t),a.attributes=this.getAttributes(t),a.varyings=this.getVaryings(t),a.vars=this.getVars(t),a.structs=this.getStructs(t),a.codes=this.getCodes(t),a.flow=r}null!==this.material?(this.vertexShader=this._getGLSLVertexCode(e.vertex),this.fragmentShader=this._getGLSLFragmentCode(e.fragment)):console.warn("GLSLNodeBuilder: compute shaders are not supported.")}getUniformFromNode(e,t,r,o=null){let n=super.getUniformFromNode(e,t,r,o),l=this.getDataFromNode(e,r),d=l.uniformGPU;if(void 0===d){if("texture"===t)d=new u(n.name,n.node),this.bindings[r].push(d);else if("cubeTexture"===t)d=new a(n.name,n.node),this.bindings[r].push(d);else if("buffer"===t){e.name=`NodeBuffer_${e.id}`;let m=new i(e.name,e.value);n.name=`buffer${e.id}`,this.bindings[r].push(m),d=m}else{let f=e.groupNode,p=f.name,g=this.uniformGroups[r]||(this.uniformGroups[r]={}),h=g[p];void 0===h&&(h=new s(r+"_"+p,f),g[p]=h,this.bindings[r].push(h)),d=this.getNodeUniform(n,t),h.addUniform(d)}l.uniformGPU=d}return n}build(){let{object:e,material:t}=this;return null!==t?o.fromMaterial(t).build(this):this.addFlow("compute",e),super.build()}}export default GLSLNodeBuilder;