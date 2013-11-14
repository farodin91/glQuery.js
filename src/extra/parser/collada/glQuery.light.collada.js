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
        instanceLight:function(url,data){
            var self = this;
            var light = {};
            var node = glQuery.collada.parseURI(url, data.data);
            node.find("> *").each(function(){
                switch(this.nodeName){
                    case "technique_common":
                        light = self.techniqueCommon(this,data);
                        break;
                    case "technique":
                        break;
                    case "asset":
                        break;
                    case "extra":
                        break;
                        
                }
            });
            return light;            
        },
        techniqueCommon:function(node,data){
            var self = this;
            var light = {};
            //node = $(node);
            node.find("> *").each(function(){
                switch(this.nodeName){
                    case "ambient":
                        light.type = "ambient";
                        light.ambient = self.parseAmbient(this,data);
                        break;
                    case "point":
                        light.type = "point";
                        light.point = self.parsePoint(this,data);
                        break;
                    case "spot":
                        light.type = "spot";
                        light.spot = self.parseSpot(this,data);
                        break;
                    case "directional":
                        light.type = "directional";
                        light.directional = self.parseDirectional(this,data);
                        break;
                        
                }
            });
            return light;
        },
        parseSpot:function(node,data){
            var spot = {};
            //node = $(node);
            spot.color = glQuery.collada.parseFloatArray(node.find("color").text());
            spot.constantAttenuation = node.find("constant_attenuation").text() ? 
                parseFloat(node.find("constant_attenuation").text()) : 1.0;

            spot.linearAttenuation = node.find("linear_attenuation").text() ? 
                parseFloat(node.find("linear_attenuation").text()) : 0.0;

            spot.quadraticAttenuation = node.find("quadratic_attenuation").text() ? 
                parseFloat(node.find("quadratic_attenuation").text()) : 0.0;

            spot.falloffAngle = node.find("falloff_angle").text() ? 
                parseFloat(node.find("falloff_angle").text()) : 180.0;

            spot.falloffExponent = node.find("falloff_exponent").text() ? 
                parseFloat(node.find("falloff_exponent").text()) : 0.0;
            console.log(data);
            return spot;  
        },
        parseAmbient:function(node,data){
            var ambient = {};
            //node = $(node);
            ambient.color = glQuery.collada.parseFloatArray(node.find("color").text());
            console.log(data);
            return ambient;            
        },
        parsePoint:function(node,data){
            console.log(data);
            var point = {};
            //node = $(node);
            point.color = glQuery.collada.parseFloatArray(node.find("color").text());
            point.constantAttenuation = node.find("constant_attenuation").text() ? 
                parseFloat(node.find("constant_attenuation").text()) : 1.0;

            point.linearAttenuation = $(node).find("linear_attenuation").text() ? 
                parseFloat(node.find("linear_attenuation").text()) : 0.0;

            point.quadraticAttenuation = $(node).find("quadratic_attenuation").text() ? 
                parseFloat(node.find("quadratic_attenuation").text()) : false;

            return point;   
        },
        parseDirectional:function(node,data){
            console.log(data);
            var directional = {};
            //node = $(node);
            directional.color = glQuery.collada.parseFloatArray(node.find("color").text());
            return directional;  
        }
        
    };
})(glQuery, jQuery );
