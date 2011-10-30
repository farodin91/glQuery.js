/*
 * Copyright 2011, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.object.js
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
 *	glQuery.webgl.js
 *	glQuery.animation.js
 *	glQuery.physics.js
 *	glQuery.textures.js
 */
(function( glQuery, undefined ) {

    glQuery.objects = {
        init:function(){
            
        },
        add:function(colladaObject,Id,type){
            log.debug("glQuery.objects.add() start");
            var self = this;
            var obj = {};
            obj.Buffers = this.createObjectBuffer(colladaObject);
            obj.Id = Id;
            obj.Show = true;
            obj.Find = true;
            obj.mvMatrix = mat4.create();
            mat4.scale(obj.mvMatrix, [1, 1, 1]);
            
            delete colladaObject;
            obj.position = vec3.create([0,0,0]);
            this.object[Id]= obj;
            log.debug("glQuery.objects.add() finish");
            return true;
        },
        createObjectBuffer:function(colladaObject){
            var Buffers = {};
            
            
            Buffers.VerticesBuffer = glQuery.gl.createBuffer();
            glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.VerticesBuffer);
            glQuery.gl.bufferData(glQuery.gl.ARRAY_BUFFER, new Float32Array(colladaObject.Vertex.Positions.array), glQuery.gl.STATIC_DRAW);
            

            
            /*
            if (glQuery.webGL.aNormal != -1) {
                Buffers.normal = glQuery.gl.createBuffer();
                glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.normal);
                glQuery.gl.bufferData(glQuery.gl.ARRAY_BUFFER, new Float32Array(colladaObject.Vertex.Normals.array), glQuery.gl.STATIC_DRAW);

            }
            
            if (ta != -1) {
                Buffers.texcoord = glQuery.gl.createBuffer();
                glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.texcoord);
                glQuery.gl.bufferData(glQuery.gl.ARRAY_BUFFER, new Float32Array(sf.mesh.texcoord), glQuery.gl.STATIC_DRAW);
            }*/
            
            Buffers.VertexNum = colladaObject.Vertex.Positions.num
            Buffers.vPos = [0,0,0];
            Buffers.bbox = colladaObject.Vertex.bbox;
            Buffers.itemSize = 3;
            Buffers.numItems = colladaObject.Vertex.Positions.num;
        
        
            Buffers.IndexBuffer = glQuery.gl.createBuffer();
            glQuery.gl.bindBuffer(glQuery.gl.ELEMENT_ARRAY_BUFFER, Buffers.IndexBuffer);
            glQuery.gl.bufferData(glQuery.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(colladaObject.Vertex.Index["VERTEX"]), glQuery.gl.STATIC_DRAW);
            
            
            return Buffers;
        },
        getObjectById:function(Id){
            
            return this.object[Id];
        },
        duplicate:function(){},
        objectWorker:null,
        object:{},
        camera:{}        
    };

})(glQuery );