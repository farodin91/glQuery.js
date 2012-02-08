/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.animation.js
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
 */
(function( glQuery, undefined ) {

    glQuery.animation = {
        createAnimationHandler:function(objects,data,during,easing,callback){
            if(!callback && typeof easing =="function"){
                callback = easing;
                easing = null;
                
            }
            if(!callback && typeof easing =="string")
                callback = null;
            if(typeof during == "string"){
                easing = during;
                during = undefined;
                
            }
        
            if(typeof during == "function"){
                callback = during;
                during = undefined;
                
            }
            
        
            data = {
                "data":data,
                "during":during,
                "easing":easing,
                "callback":callback
            };
            for(var i=0;i <objects.length;i++){
                this.animationHandler(objects[i],data)
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