/*! glQuery.js - v0.1.0 - 2013-11-22
* https://github.com/gruntjs/grunt-init-jquery-sample
* Copyright (c) 2013 Jan Jansen; Licensed MIT */
(function( glQuery,vec3, mat4, console, undefined ) {
    
    glQuery.camera = {
        lookAt:[],
        eye:[],
        
        cameraMatrix:function(resize){
            if(resize){
                this.perspective.Matrix = mat4.create();
                this.perspective.Matrix = mat4.perspective(60, (glQuery.canvasWidth/glQuery.canvasHeight), 0.1, 100, this.perspective.Matrix);
            }
            return this.perspective.Matrix;
        },
        add:function(type,art,id, near, far){
            console.log(type);
            console.log(art);
            console.log(id);
            console.log(near);
            console.log(far);
        },
        createLookAtByMvMatrix:function(modelViewMatrix){
            var center = vec3.create([0,0,-1]);
            var up = vec3.create([0,1,0]);
            this.eye = vec3.create([0,0,0]);
            var lookAt = mat4.create();
            center = vec3.normalize(mat4.multiplyVec3(modelViewMatrix, center));
            up     = up;
            this.eye    = mat4.multiplyVec3(modelViewMatrix, this.eye);
            lookAt = mat4.lookAt(this.eye, center, up, lookAt);
            this.lookAt = lookAt;
            return lookAt;
        },
        uniformCamera:function(shader){
            //glQuery.gl.uniform3fv(shader["uniforms"]["common_vertex"]["uEyePosition"]["location"], false, this.eye);
            glQuery.gl.uniformMatrix4fv(shader["uniforms"]["common_vertex"]["uPerspectiveMatrix"]["location"], false, this.cameraMatrix());
            glQuery.gl.uniformMatrix4fv(shader["uniforms"]["common_vertex"]["uLookAt"]["location"], false, this.lookAt);
        }
        
    };
})(glQuery, vec3, mat4, console );
(function( glQuery, undefined ) {
    
    glQuery.camera.orthographic = {
        
    };
})(glQuery );
(function( glQuery, undefined ) {
    
    glQuery.camera.perspective = {
        Matrix:[]
    };
})(glQuery );
(function( glQuery,console, undefined ) {
glQuery.action = {
    createActionHandler:function(action,data,objects){
        this.actionHandler(objects, {"data":data,"action":action});
        
        return true;
    },
    actionHandler:function(objects,data){
        this.task[data.action](objects,data);
        return true;    
    },
    task:{
        translatePosition:function(objects,data){
            glQuery.event.trigger("move", objects, true, data);
            for(var i=0; i <objects.length; i++){
                glQuery.object.objects[objects[i]].translateVec3ObjectPos(data);
            }
            return true;
        },
        setPosition:function(objects,data){
            glQuery.event.trigger("move", objects, true, data);
            for(var i=0; i <objects.length; i++){
                glQuery.object.objects[objects[i]].setVec3ObjectPos(data);
            }
        },
        rotate:function(){
            
        },
        rotateX:function(){
            
        },
        rotateY:function(){
            
        },
        rotateZ:function(){
            
        },
        trackTo:function(objects,data){
            console.log(objects);
            console.log(data);
        },
        lookAt:function(objects,data){
            console.log(objects);
            console.log(data);            
        }
        
    }
    };
})(glQuery,console );
(function( glQuery, undefined ) {

    glQuery.animation = {
        createAnimationHandler:function(objects,data,during,easing,callback){
            if(!callback && typeof easing === "function"){
                callback = easing;
                easing = null;
                
            }
            if(!callback && typeof easing === "string"){
                callback = null;
            }
            if(typeof during === "string"){
                easing = during;
                during = undefined;
            }
        
            if(typeof during === "function"){
                callback = during;
                during = undefined;
            }
            
        
            data = {
                "data":data,
                "during":during,
                "easing":easing,
                "callback":callback
            };
            for(var i=0; i <objects.length;i++){
                this.animationHandler(objects[i],data);
            }
        },
        animationHandler:function(object,data){
            glQuery.event.trigger(data.data.action, object, true, data);
            glQuery.fx.custom(object,data);
        }
    };
    glQuery.fx = {
        custom:function(object,data){
            
            this.startTime = new Date().getTime();
            var start = this.getFrom[data.data.action](object);
            var end = data.data.end;
            this.now = this.startTime;
            var pos = 0;
            var action = data.data.action;
            this.duration = data.during || this.speeds._default;
            var stepLength = 13/this.duration;
                        
            this.step(object,action,start,end,pos,stepLength,this,data.callback,data.data,false);
            
        },
        speeds: {
            slow: 600,
            fast: 200,
            // Default speed
            _default: 400
        },
        task:{
            move:function(object,start,end,pos,stepLength,data,data2){
                if(!data2){
                    data2 = vec3.subtract(end, start,[0,0,0]);
                    
                }
                glQuery.object.objects[object].translateVec3ObjectPos(vec3.scale(data2, stepLength,[0,0,0]));
                return data2;
            },
            rotate:function(object,start,end,pos,stepLength,data){
                var angle =((stepLength)*end);
                glQuery.object.objects[object].mvMat4 = mat4.rotate(glQuery.object.objects[object].mvMat4,angle*(Math.PI/180), data.axis);
                return true;
            }
            
        },
        getFrom:{
            move:function(object){
                return glQuery.object.objects[object].vObjectPos;
            },
            rotate:function(object){
                return glQuery.object.objects[object].mvMat4;
            }
        },

        // Each step of an animation
        step: function(object,action,start,end,pos,stepLength,self,callback,data,data2) {
            pos = pos +1;
            data2 = glQuery.fx.task[action](object,start,end,pos,stepLength,data,data2);
            if(!data2){
                
            }
            if(pos*stepLength <=1){
                window.setTimeout(self.step,13,object,action,start,end,pos,stepLength,self,callback,data,data2);                
            }else{
                callback({
                    "action":action
                });
            }
        }
        
    };
})(glQuery );
(function(window,console,$) {
  
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
            if(this.options.debug){
                console.log(type);
                console.log(rgb);
                console.log(intensity);
                console.log(distance);
                console.log(castShadow);
            }
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
            if(this.options.debug){
                console.log(object);
                console.log(distance);
            }
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
            if(this.options.debug){
                console.log(object);
                console.log(front);
            }
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
        console.log(this.options);
        if(typeof(Worker)!=="undefined")
        {
            // Yes! Web worker support!
            this.renderWorker = new Worker(this.options.partTo+"static/worker/glQuery.render.worker.js");
            this.imageWorker = new Worker(this.options.partTo+"static/worker/glQuery.image.worker.js");
            this.progressWorker = new Worker(this.options.partTo+"static/worker/glQuery.progress.worker.js");
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
        //this.options.scene = this.options.scene;
        
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
        //glQuery.gui.init();
        if(initWeb){
            glQuery.camera.cameraMatrix(true); 
            var extension = this.fileType(this.options.scene);
            switch(extension){
                case "dae":
                    glQuery.collada.scene.parse(this.options.scene);
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
        glQuery.progressWorker.postMessage(data);
    };
    glQuery.progressBar = function(value,info){
        if(this.options.debug){
            console.log(info);
        }
        jQuery(".glQuery-gui .glQuery-winmode section").append('<div class="glQuery-intro-progressbar progress progress-striped active hidden-fullscreen"><div class="bar" style="width: '+value+'%;"></div></div><div class="glQuery-intro-tooltip tooltip bottom in fade"><div class="tooltip-arrow"></div><div class="tooltip-inner">'+glQuery.options.progressBar.infoStep.init+'</div></div>');
        
        var bar = jQuery(".glQuery-intro-progressbar .bar");
        var inner = jQuery(".glQuery-intro-tooltip .tooltip-inner");
        this.progressWorker.postMessage({
            options:{
                lockMouse:glQuery.options.lockMouse
            }
        });
        this.progressWorker.onmessage = function(event){
            var data =event.data;
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
                connect:"Where is connection...?"
            }
        }
        
        
    };
    
})(window,window.console,jQuery);
(function( glQuery, undefined ) {

    glQuery.event = {
        click:[],
        move:[],
        near:[],
        touch:[],
        collision:[],
        keyboard:[],
        camera:[],
        light:[],
        addObject:[],
        animation:[],
        error:[],
        complete:[],
        ready:[],
        
        options:{},
        add:function(type,triggerObject,callback){
            this[type][triggerObject] = callback;
        },
        /**
         * @function trigger
         * 
         * @description 
         * 
         * @param type (string) -> 
         * @param triggerObject (int,array) -> 
         * @param auto (bool) -> 
         * @param data (array,object) -> 
         * 
         **/
        trigger:function(type,triggerObject,auto,data){
            var e = {};
            e.auto = auto;
            e.data = data;
            if(typeof triggerObject === "string" || typeof triggerObject === "number"){
                for(var key in this[type]){
                    if(key === triggerObject){
                        this[type][key](e);
                    }
                }
                
            }else{
                for(var i =0; triggerObject < triggerObject.length;i++){
                    for(var keyTrigger in this[type]){
                        if(keyTrigger === triggerObject[i]){
                            this[type][keyTrigger](e);
                        }
                    }
                }
            }
            return true;
        }
    };
})(glQuery );
(function( glQuery, undefined ) {

    glQuery.physics = {
        collision:true,
        gravity:10.00,
        particles:{
            water:{},
            fire:{},
            sand:{}
        },
        render:function(obj){
            console.log(obj);
        }
    };
})(glQuery );
(function( glQuery, undefined ) {
glQuery.input = {
        mouse:{
            down:function(){
            
            },
            move:function(){
            
            },
            up:function(){
            
            },
            onDown:function(){
            
            },
            onMove:function(){
            
            },
            onUp:function(){
            
            }
        },
        keyboard:{
            up:function(){},
            down:function(){},
            onUp:function(){},
            onDown:function(){},
            keyCode:{
                backspace:8,
                tab:9,
                enter:13,
                shift:16,
                ctrl:17,
                alt:18
            }
        }
    };
})(glQuery );
(function( glQuery, undefined ) {
    
    glQuery.collada.animation = {
        
    };
})(glQuery );

(function( glQuery, undefined ) {
    
    glQuery.collada.camera = {
      debug:false,
      instanceCamera:function(url,data){
        if(this.debug){
          console.log(url);
          console.log(data);
        }            
      }
    };
})(glQuery );

(function( glQuery ,$ ,undefined ) {

    glQuery.collada = {//komplette überarbeitung
        debug:false,
        getCollada :function(url,callback,err){
            var self = this;
            if(this.debug){
                console.log(url);
                console.log(callback);
                console.log(err);
            }
            $.ajax({
                url:url,
                dataType:"xml",
                error:function(e){
                    err(e);
                },
                success:function(xmlDocument){
                    var node = self.getColladaNode(xmlDocument);
                    var meta = self.parseMeta(node);
                    callback(node,meta);
                }
            });
        },
        initParse:function(data){
            if(this.debug){
                console.log(data);
            }
            return $(data);
        },
        parseMeta:function(data){
            if(this.debug){
                console.log(data);
            }
            var meta = {};
            meta.library = this.getLibraries(data);
            meta.upAxis = 0;
            for(var i = 0; i< data.children.length;i++){
                var child = data.children.item(i);
                if(this.debug){
                    console.info(child.nodeName);
                }
                if("up_axis" === child.nodeName){
                    switch(child.innerHTML){
                        case "Y_UP":
                            meta.upAxis = 0;
                            break;
                        case "Z_UP":
                            meta.upAxis = 1;
                            break;
                        case "X-UP"://Version 1.5
                        case "X_UP"://Version 1.4.1
                            meta.upAxis = 2;//Coming Soon!
                            break;
                        default:
                            meta.upAxis = 0;
                            break;
                    }
                    break;
                }
            }
            if(this.debug){
                console.info(meta);
            }
            return meta;
        },
        getColladaNode:function(xmlDocument){
            return this.getChildNodeByName(xmlDocument,"COLLADA");
        },
        getChildNodeByName:function(node,name){
            if(this.debug){
                console.log(node);
                console.log(name);
            }
            var childNode = null;
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child.nodeName);
                }
                if(name === child.nodeName){
                    childNode = child;
                }
            }
            return childNode;

        },
        getLibraries:function(node){
            if(this.debug){
                console.log(node);
            }
            var libraries = {};
            for(var i = 0;i < node.children.length;i++){
                var childLib = node.children.item(i);
                if(this.debug){
                    console.info(childLib.nodeName);
                }
                var nodeName = childLib.nodeName;
                var pre = nodeName.split('_');
                pre = pre[0];
                if(pre === "library"){
                    libraries[nodeName] = childLib;
                }
            }
            
            if(this.debug){
                console.log(libraries);
            }
            return libraries;
        },
        parseIntArray:function(s){
            s = s.toString().replace( /^\s+/, "" ).replace( /\s+$/, "" );
            if (s === ""){
                return [];
            }
            // this is horrible
            var ss = s.split(/\s+/);

            var res = new Int32Array(ss.length);
            for (var i = 0, j = 0; i < ss.length; i++) {
                if (ss[i].length === 0){
                    continue;
                }
                if(ss[i] !=  null){
                    res[j++] = parseInt(ss[i],10);
                }
            }
            return res;
        },
        parseFloatArray:function(s){
            s = s.toString().replace( /^\s+/, "" ).replace( /\s+$/, "" );
            if (s === ""){
                return [];
            }

            // this is horrible
            var ss = s.split(/\s+/);
            var res = new Float32Array(ss.length);
            for (var i = 0, j = 0; i < ss.length; i++) {
                if (ss[i].length === 0){
                    continue;
                }
                res[j++] = parseFloat(ss[i]);
            }          
            return res;
        },
        parseBoolArray:function(s){
            s = s.toString().replace( /^\s+/, "" ).replace( /\s+$/, "" );
            if (s === ""){
                return [];
            }
            var ss = s.split(/\s+/);
            
            var res = new Array(ss.length);
            for (var i = 0, j = 0; i < ss.length; i++) {
                if (ss[i].length === 0){
                    continue;
                }
                res[j++] = parseBool(ss[i]);
            }          
            return res;
        },
        sortCoord:function(coord,upAxis){
            switch(upAxis){
                case 0:
                    return coord;
                case 1:
                    return [coord[0],coord[2],(-coord[1])];
                case 2:
                    return [(-coord[1]),coord[0],coord[2]];
            }
        },
        parseURI:function(uri,data){
            
            if(uri.indexOf("/") === -1){
                return jQuery(data).find(uri);
            }else{
                //Coming Soon!
            }
        }
    };
})(glQuery, jQuery );
(function( glQuery,$, undefined ) {
    
    glQuery.collada.light = {
        debug:false,
        instanceLight:function(url,data){
            if(this.debug){
                console.log(data);
                console.log(url);
            }
            var light = {};
            var node = glQuery.collada.parseURI(url, data.data).get(0);
            if(this.debug){
                console.log(node);
            }
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child);
                }
                switch(child.nodeName){
                    case "technique_common":
                        light = this.techniqueCommon(child,data);
                        break;
                    case "technique":
                        break;
                    case "asset":
                        break;
                    case "extra":
                        break;
                }
            }
            return light;            
        },
        techniqueCommon:function(node,data){
            var light = {};
            if(this.debug){
                console.log(data);
                console.log(node);
            }
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child);
                }
                switch(child.nodeName){
                    case "ambient":
                        light.type = "ambient";
                        light.ambient = this.parseAmbient(child,data);
                        break;
                    case "point":
                        light.type = "point";
                        light.point = this.parsePoint(child,data);
                        break;
                    case "spot":
                        light.type = "spot";
                        light.spot = this.parseSpot(child,data);
                        break;
                    case "directional":
                        light.type = "directional";
                        light.directional = this.parseDirectional(child,data);
                        break;    
                }                 
            }
            return light;
        },
        parseSpot:function(node,data){
            var spot = {};
            if(this.debug){
                console.log(data);
                console.log(node);
            }
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child);
                }
                switch(child.nodeName){
                    case "color":
                        spot.color = glQuery.collada.parseFloatArray(child.innerHTML);
                        break;
                    case "constant_attenuation":
                        spot.constantAttenuation = child.innerHTML ? parseFloat(child.innerHTML) : 1.0;
                        break;
                    case "linear_attenuation":
                        spot.linearAttenuation = child.innerHTML ? parseFloat(child.innerHTML) : 0.0;
                        break;
                    case "quadratic_attenuation":
                        spot.quadraticAttenuation = child.innerHTML ? parseFloat(child.innerHTML) : 0.0;
                        break;
                    case "falloff_angle":
                        spot.falloffAngle = child.innerHTML ? parseFloat(child.innerHTML) : 180.0;
                        break;
                    case "falloff_exponent":
                        spot.falloffExponent = child.innerHTML ? parseFloat(child.innerHTML) : 0.0;
                        break;
                }
            }
            return spot;  
        },
        parseAmbient:function(node,data){
            var ambient = {};
            if(this.debug){
                console.log(data);
                console.log(node);
            }
            //node = $(node);
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child);
                }
                if(child.nodeName === "color"){
                    ambient.color = glQuery.collada.parseFloatArray(child.innerHTML);
                }
            }
            return ambient;            
        },
        parsePoint:function(node,data){
            var point = {};
            if(this.debug){
                console.log(data);
                console.log(node);
            }
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child);
                }
                switch(child.nodeName){
                    case "color":
                        point.color = glQuery.collada.parseFloatArray(child.innerHTML);
                        break;
                    case "constant_attenuation":
                        point.constantAttenuation = child.innerHTML ? parseFloat(child.innerHTML) : 1.0;
                        break;
                    case "linear_attenuation":
                        point.linearAttenuation = child.innerHTML ? parseFloat(child.innerHTML) : 0.0;
                        break;
                    case "quadratic_attenuation":
                        point.quadraticAttenuation = child.innerHTML ? parseFloat(child.innerHTML) : false;
                        break;
                }
            }
            return point;   
        },
        parseDirectional:function(node,data){
            var directional = {};
            if(this.debug){
                console.log(data);
                console.log(node);
            }
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child);
                }
                if(child.nodeName === "color"){
                    directional.color = glQuery.collada.parseFloatArray(child.innerHTML);
                }
            }
            return directional;  
        }
        
    };
})(glQuery, jQuery );

