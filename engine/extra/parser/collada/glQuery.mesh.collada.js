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
            var nodes = jQuery(node).find("> *");
            nodes.each(function(){
                switch(this.nodeName){
                    case "source":
                        break;
                    case "vertices":
                        break;
                    case "lines":
                        break;
                    case "linestrips":
                        break;
                    case "polygons":
                        break;
                    case "polylist":
                        break;
                    case "triangles":
                        break;
                    case "trifans":
                        break;
                    case "tristrips":
                        break;
                    case "extra"://Coming Soon!
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
