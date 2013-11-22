/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.light.collada.js
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

(function( glQuery,$, undefined ) {
    
    glQuery.collada.light = {
        debug:false,
        instanceLight:function(url,data){
            if(this.debug){
                console.log(data);
                console.log(url);
            }
            var light = {};
            var node = glQuery.collada.parseURI(url, data.data).get(0);
            if(this.debug){
                console.log(node);
            }
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child);
                }
                switch(child.nodeName){
                    case "technique_common":
                        light = this.techniqueCommon(child,data);
                        break;
                    case "technique":
                        break;
                    case "asset":
                        break;
                    case "extra":
                        break;
                }
            }
            return light;            
        },
        techniqueCommon:function(node,data){
            var light = {};
            if(this.debug){
                console.log(data);
                console.log(node);
            }
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child);
                }
                switch(child.nodeName){
                    case "ambient":
                        light.type = "ambient";
                        light.ambient = this.parseAmbient(child,data);
                        break;
                    case "point":
                        light.type = "point";
                        light.point = this.parsePoint(child,data);
                        break;
                    case "spot":
                        light.type = "spot";
                        light.spot = this.parseSpot(child,data);
                        break;
                    case "directional":
                        light.type = "directional";
                        light.directional = this.parseDirectional(child,data);
                        break;    
                }                 
            }
            return light;
        },
        parseSpot:function(node,data){
            var spot = {};
            if(this.debug){
                console.log(data);
                console.log(node);
            }
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child);
                }
                switch(child.nodeName){
                    case "color":
                        spot.color = glQuery.collada.parseFloatArray(child.innerHTML);
                        break;
                    case "constant_attenuation":
                        spot.constantAttenuation = child.innerHTML ? parseFloat(child.innerHTML) : 1.0;
                        break;
                    case "linear_attenuation":
                        spot.linearAttenuation = child.innerHTML ? parseFloat(child.innerHTML) : 0.0;
                        break;
                    case "quadratic_attenuation":
                        spot.quadraticAttenuation = child.innerHTML ? parseFloat(child.innerHTML) : 0.0;
                        break;
                    case "falloff_angle":
                        spot.falloffAngle = child.innerHTML ? parseFloat(child.innerHTML) : 180.0;
                        break;
                    case "falloff_exponent":
                        spot.falloffExponent = child.innerHTML ? parseFloat(child.innerHTML) : 0.0;
                        break;
                }
            }
            return spot;  
        },
        parseAmbient:function(node,data){
            var ambient = {};
            if(this.debug){
                console.log(data);
                console.log(node);
            }
            //node = $(node);
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child);
                }
                if(child.nodeName === "color"){
                    ambient.color = glQuery.collada.parseFloatArray(child.innerHTML);
                }
            }
            return ambient;            
        },
        parsePoint:function(node,data){
            var point = {};
            if(this.debug){
                console.log(data);
                console.log(node);
            }
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child);
                }
                switch(child.nodeName){
                    case "color":
                        point.color = glQuery.collada.parseFloatArray(child.innerHTML);
                        break;
                    case "constant_attenuation":
                        point.constantAttenuation = child.innerHTML ? parseFloat(child.innerHTML) : 1.0;
                        break;
                    case "linear_attenuation":
                        point.linearAttenuation = child.innerHTML ? parseFloat(child.innerHTML) : 0.0;
                        break;
                    case "quadratic_attenuation":
                        point.quadraticAttenuation = child.innerHTML ? parseFloat(child.innerHTML) : false;
                        break;
                }
            }
            return point;   
        },
        parseDirectional:function(node,data){
            var directional = {};
            if(this.debug){
                console.log(data);
                console.log(node);
            }
            for(var i = 0; i< node.children.length;i++){
                var child = node.children.item(i);
                if(this.debug){
                    console.info(child);
                }
                if(child.nodeName === "color"){
                    directional.color = glQuery.collada.parseFloatArray(child.innerHTML);
                }
            }
            return directional;  
        }
        
    };
})(glQuery, jQuery );