(function( glQuery,$, undefined ) {
    
    glQuery.collada.material = {
        bindMaterial:function(node,data){
            this.data = data.data;
            this.meta = data.meta;
            var self = this;
            var material = {};
            node.find("> *").each(function(){
                switch(this.nodeName){
                    case "param"://coming Soon!
                        break;
                    case "technique_common":
                        material = self.techniqueCommon(this);
                        break;
                    case "technique"://Coming Soon!
                        break;
                    case "extra"://Coming Soon!
                        break;
                }
            });
            return material;
        },
        techniqueCommon:function(node){
            var self = this;
            var material = {};
            $(node).find("> *").each(function(){
                if(this.nodeName === "instance_material"){
                    material[this.getAttribute("symbol")] = {};
                    material[this.getAttribute("symbol")].target = this.getAttribute("target");
                    material[this.getAttribute("symbol")].material = self.instanceMaterial(this);
                }
            });
            return material;
        },
        instanceMaterial:function(node){
            var material = {};
            material = this.getMaterial(glQuery.collada.parseURI(node.getAttribute("target"),this.data));
            /*$(node).find("> *").each(function(){
                switch(this.nodeName){
                    case "bind"://Coming Soon!
                        break;
                    case "bind_vertex_input"://Coming Soon!
                        break;
                    case "extra"://Coming Soon!
                        break;
                    
                }
            });*/
            return material;
        },
        getMaterial:function(node){
            var self = this;
            var material = {};
            node.find("> *").each(function(){
                switch(this.nodeName){
                    case "asset"://Coming Soon!
                        break;
                    case "instance_effect":
                        material = self.instanceEffect(this);
                        break;
                    case "extra"://Coming Soon!
                        break;
                    
                }
            });
            return material;
        },
        instanceEffect:function(node){
            var effect = {};
            effect = this.getEffect(glQuery.collada.parseURI(node.getAttribute("url"),this.data));
            /*$(node).find("> *").each(function(){
                switch(this.nodeName){
                    case "technique_hint"://Coming Soon!
                        break;
                    case "setparam":
                        break;
                    case "extra"://Coming Soon!
                        break;
                    
                }
            });*/
            return effect;
        },
        getEffect:function(node){
            var self = this;
            var effect = {};
            node.find("> *").each(function(){
                switch(this.nodeName){
                    case "asset"://Coming Soon!
                        break;
                    case "annotate"://Coming Soon!
                        break;
                    case "profile_BRIDGE"://Coming Soon!
                        break;
                    case "profile_CG"://Coming Soon!
                        break;
                    case "profile_GLES"://Coming Soon!
                        break;
                    case "profile_GLES2"://Coming Soon!
                        break;
                    case "profile_GLSL"://Coming Soon!
                        break;
                    case "profile_COMMON":
                        effect = self.getProfileCOMMON(this);
                        break;
                    case "newparam"://Coming Soon!
                        break;
                    case "extra"://Coming Soon!
                        break;
                    
                }
            });
            return effect;
        },
        getProfileCOMMON:function(node){
            var self = this;
            var profil = {};
            $(node).find("> *").each(function(){
                switch(this.nodeName){
                    case "technique":
                        profil = self.getTechnique(this);
                        break;
                    case "asset"://Coming Soon!
                        break;
                    case "newparam"://Coming Soon!
                        break;
                    case "extra"://Coming Soon!
                        break;                    
                }
            });
            return profil;
        },
        getTechnique:function(node){
            var self = this;
            var profil = {};
            $(node).find("> *").each(function(){
                switch(this.nodeName){
                    case "asset"://Coming Soon!
                        break;
                    case "annotate"://Coming Soon!
                        break;
                    case "blinn"://Coming Soon!
                        break;
                    case "constant"://Coming Soon!
                        break;
                    case "lambert":
                        break;
                    case "phong":
                        profil.phong = {};
                        profil.phong = self.getPhong(this);
                        break;
                    case "pass"://Coming Soon!
                        break;
                    case "extra"://Coming Soon!
                        break;                    
                }
            });
            return profil;
        },
        getPhong:function(node){
            var self = this;
            var phong = {};
            var typesColor = ["emission","ambient","diffuse","specular","transparent","reflective"];
            var typesValue = ["reflectivity","transparency","shininess","index_of_refraction"];
            $(node).find("> *").each(function(){
                switch(this.nodeName){
                    case "emission":
                    case "ambient":
                    case "diffuse":
                    case "specular":
                    case "transparent":
                    case "reflective":
                        phong[this.nodeName]=self.getCommonColorOrTexture(this);
                        
                        break;
                    case "reflectivity":
                    case "transparency":
                    case "shininess":
                    case "index_of_refraction":
                        phong[this.nodeName]=self.getCommonFloat(this);
                        break;
                    
                }
            });
            for(var key in typesColor){
                if(!phong[typesColor[key]]){
                    phong[typesColor[key]] = new Float32Array([0,0,0,1]);
                }
            }
            for(var key2 in typesValue){
                if(!phong[typesValue[key2]]){
                    phong[typesValue[key2]] = 0.0;
                }
            }
            return phong;
        },
        getCommonFloat:function(node){
            var Float = 0;
            var child = node.firstElementChild;
            if(child.nodeName === "float"){
                Float = parseFloat(child.textContent);
            }else{
                Float = this.getCommonParam(child.getAttribute("ref"));
            }
            return Float;
        },
        getCommonColorOrTexture:function(node){
            var self = this;
            var profil;
            var child = node.firstElementChild;
            switch(child.nodeName){
                case "color":
                    profil = glQuery.collada.parseFloatArray(child.textContent);
                    break;
                case "texture":
                    profil = glQuery.collada.instanceTexture(child,self);
                    break;
                case "param":
                    profil = this.getCommonParam(child.getAttribute("ref"));
                    break;
            }
            return profil;
        },
        getCommonParam:function(sid){
            var node = $("[sid="+sid+"]");
            var param;
            node.find("> *").each(function(){
                switch(this.nodeName){
                    case "float":
                        param = parseFloat(this.textContent);
                        break;
                    case "float2":
                    case "float3":
                    case "float4":
                        param = glQuery.collada.parseFloatArray(this.textContent);
                        break;
                    case "sampler2D":
                        break;
                }
        });
        if(!param){
            param = 0.0;
        }
        return param;
    },
    bindStandardMaterial:function(){
        var material = {};
        material.material = {};
        material.material.material = {};
        material.material.material.phong = {
            ambient: [0,0,0,1],
            diffuse: [0.4, 0.4, 0.4,1],
            emission: [0,0,0,1],
            index_of_refraction: 1,
            reflective: [0,0,0,1],
            reflectivity:0,
            shininess: 50,
            specular : [0.8, 0.8, 0.8,1],
            transparency :0,
            transparent:[0,0,0,1]
        };
        
        return material;
    }
};
})(glQuery, jQuery );

