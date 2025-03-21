import*as e from"three";import*as t from"../libs/fflate.module.js";class USDZExporter{async parse(e,r={}){r=Object.assign({ar:{anchoring:{type:"plane"},planeAnchoring:{alignment:"horizontal"}},quickLookCompatible:!1},r);let i={},o="model.usda";i[o]=null;let a=buildHeader();a+=buildSceneStart(r);let n={},s={};for(let l in e.traverseVisible(e=>{if(e.isMesh){let t=e.geometry,r=e.material;if(r.isMeshStandardMaterial){let o="geometries/Geometry_"+t.id+".usda";if(!(o in i)){let s=buildMeshObject(t);i[o]=buildUSDFileAsString(s)}r.uuid in n||(n[r.uuid]=r),a+=buildXform(e,t,r)}else console.warn("THREE.USDZExporter: Unsupported material type (USDZ only supports MeshStandardMaterial)",e)}else e.isCamera&&(a+=buildCamera(e))}),a+=buildSceneEnd(),a+=buildMaterials(n,s,r.quickLookCompatible),i[o]=t.strToU8(a),a=null,s){let u=s[l],p=imageToCanvas(u.image,u.flipY),c=await new Promise(e=>p.toBlob(e,"image/png",1));i[`textures/Texture_${l}.png`]=new Uint8Array(await c.arrayBuffer())}let d=0;for(let f in i){let m=i[f],h=63&(d+=34+f.length);if(4!==h){let b=64-h,g=new Uint8Array(b);i[f]=[m,{extra:{12345:g}}]}d=m.length}return t.zipSync(i,{level:0})}}function imageToCanvas(e,t){if("undefined"!=typeof HTMLImageElement&&e instanceof HTMLImageElement||"undefined"!=typeof HTMLCanvasElement&&e instanceof HTMLCanvasElement||"undefined"!=typeof OffscreenCanvas&&e instanceof OffscreenCanvas||"undefined"!=typeof ImageBitmap&&e instanceof ImageBitmap){let r=1024/Math.max(e.width,e.height),i=document.createElement("canvas");i.width=e.width*Math.min(1,r),i.height=e.height*Math.min(1,r);let o=i.getContext("2d");return!0===t&&(o.translate(0,i.height),o.scale(1,-1)),o.drawImage(e,0,0,i.width,i.height),i}throw Error("THREE.USDZExporter: No valid image data found. Unable to process texture.")}let PRECISION=7;function buildHeader(){return`#usda 1.0
(
	customLayerData = {
		string creator = "Three.js USDZExporter"
	}
	defaultPrim = "Root"
	metersPerUnit = 1
	upAxis = "Y"
)

`}function buildSceneStart(e){return`def Xform "Root"
{
	def Scope "Scenes" (
		kind = "sceneLibrary"
	)
	{
		def Xform "Scene" (
			customData = {
				bool preliminary_collidesWithEnvironment = 0
				string sceneName = "Scene"
			}
			sceneName = "Scene"
		)
		{
		token preliminary:anchoring:type = "${e.ar.anchoring.type}"
		token preliminary:planeAnchoring:alignment = "${e.ar.planeAnchoring.alignment}"

`}function buildSceneEnd(){return`
		}
	}
}

`}function buildUSDFileAsString(e){let r=buildHeader();return r+=e,t.strToU8(r)}function buildXform(e,t,r){let i="Object_"+e.id,o=buildMatrix(e.matrixWorld);return 0>e.matrixWorld.determinant()&&console.warn("THREE.USDZExporter: USDZ does not support negative scales",e),`def Xform "${i}" (
	prepend references = @./geometries/Geometry_${t.id}.usda@</Geometry>
	prepend apiSchemas = ["MaterialBindingAPI"]
)
{
	matrix4d xformOp:transform = ${o}
	uniform token[] xformOpOrder = ["xformOp:transform"]

	rel material:binding = </Materials/Material_${r.id}>
}

`}function buildMatrix(e){let t=e.elements;return`( ${buildMatrixRow(t,0)}, ${buildMatrixRow(t,4)}, ${buildMatrixRow(t,8)}, ${buildMatrixRow(t,12)} )`}function buildMatrixRow(e,t){return`(${e[t+0]}, ${e[t+1]}, ${e[t+2]}, ${e[t+3]})`}function buildMeshObject(e){return`
def "Geometry"
{
${buildMesh(e)}
}
`}function buildMesh(e){let t=e.attributes,r=t.position.count;return`
	def Mesh "Geometry"
	{
		int[] faceVertexCounts = [${buildMeshVertexCount(e)}]
		int[] faceVertexIndices = [${buildMeshVertexIndices(e)}]
		normal3f[] normals = [${buildVector3Array(t.normal,r)}] (
			interpolation = "vertex"
		)
		point3f[] points = [${buildVector3Array(t.position,r)}]
${buildPrimvars(t)}
		uniform token subdivisionScheme = "none"
	}
`}function buildMeshVertexCount(e){return Array((null!==e.index?e.index.count:e.attributes.position.count)/3).fill(3).join(", ")}function buildMeshVertexIndices(e){let t=e.index,r=[];if(null!==t)for(let i=0;i<t.count;i++)r.push(t.getX(i));else{let o=e.attributes.position.count;for(let a=0;a<o;a++)r.push(a)}return r.join(", ")}function buildVector3Array(e,t){if(void 0===e)return console.warn("USDZExporter: Normals missing."),Array(t).fill("(0, 0, 0)").join(", ");let r=[];for(let i=0;i<e.count;i++){let o=e.getX(i),a=e.getY(i),n=e.getZ(i);r.push(`(${o.toPrecision(7)}, ${a.toPrecision(7)}, ${n.toPrecision(7)})`)}return r.join(", ")}function buildVector2Array(e){let t=[];for(let r=0;r<e.count;r++){let i=e.getX(r),o=e.getY(r);t.push(`(${i.toPrecision(7)}, ${1-o.toPrecision(7)})`)}return t.join(", ")}function buildPrimvars(e){let t="";for(let r=0;r<4;r++){let i=r>0?r:"",o=e["uv"+i];void 0!==o&&(t+=`
		texCoord2f[] primvars:st${i} = [${buildVector2Array(o)}] (
			interpolation = "vertex"
		)`)}return t}function buildMaterials(e,t,r=!1){let i=[];for(let o in e){let a=e[o];i.push(buildMaterial(a,t,r))}return`def "Materials"
{
${i.join("")}
}

`}function buildMaterial(t,r,i=!1){let o=[],a=[];function n(o,a,n){let s=o.source.id+"_"+o.flipY;r[s]=o;let l=o.channel>0?"st"+o.channel:"st",u={1e3:"repeat",1001:"clamp",1002:"mirror"},p=o.repeat.clone(),c=o.offset.clone(),d=o.rotation,f=Math.sin(d),m=Math.cos(d);return c.y=1-c.y-p.y,i?(c.x=c.x/p.x,c.y=c.y/p.y,c.x+=f/p.x,c.y+=m-1):(c.x+=f*p.x,c.y+=(1-m)*p.y),`
		def Shader "PrimvarReader_${a}"
		{
			uniform token info:id = "UsdPrimvarReader_float2"
			float2 inputs:fallback = (0.0, 0.0)
			token inputs:varname = "${l}"
			float2 outputs:result
		}

		def Shader "Transform2d_${a}"
		{
			uniform token info:id = "UsdTransform2d"
			token inputs:in.connect = </Materials/Material_${t.id}/PrimvarReader_${a}.outputs:result>
			float inputs:rotation = ${(d*(180/Math.PI)).toFixed(7)}
			float2 inputs:scale = ${buildVector2(p)}
			float2 inputs:translation = ${buildVector2(c)}
			float2 outputs:result
		}

		def Shader "Texture_${o.id}_${a}"
		{
			uniform token info:id = "UsdUVTexture"
			asset inputs:file = @textures/Texture_${s}.png@
			float2 inputs:st.connect = </Materials/Material_${t.id}/Transform2d_${a}.outputs:result>
			${void 0!==n?"float4 inputs:scale = "+buildColor4(n):""}
			token inputs:sourceColorSpace = "${o.colorSpace===e.NoColorSpace?"raw":"sRGB"}"
			token inputs:wrapS = "${u[o.wrapS]}"
			token inputs:wrapT = "${u[o.wrapT]}"
			float outputs:r
			float outputs:g
			float outputs:b
			float3 outputs:rgb
			${t.transparent||t.alphaTest>0?"float outputs:a":""}
		}`}return t.side===e.DoubleSide&&console.warn("THREE.USDZExporter: USDZ does not support double sided materials",t),null!==t.map?(o.push(`			color3f inputs:diffuseColor.connect = </Materials/Material_${t.id}/Texture_${t.map.id}_diffuse.outputs:rgb>`),t.transparent?o.push(`			float inputs:opacity.connect = </Materials/Material_${t.id}/Texture_${t.map.id}_diffuse.outputs:a>`):t.alphaTest>0&&(o.push(`			float inputs:opacity.connect = </Materials/Material_${t.id}/Texture_${t.map.id}_diffuse.outputs:a>`),o.push(`			float inputs:opacityThreshold = ${t.alphaTest}`)),a.push(n(t.map,"diffuse",t.color))):o.push(`			color3f inputs:diffuseColor = ${buildColor(t.color)}`),null!==t.emissiveMap?(o.push(`			color3f inputs:emissiveColor.connect = </Materials/Material_${t.id}/Texture_${t.emissiveMap.id}_emissive.outputs:rgb>`),a.push(n(t.emissiveMap,"emissive"))):t.emissive.getHex()>0&&o.push(`			color3f inputs:emissiveColor = ${buildColor(t.emissive)}`),null!==t.normalMap&&(o.push(`			normal3f inputs:normal.connect = </Materials/Material_${t.id}/Texture_${t.normalMap.id}_normal.outputs:rgb>`),a.push(n(t.normalMap,"normal"))),null!==t.aoMap&&(o.push(`			float inputs:occlusion.connect = </Materials/Material_${t.id}/Texture_${t.aoMap.id}_occlusion.outputs:r>`),a.push(n(t.aoMap,"occlusion"))),null!==t.roughnessMap&&1===t.roughness?(o.push(`			float inputs:roughness.connect = </Materials/Material_${t.id}/Texture_${t.roughnessMap.id}_roughness.outputs:g>`),a.push(n(t.roughnessMap,"roughness"))):o.push(`			float inputs:roughness = ${t.roughness}`),null!==t.metalnessMap&&1===t.metalness?(o.push(`			float inputs:metallic.connect = </Materials/Material_${t.id}/Texture_${t.metalnessMap.id}_metallic.outputs:b>`),a.push(n(t.metalnessMap,"metallic"))):o.push(`			float inputs:metallic = ${t.metalness}`),null!==t.alphaMap?(o.push(`			float inputs:opacity.connect = </Materials/Material_${t.id}/Texture_${t.alphaMap.id}_opacity.outputs:r>`),o.push(`			float inputs:opacityThreshold = 0.0001`),a.push(n(t.alphaMap,"opacity"))):o.push(`			float inputs:opacity = ${t.opacity}`),t.isMeshPhysicalMaterial&&(o.push(`			float inputs:clearcoat = ${t.clearcoat}`),o.push(`			float inputs:clearcoatRoughness = ${t.clearcoatRoughness}`),o.push(`			float inputs:ior = ${t.ior}`)),`
	def Material "Material_${t.id}"
	{
		def Shader "PreviewSurface"
		{
			uniform token info:id = "UsdPreviewSurface"
${o.join("\n")}
			int inputs:useSpecularWorkflow = 0
			token outputs:surface
		}

		token outputs:surface.connect = </Materials/Material_${t.id}/PreviewSurface.outputs:surface>

${a.join("\n")}

	}
`}function buildColor(e){return`(${e.r}, ${e.g}, ${e.b})`}function buildColor4(e){return`(${e.r}, ${e.g}, ${e.b}, 1.0)`}function buildVector2(e){return`(${e.x}, ${e.y})`}function buildCamera(e){let t=e.name?e.name:"Camera_"+e.id,r=buildMatrix(e.matrixWorld);return(0>e.matrixWorld.determinant()&&console.warn("THREE.USDZExporter: USDZ does not support negative scales",e),e.isOrthographicCamera)?`def Camera "${t}"
		{
			matrix4d xformOp:transform = ${r}
			uniform token[] xformOpOrder = ["xformOp:transform"]

			float2 clippingRange = (${e.near.toPrecision(7)}, ${e.far.toPrecision(7)})
			float horizontalAperture = ${((Math.abs(e.left)+Math.abs(e.right))*10).toPrecision(7)}
			float verticalAperture = ${((Math.abs(e.top)+Math.abs(e.bottom))*10).toPrecision(7)}
			token projection = "orthographic"
		}
	
	`:`def Camera "${t}"
		{
			matrix4d xformOp:transform = ${r}
			uniform token[] xformOpOrder = ["xformOp:transform"]

			float2 clippingRange = (${e.near.toPrecision(7)}, ${e.far.toPrecision(7)})
			float focalLength = ${e.getFocalLength().toPrecision(7)}
			float focusDistance = ${e.focus.toPrecision(7)}
			float horizontalAperture = ${e.getFilmWidth().toPrecision(7)}
			token projection = "perspective"
			float verticalAperture = ${e.getFilmHeight().toPrecision(7)}
		}
	
	`}export{USDZExporter};