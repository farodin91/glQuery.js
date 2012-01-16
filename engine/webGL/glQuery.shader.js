/*
 * Copyright 2011, Jan Jansen
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
        createVertexShader: function(){
            var op = glQuery.webGL.options;
            if(op){
                
            }
            var shader = "\n";
            //shader += "attribute    highp       vec3 aVertexNormal;\n"
            shader += "attribute    highp       vec3 aVertex;\n";


            shader += "uniform                  mat4 uPMatrix;\n";
            shader += "uniform                  mat4 uMVMatrix;\n";
            //shader += "uniform      highp       mat4 uNormalMatrix;\n";
            
            shader += "uniform                  vec3 vObjectPos;\n";
            shader += "uniform                  vec3 vCameraPos;\n";
            shader += "uniform                  mat4 mLookAt;\n";
            /*
            shader += "uniform      highp       vec3 uAmbientLight;\n";
            shader += "uniform      highp       vec3 uDirectionalLightColor;\n";
            shader += "uniform      highp       vec3 uDirectionalVector;\n";
            
            shader += "uniform      highp       vec4 uSpecularColor;\n"
            shader += "uniform      highp       vec4 uDiffuseColor;\n"
            
                  
            shader += "varying      highp       vec3 vLighting;\n"
            shader += "varying      highp       vec4 vSpecularColor;\n"
            shader += "varying      highp       vec4 vDiffuseColor;\n"*/
            
            
            shader += "mat4 rotateX(mat4 mat,float angle){\n";
            shader += "float s = sin(angle), c = cos(angle), a10 = mat[1][0],a11 = mat[1][1],a12 = mat[1][2],a13 = mat[1][3], a20 = mat[2][0],a21 = mat[2][1],a22 = mat[2][2],a23 = mat[2][3];\n";
            shader += "mat[1][0] = a10 * c + a20 * s;\n";
            shader += "mat[1][1] = a11 * c + a21 * s;\n";
            shader += "mat[1][2] = a12 * c + a22 * s;\n";
            shader += "mat[1][3] = a13 * c + a23 * s;\n";

            shader += "mat[2][0] = a10 * -s + a20 * c;\n";
            shader += "mat[2][1] = a11 * -s + a21 * c;\n";
            shader += "mat[2][2] = a12 * -s + a22 * c;\n";
            shader += "mat[2][3] = a13 * -s + a23 * c;\n";
            shader += "return mat;}\n";
            
            shader += "mat4 rotateZ(mat4 mat,float angle){\n";
            shader += "float s = sin(angle), c = cos(angle), a10 = mat[1][0],a11 = mat[1][1],a12 = mat[1][2],a13 = mat[1][3],a00 = mat[0][0],a01 = mat[0][1],a02 = mat[0][2],a03 = mat[0][3];\n";
            shader += "mat[0][0] = a00 * c + a10 * s;\n";
            shader += "mat[0][1] = a01 * c + a11 * s;\n";
            shader += "mat[0][2] = a02 * c + a12 * s;\n";
            shader += "mat[0][3] = a03 * c + a13 * s;\n";

            shader += "mat[1][0] = a00 * -s + a10 * c;\n";
            shader += "mat[1][1] = a01 * -s + a11 * c;\n";
            shader += "mat[1][2] = a02 * -s + a12 * c;\n";
            shader += "mat[1][3] = a03 * -s + a13 * c;\n";
            shader += "return mat;}\n";
            
            shader += "mat4 rotateY(mat4 mat,float angle){\n";
            shader += "float s = sin(angle), c = cos(angle),a00 = mat[0][0],a01 = mat[0][1],a02 = mat[0][2],a03 = mat[0][3], a20 = mat[2][0],a21 = mat[2][1],a22 = mat[2][2],a23 = mat[2][3];\n";
            shader += "mat[0][0] = a00 * c + a20 * -s;\n";
            shader += "mat[0][1] = a01 * c + a21 * -s;\n";
            shader += "mat[0][2] = a02 * c + a22 * -s;\n";
            shader += "mat[0][3] = a03 * c + a23 * -s;\n";

            shader += "mat[2][0] = a00 * s + a20 * c;\n";
            shader += "mat[2][1] = a01 * s + a21 * c;\n";
            shader += "mat[2][2] = a02 * s + a22 * c;\n";
            shader += "mat[2][3] = a03 * s + a23 * c;\n";
            shader += "return mat;}\n";
            
            shader += "mat4 translate(mat4 mat,vec3 vec){\n";
            shader += "float x = vec[0], y = vec[1], z = vec[2], a00, a01, a02, a03, a10, a11, a12, a13, a20, a21, a22, a23;\n";
            shader += "a00 = mat[0][0];\n a01 = mat[0][1];\n a02 = mat[0][2];\n a03 = mat[0][3];\n";
            shader += "a10 = mat[1][0];\n a11 = mat[1][1];\n a12 = mat[1][2];\n a13 = mat[1][3];\n";
            shader += "a20 = mat[2][0];\n a21 = mat[2][1];\n a22 = mat[2][2];\n a23 = mat[2][3];\n";

            shader += "mat[0][0] = a00;\n mat[0][1] = a01;\n mat[0][2] = a02;\n mat[0][3] = a03;\n";
            shader += "mat[1][0] = a10;\n mat[1][1] = a11;\n mat[1][2] = a12;\n mat[1][3] = a13;\n";
            shader += "mat[2][0] = a20;\n mat[2][1] = a21;\n mat[2][2] = a22;\n mat[2][3] = a23;\n";

            shader += "mat[3][0] = a00 * x + a10 * y + a20 * z + mat[3][0];\n";
            shader += "mat[3][1] = a01 * x + a11 * y + a21 * z + mat[3][1];\n";
            shader += "mat[3][2] = a02 * x + a12 * y + a22 * z + mat[3][2];\n";
            shader += "mat[3][3] = a03 * x + a13 * y + a23 * z + mat[3][3];\n";
            shader += "return mat;}\n";
            

            shader += "void main(void) {\n";
            
            shader += "  vec3 vObjCamPos = (vObjectPos - vCameraPos);\n";
            shader += "  mat4 mModelView = translate(uMVMatrix,vObjCamPos);\n";
            shader += "  mModelView = mLookAt * mModelView;\n";
        
            shader += "  gl_Position = uPMatrix * mModelView * vec4(aVertex, 1.0);\n";
            
            
            //shader += "  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);\n";
            /*
            shader += "  highp float directional = max(dot(transformedNormal.xyz, uDirectionalVector), 0.0);\n";
            if(op.fog){
                
            }
            shader += "  vLighting = uAmbientLight + (uDirectionalLightColor * directional);\n";
            
            shader += "  vSpecularColor = uSpecularColor;\n";   
            shader += "  vDiffuseColor = uDiffuseColor;\n";*/

            
            shader += "}";
            
            
            
            return shader;
        },
        createFragmentShader: function(){
            var shader = "\n";/*
            shader += "varying      highp       vec3    vLighting;\n"
            shader += "varying      highp       vec4    vDiffuseColor;\n"
            shader += "varying      highp       vec4    vSpecularColor;\n"*/
            
            shader += "void main(void) {\n";
            
            shader += "  gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);\n";
            
            shader += "}";
            return shader;
        }
        
    };
})(glQuery);