(function( glQuery,$, undefined ) {
    
    glQuery.collada.mesh = {
        debug:true,
        instanceMesh:function(node,data){
            if(this.debug){
                console.log("glQuery.collada.mesh.instanceMesh");
                console.log(data);
                console.log(node);
            }
            var self = this;
            var mesh = {};
            //var p = "";
            //var verticesNodes;
            //var input;
            this.data = data.data;
            this.meta = data.meta;
            mesh.source = {};
            mesh.primitiveElements = {};
            for(var i = 0; i< node.children.length;i++){
                var childNode = node.children.item(i);
                if(this.debug){
                    console.info(childNode.nodeName);
                }
                switch(childNode.nodeName){
                    case "source":
                        mesh.source[childNode.getAttribute("id")] = self.getSource(childNode);
                        break;
                    case "vertices":
                        mesh.vertices = {};
                        for(var k = 0; k< childNode.children.length;k++){
                            var child = childNode.children.item(k);
                            if(this.debug){
                                console.info(child.nodeName);
                            }
                            if(child.nodeName === "input"){
                                mesh.vertices[child.getAttribute("semantic")] = child.getAttribute("source");
                            }
                        }
                        break;
                    case "lines":
                    case "linestrips":
                    case "polylist":
                    case "triangles":
                    case "trifans":
                    case "tristrips":
                        var materialUrl = childNode.getAttribute("material");
                        if(materialUrl){
                            mesh.materialUrl = materialUrl;                            
                        }else{
                            mesh.materialUrl = "material";                      
                        }
                        mesh.primitiveElements = self.parsePrimitiveElements(childNode,childNode.nodeName);
                        break;
                    case "polygons":
                        break;
                    case "extra"://Coming Soon!
                        break;
                }
            }
            mesh = this.putSourceAndPrimitiveTogether(mesh);
            return mesh;
        },
        putSourceAndPrimitiveTogether:function(data){
            var mesh = {};
            mesh.materialUrl = data.materialUrl;
            var source;
            for(var key in data.primitiveElements){
                source = data.source[(data.primitiveElements[key]["source"]).toString().replace("#","")];
                if(key === "VERTEX"){
                    source = data.source[(data.vertices.POSITION).toString().replace("#","")];
                }
                    
                mesh[key] = {
                    "vertices":this.parseSource(source),
                    "indices":data.primitiveElements[key]["p"]
                };
            }
            return mesh;
        },
        parseSource:function(source){
            var vertices = [];
            var length = source.accessor.count;
            var stride = source.accessor.stride;
            var param = source.accessor.param;
            if(stride === 3 && param.X === "float" && param.Y === "float" && param.Z === "float"){
                for(var i = 0;i<length;i++){
                    switch(this.meta.upAxis){
                        case 0:
                            vertices[i*stride+0] = source.array_element[i*stride+0];
                            vertices[i*stride+1] = source.array_element[i*stride+1];
                            vertices[i*stride+2] = source.array_element[i*stride+2];
                            break;
                        case 1:
                            vertices[i*stride+0] = source.array_element[i*stride+0];
                            vertices[i*stride+1] = source.array_element[i*stride+2];
                            vertices[i*stride+2] = (-1*source.array_element[i*stride+1]);
                            break;
                        case 2:
                            vertices[i*stride+0] = (-1*source.array_element[i*stride+1]);
                            vertices[i*stride+1] = source.array_element[i*stride+0];
                            vertices[i*stride+2] = source.array_element[i*stride+2];
                            break;
                    }
                }
            }else{
                
            }
            return vertices;
            
        },
        parseInput:function(node){
            if(this.debug){
                console.log("glQuery.collada.mesh.parseInput");
            }
            var input = {};
            var offset = 0;
            for(var i = 0; i< node.children.length;i++){
                var childNode = node.children.item(i);
                if(this.debug){
                    console.info(childNode.nodeName);
                }
                if(childNode.nodeName === "input"){
                    offset = Math.max(offset, parseInt(childNode.getAttribute("offset"),10));
                    input[childNode.getAttribute("semantic")] = {
                        "source":childNode.getAttribute("source"),
                        "offset":parseInt(childNode.getAttribute("offset"),10)
                    };   
                }
            }
            input.offset = offset;
            return input;
        },
        parsePrimitiveElements:function(node,primitiveElement){
            var input = this.parseInput(node);
            var primitiveElements = {};
            var p = glQuery.collada.parseIntArray(glQuery.collada.getChildNodeByName(node,"p").textContent);
            var output = {};
            var count = node.getAttribute("count");
            if(this.debug){
                console.log("glQuery.collada.mesh.parsePrimitiveElements");
                console.log(primitiveElement);
                console.log(p);
                console.log(input);
                console.log(node);
            }
            if(primitiveElement === "polylist"){
                var vcount = glQuery.collada.parseIntArray($(node).find("vcount").text());
                primitiveElements = this.parse[primitiveElement](input,p,vcount,count);
            }else{
                primitiveElements = this.parse[primitiveElement](input,p,count);
            }
            for(var key in primitiveElements){
                output[key] = {
                    "source":input[key]["source"],
                    "p":primitiveElements[key]
                };
            }
            if(this.debug){
                console.log(primitiveElements);
            }
            return output;
            
        },
        parse:{
            triangles:function(input,p){
                var primitiveElements = [];
                for(var i = 0;i<=input.offset;i=i){
                    i = i+1;
                    primitiveElements[(i-1)] = [];
                    for(var k = 0;k <=(p.length/(input.offset+1));k++){
                        primitiveElements[(i-1)][k] = p[k*(input.offset+1)+(i-1)];
                    }
                }
                
                var returns = [];
                for(var key in input){
                    if(key !== "offset"){
                        returns[key] = primitiveElements[input[key].offset];                  
                    }
                }
                return returns;
                
            },
            lines:function(input,p){
                console.log(input);
                console.log(p);
            },
            polylist:function(input,p,vcount,count){
                console.log(count);
                var length = 0;
                for(var c = 0;c<vcount.length;c++){
                    if(vcount[c]<3){
                        return false;
                    }else{
                        length = length + 3 +((vcount[c]-3)*3);
                    }
                }
                var primitiveElements = [];
                for(var i = 0;i<=input.offset;i=i){
                    i = i+1;
                    primitiveElements[(i-1)] = new Int32Array(length);
                    var pos = 0;
                    var pos2 = 0;
                    for(var k = 0;k<vcount.length;k++){
                        if(vcount[k]<3){
                            return false;
                        }else if(vcount[k]>3){
                            var tri = [];
                            for(var a=0;a<vcount[k];a++){
                                tri[a] = p[(a*(input.offset+1)+(i-1)+pos)];
                            }
                            tri = glQuery.collada.mesh.createTriganlesByPolygons(tri);
                            for(var j=0;j<tri.length;j++){
                                if(tri[j] === undefined){
                                    break;
                                }
                                primitiveElements[(i-1)][j+pos2]= tri[j];
                            }
                            pos2 = pos2 + tri.length;
                        }else{
                            
                            for(var b=0;b<3;b++){
                                if(p[b+((input.offset+1)*pos)] === undefined){
                                    break;
                                }
                                primitiveElements[(i-1)][b+pos2] = p[(b*(input.offset+1)+(i-1)+pos)];
                                
                            }
                            pos2 = pos2 + 3;
                        }
                        pos = pos + (vcount[k]*(input.offset+1));
                    }
                }
                var returns = [];
                for(var key in input){
                    if(key !== "offset" && key !== "VERTEX"){
                        returns[key] = primitiveElements[input[key].offset];   
                    }else if(key === "VERTEX"){
                        returns[key] = primitiveElements[input[key].offset];  
                    }
                }
                return returns;
            }
        },
        checkPrimitiveElements:function(primitiveElements){
            for(var k=0;k<(primitiveElements.length)/3;k++){
                if(primitiveElements[k*3] === primitiveElements[k*3+1]){
                    console.error("Tri:"+k+" => "+primitiveElements[k*3]);
                }
                if(primitiveElements[k*3+2] === primitiveElements[k*3+1]){
                    console.error("Tri:"+k+" => "+primitiveElements[k*3+1]);
                    
                }
                if(primitiveElements[k*3] === primitiveElements[k*3+2]){
                    console.error("Tri:"+k+" => "+primitiveElements[k*3]);   
                }
            }
        },
        createTriganlesByPolygons:function(indices){
            var indi = [];
            for(var m=0;m<(indices.length-2);m++){
                indi[m*3] = indices[0];
                indi[m*3+1] = indices[1+m];
                indi[m*3+2] = indices[2+m];
            }
            return indi;
        },
        getSource:function(node){//Up_axis
            var self = this;
            var source = {};
            for(var i = 0; i< node.children.length;i++){
                var childNode = node.children.item(i);
                if(this.debug){
                    console.info(childNode.nodeName);
                }
                switch(childNode.nodeName){
                    case "bool_array":
                        source.array_element = glQuery.collada.parseBoolArray(childNode.textContent);
                        break;
                    case "float_array":
                        source.array_element = glQuery.collada.parseFloatArray(childNode.textContent);
                        break;
                    case "int_array":
                        source.array_element = glQuery.collada.parseIntArray(childNode.textContent);
                        break;
                    case "Name_array"://Coming Soon!
                        break;
                    case "SIDREF_array"://Coming Soon!
                        break;
                    case "token_array"://Coming Soon!
                        break;
                    case "IDREF_array"://Coming Soon!
                        break;
                    case "technique_common":
                        source.accessor = self.getTechniqueCommon(childNode);
                        
                        break;
                    case "technique":
                        break;
                }
            }
            return source;
        },
        getTechniqueCommon:function(node){
            var self = this;
            var accessor = {};
            for(var i = 0; i< node.children.length;i++){
                var childNode = node.children.item(i);
                if(this.debug){
                    console.info(childNode.nodeName);
                }
                if(childNode.nodeName === "accessor"){
                    accessor.param = self.getAccessor(childNode);
                    accessor.count = childNode.getAttribute("count");
                    if(childNode.getAttribute("stride")){
                        accessor.stride = childNode.getAttribute("stride");
                    }
                    if(childNode.getAttribute("offset")){
                        accessor.offset = childNode.getAttribute("offset");
                    }
                }
            }
            return accessor;
        },
        getAccessor:function(node){
            var param = {};
            for(var i = 0; i< node.children.length;i++){
                var childNode = node.children.item(i);
                if(this.debug){
                    console.info(childNode.nodeName);
                }
                if(childNode.nodeName === "param"){
                    param[childNode.getAttribute("name")] = childNode.getAttribute("type");
                }
            }
            return param;
        }
    };
    
    glQuery.collada.geometry = {
        instanceGeometry:function(uri, data){
            var self = this;
            var geometry = {};
            this.data = data.data;
            this.meta = data.meta;
            this.geometry = glQuery.collada.parseURI(uri, this.data).get(0);

            for(var i = 0; i<  this.geometry.children.length;i++){
                var childNode =  this.geometry.children.item(i);
                if(this.debug){
                    console.info(childNode.nodeName);
                }
                switch(childNode.nodeName){
                    case "mesh":
                        geometry.mesh = glQuery.collada.mesh.instanceMesh(childNode,self);
                        break;
                    case "convex_mesh"://Coming Soon!
                        break;
                    case "extra"://Coming Soon!
                        break;
                }
            }
            return geometry;
        }
    };
})(glQuery ,jQuery);

(function( glQuery, undefined ) {
    
    glQuery.collada.object = {
        
    };
})(glQuery );

