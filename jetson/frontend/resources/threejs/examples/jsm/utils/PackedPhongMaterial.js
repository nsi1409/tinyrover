import{MeshPhongMaterial as e,ShaderChunk as r,ShaderLib as a,UniformsUtils as t}from"three";class PackedPhongMaterial extends e{constructor(e){super(),this.defines={},this.type="PackedPhongMaterial",this.uniforms=t.merge([a.phong.uniforms,{quantizeMatPos:{value:null},quantizeMatUV:{value:null}}]),this.vertexShader=["#define PHONG","varying vec3 vViewPosition;",r.common,r.uv_pars_vertex,r.displacementmap_pars_vertex,r.envmap_pars_vertex,r.color_pars_vertex,r.fog_pars_vertex,r.normal_pars_vertex,r.morphtarget_pars_vertex,r.skinning_pars_vertex,r.shadowmap_pars_vertex,r.logdepthbuf_pars_vertex,r.clipping_planes_pars_vertex,`#ifdef USE_PACKED_NORMAL
					#if USE_PACKED_NORMAL == 0
						vec3 decodeNormal(vec3 packedNormal)
						{
							float x = packedNormal.x * 2.0 - 1.0;
							float y = packedNormal.y * 2.0 - 1.0;
							vec2 scth = vec2(sin(x * PI), cos(x * PI));
							vec2 scphi = vec2(sqrt(1.0 - y * y), y);
							return normalize( vec3(scth.y * scphi.x, scth.x * scphi.x, scphi.y) );
						}
					#endif

					#if USE_PACKED_NORMAL == 1
						vec3 decodeNormal(vec3 packedNormal)
						{
							vec3 v = vec3(packedNormal.xy, 1.0 - abs(packedNormal.x) - abs(packedNormal.y));
							if (v.z < 0.0)
							{
								v.xy = (1.0 - abs(v.yx)) * vec2((v.x >= 0.0) ? +1.0 : -1.0, (v.y >= 0.0) ? +1.0 : -1.0);
							}
							return normalize(v);
						}
					#endif

					#if USE_PACKED_NORMAL == 2
						vec3 decodeNormal(vec3 packedNormal)
						{
							vec3 v = (packedNormal * 2.0) - 1.0;
							return normalize(v);
						}
					#endif
				#endif`,`#ifdef USE_PACKED_POSITION
					#if USE_PACKED_POSITION == 0
						uniform mat4 quantizeMatPos;
					#endif
				#endif`,`#ifdef USE_PACKED_UV
					#if USE_PACKED_UV == 1
						uniform mat3 quantizeMatUV;
					#endif
				#endif`,`#ifdef USE_PACKED_UV
					#if USE_PACKED_UV == 0
						vec2 decodeUV(vec2 packedUV)
						{
							vec2 uv = (packedUV * 2.0) - 1.0;
							return uv;
						}
					#endif

					#if USE_PACKED_UV == 1
						vec2 decodeUV(vec2 packedUV)
						{
							vec2 uv = ( vec3(packedUV, 1.0) * quantizeMatUV ).xy;
							return uv;
						}
					#endif
				#endif`,"void main() {",r.uv_vertex,`#ifdef USE_MAP
					#ifdef USE_PACKED_UV
						vMapUv = decodeUV(vMapUv);
					#endif
				#endif`,r.color_vertex,r.morphcolor_vertex,r.beginnormal_vertex,`#ifdef USE_PACKED_NORMAL
					objectNormal = decodeNormal(objectNormal);
				#endif

				#ifdef USE_TANGENT
					vec3 objectTangent = vec3( tangent.xyz );
				#endif
				`,r.morphnormal_vertex,r.skinbase_vertex,r.skinnormal_vertex,r.defaultnormal_vertex,r.normal_vertex,r.begin_vertex,`#ifdef USE_PACKED_POSITION
					#if USE_PACKED_POSITION == 0
						transformed = ( vec4(transformed, 1.0) * quantizeMatPos ).xyz;
					#endif
				#endif`,r.morphtarget_vertex,r.skinning_vertex,r.displacementmap_vertex,r.project_vertex,r.logdepthbuf_vertex,r.clipping_planes_vertex,"vViewPosition = - mvPosition.xyz;",r.worldpos_vertex,r.envmap_vertex,r.shadowmap_vertex,r.fog_vertex,"}",].join("\n"),this.fragmentShader=a.phong.fragmentShader,this.setValues(e)}}export{PackedPhongMaterial};