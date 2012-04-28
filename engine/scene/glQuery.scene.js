/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.scene.js
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
 *	glQuery.events.js
 *	glQuery.math.js
 *	glQuery.webgl.js
 *	glQuery.animation.js
 *	glQuery.object.js
 *	glQuery.physics.js
 *	glQuery.textures.js
 */


// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

( function () {

	var lastTime = 0;
	var vendors = [ 'ms', 'moz', 'webkit', 'o' ];

	for ( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++ x ) {

		window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
		window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];

	}

	if ( !window.requestAnimationFrame ) {

		window.requestAnimationFrame = function ( callback, element ) {

			var currTime = Date.now(), timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
			var id = window.setTimeout( function() { callback( currTime + timeToCall ); }, timeToCall );
			lastTime = currTime + timeToCall;
			return id;

		};

	}


	if ( !window.cancelAnimationFrame ) {

		window.cancelAnimationFrame = function ( id ) { clearTimeout( id ); };

	}

}() );

(function( glQuery, undefined ) {

    glQuery.scene = {
        /**
         * @function createRender
         * 
         * @description create the render by an event of the renderWorker
         * 
         * @param first boolean
         * 
         */
        createRender:function(first){
            var self = this;
            if(first){
                this.showFramerate();
            }
            this.enableRender = false;
            
            glQuery.renderWorker.onmessage = function(event){
                if(event.data){
                    glQuery.camera.cameraMatrix(true);
                    this.tenthRendering = 0;
                    log.debug("glQuery.scene.createRender() => init the render loop");
                    
                    self.renderLoop();
                }
            }
        },
        renderLoop:function(resize){
            window.requestAnimationFrame(glQuery.scene.renderLoop);
            if(glQuery.allowrender)
                glQuery.scene.render();
        },
        /**
         * @function render
         * 
         * @description Render the scene 
         * 
         */
        render:function(){
            this.tenthRendering = this.tenthRendering+1;
            if(this.tenthRendering == 10){
                log.profile("glQuery.scene.render()");
            }
            var self = this;
            glQuery.gl.clear(glQuery.gl.COLOR_BUFFER_BIT | glQuery.gl.DEPTH_BUFFER_BIT);
            glQuery.gl.clearColor(1.0, 1.0, 1.0, 1.0);
            for(var key in glQuery.object.objects){
                this.drawObject(glQuery.object.objects[key]);
            }
            this.renderHud();
            if(this.tenthRendering == 10){
                log.profile("glQuery.scene.render()");
            }
            this.endFrameTime = new Date().getTime();
            this.createFramerate();
            this.startFrameTime = new Date().getTime();
            
            this.setFramerate(this.framerate);
            
        },
        /**
         * @function drawObject
         * 
         * @description draw Object with element data
         * 
         * @param {object} Object 
         * 
         */
        drawObject:function(Object){
            if(this.tenthRendering == 10){
                log.profile("glQuery.scene.drawObject()");
            }
            var shader = glQuery.shader.shaders[Object.shaderProgramKey];
            if(this.useProgram != Object.shaderProgramKey){
                glQuery.gl.useProgram(shader["shaderProgram"]);
                this.useProgram = Object.shaderProgramKey;
                glQuery.camera.uniformCamera(shader);
                glQuery.light.uniformLighting(shader);
            }
            
            // Hintergrund loeschen
            
            
            var Buffers = Object.buffers;
            
            if (shader["attribute"]["aNormal"]["location"] != -1) {
                glQuery.gl.disableVertexAttribArray(shader["attribute"]["aNormal"]["location"]);
                glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.normal);
                glQuery.gl.vertexAttribPointer(shader["attribute"]["aNormal"]["location"], Buffers.itemSize, glQuery.gl.FLOAT, false, 0, 0);
                glQuery.gl.enableVertexAttribArray(shader["attribute"]["aNormal"]["location"]);
            }
            if(shader["attribute"]["aTextureCoord"]["location"] != -1){
                glQuery.gl.disableVertexAttribArray(shader["attribute"]["aTextureCoord"]["location"]);
                glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.texcoord);
                glQuery.gl.vertexAttribPointer(shader["attribute"]["aTextureCoord"]["location"], 2, glQuery.gl.FLOAT, false, 0, 0);
                glQuery.gl.enableVertexAttribArray(shader["attribute"]["aTextureCoord"]["location"]);
                
            }
            if(shader["attribute"]["aVertex"]["location"] != -1){
                glQuery.gl.disableVertexAttribArray(shader["attribute"]["aVertex"]["location"]);
                glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.VerticesBuffer);
                glQuery.gl.vertexAttribPointer(shader["attribute"]["aVertex"]["location"], Buffers.itemSize, glQuery.gl.FLOAT, false, 0, 0);
                glQuery.gl.enableVertexAttribArray(shader["attribute"]["aVertex"]["location"]);
                
            }
            
            
            glQuery.gl.uniformMatrix4fv(shader["uniforms"]["common_vertex"]["uModelViewMatrix"]["location"], false, Object.mvMat4);
            glQuery.gl.uniformMatrix4fv(shader["uniforms"]["common_vertex"]["uModelWorldMatrix"]["location"], false, mat4.identity());//Noch nicht implemtiert
            
            glQuery.material.uniformMaterial(shader, Object.material);
            /*
            switch (Object.mesh.drawType){
                
            }*/
            
            glQuery.gl.bindBuffer(glQuery.gl.ELEMENT_ARRAY_BUFFER, Buffers.IndexBuffer); 
            glQuery.gl.drawElements(glQuery.gl.TRIANGLES, Buffers.numIndices , glQuery.gl.UNSIGNED_SHORT, 0);
            if(this.tenthRendering == 10){
                log.profile("glQuery.scene.drawObject()");
                
            }
        },
        renderHud:function(){
            
        },
        setLighting:function(){
            glQuery.gl.uniform3fv(glQuery.webGL.uAmbientLight, new Float32Array([0.3, 0.3, 0.3])); 
        //glQuery.gl.uniform3fv(glQuery.webGL.uDirectionalLightColor, new Float32Array([0, 0, 0])); 
        //glQuery.gl.uniform3fv(glQuery.webGL.uDirectionalVector, new Float32Array([0.85, 0.8, 0.75])); 
        },
        moveCamera:function(){
            this.mLookAt = glQuery.camera.lookAt;
        //this.mLookAt = mat4.lookAt(this.vCamPos, this.vLookAt, [0,1,0])
        },
        makePerspective:function(){
            this.pmMatrix = mat4.create();
            this.pmMatrix = mat4.perspective(60, (glQuery.canvasWidth/glQuery.canvasHeight), 0.1, 100, this.pmMatrix);
        //this.pmMatrix = mat4.lookAt([0,0,0], [0,0, -6], [0,1,0], this.pmMatrix);
        },
        renderAnimation:function(object){
            return object
        },
        renderPhysics:function(object){
            return object
        },
        getFramerate:function(){
            return this.framerate;
        },
        setFramerate:function(frames){
            if(this.lastFramerates.length != 29){
                this.lastFramerates[this.lastFramerates.length]=frames;
            }
            for(var i = 0;i < 29;i++){
                frames = frames + this.lastFramerates[i];
            }
            frames = frames/30;
            frames = Math.round(frames);
            if(frames >= 200){
                $("#framerate").html("Framerate: infinity")
                return true;
            }else if(frames <= 20){
                $("#framerate").html("Framerate: NaN")
                return true;                
            }
            $("#framerate").html("Framerate: " + frames + "fps")
            return true;
        },
        showFramerate:function(){
            $("body").append($("<div>").attr({
                "id":"framerate",
                "class":"ui-corner-all ui-widget-content ui-widget"
            }).html("Framerate: NAN"))
            return true;
        },
        createFramerate:function(){
            
            var diff = this.endFrameTime - this.startFrameTime;
            this.framerate = Math.round(1000/diff);
            return this.framerate;
        },
        useProgram:-1,
        tenthRendering:0,
        mvUniform:null,
        pmMatrix:null,
        vCamPos:[0,7,1],
        vLookAt:[0,0,-1],
        mLookAt:null,
        lastFramerates:[],
        renderObjects:[],
        renderObjectslength:0,
        createNewRenderObjects:true,
        enableRender:true,
        startFrameTime:0,
        endFrameTime:0,
        framerate:0,
        lastShowTimeFramerate:0
    };
})(glQuery );