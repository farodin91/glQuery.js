/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.light.js
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
 *      glQuery.core.js
 */

(function( glQuery, undefined ) {
    
    glQuery.light = {
        shaderLight:{
            MAX_SPOT_LIGHTS                         :0,
            MAX_POINT_LIGHTS                        :0,
            MAX_DIR_LIGHTS                          :0            
        },
        lights:[],
        art:[],
        id:[],
        i:0,
        add:function(id,art,lightData,direction){
            var light = new NormLight(id);
            light.setArt(art);
            light.setArt(lightData.type);
            var pos;
            var dir;
            switch(lightData.type){
                case "point":
                    lightData.point.position = direction.position;
                    light.setLightData(lightData.point);
                    this.shaderLight.MAX_POINT_LIGHTS = this.shaderLight.MAX_POINT_LIGHTS + 1;
                    break;
                case "ambient":
                    light.setLightData(lightData.ambient);                    
                    break;
                case "spot":
                    lightData.spot.position = direction.position;
                    dir = vec3.create([0,-1,0]);
                    dir = mat4.multiplyVec3(direction.mvMat4, dir);
                    
                    lightData.spot.direction = dir;
                    light.setLightData(lightData.spot);
                    this.shaderLight.MAX_SPOT_LIGHTS = this.shaderLight.MAX_SPOT_LIGHTS + 1;
                    break;
                case "directional":
                    dir = vec3.create([0,-1,0]);
                    dir = mat4.multiplyVec3(direction.mvMat4, dir);
                    lightData.directional.direction = dir;
                    light.setLightData(lightData.directional);
                    this.shaderLight.MAX_DIR_LIGHTS = this.shaderLight.MAX_DIR_LIGHTS + 1;
                    break;
            }
            light.color = lightData[lightData.type].color;
            
            this.lights[light.i] = light;
        },
        getLightById:function(id,context){
            return [this.id[id]];
        },
        getLightByArt:function(art,context){       
            return this.art[art];
        },
        uniformLighting:function(shader){
            
        }
    };
    NormLight = function(id){
        this.id                 = 0;
        this.i                  = 0;
        this.type               = "light";
        this.art                = [];
        this.light              = {};
        this.viewAble           = true;
        this.color              = vec3.create();
        this.lightData          = {};
        
        this.id             = id;
        this.i              = glQuery.light.i;
        glQuery.light.i     = glQuery.light.i + 1;
        
        glQuery.light.id[id]  = this.i;
        
        this.getType = function(){
            return this.type;
        };
        
        this.setArt = function(art){
            this.art[this.art.length] = art;
            
            if(!glQuery.object.art[this.art]){
                glQuery.object.art[this.art] = [];
            }
            glQuery.object.art[this.art][glQuery.object.art[this.art].length] = this.i;
        };
        this.getArt = function(){
            return this.art;
        };
        
        
        this.setViewAble = function(viewAble){
            this.viewAble = viewAble;
        };
        this.getViewAble = function(){
            return this.viewAble;
        };
        
        
        this.setLightData = function(lightData){
            this.lightData = lightData;
        }
        this.getLightData = function(){
            return this.lightData;
        }
        return this;
    };
    
    NormBuffer = function(){
        this.itemSize = 3;
        
        return this;
    };
})(glQuery );