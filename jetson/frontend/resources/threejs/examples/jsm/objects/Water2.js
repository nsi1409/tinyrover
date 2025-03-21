import{Clock as e,Color as r,Matrix4 as t,Mesh as o,RepeatWrapping as a,ShaderMaterial as l,TextureLoader as i,UniformsLib as n,UniformsUtils as f,Vector2 as c,Vector4 as m}from"three";import{Reflector as u}from"../objects/Reflector.js";import{Refractor as v}from"../objects/Refractor.js";class Water extends o{constructor(o,m={}){super(o),this.isWater=!0,this.type="Water";let s=this,p=new r(void 0!==m.color?m.color:16777215),d=m.textureWidth||512,x=m.textureHeight||512,$=m.clipBias||0,g=m.flowDirection||new c(1,0),h=m.flowSpeed||.03,w=m.reflectivity||.02,y=m.scale||1,M=m.shader||Water.WaterShader,_=new i,W=m.flowMap||void 0,R=m.normalMap0||_.load("textures/water/Water_1_M_Normal.jpg"),C=m.normalMap1||_.load("textures/water/Water_2_M_Normal.jpg"),S=new t,D=new e;if(void 0===u){console.error("THREE.Water: Required component Reflector not found.");return}if(void 0===v){console.error("THREE.Water: Required component Refractor not found.");return}let U=new u(o,{textureWidth:d,textureHeight:x,clipBias:$}),b=new v(o,{textureWidth:d,textureHeight:x,clipBias:$});function E(e){S.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),S.multiply(e.projectionMatrix),S.multiply(e.matrixWorldInverse),S.multiply(s.matrixWorld)}function T(){let e=D.getDelta(),r=s.material.uniforms.config;r.value.x+=h*e,r.value.y=r.value.x+.075,r.value.x>=.15?(r.value.x=0,r.value.y=.075):r.value.y>=.15&&(r.value.y=r.value.y-.15)}U.matrixAutoUpdate=!1,b.matrixAutoUpdate=!1,this.material=new l({name:M.name,uniforms:f.merge([n.fog,M.uniforms]),vertexShader:M.vertexShader,fragmentShader:M.fragmentShader,transparent:!0,fog:!0}),void 0!==W?(this.material.defines.USE_FLOWMAP="",this.material.uniforms.tFlowMap={type:"t",value:W}):this.material.uniforms.flowDirection={type:"v2",value:g},R.wrapS=R.wrapT=a,C.wrapS=C.wrapT=a,this.material.uniforms.tReflectionMap.value=U.getRenderTarget().texture,this.material.uniforms.tRefractionMap.value=b.getRenderTarget().texture,this.material.uniforms.tNormalMap0.value=R,this.material.uniforms.tNormalMap1.value=C,this.material.uniforms.color.value=p,this.material.uniforms.reflectivity.value=w,this.material.uniforms.textureMatrix.value=S,this.material.uniforms.config.value.x=0,this.material.uniforms.config.value.y=.075,this.material.uniforms.config.value.z=.075,this.material.uniforms.config.value.w=y,this.onBeforeRender=function(e,r,t){E(t),T(),s.visible=!1,U.matrixWorld.copy(s.matrixWorld),b.matrixWorld.copy(s.matrixWorld),U.onBeforeRender(e,r,t),b.onBeforeRender(e,r,t),s.visible=!0}}}Water.WaterShader={name:"WaterShader",uniforms:{color:{type:"c",value:null},reflectivity:{type:"f",value:0},tReflectionMap:{type:"t",value:null},tRefractionMap:{type:"t",value:null},tNormalMap0:{type:"t",value:null},tNormalMap1:{type:"t",value:null},textureMatrix:{type:"m4",value:null},config:{type:"v4",value:new m}},vertexShader:`

		#include <common>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>

		uniform mat4 textureMatrix;

		varying vec4 vCoord;
		varying vec2 vUv;
		varying vec3 vToEye;

		void main() {

			vUv = uv;
			vCoord = textureMatrix * vec4( position, 1.0 );

			vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
			vToEye = cameraPosition - worldPosition.xyz;

			vec4 mvPosition =  viewMatrix * worldPosition; // used in fog_vertex
			gl_Position = projectionMatrix * mvPosition;

			#include <logdepthbuf_vertex>
			#include <fog_vertex>

		}`,fragmentShader:`

		#include <common>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>

		uniform sampler2D tReflectionMap;
		uniform sampler2D tRefractionMap;
		uniform sampler2D tNormalMap0;
		uniform sampler2D tNormalMap1;

		#ifdef USE_FLOWMAP
			uniform sampler2D tFlowMap;
		#else
			uniform vec2 flowDirection;
		#endif

		uniform vec3 color;
		uniform float reflectivity;
		uniform vec4 config;

		varying vec4 vCoord;
		varying vec2 vUv;
		varying vec3 vToEye;

		void main() {

			#include <logdepthbuf_fragment>

			float flowMapOffset0 = config.x;
			float flowMapOffset1 = config.y;
			float halfCycle = config.z;
			float scale = config.w;

			vec3 toEye = normalize( vToEye );

			// determine flow direction
			vec2 flow;
			#ifdef USE_FLOWMAP
				flow = texture2D( tFlowMap, vUv ).rg * 2.0 - 1.0;
			#else
				flow = flowDirection;
			#endif
			flow.x *= - 1.0;

			// sample normal maps (distort uvs with flowdata)
			vec4 normalColor0 = texture2D( tNormalMap0, ( vUv * scale ) + flow * flowMapOffset0 );
			vec4 normalColor1 = texture2D( tNormalMap1, ( vUv * scale ) + flow * flowMapOffset1 );

			// linear interpolate to get the final normal color
			float flowLerp = abs( halfCycle - flowMapOffset0 ) / halfCycle;
			vec4 normalColor = mix( normalColor0, normalColor1, flowLerp );

			// calculate normal vector
			vec3 normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );

			// calculate the fresnel term to blend reflection and refraction maps
			float theta = max( dot( toEye, normal ), 0.0 );
			float reflectance = reflectivity + ( 1.0 - reflectivity ) * pow( ( 1.0 - theta ), 5.0 );

			// calculate final uv coords
			vec3 coord = vCoord.xyz / vCoord.w;
			vec2 uv = coord.xy + coord.z * normal.xz * 0.05;

			vec4 reflectColor = texture2D( tReflectionMap, vec2( 1.0 - uv.x, uv.y ) );
			vec4 refractColor = texture2D( tRefractionMap, uv );

			// multiply water color with the mix of both textures
			gl_FragColor = vec4( color, 1.0 ) * mix( refractColor, reflectColor, reflectance );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>

		}`};export{Water};