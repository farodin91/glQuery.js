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
            createNormalsForPosIndices:function(Indices,Normals){//Muss noch getestet auf funktion
                var valPositionIndices = 0;
                var valNormalsIndices = 0;
                
                var oldNormalsArray = Normals.array;
                
                Normals = [];
                for(var i = 0;i<Indices["VERTEX"].length;i++){
                    valPositionIndices  = Indices["VERTEX"][i];
                    valNormalsIndices   = Indices["NORMAL"][i];
                    if(valPositionIndices == valNormalsIndices){
                        Normals[valNormalsIndices*3] = oldNormalsArray[valNormalsIndices*3];
                        Normals[valNormalsIndices*3+1] = oldNormalsArray[valNormalsIndices*3+1];
                        Normals[valNormalsIndices*3+2] = oldNormalsArray[valNormalsIndices*3+2];
                        continue;
                    }
                    Normals[valPositionIndices*3] = oldNormalsArray[valNormalsIndices*3];
                    Normals[valPositionIndices*3+1] = oldNormalsArray[valNormalsIndices*3+1];
                    Normals[valPositionIndices*3+2] = oldNormalsArray[valNormalsIndices*3+2];
                }
                var num = (Normals/3);
                return {
                array:Normals,
                num:num
            };;
            }
        
    };
})(glQuery);