(function( glQuery,$, undefined ) {
    
    glQuery.collada.scene = {
        data:{},
        meta:{},
        debug:false,
        parse:function(file){
            if(this.debug){
                console.log("glQuery.collada.scene -> parse(file: " + file + ")");
            }
            var self = this;
            glQuery.collada.getCollada(
                file,
                function(data,meta){
                    self.instanceScene(data,meta);
                },
                function(e){
                    console.log("glQuery.collada.scene -> parse() => error " + e);
                }
            );
        },
        instanceScene:function(data,meta){
            if(this.debug){
                console.log(data);
            }
            var instance = "";
            var instanceUrl = "";
            this.data = data;
            this.meta = meta;

            var node = glQuery.collada.getChildNodeByName(data,"scene"); 

            for(var k = 0; k < node.children.length;k++){
                var childNode = node.children.item(k);
                if(this.debug){
                    console.info(childNode.nodeName);
                }
                var nodeName = childNode.nodeName;
                var pre = nodeName.split('_');
                pre = pre[0];
                if(pre === "instance"){
                    instance = nodeName ;
                    instanceUrl = childNode.getAttribute("url");
                }
            }
            switch(instance){
                case "instance_physics_scene":
                    this.physicsScene(instanceUrl);
                    break;
                case "instance_visual_scene":
                    this.visualScene(instanceUrl);
                    break;
                default:
                    console.log("no more types are defined");
                    break;
            }
            
            glQuery.renderWorker.postMessage("objects");
            glQuery.imageWorker.postMessage("imageLoaded");
        },
        visualScene:function(url){
            var scene = $(this.data).find(url).get(0);
            if(this.debug){
                console.log(url);
                console.log(scene);
            }
            var nodes = this.getNodes(scene);
            glQuery.progressBarStep("loadingmodels",30);
            for(var key in nodes){
                this.createObjectByNode(nodes[key]);
            }
            
        },
        createObjectByNode:function(node){
            var object = {};
            object.id = node.getAttribute("id");
            object.modelViewMatrix = mat4.create();
            object.modelViewMatrix = mat4.identity();
            object.position = [0,0,0];

            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child.nodeName);
                }
                switch(child.nodeName){
                    case "lookat"://Coming Soon!
                        break;
                    case "matrix"://Coming Soon!
                        break;
                    case "rotate":
                        var rotate = glQuery.collada.parseFloatArray(child.textContent);
                        if(rotate[3] !== 0){
                            object.modelViewMatrix = mat4.rotate(
                                object.modelViewMatrix,
                                rotate[3], 
                                glQuery.collada.sortCoord([rotate[0],rotate[1],rotate[2]],this.meta.upAxis)
                            );
                        }
                        break;
                    case "scale":
                        var scale = glQuery.collada.parseFloatArray(child.textContent);
                        if(scale[0] !== 1 && 
                            scale[1] !== 1 && 
                            scale[2] !== 1 || 
                            scale[0] !== 0 && 
                            scale[1] !== 0 && 
                            scale[2] !== 0 ){
                            object.modelViewMatrix = mat4.scale(
                                object.modelViewMatrix, 
                                glQuery.collada.sortCoord(scale,this.meta.upAxis)
                            );
                        }
                        break;
                    case "skew"://Coming Soon!
                        break;
                    case "translate":
                        var translate = glQuery.collada.parseFloatArray(child.textContent);
                        object.position = translate;
                        object.modelViewMatrix = mat4.translate(
                            object.modelViewMatrix, 
                            glQuery.collada.sortCoord(translate,this.meta.upAxis)
                        );
                        break;
                    case "instance_camera":
                        object.type = "camera";
                        object.camera = glQuery.collada.camera.instanceCamera(child.getAttribute("url"), this);
                        object.lookAt = glQuery.camera.createLookAtByMvMatrix(object.modelViewMatrix);
                        break;
                    case "instance_controller"://Coming Soon!
                        break;
                    case "instance_geometry":
                        object.type = "object";
                        object.geometry = glQuery.collada.geometry.instanceGeometry(
                            child.getAttribute("url"), 
                            this
                        );
                        
                        if($(child).find("bind_material").is("bind_material")){
                            object.material = glQuery.collada.material.bindMaterial(
                                $(child).find("bind_material"),
                                this
                            );
                        }
                        else{
                            object.material = glQuery.collada.material.bindStandardMaterial();
                        }
                        glQuery.object.add(
                            object.id, 
                            object.type, 
                            "test", 
                            object.geometry.mesh, 
                            object.material[object.geometry.mesh.materialUrl].material, 
                            {
                                "mvMat4":object.modelViewMatrix,
                                "position":object.position
                            }
                        );
                        break;
                    case "instance_light":
                        object.type = "light";
                        object.light = glQuery.collada.light.instanceLight(child.getAttribute("url"), this);
                        glQuery.light.add(
                            object.id, 
                            "test", 
                            object.light, 
                            {
                                "mvMat4":object.modelViewMatrix,
                                "position":object.position
                            }
                        );
                        break;
                    case "instance_node"://Coming Soon!
                        break;
                    case "asset"://Coming Soon!
                        break;
                }
            }
        },
        getNodes:function(node){
            var nodes = [];
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child.nodeName);
                }
                var nodeName = child.nodeName;
                var pre = nodeName.split('_');
                pre = pre[0];
                if(pre === "node"){
                    nodes[nodes.length] = child;
                }
            }
            return nodes;
        }
    };
})(glQuery, jQuery );

(function( glQuery, undefined ) {
    
    glQuery.collada.textures = {
        
    };
})(glQuery );

