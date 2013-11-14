/*
 * Copyright 2013, Jan Jansen
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



(function(window,$) {
  
    "use strict";
    
    var glQuery = window.glQuery = function(selector,context){
        return new glQuery.fn.init(selector,context);
    };

    glQuery.prototype = glQuery.fn = {
        version : "",
        init: function(selector,context) {
            $.extend(this,glQuery.fn);
            console.log(context);
            this.selector = selector;   
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
         * @return {glQuery} glQuery
         * 
         */
        light:function(type, rgb, intensity, distance, castShadow){
            console.log(type);
            console.log(rgb);
            console.log(intensity);
            console.log(distance);
            console.log(castShadow);
            return this;            
        },
        camera:function(type, near, far){
            glQuery.camera.add(type,this.art,this.id, near, far);
            this.orthographic = function(left, right, bottom, top){
                console.log(left);
                console.log(right);
                console.log(bottom);
                console.log(top);
            };
            this.perspective = function(fovy){
                console.log(fovy);
            };
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
         * @return {glQuery} glQuery
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
                    });
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
            if(!during){
                return this.bind("move", callback);
            }
            glQuery.animation.createAnimationHandler(this.objects,{
                "action":"move",
                "end":endVector
            }, during, easing, callback);
            
            return this;
        },
        collision:function(callback){
            return this.bind("collision", callback);
        },
        /**
         * @function touch
         * 
         * @description
         * 
         * @param callback (function)
         * 
         * @return {glQuery} glQuery
         * 
         **/
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
         * @return {glQuery} glQuery
         * 
         **/
        copyTranslate:function(object,distance){
                console.log(object);
                console.log(distance);
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
         * @return {glQuery} glQuery
         * 
         **/
        lookAt:function(object,front){
                console.log(object);
                console.log(front);
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
         * @return {glQuery} glQuery
         * 
         **/
        rotate:function(angle,axis,during,easing,callback){
            if(!axis){
                return this.bind("rotate", callback);
            }
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
                return this.bind("animation", data);
            }else{
                glQuery.animation.createAnimationHandler(this.objects,data,during,easing,callback);
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
    
    $(document).ready(function(){
        var debug = $("canvas[type='glQuery']").attr("debug");
        var framerate = $("canvas[type='glQuery']").attr("framerate");
        var partTo = $("canvas[type='glQuery']").attr("partTo");
        var scene = $("canvas[type='glQuery']").attr("scene");
        var id = $("canvas[type='glQuery']").attr("id");
            
        glQuery.create({
            debug:debug,
            framerate:framerate,
            partTo:partTo,
            scene:scene,
            id:id
        });
    });
    
    /**
     * @function Create
     * 
     * @description cooming soon
     * 
     * @param options object
     * 
     */
    glQuery.create = function(options){
        console.time("glQuery.create() 1");
        jQuery.extend(this.options,options);
        
        
        if(typeof(Worker)!=="undefined")
        {
            // Yes! Web worker support!
            this.renderWorker = new Worker(this.options.partTo+"engine/worker/glQuery.render.worker.js");
            this.imageWorker = new Worker(this.options.partTo+"engine/worker/glQuery.image.worker.js");
            this.progressWorker = new Worker(this.options.partTo+"engine/worker/glQuery.progress.worker.js");
            //this.guiWorker = new Worker(this.options.partTo+"engine/worker/glQuery.gui.worker.js");
        }
        else
        {
            console.error("No Web Worker support");
            // Sorry! No Web Worker support...
            return false;
        } 
        
        this.imageWorker.onmessage = function(event){
            if(event.data){
                glQuery.event.trigger("ready", "undefined", true, glQuery);
            }
        };
        
        
        this.canvas = "#"+this.options.id;
        this.options.scene = this.options.scene;
        
        jQuery("canvas").after("<div class='glQuery-winmode-layer hidden-fullscreen'></div>");
        
        jQuery(".glQuery-gui .glQuery-winmode section").append("<div class='glQuery-fullscreen hidden-fullscreen'><a id='' href='#' class='btn btn-primary'>Fullscreen</a><p>glQuery.js only work in the fullscreen-modus!</p></div>");
        this.progressBar();
        this.fullscreenObject = document.getElementById(this.options.id);
        
        this.checkBrowser();
        //var self = this;
        
        this.setHeight(screen.height);
        this.setWidth(screen.width);
        
        if(this.options.lockmouse){
            this.progressBarStep("lockmouse",0);  
            this.lockMouse();
            this.progressBarStep("lockmouse",2);  
        }
        this.fullscreen();
         
        var initWeb = glQuery.webGL.createWebGL();
        glQuery.gui.init();
        if(initWeb){
            glQuery.camera.cameraMatrix(true); 
            var extension = this.fileType(this.options.scene);
            switch(extension){
                case "dae":
                    glQuery.collada.scene.parse(this.options.scene);
                    break;
                case "gui":
                    break;
                case "xml":
                    this.addFileMap();
                    glQuery.camera.add("perspective", "cam", "test_cam", 0.1, 100);
                    break;
                //case "blend":
                default:
                    console.error("File extension not supported!");
                    break;
            }
                    
            glQuery.scene.createRender(true);
        }else{
            console.error("Failed to create Webgl");
        }
                          
            
    };
    
    glQuery.pointerLock = {
        Error:function(){
            console.log("Error while locking pointer."); 
        },
        Change:function(){
            console.log("Change locking pointer."); 
        }
    };
    
    glQuery.lockMouse = function(){
        
        document.exitPointerLock = document.exitPointerLock|| document.mozExitPointerLock || document.webkitExitPointerLock;
        document.addEventListener('pointerlockchange', glQuery.pointerLock.Change, false);
        document.addEventListener('mozpointerlockchange', glQuery.pointerLockChange, false);  
        document.addEventListener('webkitpointerlockchange', glQuery.pointerLock.Change, false);  
        document.addEventListener('pointerlockerror', glQuery.pointerLock.Error, false);  
        document.addEventListener('mozpointerlockerror', glQuery.pointerLock.Error, false);  
        document.addEventListener('webkitpointerlockerror', glQuery.pointerLock.Error, false);
        document.addEventListener("mousemove", function(e) {  
            if(glQuery.allowrender){
                var movementX = e.movementX||e.mozMovementX||e.webkitMovementX||0,  
                movementY = e.movementY||e.mozMovementY||e.webkitMovementY||0;  
  
                var controlX = Math.abs(movementX);
                var controlY = Math.abs(movementY);
                if((controlX+controlY)<400){
                    // Print the mouse movement delta values  
                    console.log("movementX=" + movementX, "movementY=" + movementY);                      
                }   
            }
        }, false); 
    };
    
    glQuery.fileType = function(file_name){
        var extension = file_name.split('.');
        extension = extension[extension.length - 1];
        return extension;
    };
    
    glQuery.ready = function(callback){
        glQuery.event.add("ready", "undefined", callback);
            
    };
    
    
    glQuery.progressBarStep = function(type,value,max){
        var data = {};
        if(max === undefined){
            data = {
                step:{
                    type : type,
                    value : value
                }
            };
        }else{
            data = {
                step:{
                    type : type,
                    value : value,
                    max : max
                }
            };
        }
        glQuery.progressWorker.postMessage(window.JSON.stringify(data));
    };
    glQuery.progressBar = function(value,info){
        console.log(info);
        jQuery(".glQuery-gui .glQuery-winmode section").append('<div class="glQuery-intro-progressbar progress progress-striped active hidden-fullscreen"><div class="bar" style="width: '+value+'%;"></div></div><div class="glQuery-intro-tooltip tooltip bottom in fade"><div class="tooltip-arrow"></div><div class="tooltip-inner">'+glQuery.options.progressBar.infoStep.init+'</div></div>');
        
        var bar = jQuery(".glQuery-intro-progressbar .bar");
        var inner = jQuery(".glQuery-intro-tooltip .tooltip-inner");
        this.progressWorker.postMessage(window.JSON.stringify({
            options:{
                lockMouse:glQuery.options.lockMouse
            }
        }));
        this.progressWorker.onmessage = function(event){
            var data = window.JSON.parse(event.data);
            bar.width(data.value+"%");
            if(glQuery.options.progressBar.info !== data.info){
                glQuery.options.progressBar.info = data.info;
                inner.html(glQuery.options.progressBar.infoStep[data.info]);
            }
        };
        this.progressBarStep("init",0);
        this.options.progressBar.visible = true;
    };
    
    glQuery.checkBrowser = function(){
        this.progressBarStep("checkbrowser",0);
        if(this.options.lockMouse){
            glQuery.fullscreenObject.requestPointerLock =  glQuery.fullscreenObject.requestPointerLock    ||  
                glQuery.fullscreenObject.mozRequestPointerLock ||  
                glQuery.fullscreenObject.webkitRequestPointerLock; 
            this.progressBarStep("checkbrowser",1);
            if(glQuery.fullscreenObject.requestPointerLock !== undefined){
                return false;
            }
        }
        if((!document.mozCancelFullScreen && 
            !document.webkitCancelFullScreen && 
            !document.cancelFullScreen) && 
            (!document.mozFullScreen && 
                !document.webkitFullScreen && 
                !document.fullScreen
                )
            ){
            return false;
        }
        //more checks     
    };
    
    glQuery.fullscreen = function(){
        
        console.info("glQuery.fullscreen()");
        var self = this;
        document.addEventListener("fullscreenchange", this.toggleRenderer, false);
        document.addEventListener("mozfullscreenchange", this.toggleRenderer, false);
        document.addEventListener("webkitfullscreenchange", this.toggleRenderer, false);
        $(document).keypress(function(e) {
            
            if (e.keyCode === 13) {
                self.toggleFullscreen();
            }
        });
        $(".glQuery-fullscreen a").on("click",function(e){
            self.toggleFullscreen();
            e.preventDefault();
        });
        this.progressBarStep("fullscreen",5);    
    } ;
    glQuery.toggleRenderer = function(){
        if( glQuery.allowrender){
            glQuery.allowrender = false;
            if(glQuery.options.lockMouse){
                document.exitPointerLock();
            }
        }else{
            if(glQuery.options.lockMouse){
                glQuery.fullscreenObject.requestPointerLock();
            }
            glQuery.allowrender = true;
        }
    };
    glQuery.toggleFullscreen = function(){
        console.info("glQuery.toggleFullscreen()");
        if (!document.mozFullScreen && !document.webkitFullScreen && !document.fullScreen) {
            if (this.fullscreenObject.mozRequestFullScreen) {
                this.fullscreenObject.mozRequestFullScreen();
                glQuery.renderWorker.postMessage("fullscreen");
            } else {
                this.fullscreenObject.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT); 
                glQuery.renderWorker.postMessage("fullscreen");
            }
            
        } else {
            if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else {
                document.webkitCancelFullScreen();
            }
        }
    };
    
    glQuery.getHeight = function(){
        return this.canvasHeight;
    };
    glQuery.setHeight = function(height){
        if(height === null){
            height = this.canvasHeight;
        }else{
            this.canvasHeight = height;
        }
        $(this.canvas).attr("height",height);
    };
    
    glQuery.getWidth = function(){
        return this.canvasWidth;
    };
    glQuery.setWidth = function(width){
        if(width === null){
            width = this.canvasWidth;
        }else{
            this.canvasWidth = width;
        }
        $(this.canvas).attr("width",width);
    };
    
    glQuery.allowrender = false;
    glQuery.canvasWidth = 0;
    glQuery.canvasHeight = 0;
    glQuery.distance = 100;
    glQuery.workerinit = false;
    
    glQuery.options = {
        partTo:"glQuery.js/",
        debug:false,
        gui:true,
        lockMouse:false,
        progressBar:{
            value:0,
            visible:false,
            info:"init",
            infoStep:{
                init:"Initialize the 3D Engine!",
                checkbrowser:"Check the Browser Compatibility!",
                fullscreen:"Make possible to run the Fullscreen-Modus!",
                lockmouse:"Locking the mouse!",
                createwebgl:"Creating the 3D Plattform!",
                loadingmodels:"Loading the 3D Objects!",
                loadinglights:"Lights beginning to add!",
                creategui:"Create Gui!",
                connect:"Where is connection...?"
            }
        }
        
        
    };
    
})(window,jQuery);