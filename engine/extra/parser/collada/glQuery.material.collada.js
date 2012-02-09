/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.material.collada.js
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
    
    glQuery.collada.material = {
        bindMaterial:function(node,data){
            this.data = data.data;
            this.meta = data.meta;
            var self = this;
            var material = {}
            node.find("> *").each(function(){
                switch(this.nodeName){
                    case "param"://coming Soon!
                        break;
                    case "technique_common":
                        material = self.techniqueCommon(this);
                        break;
                    case "technique"://Coming Soon!
                        break;
                    case "extra"://Coming Soon!
                        break;
                }
            });
            return {};
        },
        techniqueCommon:function(node){
            var self = this;
            var material = {}
            jQuery(node).find("> *").each(function(){
                switch(this.nodeName){
                    case "instance_material":
                        material[this.getAttribute("symbol")] = {};
                        material[this.getAttribute("symbol")].target = this.getAttribute("target");
                        material[this.getAttribute("symbol")].material = self.instanceMaterial(this);
                        
                }
            })
            return {};
        },
        instanceMaterial:function(node){
            var self = this;
            var material = {}
            material = this.getMaterial(glQuery.collada.parseURI(node.getAttribute("target"),this.data));
            jQuery(node).find("> *").each(function(){
                switch(this.nodeName){
                    case "bind"://Coming Soon!
                        break;
                    case "bind_vertex_input"://Coming Soon!
                        break;
                    case "extra"://Coming Soon!
                        break;
                    
                }
            });
            return {};
        },
        getMaterial:function(node){
            var self = this;
            var material = {}
            
            return {};
        },
        bindStandardMaterial:function(){
            var self = this;
            var material = {}
            return {};
        }
    };
})(glQuery );
