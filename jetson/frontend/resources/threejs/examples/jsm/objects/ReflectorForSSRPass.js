import{Color as e,Matrix4 as t,Mesh as r,PerspectiveCamera as a,ShaderMaterial as i,UniformsUtils as o,Vector2 as n,Vector3 as l,WebGLRenderTarget as s,DepthTexture as u,UnsignedShortType as c,NearestFilter as f,Plane as d,HalfFloatType as v}from"three";class ReflectorForSSRPass extends r{constructor(r,p={}){super(r),this.isReflectorForSSRPass=!0,this.type="ReflectorForSSRPass";let m=this,x=new e(void 0!==p.color?p.color:8355711),h=p.textureWidth||512,S=p.textureHeight||512,$=p.clipBias||0,w=p.shader||ReflectorForSSRPass.ReflectorShader,P=!0===p.useDepthTexture,R=new l(0,1,0),g=new l,y=new l;m.needsUpdate=!1,m.maxDistance=ReflectorForSSRPass.ReflectorShader.uniforms.maxDistance.value,m.opacity=ReflectorForSSRPass.ReflectorShader.uniforms.opacity.value,m.color=x,m.resolution=p.resolution||new n(window.innerWidth,window.innerHeight),m._distanceAttenuation=ReflectorForSSRPass.ReflectorShader.defines.DISTANCE_ATTENUATION,Object.defineProperty(m,"distanceAttenuation",{get:()=>m._distanceAttenuation,set(e){m._distanceAttenuation!==e&&(m._distanceAttenuation=e,m.material.defines.DISTANCE_ATTENUATION=e,m.material.needsUpdate=!0)}}),m._fresnel=ReflectorForSSRPass.ReflectorShader.defines.FRESNEL,Object.defineProperty(m,"fresnel",{get:()=>m._fresnel,set(e){m._fresnel!==e&&(m._fresnel=e,m.material.defines.FRESNEL=e,m.material.needsUpdate=!0)}});let M=new l,b=new l,C=new l,D=new t,T=new l(0,0,-1),F=new l,_=new l,N=new t,W=new a,A;P&&((A=new u).type=c,A.minFilter=f,A.magFilter=f);let U={depthTexture:P?A:null,type:v},j=new s(h,S,U),E=new i({name:void 0!==w.name?w.name:"unspecified",transparent:P,defines:Object.assign({},ReflectorForSSRPass.ReflectorShader.defines,{useDepthTexture:P}),uniforms:o.clone(w.uniforms),fragmentShader:w.fragmentShader,vertexShader:w.vertexShader});E.uniforms.tDiffuse.value=j.texture,E.uniforms.color.value=m.color,E.uniforms.textureMatrix.value=N,P&&(E.uniforms.tDepth.value=j.depthTexture),this.material=E;let I=[new d(new l(0,1,0),$)];this.doRender=function(e,t,r){if(E.uniforms.maxDistance.value=m.maxDistance,E.uniforms.color.value=m.color,E.uniforms.opacity.value=m.opacity,g.copy(r.position).normalize(),y.copy(g).reflect(R),E.uniforms.fresnelCoe.value=(g.dot(y)+1)/2,b.setFromMatrixPosition(m.matrixWorld),C.setFromMatrixPosition(r.matrixWorld),D.extractRotation(m.matrixWorld),M.set(0,0,1),M.applyMatrix4(D),F.subVectors(b,C),F.dot(M)>0)return;F.reflect(M).negate(),F.add(b),D.extractRotation(r.matrixWorld),T.set(0,0,-1),T.applyMatrix4(D),T.add(C),_.subVectors(b,T),_.reflect(M).negate(),_.add(b),W.position.copy(F),W.up.set(0,1,0),W.up.applyMatrix4(D),W.up.reflect(M),W.lookAt(_),W.far=r.far,W.updateMatrixWorld(),W.projectionMatrix.copy(r.projectionMatrix),E.uniforms.virtualCameraNear.value=r.near,E.uniforms.virtualCameraFar.value=r.far,E.uniforms.virtualCameraMatrixWorld.value=W.matrixWorld,E.uniforms.virtualCameraProjectionMatrix.value=r.projectionMatrix,E.uniforms.virtualCameraProjectionMatrixInverse.value=r.projectionMatrixInverse,E.uniforms.resolution.value=m.resolution,N.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),N.multiply(W.projectionMatrix),N.multiply(W.matrixWorldInverse),N.multiply(m.matrixWorld);let a=e.getRenderTarget(),i=e.xr.enabled,o=e.shadowMap.autoUpdate,n=e.clippingPlanes;e.xr.enabled=!1,e.shadowMap.autoUpdate=!1,e.clippingPlanes=I,e.setRenderTarget(j),e.state.buffers.depth.setMask(!0),!1===e.autoClear&&e.clear(),e.render(t,W),e.xr.enabled=i,e.shadowMap.autoUpdate=o,e.clippingPlanes=n,e.setRenderTarget(a);let l=r.viewport;void 0!==l&&e.state.viewport(l)},this.getRenderTarget=function(){return j}}}ReflectorForSSRPass.ReflectorShader={name:"ReflectorShader",defines:{DISTANCE_ATTENUATION:!0,FRESNEL:!0},uniforms:{color:{value:null},tDiffuse:{value:null},tDepth:{value:null},textureMatrix:{value:new t},maxDistance:{value:180},opacity:{value:.5},fresnelCoe:{value:null},virtualCameraNear:{value:null},virtualCameraFar:{value:null},virtualCameraProjectionMatrix:{value:new t},virtualCameraMatrixWorld:{value:new t},virtualCameraProjectionMatrixInverse:{value:new t},resolution:{value:new n}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		uniform sampler2D tDepth;
		uniform float maxDistance;
		uniform float opacity;
		uniform float fresnelCoe;
		uniform float virtualCameraNear;
		uniform float virtualCameraFar;
		uniform mat4 virtualCameraProjectionMatrix;
		uniform mat4 virtualCameraProjectionMatrixInverse;
		uniform mat4 virtualCameraMatrixWorld;
		uniform vec2 resolution;
		varying vec4 vUv;
		#include <packing>
		float blendOverlay( float base, float blend ) {
			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
		}
		vec3 blendOverlay( vec3 base, vec3 blend ) {
			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );
		}
		float getDepth( const in vec2 uv ) {
			return texture2D( tDepth, uv ).x;
		}
		float getViewZ( const in float depth ) {
			return perspectiveDepthToViewZ( depth, virtualCameraNear, virtualCameraFar );
		}
		vec3 getViewPosition( const in vec2 uv, const in float depth/*clip space*/, const in float clipW ) {
			vec4 clipPosition = vec4( ( vec3( uv, depth ) - 0.5 ) * 2.0, 1.0 );//ndc
			clipPosition *= clipW; //clip
			return ( virtualCameraProjectionMatrixInverse * clipPosition ).xyz;//view
		}
		void main() {
			vec4 base = texture2DProj( tDiffuse, vUv );
			#ifdef useDepthTexture
				vec2 uv=(gl_FragCoord.xy-.5)/resolution.xy;
				uv.x=1.-uv.x;
				float depth = texture2DProj( tDepth, vUv ).r;
				float viewZ = getViewZ( depth );
				float clipW = virtualCameraProjectionMatrix[2][3] * viewZ+virtualCameraProjectionMatrix[3][3];
				vec3 viewPosition=getViewPosition( uv, depth, clipW );
				vec3 worldPosition=(virtualCameraMatrixWorld*vec4(viewPosition,1)).xyz;
				if(worldPosition.y>maxDistance) discard;
				float op=opacity;
				#ifdef DISTANCE_ATTENUATION
					float ratio=1.-(worldPosition.y/maxDistance);
					float attenuation=ratio*ratio;
					op=opacity*attenuation;
				#endif
				#ifdef FRESNEL
					op*=fresnelCoe;
				#endif
				gl_FragColor = vec4( blendOverlay( base.rgb, color ), op );
			#else
				gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );
			#endif
		}
	`};export{ReflectorForSSRPass};