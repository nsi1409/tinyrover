import{UniformsUtils as e,UniformsLib as i,ShaderMaterial as t,Color as r,MultiplyOperation as a}from"three";let GouraudShader={name:"GouraudShader",uniforms:e.merge([i.common,i.specularmap,i.envmap,i.aomap,i.lightmap,i.emissivemap,i.fog,i.lights,{emissive:{value:new r(0)}}]),vertexShader:`

		#define GOURAUD

		varying vec3 vLightFront;
		varying vec3 vIndirectFront;

		#ifdef DOUBLE_SIDED
			varying vec3 vLightBack;
			varying vec3 vIndirectBack;
		#endif

		#include <common>
		#include <uv_pars_vertex>
		#include <envmap_pars_vertex>
		#include <bsdfs>
		#include <lights_pars_begin>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <morphtarget_pars_vertex>
		#include <skinning_pars_vertex>
		#include <shadowmap_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		void main() {

			#include <uv_vertex>
			#include <color_vertex>
			#include <morphcolor_vertex>

			#include <beginnormal_vertex>
			#include <morphnormal_vertex>
			#include <skinbase_vertex>
			#include <skinnormal_vertex>
			#include <defaultnormal_vertex>

			#include <begin_vertex>
			#include <morphtarget_vertex>
			#include <skinning_vertex>
			#include <project_vertex>
			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>

			#include <worldpos_vertex>
			#include <envmap_vertex>

			// inlining legacy <lights_lambert_vertex>

			vec3 diffuse = vec3( 1.0 );

			vec3 geometryPosition = mvPosition.xyz;
			vec3 geometryNormal = normalize( transformedNormal );
			vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( -mvPosition.xyz );

			vec3 backGeometryNormal = - geometryNormal;

			vLightFront = vec3( 0.0 );
			vIndirectFront = vec3( 0.0 );
			#ifdef DOUBLE_SIDED
				vLightBack = vec3( 0.0 );
				vIndirectBack = vec3( 0.0 );
			#endif

			IncidentLight directLight;
			float dotNL;
			vec3 directLightColor_Diffuse;

			vIndirectFront += getAmbientLightIrradiance( ambientLightColor );

			#if defined( USE_LIGHT_PROBES )

				vIndirectFront += getLightProbeIrradiance( lightProbe, geometryNormal );

			#endif

			#ifdef DOUBLE_SIDED

				vIndirectBack += getAmbientLightIrradiance( ambientLightColor );

				#if defined( USE_LIGHT_PROBES )

					vIndirectBack += getLightProbeIrradiance( lightProbe, backGeometryNormal );

				#endif

			#endif

			#if NUM_POINT_LIGHTS > 0

				#pragma unroll_loop_start
				for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {

					getPointLightInfo( pointLights[ i ], geometryPosition, directLight );

					dotNL = dot( geometryNormal, directLight.direction );
					directLightColor_Diffuse = directLight.color;

					vLightFront += saturate( dotNL ) * directLightColor_Diffuse;

					#ifdef DOUBLE_SIDED

						vLightBack += saturate( - dotNL ) * directLightColor_Diffuse;

					#endif

				}
				#pragma unroll_loop_end

			#endif

			#if NUM_SPOT_LIGHTS > 0

				#pragma unroll_loop_start
				for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {

					getSpotLightInfo( spotLights[ i ], geometryPosition, directLight );

					dotNL = dot( geometryNormal, directLight.direction );
					directLightColor_Diffuse = directLight.color;

					vLightFront += saturate( dotNL ) * directLightColor_Diffuse;

					#ifdef DOUBLE_SIDED

						vLightBack += saturate( - dotNL ) * directLightColor_Diffuse;

					#endif
				}
				#pragma unroll_loop_end

			#endif

			#if NUM_DIR_LIGHTS > 0

				#pragma unroll_loop_start
				for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {

					getDirectionalLightInfo( directionalLights[ i ], directLight );

					dotNL = dot( geometryNormal, directLight.direction );
					directLightColor_Diffuse = directLight.color;

					vLightFront += saturate( dotNL ) * directLightColor_Diffuse;

					#ifdef DOUBLE_SIDED

						vLightBack += saturate( - dotNL ) * directLightColor_Diffuse;

					#endif

				}
				#pragma unroll_loop_end

			#endif

			#if NUM_HEMI_LIGHTS > 0

				#pragma unroll_loop_start
				for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {

					vIndirectFront += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );

					#ifdef DOUBLE_SIDED

						vIndirectBack += getHemisphereLightIrradiance( hemisphereLights[ i ], backGeometryNormal );

					#endif

				}
				#pragma unroll_loop_end

			#endif

			#include <shadowmap_vertex>
			#include <fog_vertex>

		}`,fragmentShader:`

		#define GOURAUD

		uniform vec3 diffuse;
		uniform vec3 emissive;
		uniform float opacity;

		varying vec3 vLightFront;
		varying vec3 vIndirectFront;

		#ifdef DOUBLE_SIDED
			varying vec3 vLightBack;
			varying vec3 vIndirectBack;
		#endif

		#include <common>
		#include <packing>
		#include <dithering_pars_fragment>
		#include <color_pars_fragment>
		#include <uv_pars_fragment>
		#include <map_pars_fragment>
		#include <alphamap_pars_fragment>
		#include <alphatest_pars_fragment>
		#include <aomap_pars_fragment>
		#include <lightmap_pars_fragment>
		#include <emissivemap_pars_fragment>
		#include <envmap_common_pars_fragment>
		#include <envmap_pars_fragment>
		#include <bsdfs>
		#include <lights_pars_begin>
		#include <fog_pars_fragment>
		#include <shadowmap_pars_fragment>
		#include <shadowmask_pars_fragment>
		#include <specularmap_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		void main() {

			#include <clipping_planes_fragment>

			vec4 diffuseColor = vec4( diffuse, opacity );
			ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
			vec3 totalEmissiveRadiance = emissive;

			#include <logdepthbuf_fragment>
			#include <map_fragment>
			#include <color_fragment>
			#include <alphamap_fragment>
			#include <alphatest_fragment>
			#include <specularmap_fragment>
			#include <emissivemap_fragment>

			// accumulation

			#ifdef DOUBLE_SIDED

				reflectedLight.indirectDiffuse += ( gl_FrontFacing ) ? vIndirectFront : vIndirectBack;

			#else

				reflectedLight.indirectDiffuse += vIndirectFront;

			#endif

			#include <lightmap_fragment>

			reflectedLight.indirectDiffuse *= BRDF_Lambert( diffuseColor.rgb );

			#ifdef DOUBLE_SIDED

				reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;

			#else

				reflectedLight.directDiffuse = vLightFront;

			#endif

			reflectedLight.directDiffuse *= BRDF_Lambert( diffuseColor.rgb ) * getShadowMask();

			// modulation

			#include <aomap_fragment>

			vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;

			#include <envmap_fragment>

			#include <opaque_fragment>
			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>
			#include <dithering_fragment>

		}`};class MeshGouraudMaterial extends t{constructor(i){super(),this.isMeshGouraudMaterial=!0,this.type="MeshGouraudMaterial",this.combine=a,this.fog=!1,this.lights=!0,this.clipping=!1;let t=GouraudShader;this.defines=Object.assign({},t.defines),this.uniforms=e.clone(t.uniforms),this.vertexShader=t.vertexShader,this.fragmentShader=t.fragmentShader;let r=["map","lightMap","lightMapIntensity","aoMap","aoMapIntensity","emissive","emissiveIntensity","emissiveMap","specularMap","alphaMap","envMap","reflectivity","refractionRatio","opacity","diffuse"];for(let n of r)Object.defineProperty(this,n,{get:function(){return this.uniforms[n].value},set:function(e){this.uniforms[n].value=e}});Object.defineProperty(this,"color",Object.getOwnPropertyDescriptor(this,"diffuse")),this.setValues(i)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}export{MeshGouraudMaterial};