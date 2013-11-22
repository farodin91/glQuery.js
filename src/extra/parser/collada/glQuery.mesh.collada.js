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
 *  glQuery.core.js
 */

(function( glQuery,$, undefined ) {
  
  glQuery.collada.mesh = {
    debug:false,
    debugLevel:0,
    instanceMesh:function(node,data){
      if(this.debug){
        console.info("glQuery.collada.mesh.instanceMesh");
        console.log(data);
        console.log(node);
      }
      var self = this;
      var mesh = {};
      //var p = "";
      //var verticesNodes;
      //var input;
      this.data = data.data;
      this.meta = data.meta;
      mesh.source = {};
      mesh.primitiveElements = {};
      for(var i = 0; i< node.children.length;i++){
        var childNode = node.children.item(i);
        if(this.debug && this.debugLevel > 0){
          console.info(childNode.nodeName);
        }
        switch(childNode.nodeName){
          case "source":
            mesh.source[childNode.getAttribute("id")] = self.getSource(childNode);
            break;
          case "vertices":
            mesh.vertices = {};
            for(var k = 0; k< childNode.children.length;k++){
              var child = childNode.children.item(k);
              if(this.debug && this.debugLevel > 0){
                console.info(child.nodeName);
              }
              if(child.nodeName === "input"){
                mesh.vertices[child.getAttribute("semantic")] = child.getAttribute("source");
              }
            }
            break;
          case "lines":
          case "linestrips":
          case "polylist":
          case "triangles":
          case "trifans":
          case "tristrips":
            var materialUrl = childNode.getAttribute("material");
            if(materialUrl){
              mesh.materialUrl = materialUrl;                            
            }else{
              mesh.materialUrl = "material";                      
            }
            mesh.primitiveElements = self.parsePrimitiveElements(childNode,childNode.nodeName);
            break;
          case "polygons":
            break;
          case "extra"://Coming Soon!
            break;
        }
      }
      mesh = this.putSourceAndPrimitiveTogether(mesh);
      return mesh;
    },
    putSourceAndPrimitiveTogether:function(data){
      var mesh = {};
      mesh.materialUrl = data.materialUrl;
      var source;
      for(var key in data.primitiveElements){
        source = data.source[(data.primitiveElements[key]["source"]).toString().replace("#","")];
        if(key === "VERTEX"){
          source = data.source[(data.vertices.POSITION).toString().replace("#","")];
        }
        mesh[key] = {
          "vertices":this.parseSource(source),
          "indices":data.primitiveElements[key]["p"]
        };
        if(this.debug){
          console.info("glQuery.collada.putSourceAndPrimitiveTogether");
          console.log(key);
          console.log(source);
          console.log(mesh[key]);
        }
      }
      return mesh;
    },
    parseSource:function(source){
      var vertices = [];
      var length = parseInt(source.accessor.count,10);
      var stride = parseInt(source.accessor.stride,10);
      var param = source.accessor.param;
      if(stride === 3 && param.X === "float" && param.Y === "float" && param.Z === "float"){
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
      }
      return vertices;
      
    },
    parseInput:function(node){
      if(this.debug){
        console.log("glQuery.collada.mesh.parseInput");
      }
      var input = {};
      var offset = 0;
      for(var i = 0; i< node.children.length;i++){
        var childNode = node.children.item(i);
        if(this.debug && this.debugLevel > 0){
          console.info(childNode.nodeName);
        }
        if(childNode.nodeName === "input"){
          offset = Math.max(offset, parseInt(childNode.getAttribute("offset"),10));
          input[childNode.getAttribute("semantic")] = {
            "source":childNode.getAttribute("source"),
            "offset":parseInt(childNode.getAttribute("offset"),10)
          };   
        }
      }
      input.offset = offset;
      return input;
    },
    parsePrimitiveElements:function(node,primitiveElement){
      var input = this.parseInput(node);
      var primitiveElements = {};
      var p = glQuery.collada.parseIntArray(glQuery.collada.getChildNodeByName(node,"p").textContent);
      var output = {};
      var count = node.getAttribute("count");
      if(this.debug){
        console.log("glQuery.collada.mesh.parsePrimitiveElements");
        console.log(primitiveElement);
        console.log(p);
        console.log(input);
        console.log(node);
      }
      if(primitiveElement === "polylist"){
        var vcount = glQuery.collada.parseIntArray($(node).find("vcount").text());
        primitiveElements = this.parse[primitiveElement](input,p,vcount,count);
      }else{
        primitiveElements = this.parse[primitiveElement](input,p,count);
      }
      for(var key in primitiveElements){
        output[key] = {
          "source":input[key]["source"],
          "p":primitiveElements[key]
        };
      }
      if(this.debug){
        console.log(primitiveElements);
      }
      return output;
      
    },
    parse:{
      triangles:function(input,p){
        var primitiveElements = [];
        for(var i = 0;i<=input.offset;i=i){
          i = i+1;
          primitiveElements[(i-1)] = [];
          for(var k = 0;k <=(p.length/(input.offset+1));k++){
            primitiveElements[(i-1)][k] = p[k*(input.offset+1)+(i-1)];
          }
        }
        
        var returns = [];
        for(var key in input){
          if(key !== "offset"){
            returns[key] = primitiveElements[input[key].offset];                  
          }
        }
        return returns;
        
      },
      lines:function(input,p){
        console.log(input);
        console.log(p);
      },
      polylist:function(input,p,vcount,count){
        if(this.debug){
          console.log(count);
        }
        var length = 0;
        for(var c = 0;c<vcount.length;c++){
          if(vcount[c]<3){
            return false;
          }else{
            length = length + 3 +((vcount[c]-3)*3);
          }
        }
        var primitiveElements = [];
        for(var i = 0;i<=input.offset;i=i){
          i = i+1;
          primitiveElements[(i-1)] = new Int32Array(length);
          var pos = 0;
          var pos2 = 0;
          for(var k = 0;k<vcount.length;k++){
            if(vcount[k]<3){
              return false;
            }else if(vcount[k]>3){
              var tri = [];
              for(var a=0;a<vcount[k];a++){
                tri[a] = p[(a*(input.offset+1)+(i-1)+pos)];
              }
              tri = glQuery.collada.mesh.createTriganlesByPolygons(tri);
              for(var j=0;j<tri.length;j++){
                if(tri[j] === undefined){
                  break;
                }
                primitiveElements[(i-1)][j+pos2]= tri[j];
              }
              pos2 = pos2 + tri.length;
            }else{
              
              for(var b=0;b<3;b++){
                if(p[b+((input.offset+1)*pos)] === undefined){
                  break;
                }
                primitiveElements[(i-1)][b+pos2] = p[(b*(input.offset+1)+(i-1)+pos)];
                
              }
              pos2 = pos2 + 3;
            }
            pos = pos + (vcount[k]*(input.offset+1));
          }
        }
        var returns = [];
        for(var key in input){
          if(key !== "offset" && key !== "VERTEX"){
            returns[key] = primitiveElements[input[key].offset];   
          }else if(key === "VERTEX"){
            returns[key] = primitiveElements[input[key].offset];  
          }
        }
        return returns;
      }
    },
    checkPrimitiveElements:function(primitiveElements){
      for(var k=0;k<(primitiveElements.length)/3;k++){
        if(primitiveElements[k*3] === primitiveElements[k*3+1]){
          console.error("Tri:"+k+" => "+primitiveElements[k*3]);
        }
        if(primitiveElements[k*3+2] === primitiveElements[k*3+1]){
          console.error("Tri:"+k+" => "+primitiveElements[k*3+1]);
          
        }
        if(primitiveElements[k*3] === primitiveElements[k*3+2]){
          console.error("Tri:"+k+" => "+primitiveElements[k*3]);   
        }
      }
    },
    createTriganlesByPolygons:function(indices){
      var indi = [];
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
      for(var i = 0; i< node.children.length;i++){
        var childNode = node.children.item(i);
        if(this.debug && this.debugLevel > 0){
          console.info(childNode.nodeName);
        }
        switch(childNode.nodeName){
          case "bool_array":
            source.array_element = glQuery.collada.parseBoolArray(childNode.textContent);
            break;
          case "float_array":
            source.array_element = glQuery.collada.parseFloatArray(childNode.textContent);
            break;
          case "int_array":
            source.array_element = glQuery.collada.parseIntArray(childNode.textContent);
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
            source.accessor = self.getTechniqueCommon(childNode);
            
            break;
          case "technique":
            break;
        }
      }
      return source;
    },
    getTechniqueCommon:function(node){
      var self = this;
      var accessor = {};
      for(var i = 0; i< node.children.length;i++){
        var childNode = node.children.item(i);
        if(this.debug && this.debugLevel > 0){
          console.info(childNode.nodeName);
        }
        if(childNode.nodeName === "accessor"){
          accessor.param = self.getAccessor(childNode);
          accessor.count = childNode.getAttribute("count");
          if(childNode.getAttribute("stride")){
            accessor.stride = childNode.getAttribute("stride");
          }
          if(childNode.getAttribute("offset")){
            accessor.offset = childNode.getAttribute("offset");
          }
        }
      }
      return accessor;
    },
    getAccessor:function(node){
      var param = {};
      for(var i = 0; i< node.children.length;i++){
        var childNode = node.children.item(i);
        if(this.debug && this.debugLevel > 0){
          console.info(childNode.nodeName);
        }
        if(childNode.nodeName === "param"){
          param[childNode.getAttribute("name")] = childNode.getAttribute("type");
        }
      }
      return param;
    }
  };
  
  glQuery.collada.geometry = {
    instanceGeometry:function(uri, data){
      var self = this;
      var geometry = {};
      this.data = data.data;
      this.meta = data.meta;
      this.geometry = glQuery.collada.parseURI(uri, this.data).get(0);

      for(var i = 0; i<  this.geometry.children.length;i++){
        var childNode =  this.geometry.children.item(i);
        if(this.debug){
          console.info(childNode.nodeName);
        }
        switch(childNode.nodeName){
          case "mesh":
            geometry.mesh = glQuery.collada.mesh.instanceMesh(childNode,self);
            break;
          case "convex_mesh"://Coming Soon!
            break;
          case "extra"://Coming Soon!
            break;
        }
      }
      return geometry;
    }
  };
})(glQuery ,jQuery);
