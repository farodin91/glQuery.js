/*
 *@fileOverview
 *@name glQuery.core.js
 *@author Jan Jansen - farodin91@googlemail.com
 *@description Coming soon
 *
 *@roadmap
 *      0.1.0 -> Blackscreen, Load collada files, base
 *      0.1.1 -> parseCollada, object base
 *      0.1.2 -> use object by glQuery(#cube).position();
 *      0.1.3 -> Scene while
 *      0.1.4 -> new selector
 *      0.2.0 -> Cube rendern
 *      0.2.1 -> base rendern
 *      0.2.2 -> Collada rendern
 *      0.2.3 -> split glQuery in different files e.g. base, collada, scene, object & animation
 *      0.2.4 -> 2-6 Objects rendern
 *      0.2.5 -> debug features
 *      0.3.0 -> 3D Quality improve and speed, cleanup
 *      
 *@version 0.1.0a1pre 20110222
 *      1. ready -> function is not finish yet, but the started is done
 *      2. setHeight -> function is complete -> v0.1
 *      3. getHeight -> function is complete -> v0.1
 *      4. setWidth -> function is complete -> v0.1
 *      5. getWidth -> function is complete -> v0.1
 *@version 0.1.0a1pre 20110223
 *      1. ready -> in the second phase
 *      2. setBaseFile -> function is complete v0.1
 *      3. setLevelFiles -> function is complete v0.1
 *      4. collada -> getFile -> function is complete v0.1
 *      5. fn -> init -> first phase 
 *                              -> get object
 *                              -> tested but not finshed yet
 *      6. fn -> add -> first phase
 *                              -> getFileCollada
 *                              -> start adding
 *      7. selector -> first phase
 *                              -> start add matches
 *                              
 *@version 0.1.0a2pre 20110305
 *      1. new file name -> for version 0.2.3 -> folder syntax
 *      2. webgl -> createScene -> start First phase
 *      
 *@version 0.1.0a2pre 20110314
 *      1. selector -> is the highest point
 * Depends:
 *	jquery.1.5.0.js
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.mouse.js
 *	sylvester.src.js
 *
 *
 **/

(function( window) {
    window.glQuery  = function(selector){
        return new glQuery.fn.init(selector);
    }

    glQuery.fn = glQuery.prototype = {
        version : "0.1.0a2pre",
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
                            return true;                        
                        }
                    })
                }else{
                    return glQuery.event.trigger(type,this.selector,false,{});    
                }
            }else{
                glQuery.event[type].i= glQuery.event[type].i++;
                glQuery.event[type][glQuery.event[type].i]= {
                    obj:this.selector,
                    callback:callback
                };
                return true;
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
        setViewport:function(x1,y1,x2,y2){
            return this.gl.viewport(x1, y1, x2, y2);
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
            CONTEXT: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
            PART: /\[part=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
            NAMESPACE: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/
        }
    };
    //Verbessern zu umstandlich
    $.extend(glQuery,{
        options:{
            partToglQuery:"glQuery/",
            width:800,
            height:500,
            fullscreen:false
        },
        ready:function(options){
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
        },
        addFileMap:function(){
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
            
        },
        fullscreen:function(){
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
        },
        setHeight:function(height){
            if(height == null){
                height = this.canvasHeight;
            }else{
                this.canvasHeight = height;
            }
            $(this.canvas).attr("height",height);
        },
        getHeight:function(){
            return this.canvasHeight;
        },
        setWidth:function(width){
            if(width == null){
                width = this.canvasWidth;
            }else{
                this.canvasWidth = Width;
            }
            $(this.canvas).attr("width",width);
        },
        setDistance:function(distance){
            this.distance = distance;
        },
        getDistance:function(){
            return this.distance;
        },
        getWidth:function(){
            return this.canvasWidth;        
        },
        distance:100
    
    });
    glQuery.extend = {
    //Erweiterungs möglichkeit;
    }
    glQuery.lighting = {
        
    };
    
    
})(window);