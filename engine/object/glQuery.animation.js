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
        get:function(){},
        add:function(){},
        move:function(collection,toPositionVec3, during, easing, callback){
            
        },
        rotate:function(angle){},
        create:function(collection,data,during,easing,callback){// during ist die anzahl der Frames mal die Geschwindigkeit
            
        },
        rotation:true,
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