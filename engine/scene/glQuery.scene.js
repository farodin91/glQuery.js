/*
 * Copyright 2011, Jan Jansen
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
            
            glQuery.renderWorker.onmessage =function(event){
                if(event.data && !self.enableRender){
                    
                    self.enableRender = true;
                    this.meineCanvas = document.getElementById("WebGL-canvas");

                    log.debug("glQuery.scene.createRender() => init the render loop");
                    self.renderLoop();
                }else{
                    self.enableRender = false;
                    
                }
            }
        }, 
        createRenderBuffer:function(){
            
        },
        renderLoop:function(){
            setTimeout("glQuery.scene.renderLoop()",20);
            if(glQuery.allowrender)
                glQuery.scene.render();
        },
        requestAnimationFrame : window.requestAnimationFrame || window.mozRequestAnimationFrame ||  
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
        /**
         * @function render
         * 
         * @description Render the scene 
         * 
         */
        render:function(){
            var self = this;
            
            this.moveCamera();
            this.makePerspective();
            // Hintergrund loeschen
            glQuery.gl.clearColor(1.0, 1.0, 1.0, 1.0);  
            glQuery.gl.clear(glQuery.gl.COLOR_BUFFER_BIT | glQuery.gl.DEPTH_BUFFER_BIT);
            
            glQuery.gl.uniformMatrix4fv(glQuery.webGL.pmUniform, false, this.pmMatrix);  
            glQuery.gl.uniformMatrix4fv(glQuery.webGL.mLookAt, false, this.mLookAt);   

            glQuery.gl.uniform3fv(glQuery.webGL.vCamPos, new Float32Array(this.vCamPos)); 
            //glQuery.gl.uniform3fv(glQuery.webGL.vLookAt, new Float32Array(this.vLookAt));          
            
            for(var key in glQuery.objects.object){
                self.drawObject(glQuery.objects.object[key]);
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
         * @param ElementObject object
         * 
         */
        drawObject:function(ElementObject){
            
            var Buffers = ElementObject.buffers;
            /*
            if (glQuery.webGL.aVertexNormal != -1) {
                glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.normal);
                glQuery.gl.vertexAttribPointer(glQuery.webGL.aVertexNormal, Buffers.itemSize, glQuery.gl.FLOAT, false, 0, 0);
                glQuery.gl.enableVertexAttribArray(glQuery.webGL.aVertexNormal);
                
                glQuery.gl.bindBuffer(glQuery.gl.ELEMENT_ARRAY_BUFFER, Buffers.NormalIndexBuffer);
                glQuery.gl.uniformMatrix4fv(glQuery.webGL.mvUniform, false, ElementObject.nMatrix);
            }*/
            
            glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.VerticesBuffer);
            glQuery.gl.vertexAttribPointer(glQuery.webGL.aVertex, Buffers.itemSize, glQuery.gl.FLOAT, false, 0, 0);
            
            glQuery.gl.enableVertexAttribArray(glQuery.webGL.aVertex);
            
            
            glQuery.gl.bindBuffer(glQuery.gl.ELEMENT_ARRAY_BUFFER, Buffers.IndexBuffer); 
            
            glQuery.gl.uniformMatrix4fv(glQuery.webGL.mvUniform, false, ElementObject.mvMat4);
            glQuery.gl.uniform3fv(glQuery.webGL.vObjectPos, ElementObject.vObjectPos);   
            
            glQuery.gl.drawElements(glQuery.gl.TRIANGLES, Buffers.numIndices , glQuery.gl.UNSIGNED_SHORT, 0);
        },
        moveCamera:function(){
            this.mLookAt = mat4.create();
            this.mLookAt = mat4.identity(this.mLookAt);
            this.mLookAt = mat4.lookAt(this.vCamPos, this.vLookAt, [0,1,0], this.mLookAt)
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
            if(this.lastFramerates.length != 59){
                this.lastFramerates[this.lastFramerates.length]=frames;
            }
            for(var i = 0;i < 59;i++){
                frames = frames + this.lastFramerates[i];
            }
            frames = frames/60;
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
        mvUniform:null,
        pmMatrix:null,
        vCamPos:[0,0,0],
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
var renderLoop = function(){
    
}
