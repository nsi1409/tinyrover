import{BufferAttribute as e,BufferGeometry as a,Color as r,DoubleSide as o,FileLoader as t,Group as c,Loader as $,Mesh as l,MeshBasicMaterial as i,RawShaderMaterial as d,TextureLoader as n,Quaternion as _,Vector3 as f}from"three";import*as b from"../libs/fflate.module.js";class TiltLoader extends ${load(e,a,r,o){let c=this,$=new t(this.manager);$.setPath(this.path),$.setResponseType("arraybuffer"),$.setWithCredentials(this.withCredentials),$.load(e,function(r){try{a(c.parse(r))}catch(t){o?o(t):console.error(t),c.manager.itemError(e)}},r,o)}parse(e){let a=new c,r=b.unzipSync(new Uint8Array(e.slice(16))),o=JSON.parse(b.strFromU8(r["metadata.json"])),t=new DataView(r["data.sketch"].buffer),$=t.getInt32(16,!0),i={},d=20;for(let n=0;n<$;n++){let _=t.getInt32(d,!0),f=[t.getFloat32(d+4,!0),t.getFloat32(d+8,!0),t.getFloat32(d+12,!0),t.getFloat32(d+16,!0)],s=t.getFloat32(d+20,!0),p=t.getUint32(d+24,!0),h=t.getUint32(d+28,!0),g=0,u=0;for(let m=0;m<4;m++){let v=1<<m;(p&v)>0&&(g+=4),(h&v)>0&&(u+=4)}d=d+28+g+4;let S=t.getInt32(d,!0),y=new Float32Array(3*S),x=new Float32Array(4*S);d+=4;for(let w=0,T=0;w<y.length;w+=3,T+=4)y[w+0]=t.getFloat32(d+0,!0),y[w+1]=t.getFloat32(d+4,!0),y[w+2]=t.getFloat32(d+8,!0),x[T+0]=t.getFloat32(d+12,!0),x[T+1]=t.getFloat32(d+16,!0),x[T+2]=t.getFloat32(d+20,!0),x[T+3]=t.getFloat32(d+24,!0),d=d+28+u;_ in i==!1&&(i[_]=[]),i[_].push([y,x,s,f])}for(let C in i){let F=new StrokeGeometry(i[C]),L=getMaterial(o.BrushIndex[C]);a.add(new l(F,L))}return a}}class StrokeGeometry extends a{constructor(a){super();let o=[],t=[],c=[],$=new f,l=new f,i=new _,d=new _,n=new f,b=new f,s=new f,p=new f,h=new r;for(let g in a){let u=a[g],m=u[0],v=u[1],S=u[2],y=u[3],x=u[3][3];h.fromArray(y).convertSRGBToLinear(),l.fromArray(m,0),d.fromArray(v,0);for(let w=3,T=4,C=m.length;w<C;w+=3,T+=4){$.fromArray(m,w),i.fromArray(v,T),n.set(-S,0,0),n.applyQuaternion(i),n.add($),b.set(S,0,0),b.applyQuaternion(i),b.add($),s.set(S,0,0),s.applyQuaternion(d),s.add(l),p.set(-S,0,0),p.applyQuaternion(d),p.add(l),o.push(n.x,n.y,-n.z),o.push(b.x,b.y,-b.z),o.push(p.x,p.y,-p.z),o.push(b.x,b.y,-b.z),o.push(s.x,s.y,-s.z),o.push(p.x,p.y,-p.z),l.copy($),d.copy(i),t.push(...h,x),t.push(...h,x),t.push(...h,x),t.push(...h,x),t.push(...h,x),t.push(...h,x);let F=w/C,L=(w-3)/C;c.push(F,0),c.push(F,1),c.push(L,0),c.push(F,1),c.push(L,1),c.push(L,0)}}this.setAttribute("position",new e(new Float32Array(o),3)),this.setAttribute("color",new e(new Float32Array(t),4)),this.setAttribute("uv",new e(new Float32Array(c),2))}}let BRUSH_LIST_ARRAY={"89d104cd-d012-426b-b5b3-bbaee63ac43c":"Bubbles","700f3aa8-9a7c-2384-8b8a-ea028905dd8c":"CelVinyl","0f0ff7b2-a677-45eb-a7d6-0cd7206f4816":"ChromaticWave","1161af82-50cf-47db-9706-0c3576d43c43":"CoarseBristles","79168f10-6961-464a-8be1-57ed364c5600":"CoarseBristlesSingleSided","1caa6d7d-f015-3f54-3a4b-8b5354d39f81":"Comet","c8313697-2563-47fc-832e-290f4c04b901":"DiamondHull","4391aaaa-df73-4396-9e33-31e4e4930b27":"Disco","d1d991f2-e7a0-4cf1-b328-f57e915e6260":"DotMarker","6a1cf9f9-032c-45ec-9b1d-a6680bee30f7":"Dots","0d3889f3-3ede-470c-8af4-f44813306126":"DoubleTaperedFlat","0d3889f3-3ede-470c-8af4-de4813306126":"DoubleTaperedMarker","d0262945-853c-4481-9cbd-88586bed93cb":"DuctTape","3ca16e2f-bdcd-4da2-8631-dcef342f40f1":"DuctTapeSingleSided","f6e85de3-6dcc-4e7f-87fd-cee8c3d25d51":"Electricity","02ffb866-7fb2-4d15-b761-1012cefb1360":"Embers","cb92b597-94ca-4255-b017-0e3f42f12f9e":"Fire","2d35bcf0-e4d8-452c-97b1-3311be063130":"Flat","55303bc4-c749-4a72-98d9-d23e68e76e18":"FlatDeprecated","280c0a7a-aad8-416c-a7d2-df63d129ca70":"FlatSingleSided","cf019139-d41c-4eb0-a1d0-5cf54b0a42f3":"Highlighter","6a1cf9f9-032c-45ec-9b6e-a6680bee32e9":"HyperGrid","dce872c2-7b49-4684-b59b-c45387949c5c":"Hypercolor","e8ef32b1-baa8-460a-9c2c-9cf8506794f5":"HypercolorSingleSided","2f212815-f4d3-c1a4-681a-feeaf9c6dc37":"Icing","f5c336cf-5108-4b40-ade9-c687504385ab":"Ink","c0012095-3ffd-4040-8ee1-fc180d346eaa":"InkSingleSided","4a76a27a-44d8-4bfe-9a8c-713749a499b0":"Leaves","ea19de07-d0c0-4484-9198-18489a3c1487":"LeavesSingleSided","2241cd32-8ba2-48a5-9ee7-2caef7e9ed62":"Light","4391aaaa-df81-4396-9e33-31e4e4930b27":"LightWire","d381e0f5-3def-4a0d-8853-31e9200bcbda":"Lofted","429ed64a-4e97-4466-84d3-145a861ef684":"Marker","79348357-432d-4746-8e29-0e25c112e3aa":"MatteHull","b2ffef01-eaaa-4ab5-aa64-95a2c4f5dbc6":"NeonPulse","f72ec0e7-a844-4e38-82e3-140c44772699":"OilPaint","c515dad7-4393-4681-81ad-162ef052241b":"OilPaintSingleSided","f1114e2e-eb8d-4fde-915a-6e653b54e9f5":"Paper","759f1ebd-20cd-4720-8d41-234e0da63716":"PaperSingleSided","e0abbc80-0f80-e854-4970-8924a0863dcc":"Petal","c33714d1-b2f9-412e-bd50-1884c9d46336":"Plasma","ad1ad437-76e2-450d-a23a-e17f8310b960":"Rainbow","faaa4d44-fcfb-4177-96be-753ac0421ba3":"ShinyHull","70d79cca-b159-4f35-990c-f02193947fe8":"Smoke","d902ed8b-d0d1-476c-a8de-878a79e3a34c":"Snow","accb32f5-4509-454f-93f8-1df3fd31df1b":"SoftHighlighter","cf7f0059-7aeb-53a4-2b67-c83d863a9ffa":"Spikes","8dc4a70c-d558-4efd-a5ed-d4e860f40dc3":"Splatter","7a1c8107-50c5-4b70-9a39-421576d6617e":"SplatterSingleSided","0eb4db27-3f82-408d-b5a1-19ebd7d5b711":"Stars","44bb800a-fbc3-4592-8426-94ecb05ddec3":"Streamers","0077f88c-d93a-42f3-b59b-b31c50cdb414":"Taffy","b468c1fb-f254-41ed-8ec9-57030bc5660c":"TaperedFlat","c8ccb53d-ae13-45ef-8afb-b730d81394eb":"TaperedFlatSingleSided","d90c6ad8-af0f-4b54-b422-e0f92abe1b3c":"TaperedMarker","1a26b8c0-8a07-4f8a-9fac-d2ef36e0cad0":"TaperedMarker_Flat","75b32cf0-fdd6-4d89-a64b-e2a00b247b0f":"ThickPaint","fdf0326a-c0d1-4fed-b101-9db0ff6d071f":"ThickPaintSingleSided","4391385a-df73-4396-9e33-31e4e4930b27":"Toon","a8fea537-da7c-4d4b-817f-24f074725d6d":"UnlitHull","d229d335-c334-495a-a801-660ac8a87360":"VelvetInk","10201aa3-ebc2-42d8-84b7-2e63f6eeb8ab":"Waveform","b67c0e81-ce6d-40a8-aeb0-ef036b081aa3":"WetPaint","dea67637-cd1a-27e4-c9b1-52f4bbcb84e5":"WetPaintSingleSided","5347acf0-a8e2-47b6-8346-30c70719d763":"WigglyGraphite","e814fef1-97fd-7194-4a2f-50c2bb918be2":"WigglyGraphiteSingleSided","4391385a-cf83-4396-9e33-31e4e4930b27":"Wire"},common={colors:{BloomColor:`
			vec3 BloomColor(vec3 color, float gain) {
				// Guarantee that there's at least a little bit of all 3 channels.
				// This makes fully-saturated strokes (which only have 2 non-zero
				// color channels) eventually clip to white rather than to a secondary.
				float cmin = length(color.rgb) * .05;
				color.rgb = max(color.rgb, vec3(cmin, cmin, cmin));
				// If we try to remove this pow() from .a, it brightens up
				// pressure-sensitive strokes; looks better as-is.
				color = pow(color, vec3(2.2));
				color.rgb *= 2. * exp(gain * 10.);
				return color;
			}
		`,LinearToSrgb:`
			vec3 LinearToSrgb(vec3 color) {
				// Approximation http://chilliant.blogspot.com/2012/08/srgb-approximations-for-hlsl.html
				vec3 linearColor = color.rgb;
				vec3 S1 = sqrt(linearColor);
				vec3 S2 = sqrt(S1);
				vec3 S3 = sqrt(S2);
				color.rgb = 0.662002687 * S1 + 0.684122060 * S2 - 0.323583601 * S3 - 0.0225411470 * linearColor;
				return color;
			}
		`,hsv:`
			// uniform sampler2D lookupTex;
			vec4 lookup(vec4 textureColor) {
				return textureColor;
			}

			vec3 lookup(vec3 textureColor) {
				return textureColor;
			}

			vec3 hsv2rgb( vec3 hsv ) {
				vec3 rgb = clamp( abs(mod(hsv.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
				return hsv.z * mix( vec3(1.0), rgb, hsv.y);
			}

			vec3 rgb2hsv( vec3 rgb ) {
				vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
				vec4 p = mix(vec4(rgb.bg, K.wz), vec4(rgb.gb, K.xy), step(rgb.b, rgb.g));
				vec4 q = mix(vec4(p.xyw, rgb.r), vec4(rgb.r, p.yzx), step(p.x, rgb.r));

				float d = q.x - min(q.w, q.y);
				float e = 1.0e-10;

				return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
			}
		`,SrgbToLinear:`
			vec3 SrgbToLinear(vec3 color) {
				// Approximation http://chilliant.blogspot.com/2012/08/srgb-approximations-for-hlsl.html
				vec3 sRGB = color.rgb;
				color.rgb = sRGB * (sRGB * (sRGB * 0.305306011 + 0.682171111) + 0.012522878);
				return color;
			}
		`}},shaders=null;function getShaders(){return null===shaders&&(shaders={Light:{uniforms:{mainTex:{value:new n().setPath("./textures/tiltbrush/").load("Light.webp")},alphaTest:{value:.067},emission_gain:{value:.45},alpha:{value:1}},vertexShader:`
					precision highp float;
					precision highp int;

					attribute vec2 uv;
					attribute vec4 color;
					attribute vec3 position;

					uniform mat4 modelMatrix;
					uniform mat4 modelViewMatrix;
					uniform mat4 projectionMatrix;
					uniform mat4 viewMatrix;
					uniform mat3 normalMatrix;
					uniform vec3 cameraPosition;

					varying vec2 vUv;
					varying vec3 vColor;

					${common.colors.LinearToSrgb}
					${common.colors.hsv}

					void main() {

						vUv = uv;

						vColor = lookup(color.rgb);

						vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

						gl_Position = projectionMatrix * mvPosition;

					}
				`,fragmentShader:`
					precision highp float;
					precision highp int;

					uniform float emission_gain;

					uniform sampler2D mainTex;
					uniform float alphaTest;

					varying vec2 vUv;
					varying vec3 vColor;

					${common.colors.BloomColor}
					${common.colors.SrgbToLinear}

					void main(){
						vec4 col = texture2D(mainTex, vUv);
						vec3 color = vColor;
						color = BloomColor(color, emission_gain);
						color = color * col.rgb;
						color = color * col.a;
						color = SrgbToLinear(color);
						gl_FragColor = vec4(color, 1.0);
					}
				`,side:2,transparent:!0,depthFunc:2,depthWrite:!0,depthTest:!1,blending:5,blendDst:201,blendDstAlpha:201,blendEquation:100,blendEquationAlpha:100,blendSrc:201,blendSrcAlpha:201}}),shaders}function getMaterial(e){return"Light"===BRUSH_LIST_ARRAY[e]?new d(getShaders().Light):new i({vertexColors:!0,side:o})}export{TiltLoader};