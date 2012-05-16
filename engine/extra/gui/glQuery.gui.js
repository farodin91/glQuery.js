/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.gui.js
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
 *	glQuery.collada.js
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
    glQuery.gui = {
        id:{},
        _class:{},
        tabIndex :[],
        guiObject:[],
        i:0,
        shaderkeys:{},
        layer:[],
        init:function(){
            this.createShader();
            if(glQuery.options.debug){
                this.createDebuglayer();
            }
            glQuery.guiWorker.onmessage = function(){
                
            }
        },
        createShader:function(){
            var optionsTextures = {
                "USE_TEXTURE": 1,
                "fragmentType": "gui"
            }
            this.shaderkeys["textures"] = glQuery.shader.createShader(optionsTextures);
            var optionsColor= {
                "USE_TEXTURE": 0,
                "fragmentType": "gui"
            }
            this.shaderkeys["color"] = glQuery.shader.createShader(optionsColor);
            return true;
            
        },
        renderGui:function(){
            
        },
        createDebuglayer:function(){
            var debugLayer = new glQuery.gui.Layer();
            var lefttop = new Point("lefttop");
            lefttop.left = 0;
            lefttop.top = 0;
            var righttop = new Point("righttop");
            righttop.right = 0;
            righttop.top = 0;
            var leftbottom = new Point("leftbottom");
            leftbottom.left = 0;
            leftbottom.bottom = 0;
            var rightbottom = new Point("rightbottom");
            rightbottom.right = 0;
            rightbottom.bottom = 0;
                
            debugLayer.addObject(lefttop);
            debugLayer.addObject(righttop);
            debugLayer.addObject(leftbottom);
            debugLayer.addObject(rightbottom);
            
            this.addLayer(debugLayer);
            return true;
        },
        /**
         * @function addLayer
         * 
         * @description 
         * 
         * @param {Layer} layer
         * 
         * @return {boolean} glQuery
         * 
         */
        
        addLayer:function(layer){
            this.layer[layer._i] = layer;
            glQuery.guiWorker.postMessage({"layer":layer,"height":glQuery.canvasHeight,"width":glQuery.canvasWidth});
        }
    };
})(glQuery);