/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.core.js
 *@author Jan Jansen - farodin91@googlemail.com
 *@description Coming soon
 *
 * 
 *@roadmap
 *      0.1 the frame -> finished
 *      0.2 event,action,animation -> alpha -> beta
 *      0.3 lighting,texures -> start
 *      0.4 hud,paticles,collada-update
 *      0.5 shadow,fog
 *      
 * Depends:
 *	jquery.1.7.1.js
 *	gl-matrix.js
 *
 *
 **/



(function( window) {
    window.glQuery  = function(selector,context){
        return new glQuery.fn.init(selector,context);
    }

    glQuery.prototype = glQuery.fn = {
        version : "",
        init: function(selector,context) {
            $.extend(this,glQuery.fn);
            var self = this;/*
            if(glQuery.selection[selector]){
                
            }else{*/
            this.selector = selector;
            //glQuery.selection[selector] = [];                
            
            if ( !selector ) {
                this.selector= "all";
                return this;
            }else{
                this.type = selector.match(glQuery.fn.match.TYPE);
                if(this.type){
                    this.type = this.type[1];
                    switch(this.type){
                        case "object":
                            this.objects = glQuery.object.objects;
                            break;
                        case "camera":
                            break;
                        case "light":
                            break;
                        default:
                            this.objects = glQuery.object.objects;
                            break;
                    }
                    
                }
                
                this.art = selector.match(glQuery.fn.match.ART);
                if(this.art){
                    this.objects = glQuery.object.getObjectByArt(this.art[1]);
                    this.art = this.art[1];
                        
                }
                
                this.id = selector.match(glQuery.fn.match.ID);
                if(this.id){
                    this.objects = glQuery.object.getObjectById(this.id[1]);
                    this.id = this.id[1];
                }
                        
                
                
                return this;
            }
            //}
            return this;
        },
        /**
         * @function light
         * 
         * @description 
         * 
         * @param type string
         * @param rgb string
         * @param intensity 
         * @param distance 
         * @param castShadow 
         * 
         */
        light:function(type, rgb, intensity, distance, castShadow){
            
            return this;            
        },
        camera:function(type, near, far){
            glQuery.camera.add(type,this.art,this.id, near, far);
            this.orthographic = function(left, right, bottom, top){
                
            }
            this.perspective = function(fovy){
                
            }
            return this;
        },
        /**
         * @function bind
         * 
         * @description bind an event on an object
         * 
         * @param type object,string
         * @param callback
         * 
         */
        bind:function(type,callback){//Muss überarbeitet werden
            var self = this;
            if(!callback){
                if(typeof type === "object"){
                    $.each(type,function(value){
                        if(!value.callback){
                            return glQuery.event.trigger(value.type,self.objects,false,{});    
                        }else{
                            glQuery.event[value.type].i= glQuery.event[value.type].i++;
                            glQuery.event[value.type][glQuery.event[value.type].i]= {
                                obj:self.id,
                                callback:value.callback
                            };
                            return self;                        
                        }
                    })
                    
                }else{
                    return this;    
                }
            }else{
                glQuery.event[type].i= glQuery.event[type].i++;
                glQuery.event[type][glQuery.event[type].i]= {
                    obj:this.objects,
                    callback:callback
                };
                return this;
            }
            return this;
        },

        click:function(callback){
            return this.bind("click", callback);
        },
        near:function(callback){
            return this.bind("near", callback);
        },
        move:function(endVector,during,easing,callback){
            if(!during)
                return this.bind("move", callback);
            glQuery.animation.createAnimationHandler(this.objects,{
                "action":"move",
                "end":endVector
            }, during, easing, callback)
            
            return this;
        },
        collision:function(callback){
            return this.bind("collision", callback);
        },
        touch:function(callback){
            return this.bind("touch", callback);
        },
        
        /**
         * @function copyTranslate
         * 
         * @description
         * 
         * @param object (glQuery) -> for example glQuery("#cube")
         * @param distance (vec3) -> vector to the object that is tracked
         * 
         **/
        copyTranslate:function(object,distance){
            return this;
        },
        /**
         * @function lookAt
         * 
         * @description
         * 
         * @param object (glQuery) -> for example glQuery("#cube")
         * @param front (vec3) -> vector for the site default [0,0,1]
         * 
         **/
        lookAt:function(object,front){
            return this;            
        },
        /**
         * @function rotate
         * 
         * @description Rotate the given objects by angle and axis
         * 
         * @param angle (float) -> sets the angle rotation
         * @param axis (vec3) -> for example [0,1,0]
         * @param during (int) -> time for rotation, default:400
         * @param easing (string) -> linear or swing for example
         * @param callback (function) -> return when finish
         * 
         **/
        rotate:function(angle,axis,during,easing,callback){
            if(!axis)
                return this.bind("rotate", callback);
            glQuery.animation.createAnimationHandler(this.objects,{
                "action":"rotate",
                "end":angle,
                "axis":axis
            }, during, easing, callback);
            return this;
        },
        translate:function(v3Translate){
            if(!v3Translate){
                return this;
            }else{
                glQuery.action.createActionHandler("translatePosition",v3Translate,this.objects);
                return this;
            }
        },
        position:function(v3Position){
            if(!v3Position){
                return glQuery.objects.getPosition(this.selector);
            }else{
                glQuery.action.createActionHandler("setPosition",v3Position,this.objects);
                return this;
            }
        },
        animate:function(data,during,easing,callback){
            if(!during){
                return this.bind("animation", data)
            }else{
                glQuery.animation.createAnimationHandler(this.objects,data,during,easing,callbeck);
                return this;
            }
        },
        match:{
            ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            ART: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            PART: /\[part=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
            TYPE: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/
        }
    };
    
    jQuery(document).ready(function(){
        var debug = $("canvas[type='glQuery']").attr("debug");
        var fullscreen = $("canvas[type='glQuery']").attr("fullscreen");
        var framerate = $("canvas[type='glQuery']").attr("framerate");
        var partTo = $("canvas[type='glQuery']").attr("partTo");
        var scene = $("canvas[type='glQuery']").attr("scene");
        var width = $("canvas[type='glQuery']").attr("width");
        var height = $("canvas[type='glQuery']").attr("height");
        var id = $("canvas[type='glQuery']").attr("id");
            
        glQuery.create({
            debug:debug,
            fullscreen:fullscreen,
            framerate:framerate,
            partTo:partTo,
            scene:scene,
            width:width,
            height:height,
            id:id
        })
    })
    
    /**
     * @function Create
     * 
     * @description cooming soon
     * 
     * @param options object
     * 
     */
    glQuery.create = function(options){
        log.profile("glQuery.create() 1");
        jQuery.extend(this.options,options);
        
        this.renderWorker = new Worker(this.options.partTo+"engine/worker/glQuery.render.worker.js");
        this.imageWorker = new Worker(this.options.partTo+"engine/worker/glQuery.image.worker.js");
        glQuery.objects.init();
        
        this.imageWorker.onmessage = function(event){
            if(event.data){
                glQuery.event.trigger("ready", "undefined", true, glQuery)
            }
        }
        
        
        this.canvas = "#"+this.options.id;
        this.options.scene = this.options.scene;
        var self = this;
        var full = this.options.fullscreen;
        if(full){
            this.fullscreen();
        }else{
            this.canvasHeight = this.options.height;
            this.canvasWidth = this.options.width;
            this.setHeight();
            this.setWidth();
        }
        
        log.profile("glQuery.create() 1");  
        log.profile("glQuery.create() 2");  
        var initWeb = glQuery.webGL.createWebGL();
        log.profile("glQuery.create() 2");
        if(initWeb){
            var extension = this.fileType(this.options.scene);
            switch(extension){
                case "dae":
                    glQuery.collada.scene.parse(this.options.scene);
                    break;
                case "xml":
                    this.addFileMap();
                    glQuery.camera.add("perspective", "cam", "test_cam", 0.1, 100);
                    break;
                case "blend":
                default:
                    log.error("File extension not supported!");
                    break;
            }
                    
            glQuery.scene.createRender(true);
        }else{
            log.error("Failed to create Webgl")
        }
                          
            
    };
    glQuery.fileType = function(file_name){
        var extension = file_name.split('.');
        extension = extension[extension.length - 1];
        return extension;
    }
    glQuery.createGrid = function(){
        
    }
    glQuery.stop = function(){
        this.allowrender = false;
    }
    glQuery.run = function(){
        this.allowrender = true;
    }
    glQuery.ready = function(callback){
        glQuery.event.add("ready", "undefined", callback)
            
    };
    
    glQuery.options = {
        partTo:"glQuery.js/",
        width:800,
        height:500,
        fullscreen:false,
        debug:false
    }
    
    glQuery.collections = {
        
    }
    glQuery.add = function(id,file,type,art){
        this.collada.getFile(file,id,function(colladaObject){
            glQuery.object.add(colladaObject,id, type,art,colladaObject.Object.Translate);
        })
    }
    
    glQuery.addFileMap = function(){
        log.debug("glQuery.addFileMap()");
        var self = this;
            
        $.ajax({
            url:this.options.scene,
            dataType:"text xml",
            error:function(){},
            success:function(data){
                data = $(data);                
                data.find("file").each(function(i,element){
                    var file = this.textContent;                        
                    var id = this.attributes["id"].nodeValue;                       
                    var type = this.attributes["type"].nodeValue;                   
                    var art = this.attributes["art"].nodeValue;   
                    glQuery.collada.getFile(file,id,function(colladaObject){
            
                        glQuery.object.add(colladaObject,id, type,art,colladaObject.Object.Translate);
                        glQuery.renderWorker.postMessage("addedObject");
                        glQuery.imageWorker.postMessage("imageLoaded");
                    })
                })
            }
                
        })
        return true;
            
    }
    
    glQuery.fullscreen = function(){
        log.info("glQuery.fullscreen()");
        var self = this;
        this.canvasHeight = ($("body").innerHeight());
        this.canvasWidth = ($("body").innerWidth());
        
        this.setHeight();
        this.setWidth();
        $(window).resize(function(){ 
            window.clearTimeout(glQuery.scene.renderLoopInt);
            self.canvasHeight =( $("body").innerHeight());
            self.canvasWidth = ($("body").innerWidth());
            self.setHeight();
            self.setWidth();
            
            glQuery.scene.enableRender = false;
            glQuery.webGL.createWebGL(true);
            glQuery.scene.renderLoop(true);
                
            //glQuery().bind("resize");
        });
    }
    
    glQuery.setHeight = function(height){
        if(height == null){
            height = this.canvasHeight;
        }else{
            this.canvasHeight = height;
        }
        $(this.canvas).attr("height",height);
    }
    
    glQuery.getHeight = function(){
        return this.canvasHeight;
    }
    
    glQuery.setWidth = function(width){
        if(width == null){
            width = this.canvasWidth;
        }else{
            this.canvasWidth = Width;
        }
        $(this.canvas).attr("width",width);
    }
    
    glQuery.setDistance = function(distance){
        this.distance = distance;
    }
    
    glQuery.getDistance = function(){
        return this.distance;
    }
    
    glQuery.getWidth = function(){
        return this.canvasWidth;        
    }
    
    glQuery.allowrender = true;
    //glQuery.selection = [];
    glQuery.distance = 100;
    glQuery.workerinit = false;
    
})(window);