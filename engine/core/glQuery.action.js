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

(function( glQuery, undefined ) {
glQuery.action = {
    queue:[],
    //createActionHandler:function(action,data,objects){
    createActionHandler:function(action,data,selector){
        
        if(!this.queue[selector])
            this.queue[selector] = [];
        
        this.queue[selector][this.queue[selector].length] = {"data":data,"action":action};
        if(glQuery.selection[selector]){
            this.actionHandler(selector);
        }
        return true;
    },
    //actionHandler:function(object){
    actionHandler:function(selector){
        var sel = glQuery.selection[selector];
        var queue = this.queue[selector];
        delete this.queue[selector];
        if(!queue)
            return true;
        for(var i=0; i <queue.length; i++){
            this.task[queue[i].action](sel,queue[i].data,selector)
        }
        return true;        
    },
    task:{
        translatePosition:function(objects,data,selector){
            //glQuery.event.trigger("move", objects, true, data);
            glQuery.event.trigger("move", selector, true, data);
            for(var i=0; i <objects.length; i++){
                glQuery.objects.object[objects[i]].translateVec3ObjectPos(data);
            }
            return true;
        },
        setPosition:function(objects,data,selector){
            //glQuery.event.trigger("move", objects, true, data);
            glQuery.event.trigger("move", selector, true, data);
            for(var i=0; i <objects.length; i++){
                glQuery.objects.object[objects[i]].setVec3ObjectPos(data);
            }
        },
        trackTo:function(objects,data,selector){
            
        },
        lookAt:function(objects,data,selector){
            
        }
        
    }
    };
})(glQuery );