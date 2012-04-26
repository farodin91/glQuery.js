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
        eye:[],
        
        cameraMatrix:function(resize){
            if(resize){
                this.perspective.Matrix = mat4.create();
                this.perspective.Matrix = mat4.perspective(60, (glQuery.canvasWidth/glQuery.canvasHeight), 0.1, 100, this.perspective.Matrix);
            }
            return this.perspective.Matrix;
        },
        add:function(type,art,id, near, far){
            
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
})(glQuery );