(function( glQuery, undefined ) {

    glQuery.blender = {
        
    };
})(glQuery);
(function( glQuery, undefined ) {
    
    glQuery.light.ambient = {
        
    };
})(glQuery );
(function( glQuery, undefined ) {
    
    glQuery.light.directional = {
        
    };
})(glQuery );
(function( glQuery, undefined ) {
    
    glQuery.light = {
        shaderLight:{
            MAX_SPOT_LIGHTS                         :0,
            MAX_POINT_LIGHTS                        :0,
            MAX_DIR_LIGHTS                          :0   ,
            MAX_AMBIENT_LIGHTS                          :0            
        },
        lights:[],
        art:[],
        id:[],
        i:0,
        add:function(id,art,lightData,direction){
            var light = new NormLight(id);
            light.setArt(art);
            light.setArt(lightData.type);
            light.setLightType(lightData.type);
            light.color = lightData[lightData.type].color;
            //var pos;
            var dir;
            switch(lightData.type){
                case "point":
                    lightData.point.position = direction.position;
                    delete lightData.point.color;
                    light.setLightData(lightData.point);
                    this.shaderLight.MAX_POINT_LIGHTS = this.shaderLight.MAX_POINT_LIGHTS + 1;
                    break;
                case "ambient":
                    delete lightData.ambient.color;
                    light.setLightData(lightData.ambient);   
                    this.shaderLight.MAX_AMBIENT_LIGHTS = this.shaderLight.MAX_AMBIENT_LIGHTS + 1;                 
                    break;
                case "spot":
                    lightData.spot.position = direction.position;
                    dir = vec3.create([0,-1,0]);
                    dir = mat4.multiplyVec3(direction.mvMat4, dir);
                    
                    lightData.spot.direction = dir;
                    delete lightData.spot.color;
                    light.setLightData(lightData.spot);
                    this.shaderLight.MAX_SPOT_LIGHTS = this.shaderLight.MAX_SPOT_LIGHTS + 1;
                    break;
                case "directional":
                    dir = vec3.create([0,-1,0]);
                    dir = mat4.multiplyVec3(direction.mvMat4, dir);
                    lightData.directional.direction = dir;
                    delete lightData.directional.color;
                    light.setLightData(lightData.directional);
                    this.shaderLight.MAX_DIR_LIGHTS = this.shaderLight.MAX_DIR_LIGHTS + 1;
                    break;
            }
            
            this.lights[light.i] = light;
        },
        getLightById:function(id,context){
            console.log(context);
            return [this.id[id]];
        },
        getLightByArt:function(art,context){  
            console.log(context);     
            return this.art[art];
        },
        uniformLighting:function(shader){
            var ambientLights = [];
            var pointLights = [];
            var spotLights = [];
            var directionalLights = [];
            for(var key in this.lights){
                switch(this.lights[key]["lightType"]){
                    case "point":
                        pointLights[pointLights.length] = {
                            color : this.lights[key]["color"],
                            position : this.lights[key]["lightData"]["position"],
                            constantAttenuation : this.lights[key]["lightData"]["constantAttenuation"],
                            linearAttenuation : this.lights[key]["lightData"]["linearAttenuation"],
                            distance : (this.lights[key]["lightData"]["distance"] === undefined)?0:this.lights[key]["lightData"]["distance"],
                            quadraticAttenuation : this.lights[key]["lightData"]["quadraticAttenuation"]
                        };
                        break;
                    case "spot":
                        pointLights[pointLights.length] = {
                            color : this.lights[key]["color"],
                            position : this.lights[key]["lightData"]["position"],
                            distance : (this.lights[key]["lightData"]["distance"] === undefined)?0:this.lights[key]["lightData"]["distance"]
                        };
                        break;
                    case "directional":
                        directionalLights[directionalLights.length] = {
                            color : this.lights[key]["color"],
                            direction : this.lights[key]["lightData"]["direction"]
                        };
                        break;
                    //case "ambient":
                    default:
                        ambientLights[ambientLights.length] = {
                            color : this.lights[key]["color"]
                        };
                        break;
                }
            }
            if(spotLights.length !== 0){
            
            }
            if(pointLights.length !== 0){
                var pointColors                 = new Float32Array((pointLights.length*3));
                var pointPosition               = new Float32Array((pointLights.length*3));
                var pointDistance               = new Float32Array((pointLights.length));
                var pointLinearAttenuation      = new Float32Array((pointLights.length));
                var pointQuadraticAttenuation   = new Float32Array((pointLights.length));
                var pointConstantAttenuation    = new Float32Array((pointLights.length));
                
                for(var i=0;i<directionalLights.length;i++){
                    pointColors[i*3+0]              = pointLights[i]["color"][0];
                    pointColors[i*3+1]              = pointLights[i]["color"][1];
                    pointColors[i*3+2]              = pointLights[i]["color"][2];
                    pointPosition[i*3+0]            = pointLights[i]["position"][0];
                    pointPosition[i*3+1]            = pointLights[i]["position"][1];
                    pointPosition[i*3+2]            = pointLights[i]["position"][2];
                    pointConstantAttenuation[i]     = pointLights[i]["constantAttenuation"];
                    pointDistance[i]                = pointLights[i]["distance"];
                    pointLinearAttenuation[i]       = pointLights[i]["linearAttenuation"];
                    pointQuadraticAttenuation[i]    = pointLights[i]["quadraticAttenuation"];
                }
                glQuery.gl.uniform3fv(shader["uniforms"]["light"]["uPointLightPosition"]["location"]                ,pointPosition);
                glQuery.gl.uniform3fv(shader["uniforms"]["light"]["uPointLightColor"]["location"]                   ,pointColors);
                glQuery.gl.uniform1fv(shader["uniforms"]["light"]["uPointLightDistance"]["location"]                ,pointDistance);
                //glQuery.gl.uniform1fv(shader["uniforms"]["light"]["uPointLightConstantAttenuation"]["location"]     ,pointConstantAttenuation);
                //glQuery.gl.uniform1fv(shader["uniforms"]["light"]["uPointLightLinearAttenuation"]["location"]       ,pointLinearAttenuation);
                //glQuery.gl.uniform1fv(shader["uniforms"]["light"]["uPointLightQuadraticAttenuation"]["location"]    ,pointQuadraticAttenuation);
            
            }
            if(directionalLights.length !== 0){
                var directionalColors = new Float32Array((directionalLights.length*3));
                var directionalDirection = new Float32Array((directionalLights.length*3));
                for(var k=0;k<directionalLights.length;k++){
                    directionalColors[k*3+0] = directionalLights[k]["color"][0];
                    directionalColors[k*3+1] = directionalLights[k]["color"][1];
                    directionalColors[k*3+2] = directionalLights[k]["color"][2];
                    directionalDirection[k*3+0] = directionalLights[k]["direction"][0];
                    directionalDirection[k*3+1] = directionalLights[k]["direction"][1];
                    directionalDirection[k*3+2] = directionalLights[k]["direction"][2];
                }
                glQuery.gl.uniform3fv(shader["uniforms"]["light"]["uDirectionalLightDirection"]["location"],directionalDirection);
                glQuery.gl.uniform3fv(shader["uniforms"]["light"]["uDirectionalLightColor"]["location"],directionalColors);
            }
            if(ambientLights.length !== 0){
                var ambientColors = new Float32Array((ambientLights.length*3));
                for(var j=0;j<directionalLights.length;j++){
                    ambientColors[j*3+0] = ambientLights[j]["color"][0];
                    ambientColors[j*3+1] = ambientLights[j]["color"][1];
                    ambientColors[j*3+2] = ambientLights[j]["color"][2];
                }
                glQuery.gl.uniform3fv(shader["uniforms"]["light"]["uAmbientLightColor"]["location"],ambientColors);
            }
        }
    };
    var NormLight = function(id){
        this.id                 = 0;
        this.i                  = 0;
        this.type               = "light";
        this.art                = [];
        this.light              = {};
        this.viewAble           = true;
        this.color              = vec3.create();
        this.lightData          = {};
        this.lightType          = 0;
        
        this.id             = id;
        this.i              = glQuery.light.i;
        glQuery.light.i     = glQuery.light.i + 1;
        
        glQuery.light.id[id]  = this.i;
        
        this.getType = function(){
            return this.type;
        };
        
        this.setArt = function(art){
            this.art[this.art.length] = art;
            
            if(!glQuery.light.art[this.art]){
                glQuery.light.art[this.art] = [];
            }
            glQuery.light.art[this.art][glQuery.light.art[this.art].length] = this.i;
        };
        this.getArt = function(){
            return this.art;
        };
        
        this.setLightType = function(lightType){
            this.lightType = lightType;
        };
        this.getLightType = function(){
            return this.lightType;
        };
        this.setViewAble = function(viewAble){
            this.viewAble = viewAble;
        };
        this.getViewAble = function(){
            return this.viewAble;
        };
        
        this.setLightData = function(lightData){
            this.lightData = lightData;
        };
        this.getLightData = function(){
            return this.lightData;
        };
        return this;
    };
    
    /*NormBuffer = function(){
        this.itemSize = 3;
        
        return this;
    };*/
})(glQuery );
(function( glQuery, undefined ) {
    
    glQuery.light.point = {
        
    };
})(glQuery );
(function( glQuery, undefined ) {
    
    glQuery.light.spot = {
        
    };
})(glQuery );
(function( glQuery, undefined ) {
    
    glQuery.color = {
        
    };
})(glQuery);
(function( glQuery, undefined ) {

    glQuery.material = {
        createShaderOptions:function(material){
            var shaderOptions = {
                "fragmentType" : "test",
                "USE_TEXTURE" : 0,
                "USE_TEXTURES" : {}
            };
            for(var key in material){
                shaderOptions["fragmentType"] = key;
            }
            for(var keyOptions in material[shaderOptions["fragmentType"]]){
                switch(keyOptions){
                    case "emission":
                    case "ambient":
                    case "diffuse":
                    case "specular":
                        if(!material[shaderOptions["fragmentType"]][keyOptions]["type"]){
                            
                        }else{
                            shaderOptions["USE_TEXTURE"] = shaderOptions["USE_TEXTURE"] + 1;
                            shaderOptions["USE_TEXTURES"]["USE_" + keyOptions.toUpperCase() + "_TEXTURE"] = true;
                        }
                }
            }
            return shaderOptions;
        },
        uniformMaterial:function(shader, material){
            var useTexture = false;
            for(var key in shader["uniforms"][shader["type"]]){
                useTexture = false;
                switch (key){
                    case "fvSpecular":
                        if(shader["options"]["USE_TEXTURES"]["USE_SPECULAR_TEXTURE"] && 
                            key === "fvSpecular"){
                            useTexture = true;
                        }
                        break;
                    case "fvEmission":
                        if(shader["options"]["USE_TEXTURES"]["USE_SPECULAR_TEXTURE"] && 
                            key === "fvEmission"){
                            useTexture = true;
                        }
                        break;
                    case "fvAmbient":
                        if(shader["options"]["USE_TEXTURES"]["USE_SPECULAR_TEXTURE"] && 
                            key === "fvAmbient"){
                            useTexture = true;
                        }
                        break;
                    case "fvDiffuse":
                        if(shader["options"]["USE_TEXTURES"]["USE_SPECULAR_TEXTURE"] && 
                            key === "fvDiffuse"){
                            useTexture = true;
                        }
                        break;
                    case "fShininess":
                        break;
                }
                
                if(useTexture){
                    
                }else{
                    var color = material[shader["type"]][key.replace("fv","").toLowerCase()];
                    var glUniformData = shader["uniforms"][shader["type"]][key];
                    var glLocation = glUniformData["location"];
                    if(glLocation != null){
                        glQuery.gl.uniform4f(glLocation,color[0],color[1],color[2],color[3]);
                    }
                }
            }
        }
    };
})(glQuery);
(function( glQuery, undefined ) {
    
    glQuery.textures = {
        
    };
})(glQuery );
(function( glQuery, undefined ) {

    glQuery.mesh = {
        Vertex:{
            Positions:{},
            Normals:{},
            Indices:{},
            BBox:{
                min:[0,0,0],
                max:[0,0,0]}
            },
            createNormalsArray:function(NormalIndices,VertexIndices,oldNormals,vertexNum){
                //Muss noch getestet auf funktion
                var valPositionIndices = 0;
                var valNormalsIndices = 0;
                
                var normals = new Float32Array(vertexNum);
                for(var i = 0;i<(VertexIndices.length);i++){
                    valPositionIndices  = VertexIndices[i];
                    valNormalsIndices   = NormalIndices[i];
                    
                    normals[valPositionIndices*3]   = oldNormals[valNormalsIndices*3];
                    normals[valPositionIndices*3+1] = oldNormals[valNormalsIndices*3+1];
                    normals[valPositionIndices*3+2] = oldNormals[valNormalsIndices*3+2];
                }
                return normals;
            }
        
    };
})(glQuery);
(function( glQuery,mat3, undefined ) {

    glQuery.object = {
        init:function(){
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
            console.time("glQuery.object.add()");
            
            var object = new NormObject(id);
            object.setType(type);
            object.setArt(art);
            object.setViewAble(true);
            object.setMvMat4(objectData.mvMat4,objectData.position);
            object.setMaterial(material);
            
            object.setShaderProgram(glQuery.shader.getShaderProgramKey(glQuery.material.createShaderOptions(material)));
            
            object.setBuffers(this.createObjectBuffers(mesh,glQuery.shader.shaders[object.shaderProgramKey]),glQuery.shader.shaders[object.shaderProgramKey]);
            
            this.objects[object.i] = object;
            console.time("glQuery.object.add()");
            return true;
        },
        existId:function(id){
            if(glQuery.object.id[id] !== undefined){
                return true;
            }
            if(glQuery.light.id[id] !== undefined){
                return true;
            }
            if(glQuery.gui.id[id] !== undefined){
                return true;
            }
            return false;
        },
        createObjectBuffers:function(mesh,shader){
            var Buffers = {};
            
            Buffers.VerticesBuffer = glQuery.gl.createBuffer();
            glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.VerticesBuffer);
            glQuery.gl.bufferData(glQuery.gl.ARRAY_BUFFER, new Float32Array(mesh.VERTEX.vertices), glQuery.gl.STATIC_DRAW);
            
            if (shader["attribute"]["aNormal"]["location"] !== -1) {
                Buffers.normal = glQuery.gl.createBuffer();
                glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.normal);
                glQuery.gl.bufferData(glQuery.gl.ARRAY_BUFFER, glQuery.mesh.createNormalsArray(mesh.NORMAL.indices, mesh.VERTEX.indices, mesh.NORMAL.vertices,mesh.VERTEX.vertices.length), glQuery.gl.STATIC_DRAW);
            }
            
            if (shader["attribute"]["aTextureCoord"]["location"] !== -1) {
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
            console.log(context);
            return [this.id[id]];
        },
        getObjectByArt:function(art,context){ 
        //getObjectByArt:function(Art,selector){  
            /* 
            glQuery.selection[selector] = this.art[Art]; 
            glQuery.action.actionHandler(selector);
            glQuery.animation.animationHandler(selector);*/    
            console.log(context);   
            return this.art[art];
        },
        getObjectByType:function(type,context){ 
        //getObjectByType:function(Type,selector){ 
            /*
            glQuery.selection[selector] = this.type[Type];  
            glQuery.action.actionHandler(selector);
            glQuery.animation.animationHandler(selector);*/
            console.log(context);
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
    
    
    var NormObject = function(id){
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
            if(!vec){
                vec = [0,0,0];
            }
            this.mvMat4 = mat4.translate(this.mvMat4,vec3.subtract(vec, this.vObjectPos));
            this.vObjectPos = vec3.create(vec);
            this.setNoMat3();
        };
        this.translateVec3ObjectPos = function(vec){
            if(!vec){
                vec = [0,0,0];
            }
            this.mvMat4 = mat4.translate(this.mvMat4, vec);
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
        };
        this.setShaderProgram = function(key){
            this.shaderProgramKey = key;
        };
        return this;
    };
    
    /*var NormBuffer = function(){
        this.itemSize = 3;
        return this;
    };*/

})(glQuery,mat3);
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

( function () {

   var lastTime = 0;
   var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
   for ( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++ x ) {
      window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
      window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || 
      window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
   }
   if ( !window.requestAnimationFrame ) {
      window.requestAnimationFrame = function ( callback, element ) {
         console.log(element);
         var currTime = Date.now(), timeToCall = Math.max( 0, 16 - ( currTime - lastTime ) );
         var id = window.setTimeout( function() {callback( currTime + timeToCall );}, timeToCall );
         lastTime = currTime + timeToCall;
         return id;
      };
   }
   if ( !window.cancelAnimationFrame ) {
      window.cancelAnimationFrame = function ( id ) {clearTimeout( id );};
   }

}() );

