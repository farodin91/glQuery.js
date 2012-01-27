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

    glQuery.objects = {
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
         * @param colladaObject object
         * @param id string
         * @param type string
         * @param art string
         * @param position object
         * 
         */
        add:function(colladaObject,id,type,art,position){
            log.debug("glQuery.objects.add() start");
            var self = this;
            
            var object = new NormObject(id);
            object.setType(type);
            object.setArt(art);
            object.setViewAble(true);
            object.setVec3ObjectPos(position)
            object.rotateMvMat4(colladaObject.Object.Rotate[0], colladaObject.Object.Rotate[1], colladaObject.Object.Rotate[2]);
            object.scaleMvMat4(colladaObject.Object.Scale);
            object.setBuffers(this.createObjectBuffers(colladaObject));
            
            this.object[(this.i-1)] = object;
            
            log.debug("glQuery.objects.add() finish");
            return true;
        },
        createObjectBuffers:function(colladaObject){
            var Buffers = {};
            
            
            Buffers.VerticesBuffer = glQuery.gl.createBuffer();
            glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.VerticesBuffer);
            glQuery.gl.bufferData(glQuery.gl.ARRAY_BUFFER, new Float32Array(colladaObject.Vertex.Positions.array), glQuery.gl.STATIC_DRAW);
            

            
            /*
            if (glQuery.webGL.aVertexNormal != -1) {
                
                Buffers.normal = glQuery.gl.createBuffer();
                glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.normal);
                glQuery.gl.bufferData(glQuery.gl.ARRAY_BUFFER, new Float32Array(colladaObject.Vertex.Normals.array), glQuery.gl.STATIC_DRAW);
                
                Buffers.NormalIndexBuffer = glQuery.gl.createBuffer();
                glQuery.gl.bindBuffer(glQuery.gl.ELEMENT_ARRAY_BUFFER, Buffers.NormalIndexBuffer);
                glQuery.gl.bufferData(glQuery.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(colladaObject.Vertex.Index["NORMAL"]), glQuery.gl.STATIC_DRAW);
            }*/
            
            /*
            if (ta != -1) {
                Buffers.texcoord = glQuery.gl.createBuffer();
                glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.texcoord);
                glQuery.gl.bufferData(glQuery.gl.ARRAY_BUFFER, new Float32Array(sf.mesh.texcoord), glQuery.gl.STATIC_DRAW);
            }*/
            
            Buffers.VertexNum = colladaObject.Vertex.Positions.num;
            Buffers.bbox = colladaObject.Vertex.bbox;
            Buffers.itemSize = 3;
            Buffers.numItems = colladaObject.Vertex.Positions.num;
            Buffers.numIndices = colladaObject.Vertex.Index["VERTEX"].length;
            
        
            Buffers.IndexBuffer = glQuery.gl.createBuffer();
            glQuery.gl.bindBuffer(glQuery.gl.ELEMENT_ARRAY_BUFFER, Buffers.IndexBuffer);
            glQuery.gl.bufferData(glQuery.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(colladaObject.Vertex.Index["VERTEX"]), glQuery.gl.STATIC_DRAW);
            
            
            return Buffers;
        },
        getObjectById:function(Id,selector){
            glQuery.selection[selector] = [this.id[Id]];
            glQuery.action.actionHandler(selector);
            glQuery.animation.animationHandler(selector);
            return true;
        },
        getObjectByArt:function(Art,selector){  
            glQuery.selection[selector] = this.art[Art]; 
            glQuery.action.actionHandler(selector);
            glQuery.animation.animationHandler(selector);       
            return true;
        },
        getObjectByType:function(Type,selector){  
            glQuery.selection[selector] = this.type[Type];  
            glQuery.action.actionHandler(selector);
            glQuery.animation.animationHandler(selector);      
            return true;
        },
        duplicate:function(){},
        objectWorker:null,
        object:[],
        type:[],
        art:[],
        id:[],
        i:0,
        camera:{}        
    };
    
    
    NormObject = function(id){
        this.id             = 0;
        this.i              = 0;
        this.type           = "";
        this.art            = "";
        this.buffers        = {};
        this.viewAble       = true;
        this.mvMat4         = mat4.create();
        this.vObjectPos      = vec3.create();
        this.scaleVec3      = vec3.create();
        this.rotateX        = 0;
        this.rotateY        = 0;
        this.rotateZ        = 0;
        
        
        this.id             = id;
        this.i              = glQuery.objects.i;
        glQuery.objects.i   = glQuery.objects.i + 1;
        
        glQuery.objects.id[id]  = this.i;
        
        this.mvMat4         = mat4.identity(this.mvMat4); 
        
        this.setBuffers = function(buffers){
            this.buffers = buffers;
        };
        this.getBuffers = function(){
            return this.buffers;
        };
        
        this.setType = function(type){
            this.type = type;
            if(!glQuery.objects.type[this.type]){
                glQuery.objects.type[this.type] = [];
            }
            glQuery.objects.type[this.type][glQuery.objects.type[this.type].length] = this.i;
        };
        this.getType = function(){
            return this.type;
        };
        
        this.setArt = function(art){
            this.art = art;
            if(!glQuery.objects.art[this.art]){
                glQuery.objects.art[this.art] = [];
            }
            glQuery.objects.art[this.art][glQuery.objects.art[this.art].length] = this.i;
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
        this.setVec3ObjectPos = function(vec){
            if(!vec)
                vec = [0,0,0];
            this.mvMat4 = mat4.translate(this.mvMat4,vec3.subtract(vec, this.vObjectPos))
            this.vObjectPos = vec3.create(vec);
        };
        this.translateVec3ObjectPos = function(vec){
            if(!vec)
                vec = [0,0,0];
            this.mvMat4 = mat4.translate(this.mvMat4, vec, dest)
            this.vObjectPos = vec3.add(this.vObjectPos,vec);
            
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
        }
        return this;
    };
    
    NormBuffer = function(){
        this.itemSize = 3;
        
        return this;
    };

})(glQuery);