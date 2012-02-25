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
            return material;
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
            return material;
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
            return material;
        },
        getMaterial:function(node){
            var self = this;
            var material = {}
            node.find("> *").each(function(){
                switch(this.nodeName){
                    case "asset"://Coming Soon!
                        break;
                    case "instance_effect":
                        material = self.instanceEffect(this);
                        break;
                    case "extra"://Coming Soon!
                        break;
                    
                }
            });
            return material;
        },
        instanceEffect:function(node){
            var self = this;
            var effect = {}
            effect = this.getEffect(glQuery.collada.parseURI(node.getAttribute("url"),this.data));
            jQuery(node).find("> *").each(function(){
                switch(this.nodeName){
                    case "technique_hint"://Coming Soon!
                        break;
                    case "setparam":
                        break;
                    case "extra"://Coming Soon!
                        break;
                    
                }
            });
            
            return effect;
        },
        getEffect:function(node){
            var self = this;
            var effect = {}
            node.find("> *").each(function(){
                switch(this.nodeName){
                    case "asset"://Coming Soon!
                        break;
                    case "annotate"://Coming Soon!
                        break;
                    case "profile_BRIDGE"://Coming Soon!
                        break;
                    case "profile_CG"://Coming Soon!
                        break;
                    case "profile_GLES"://Coming Soon!
                        break;
                    case "profile_GLES2"://Coming Soon!
                        break;
                    case "profile_GLSL"://Coming Soon!
                        break;
                    case "profile_COMMON":
                        effect = self.getProfileCOMMON(this);
                        break;
                    case "newparam"://Coming Soon!
                        break;
                    case "extra"://Coming Soon!
                        break;
                    
                }
            });
            return effect;
        },
        getProfileCOMMON:function(node){
            var self = this;
            var profil = {}
            jQuery(node).find("> *").each(function(){
                switch(this.nodeName){
                    case "technique":
                        profil = self.getTechnique(this);
                        break;
                    case "asset"://Coming Soon!
                        break;
                    case "newparam"://Coming Soon!
                        break;
                    case "extra"://Coming Soon!
                        break;                    
                }
            })
            return profil;
        },
        getTechnique:function(node){
            var self = this;
            var profil = {}
            jQuery(node).find("> *").each(function(){
                switch(this.nodeName){
                    case "asset"://Coming Soon!
                        break;
                    case "annotate"://Coming Soon!
                        break;
                    case "blinn"://Coming Soon!
                        break;
                    case "constant"://Coming Soon!
                        break;
                    case "lambert":
                        break;
                    case "phong":
                        profil.phong = {};
                        profil.phong = self.getPhong(this);
                        break;
                    case "pass"://Coming Soon!
                        break;
                    case "extra"://Coming Soon!
                        break;                    
                }
            })
            return profil;
        },
        getPhong:function(node){
            var self = this;
            var phong = {};
            var typesColor = ["emission","ambient","diffuse","specular","transparent","reflective"];
            var typesValue = ["reflectivity","transparency","shininess","index_of_refraction"];
            jQuery(node).find("> *").each(function(){
                switch(this.nodeName){
                    case "emission":
                    case "ambient":
                    case "diffuse":
                    case "specular":
                    case "transparent":
                    case "reflective":
                        phong[this.nodeName]=self.getCommonColorOrTexture(this);
                        
                        break;
                    case "reflectivity":
                    case "transparency":
                    case "shininess":
                    case "index_of_refraction":
                        phong[this.nodeName]=self.getCommonFloat(this);
                        break;
                    
                }
            });
            for(var key in typesColor){
                if(!phong[typesColor[key]])
                    phong[typesColor[key]] = new Float32Array([0,0,0,1]);
            }
            for(var key2 in typesValue){
                if(!phong[typesValue[key2]])
                    phong[typesValue[key2]] = 0.0;
            }
            return phong;
        },
        getCommonFloat:function(node){
            var Float = 0
            var child = node.firstElementChild;
            if(child.nodeName == "float"){
                Float = parseFloat(child.textContent);
            }else{
                Float = this.getCommonParam(child.getAttribute("ref"));
            }
            return Float;
        },
        getCommonColorOrTexture:function(node){
            var self = this;
            var profil;
            var child = node.firstElementChild;
            switch(child.nodeName){
                case "color":
                    profil = glQuery.collada.parseFloatArray(child.textContent);
                    break;
                case "texture":
                    profil = glQuery.collada.instanceTexture(child,self);
                    break;
                case "param":
                    profil = this.getCommonParam(child.getAttribute("ref"));
                    break;
            }
            return profil
        },
        getCommonParam:function(sid){
            var node = jQuery("[sid="+sid+"]");
            var param;
            node.find("> *").each(function(){
                switch(this.nodeName){
                    case "float":
                        param = parseFloat(this.textContent);
                        break;
                    case "float2":
                    case "float3":
                    case "float4":
                        param = glQuery.collada.parseFloatArray(this.textContent);
                        break;
                    case "sampler2D":
                        break;
                }
        })
        if(!param)
            param = 0.0;
        return param;
    },
    bindStandardMaterial:function(){
        var self = this;
        var material = {}
        material.Material = {}
        material.Material.material = {}
        var phong = {
            ambient: [0,0,0,1],
            diffuse: [0.4, 0.4, 0.4,1],
            emission: [0,0,0,1],
            index_of_refraction: 1,
            reflective: [0,0,0,1],
            reflectivity:0,
            shininess: 50,
            specular : [0.8, 0.8, 0.8,1],
            transparency :0,
            transparent:[0,0,0,1]
        }
        
        return material;
    }
};
})(glQuery );
