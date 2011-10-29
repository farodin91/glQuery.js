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

    glQuery.fn = glQuery.prototype = {
        version : "",
        init: function(selector) {
            $.extend(this,glQuery.fn);
            var self = this;
            this.selector = selector;
            if ( !selector ) {
                this.selector.name = "all";
                return this;
            }else{
                this.Id = selector.match(glQuery.fn.match.ID)[1];
                this.object = glQuery.objects.getObjectById(this.Id);
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
        move:function(callback){
            return this.bind("move", callback);
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
         */
        add:function(collada_url,type){
            var self = this;
            glQuery.collada.getFile(collada_url,this.Id,function(colladaObject){
            
                glQuery.objects.add(colladaObject,self.Id, type);
                log.debug("glQuery.fn.add() => Object is add to the library")
                glQuery.renderWorker.postMessage("addedObject");
            })
        
        
        },
        
        position:function(position){
            if(!position){
                return this.collection.position;            
            }else{
                this.options.position[this.i_pos] = position;
                this.collection.position = position;
                glQuery.physics.render(this.collection);
                trigger = glQuery.event.trigger("move",this.name,true,{
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
        
        }
    /**,
        match:{
            ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            CONTEXT: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            PART: /\[part=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
            NAMESPACE: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/
        }*/
    };
    
    /**
         * @function ready
         * 
         * @description cooming soon
         * 
         * @param options s
     * 
     */
    glQuery.ready = function(options){
        log.debug("glQuery.ready() is started");
        $.extend(this.options,options);
            
        this.renderWorker = new Worker(this.options.partToglQuery+"WebWorker/render.js");
        this.canvas = this.options.canvas;
        var self = this;
        var full = this.options.fullscreen;
        glQuery.objects.init();
        $(function(){
            if(full){
                self.fullscreen();
            }else{
                self.canvasHeight = self.options.height;
                self.canvasWidth = self.options.width;
                self.setHeight();
                self.setWidth();
            }
                
            initWeb = glQuery.webGL.createWebGL();
            if(initWeb){
                self.addFileMap();
                initScene = glQuery.webGL.createScene();
                    
                //glQuery().bind("ready");
                    
                glQuery.scene.createRender(true);
            }else{
                log.error("Failed to create Webgl")
            }
                          
            
        })
    };
    
    glQuery.options = {
        partToglQuery:"glQuery/",
        width:800,
        height:500,
        fullscreen:false        
    }
    
    glQuery.addFileMap = function(){
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
                    glQuery("#"+id).add(file,type);
                })
            }
                
        })
            
    }
    glQuery.fullscreen = function(){
        log.info("glQuery.fullscreen()");
        var self = this;
        this.canvasHeight = ($("body").innerHeight());
        this.canvasWidth = ($("body").innerWidth());
        ;
        this.setHeight();
        this.setWidth()
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