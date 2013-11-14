/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.mesh.js
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
 *	glQuery.input.js
 *	glQuery.scene.js
 *	glQuery.events.js
 *	glQuery.math.js
 *	glQuery.webgl.js
 *	glQuery.animation.js
 *	glQuery.object.js
 *	glQuery.physics.js
 *	glQuery.textures.js
 */

(function( glQuery, undefined ) {

    glQuery.mesh = {
        Vertex:{
            Positions:{},
            Normals:{},
            Indices:{},
            BBox:{
                min:[0,0,0],
                max:[0,0,0]}
            },
            createNormalsArray:function(NormalIndices,VertexIndices,oldNormals,vertexNum){
                //Muss noch getestet auf funktion
                var valPositionIndices = 0;
                var valNormalsIndices = 0;
                
                var normals = new Float32Array(vertexNum);
                for(var i = 0;i<(VertexIndices.length);i++){
                    valPositionIndices  = VertexIndices[i];
                    valNormalsIndices   = NormalIndices[i];
                    
                    normals[valPositionIndices*3]   = oldNormals[valNormalsIndices*3];
                    normals[valPositionIndices*3+1] = oldNormals[valNormalsIndices*3+1];
                    normals[valPositionIndices*3+2] = oldNormals[valNormalsIndices*3+2];
                }
                return normals;
            }
        
    };
})(glQuery);