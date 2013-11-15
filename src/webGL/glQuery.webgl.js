/*
 * Copyright 2013, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.webgl.js
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
 *	glQuery.events.js
 *	glQuery.math.js
 *	glQuery.animation.js
 *	glQuery.object.js
 *	glQuery.physics.js
 *	glQuery.textures.js
 */
(function( glQuery ,WebGLDebugUtils , undefined ) {

    glQuery.webGL = {
        createWebGL:function(withOutInit){
            glQuery.progressBarStep("createwebgl",2);
            if(!withOutInit){
                var init = this.initWebGL();
                if(!init){
                    return false;
                }
            }
            glQuery.gl.clearColor(1.0, 1.0, 1.0, 1.0);            
            glQuery.gl.viewport(0, 0, glQuery.canvasWidth, glQuery.canvasHeight);       // Set clear color to black, fully opaque
            glQuery.gl.clearDepth(1.0);                                                 // Clear everything
            glQuery.gl.enable(glQuery.gl.DEPTH_TEST);                                   // Enable depth testing
            glQuery.gl.depthFunc(glQuery.gl.LEQUAL);                                    // Near things obscure far things
            glQuery.gl.clear(glQuery.gl.COLOR_BUFFER_BIT|glQuery.gl.DEPTH_BUFFER_BIT);  // Clear the color as well as the depth buffer.
            glQuery.progressBarStep("createwebgl",8);
            
            return true;
        },
        initWebGL:function(){
            var canvas = glQuery.options.id;
            canvas = document.getElementById(canvas);
            var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            glQuery.gl = null;
            for (var i = 0; i < names.length; ++i) {
                try {
                    glQuery.gl = canvas.getContext(names[i]);
                } catch(e) {}
                if (glQuery.gl) {
                    break;
                }
            }
            if (!glQuery.gl) {
                return false;
            }
            if(glQuery.options.debug){
                glQuery.gl = WebGLDebugUtils.makeDebugContext(glQuery.gl);                
            }
            return true;
        },
        createScene:function(){
            
        },
        options:{
            fog:false
        }
    };
})(glQuery,WebGLDebugUtils );