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
            glQuery.gl.clearColor(1.0, 1.0, 1.0, 1.0);            
            glQuery.gl.viewport(0, 0, glQuery.canvasWidth, glQuery.canvasHeight);       // Set clear color to black, fully opaque
	    glQuery.gl.clearDepth(1.0);                                                 // Clear everything
	    glQuery.gl.enable(glQuery.gl.DEPTH_TEST);                                   // Enable depth testing
	    glQuery.gl.depthFunc(glQuery.gl.LEQUAL);                                    // Near things obscure far things
    	    glQuery.gl.clear(glQuery.gl.COLOR_BUFFER_BIT|glQuery.gl.DEPTH_BUFFER_BIT);  // Clear the color as well as the depth buffer.
            return true;
        },
        initShader:function(){
            
            log.profile("glQuery.webGL.initShader() 1");
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
            
            this.aVertex                = glQuery.gl.getAttribLocation(this.shaderProgram, "aVertex");
            this.aVertexNormal          = glQuery.gl.getAttribLocation(this.shaderProgram, "aVertexNormal");

            this.mvUniform              = glQuery.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
            this.pmUniform              = glQuery.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
            this.uNormalMatrix          = glQuery.gl.getUniformLocation(this.shaderProgram, "uNormalMatrix");
            
            this.mLookAt                = glQuery.gl.getUniformLocation(this.shaderProgram, "mLookAt");
            
            
            this.uAmbientLight          = glQuery.gl.getUniformLocation(this.shaderProgram, "uAmbientLight");
            this.uDirectionalLightColor = glQuery.gl.getUniformLocation(this.shaderProgram, "uDirectionalLightColor");
            this.uDirectionalVector     = glQuery.gl.getUniformLocation(this.shaderProgram, "uDirectionalVector");
            
            //this.uSpecularColor         = glQuery.gl.getUniformLocation(this.shaderProgram, "uSpecularColor");
            //this.uDiffuseColor          = glQuery.gl.getUniformLocation(this.shaderProgram, "uDiffuseColor");
            log.profile("glQuery.webGL.initShader() 1");
            
            return true;
        },
        initWebGL:function(){
            var opt_attribs = "";
            var canvas = glQuery.options.id;
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
            if(glQuery.options.debug){
                glQuery.gl = WebGLDebugUtils.makeDebugContext(glQuery.gl);                
            }
            return true;
        },
        getShader:function(){
            
            var shader = {};
            log.profile("glQuery.webGL.getShader() 1");
            
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
            log.profile("glQuery.webGL.getShader() 1");

            return shader;
        },
        setViewport:function(x1,y1,x2,y2){
            return glQuery.gl.viewport(x1, y1, x2, y2);
        },
        createScene:function(){
        // Test weitführung durch ein buffer
        
        },
        options:{
            fog:false
        },
        aVertex:null,
        aVertexNormal:null,
        
        mvUniform:null,
        pmUniform:null,
        uNormalMatrix:null,
        
        mLookAt:null,
        
        uAmbientLight:null,
        uDirectionalLightColor:null,
        uDirectionalVector:null,
        
        uSpecularColor:null,
        uDiffuseColor:null,
        
        shaderProgram:null
    };
})(glQuery );