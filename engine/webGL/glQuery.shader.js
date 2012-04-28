/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.shader.js
 *@author Jan Jansen - farodin91@googlemail.com
 *@description Coming soon
 *
 *
 *
 *
 *
 *
 *
 * Depends:
 *	jquery.1.5.0.js
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.mouse.js
 *	sylvester.src.js
 *	glQuery.core.js
 *	glQuery.collada.js
 *	glQuery.input.js
 *	glQuery.scene.js
 *	glQuery.webgl.js
 *	glQuery.events.js
 *	glQuery.math.js
 *	glQuery.animation.js
 *	glQuery.object.js
 *	glQuery.physics.js
 *	glQuery.textures.js
 */

(function( glQuery, undefined ) {

    glQuery.shader = {
        shaderSnippets:{
            transpose_function:[
            "mat4 transpose (mat4 mat);", 
            "mat4 transpose (mat4 mat){", 
            "   float a01 = mat[0][1],a02 = mat[0][2],a03 = mat[0][3],a12 = mat[1][2],a13 = mat[1][3],a23 = mat[2][3];",
   
            "   mat[0][1] = mat[1][0];",
            "   mat[0][2] = mat[2][0];",
            "   mat[0][3] = mat[3][0];",
            "   mat[1][0] = a01;",
            "   mat[1][2] = mat[2][1];",
            "   mat[1][3] = mat[3][1];",
            "   mat[2][0] = a02;",
            "   mat[2][1] = a12;",
            "   mat[2][3] = mat[3][2];",
            "   mat[3][0] = a03;",
            "   mat[3][1] = a13;",
            "   mat[3][2] = a23;",
            "   return mat;",
            "}",    
            "mat3 transpose (mat3 mat);",
            "mat3 transpose (mat3 mat){",  
            "   float a01 = mat[0][1],a02 = mat[0][2],a12 = mat[1][2];", 
   
            "   mat[0][1] = mat[1][0];", 
            "   mat[0][2] = mat[2][0];", 
            "   mat[2][0] = a01;", 
            "   mat[1][2] = mat[2][1];", 
            "   mat[2][0] = a02;", 
            "   mat[2][1] = a12;", 
            "   return mat;", 
            "}",    
            ].join("\n"),
            inverse_function:[
            "mat4 inverse (mat4 mat);",
            "mat4 inverse (mat4 mat){",
            //gl-matrix.js
            "   float a00 = mat[0][0], a01 = mat[0][1],a02 = mat[0][2], a03 = mat[0][3],",
            "   a10 = mat[1][0], a11 = mat[1][1],a12 = mat[1][2], a13 = mat[1][3],",
            "   a20 = mat[2][0], a21 = mat[2][1],a22 = mat[2][2], a23 = mat[2][3],",
            "   a30 = mat[3][0], a31 = mat[3][1],a32 = mat[3][2], a33 = mat[3][3],",
    
            "   b00 = a00 * a11 - a01 * a10,",
            "   b01 = a00 * a12 - a02 * a10,",
            "   b02 = a00 * a13 - a03 * a10,",
            "   b03 = a01 * a12 - a02 * a11,",
            "   b04 = a01 * a13 - a03 * a11,",
            "   b05 = a02 * a13 - a03 * a12,",
            "   b06 = a20 * a31 - a21 * a30,",
            "   b07 = a20 * a32 - a22 * a30,",
            "   b08 = a20 * a33 - a23 * a30,",
            "   b09 = a21 * a32 - a22 * a31,",
            "   b10 = a21 * a33 - a23 * a31,",
            "   b11 = a22 * a33 - a23 * a32,",
    
            "   d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06),",
            "   invDet;",
                   
            "   // Calculate the determinant",
            "   if (d == 0.0) { return mat; }",
            "   invDet = 1.0 / d;",
    
            "   mat[0][0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;",
            "   mat[0][0] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;",
            "   mat[0][0] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;",
            "   mat[0][0] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;",
            "   mat[1][0] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;",
            "   mat[1][0] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;",
            "   mat[1][0] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;",
            "   mat[1][0] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;",
            "   mat[2][0] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;",
            "   mat[2][0] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;",
            "   mat[2][0] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;",
            "   mat[2][0] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;",
            "   mat[3][0] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;",
            "   mat[3][0] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;",
            "   mat[3][0] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;",
            "   mat[3][0] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;",
    
            "   return mat;",
            "}",
            "mat3 inverseToMat3 (mat4 mat);",
            "mat3 inverseToMat3 (mat4 mat){",
            "   mat3 dest;",
            "   // Cache the matrix values (makes for huge speed increases!)",
            "   float a00 = mat[0][0], a01 = mat[0][1], a02 = mat[0][2],",
            "   a10 = mat[1][0], a11 = mat[1][1], a12 = mat[1][2],",
            "   a20 = mat[2][0], a21 = mat[2][1], a22 = mat[2][2],",
   
            "   b01 = a22 * a11 - a12 * a21,",
            "   b11 = -a22 * a10 + a12 * a20,",
            "   b21 = a21 * a10 - a11 * a20,",
   
            "   d = a00 * b01 + a01 * b11 + a02 * b21,",
            "   id;",
   
            "   if (d == 0.0) { return dest; }",
            "   id = 1.0 / d;",
   
   
            "   dest[0][0] = b01 * id;",
            "   dest[0][1] = (-a22 * a01 + a02 * a21) * id;",
            "   dest[0][2] = (a12 * a01 - a02 * a11) * id;",
            "   dest[1][0] = b11 * id;",
            "   dest[1][1] = (a22 * a00 - a02 * a20) * id;",
            "   dest[1][2] = (-a12 * a00 + a02 * a10) * id;",
            "   dest[2][0] = b21 * id;",
            "   dest[2][1] = (-a21 * a00 + a01 * a20) * id;",
            "   dest[2][2] = (a11 * a00 - a01 * a10) * id;",
   
            "   return dest;",
            "}",
            ].join("\n"),
            pars_vertex:[
            "#ifdef GL_ES",
            "   precision highp float;",
            "#endif",
            //"attribute    highp       vec3 aNormal;",
            "attribute    highp       vec3 aVertex;",
            "#ifdef USE_TEXTURE",
            "   attribute    highp       vec2 aTextureCoord;",
            "#endif",


            "uniform      highp       mat4 uLookAt;",
            "uniform      highp       mat4 uPerspectiveMatrix;",
            
            "uniform      highp       mat4 uModelWorldMatrix;",
            "uniform      highp       mat4 uModelViewMatrix;",
            
            
            "#ifdef USE_TEXTURE",
            "   varying      highp       vec2 vTextureCoord;",
            "#endif",
            //"varying      highp       vec3 vNormal;",
            "varying      highp       vec4 vViewPos;" ,
            "varying                  mat4 vViewMatrix;"
            
            ].join("\n"),
            vertex:[
            "   mat4 objectModel   = uModelWorldMatrix * uModelViewMatrix;",
            "   mat4 cameraModel   = uPerspectiveMatrix * uLookAt;",
            
            "   gl_Position        = cameraModel * objectModel  * vec4(aVertex, 1.0);",
            
            "   mat3 normalMatrix  = transpose(inverseToMat3(objectModel * uLookAt));",
            
            //"   vNormal            = normalMatrix * aNormal;",
            
            "   #ifdef USE_TEXTURE",
            "       vTextureCoord      = aTextureCoord;",
            "   #endif",
            "   vViewPos            = vec4(aVertex, 1.0);",
            "   vViewMatrix         = objectModel * uLookAt;"
            ].join("\n"),
            fog_pars_fragment:[
            "#ifdef USE_FOG",
            "#endif"
            ].join("\n"),
            fog_fragement:[
            "#ifdef USE_FOG",
            "#endif"
            ].join("\n"),
            phong_pars_fragment: [
            "#ifdef GL_ES",
            "   precision highp float;",
            "#endif",

            "#if MAX_POINT_LIGHTS > 0",

            "   uniform        vec3    uPointLightColor[ MAX_POINT_LIGHTS ];",
            "   uniform        vec3    uPointLightPosition[ MAX_POINT_LIGHTS ];",
               
            "   uniform        float   uPointLightDistance[ MAX_POINT_LIGHTS ];",
            "   uniform        float   uPointLightQuadraticAttenuation[ MAX_POINT_LIGHTS ];",
            "   uniform        float   uPointLightLinearAttenuation[ MAX_POINT_LIGHTS ];",
            "   uniform        float   uPointLightConstantAttenuation[ MAX_POINT_LIGHTS ];",


            "#endif",
            "#if MAX_DIR_LIGHTS > 0",

            "   uniform        vec3    uDirectionalLightColor[ MAX_DIR_LIGHTS ];",
            "   uniform        vec3    uDirectionalLightDirection[ MAX_DIR_LIGHTS ];",

            "#endif",
            
            "#if MAX_SPOT_LIGHTS > 0",

            "   uniform        vec3    uSpotLightColor[ MAX_SPOT_LIGHTS ];",
            "   uniform        vec3    uSpotLightPosition[ MAX_SPOT_LIGHTS ];",
                       
            "   uniform        float   uSpotLightDistance[ MAX_SPOT_LIGHTS ];",
            "   uniform        float   uSpotLightConstantAttenuation[ MAX_SPOT_LIGHTS ];",
            "   uniform        float   uSpotLightLinearAttenuation[ MAX_SPOT_LIGHTS ];",
            "   uniform        float   uSpotLightQuadraticAttenuation[ MAX_SPOT_LIGHTS ];",
            "   uniform        float   uSpotLightFalloffAngle[ MAX_SPOT_LIGHTS ];",
            "   uniform        float   uSpotLightFalloffExponent[ MAX_SPOT_LIGHTS ];",
            "#endif",
            
            "#ifdef USE_DIFFUSE_TEXTURE",
            "   uniform sampler2D fvDiffuse;",
            "#else",
            "   uniform vec4 fvDiffuse;",
            "#endif",
            "#ifdef USE_AMBIENT_TEXTURE",
            "   uniform sampler2D fvAmbient;",
            "#else",
            "   uniform vec4 fvAmbient;",
            "#endif",
            "#ifdef USE_EMISSION_TEXTURE",
            "   uniform sampler2D fvEmission;",
            "#else",
            "   uniform vec4 fvEmission;",
            "#endif",
            "#ifdef USE_SPECULAR_TEXTURE",
            "   uniform sampler2D fvSpecular;",
            "#else",
            "   uniform vec4 fvSpecular;",
            "#endif",
                
            "uniform float fShininess;",
            "uniform float fTransparency;",
            "uniform vec3 uAmbientLightColor;",
                
            "varying highp vec4 vViewPos;" ,
            //"varying vec3 vNormal;",
            "varying mat4 vViewMatrix;",
                
            "#ifdef USE_TEXTURE",
            "   varying vec2 vTextureCoord;",
            "#endif",
            
            

            ].join("\n"),
            
            phong_fragment: [
                
            "vec4 fvTotalDiffuse = vec4(0.0,0.0,0.0,fTransparency);",
            "vec4 fvTotalSpecular = vec4(0.0,0.0,0.0,fTransparency);",
            "vec4 vViewPosition = vViewMatrix * vViewPos;",
            "vec4 viewPosition = normalize( vViewPosition );",
            //"vec3 normal = normalize(vNormal);",
                
            "#if MAX_POINT_LIGHTS > 0",
            "    vec3 fvPointDiffuse  = vec3( 0.0 );",
            "    vec3 fvPointSpecular  = vec3( 0.0 );",
            "    for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {",
            //"      float A = uPointLightConstantAttenuation[i] + ( uPointLightDistance[i] * uPointLightLinearAttenuation[i] ) + (( uPointLightDistance[i]*uPointLightDistance[i] ) * uPointLightQuadraticAttenuation[i] )",
                                
            "        vec4 lPosition = viewMatrix * vec4( uPointLightPosition[ i ], 1.0 );",
            "        vec3 lVector = lPosition.xyz + vViewPosition.xyz;",
          
            "        float lDistance = 1.0;",
            "        if ( pointLightDistance[ i ] > 0.0 )",
            "            lDistance = 1.0 - min( ( length( lVector ) / uPointLightDistance[ i ] ), 1.0 );",
          
            "        lVector = normalize( lVector );",
                                
            "        float fvPointDiffuseWeight = max( dot( normal, lVector ), 0.0 );",
                                
            "        #ifdef USE_DIFFUSE_TEXTURE",
            "            fvPointDiffuse += texture2D(fvDiffuse,vTexcoord).xyz * uPointLightColor[ i ] * fvPointDiffuseWeight * lDistance;",
            "        #else",
            "            fvPointDiffuse += fvDiffuse.xyz * uPointLightColor[ i ] * fvPointDiffuseWeight * lDistance;",
            "        #endif",
                                
                                
            "        vec3 fvPointHalfVector = normalize( lVector + viewPosition.xyz );",
            "        float fvPointDotNormalHalf = max( dot( normal, fvPointHalfVector ), 0.0 );",
            "        float fvPointSpecularWeight = max( pow( fvPointDotNormalHalf, shininess ), 0.0 );",
          
            "        #ifdef USE_SPECULAR_TEXTURE",
            "            fvPointSpecular += texture2D(fvSpecular,vTexcoord).xyz * uPointLightColor[ i ] * fvPointSpecularWeight * fvPointDiffuseWeight * lDistance;",
            //"          fvPointSpecular += texture2D(fvSpecular,Texcoord) * uPointLightColor[ i ] * fvPointSpecularWeight * lDistance;",
            "        #else",
            "            fvPointSpecular += fvSpecular.xyz * uPointLightColor[ i ] * fvPointSpecularWeight * fvPointDiffuseWeight * lDistance;",
            //"          fvPointSpecular += fvSpecular * uPointLightColor[ i ] * fvPointSpecularWeight  * lDistance;",
            "        #endif",
            "    }",
            "    fvTotalDiffuse.xyz += fvPointDiffuse.xyz;",
            "    fvTotalSpecular.xyz += fvPointSpecular.xyz;",                    
            "#endif",
                
            "#if MAX_DIR_LIGHTS > 0",
            "    vec3 fvDirDiffuse  = vec3( 0.0 );",
            "    vec3 fvDirSpecular  = vec3( 0.0 );",
            "    for ( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {",
            "        vec4 vDirection = vViewMatrix * vec4( uDirectionalLightDirection[ i ], 0.0 );",
            "        vec3 fvDirVector = normalize( vDirection.xyz );",
                                
            "        float fvDirDiffuseWeight = max( dot( vNormal, dirVector ), 0.0 );",
                                
            "        #ifdef USE_DIFFUSE_TEXTURE",
            "        fvDirDiffuse += fvDirDiffuseWeight * texture2D(fvDiffuse,vTexcoord) * uDirectionalLightColor[i];",
            "        #else",
            "        fvDirDiffuse += fvDirDiffuseWeight * fvDiffuse * uDirectionalLightColor[i];",
            "        #endif",
                                    
                                    
            "        vec3 fvDirHalfVector = normalize( fvDirVector + viewPosition );",
            "        float fvDirDotNormalHalf = max( dot( normal, fvDirHalfVector ), 0.0 );",
                                
            "        float fvDirSpecularWeight = max( pow( fvDirDotNormalHalf, fShininess ), 0.0 );",
                        
            "        #ifdef USE_SPECULAR_TEXTURE",
            "            fvDirSpecular += texture2D(fvSpecular,vTexcoord).xyz * fvDirDiffuseWeight * fvDirSpecularWeight * uDirectionalLightColor[i];",
            //"          fvDirSpecular += texture2D(fvSpecular,Texcoord)  * fvDirSpecularWeight * uDirectionalLightColor[i];",
            "        #else",
            "            fvDirSpecular += fvSpecular.xyz * fvDirDiffuseWeight * fvDirSpecularWeight * uDirectionalLightColor[i];",
            //"          fvDirSpecular += fvSpecular * fvDirSpecularWeight * uDirectionalLightColor[i];",
            "        #endif",
                                
            "    }",
            "    fvTotalDiffuse.xyz += fvDirDiffuse.xyz;",
            "    fvTotalSpecular.xyz += fvDirSpecular.xyz;",
            "#endif",
            
            "#if MAX_SPOT_LIGHTS > 0",
            "#endif",
                
            "#ifdef USE_AMBIENT_TEXTURE",
            "    vec4 fvTotalAmbient = texture2D(fvAmbient,vTexcoord) * vec4(uAmbientLightColor,fTransparency);",
            "#else",
            "    vec4 fvTotalAmbient = fvAmbient  * vec4(uAmbientLightColor,fTransparency);",
            "#endif",
                
            "#ifdef USE_EMISSION_TEXTURE",
            "    vec4 fvTotalEmission = texture2D(fvEmission,vTexcoord);",
            "#else",
            "    vec4 fvTotalEmission = fvEmission;",
            "#endif",
                
            "gl_FragColor = ( fvTotalAmbient + fvTotalEmission + fvTotalDiffuse + fvTotalSpecular );",
            ].join("\n")
            
        },
        uniformsLibrary:{
            common_vertex:{
                uLookAt                                 :{
                    type:"m4",
                    value:0
                },
                uPerspectiveMatrix                      :{
                    type:"m4",
                    value:0
                },
                
                uModelWorldMatrix                       :{
                    type:"m4",
                    value:0
                },
                uModelViewMatrix                        :{
                    type:"m4",
                    value:0
                }
            },
            phong:{
                fvDiffuse                               :{
                    type:"t_c",
                    value:0
                },
                fvAmbient                               :{
                    type:"t_c",
                    value:0
                },
                fvEmission                              :{
                    type:"t_c",
                    value:0
                },
                fvSpecular                              :{
                    type:"t_c",
                    value:0
                },
                fShininess                              :{
                    type:"f",
                    value:0
                }
            },
            light:{
                pointLight:{
                    uPointLightColor                    :{
                        type:"v3",
                        value:0
                    },
                    uPointLightPosition                 :{
                        type:"v3",
                        value:0
                    },
                    
                    uPointLightDistance                 :{
                        type:"f",
                        value:0
                    },
                    uPointLightQuadraticAttenuation     :{
                        type:"f",
                        value:0
                    },
                    uPointLightLinearAttenuation        :{
                        type:"f",
                        value:0
                    },
                    uPointLightConstantAttenuation      :{
                        type:"f",
                        value:0
                    }               
                },
                spotLight:{
                    uSpotLightColor                     :{
                        type:"v3",
                        value:0
                    },
                    uSpotLightPosition                  :{
                        type:"v3",
                        value:0
                    },
                    
                    uSpotLightDistance                  :{
                        type:"f",
                        value:0
                    },
                    uSpotLightConstantAttenuation       :{
                        type:"f",
                        value:0
                    },
                    uSpotLightLinearAttenuation         :{
                        type:"f",
                        value:0
                    },
                    uSpotLightQuadraticAttenuation      :{
                        type:"f",
                        value:0
                    },
                    uSpotLightFalloffAngle              :{
                        type:"f",
                        value:0
                    },
                    uSpotLightFalloffExponent           :{
                        type:"f",
                        value:0
                    }
                },
                directionalLight:{
                    uDirectionalLightDirection          :{
                        type:"v3",
                        value:0
                    },
                    uDirectionalLightColor              :{
                        type:"v3",
                        value:0
                    }
                },
                ambientLight:{
                    uAmbientLightColor                  :{
                        type:"v3",
                        value:0
                    }
                }
            },
            fog:{
                
        }
        },
        defineLibrary:{
            common_vertex:{
                USE_TEXTURE                             :{
                    type:"b",
                    value:undefined
                }
            },
            light:{
                MAX_SPOT_LIGHTS                         :{
                    type:"i",
                    value:0
                },
                MAX_POINT_LIGHTS                        :{
                    type:"i",
                    value:0
                },
                MAX_DIR_LIGHTS                          :{
                    type:"i",
                    value:0
                }
            },
            phong:{
                USE_SPECULAR_TEXTURE                    :{
                    type:"b",
                    value:undefined
                },
                USE_DIFFUSE_TEXTURE                     :{
                    type:"b",
                    value:undefined
                },
                USE_AMBIENT_TEXTURE                     :{
                    type:"b",
                    value:undefined
                },
                USE_EMISSION_TEXTURE                    :{
                    type:"b",
                    value:undefined
                }
            }
        },
        attributeLibrary:{
            common_vertex:{
                aTextureCoord                           :{
                    type:"v2",
                    value:0
                },
                aVertex                                 :{
                    type:"v3",
                    value:0
                },
                aNormal                                 :{
                    type:"v3",
                    value:0
                }
            }
        },
        getDefinition:function(type,defined){
            var definition = [];
            var i = 0;
            for(var key in defined){
                if(this.defineLibrary[type][key]){
                    if(this.defineLibrary[type][key].type == "b"){
                        if(defined[key]){
                            definition[i] = "#define "+key+" "+defined[key]+"\n";
                            i = i+1;
                        }             
                    }else if(this.defineLibrary[type][key].type == "i"){
                        definition[i] = "#define "+key+" "+defined[key]+"\n";
                        i = i+1;
                    }
                }
            }
            return definition.join("\n");
        },
        createVertexShaderSource: function(defined){
            var shader = [
            this.getDefinition("common_vertex",defined),
            this.shaderSnippets.transpose_function,
            this.shaderSnippets.inverse_function,
            this.shaderSnippets.pars_vertex,
            "void main(void) {",
            this.shaderSnippets.vertex,
            "}"
                
            ];
            return shader.join("\n");
        },
        createFragmentShaderSource: function(type,defined_type,defined_light){
            var shader = [
            "precision highp float;",
            this.getDefinition(type,defined_type),
            this.getDefinition("light",defined_light),
            //this.shaderSnippets.fog_pars_fragement,
            this.shaderSnippets[type+"_pars_fragment"],
            "void main(void){",
            this.shaderSnippets[type+"_fragment"],
            //this.shaderSnippets.fog_fragement,
            "}"
            ].join("\n");
            return shader;
        },
        createAttribute:function(type,shaderProgram){
            var attribute = {};
            
            for(var key in this.attributeLibrary[type]){
                attribute[key]                      = {
                    "location":glQuery.gl.getAttribLocation(shaderProgram, key),
                    "type":this.attributeLibrary[type][key]["type"],
                    "defaults":this.attributeLibrary[type][key]["value"]
                };
            }
            return attribute;
        },
        createUniforms:function(vertexType,fragmentType,shaderProgram){
            var uniforms = {};
            
            for(var key in this.uniformsLibrary[vertexType]){
                if(!uniforms[vertexType])
                    uniforms[vertexType] = {};
                uniforms[vertexType][key]           = {
                    "location"      :glQuery.gl.getUniformLocation(shaderProgram, key),
                    "type"          :this.uniformsLibrary[vertexType][key]["type"],
                    "defaults"      :this.uniformsLibrary[vertexType][key]["value"]
                };
            }
            for(var key in this.uniformsLibrary[fragmentType]){
                if(!uniforms[fragmentType])
                    uniforms[fragmentType] = {};
                uniforms[fragmentType][key]         = {
                    "location"      :glQuery.gl.getUniformLocation(shaderProgram, key),
                    "type"          :this.uniformsLibrary[fragmentType][key]["type"],
                    "defaults"      :this.uniformsLibrary[fragmentType][key]["value"]
                };
            }
            uniforms["light"] = {};
            for(var key in this.uniformsLibrary["light"]){
                if(!uniforms["light"][key])
                    uniforms["light"][key] = {};
                for(var i in this.uniformsLibrary["light"][key]){
                    uniforms["light"][i]     = {
                        "location"  :glQuery.gl.getUniformLocation(shaderProgram, i),
                        "type"      :this.uniformsLibrary["light"][key][i]["type"],
                        "defaults"  :this.uniformsLibrary["light"][key][i]["value"]
                    };
                }
            }
            return uniforms;
        },
        updateShader:function(){
            
        },
        updateAllShaders:function(){
            
        },
        getShaderProgramKey:function(options){
            var i = -1;
            for(var key in this.shaders){
                if(options.fragmentType == this.shaders[key]["type"]){
                    if(options["USE_TEXTURE"] == this.shaders[key]["options"]["USE_TEXTURE"]){
                        i = parseInt(key);
                        break;
                    }
                    if((this.shaders[key]["options"]["USE_TEXTURES"]["USE_SPECULAR_TEXTURE"] == options["USE_TEXTURES"]["USE_SPECULAR_TEXTURE"])
                        && (this.shaders[key]["options"]["USE_TEXTURES"]["USE_DIFFUSE_TEXTURE"] == options["USE_TEXTURES"]["USE_DIFFUSE_TEXTURE"])
                        && (this.shaders[key]["options"]["USE_TEXTURES"]["USE_AMBIENT_TEXTURE"] == options["USE_TEXTURES"]["USE_AMBIENT_TEXTURE"])
                        && (this.shaders[key]["options"]["USE_TEXTURES"]["USE_EMISSION_TEXTURE"] == options["USE_TEXTURES"]["USE_EMISSION_TEXTURE"])){
                        i = parseInt(key);
                        break;
                        
                    }
                } 
            }
            if(i == -1){
                i = this.createShader(options);
            }
            return i;
        },
        createShader:function(options){
            var shader = this.getShaderSource(options);
            var shaderProgram = glQuery.gl.createProgram();
            log.profile("glQuery.gl.attachShader(shaderProgram, shader.XVertex);");
            glQuery.gl.attachShader(shaderProgram, shader.XVertex);
            log.profile("glQuery.gl.attachShader(shaderProgram, shader.XFragment);");
            glQuery.gl.attachShader(shaderProgram, shader.XFragment);
            glQuery.gl.linkProgram(shaderProgram);
            if (!glQuery.gl.getProgramParameter(shaderProgram, glQuery.gl.LINK_STATUS)){
                alert("Could not initialise shaders");
            }
            var key = this.shaders.length;
            this.shaders[key] = {
                shaderProgram: shaderProgram,
                uniforms: this.createUniforms("common_vertex",options["fragmentType"], shaderProgram),
                attribute: this.createAttribute("common_vertex", shaderProgram),
                options: options,
                type: options["fragmentType"]
            }
            return key;
        },
        getShaderSource:function(options){
            
            var shader = {};
            log.profile("glQuery.shader.getShader() 1");
            
            shader.XFragment = glQuery.gl.createShader(glQuery.gl.FRAGMENT_SHADER);
            shader.XVertex = glQuery.gl.createShader(glQuery.gl.VERTEX_SHADER);

            glQuery.gl.shaderSource(shader.XFragment, glQuery.shader.createFragmentShaderSource(options["fragmentType"],options["USE_TEXTURES"],glQuery.light.shaderLight)); //str enhält hier den kompletten Quellcode des Shaderscripts
            glQuery.gl.compileShader(shader.XFragment);
        
            glQuery.gl.shaderSource(shader.XVertex, glQuery.shader.createVertexShaderSource({
                "USE_TEXTURE":options["USE_TEXTURE"]
            })); //str enhält hier den kompletten Quellcode des Shaderscripts
            glQuery.gl.compileShader(shader.XVertex);     

            if (!glQuery.gl.getShaderParameter(shader.XFragment, glQuery.gl.COMPILE_STATUS)){
                console.log(glQuery.gl.getShaderInfoLog(shader.XFragment));
                return false;
            }
            if (!glQuery.gl.getShaderParameter(shader.XVertex, glQuery.gl.COMPILE_STATUS)){
                console.log(glQuery.gl.getShaderInfoLog(shader.XVertex));
                return false;
            }
            log.profile("glQuery.shader.getShader() 1");
            return shader;
        },
        shaders:[]
    };
})(glQuery);