import{AdditiveBlending as e,Box2 as i,BufferGeometry as t,Color as r,FramebufferTexture as n,InterleavedBuffer as s,InterleavedBufferAttribute as o,Mesh as a,MeshBasicMaterial as l,RawShaderMaterial as u,UnsignedByteType as c,Vector2 as v,Vector3 as p,Vector4 as f}from"three";class Lensflare extends a{constructor(){super(Lensflare.Geometry,new l({opacity:0,transparent:!0})),this.isLensflare=!0,this.type="Lensflare",this.frustumCulled=!1,this.renderOrder=1/0;let t=new p,s=new p,o=new n(16,16),m=new n(16,16),d=c,y=Lensflare.Geometry,x=new u({uniforms:{scale:{value:null},screenPosition:{value:null}},vertexShader:`

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;

				void main() {

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`,fragmentShader:`

				precision highp float;

				void main() {

					gl_FragColor = vec4( 1.0, 0.0, 1.0, 1.0 );

				}`,depthTest:!0,depthWrite:!1,transparent:!1}),$=new u({uniforms:{map:{value:o},scale:{value:null},screenPosition:{value:null}},vertexShader:`

				precision highp float;

				uniform vec3 screenPosition;
				uniform vec2 scale;

				attribute vec3 position;
				attribute vec2 uv;

				varying vec2 vUV;

				void main() {

					vUV = uv;

					gl_Position = vec4( position.xy * scale + screenPosition.xy, screenPosition.z, 1.0 );

				}`,fragmentShader:`

				precision highp float;

				uniform sampler2D map;

				varying vec2 vUV;

				void main() {

					gl_FragColor = texture2D( map, vUV );

				}`,depthTest:!1,depthWrite:!1,transparent:!1}),h=new a(y,x),_=[],g=LensflareElement.Shader,b=new u({name:g.name,uniforms:{map:{value:null},occlusionMap:{value:m},color:{value:new r(16777215)},scale:{value:new v},screenPosition:{value:new p}},vertexShader:g.vertexShader,fragmentShader:g.fragmentShader,blending:e,transparent:!0,depthWrite:!1}),w=new a(y,b);this.addElement=function(e){_.push(e)};let P=new v,M=new v,V=new i,D=new f;this.onBeforeRender=function(e,i,r){e.getCurrentViewport(D);let n=e.getRenderTarget(),a=null!==n?n.texture.type:c;d!==a&&(o.dispose(),m.dispose(),o.type=m.type=a,d=a);let l=D.w/D.z,u=D.z/2,v=D.w/2,p=16/D.w;if(P.set(p*l,p),V.min.set(D.x,D.y),V.max.set(D.x+(D.z-16),D.y+(D.w-16)),s.setFromMatrixPosition(this.matrixWorld),s.applyMatrix4(r.matrixWorldInverse),!(s.z>0)&&(t.copy(s).applyMatrix4(r.projectionMatrix),M.x=D.x+t.x*u+u-8,M.y=D.y+t.y*v+v-8,V.containsPoint(M))){e.copyFramebufferToTexture(M,o);let f=x.uniforms;f.scale.value=P,f.screenPosition.value=t,e.renderBufferDirect(r,null,y,x,h,null),e.copyFramebufferToTexture(M,m),(f=$.uniforms).scale.value=P,f.screenPosition.value=t,e.renderBufferDirect(r,null,y,$,h,null);let g=-(2*t.x),S=-(2*t.y);for(let L=0,B=_.length;L<B;L++){let z=_[L],U=b.uniforms;U.color.value.copy(z.color),U.map.value=z.texture,U.screenPosition.value.x=t.x+g*z.distance,U.screenPosition.value.y=t.y+S*z.distance,p=z.size/D.w;let T=D.w/D.z;U.scale.value.set(p*T,p),b.uniformsNeedUpdate=!0,e.renderBufferDirect(r,null,y,b,w,null)}}},this.dispose=function(){x.dispose(),$.dispose(),b.dispose(),o.dispose(),m.dispose();for(let e=0,i=_.length;e<i;e++)_[e].texture.dispose()}}}class LensflareElement{constructor(e,i=1,t=0,n=new r(16777215)){this.texture=e,this.size=i,this.distance=t,this.color=n}}LensflareElement.Shader={name:"LensflareElementShader",uniforms:{map:{value:null},occlusionMap:{value:null},color:{value:null},scale:{value:null},screenPosition:{value:null}},vertexShader:`

		precision highp float;

		uniform vec3 screenPosition;
		uniform vec2 scale;

		uniform sampler2D occlusionMap;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vUV = uv;

			vec2 pos = position.xy;

			vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );
			visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );
			visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );

			vVisibility =        visibility.r / 9.0;
			vVisibility *= 1.0 - visibility.g / 9.0;
			vVisibility *=       visibility.b / 9.0;

			gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D map;
		uniform vec3 color;

		varying vec2 vUV;
		varying float vVisibility;

		void main() {

			vec4 texture = texture2D( map, vUV );
			texture.a *= vVisibility;
			gl_FragColor = texture;
			gl_FragColor.rgb *= color;

		}`},Lensflare.Geometry=function(){let e=new t,i=new Float32Array([-1,-1,0,0,0,1,-1,0,1,0,1,1,0,1,1,-1,1,0,0,1]),r=new s(i,5);return e.setIndex([0,1,2,0,2,3]),e.setAttribute("position",new o(r,3,0,!1)),e.setAttribute("uv",new o(r,2,3,!1)),e}();export{Lensflare,LensflareElement};