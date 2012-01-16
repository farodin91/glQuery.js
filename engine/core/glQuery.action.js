/*
 * Copyright 2011, Jan Jansen
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
    createActionHandler:function(action,data,selector){
        this.queue[selector] = [];
        this.queue[selector][action] = data;
        if(glQuery.selection[selector]){
            this.actionHandler(selector);
        }
        return true;
    },
    actionHandler:function(selector){
        
    },
    task:{
        translatePosition:function(objects,data,selector){
            glQuery.event.trigger("move", selector, true, data);
            for(var key in objects){
                
            }
        },
        setPosition:function(objects,data,selector){
            glQuery.event.trigger("move", selector, true, data);
        }
    }
    };
})(glQuery );