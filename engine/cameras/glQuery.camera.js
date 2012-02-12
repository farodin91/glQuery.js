/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.camera.js
 *@author Jan Jansen - farodin91@googlemail.com
 *@description Coming soon
 *
 *
 * Depends:
 *      glQuery.core.js
 */

(function( glQuery, undefined ) {
    
    glQuery.camera = {
        lookAt:[],
        add:function(type,art,id, near, far){
            
        },
        createLookAtByMvMatrix:function(modelViewMatrix){
            var center = vec3.create([0,0,1]);
            var up = vec3.create([0,1,0]);
            var eye = vec3.create([0,0,0]);
            var lookAt = mat4.create();
            center = [0,0,-1];
            up      = [0,-1,0]
            eye     = mat4.multiplyVec3(modelViewMatrix, eye);
            lookAt = mat4.lookAt(eye, center, up, lookAt);
            this.lookAt = lookAt;
            return lookAt;
        }
    };
})(glQuery );