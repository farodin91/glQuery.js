/*
 * Copyright 2011, Jan Jansen
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
 *      -- create a new roadmap
 * Depends:
 *	jquery.1.6.0.js
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
 *	glQuery.object.js
 *	glQuery.physics.js
 *	glQuery.textures.js
 *
 *
 **/



(function( window) {
    window.glQuery  = function(selector){
        return new glQuery.fn.init(selector);
    }

    glQuery.prototype = glQuery.fn = {
        version : "",
        init: function(selector) {
            $.extend(this,glQuery.fn);
            var self = this;
            this.selector = selector;
            glQuery.selectors[selector] = [];
            if ( !selector ) {
                this.selector= "all";
                return this;
            }else{
                this.Type = selector.match(glQuery.fn.match.TYPE)[1];
                if(this.Type)
                    glQuery.objects.getObjectById(this.Type,this.selector);
                
                this.Art = selector.match(glQuery.fn.match.ART)[1];
                if(this.Art)
                    glQuery.objects.getObjectByArt(this.Art,this.selector);
                
                this.Id = selector.match(glQuery.fn.match.ID)[1];
                if(this.Id)
                    glQuery.objects.getObjectById(this.Id,this.selector);
                
                
                return this;
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
        bind:function(type,callback){
            var self = this;
            if(!callback){
                if(typeof type === "object"){
                    $.each(type,function(value){
                        if(!value.callback){
                            return glQuery.event.trigger(value.type,self.selector,false,{});    
                        }else{
                            glQuery.event[value.type].i= glQuery.event[value.type].i++;
                            glQuery.event[value.type][glQuery.event[value.type].i]= {
                                obj:self.Id,
                                callback:value.callback
                            };
                            return self;                        
                        }
                    })
                    
                }else{
                    return false;    
                }
            }else{
                glQuery.event[type].i= glQuery.event[type].i++;
                glQuery.event[type][glQuery.event[type].i]= {
                    obj:this.selector,
                    callback:callback
                };
                return this;
            }
            return false;
        },

        click:function(callback){
            return this.bind("click", callback);
        },
        near:function(callback){
            return this.bind("near", callback);
        },
        move:function(toPositionVec3,during,easing,callback){
            if(!during)
                return this.bind("move", callback);
            
            return glQuery.animation.move(this.collection,toPositionVec3, during, easing, callback)
        },
        collision:function(callback){
            return this.bind("collision", callback);
        },
        touch:function(callback){
            return this.bind("touch", callback);
        },
        /**
         * @function add
         * 
         * @description create an object form collada and add it to the libary
         * 
         * @param collada_url string => relative url to the collada file
         * @param type int => 1:Object; 2:Camera; 3:Lighting;
         * 
        add:function(collada_url,type){
            var self = this;
            log.info("glQuery().add();")
            glQuery.collada.getFile(collada_url,this.Id,function(colladaObject){
            
                glQuery.objects.add(colladaObject,self.Id, type);
                log.debug("glQuery.fn.add() => Object is add to the library")
                glQuery.renderWorker.postMessage("addedObject");
            })
        },
         */
        
        position:function(position){
            if(!position){
                return this.collection.position;            
            }else{
                this.options.position[this.i_pos] = position;
                this.collection.position = position;
                glQuery.physics.render(this.collection);
                var trigger = glQuery.event.trigger("move",this.name,true,{
                    position:position
                });
                return true;
            }
        },
        animate:function(data,during,easing,callback){
            if(!during){
                return this.bind("animation", data)
            }else{
                return glQuery.animation.create(this.collection,data,during,easing,callback);
            }
        },
        perspective:function(){
        
        },
        match:{
            ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            ART: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            PART: /\[part=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
            TYPE: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/
        }
    };
    
    jQuery(document).ready(function(){
            debug = $("canvas[type='glQuery']").attr("debug");
            fullscreen = $("canvas[type='glQuery']").attr("fullscreen");
            framerate = $("canvas[type='glQuery']").attr("framerate");
            partTo = $("canvas[type='glQuery']").attr("partTo");
            objects = $("canvas[type='glQuery']").attr("objects");
            width = $("canvas[type='glQuery']").attr("width");
            height = $("canvas[type='glQuery']").attr("height");
            id = $("canvas[type='glQuery']").attr("id");
            
            glQuery.create({
                debug:debug,
                fullscreen:fullscreen,
                framerate:framerate,
                partTo:partTo,
                objects:objects,
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
        log.debug("glQuery.create() is started");
        jQuery.extend(this.options,options);
        
        this.renderWorker = new Worker(this.options.partTo+"engine/worker/glQuery.render.worker.js");
        this.imageWorker = new Worker(this.options.partTo+"engine/worker/glQuery.image.worker.js");
        this.canvas = "#"+this.options.id;
        this.options.mapFile = this.options.objects;
        var self = this;
        var full = this.options.fullscreen;
        glQuery.objects.init();
        if(full){
            this.fullscreen();
        }else{
            this.canvasHeight = this.options.height;
            this.canvasWidth = this.options.width;
            this.setHeight();
            this.setWidth();
        }
                
        var initWeb = glQuery.webGL.createWebGL();
        if(initWeb){
            self.addFileMap();
            var initScene = glQuery.webGL.createScene();
                    
            //glQuery().bind("ready");
                    
            glQuery.scene.createRender(true);
        }else{
            log.error("Failed to create Webgl")
        }
                          
            
    };
    glQuery.ready = function(callback){
        var self = this;
        this.imageWorker.onmessage(function(event){
            if(event.data)
                callback(self)
        })
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
            glQuery.objects.add(colladaObject,id, type,art,colladaObject.Object.Translate);
        })
    }
    
    glQuery.addFileMap = function(){
        log.info("glQuery.addFileMap()");
        var self = this;
            
        $.ajax({
            url:this.options.mapFile,
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
            
                        glQuery.objects.add(colladaObject,id, type,art,colladaObject.Object.Translate);
                        glQuery.renderWorker.postMessage("addedObject");
                    })
                })
            }
                
        })
            
    }
    
    glQuery.fullscreen = function(){
        log.info("glQuery.fullscreen()");
        var self = this;
        this.canvasHeight = ($("body").innerHeight());
        this.canvasWidth = ($("body").innerWidth());
        
        this.setHeight();
        this.setWidth();
        $(window).resize(function(){ 
            self.canvasHeight =( $("body").innerHeight());
            self.canvasWidth = ($("body").innerWidth());
            self.setHeight();
            self.setWidth();
            glQuery.scene.enableRender = false;
            glQuery.webGL.createWebGL(true);
            glQuery.scene.createRender();
                
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
    
    glQuery.distance = 100
    
    

    
    
})(window);