/*
 * Copyright 2011, Jan Jansen
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
(function( glQuery, undefined ) {


    glQuery.webGL = {
        createWebGL:function(withOutInit){
            if(!withOutInit){
                var init = this.initWebGL();
                if(!init)
                    return false;
            
                var shader = this.initShader()
                if(!shader)
                    return false;
            
            }
            glQuery.gl.clearColor(0.0, 0.0, 0.0, 1.0);            
            glQuery.gl.viewport(0, 0, glQuery.canvasWidth, glQuery.canvasHeight);                      // Set clear color to black, fully opaque
	    glQuery.gl.clearDepth(1.0);                                                 // Clear everything
	    glQuery.gl.enable(glQuery.gl.DEPTH_TEST);                                   // Enable depth testing
	    glQuery.gl.depthFunc(glQuery.gl.LEQUAL);                                    // Near things obscure far things
    	    glQuery.gl.clear(glQuery.gl.COLOR_BUFFER_BIT|glQuery.gl.DEPTH_BUFFER_BIT);  // Clear the color as well as the depth buffer.
            return true;
        },
        initShader:function(){
            this.shader = this.getShader()
            if(!this.shader){
                return false;
            }
            this.shaderProgram = glQuery.gl.createProgram();
            glQuery.gl.attachShader(this.shaderProgram, this.shader.XVertex);
            glQuery.gl.attachShader(this.shaderProgram, this.shader.XFragment);
            glQuery.gl.linkProgram(this.shaderProgram);

            if (!glQuery.gl.getProgramParameter(this.shaderProgram, glQuery.gl.LINK_STATUS)){
                alert("Could not initialise shaders");
            }

            glQuery.gl.useProgram(this.shaderProgram);
            
            this.aVertex = glQuery.gl.getAttribLocation(this.shaderProgram, "aVertex");
            //this.aNormal = glQuery.gl.getAttribLocation(this.shaderProgram, "aNormal");

            this.mvUniform = glQuery.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
            this.pmUniform = glQuery.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
            //this.viewPositionUniform = glQuery.gl.getUniformLocation(this.shaderProgram, "uViewPosition");
            
            //this.aTexCoord0 = glQuery.gl.getAttribLocation(this.shaderProgram, "aTexCoord0");
            //this.tex0Uniform = glQuery.gl.getUniformLocation(this.shaderProgram, "uTexture0");
            //this.colorUniform = glQuery.gl.getUniformLocation(this.shaderProgram, "uColor");
            /*
            if (this.colorUniform == -1) {
                alert("Please update to a newer Firefox nightly, to pick up some WebGL API changes");
                this.colorUniform = null;
            }

            if (this.colorUniform) {
                glQuery.gl.uniform4fv(this.colorUniform, new Float32Array([0.1, 0.2, 0.4, 1.0]));
            }*/
            return true;
        },
        initWebGL:function(){
            var opt_attribs = "";
            var canvas = glQuery.canvas.replace("#","");
            canvas = document.getElementById(canvas);
            var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            glQuery.gl = null;
            for (var ii = 0; ii < names.length; ++ii) {
                try {
                    glQuery.gl = canvas.getContext(names[ii], opt_attribs);
                } catch(e) {}
                if (glQuery.gl) {
                    break;
                }
            }
            if (!glQuery.gl) {
                return false
            }    
            glQuery.gl = WebGLDebugUtils.makeDebugContext(glQuery.gl)
            return true;
        },
        getShader:function(){
            
            var shader = {};
            
            shader.XFragment = glQuery.gl.createShader(glQuery.gl.FRAGMENT_SHADER);
            shader.XVertex = glQuery.gl.createShader(glQuery.gl.VERTEX_SHADER);

            glQuery.gl.shaderSource(shader.XFragment, glQuery.shader.createFragmentShader()); //str enhält hier den kompletten Quellcode des Shaderscripts
            glQuery.gl.compileShader(shader.XFragment);
        
            glQuery.gl.shaderSource(shader.XVertex, glQuery.shader.createVertexShader()); //str enhält hier den kompletten Quellcode des Shaderscripts
            glQuery.gl.compileShader(shader.XVertex);     

            if (!glQuery.gl.getShaderParameter(shader.XFragment, glQuery.gl.COMPILE_STATUS)){
                console.log(glQuery.gl.getShaderInfoLog(shader.XFragment));
                return false;
            }
            if (!glQuery.gl.getShaderParameter(shader.XVertex, glQuery.gl.COMPILE_STATUS)){
                console.log(glQuery.gl.getShaderInfoLog(shader.XVertex));
                return false;
            }

            return shader;
        },
        getBuffer:function(){
            
        },
        setBuffer:function(){
            
        },
        setViewport:function(x1,y1,x2,y2){
            return glQuery.gl.viewport(x1, y1, x2, y2);
        },
        createScene:function(){
        // Test weitführung durch ein buffer
        
        },
        options:{
            
        },
        aVertex:null,
        aNormal:null,
        aTexCoord0:null,
        mvUniform:null,
        pmUniform:null,
        tex0Uniform:null,
        viewPositionUniform:null,
        colorUniform:null,
        shaderProgram:null
    };
})(glQuery );