/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.action.js
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