(function( glQuery,console, undefined ) {
  glQuery.scene = {
      /**
       * @function createRender
       * 
       * @description create the render by an event of the renderWorker
       * 
       * @param first boolean
       * 
       */
      createRender:function(first){
         var self = this;
         if(first){
            this.showFramerate();
         }
         this.enableRender = false;
         
         glQuery.renderWorker.onmessage = function(event){
            if(event.data){
               glQuery.camera.cameraMatrix(true);
               this.tenthRendering = 0;
               console.log("glQuery.scene.createRender() => init the render loop");
               
               self.renderLoop();
            }
         };
      },
      /**
       * @function renderer
       * 
       * @description initalize the renderer
       * 
       */
      renderLoop:function(resize){
        if(this.debug){
         console.log(resize);          
        }
        window.requestAnimationFrame(glQuery.scene.renderLoop);
        if(glQuery.allowrender){
          glQuery.scene.renderer();
        }
      },
      /**
       * @function renderer
       * 
       * @description Render the scene 
       * 
       */
      renderer:function(){
        this.tenthRendering = this.tenthRendering+1;
        if(this.tenthRendering === 10){
          console.time("glQuery.scene.render()");
        }
        glQuery.gl.clear(glQuery.gl.COLOR_BUFFER_BIT | glQuery.gl.DEPTH_BUFFER_BIT);
        glQuery.gl.clearColor(1.0, 1.0, 1.0, 1.0);
        for(var key in glQuery.object.objects){
          this.drawObject(glQuery.object.objects[key]);
        }
        if(this.tenthRendering === 10){
          console.time("glQuery.scene.render()");
        }
        //glQuery.gui.renderGui();
        this.endFrameTime = new Date().getTime();
        this.createFramerate();
        this.startFrameTime = new Date().getTime();
         
        this.setFramerate(this.framerate);  
      },
      /**
       * @function drawObject
       * 
       * @description draw Object with element data
       * 
       * @param {object} Object 
       * 
       */
      drawObject:function(Object){
        if(this.tenthRendering === 10){
          console.time("glQuery.scene.drawObject()");
        }
        var shader = glQuery.shader.shaders[Object.shaderProgramKey];
        if(this.useProgram !== Object.shaderProgramKey){
           glQuery.gl.useProgram(shader["shaderProgram"]);
           this.useProgram = Object.shaderProgramKey;
           glQuery.camera.uniformCamera(shader);
           glQuery.light.uniformLighting(shader);
        }
        
        // Hintergrund loeschen
        
        var Buffers = Object.buffers;
        
        if (shader["attribute"]["aNormal"]["location"] !== -1) {
           glQuery.gl.disableVertexAttribArray(shader["attribute"]["aNormal"]["location"]);
           glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.normal);
           glQuery.gl.vertexAttribPointer(shader["attribute"]["aNormal"]["location"], Buffers.itemSize, glQuery.gl.FLOAT, false, 0, 0);
           glQuery.gl.enableVertexAttribArray(shader["attribute"]["aNormal"]["location"]);
        }
        if(shader["attribute"]["aTextureCoord"]["location"] !== -1){
           glQuery.gl.disableVertexAttribArray(shader["attribute"]["aTextureCoord"]["location"]);
           glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.texcoord);
           glQuery.gl.vertexAttribPointer(shader["attribute"]["aTextureCoord"]["location"], 2, glQuery.gl.FLOAT, false, 0, 0);
           glQuery.gl.enableVertexAttribArray(shader["attribute"]["aTextureCoord"]["location"]);
            
        }
        if(shader["attribute"]["aVertex"]["location"] !== -1){
           glQuery.gl.disableVertexAttribArray(shader["attribute"]["aVertex"]["location"]);
           glQuery.gl.bindBuffer(glQuery.gl.ARRAY_BUFFER, Buffers.VerticesBuffer);
           glQuery.gl.vertexAttribPointer(shader["attribute"]["aVertex"]["location"], Buffers.itemSize, glQuery.gl.FLOAT, false, 0, 0);
           glQuery.gl.enableVertexAttribArray(shader["attribute"]["aVertex"]["location"]);
            
        }
        
        glQuery.gl.uniformMatrix4fv(
           shader["uniforms"]["common_vertex"]["uModelViewMatrix"]["location"], 
           false, 
           Object.mvMat4);
        glQuery.gl.uniformMatrix4fv(
           shader["uniforms"]["common_vertex"]["uModelWorldMatrix"]["location"], 
           false, 
           mat4.identity()
        );//Noch nicht implemtiert
        
        glQuery.material.uniformMaterial(shader, Object.material);
        glQuery.gl.bindBuffer(glQuery.gl.ELEMENT_ARRAY_BUFFER, Buffers.IndexBuffer);
        glQuery.gl.drawElements(glQuery.gl.TRIANGLES, Buffers.numIndices , glQuery.gl.UNSIGNED_SHORT, 0);
        if(this.tenthRendering === 10){
           console.time("glQuery.scene.drawObject()");
        }
      },
      setLighting:function(){
        glQuery.gl.uniform3fv(glQuery.webGL.uAmbientLight, new Float32Array([0.3, 0.3, 0.3])); 
      //glQuery.gl.uniform3fv(glQuery.webGL.uDirectionalLightColor, new Float32Array([0, 0, 0])); 
      //glQuery.gl.uniform3fv(glQuery.webGL.uDirectionalVector, new Float32Array([0.85, 0.8, 0.75])); 
      },
      moveCamera:function(){
        this.mLookAt = glQuery.camera.lookAt;
      //this.mLookAt = mat4.lookAt(this.vCamPos, this.vLookAt, [0,1,0])
      },
      makePerspective:function(){
        this.pmMatrix = mat4.create();
        this.pmMatrix = mat4.perspective(
          60, 
          (glQuery.canvasWidth/glQuery.canvasHeight), 
          0.1, 
          100, 
          this.pmMatrix
        );
      //this.pmMatrix = mat4.lookAt([0,0,0], [0,0, -6], [0,1,0], this.pmMatrix);
      },
      /**
       * @function renderAnimation
       * 
       * @description Place holder
       * 
       * @param object (mixed) -> sets the angle rotation
       * 
       * @return {mixed} object
       * 
       **/
      renderAnimation:function(object){
         return object;
      },
      /**
       * @function renderPhysics
       * 
       * @description Place holder
       * 
       * @param object (mixed) -> sets the angle rotation
       * 
       * @return {mixed} object
       * 
       **/
      renderPhysics:function(object){
         return object;
      },
      getFramerate:function(){
         return this.framerate;
      },
      setFramerate:function(frames){
         if(this.lastFramerates.length !== 29){
            this.lastFramerates[this.lastFramerates.length] = frames;
         }
         for(var i = 0;i < 29;i++){
            frames = frames + this.lastFramerates[i];
         }
         frames = frames/30;
         frames = Math.round(frames);
         if(frames >= 200){
            return true;
         }else if(frames <= 20){
            return true;                
         }
         return true;
      },
      showFramerate:function(){ 
         return true;
      },
      createFramerate:function(){
         var diff = this.endFrameTime - this.startFrameTime;
         this.framerate = Math.round(1000/diff);
         return this.framerate;
      },
      debug : false,
      useProgram:-1,
      tenthRendering:0,
      mvUniform:null,
      pmMatrix:null,
      vCamPos:[0,7,1],
      vLookAt:[0,0,-1],
      mLookAt:null,
      lastFramerates:[],
      renderObjects:[],
      renderObjectslength:0,
      createNewRenderObjects:true,
      enableRender:true,
      startFrameTime:0,
      endFrameTime:0,
      framerate:0,
      lastShowTimeFramerate:0
   };
})(glQuery,window.console );
(function( glQuery,console, undefined ) {

   glQuery.shader = {
      shaderSnippets:{
         transpose_function:[
            "mat4 transpose (mat4 mat);", 
            "mat4 transpose (mat4 mat){", 
            "   float a01 = mat[0][1],a02 = mat[0][2],a03 = mat[0][3],a12 = mat[1][2],a13 = mat[1][3],a23 = mat[2][3];",
   
            "   mat[0][1] = mat[1][0];",
            "   mat[0][2] = mat[2][0];",
            "   mat[0][3] = mat[3][0];",
            "   mat[1][0] = a01;",
            "   mat[1][2] = mat[2][1];",
            "   mat[1][3] = mat[3][1];",
            "   mat[2][0] = a02;",
            "   mat[2][1] = a12;",
            "   mat[2][3] = mat[3][2];",
            "   mat[3][0] = a03;",
            "   mat[3][1] = a13;",
            "   mat[3][2] = a23;",
            "   return mat;",
            "}",    
            "mat3 transpose (mat3 mat);",
            "mat3 transpose (mat3 mat){",  
            "   float a01 = mat[0][1],a02 = mat[0][2],a12 = mat[1][2];", 
   
            "   mat[0][1] = mat[1][0];", 
            "   mat[0][2] = mat[2][0];", 
            "   mat[2][0] = a01;", 
            "   mat[1][2] = mat[2][1];", 
            "   mat[2][0] = a02;", 
            "   mat[2][1] = a12;", 
            "   return mat;", 
            "}"   
         ].join("\n"),
         inverse_function:[
            "mat4 inverse (mat4 mat);",
            "mat4 inverse (mat4 mat){",
            //gl-matrix.js
            "   float a00 = mat[0][0], a01 = mat[0][1],a02 = mat[0][2], a03 = mat[0][3],",
            "   a10 = mat[1][0], a11 = mat[1][1],a12 = mat[1][2], a13 = mat[1][3],",
            "   a20 = mat[2][0], a21 = mat[2][1],a22 = mat[2][2], a23 = mat[2][3],",
            "   a30 = mat[3][0], a31 = mat[3][1],a32 = mat[3][2], a33 = mat[3][3],",
    
            "   b00 = a00 * a11 - a01 * a10,",
            "   b01 = a00 * a12 - a02 * a10,",
            "   b02 = a00 * a13 - a03 * a10,",
            "   b03 = a01 * a12 - a02 * a11,",
            "   b04 = a01 * a13 - a03 * a11,",
            "   b05 = a02 * a13 - a03 * a12,",
            "   b06 = a20 * a31 - a21 * a30,",
            "   b07 = a20 * a32 - a22 * a30,",
            "   b08 = a20 * a33 - a23 * a30,",
            "   b09 = a21 * a32 - a22 * a31,",
            "   b10 = a21 * a33 - a23 * a31,",
            "   b11 = a22 * a33 - a23 * a32,",
    
            "   d = (b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06),",
            "   invDet;",
                   
            "   // Calculate the determinant",
            "   if (d == 0.0) { return mat; }",
            "   invDet = 1.0 / d;",
    
            "   mat[0][0] = (a11 * b11 - a12 * b10 + a13 * b09) * invDet;",
            "   mat[0][0] = (-a01 * b11 + a02 * b10 - a03 * b09) * invDet;",
            "   mat[0][0] = (a31 * b05 - a32 * b04 + a33 * b03) * invDet;",
            "   mat[0][0] = (-a21 * b05 + a22 * b04 - a23 * b03) * invDet;",
            "   mat[1][0] = (-a10 * b11 + a12 * b08 - a13 * b07) * invDet;",
            "   mat[1][0] = (a00 * b11 - a02 * b08 + a03 * b07) * invDet;",
            "   mat[1][0] = (-a30 * b05 + a32 * b02 - a33 * b01) * invDet;",
            "   mat[1][0] = (a20 * b05 - a22 * b02 + a23 * b01) * invDet;",
            "   mat[2][0] = (a10 * b10 - a11 * b08 + a13 * b06) * invDet;",
            "   mat[2][0] = (-a00 * b10 + a01 * b08 - a03 * b06) * invDet;",
            "   mat[2][0] = (a30 * b04 - a31 * b02 + a33 * b00) * invDet;",
            "   mat[2][0] = (-a20 * b04 + a21 * b02 - a23 * b00) * invDet;",
            "   mat[3][0] = (-a10 * b09 + a11 * b07 - a12 * b06) * invDet;",
            "   mat[3][0] = (a00 * b09 - a01 * b07 + a02 * b06) * invDet;",
            "   mat[3][0] = (-a30 * b03 + a31 * b01 - a32 * b00) * invDet;",
            "   mat[3][0] = (a20 * b03 - a21 * b01 + a22 * b00) * invDet;",
    
            "   return mat;",
            "}",
            "mat3 inverseToMat3 (mat4 mat);",
            "mat3 inverseToMat3 (mat4 mat){",
            "   mat3 dest;",
            "   // Cache the matrix values (makes for huge speed increases!)",
            "   float a00 = mat[0][0], a01 = mat[0][1], a02 = mat[0][2],",
            "   a10 = mat[1][0], a11 = mat[1][1], a12 = mat[1][2],",
            "   a20 = mat[2][0], a21 = mat[2][1], a22 = mat[2][2],",
   
            "   b01 = a22 * a11 - a12 * a21,",
            "   b11 = -a22 * a10 + a12 * a20,",
            "   b21 = a21 * a10 - a11 * a20,",
   
            "   d = a00 * b01 + a01 * b11 + a02 * b21,",
            "   id;",
   
            "   if (d == 0.0) { return dest; }",
            "   id = 1.0 / d;",
   
   
            "   dest[0][0] = b01 * id;",
            "   dest[0][1] = (-a22 * a01 + a02 * a21) * id;",
            "   dest[0][2] = (a12 * a01 - a02 * a11) * id;",
            "   dest[1][0] = b11 * id;",
            "   dest[1][1] = (a22 * a00 - a02 * a20) * id;",
            "   dest[1][2] = (-a12 * a00 + a02 * a10) * id;",
            "   dest[2][0] = b21 * id;",
            "   dest[2][1] = (-a21 * a00 + a01 * a20) * id;",
            "   dest[2][2] = (a11 * a00 - a01 * a10) * id;",
   
            "   return dest;",
            "}"
         ].join("\n"),
         pars_vertex:[
            "#ifdef GL_ES",
            "   precision highp float;",
            "#endif",
            "attribute    highp       vec3 aNormal;",
            "attribute    highp       vec3 aVertex;",
            "#ifdef USE_TEXTURE",
            "   attribute    highp       vec2 aTextureCoord;",
            "#endif",


            "uniform      highp       mat4 uLookAt;",
            "uniform      highp       mat4 uPerspectiveMatrix;",
            
            "uniform      highp       mat4 uModelWorldMatrix;",
            "uniform      highp       mat4 uModelViewMatrix;",
            
            
            "#ifdef USE_TEXTURE",
            "   varying      highp       vec2 vTextureCoord;",
            "#endif",
            "varying      highp       vec3 vNormal;",
            "varying      highp       vec4 vViewPos;" ,
            "varying                  mat4 vViewMatrix;"
            
         ].join("\n"),
         vertex:[
            "   mat4 objectModel   = uModelWorldMatrix * uModelViewMatrix;",
            "   mat4 cameraModel   = uPerspectiveMatrix * uLookAt;",
            
            "   gl_Position        = cameraModel * objectModel  * vec4(aVertex, 1.0);",
            
            "   mat3 normalMatrix  = transpose(inverseToMat3(objectModel * uLookAt));",
            
            "   vNormal            = normalMatrix * aNormal;",
            
            "   #ifdef USE_TEXTURE",
            "       vTextureCoord      = aTextureCoord;",
            "   #endif",
            "   vViewPos            = vec4(aVertex, 1.0);",
            "   vViewMatrix         = objectModel * uLookAt;"
         ].join("\n"),
         fog_pars_fragment:[
            "#ifdef USE_FOG",
            "#endif"
         ].join("\n"),
         fog_fragement:[
            "#ifdef USE_FOG",
            "#endif"
         ].join("\n"),
         phong_pars_fragment: [
            "#ifdef GL_ES",
            "   precision highp float;",
            "#endif",

            "#if MAX_POINT_LIGHTS > 0",

            "   uniform        vec3    uPointLightColor[ MAX_POINT_LIGHTS ];",
            "   uniform        vec3    uPointLightPosition[ MAX_POINT_LIGHTS ];",
               
            "   uniform        float   uPointLightDistance[ MAX_POINT_LIGHTS ];",
            "   uniform        float   uPointLightQuadraticAttenuation[ MAX_POINT_LIGHTS ];",
            "   uniform        float   uPointLightLinearAttenuation[ MAX_POINT_LIGHTS ];",
            "   uniform        float   uPointLightConstantAttenuation[ MAX_POINT_LIGHTS ];",


            "#endif",
            "#if MAX_DIR_LIGHTS > 0",

            "   uniform        vec3    uDirectionalLightColor[ MAX_DIR_LIGHTS ];",
            "   uniform        vec3    uDirectionalLightDirection[ MAX_DIR_LIGHTS ];",

            "#endif",
            
            "#if MAX_SPOT_LIGHTS > 0",

            "   uniform        vec3    uSpotLightColor[ MAX_SPOT_LIGHTS ];",
            "   uniform        vec3    uSpotLightPosition[ MAX_SPOT_LIGHTS ];",
                       
            "   uniform        float   uSpotLightDistance[ MAX_SPOT_LIGHTS ];",
            "   uniform        float   uSpotLightConstantAttenuation[ MAX_SPOT_LIGHTS ];",
            "   uniform        float   uSpotLightLinearAttenuation[ MAX_SPOT_LIGHTS ];",
            "   uniform        float   uSpotLightQuadraticAttenuation[ MAX_SPOT_LIGHTS ];",
            "   uniform        float   uSpotLightFalloffAngle[ MAX_SPOT_LIGHTS ];",
            "   uniform        float   uSpotLightFalloffExponent[ MAX_SPOT_LIGHTS ];",
            "#endif",
            
            "#if MAX_AMBIENT_LIGHTS > 0",
            "   uniform        vec3 uAmbientLightColor[ MAX_AMBIENT_LIGHTS ];",
            "#endif",
            
            "#ifdef USE_DIFFUSE_TEXTURE",
            "   uniform sampler2D fvDiffuse;",
            "#else",
            "   uniform vec4 fvDiffuse;",
            "#endif",
            "#ifdef USE_AMBIENT_TEXTURE",
            "   uniform sampler2D fvAmbient;",
            "#else",
            "   uniform vec4 fvAmbient;",
            "#endif",
            "#ifdef USE_EMISSION_TEXTURE",
            "   uniform sampler2D fvEmission;",
            "#else",
            "   uniform vec4 fvEmission;",
            "#endif",
            "#ifdef USE_SPECULAR_TEXTURE",
            "   uniform sampler2D fvSpecular;",
            "#else",
            "   uniform vec4 fvSpecular;",
            "#endif",
                
            "uniform float fShininess;",
            "uniform float fTransparency;",
                
            "varying highp vec4 vViewPos;" ,
            "varying vec3 vNormal;",
            "varying mat4 vViewMatrix;",
                
            "#ifdef USE_TEXTURE",
            "   varying vec2 vTextureCoord;",
            "#endif"
         ].join("\n"),
         gui_pars_vertex: [
            "#ifdef GL_ES",
            "   precision highp float;",
            "#endif",
            "attribute    highp       vec3 aVertex;",
            "#ifdef USE_TEXTURE",
            "   attribute    highp       vec2 aTextureCoord;",
            "#endif",
            "uniform highp mat4 uOrthographicMatrix;",
            "uniform highp mat4 uGuiMatrix;",
            "#ifdef USE_TEXTURE",
            "   varying      highp       vec2 vTextureCoord;",
            "#endif"
         ].join("\n"),
         gui_vertex: [
            "   gl_Position        = uOrthographicMatrix * uGuiMatrix  * vec4(aVertex, 1.0);",
            "   #ifdef USE_TEXTURE",
            "       vTextureCoord      = aTextureCoord;",
            "   #endif"
         ].join("\n"),
         gui_pars_fragment: [
            "#ifdef GL_ES",
            "   precision highp float;",
            "#endif",
            "#ifdef USE_TEXTURE",
            "   varying vec2 vTextureCoord;",
            "   uniform sampler2D fvColor;",
            "#else",
            "   uniform vec4 fvColor;",
            "#endif"
         ].join("\n"),
         gui_fragment: [
            "#ifdef USE_TEXTURE",
            "    gl_FragColor = texture2D(fvColor,vTextureCoord);",
            "#else",
            "    gl_FragColor = fvColor;",
            "#endif"
         ].join("\n"),
         phong_fragment: [
            "vec4 fvTotalDiffuse = vec4(0.0,0.0,0.0,fTransparency);",
            "vec4 fvTotalSpecular = vec4(0.0,0.0,0.0,fTransparency);",
            "vec4 vViewPosition = vViewMatrix * vViewPos;",
            "vec4 viewPosition = normalize( vViewPosition );",
            "vec3 normal = normalize(vNormal);",
                
            "#if MAX_POINT_LIGHTS > 0",
            "    vec3 fvPointDiffuse  = vec3( 0.0 );",
            "    vec3 fvPointSpecular  = vec3( 0.0 );",
            "    for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {",
            //"        float A = uPointLightConstantAttenuation[i] + ( uPointLightDistance[i] * uPointLightLinearAttenuation[i] ) + (( uPointLightDistance[i]*uPointLightDistance[i] ) * uPointLightQuadraticAttenuation[i] );",
                                
            "        vec4 lPosition = vViewMatrix * vec4( uPointLightPosition[ i ], 1.0 );",
            "        vec3 lVector = lPosition.xyz + vViewPosition.xyz;",
          
            "        float lDistance = 1.0;",
            "        if ( uPointLightDistance[ i ] > 0.0 )",
            "            lDistance = 1.0 - min( ( length( lVector ) / uPointLightDistance[ i ] ), 1.0 );",
          
            "        lVector = normalize( lVector );",
                                
            "        float fvPointDiffuseWeight = max( dot( normal, lVector ), 0.0 );",
                                
            "        #ifdef USE_DIFFUSE_TEXTURE",
            "            fvPointDiffuse += texture2D(fvDiffuse,vTexcoord).xyz * uPointLightColor[ i ] * fvPointDiffuseWeight * lDistance;",
            "        #else",
            "            fvPointDiffuse += fvDiffuse.xyz * uPointLightColor[ i ] * fvPointDiffuseWeight * lDistance;",
            "        #endif",
                                
                                
            "        vec3 fvPointHalfVector = normalize( lVector + viewPosition.xyz );",
            "        float fvPointDotNormalHalf = max( dot( normal, fvPointHalfVector ), 0.0 );",
            "        float fvPointSpecularWeight = max( pow( fvPointDotNormalHalf, fShininess ), 0.0 );",
          
            "        #ifdef USE_SPECULAR_TEXTURE",
            "            fvPointSpecular += texture2D(fvSpecular,vTexcoord).xyz * uPointLightColor[ i ] * fvPointSpecularWeight * fvPointDiffuseWeight * lDistance;",
            //"          fvPointSpecular += texture2D(fvSpecular,Texcoord) * uPointLightColor[ i ] * fvPointSpecularWeight * lDistance;",
            "        #else",
            "            fvPointSpecular += fvSpecular.xyz * uPointLightColor[ i ] * fvPointSpecularWeight * fvPointDiffuseWeight * lDistance;",
            //"          fvPointSpecular += fvSpecular * uPointLightColor[ i ] * fvPointSpecularWeight  * lDistance;",
            "        #endif",
            "    }",
            "    fvTotalDiffuse.xyz += fvPointDiffuse.xyz;",
            "    fvTotalSpecular.xyz += fvPointSpecular.xyz;",                    
            "#endif",
                
            "#if MAX_DIR_LIGHTS > 0",
            "    vec3 fvDirDiffuse  = vec3( 0.0 );",
            "    vec3 fvDirSpecular  = vec3( 0.0 );",
            "    for ( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {",
            "        vec4 vDirection = vViewMatrix * vec4( uDirectionalLightDirection[ i ], 0.0 );",
            "        vec3 fvDirVector = normalize( vDirection.xyz );",
                                
            "        float fvDirDiffuseWeight = max( dot( vNormal, dirVector ), 0.0 );",
                                
            "        #ifdef USE_DIFFUSE_TEXTURE",
            "        fvDirDiffuse += fvDirDiffuseWeight * texture2D(fvDiffuse,vTexcoord) * uDirectionalLightColor[i];",
            "        #else",
            "        fvDirDiffuse += fvDirDiffuseWeight * fvDiffuse * uDirectionalLightColor[i];",
            "        #endif",
                                    
                                    
            "        vec3 fvDirHalfVector = normalize( fvDirVector + viewPosition );",
            "        float fvDirDotNormalHalf = max( dot( normal, fvDirHalfVector ), 0.0 );",
                                
            "        float fvDirSpecularWeight = max( pow( fvDirDotNormalHalf, fShininess ), 0.0 );",
                        
            "        #ifdef USE_SPECULAR_TEXTURE",
            "            fvDirSpecular += texture2D(fvSpecular,vTexcoord).xyz * fvDirDiffuseWeight * fvDirSpecularWeight * uDirectionalLightColor[i];",
            //"          fvDirSpecular += texture2D(fvSpecular,Texcoord)  * fvDirSpecularWeight * uDirectionalLightColor[i];",
            "        #else",
            "            fvDirSpecular += fvSpecular.xyz * fvDirDiffuseWeight * fvDirSpecularWeight * uDirectionalLightColor[i];",
            //"          fvDirSpecular += fvSpecular * fvDirSpecularWeight * uDirectionalLightColor[i];",
            "        #endif",
                                
            "    }",
            "    fvTotalDiffuse.xyz += fvDirDiffuse.xyz;",
            "    fvTotalSpecular.xyz += fvDirSpecular.xyz;",
            "#endif",
            
            "#if MAX_SPOT_LIGHTS > 0",
            "#endif",
            
            "vec3 cTotalAmbientLightColor = vec3( 0.0 );",
            "#if MAX_AMBIENT_LIGHTS > 0",
            "   for ( int i = 0; i < MAX_AMBIENT_LIGHTS; i ++ ) {", 
            "       cTotalAmbientLightColor += uAmbientLightColor[i];",
            "   }",
            "#endif",
            
                
            "#ifdef USE_AMBIENT_TEXTURE",
            "    vec4 fvTotalAmbient = texture2D(fvAmbient,vTexcoord) * vec4(cTotalAmbientLightColor,fTransparency);",
            "#else",
            "    vec4 fvTotalAmbient = fvAmbient  * vec4(cTotalAmbientLightColor,fTransparency);",
            "#endif",
                
            "#ifdef USE_EMISSION_TEXTURE",
            "    vec4 fvTotalEmission = texture2D(fvEmission,vTexcoord);",
            "#else",
            "    vec4 fvTotalEmission = fvEmission;",
            "#endif",
                
            "gl_FragColor = ( fvTotalAmbient + fvTotalEmission + fvTotalDiffuse + fvTotalSpecular );"
         ].join("\n")   
      },
      uniformsLibrary:{
         gui_vertex:{
            uGuiMatrix:{
               type:"m4",
               value:0
            },
            uOrthographicMatrix:{
               type:"m4",
               value:0                    
            }
         },
         gui_fragment:{
            fvColor:{
               type:"t_c",
               value:0
            } 
         },
         common_vertex:{
            uLookAt:{
               type:"m4",
               value:0
            },
            uPerspectiveMatrix:{
               type:"m4",
               value:0
            },
            uModelWorldMatrix:{
               type:"m4",
               value:0
            },
            uModelViewMatrix:{
               type:"m4",
               value:0
            }
         },
         phong:{
            fvDiffuse:{
               type:"t_c",
               value:0
            },
            fvAmbient :{
               type:"t_c",
               value:0
            },
            fvEmission:{
               type:"t_c",
               value:0
            },
            fvSpecular:{
               type:"t_c",
               value:0
            },
            fShininess:{
               type:"f",
               value:0
            }
         },
         light:{
            pointLight:{
               uPointLightColor:{
                  type:"v3",
                  value:0
               },
               uPointLightPosition:{
                  type:"v3",
                  value:0
               },
               
               uPointLightDistance:{
                  type:"f",
                  value:0
               },
               uPointLightQuadraticAttenuation:{
                  type:"f",
                  value:0
               },
               uPointLightLinearAttenuation:{
                  type:"f",
                  value:0
               },
               uPointLightConstantAttenuation:{
                  type:"f",
                  value:0
               }               
            },
            spotLight:{
               uSpotLightColor:{
                  type:"v3",
                  value:0
               },
               uSpotLightPosition:{
                  type:"v3",
                  value:0
               },
               
               uSpotLightDistance:{
                  type:"f",
                  value:0
               },
               uSpotLightConstantAttenuation:{
                  type:"f",
                  value:0
               },
               uSpotLightLinearAttenuation:{
                  type:"f",
                  value:0
               },
               uSpotLightQuadraticAttenuation:{
                  type:"f",
                  value:0
               },
               uSpotLightFalloffAngle:{
                  type:"f",
                  value:0
               },
               uSpotLightFalloffExponent:{
                  type:"f",
                  value:0
               }
            },
            directionalLight:{
               uDirectionalLightDirection:{
                  type:"v3",
                  value:0
               },
               uDirectionalLightColor:{
                  type:"v3",
                  value:0
               }
            },
            ambientLight:{
               uAmbientLightColor:{
                  type:"v3",
                  value:0
               }
             }
         },
         fog:{
                
         }
      },
      defineLibrary:{
         gui_vertex:{
            USE_TEXTURE:{
               type:"b",
               value:undefined
            }
         },
         common_vertex:{
            USE_TEXTURE:{
               type:"b",
               value:undefined
            }
         },
         light:{
            MAX_SPOT_LIGHTS:{
               type:"i",
               value:0
            },
            MAX_POINT_LIGHTS:{
               type:"i",
               value:0
            },
            MAX_DIR_LIGHTS:{
               type:"i",
               value:0
            },
            MAX_AMBIENT_LIGHTS:{
               type:"i",
               value:0
            }
         },
         phong:{
            USE_SPECULAR_TEXTURE:{
               type:"b",
               value:undefined
            },
            USE_DIFFUSE_TEXTURE:{
               type:"b",
               value:undefined
            },
            USE_AMBIENT_TEXTURE:{
               type:"b",
               value:undefined
            },
            USE_EMISSION_TEXTURE:{
               type:"b",
               value:undefined
            }
         }
      },
      attributeLibrary:{
            gui_vertex:{
               aTextureCoord:{
                  type:"v2",
                  value:0
               },
               aVertex:{
                  type:"v3",
                  value:0
               }
            },
            common_vertex:{
               aTextureCoord:{
                  type:"v2",
                  value:0
               },
               aVertex:{
                  type:"v3",
                  value:0
               },
               aNormal:{
                  type:"v3",
                  value:0
               }
            }
      },
      getDefinition:function(type,defined){
         var definition = [];
         var i = 0;
         for(var key in defined){
            if(this.defineLibrary[type][key]){
               if(this.defineLibrary[type][key].type === "b"){
                  if(defined[key]){
                     definition[i] = "#define "+key+" "+defined[key]+"\n";
                     i = i+1;
                  }             
               }else if(this.defineLibrary[type][key].type === "i"){
                  definition[i] = "#define "+key+" "+defined[key]+"\n";
                  i = i+1;
               }
            }
         }
         return definition.join("\n");
      },
      createVertexShaderSource: function(defined,gui){
         var shader = [];
         if(gui){
            shader = [
               this.getDefinition("gui_vertex",defined),
               this.shaderSnippets.gui_pars_vertex,
               "void main(void) {",
               this.shaderSnippets.gui_vertex,
               "}"
            ];
            return shader.join("\n");
         }
         shader = [
            this.getDefinition("common_vertex",defined),
            this.shaderSnippets.pars_vertex,
            this.shaderSnippets.transpose_function,
            this.shaderSnippets.inverse_function,
            "void main(void) {",
            this.shaderSnippets.vertex,
            "}"
         ];
         console.info("shader");
         console.log(shader.join("\n"));
         return shader.join("\n");
      },
      createFragmentShaderSource: function(type,defined_type,defined_light,gui){
         var shader = [];
         if(gui){
            shader = [
               this.getDefinition("gui_vertex",defined_type),
               this.shaderSnippets.gui_pars_fragment,
               "void main(void){",
               this.shaderSnippets.gui_fragment,
               "}"
            ].join("\n");
            return shader;
         }
         shader = [
            this.getDefinition(type,defined_type),
            this.getDefinition("light",defined_light),
            
            //this.shaderSnippets.fog_pars_fragement,
            this.shaderSnippets[type+"_pars_fragment"],
            this.shaderSnippets.transpose_function,
            this.shaderSnippets.inverse_function,
            "void main(void){",
            this.shaderSnippets[type+"_fragment"],
            //this.shaderSnippets.fog_fragement,
            "}"
         ].join("\n");
         return shader;
      },
      createAttribute:function(type,shaderProgram){
         var attribute = {};
         
         for(var key in this.attributeLibrary[type]){
            attribute[key]                      = {
               "location":glQuery.gl.getAttribLocation(shaderProgram, key),
               "type":this.attributeLibrary[type][key]["type"],
               "defaults":this.attributeLibrary[type][key]["value"]
            };
         }
         return attribute;
      },
      createUniforms:function(vertexType,fragmentType,shaderProgram,gui){
         var uniforms = {};
         
         for(var keyVertex in this.uniformsLibrary[vertexType]){
            if(!uniforms[vertexType]){
               uniforms[vertexType] = {};
            }
            uniforms[vertexType][keyVertex]           = {
               "location"      :glQuery.gl.getUniformLocation(shaderProgram, keyVertex),
               "type"          :this.uniformsLibrary[vertexType][keyVertex]["type"],
               "defaults"      :this.uniformsLibrary[vertexType][keyVertex]["value"]
            };
         }
         if(!gui){
            for(var keyFrag in this.uniformsLibrary[fragmentType]){
               if(!uniforms[fragmentType]){
                  uniforms[fragmentType] = {};
               }
               uniforms[fragmentType][keyFrag] = {
                  "location"      :glQuery.gl.getUniformLocation(shaderProgram, keyFrag),
                  "type"          :this.uniformsLibrary[fragmentType][keyFrag]["type"],
                  "defaults"      :this.uniformsLibrary[fragmentType][keyFrag]["value"]
               };
            }
            uniforms["light"] = {};
            for(var keyLight in this.uniformsLibrary["light"]){
               if(!uniforms["light"][keyLight]){
                  uniforms["light"][keyLight] = {};
               }
               for(var i in this.uniformsLibrary["light"][keyLight]){
                  uniforms["light"][i] = {
                     "location"  :glQuery.gl.getUniformLocation(shaderProgram, i),
                     "type"      :this.uniformsLibrary["light"][keyLight][i]["type"],
                     "defaults"  :this.uniformsLibrary["light"][keyLight][i]["value"]
                  };
               }
            }            
         }
         return uniforms;
      },
      updateShader:function(key){
         console.log(key);
      },
      updateAllShaders:function(){
         var options = [];
         for(var key in this.shaders){
             options[key] = this.shaders[key]["options"];
             glQuery.gl.deleteProgram(this.shaders[key]["shaderProgram"]);
         }
         this.shaders = [];
         for(var i=0;i<options.length;i++){
             key = this.createShader(options[i]);
             if(key !== i){
                 console.log("some key problems");
             }
         }
            
      },
      getShaderProgramKey:function(options){
         var i = -1;
         for(var key in this.shaders){
            if(options.fragmentType === this.shaders[key]["type"]){
               if(options["USE_TEXTURE"] === this.shaders[key]["options"]["USE_TEXTURE"]){
                  i = parseInt(key,10);
                  break;
               }
               if((this.shaders[key]["options"]["USE_TEXTURES"]["USE_SPECULAR_TEXTURE"] === options["USE_TEXTURES"]["USE_SPECULAR_TEXTURE"]) && 
                  (this.shaders[key]["options"]["USE_TEXTURES"]["USE_DIFFUSE_TEXTURE"] === options["USE_TEXTURES"]["USE_DIFFUSE_TEXTURE"]) && 
                  (this.shaders[key]["options"]["USE_TEXTURES"]["USE_AMBIENT_TEXTURE"] === options["USE_TEXTURES"]["USE_AMBIENT_TEXTURE"]) && 
                  (this.shaders[key]["options"]["USE_TEXTURES"]["USE_EMISSION_TEXTURE"] === options["USE_TEXTURES"]["USE_EMISSION_TEXTURE"])){
                  i = parseInt(key,10);
                  break;
               }
            } 
         }
         if(i === -1){
            i = this.createShader(options);
         }
         return i;
      },
      createShader:function(options){
         var gui = false;
         if(options["fragmentType"] === "gui"){
            gui = true;
         }
         var shader = this.getShaderSource(options,gui);
         var shaderProgram = glQuery.gl.createProgram();
         console.time("glQuery.gl.attachShader(shaderProgram, shader.XVertex);");
         glQuery.gl.attachShader(shaderProgram, shader.XVertex);
         console.time("glQuery.gl.attachShader(shaderProgram, shader.XFragment);");
         glQuery.gl.attachShader(shaderProgram, shader.XFragment);
         glQuery.gl.linkProgram(shaderProgram);

         if (!glQuery.gl.getProgramParameter(shaderProgram, glQuery.gl.LINK_STATUS)){
            window.alert("Could not initialise shaders");
         }
         var key = this.shaders.length;
         this.shaders[key] = {
            shaderProgram: shaderProgram,
            shader: shader,
            uniforms: this.createUniforms("common_vertex",options["fragmentType"], shaderProgram),
            attribute: this.createAttribute("common_vertex", shaderProgram),
            options: options,
            type: options["fragmentType"]
         };
         return key;
      },
      getShaderSource:function(options,gui){
         var shader = {};
         console.time("glQuery.shader.getShader() 1");
         shader.XFragment = glQuery.gl.createShader(glQuery.gl.FRAGMENT_SHADER);
         shader.XVertex = glQuery.gl.createShader(glQuery.gl.VERTEX_SHADER);
         if(gui){
            options["USE_TEXTURES"] = {
               "USE_TEXTURE":options["USE_TEXTURE"]
            };
         }
         glQuery.gl.shaderSource(shader.XFragment, glQuery.shader.createFragmentShaderSource(options["fragmentType"],options["USE_TEXTURES"],glQuery.light.shaderLight,gui)); //str enhält hier den kompletten Quellcode des Shaderscripts
         glQuery.gl.compileShader(shader.XFragment);
         if (!glQuery.gl.getShaderParameter(shader.XFragment, glQuery.gl.COMPILE_STATUS)){
            console.log(glQuery.gl.getShaderInfoLog(shader.XFragment));
            return false;
         }
         
         glQuery.gl.shaderSource(shader.XVertex, glQuery.shader.createVertexShaderSource({
             "USE_TEXTURE":options["USE_TEXTURE"]
         },gui)); //str enhält hier den kompletten Quellcode des Shaderscripts
         glQuery.gl.compileShader(shader.XVertex);     
         if (!glQuery.gl.getShaderParameter(shader.XVertex, glQuery.gl.COMPILE_STATUS)){
            console.log(glQuery.gl.getShaderInfoLog(shader.XVertex));
            return false;
         }
         console.time("glQuery.shader.getShader() 1");
         return shader;
      },
      shaders:[]
    };
})(glQuery,window.console);
(function( glQuery ,WebGLDebugUtils , undefined ) {

    glQuery.webGL = {
        createWebGL:function(withOutInit){
            glQuery.progressBarStep("createwebgl",2);
            if(!withOutInit){
                var init = this.initWebGL();
                if(!init){
                    return false;
                }
            }
            glQuery.gl.clearColor(1.0, 1.0, 1.0, 1.0);            
            glQuery.gl.viewport(0, 0, glQuery.canvasWidth, glQuery.canvasHeight);       // Set clear color to black, fully opaque
            glQuery.gl.clearDepth(1.0);                                                 // Clear everything
            glQuery.gl.enable(glQuery.gl.DEPTH_TEST);                                   // Enable depth testing
            glQuery.gl.depthFunc(glQuery.gl.LEQUAL);                                    // Near things obscure far things
            glQuery.gl.clear(glQuery.gl.COLOR_BUFFER_BIT|glQuery.gl.DEPTH_BUFFER_BIT);  // Clear the color as well as the depth buffer.
            glQuery.progressBarStep("createwebgl",8);
            
            return true;
        },
        initWebGL:function(){
            var canvas = glQuery.options.id;
            canvas = document.getElementById(canvas);
            var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
            glQuery.gl = null;
            for (var i = 0; i < names.length; ++i) {
                try {
                    glQuery.gl = canvas.getContext(names[i]);
                } catch(e) {}
                if (glQuery.gl) {
                    break;
                }
            }
            if (!glQuery.gl) {
                return false;
            }
            if(glQuery.options.debug){
                glQuery.gl = WebGLDebugUtils.makeDebugContext(glQuery.gl);                
            }
            return true;
        },
        createScene:function(){
            
        },
        options:{
            fog:false
        }
    };
})(glQuery,WebGLDebugUtils );