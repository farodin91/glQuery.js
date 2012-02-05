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
            fog_pars_fragment:[
                "#ifdef USE_FOG",
                "#endif"
            ].join("\n"),
            fog_fragement:[
                "#ifdef USE_FOG",
                "#endif"
            ].join("\n")
        },
        createVertexShader: function(){
            var op = glQuery.webGL.options;
            if(op){
                
            }
            var shader = "\n";
            shader += "attribute    highp       vec3 aVertexNormal;\n";
            shader += "attribute    highp       vec3 aVertex;\n";
            //shader += "attribute    highp       vec2 aTextureCoord;\n";


            shader += "uniform                  mat4 uPMatrix;\n";
            shader += "uniform                  mat4 uMVMatrix;\n";
            shader += "uniform      highp       mat4 uNormalMatrix;\n";
            
            shader += "uniform                  mat4 mLookAt;\n";
            
            shader += "uniform      highp       vec3 uAmbientLight;\n";
            shader += "uniform      highp       vec3 uDirectionalLightColor;\n";
            shader += "uniform      highp       vec3 uDirectionalVector;\n";
            
            //shader += "uniform      highp       vec4 uSpecularColor;\n";
            //shader += "uniform      highp       vec4 uDiffuseColor;\n";
            
                  
            //shader += "varying      highp       vec2 vTextureCoord;\n";
            
            shader += "varying      highp       vec3 vLighting;\n";
            //shader += "varying      highp       vec4 vSpecularColor;\n";
            //shader += "varying      highp       vec4 vDiffuseColor;\n"
            
            shader += "void main(void) {\n";
            
        
            shader += "  gl_Position = uPMatrix * mLookAt *uMVMatrix* vec4(aVertex, 1.0);\n";
            
            
            shader += "  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);\n";
            
            shader += "  highp float directional = max(dot(transformedNormal.xyz, uDirectionalVector), 0.0);\n";
           
            shader += "  vLighting = uAmbientLight + (uDirectionalLightColor * directional);\n";
            
            //shader += "  vSpecularColor = aTextureCoord;\n";  
            
            //shader += "  vSpecularColor = uSpecularColor;\n";   
            //shader += "  vDiffuseColor = uDiffuseColor;\n";

            
            shader += "}";
            
            
            
            return shader;
        },
        createFragmentShader: function(){
            var shader = "\n";
            shader += "#ifdef GL_ES\n";
            shader += "precision highp float;\n";
            shader += "#endif\n";
            //shader += "varying      highp       vec2    vTextureCoord;\n"
            
            //shader += "varying      highp       vec4    vDiffuseColor;\n"
            shader += "varying      highp       vec3    vLighting;\n";
            //shader += "varying      highp       vec4    vSpecularColor;\n"
            
            shader += "void main(void) {\n";
            
            shader += "  vec3 vColor = vec3(0.5, 0.5, 0.5);\n";
            
            shader += "  gl_FragColor = vec4(vColor * vLighting, 1.0);\n";
            
            shader += "}";
            return shader;
        }
        
    };
})(glQuery);