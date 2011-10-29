/*
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
        createRender:function(first){
            var self = this;
            if(first){
                this.showFramerate();
            }
            this.enableRender = false;
            
            glQuery.renderWorker.onmessage =function(event){
                if(event.data && !self.enableRender){
                    
                    self.enableRender = true;
                    log.debug("glQuery.scene.createRender() => init the render loop");
                    self.render();
                }else{
                    self.enableRender = false;
                    
                }
            }
        },
        createBuffer:function(){
            
        },
        render:function(){
            var self = this;
            this.startFrameTime = new Date().getTime();
            this.moveCamera();
            this.makePerspective();            
            
            glQuery.gl.clear(glQuery.gl.COLOR_BUFFER_BIT | glQuery.gl.DEPTH_BUFFER_BIT);
            $.each(glQuery.objects.object,function(key){
                self.drawObject(glQuery.objects.object[key]);
            })
            this.endFrameTime = new Date().getTime();
            this.createFramerate();
            
            this.setFramerate(this.framerate);
            if(this.enableRender){
                //this.render();
            }
            return true;
        },
        drawObject:function(ElementObject){
            
            var Buffers = ElementObject.Buffers;            
            log.debug("glQuery.scene.drawObject() start");
            
            glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.VerticesBuffer);
            glQuery.gl.vertexAttribPointer(glQuery.webGL.aVertex, Buffers.itemSize, glQuery.gl.FLOAT, false, 0, 0);
            glQuery.gl.enableVertexAttribArray(glQuery.webGL.aVertex);
            
            if (glQuery.webGL.aNormal != -1) {
                glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.normal);
                glQuery.gl.vertexAttribPointer(glQuery.webGL.aNormal, Buffers.itemSize, glQuery.gl.FLOAT, false, 0, 0);
                glQuery.gl.enableVertexAttribArray(glQuery.webGL.aNormal);     
            }
            
            glQuery.gl.bindBuffer(glQuery.gl.ELEMENT_ARRAY_BUFFER, Buffers.IndexBuffer);  
            
            glQuery.gl.uniformMatrix4fv(glQuery.webGL.mvUniform, false, ElementObject.mvMatrix);
            glQuery.gl.uniformMatrix4fv(glQuery.webGL.pmUniform, false, this.pmMatrix);
            
            
    
            //gl.drawElement();
            glQuery.gl.drawArrays(glQuery.gl.TRIANGLES,0,Buffers.VertexNum);
            log.debug("glQuery.scene.drawObject() end");
        },
        moveCamera:function(){
            
        },
        makePerspective:function(){
            this.pmMatrix = mat4.create();
            mat4.perspective(45, (glQuery.canvasWidth/glQuery.canvasHeight), 0.1, 100, this.pmMatrix);
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
            if(frames >= 500){
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