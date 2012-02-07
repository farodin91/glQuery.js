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
                        mesh.primitiveElements = self.parsePrimitiveElements(this,this.nodeName);
                        break;
                    case "linestrips":
                        mesh.primitiveElements = self.parsePrimitiveElements(this,this.nodeName);
                        break;
                    case "polygons":
                        break;
                    case "polylist"://create direct triangles
                        mesh.primitiveElements = self.parsePrimitiveElements(this,this.nodeName);
                        break;
                    case "triangles":
                        mesh.primitiveElements = self.parsePrimitiveElements(this,this.nodeName);
                        break;
                    case "trifans":
                        mesh.primitiveElements = self.parsePrimitiveElements(this,this.nodeName);
                        break;
                    case "tristrips":
                        mesh.primitiveElements = self.parsePrimitiveElements(this,this.nodeName);
                        break;
                    case "extra"://Coming Soon!
                        break;
                }
            })
        },
        parseInput:function(data){
            var input = {};
            var nodes = jQuery(data).find("input");
            var offset = 0;
            nodes.each(function(){
                offset = Math.max(offset, parseInt(this.getAttribute("offset")));
                input[this.getAttribute("semantic")] = {"source":this.getAttribute("source"),"offset":parseInt(this.getAttribute("offset"))};
            })
            input.offset = offset;
            return input;
            
        },
        parsePrimitiveElements:function(node,primitiveElement){
            var input = this.parseInput(this);
            var primitveElements = {};
            var p = glQuery.collada.parseIntArray(jQuery(this).find("p").text());
            if(primitiveElement == "polylist"){
                var vcount = glQuery.collada.parseIntArray(jQuery(node).find("vcount").text());
                primitveElements = this.parse[primitiveElement](input,p,vcount);
            }else{
                primitveElements = this.parse[primitiveElement](input,p);
            }
            
            
            
        },
        parse:{
            lines:function(input,p){
                
            },
            polylist:function(input,p,vcount){
                var primitiveElements = []
                for(var i = 0;i<=input.offset;i=i){
                    i = i+1;
                    var pos = 0;
                    var pos2 = 0;
                    for(var k = 0;k<vcount.length;k++){
                        pos = 0;
                        pos2 = 0;
                        if(vcount[k]<3){
                            return false;
                        }else if(vcount[k]>3){
                            var tri = [];
                            for(var j=0;j<vcount[k];j++){
                                tri[j] = p[j+((input.offset+1)*pos)];
                            }
                            tri = glQuery.collada.mesh.createTriganlesFormIndices(tri);
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
                                primitiveElements[(i-1)][j+pos2] = p[j+((input.offset+1)*pos)];
                                
                            }
                            pos2 = pos2 + 3;
                        }
                        pos = pos + vcount[k];
                        
                    }
                    
                }
                var returns = [];
                for(var key in input){
                    if(key == "offset")
                        continue;
                    returns[key] = primitiveElements[input[key].offset];
                }
                return returns;
            }
        },
        /*
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
            
        },*/
        createTriganlesFormIndices:function(indices){
            var indi = []
            for(var m=0;m<(indices.length-2);m++){
                indi[m*3] = indices[0];
                indi[m*3+1] = indices[1+m];
                indi[m*3+2] = indices[2+m];
            }
            return indi;
        },
        getSource:function(node){
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
                    case "technique_common"://Coming Soon!
                        
                        break;
                    case "technique":
                        break;
                }
            })
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
        }
    };
})(glQuery );
