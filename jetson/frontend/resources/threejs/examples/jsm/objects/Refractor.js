import{Color as e,Matrix4 as r,Mesh as t,PerspectiveCamera as a,Plane as n,Quaternion as o,ShaderMaterial as i,UniformsUtils as l,Vector3 as s,Vector4 as m,WebGLRenderTarget as d,HalfFloatType as c}from"three";class Refractor extends t{constructor(t,u={}){super(t),this.isRefractor=!0,this.type="Refractor",this.camera=new a;let f=this,p=new e(void 0!==u.color?u.color:8355711),v=u.textureWidth||512,x=u.textureHeight||512,$=u.clipBias||0,b=u.shader||Refractor.RefractorShader,h=void 0!==u.multisample?u.multisample:4,w=this.camera;w.matrixAutoUpdate=!1,w.userData.refractor=!0;let y=new n,g=new r,_=new d(v,x,{samples:h,type:c});this.material=new i({name:void 0!==b.name?b.name:"unspecified",uniforms:l.clone(b.uniforms),vertexShader:b.vertexShader,fragmentShader:b.fragmentShader,transparent:!0}),this.material.uniforms.color.value=p,this.material.uniforms.tDiffuse.value=_.texture,this.material.uniforms.textureMatrix.value=g;let M=function(){let e=new s,t=new s,a=new r,n=new s,o=new s;return function r(i){return e.setFromMatrixPosition(f.matrixWorld),t.setFromMatrixPosition(i.matrixWorld),n.subVectors(e,t),a.extractRotation(f.matrixWorld),o.set(0,0,1),o.applyMatrix4(a),0>n.dot(o)}}(),R=function(){let e=new s,r=new s,t=new o,a=new s;return function n(){f.matrixWorld.decompose(r,t,a),e.set(0,0,1).applyQuaternion(t).normalize(),e.negate(),y.setFromNormalAndCoplanarPoint(e,r)}}(),W=function(){let e=new n,r=new m,t=new m;return function a(n){w.matrixWorld.copy(n.matrixWorld),w.matrixWorldInverse.copy(w.matrixWorld).invert(),w.projectionMatrix.copy(n.projectionMatrix),w.far=n.far,e.copy(y),e.applyMatrix4(w.matrixWorldInverse),r.set(e.normal.x,e.normal.y,e.normal.z,e.constant);let o=w.projectionMatrix;t.x=(Math.sign(r.x)+o.elements[8])/o.elements[0],t.y=(Math.sign(r.y)+o.elements[9])/o.elements[5],t.z=-1,t.w=(1+o.elements[10])/o.elements[14],r.multiplyScalar(2/r.dot(t)),o.elements[2]=r.x,o.elements[6]=r.y,o.elements[10]=r.z+1-$,o.elements[14]=r.w}}();function S(e){g.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),g.multiply(e.projectionMatrix),g.multiply(e.matrixWorldInverse),g.multiply(f.matrixWorld)}function U(e,r,t){f.visible=!1;let a=e.getRenderTarget(),n=e.xr.enabled,o=e.shadowMap.autoUpdate;e.xr.enabled=!1,e.shadowMap.autoUpdate=!1,e.setRenderTarget(_),!1===e.autoClear&&e.clear(),e.render(r,w),e.xr.enabled=n,e.shadowMap.autoUpdate=o,e.setRenderTarget(a);let i=t.viewport;void 0!==i&&e.state.viewport(i),f.visible=!0}this.onBeforeRender=function(e,r,t){!0!==t.userData.refractor&&!0!=!M(t)&&(R(),S(t),W(t),U(e,r,t))},this.getRenderTarget=function(){return _},this.dispose=function(){_.dispose(),f.material.dispose()}}}Refractor.RefractorShader={name:"RefractorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`

		uniform mat4 textureMatrix;

		varying vec4 vUv;

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform vec3 color;
		uniform sampler2D tDiffuse;

		varying vec4 vUv;

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};export{Refractor};