/*
 * Copyright 2013, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.collada.js
 *@author Jan Jansen - farodin91@googlemail.com
 *@description Coming soon
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
(function( glQuery ,$ ,undefined ) {

    glQuery.collada = {//komplette überarbeitung
        debug:false,
        getCollada :function(url,callback,err){
            var self = this;
            if(this.debug){
                console.log(url);
                console.log(callback);
                console.log(err);
            }
            $.ajax({
                url:url,
                dataType:"xml",
                error:function(e){
                    err(e);
                },
                success:function(xmlDocument){
                    var node = self.getColladaNode(xmlDocument);
                    var meta = self.parseMeta(node);
                    callback(node,meta);
                }
            });
        },
        initParse:function(data){
            if(this.debug){
                console.log(data);
            }
            return $(data);
        },
        parseMeta:function(data){
            if(this.debug){
                console.log(data);
            }
            var meta = {};
            meta.library = this.getLibraries(data);
            meta.upAxis = 0;
            for(var i = 0; i< data.children.length;i++){
                var child = data.children.item(i);
                if(this.debug){
                    console.info(child.nodeName);
                }
                if("up_axis" === child.nodeName){
                    switch(child.innerHTML){
                        case "Y_UP":
                            meta.upAxis = 0;
                            break;
                        case "Z_UP":
                            meta.upAxis = 1;
                            break;
                        case "X-UP"://Version 1.5
                        case "X_UP"://Version 1.4.1
                            meta.upAxis = 2;//Coming Soon!
                            break;
                        default:
                            meta.upAxis = 0;
                            break;
                    }
                    break;
                }
            }
            console.info(meta);
            return meta;
        },
        getColladaNode:function(xmlDocument){
            return this.getChildNodeByName(xmlDocument,"COLLADA");
        },
        getChildNodeByName:function(node,name){
            if(this.debug){
                console.log(node);
                console.log(name);
            }
            var childNode = null;
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child.nodeName);
                }
                if(name === child.nodeName){
                    childNode = child;
                }
            }
            return childNode;

        },
        getLibraries:function(node){
            if(this.debug){
                console.log(node);
            }
            var libraries = {};
            for(var i = 0;i < node.children.length;i++){
                var childLib = node.children.item(i);
                if(this.debug){
                    console.info(childLib.nodeName);
                }
                var nodeName = childLib.nodeName;
                var pre = nodeName.split('_');
                pre = pre[0];
                if(pre === "library"){
                    libraries[nodeName] = childLib;
                }
            }
            
            if(this.debug){
                console.log(libraries);
            }
            return libraries;
        },
        parseIntArray:function(s){
            s = s.toString().replace( /^\s+/, "" ).replace( /\s+$/, "" );
            if (s === ""){
                return [];
            }
            // this is horrible
            var ss = s.split(/\s+/);

            var res = new Int32Array(ss.length);
            for (var i = 0, j = 0; i < ss.length; i++) {
                if (ss[i].length === 0){
                    continue;
                }
                if(ss[i] !=  null){
                    res[j++] = parseInt(ss[i],10);
                }
            }
            return res;
        },
        parseFloatArray:function(s){
            s = s.toString().replace( /^\s+/, "" ).replace( /\s+$/, "" );
            if (s === ""){
                return [];
            }

            // this is horrible
            var ss = s.split(/\s+/);
            var res = new Float32Array(ss.length);
            for (var i = 0, j = 0; i < ss.length; i++) {
                if (ss[i].length === 0){
                    continue;
                }
                res[j++] = parseFloat(ss[i]);
            }          
            return res;
        },
        parseBoolArray:function(s){
            s = s.toString().replace( /^\s+/, "" ).replace( /\s+$/, "" );
            if (s === ""){
                return [];
            }
            var ss = s.split(/\s+/);
            
            var res = new Array(ss.length);
            for (var i = 0, j = 0; i < ss.length; i++) {
                if (ss[i].length === 0){
                    continue;
                }
                res[j++] = parseBool(ss[i]);
            }          
            return res;
        },
        sortCoord:function(coord,upAxis){
            switch(upAxis){
                case 0:
                    return coord;
                case 1:
                    return [coord[0],coord[2],(-coord[1])];
                case 2:
                    return [(-coord[1]),coord[0],coord[2]];
            }
        },
        parseURI:function(uri,data){
            
            if(uri.indexOf("/") === -1){
                return jQuery(data).find(uri);
            }else{
                //Coming Soon!
            }
        }
    };
})(glQuery, jQuery );