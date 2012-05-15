/*
 * Copyright 2012, Jan Jansen
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

    glQuery.object = {
        init:function(){/*
            this.objectWorker = new Worker(glQuery.options.partTo+"engine/worker/glQuery.object.worker.js");
            
            this.objectWorker.onmessage = function(event){
                switch (event.data.type){
                    case "returnObjects":
                        glQuery.selection[event.data.selector] = event.data.object;
                        glQuery.action.actionHandler(event.data.selector);
                        glQuery.animation.animationHandler(event.data.selector);
                        break;
                    case "debug":
                        log.debug(event.data.info["Cube"]);
                }
            }*/
            
        },
        
        /**
         * @function add
         * 
         * @description create the render by an event of the renderWorker
         * 
         * @param {string} id
         * @param {string} type 
         * @param {string} art 
         * @param {object} mesh 
         * @param {object} material 
         * @param {object} objectData
         * 
         */
        add:function(id,type,art,mesh,material,objectData){
            log.debug("glQuery.object.add() start");
            var self = this;
            
            var object = new NormObject(id);
            object.setType(type);
            object.setArt(art);
            object.setViewAble(true);
            object.setMvMat4(objectData.mvMat4,objectData.position);
            object.setMaterial(material);
            
            object.setShaderProgram(glQuery.shader.getShaderProgramKey(glQuery.material.createShaderOptions(material)));
            
            object.setBuffers(this.createObjectBuffers(mesh,glQuery.shader.shaders[object.shaderProgramKey]),glQuery.shader.shaders[object.shaderProgramKey]);
            
            this.objects[object.i] = object;
            log.debug("glQuery.object.add() finish");
            return true;
        },
        existId:function(id){
            if(glQuery.object.id[id] != undefined)
                return true;
            if(glQuery.light.id[id] != undefined)
                return true;
            if(glQuery.gui.id[id] != undefined)
                return true;
            return false;
        },
        createObjectBuffers:function(mesh,shader){
            var Buffers = {};
            
            
            Buffers.VerticesBuffer = glQuery.gl.createBuffer();
            glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.VerticesBuffer);
            glQuery.gl.bufferData(glQuery.gl.ARRAY_BUFFER, new Float32Array(mesh.VERTEX.vertices), glQuery.gl.STATIC_DRAW);
            
            
            
            if (shader["attribute"]["aNormal"]["location"] != -1) {
                
                Buffers.normal = glQuery.gl.createBuffer();
                glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.normal);
                glQuery.gl.bufferData(glQuery.gl.ARRAY_BUFFER, glQuery.mesh.createNormalsArray(mesh.NORMAL.indices, mesh.VERTEX.indices, mesh.NORMAL.vertices,mesh.VERTEX.vertices.length), glQuery.gl.STATIC_DRAW);
            }
            
            
            if (shader["attribute"]["aTextureCoord"]["location"] != -1) {
                Buffers.texcoord = glQuery.gl.createBuffer();
                glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.texcoord);
                glQuery.gl.bufferData(glQuery.gl.ARRAY_BUFFER, new Float32Array(mesh.TEXVOORD.vertices), glQuery.gl.STATIC_DRAW);
            }
            
            Buffers.VertexNum = mesh.VERTEX.vertices.length / 3;
            Buffers.itemSize = 3;
            Buffers.numItems = mesh.VERTEX.vertices.length / 3;
            Buffers.numIndices = mesh.VERTEX.indices.length;
            
        
            Buffers.IndexBuffer = glQuery.gl.createBuffer();
            glQuery.gl.bindBuffer(glQuery.gl.ELEMENT_ARRAY_BUFFER, Buffers.IndexBuffer);
            glQuery.gl.bufferData(glQuery.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.VERTEX.indices), glQuery.gl.STATIC_DRAW);
            
            
            return Buffers;
        },
        getObjectById:function(id,context){
        //getObjectById:function(Id,selector){ 
            /*
            glQuery.selection[selector] = [this.id[Id]];
            glQuery.action.actionHandler(selector);
            glQuery.animation.animationHandler(selector);*/
            return [this.id[id]];
        },
        getObjectByArt:function(art,context){ 
        //getObjectByArt:function(Art,selector){  
            /* 
            glQuery.selection[selector] = this.art[Art]; 
            glQuery.action.actionHandler(selector);
            glQuery.animation.animationHandler(selector);*/       
            return this.art[art];
        },
        getObjectByType:function(type,context){ 
        //getObjectByType:function(Type,selector){ 
            /*
            glQuery.selection[selector] = this.type[Type];  
            glQuery.action.actionHandler(selector);
            glQuery.animation.animationHandler(selector);*/
            return this.type[type];
        },
        duplicate:function(){},
        objectWorker:null,
        objects:[],
        type:[],
        art:[],
        id:[],
        i:0,
        camera:{}        
    };
    
    
    NormObject = function(id){
        this.id                 = 0;
        this.i                  = 0;
        this.type               = "";
        this.art                = "";
        this.buffers            = {};
        this.mesh               = {};
        this.material           = {};
        this.textures           = {};
        this.viewAble           = true;
        this.mvMat4             = mat4.create();
        this.noMat3             = mat4.create();
        this.vObjectPos         = vec3.create();
        this.scaleVec3          = vec3.create();
        this.rotateX            = 0;
        this.rotateY            = 0;
        this.rotateZ            = 0;
        this.shaderProgramKey   = -1;
        
        
        this.id             = id;
        this.i              = glQuery.object.i;
        glQuery.object.i   = glQuery.object.i + 1;
        
        glQuery.object.id[id]  = this.i;
        
        this.mvMat4         = mat4.identity(this.mvMat4); 
        
        this.setBuffers = function(buffers){
            this.buffers = buffers;
        };
        this.getBuffers = function(){
            return this.buffers;
        };
        this.setMesh = function(mesh){
            this.mesh = mesh;
        };
        this.getMesh = function(){
            return this.mes;
        };
        this.setTextures = function(textures){
            this.textures = textures;
        };
        this.getTextures = function(){
            return this.textures;
        };
        this.setMaterial = function(material){
            this.material = material;
        };
        this.getMaterial = function(){
            return this.material;
        };
        
        this.setType = function(type){
            this.type = type;
            if(!glQuery.object.type[this.type]){
                glQuery.object.type[this.type] = [];
            }
            glQuery.object.type[this.type][glQuery.object.type[this.type].length] = this.i;
        };
        this.getType = function(){
            return this.type;
        };
        
        this.setArt = function(art){
            this.art = art;
            if(!glQuery.object.art[this.art]){
                glQuery.object.art[this.art] = [];
            }
            glQuery.object.art[this.art][glQuery.object.art[this.art].length] = this.i;
        };
        this.getArt = function(){
            return this.art;
        };
        
        
        this.setViewAble = function(viewAble){
            this.viewAble = viewAble;
        };
        this.getViewAble = function(){
            return this.viewAble;
        };
        
        this.setMvMat4 = function(mvMat4,vec){
            this.vObjectPos = vec3.create(vec);
            this.mvMat4 = mat4.create(mvMat4);
            this.setNoMat3();
        };
        this.getMvMat4 = function(){
            return this.mvMat4;
        };
        this.scaleMvMat4 = function(vec){
            this.scaleVec3 = vec3.create(vec);
            this.mvMat4 = mat4.scale(this.mvMat4, vec);
            this.setNoMat3();
        };
        this.setNoMat3 = function(){
            
            this.noMat3 = mat4.toInverseMat3(this.mvMat4, this.noMat3);
            this.noMat3 = mat3.transpose(this.noMat3);            
        };
        this.setVec3ObjectPos = function(vec){
            if(!vec)
                vec = [0,0,0];
            this.mvMat4 = mat4.translate(this.mvMat4,vec3.subtract(vec, this.vObjectPos))
            this.vObjectPos = vec3.create(vec);
            this.setNoMat3();
        };
        this.translateVec3ObjectPos = function(vec){
            if(!vec)
                vec = [0,0,0];
            this.mvMat4 = mat4.translate(this.mvMat4, vec)
            this.vObjectPos = vec3.add(this.vObjectPos,vec);
            this.setNoMat3();
        };
        this.getVec3ObjectPos = function(){
            return this.vObjectPos;
        };
        this.rotateMvMat4 = function(rotateX,rotateY,rotateZ){
            this.rotateX = rotateX;
            this.rotateY = rotateY;
            this.rotateZ = rotateZ;
            this.mvMat4 = mat4.rotateX(this.mvMat4, rotateX*(Math.PI/180));
            this.mvMat4 = mat4.rotateY(this.mvMat4, rotateY*(Math.PI/180));
            this.mvMat4 = mat4.rotateZ(this.mvMat4, rotateZ*(Math.PI/180)); 
            this.setNoMat3();
        }
        this.setShaderProgram = function(key){
            this.shaderProgramKey = key;
        }
        return this;
    };
    
    NormBuffer = function(){
        this.itemSize = 3;
        
        return this;
    };

})(glQuery);