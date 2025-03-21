import{Color as e,Matrix4 as t,Mesh as r,PerspectiveCamera as a,Plane as l,ShaderMaterial as o,UniformsUtils as n,Vector3 as i,Vector4 as s,WebGLRenderTarget as d,HalfFloatType as m}from"three";class Reflector extends r{constructor(r,u={}){super(r),this.isReflector=!0,this.type="Reflector",this.camera=new a;let c=this,p=new e(void 0!==u.color?u.color:8355711),f=u.textureWidth||512,v=u.textureHeight||512,x=u.clipBias||0,b=u.shader||Reflector.ReflectorShader,$=void 0!==u.multisample?u.multisample:4,g=new l,h=new i,_=new i,y=new i,M=new t,w=new i(0,0,-1),R=new s,S=new i,W=new i,U=new s,P=new t,j=this.camera,D=new d(f,v,{samples:$,type:m}),O=new o({name:void 0!==b.name?b.name:"unspecified",uniforms:n.clone(b.uniforms),fragmentShader:b.fragmentShader,vertexShader:b.vertexShader});O.uniforms.tDiffuse.value=D.texture,O.uniforms.color.value=p,O.uniforms.textureMatrix.value=P,this.material=O,this.onBeforeRender=function(e,t,r){if(_.setFromMatrixPosition(c.matrixWorld),y.setFromMatrixPosition(r.matrixWorld),M.extractRotation(c.matrixWorld),h.set(0,0,1),h.applyMatrix4(M),S.subVectors(_,y),S.dot(h)>0)return;S.reflect(h).negate(),S.add(_),M.extractRotation(r.matrixWorld),w.set(0,0,-1),w.applyMatrix4(M),w.add(y),W.subVectors(_,w),W.reflect(h).negate(),W.add(_),j.position.copy(S),j.up.set(0,1,0),j.up.applyMatrix4(M),j.up.reflect(h),j.lookAt(W),j.far=r.far,j.updateMatrixWorld(),j.projectionMatrix.copy(r.projectionMatrix),P.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),P.multiply(j.projectionMatrix),P.multiply(j.matrixWorldInverse),P.multiply(c.matrixWorld),g.setFromNormalAndCoplanarPoint(h,_),g.applyMatrix4(j.matrixWorldInverse),R.set(g.normal.x,g.normal.y,g.normal.z,g.constant);let a=j.projectionMatrix;U.x=(Math.sign(R.x)+a.elements[8])/a.elements[0],U.y=(Math.sign(R.y)+a.elements[9])/a.elements[5],U.z=-1,U.w=(1+a.elements[10])/a.elements[14],R.multiplyScalar(2/R.dot(U)),a.elements[2]=R.x,a.elements[6]=R.y,a.elements[10]=R.z+1-x,a.elements[14]=R.w,c.visible=!1;let l=e.getRenderTarget(),o=e.xr.enabled,n=e.shadowMap.autoUpdate;e.xr.enabled=!1,e.shadowMap.autoUpdate=!1,e.setRenderTarget(D),e.state.buffers.depth.setMask(!0),!1===e.autoClear&&e.clear(),e.render(t,j),e.xr.enabled=o,e.shadowMap.autoUpdate=n,e.setRenderTarget(l);let i=r.viewport;void 0!==i&&e.state.viewport(i),c.visible=!0},this.getRenderTarget=function(){return D},this.dispose=function(){D.dispose(),c.material.dispose()}}}Reflector.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};export{Reflector};