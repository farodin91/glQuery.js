/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 * @fileOverview
 * @name glQuery.scene.collada.js
 * @author Jan Jansen - farodin91@googlemail.com
 * @description Coming soon
 *
 *
 * Depends:
 *	glQuery.core.js
 */

(function( glQuery,$, undefined ) {
    
    glQuery.collada.scene = {
        data:{},
        meta:{},
        debug:false,
        parse:function(file){
            if(this.debug){
                console.log("glQuery.collada.scene -> parse(file: " + file + ")");
            }
            var self = this;
            glQuery.collada.getCollada(
                file,
                function(data,meta){
                    self.instanceScene(data,meta);
                },
                function(e){
                    console.log("glQuery.collada.scene -> parse() => error " + e);
                }
            );
        },
        instanceScene:function(data,meta){
            if(this.debug){
                console.log(data);
            }
            var instance = "";
            var instanceUrl = "";
            this.data = data;
            this.meta = meta;

            var node = glQuery.collada.getChildNodeByName(data,"scene"); 

            for(var k = 0; k < node.children.length;k++){
                var childNode = node.children.item(k);
                if(this.debug){
                    console.info(childNode.nodeName);
                }
                var nodeName = childNode.nodeName;
                var pre = nodeName.split('_');
                pre = pre[0];
                if(pre === "instance"){
                    instance = nodeName ;
                    instanceUrl = childNode.getAttribute("url");
                }
            }
            switch(instance){
                case "instance_physics_scene":
                    this.physicsScene(instanceUrl);
                    break;
                case "instance_visual_scene":
                    this.visualScene(instanceUrl);
                    break;
                default:
                    console.log("no more types are defined");
                    break;
            }
            
            glQuery.renderWorker.postMessage("objects");
            glQuery.imageWorker.postMessage("imageLoaded");
        },
        visualScene:function(url){
            var scene = $(this.data).find(url).get(0);
            if(this.debug){
                console.log(url);
                console.log(scene);
            }
            var nodes = this.getNodes(scene);
            glQuery.progressBarStep("loadingmodels",30);
            for(var key in nodes){
                this.createObjectByNode(nodes[key]);
            }
            
        },
        createObjectByNode:function(node){
            var object = {};
            object.id = node.getAttribute("id");
            object.modelViewMatrix = mat4.create();
            object.modelViewMatrix = mat4.identity();
            object.position = [0,0,0];

            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child.nodeName);
                }
                switch(child.nodeName){
                    case "lookat"://Coming Soon!
                        break;
                    case "matrix"://Coming Soon!
                        break;
                    case "rotate":
                        var rotate = glQuery.collada.parseFloatArray(child.textContent);
                        if(rotate[3] !== 0){
                            object.modelViewMatrix = mat4.rotate(
                                object.modelViewMatrix,
                                rotate[3], 
                                glQuery.collada.sortCoord([rotate[0],rotate[1],rotate[2]],this.meta.upAxis)
                            );
                        }
                        break;
                    case "scale":
                        var scale = glQuery.collada.parseFloatArray(child.textContent);
                        if(scale[0] !== 1 && 
                            scale[1] !== 1 && 
                            scale[2] !== 1 || 
                            scale[0] !== 0 && 
                            scale[1] !== 0 && 
                            scale[2] !== 0 ){
                            object.modelViewMatrix = mat4.scale(
                                object.modelViewMatrix, 
                                glQuery.collada.sortCoord(scale,this.meta.upAxis)
                            );
                        }
                        break;
                    case "skew"://Coming Soon!
                        break;
                    case "translate":
                        var translate = glQuery.collada.parseFloatArray(child.textContent);
                        object.position = translate;
                        object.modelViewMatrix = mat4.translate(
                            object.modelViewMatrix, 
                            glQuery.collada.sortCoord(translate,this.meta.upAxis)
                        );
                        break;
                    case "instance_camera":
                        object.type = "camera";
                        object.camera = glQuery.collada.camera.instanceCamera(child.getAttribute("url"), this);
                        object.lookAt = glQuery.camera.createLookAtByMvMatrix(object.modelViewMatrix);
                        break;
                    case "instance_controller"://Coming Soon!
                        break;
                    case "instance_geometry":
                        object.type = "object";
                        object.geometry = glQuery.collada.geometry.instanceGeometry(
                            child.getAttribute("url"), 
                            this
                        );
                        
                        if($(child).find("bind_material").is("bind_material")){
                            object.material = glQuery.collada.material.bindMaterial(
                                $(child).find("bind_material"),
                                this
                            );
                        }
                        else{
                            object.material = glQuery.collada.material.bindStandardMaterial();
                        }
                        glQuery.object.add(
                            object.id, 
                            object.type, 
                            "test", 
                            object.geometry.mesh, 
                            object.material[object.geometry.mesh.materialUrl].material, 
                            {
                                "mvMat4":object.modelViewMatrix,
                                "position":object.position
                            }
                        );
                        break;
                    case "instance_light":
                        object.type = "light";
                        object.light = glQuery.collada.light.instanceLight(child.getAttribute("url"), this);
                        glQuery.light.add(
                            object.id, 
                            "test", 
                            object.light, 
                            {
                                "mvMat4":object.modelViewMatrix,
                                "position":object.position
                            }
                        );
                        break;
                    case "instance_node"://Coming Soon!
                        break;
                    case "asset"://Coming Soon!
                        break;
                }
            }
        },
        getNodes:function(node){
            var nodes = [];
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child.nodeName);
                }
                var nodeName = child.nodeName;
                var pre = nodeName.split('_');
                pre = pre[0];
                if(pre === "node"){
                    nodes[nodes.length] = child;
                }
            }
            return nodes;
        }
    };
})(glQuery, jQuery );
