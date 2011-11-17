/*
 * Copyright 2011, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.collada.js
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

    glQuery.collada = {
        getFile :function(url,id,callback){
            var self = this;
            var call = callback;
            $.ajax({
                url:url,
                dataType:"xml",
                error:function(){},
                success:function(data){
                    var type = "geometry";
                    var parsed = self.parseCollada(data,type,id)
                    call(parsed);
                }
            })
        },/*
        getObject:function(){},
        getGeometry:function(){},
        getTextures:function(){},
        getLight:function(){},
        getAnimation:function(){},
        getCamera:function(){},*/
        parseCollada:function(data,type,id){
            var up_axis = true;
           
            data = $(data)
            
            if(data.find("up_axis").text() != "Y_UP"){
                up_axis = false;
                if(data.find("up_axis").text() == "X-UP"){
                    return false;
                }
            }
            
            if(id != ""){
                
            }else{
                
            }
                
            var CO = {};
            
            CO.Object = {};
            CO.Vertex = {};
            
            var geometry_id = data.find("visual_scene node#"+id+" instance_geometry").attr("url");
            CO.Object.Scale = this.parseFloatArray(data.find("visual_scene node#"+id+" scale").text());
            CO.Object.Translate = this.parseFloatArray(data.find("visual_scene node#"+id+" translate").text());
            
            CO.Vertex.Positions = this.getVertices(data,geometry_id ,up_axis);
            CO.Vertex.Normals = this.getNormals(data, geometry_id , up_axis);
            CO.Vertex.Index = this.getIndices(data, geometry_id );
            
            
            
            //Create a bounding Box
            var minx = Infinity, miny = Infinity, minz = Infinity;
            var maxx = -Infinity, maxy = -Infinity, maxz = -Infinity;
            var npoints = Math.floor(CO.Vertex.Positions.array.length / 3);
            for (var i = 0; i < npoints; ++i) {
                var x = CO.Vertex.Positions.array[i*3  ];
                var y = CO.Vertex.Positions.array[i*3+1];
                var z = CO.Vertex.Positions.array[i*3+2];

                minx = Math.min(minx, x);
                miny = Math.min(miny, y);
                minz = Math.min(minz, z);

                maxx = Math.max(maxx, x);
                maxy = Math.max(maxy, y);
                maxz = Math.max(maxz, z);
            }

            CO.Vertex.bbox = {
                min: {
                    x: minx, 
                    y: miny, 
                    z: minz
                },
                max: {
                    x: maxx, 
                    y: maxy, 
                    z: maxz
                }
            };
            
            CO.textures = {};
            return CO;
        
        },
        getIndices:function(data,id){
            var indices = [];
            var polylist=data.find("geometry#"+id+" polylist");
            
            var faces=this.parseIntArray(polylist.find("p").text());
            var vcount=this.parseIntArray(polylist.find("vcount").text());
            
            var inputcount = polylist.find("input");
            var maxoffset=0;
            for(var n=0;n<inputcount.length;n++) maxoffset=Math.max(maxoffset,inputcount[n].getAttribute("offset"));
            var offset = 0;
            for(var i=0;i<inputcount.length;i++){
                offset = parseInt(inputcount[i].getAttribute("offset"));
                var semantic  = inputcount[i].getAttribute("semantic");
                indices[semantic] = [];
                var z = 0;
                for(var k = 0;k<vcount.length;k++){
                    if(vcount[k]<3){
                        return false;
                    }else if(vcount[k]>3){
                        var tri = [];
                        for(var j=0;j<vcount[k];j++){
                            tri[j] = faces[(j*(maxoffset+1))+offset+z];
                        }
                        tri = this.createTriganlesFormIndices(tri);
                        for(var j=0;j<tri.length;j++){
                            indices[semantic][z+j]= tri[j];
                        }
                    }else{
                        for(var j = 0;j<vcount[k];j++){
                            indices[semantic][z+j] = faces[(j*(maxoffset+1))+offset+z];
                        }
                    }
                    z += z+vcount[k];
                }
            }
            
            return indices;
            
        },
        createTriganlesFormIndices:function(indices){
            var indi = []
            for(var m=0;m<(indices.length-2);m++){
                indi[m*3] = indices[0];
                indi[m*3+1] = indices[1+m];
                indi[m*3+2] = indices[2+m];
            }
            return indi;
        },
        getNormals:function(data,id,up_axis){
            var normalObj = data.find("#"+id+"-normals-array").text();
            var oldarray = this.parseFloatArray(normalObj);
            var num = oldarray.length / 3;
            var array = [];
            
            if(!up_axis){
                for(var i =0;i < num; i++){
                    array[i*3] = oldarray[i*3];
                    array[i*3 + 1] = oldarray[i*3 + 2];
                    array[i*3 + 2] = ((-1)*oldarray[i*3 + 1]);
                    
                }
            }
            return {
                array:array,
                num:num
            };
        },
        getVertices:function(data,id,up_axis){
            var vertexObj = data.find("#"+id+"-positions-array").text();
            var oldarray = this.parseFloatArray(vertexObj);
            var num = oldarray.length / 3;
            var array = [];
            
            if(!up_axis){
                for(var i =0;i < num; i++){
                    array[i*3] = oldarray[i*3];
                    array[i*3 + 1] = oldarray[i*3 + 2];
                    array[i*3 + 2] = ((-1)*oldarray[i*3 + 1]);
                    
                }
            }
            
            return {
                array:array,
                num:num
            };
        },
        getYUPVektorForZUP:function(x,y,z){
            return {
                x:x,
                y:z,
                z:(-(y))
            };
        },
        parseIntArray:function(s){
            s = jQuery.trim(s);
            if (s == "")
                return [];

            // this is horrible
            var ss = s.split(/\s+/);

            var res = Array(ss.length);
            for (var i = 0, j = 0; i < ss.length; i++) {
                if (ss[i].length == 0)
                    continue;
                if(ss[i] !=  null)
                    res[j++] = parseInt(ss[i]);
            }
            return res;
        },
        parseFloatArray:function(s){
            if (s == "")
                return [];

            // this is horrible
            var ss = s.split(/\s+/);
            var res = Array(ss.length);
            for (var i = 0, j = 0; i < ss.length; i++) {
                if (ss[i].length == 0)
                    continue;
                res[j++] = parseFloat(ss[i]);
            }          
            return res;
        }
    };
})(glQuery );