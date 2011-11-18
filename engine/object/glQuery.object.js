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
            obj.mvMatrix = mat4.create();//replace with lookat
            obj.mvMatrix = mat4.identity(obj.mvMatrix); 
            obj.mvMatrix = mat4.scale(obj.mvMatrix, colladaObject.Object.Scale);
            obj.mvMatrix = mat4.translate(obj.mvMatrix, colladaObject.Object.Translate);
            
            obj.mvMatrix = mat4.rotateX(obj.mvMatrix, colladaObject.Object.Rotate[0]);
            obj.mvMatrix = mat4.rotateY(obj.mvMatrix, colladaObject.Object.Rotate[1]);
            obj.mvMatrix = mat4.rotateZ(obj.mvMatrix, colladaObject.Object.Rotate[2]);
            delete colladaObject;
            
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
            Buffers.vPos = [1,1,1];
            Buffers.bbox = colladaObject.Vertex.bbox;
            Buffers.itemSize = 3;
            Buffers.numItems = colladaObject.Vertex.Positions.num;
            Buffers.numIndices = colladaObject.Vertex.Index["VERTEX"].length;
            
        
        
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
        i:0,
        camera:{}        
    };
    
    
    NormObject = function(id){
        this.id = id;
        this.i = glQuery.objects.i;
        glQuery.objects.i = glQuery.objects.i + 1;
        
        this.buffer = {};
        this.setBuffer = function(buffer){
            this.buffer = buffer;
        };
        this.getBuffer = function(){
            return this.buffer;
        };
        
        this.namespace = "";
        this.setNamepspace = function(namespace){
            this.namespace = namespace;
            if(this.getClass() != ""){
                glQuery.objects.objectWorker.postMessage({id:this.id,namespace:this.namespace,Class:this.Class,i:this.i});
            }
        };
        this.getNamespace = function(){
            return this.namespace;
        };
        
        this.Class = "";
        this.setClass = function(Class){
            this.Class = Class;
            if(this.getNamespace() != ""){
                glQuery.objects.objectWorker.postMessage({id:this.id,namespace:this.namespace,Class:this.Class,i:this.i});
            }
        };
        this.getClass = function(){
            return this.Class;
        };
        
        this.scenePosition = vec3.create();
        this.setPosition = function(Position){
            this.scenePosition = vec3.create(Position);
            this.mvMat4 = mat4.translate(this.mvMat4, vec3.subtract(this.scenePosition,glQuery.scene.cameraPos))
        };
        this.getPosition = function(){
            return this.scenePosition;
        };
        
        this.viewAble = true;
        this.setViewAble = function(viewAble){
            this.viewAble = viewAble;
        };
        this.getViewAble = function(){
            return this.viewAble;
        };
        
        this.mvMat4 = mat4.create();
        this.mvMat4 = mat4.identity(this.mvMat4); 
        this.setMvMat4 = function(mvMat4){
            this.mvMat4 = mat4.create(mvMat4);	
        };
        this.getMvMat4 = function(){
            return this.mvMat4;
        };
        this.scaleMvMat4 = function(vec){
            this.mvMat4 = mat4.scale(this.mvMat4, vec);
        };
        this.translateMvMat4 = function(vec){
            this.mvMat4 = mat4.translate(this.mvMat4, vec);
        };
        
        return this;
    };
    
    NormBuffer = function(){
        this.itemSize = 3;
        
        return this;
    };

})(glQuery);