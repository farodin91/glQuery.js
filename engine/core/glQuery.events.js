/*
 * Copyright 2011, Jan Jansen
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
        click:{i:0},
        move:{i:0},
        near:{i:0},
        touch:{i:0},
        collision:{i:0},
        keyboard:{i:0},
        options:{i:0},
        camera:{i:0},
        light:{i:0},
        addObject:{i:0},
        animation:{i:0},
        error:{i:0},
        complete:{i:0},
        ready:{i:0},
        add:function(){
            
        },
        trigger:function(type,triggerObject,auto,data){
            var e = {};
            e.auto = auto;
            e.data = data;
            $.each(this[type],function(key,value){
                if(triggerObject == value.obj){
                    e.obj = value.obj;
                    value.callback(e);
                }
            })
            return true;
        }
    };
})(glQuery );