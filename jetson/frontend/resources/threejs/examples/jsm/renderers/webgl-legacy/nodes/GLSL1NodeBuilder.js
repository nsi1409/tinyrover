import{MathNode as e,GLSLNodeParser as t,NodeBuilder as r,NodeMaterial as i}from"../../../nodes/Nodes.js";let glslMethods={[e.ATAN2]:"atan"},precisionLib={low:"lowp",medium:"mediump",high:"highp"};class GLSL1NodeBuilder extends r{constructor(e,r,i=null){super(e,r,new t,i)}getMethod(e){return glslMethods[e]||e}getTexture(e,t,r){return e.isTextureCube?`textureCube( ${t}, ${r} )`:`texture2D( ${t}, ${r} )`}getTextureBias(e,t,r,i){return void 0!==this.material.extensions&&(this.material.extensions.shaderTextureLOD=!0),`textureLod( ${t}, ${r}, ${i} )`}getVars(e){let t=[],r=this.vars[e];for(let i of r)t.push(`${this.getVar(i.type,i.name)};`);return t.join("\n	")}getUniforms(e){let t=this.uniforms[e],r="";for(let i of t){let s=null;s="texture"===i.type?`sampler2D ${i.name};
`:"cubeTexture"===i.type?`samplerCube ${i.name};
`:`${this.getVectorType(i.type)} ${i.name};
`;let o=i.node.precision;r+=s=null!==o?"uniform "+precisionLib[o]+" "+s:"uniform "+s}return r}getAttributes(e){let t="";if("vertex"===e){let r=this.attributes;for(let i of r)t+=`attribute ${i.type} ${i.name};
`}return t}getVaryings(e){let t="",r=this.varyings;if("vertex"===e)for(let i of r)t+=`${i.needsInterpolation?"varying":"/*varying*/"} ${i.type} ${i.name};
`;else if("fragment"===e)for(let s of r)s.needsInterpolation&&(t+=`varying ${s.type} ${s.name};
`);return t}getVertexIndex(){return"gl_VertexID"}getFrontFacing(){return"gl_FrontFacing"}getFragCoord(){return"gl_FragCoord"}isFlipY(){return!0}_getGLSLVertexCode(e){return`${this.getSignature()}

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

}
`}_getGLSLFragmentCode(e){return`${this.getSignature()}

// precision
precision highp float;
precision highp int;

// uniforms
${e.uniforms}

// varyings
${e.varyings}

// codes
${e.codes}

void main() {

	// vars
	${e.vars}

	// flow
	${e.flow}

}
`}buildCode(){let e=null!==this.material?{fragment:{},vertex:{}}:{compute:{}};for(let t in e){let r="// code\n\n";r+=this.flowCode[t];let i=this.flowNodes[t],s=i[i.length-1];for(let o of i){let n=this.getFlowData(o),a=o.name;a&&(r.length>0&&(r+="\n"),r+=`	// flow -> ${a}
	`),r+=`${n.code}
	`,o===s&&"compute"!==t&&(r+="// result\n	","vertex"===t?r+="gl_Position = ":"fragment"===t&&(r+="gl_FragColor = "),r+=`${n.result};`)}let l=e[t];l.uniforms=this.getUniforms(t),l.attributes=this.getAttributes(t),l.varyings=this.getVaryings(t),l.vars=this.getVars(t),l.codes=this.getCodes(t),l.flow=r}null!==this.material?(this.vertexShader=this._getGLSLVertexCode(e.vertex),this.fragmentShader=this._getGLSLFragmentCode(e.fragment)):console.warn("GLSLNodeBuilder: compute shaders are not supported.")}build(){let{object:e,material:t}=this;return null!==t?i.fromMaterial(t).build(this):this.addFlow("compute",e),super.build()}}export default GLSL1NodeBuilder;