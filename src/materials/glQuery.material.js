/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.material.js
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

(function( glQuery, undefined ) {

    glQuery.material = {
        createShaderOptions:function(material){
            var shaderOptions = {
                "fragmentType" : "test",
                "USE_TEXTURE" : 0,
                "USE_TEXTURES" : {}
            };
            for(var key in material){
                shaderOptions["fragmentType"] = key;
            }
            for(var keyOptions in material[shaderOptions["fragmentType"]]){
                switch(keyOptions){
                    case "emission":
                    case "ambient":
                    case "diffuse":
                    case "specular":
                        if(!material[shaderOptions["fragmentType"]][keyOptions]["type"]){
                            
                        }else{
                            shaderOptions["USE_TEXTURE"] = shaderOptions["USE_TEXTURE"] + 1;
                            shaderOptions["USE_TEXTURES"]["USE_" + keyOptions.toUpperCase() + "_TEXTURE"] = true;
                        }
                }
            }
            return shaderOptions;
        },
        uniformMaterial:function(shader, material){
            var useTexture = false;
            for(var key in shader["uniforms"][shader["type"]]){
                useTexture = false;
                switch (key){
                    case "fvSpecular":
                        if(shader["options"]["USE_TEXTURES"]["USE_SPECULAR_TEXTURE"] && 
                            key === "fvSpecular"){
                            useTexture = true;
                        }
                        break;
                    case "fvEmission":
                        if(shader["options"]["USE_TEXTURES"]["USE_SPECULAR_TEXTURE"] && 
                            key === "fvEmission"){
                            useTexture = true;
                        }
                        break;
                    case "fvAmbient":
                        if(shader["options"]["USE_TEXTURES"]["USE_SPECULAR_TEXTURE"] && 
                            key === "fvAmbient"){
                            useTexture = true;
                        }
                        break;
                    case "fvDiffuse":
                        if(shader["options"]["USE_TEXTURES"]["USE_SPECULAR_TEXTURE"] && 
                            key === "fvDiffuse"){
                            useTexture = true;
                        }
                        break;
                    case "fShininess":
                        break;
                }
                
                if(useTexture){
                    
                }else{
                    var color = material[shader["type"]][key.replace("fv","").toLowerCase()];
                    var glUniformData = shader["uniforms"][shader["type"]][key];
                    var glLocation = glUniformData["location"];
                    if(glLocation != null){
                        glQuery.gl.uniform4f(glLocation,color[0],color[1],color[2],color[3]);
                    }
                }
            }
        }
    };
})(glQuery);