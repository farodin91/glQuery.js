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
            MAX_DIR_LIGHTS                          :0   ,
            MAX_AMBIENT_LIGHTS                          :0            
        },
        lights:[],
        art:[],
        id:[],
        i:0,
        add:function(id,art,lightData,direction){
            var light = new NormLight(id);
            light.setArt(art);
            light.setArt(lightData.type);
            light.setLightType(lightData.type);
            light.color = lightData[lightData.type].color;
            //var pos;
            var dir;
            switch(lightData.type){
                case "point":
                    lightData.point.position = direction.position;
                    delete lightData.point.color;
                    light.setLightData(lightData.point);
                    this.shaderLight.MAX_POINT_LIGHTS = this.shaderLight.MAX_POINT_LIGHTS + 1;
                    break;
                case "ambient":
                    delete lightData.ambient.color;
                    light.setLightData(lightData.ambient);   
                    this.shaderLight.MAX_AMBIENT_LIGHTS = this.shaderLight.MAX_AMBIENT_LIGHTS + 1;                 
                    break;
                case "spot":
                    lightData.spot.position = direction.position;
                    dir = vec3.create([0,-1,0]);
                    dir = mat4.multiplyVec3(direction.mvMat4, dir);
                    
                    lightData.spot.direction = dir;
                    delete lightData.spot.color;
                    light.setLightData(lightData.spot);
                    this.shaderLight.MAX_SPOT_LIGHTS = this.shaderLight.MAX_SPOT_LIGHTS + 1;
                    break;
                case "directional":
                    dir = vec3.create([0,-1,0]);
                    dir = mat4.multiplyVec3(direction.mvMat4, dir);
                    lightData.directional.direction = dir;
                    delete lightData.directional.color;
                    light.setLightData(lightData.directional);
                    this.shaderLight.MAX_DIR_LIGHTS = this.shaderLight.MAX_DIR_LIGHTS + 1;
                    break;
            }
            
            this.lights[light.i] = light;
        },
        getLightById:function(id,context){
            console.log(context);
            return [this.id[id]];
        },
        getLightByArt:function(art,context){  
            console.log(context);     
            return this.art[art];
        },
        uniformLighting:function(shader){
            var ambientLights = [];
            var pointLights = [];
            var spotLights = [];
            var directionalLights = [];
            for(var key in this.lights){
                switch(this.lights[key]["lightType"]){
                    case "point":
                        pointLights[pointLights.length] = {
                            color : this.lights[key]["color"],
                            position : this.lights[key]["lightData"]["position"],
                            constantAttenuation : this.lights[key]["lightData"]["constantAttenuation"],
                            linearAttenuation : this.lights[key]["lightData"]["linearAttenuation"],
                            distance : (this.lights[key]["lightData"]["distance"] === undefined)?0:this.lights[key]["lightData"]["distance"],
                            quadraticAttenuation : this.lights[key]["lightData"]["quadraticAttenuation"]
                        };
                        break;
                    case "spot":
                        pointLights[pointLights.length] = {
                            color : this.lights[key]["color"],
                            position : this.lights[key]["lightData"]["position"],
                            distance : (this.lights[key]["lightData"]["distance"] === undefined)?0:this.lights[key]["lightData"]["distance"]
                        };
                        break;
                    case "directional":
                        directionalLights[directionalLights.length] = {
                            color : this.lights[key]["color"],
                            direction : this.lights[key]["lightData"]["direction"]
                        };
                        break;
                    //case "ambient":
                    default:
                        ambientLights[ambientLights.length] = {
                            color : this.lights[key]["color"]
                        };
                        break;
                }
            }
            if(spotLights.length !== 0){
            
            }
            if(pointLights.length !== 0){
                var pointColors                 = new Float32Array((pointLights.length*3));
                var pointPosition               = new Float32Array((pointLights.length*3));
                var pointDistance               = new Float32Array((pointLights.length));
                var pointLinearAttenuation      = new Float32Array((pointLights.length));
                var pointQuadraticAttenuation   = new Float32Array((pointLights.length));
                var pointConstantAttenuation    = new Float32Array((pointLights.length));
                
                for(var i=0;i<directionalLights.length;i++){
                    pointColors[i*3+0]              = pointLights[i]["color"][0];
                    pointColors[i*3+1]              = pointLights[i]["color"][1];
                    pointColors[i*3+2]              = pointLights[i]["color"][2];
                    pointPosition[i*3+0]            = pointLights[i]["position"][0];
                    pointPosition[i*3+1]            = pointLights[i]["position"][1];
                    pointPosition[i*3+2]            = pointLights[i]["position"][2];
                    pointConstantAttenuation[i]     = pointLights[i]["constantAttenuation"];
                    pointDistance[i]                = pointLights[i]["distance"];
                    pointLinearAttenuation[i]       = pointLights[i]["linearAttenuation"];
                    pointQuadraticAttenuation[i]    = pointLights[i]["quadraticAttenuation"];
                }
                glQuery.gl.uniform3fv(shader["uniforms"]["light"]["uPointLightPosition"]["location"]                ,pointPosition);
                glQuery.gl.uniform3fv(shader["uniforms"]["light"]["uPointLightColor"]["location"]                   ,pointColors);
                glQuery.gl.uniform1fv(shader["uniforms"]["light"]["uPointLightDistance"]["location"]                ,pointDistance);
                //glQuery.gl.uniform1fv(shader["uniforms"]["light"]["uPointLightConstantAttenuation"]["location"]     ,pointConstantAttenuation);
                //glQuery.gl.uniform1fv(shader["uniforms"]["light"]["uPointLightLinearAttenuation"]["location"]       ,pointLinearAttenuation);
                //glQuery.gl.uniform1fv(shader["uniforms"]["light"]["uPointLightQuadraticAttenuation"]["location"]    ,pointQuadraticAttenuation);
            
            }
            if(directionalLights.length !== 0){
                var directionalColors = new Float32Array((directionalLights.length*3));
                var directionalDirection = new Float32Array((directionalLights.length*3));
                for(var k=0;k<directionalLights.length;k++){
                    directionalColors[k*3+0] = directionalLights[k]["color"][0];
                    directionalColors[k*3+1] = directionalLights[k]["color"][1];
                    directionalColors[k*3+2] = directionalLights[k]["color"][2];
                    directionalDirection[k*3+0] = directionalLights[k]["direction"][0];
                    directionalDirection[k*3+1] = directionalLights[k]["direction"][1];
                    directionalDirection[k*3+2] = directionalLights[k]["direction"][2];
                }
                glQuery.gl.uniform3fv(shader["uniforms"]["light"]["uDirectionalLightDirection"]["location"],directionalDirection);
                glQuery.gl.uniform3fv(shader["uniforms"]["light"]["uDirectionalLightColor"]["location"],directionalColors);
            }
            if(ambientLights.length !== 0){
                var ambientColors = new Float32Array((ambientLights.length*3));
                for(var j=0;j<directionalLights.length;j++){
                    ambientColors[j*3+0] = ambientLights[j]["color"][0];
                    ambientColors[j*3+1] = ambientLights[j]["color"][1];
                    ambientColors[j*3+2] = ambientLights[j]["color"][2];
                }
                glQuery.gl.uniform3fv(shader["uniforms"]["light"]["uAmbientLightColor"]["location"],ambientColors);
            }
        }
    };
    var NormLight = function(id){
        this.id                 = 0;
        this.i                  = 0;
        this.type               = "light";
        this.art                = [];
        this.light              = {};
        this.viewAble           = true;
        this.color              = vec3.create();
        this.lightData          = {};
        this.lightType          = 0;
        
        this.id             = id;
        this.i              = glQuery.light.i;
        glQuery.light.i     = glQuery.light.i + 1;
        
        glQuery.light.id[id]  = this.i;
        
        this.getType = function(){
            return this.type;
        };
        
        this.setArt = function(art){
            this.art[this.art.length] = art;
            
            if(!glQuery.light.art[this.art]){
                glQuery.light.art[this.art] = [];
            }
            glQuery.light.art[this.art][glQuery.light.art[this.art].length] = this.i;
        };
        this.getArt = function(){
            return this.art;
        };
        
        this.setLightType = function(lightType){
            this.lightType = lightType;
        };
        this.getLightType = function(){
            return this.lightType;
        };
        this.setViewAble = function(viewAble){
            this.viewAble = viewAble;
        };
        this.getViewAble = function(){
            return this.viewAble;
        };
        
        this.setLightData = function(lightData){
            this.lightData = lightData;
        };
        this.getLightData = function(){
            return this.lightData;
        };
        return this;
    };
    
    /*NormBuffer = function(){
        this.itemSize = 3;
        
        return this;
    };*/
})(glQuery );