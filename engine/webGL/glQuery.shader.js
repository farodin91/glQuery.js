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
            shader = "\n";
            shader += "attribute vec3 aVertex;\n";

            shader += "uniform mat4 uPMatrix;\n";
            shader += "uniform mat4 uMVMatrix;\n";

            shader += "void main(void) {\n";
            
            shader += "  gl_Position = uPMatrix * uMVMatrix * vec4(aVertex, 1.0);\n";

            
            shader += "}";
            
            
            op = glQuery.webGL.options;
            if(op){
                
            }
            return shader;
        },
        createFragmentShader: function(){
            shader = "\n";
            shader += "void main(void) {\n";
            shader += "  gl_FragColor = vec4(0.8, 0.8, 0.8, 0.8);\n";
            shader += "}";
            return shader;
        }
        
    };
})(glQuery);