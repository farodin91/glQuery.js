/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.events.js
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
 *	jquery.1.5.0.js
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.mouse.js
 *	sylvester.src.js
 *	glQuery.core.js
 *	glQuery.collada.js
 *	glQuery.input.js
 *	glQuery.scene.js
 *	glQuery.math.js
 *	glQuery.webgl.js
 *	glQuery.animation.js
 *	glQuery.object.js
 *	glQuery.physics.js
 *	glQuery.textures.js
 */
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