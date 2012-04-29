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
            switch(lightData.type){
                case "point":
                    break;
                case "ambient":
                    break;
                case "spot":
                    break;
                case "directional":
                    break;
            }
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
        this.art                = "";
        this.light              = {};
        this.viewAble           = true;
        this.shaderProgramKey   = -1;
        
        
        this.id             = id;
        this.i              = glQuery.light.i;
        glQuery.light.i     = glQuery.light.i + 1;
        
        glQuery.light.id[id]  = this.i;
        
        this.getType = function(){
            return this.type;
        };
        
        this.setArt = function(art){
            this.art = art;
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
        return this;
    };
    
    NormBuffer = function(){
        this.itemSize = 3;
        
        return this;
    };
})(glQuery );