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
        
        getCollada :function(url,callback){
            var self = this;
            $.ajax({
                url:url,
                dataType:"xml",
                error:function(){},
                success:function(data){
                    data = self.initParse(data);
                    var meta = self.parseMeta(data);
                    callback(data,meta);
                }
            });
        },
        initParse:function(data){
            return $(data);
        },
        parseMeta:function(data){
            var meta = {};
            meta.library = this.getLibraries(data);
            meta.upAxis = 0;
            switch(data.find("up_axis").text()){
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
            return meta;
        },
        getLibraries:function(data){
            var libraries = {};
            data.find("COLLADA >*").each(function(){
                var nodeName = this.nodeName;
                var pre = nodeName.split('_');
                pre = pre[0];
                if(pre === "library"){
                    libraries[nodeName] = this;
                }
            });
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