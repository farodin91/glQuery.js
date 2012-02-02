/*
 * Copyright 2012, Jan Jansen
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
        },
        getObject:function(){},
        getGeometry:function(){
            
        },
        getTextures:function(){},
        getMaterial:function(data,id){
            var material_id = data.find("visual_scene node#"+id+" instance_geometry instance_material").attr("target");
            var material = {
                emission    : [0,0,0,1],
                ambient     : [0,0,0,1],
                diffuse     : [1,1,1,1],
                specular    : [0.5,0.5,0.5,1],
                shininess   : 50,
                index_of_refraction : 1
            };
            if(!material_id){
                return material;
            }
            var material_data = data.find(material_id+" profile_COMMON technique phong");
            /*only Phong Modell*/
            
            material.emission = this.parseFloatArray(material_data.find("emission").text());
            material.ambient = this.parseFloatArray(material_data.find("ambient").text());
            material.diffuse = this.parseFloatArray(material_data.find("diffuse").text());
            material.specular = this.parseFloatArray(material_data.find("specular").text());
            
            material.shininess = parseFloat(material_data.find("shininess float").text());
            material.index_of_refraction = parseFloat(material_data.find("index_of_refraction float").text());
            
            return material;
        },
        getLight:function(){},
        getAnimation:function(){},
        getCamera:function(){},
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
            var scale = this.parseFloatArray(data.find("visual_scene node#"+id+" scale").text());
            CO.Object.Scale = [scale[0],scale[2],scale[1]];
            var translate = this.parseFloatArray(data.find("visual_scene node#"+id+" translate").text());
            CO.Object.Translate = this.getYUPVektorForZUP(translate[0],translate[1],translate[2]);
            var RotateX;
            var RotateY;
            var RotateZ;
            if(!up_axis){
                RotateX = this.parseFloatArray(data.find("visual_scene node#"+id+" rotate[sid='rotationX']").text());
                RotateY = this.parseFloatArray(data.find("visual_scene node#"+id+" rotate[sid='rotationZ']").text());
                RotateZ = this.parseFloatArray(data.find("visual_scene node#"+id+" rotate[sid='rotationY']").text());
                CO.Object.Rotate = [RotateX[3],RotateY[3],(-RotateZ[3])];
            }else{
                RotateX = this.parseFloatArray(data.find("visual_scene node#"+id+" rotate[sid='rotationX']").text());
                RotateZ = this.parseFloatArray(data.find("visual_scene node#"+id+" rotate[sid='rotationZ']").text());
                RotateY = this.parseFloatArray(data.find("visual_scene node#"+id+" rotate[sid='rotationY']").text());
                CO.Object.Rotate = [RotateX[3],RotateY[3],RotateZ[3]];
            }
            
            CO.Vertex.Positions = this.getVertices(data,geometry_id ,up_axis);
            CO.Vertex.Index = this.getIndices(data, geometry_id );
            CO.Vertex.Normals = glQuery.mesh.createNormalsForPosIndices(CO.Vertex.Index, this.getNormals(data, geometry_id , up_axis));
            CO.Material = this.getMaterial(data,id);
            
            
            
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
            var polylist=data.find("geometry"+id+" polylist");
            
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
                var y = 0;
                for(var k = 0;k<vcount.length;k++){
                    if(vcount[k]<3){
                        return false;
                    }else if(vcount[k]>3){
                        var tri = [];
                        for(var j=0;j<vcount[k];j++){
                            tri[j] = faces[y+j*inputcount.length+offset];
                        }
                        tri = this.createTriganlesFormIndices(tri);
                        for(var j=0;j<tri.length;j++){
                            if(tri[j] == undefined)
                                break;
                            indices[semantic][z]= tri[j];
                            z=z+1
                        }
                        y=y+inputcount.length*vcount[k];
                    }else{
                        for(var j = 0;j<vcount[k];j++){
                            if(faces[(z+offset)] == undefined)
                                break;
                            indices[semantic][z] = faces[((z*2)+offset)];
                            z=z+1
                        }
                    }
                    
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
            var normalObj = data.find(""+id+"-normals-array").text();
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
            var vertexObj = data.find(""+id+"-positions-array").text();
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
            return [x,z,(-y)];
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