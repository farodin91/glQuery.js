/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.scene.collada.js
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
    
    glQuery.collada.scene = {
        data:{},
        meta:{},
        parse:function(file){
            var self = this;
            glQuery.collada.getCollada(file,function(data,meta){
                self.instanceScene(data,meta);
            });
        },
        instanceScene:function(data,meta){
            var instance = "";
            var instanceUrl = "";
            this.data = data;
            this.meta = meta;
            data.find("scene > *").each(function(){
                var nodeName = this.nodeName;
                var pre = nodeName.split('_');
                pre = pre[0];
                if(pre == "instance"){
                    instance = nodeName ;
                    instanceUrl = jQuery(this).attr("url");
                }
            })
            switch(instance){
                case "instance_physics_scene":
                    this.physicsScene(instanceUrl);
                    break;
                case "instance_visual_scene":
                    this.visualScene(instanceUrl);
                    break;
                default:
                    "no more types are defined";
                    break;
            }
            
            glQuery.renderWorker.postMessage("addedObject");
            glQuery.imageWorker.postMessage("imageLoaded");
        },
        visualScene:function(url){
            var scene = this.data.find(url);
            var nodes = this.getNodes(scene);
            for(var key in nodes){
                this.createObjectByNode($(nodes[key]));
            }
            
        },
        createObjectByNode:function(node){
            var self = this;
            var object = {};
            object.id = node.attr("id");
            object.modelViewMatrix = mat4.create();
            object.modelViewMatrix = mat4.identity();
            object.position = [0,0,0];
            node.find("> *").each(function(){
                switch(this.nodeName){
                    case "lookat"://Coming Soon!
                        break;
                    case "matrix"://Coming Soon!
                        break;
                    case "rotate":
                        var rotate = glQuery.collada.parseFloatArray(this.textContent);
                        if(rotate[3] != 0)
                            object.modelViewMatrix = mat4.rotate(object.modelViewMatrix, rotate[3], glQuery.collada.sortCoord([rotate[0],rotate[1],rotate[2]],self.meta.upAxis));
                        break;
                    case "scale":
                        var scale = glQuery.collada.parseFloatArray(this.textContent);
                        if(scale[0] != 1 && scale[1] != 1 && scale[2] != 1 || scale[0] != 0 && scale[1] != 0 && scale[2] != 0 )
                            object.modelViewMatrix = mat4.scale(object.modelViewMatrix, glQuery.collada.sortCoord(scale,self.meta.upAxis));
                        break;
                    case "skew"://Coming Soon!
                        break;
                    case "translate":
                        var translate = glQuery.collada.parseFloatArray(this.textContent);
                        object.position = translate;
                        object.modelViewMatrix = mat4.translate(object.modelViewMatrix, glQuery.collada.sortCoord(translate,self.meta.upAxis));
                        break;
                    case "instance_camera":
                        object.type = "camera";
                        object.camera = glQuery.collada.camera.instanceCamera(this.getAttribute("url"), self);
                        object.lookAt = glQuery.camera.createLookAtByMvMatrix(object.modelViewMatrix);
                        break;
                    case "instance_controller"://Coming Soon!
                        break;
                    case "instance_geometry":
                        object.type = "object";
                        object.geometry = glQuery.collada.geometry.instanceGeometry(this.getAttribute("url"), self);
                        
                        if(jQuery(this).find("bind_material").is("bind_material")){
                            object.material = glQuery.collada.material.bindMaterial(jQuery(this).find("bind_material"),self)
                        }
                        else{
                            object.material = glQuery.collada.material.bindStandardMaterial();
                        }
                        glQuery.object.add(object.id, "object", "test", object.geometry.mesh, object.material[object.geometry.mesh.materialUrl].material, {"mvMat4":object.modelViewMatrix,"position":object.position});
                        break;
                    case "instance_light":
                        object.type = "light";
                        object.light = glQuery.collada.light.instanceLight(this.getAttribute("url"), self);
                        glQuery.light;
                        break;
                    case "instance_node"://Coming Soon!
                        break;
                    case "asset"://Coming Soon!
                        break;
                }
            })
            
        },
        getNodes:function(data){
            var node = [];
            data.find("> *").each(function(index){
                var nodeName = this.nodeName;
                var pre = nodeName.split('_');
                pre = pre[0];
                if(pre == "node"){
                    node[node.length] = this;
                }
            })
            return node;
        }
    };
})(glQuery );
