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
        /**
         * @function add
         * 
         * @description create the render by an event of the renderWorker
         * 
         * @param colladaObject boolean
         * @param Id boolean
         * @param type boolean
         * 
         */
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
            

            
            
            if (glQuery.webGL.aVertexNormal != -1) {
                Buffers.normal = glQuery.gl.createBuffer();
                glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.normal);
                glQuery.gl.bufferData(glQuery.gl.ARRAY_BUFFER, new Float32Array(colladaObject.Vertex.Normals.array), glQuery.gl.STATIC_DRAW);
                Buffers.NormalIndexBuffer = glQuery.gl.createBuffer();
                glQuery.gl.bindBuffer(glQuery.gl.ELEMENT_ARRAY_BUFFER, Buffers.NormalIndexBuffer);
                glQuery.gl.bufferData(glQuery.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(colladaObject.Vertex.Index["NORMAL"]), glQuery.gl.STATIC_DRAW);
            }
            
            /*
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
        this.id             = 0;
        this.i              = 0;
        this.type           = "";
        this.art            = "";
        this.buffer         = {};
        this.viewAble       = true;
        this.scenePosition  = vec3.create();
        this.mvMat4         = mat4.create();
        this.translateVec3  = vec3.create();
        this.scaleVec3      = vec3.create();
        this.rotateX        = 0;
        this.rotateY        = 0;
        this.rotateZ        = 0;
        
        this.id             = id;
        this.i              = glQuery.objects.i;
        glQuery.objects.i   = glQuery.objects.i + 1;
        this.mvMat4         = mat4.identity(this.mvMat4); 
        
        this.setBuffer = function(buffer){
            this.buffer = buffer;
        };
        this.getBuffer = function(){
            return this.buffer;
        };
        
        this.setType = function(type){
            this.type = type;
            if(this.getArt() != ""){
                glQuery.objects.objectWorker.postMessage({
                    id:this.id,
                    type:this.type,
                    art:this.art,
                    i:this.i,
                    action:"add"
                });
            }
        };
        this.getType = function(){
            return this.type;
        };
        
        this.setArt = function(Class){
            this.Class = Class;
            if(this.getType() != ""){
                glQuery.objects.objectWorker.postMessage({
                    id:this.id,
                    type:this.type,
                    art:this.art,
                    i:this.i,
                    action:"add"
                });
            }
        };
        this.getArt = function(){
            return this.art;
        };
        
        this.setPosition = function(Position){
            this.scenePosition = vec3.create(Position);
        //this.mvMat4 = mat4.translate(this.mvMat4, vec3.subtract(this.scenePosition,glQuery.scene.cameraPos))
        };
        this.getPosition = function(){
            return this.scenePosition;
        };
        
        this.setViewAble = function(viewAble){
            this.viewAble = viewAble;
        };
        this.getViewAble = function(){
            return this.viewAble;
        };
        
        this.setMvMat4 = function(mvMat4){
            this.mvMat4 = mat4.create(mvMat4);	
        };
        this.getMvMat4 = function(){
            return this.mvMat4;
        };
        this.scaleMvMat4 = function(vec){
            this.scaleVec3 = vec3.create(vec);
            this.mvMat4 = mat4.scale(this.mvMat4, vec);
        };
        this.translateMvMat4 = function(vec){
            this.translateVec3 = vec3.create(vec);
            this.mvMat4 = mat4.translate(this.mvMat4, vec);
        };
        this.rotateMvMat4 = function(rotateX,rotateY,rotateZ){
            this.rotateX = rotateX;
            this.rotateY = rotateY;
            this.rotateZ = rotateZ;
            this.mvMat4 = mat4.rotateX(this.mvMat4, rotateX);
            this.mvMat4 = mat4.rotateY(this.mvMat4, rotateY);
            this.mvMat4 = mat4.rotateZ(this.mvMat4, rotateZ);            
        }
        return this;
    };
    
    NormBuffer = function(){
        this.itemSize = 3;
        
        return this;
    };

})(glQuery);