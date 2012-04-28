/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.mesh.collada.js
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
 *	glQuery.core.js
 */

(function( glQuery, undefined ) {
    
    glQuery.collada.mesh = {
        instanceMesh:function(node,data){
            var self = this;
            var mesh = {};
            var p = "";
            var verticesNodes;
            var input;
            this.data = data.data;
            this.meta = data.meta;
            mesh.source = {};
            mesh.primitiveElements = {};
            var nodes = jQuery(node).find("> *");
            nodes.each(function(){
                switch(this.nodeName){
                    case "source":
                        mesh.source[this.getAttribute("id")] = self.getSource(this);
                        break;
                    case "vertices":
                        mesh.vertices = {};
                        verticesNodes = jQuery(this).find("> *");
                        verticesNodes.each(function(){
                            if(this.nodeName == "input"){
                                mesh.vertices[this.getAttribute("semantic")] = this.getAttribute("source");
                            }
                        })
                        break;
                    case "lines":
                    case "linestrips":
                    case "polylist":
                    case "triangles":
                    case "trifans":
                    case "tristrips":
                        var materialUrl = this.getAttribute("material");
                        if(materialUrl){
                            mesh.materialUrl = materialUrl;                            
                        }else{
                            mesh.materialUrl = "material";                      
                        }
                        mesh.primitiveElements = self.parsePrimitiveElements(this,this.nodeName);
                        break;
                    case "polygons":
                        break;
                    case "extra"://Coming Soon!
                        break;
                }
            })
            mesh = this.putSourceAndPrimitiveTogether(mesh)
            return mesh;
        },
        putSourceAndPrimitiveTogether:function(data){
            var mesh = {};
            mesh.materialUrl = data.materialUrl;
            var source;
            for(var key in data.primitiveElements){
                source = data.source[(data.primitiveElements[key]["source"]).toString().replace("#","")];
                if(key == "VERTEX")
                    source = data.source[(data.vertices.POSITION).toString().replace("#","")]
                    
                mesh[key] = {
                    "vertices":this.parseSource(source),
                    "indices":data.primitiveElements[key]["p"]
                }
            }
            return mesh;
        },
        parseSource:function(source){
            var vertices = [];
            var length = source.accessor.count;
            var stride = source.accessor.stride;
            var param = source.accessor.param
            if(stride == 3 && param.X == "float" && param.Y == "float" && param.Z == "float"){
                for(var i = 0;i<length;i++){
                    switch(this.meta.upAxis){
                        case 0:
                            vertices[i*stride+0] = source.array_element[i*stride+0];
                            vertices[i*stride+1] = source.array_element[i*stride+1];
                            vertices[i*stride+2] = source.array_element[i*stride+2];
                            break;
                        case 1:
                            vertices[i*stride+0] = source.array_element[i*stride+0];
                            vertices[i*stride+1] = source.array_element[i*stride+2];
                            vertices[i*stride+2] = (-1*source.array_element[i*stride+1]);
                            break;
                        case 2:
                            vertices[i*stride+0] = (-1*source.array_element[i*stride+1]);
                            vertices[i*stride+1] = source.array_element[i*stride+0];
                            vertices[i*stride+2] = source.array_element[i*stride+2];
                            break;
                    }
                }
            }else{
                
            }
            return vertices;
            
        },
        parseInput:function(node){
            var input = {};
            var nodes = jQuery(node).find("input");
            var offset = 0;
            nodes.each(function(){
                offset = Math.max(offset, parseInt(this.getAttribute("offset")));
                input[this.getAttribute("semantic")] = {
                    "source":this.getAttribute("source"),
                    "offset":parseInt(this.getAttribute("offset"))
                };
            })
            input.offset = offset;
            return input;
            
        },
        parsePrimitiveElements:function(node,primitiveElement){
            var input = this.parseInput(node);
            var primitiveElements = {};
            var p = glQuery.collada.parseIntArray(jQuery(node).find("p").text());
            var output = {};
            if(primitiveElement == "polylist"){
                var vcount = glQuery.collada.parseIntArray(jQuery(node).find("vcount").text());
                primitiveElements = this.parse[primitiveElement](input,p,vcount);
            }else{
                primitiveElements = this.parse[primitiveElement](input,p);
            }
            for(var key in primitiveElements){
                output[key] = {
                    "source":input[key]["source"],
                    "p":primitiveElements[key]
                };
            }
            return output;
            
        },
        parse:{
            triangles:function(input,p){
                var primitiveElements = []
                for(var i = 0;i<=input.offset;i=i){
                    i = i+1;
                    primitiveElements[(i-1)] = [];
                    for(var k = 0;k <=(p.length/(input.offset+1));k++){
                        primitiveElements[(i-1)][k] = p[k*(input.offset+1)+(i-1)];
                    }
                }
                
                var returns = [];
                for(var key in input){
                    if(key != "offset")
                        returns[key] = primitiveElements[input[key].offset];                  
                    
                }
                return returns;
                
            },
            lines:function(input,p){
                
            },
            polylist:function(input,p,vcount){
                var primitiveElements = []
                for(var i = 0;i<=input.offset;i=i){
                    i = i+1;
                    primitiveElements[(i-1)] = [];
                    var pos = 0;
                    var pos2 = 0;
                    for(var k = 0;k<vcount.length;k++){
                        if(vcount[k]<3){
                            return false;
                        }else if(vcount[k]>3){
                            var tri = [];
                            for(var j=0;j<vcount[k];j++){
                                tri[j] = p[(j*(input.offset+1)+(i-1)+pos)];
                            }
                            tri = glQuery.collada.mesh.createTriganlesByPolygons(tri);
                            for(var j=0;j<tri.length;j++){
                                if(tri[j] == undefined)
                                    break;
                                primitiveElements[(i-1)][j+pos2]= tri[j];
                            }
                            pos2 = pos2 + tri.length;
                        }else{
                            
                            for(var j=0;j<3;j++){
                                if(p[j+((input.offset+1)*pos)] == undefined)
                                    break;
                                primitiveElements[(i-1)][j+pos2] = p[(j*(input.offset+1)+(i-1)+pos)];
                                
                            }
                            pos2 = pos2 + 3;
                        }
                        pos = pos + (vcount[k]*(input.offset+1));
                        
                    }
                    
                }
                var returns = [];
                for(var key in input){
                    if(key != "offset")
                        returns[key] = primitiveElements[input[key].offset];                  
                    
                }
                return returns;
            }
        },
        createTriganlesByPolygons:function(indices){
            var indi = []
            for(var m=0;m<(indices.length-2);m++){
                indi[m*3] = indices[0];
                indi[m*3+1] = indices[1+m];
                indi[m*3+2] = indices[2+m];
            }
            return indi;
        },
        getSource:function(node){//Up_axis
            var self = this;
            var source = {};
            var nodes = jQuery(node).find(">*");
            nodes.each(function(){
                switch(this.nodeName){
                    case "bool_array":
                        source.array_element = glQuery.collada.parseBoolArray(this.textContent);
                        break;
                    case "float_array":
                        source.array_element = glQuery.collada.parseFloatArray(this.textContent);
                        break;
                    case "int_array":
                        source.array_element = glQuery.collada.parseIntArray(this.textContent);
                        break;
                    case "Name_array"://Coming Soon!
                        break;
                    case "SIDREF_array"://Coming Soon!
                        break;
                    case "token_array"://Coming Soon!
                        break;
                    case "IDREF_array"://Coming Soon!
                        break;
                    case "technique_common":
                        source.accessor = self.getTechniqueCommon(this);
                        
                        break;
                    case "technique":
                        break;
                }
            })
            return source;
        },
        getTechniqueCommon:function(node){
            var self = this;
            var accessor = {};
            jQuery(node).find("> *").each(function(){
                switch(this.nodeName){
                    case "accessor":
                        accessor.param = self.getAccessor(this);
                        accessor.count = this.getAttribute("count");
                        if(this.getAttribute("stride"))
                            accessor.stride = this.getAttribute("stride");
                        if(this.getAttribute("offset"))
                            accessor.offset = this.getAttribute("offset");                            
                        break;
                }
            })
            return accessor;
        },
        getAccessor:function(node){
            var self = this;
            var param = {};
            jQuery(node).find("> *").each(function(){
                switch(this.nodeName){
                    case "param":
                        param[this.getAttribute("name")]= this.getAttribute("type");
                        break;
                }
            });
            return param;
        }
    };
    
    glQuery.collada.geometry = {
        instanceGeometry:function(uri, data){
            var self = this;
            var geometry = {};
            this.data = data.data;
            this.meta = data.meta;
            this.geometry = glQuery.collada.parseURI(uri, this.data);
            var nodes = this.geometry.find("> *");
            nodes.each(function(){
                switch(this.nodeName){
                    case "mesh":
                        geometry.mesh = glQuery.collada.mesh.instanceMesh(this,self);
                        break;
                    case "convex_mesh"://Coming Soon!
                        break;
                    case "extra"://Coming Soon!
                        break;
                }
            })
            return geometry;
        }
    };
})(glQuery );
