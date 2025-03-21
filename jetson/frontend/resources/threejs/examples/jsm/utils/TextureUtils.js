import{PlaneGeometry as e,ShaderMaterial as r,Uniform as a,Mesh as l,PerspectiveCamera as n,Scene as t,WebGLRenderer as i,CanvasTexture as u,SRGBColorSpace as s}from"three";let _renderer,fullscreenQuadGeometry,fullscreenQuadMaterial,fullscreenQuad;export function decompress(d,o=1/0,m=null){fullscreenQuadGeometry||(fullscreenQuadGeometry=new e(2,2,1,1)),fullscreenQuadMaterial||(fullscreenQuadMaterial=new r({uniforms:{blitTexture:new a(d)},vertexShader:`
			varying vec2 vUv;
			void main(){
				vUv = uv;
				gl_Position = vec4(position.xy * 1.0,0.,.999999);
			}`,fragmentShader:`
			uniform sampler2D blitTexture; 
			varying vec2 vUv;

			void main(){ 
				gl_FragColor = vec4(vUv.xy, 0, 1);
				
				#ifdef IS_SRGB
				gl_FragColor = LinearTosRGB( texture2D( blitTexture, vUv) );
				#else
				gl_FragColor = texture2D( blitTexture, vUv);
				#endif
			}`})),fullscreenQuadMaterial.uniforms.blitTexture.value=d,fullscreenQuadMaterial.defines.IS_SRGB=d.colorSpace==s,fullscreenQuadMaterial.needsUpdate=!0,fullscreenQuad||((fullscreenQuad=new l(fullscreenQuadGeometry,fullscreenQuadMaterial)).frustrumCulled=!1);let c=new n,f=new t;f.add(fullscreenQuad),null===m&&(m=_renderer=new i({antialias:!1}));let v=Math.min(d.image.width,o),g=Math.min(d.image.height,o);m.setSize(v,g),m.clear(),m.render(f,c);let w=document.createElement("canvas"),Q=w.getContext("2d");w.width=v,w.height=g,Q.drawImage(m.domElement,0,0,v,g);let p=new u(w);return p.minFilter=d.minFilter,p.magFilter=d.magFilter,p.wrapS=d.wrapS,p.wrapT=d.wrapT,p.name=d.name,_renderer&&(_renderer.forceContextLoss(),_renderer.dispose(),_renderer=null),p}