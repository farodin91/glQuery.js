/*
 * Copyright 2011, Jan Jansen
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
        queue:[],
        move:function(collection,toPositionVec3, during, easing, callback){
            
        },
        rotate:function(angle){},
        createAnimationHandler:function(selector,data,during,easing,callback){// during ist die anzahl der Frames mal die Geschwindigkeit
            if(!this.queue[selector])
            this.queue[selector] = [];
        if(!callback && typeof easing =="function")
            callback = easing;
        if(!callback && typeof easing =="string")
            callback = null;
        if(typeof during == "string")
            easing = during;
        
        if(typeof during == "function")
            callback = during
            
        
        this.queue[selector][this.queue[selector].length] = {"data":data,"during":during,"easing":easing,"callback":callback};
        if(glQuery.selection[selector]){
            this.animationHandler(selector);
        }
        return true;
        },
        animationHandler:function(selector){
            var queue = this.queue[selector];
            if(!queue)
                return true;
            
            for(var i=0; i <queue.length; i++){
                
            }
            return true;
        },
        custom:function(){
            
        },
        speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},
        task:{
            move:function(){
                
            }
            
        },
        step:function(){},
        easing:{
            linear: function(start,target,duration,step) {
                var diff = target-start;
                var steps = diff/duration;
                return start+steps*step;
            },
            swing: function(start,target,duration,step) {
                var diff = target-start;
                var steps = diff/duration;
                return start + ((-Math.cos((steps*step)*Math.PI)/2) + 0.5) * diff;
                
            }
        }
    };
})(glQuery );