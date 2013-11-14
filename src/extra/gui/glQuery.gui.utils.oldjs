/*
 * Copyright 2012, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.gui.utils.js
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
    
    glQuery.gui.Object = function(id){
        return this;
        
    }
    
    glQuery.gui.Object.prototype = {
        get type(){
            return this._type;
        },
        get Class(){
            return this._class;
        },
        set Class(val){
            this._class[this._class.length] = val;
        },
        get id(){
            return this._id;
        },
        set id(val){
            if(!glQuery.object.existId(val)){
                this._id = val;
                glQuery.gui.id[val] = this._i;
                return true;
            }else{
                return false;
            }
        },
        get top(){
            return this._location.top;
        },
        set top(val){
            this._location.top = val;
        },
        get left(){
            return this._location.left;
        },
        set left(val){
            this._location.left = val;
        },
        get right(){
            return (glQuery.canvasWidth-(this._location.left+this._size.width));
        },
        set right(val){
            val = ((glQuery.canvasWidth - val)-this._size.width);
            this._location.left = val;
        },
        get bottom(){
            return (glQuery.canvasHeight-(this._location.top+this._size.height));
        },
        set bottom(val){
            val = ((glQuery.canvasheight - val)-this._size.height);
            this._location.top = val;
        },
        get width(){
            return this._size.width;
        },
        set height(val){
            this._size.height = val;
        },
        get height(){
            return this._size.height;
        },
        set width(val){
            this._size.width = val;
        }
    };

    glQuery.gui.Button = function(id){
        this._type = "button";
        this._class = [];
        this._id = undefined;
        this._location = {
            top:0,
            left:0
        };
        this._size = {
            width:100,
            height:50
        };
        this._pressedColor = "";
        this._borderColor = "";
        this._borderRadius = 0;
        this._cursor = "default";
        this._font = "Font";
        this._text = "Button";
        this._i = glQuery.gui.i;
        glQuery.gui.i = glQuery.gui.i +1;
        this._tabIndex = glQuery.gui.tabIndex.length;
        glQuery.gui.tabIndex[glQuery.gui.tabIndex.length] = this._i;
        if(!glQuery.object.existId(id) && id !=undefined){
            this._id = id;
            glQuery.gui.id[id] = this._i;
        }
        this._tooltip = null;//Coming Soon!
        this.addToolTip = function(tooltip){
            this._tooltip = tooltip;
        }
        return this;
    };
    
    glQuery.gui.Button.prototype = new glQuery.gui.Object();
    glQuery.gui.Button.prototype.constructor = glQuery.gui.Button;
    glQuery.gui.Button.prototype.__defineGetter__("text", function() { return this._text; });
    glQuery.gui.Button.prototype.__defineGetter__("font", function() { return this._font; });
    glQuery.gui.Button.prototype.__defineGetter__("pressedColor", function() { return this._pressedColor; });
    glQuery.gui.Button.prototype.__defineGetter__("borderColor", function() { return this._borderColor; });
    glQuery.gui.Button.prototype.__defineGetter__("borderRadius", function() { return this._borderRadius; });
    glQuery.gui.Button.prototype.__defineGetter__("cursor", function() { return this._cursor; });
    glQuery.gui.Button.prototype.__defineSetter__("text", function(val) { this._text = val; });
    glQuery.gui.Button.prototype.__defineSetter__("font", function(val) { this._font = val; });
    glQuery.gui.Button.prototype.__defineSetter__("pressedColor", function(val) { this._pressedColor = val; });
    glQuery.gui.Button.prototype.__defineSetter__("borderColor", function(val) { this._borderColor = val; });
    glQuery.gui.Button.prototype.__defineSetter__("borderRadius", function(val) { this._borderRadius = val; });
    glQuery.gui.Button.prototype.__defineSetter__("cursor", function(val) { this._cursor = val; });
    window.Button = glQuery.gui.Button;

    glQuery.gui.Layer = function(id){
        this._type = "layer";
        this._class = [];
        this._id = undefined;
        this._objects = [];
        this._location = {//Coming Soon!
            top:0,
            left:0
        };
        this._size = {//Coming Soon!
            width:100,
            height:50
        };
        this._i = glQuery.gui.i;
        glQuery.gui.i = glQuery.gui.i +1;
        if(!glQuery.object.existId(id) && id !=undefined){
            this._id = id;
            glQuery.gui.id[id] = this._i;
        }
        this.addObject = function(Object){
            this._objects[this._objects.length] = Object;
        }
        this.getObjects = function(){
            return this._objects;
        }
        return this;
    };
    
    glQuery.gui.Layer.prototype = new glQuery.gui.Object();
    glQuery.gui.Layer.prototype.constructor = glQuery.gui.Layer;
    window.Layer = glQuery.gui.Layer;
    
    
    glQuery.gui.Point = function(id){
        this._type = "point";
        this._class = [];
        this._id = undefined;
        this._location = {
            top:0,
            left:0
        };
        this._size = {
            width:50,
            height:50
        };
        this._cursor = "default";
        this._i = glQuery.gui.i;
        glQuery.gui.i = glQuery.gui.i +1;
        if(!glQuery.object.existId(id) && id !=undefined){
            this._id = id;
            glQuery.gui.id[id] = this._i;
        }
        this._tooltip = null;//Coming Soon!
        this.addToolTip = function(tooltip){
            this._tooltip = tooltip;
        }
        return this;
    };
    
    glQuery.gui.Point.prototype = new glQuery.gui.Object();
    glQuery.gui.Point.prototype.constructor = glQuery.gui.Point;
    glQuery.gui.Point.prototype.__defineGetter__("cursor", function() { return this._cursor; });
    glQuery.gui.Point.prototype.__defineSetter__("cursor", function(val) { this._cursor = val; });
    window.Point = glQuery.gui.Point;
    
    glQuery.gui.ToolTip = function(id){//Coming Soon!
        this._type = "ToolTip";
        this._class = [];
        this._id = undefined;
        this._location = {
            top:0,
            left:0
        };
        this._size = {
            width:200,
            height:100
        };
        this._borderRadius = 0;
        this._cursor = "default";
        this._borderColor = "";
        this._cursor = "default";
        this._font = "Font";
        this._textTitle = "Tooltip title!";
        this._textBody = "Tooltip Body!";
        this._i = glQuery.gui.i;
        glQuery.gui.i = glQuery.gui.i +1;
        if(!glQuery.object.existId(id) && id !=undefined){
            this._id = id;
            glQuery.gui.id[id] = this._i;
        }
        return this;
    };
    
    glQuery.gui.ToolTip.prototype = new glQuery.gui.Object();
    glQuery.gui.ToolTip.prototype.constructor = glQuery.gui.ToolTip;
    glQuery.gui.ToolTip.prototype.__defineGetter__("borderRadius", function() { return this._borderRadius; });
    glQuery.gui.ToolTip.prototype.__defineGetter__("textTitle", function() { return this._textTitle; });
    glQuery.gui.ToolTip.prototype.__defineGetter__("textBody", function() { return this._textBody; });
    glQuery.gui.ToolTip.prototype.__defineGetter__("font", function() { return this._font; });
    glQuery.gui.ToolTip.prototype.__defineGetter__("cursor", function() { return this._cursor; });
    glQuery.gui.ToolTip.prototype.__defineSetter__("textTitle", function(val) { this._textTitle = val; });
    glQuery.gui.ToolTip.prototype.__defineSetter__("textBody", function(val) { this._textBody = val; });
    glQuery.gui.ToolTip.prototype.__defineSetter__("font", function(val) { this._font = val; });
    glQuery.gui.ToolTip.prototype.__defineSetter__("cursor", function(val) { this._cursor = val; });
    glQuery.gui.ToolTip.prototype.__defineGetter__("borderColor", function() { return this._borderColor; });
    glQuery.gui.ToolTip.prototype.__defineSetter__("borderRadius", function(val) { this._borderRadius = val; });
    window.ToolTip = glQuery.gui.ToolTip;
    
    glQuery.gui.TextBox = function(id){
        this._type = "TextBox";
        this._class = [];
        this._id = undefined;
        this._left = 0;
        this._top = 0;
        this._location = {
            top:0,
            left:0
        };
        this._size = {
            width:100,
            height:30
        };
        this._borderRadius = 0;
        this._focusColor = "";
        this._borderColor = "";
        this._cursor = "default";
        this._font = "Font";
        this._text = "Button";
        this._i = glQuery.gui.i;
        glQuery.gui.i = glQuery.gui.i +1;
        if(!glQuery.object.existId(id) && id !=undefined){
            this._id = id;
            glQuery.gui.id[id] = this._i;
        }
        this._tooltip = null;//Coming Soon!
        this.addToolTip = function(tooltip){
            this._tooltip = tooltip;
        }
        return this;
    };
    
    glQuery.gui.TextBox.prototype = new glQuery.gui.Object();
    glQuery.gui.TextBox.prototype.constructor = glQuery.gui.TextBox;
    glQuery.gui.TextBox.prototype.__defineGetter__("borderRadius", function() { return this._borderRadius; });
    glQuery.gui.TextBox.prototype.__defineGetter__("text", function() { return this._text; });
    glQuery.gui.TextBox.prototype.__defineGetter__("font", function() { return this._font; });
    glQuery.gui.TextBox.prototype.__defineGetter__("focusColor", function() { return this._focusColor; });
    glQuery.gui.TextBox.prototype.__defineGetter__("borderColor", function() { return this._borderColor; });
    glQuery.gui.TextBox.prototype.__defineGetter__("cursor", function() { return this._cursor; });
    glQuery.gui.TextBox.prototype.__defineSetter__("text", function(val) { this._text = val; });
    glQuery.gui.TextBox.prototype.__defineSetter__("font", function(val) { this._font = val; });
    glQuery.gui.TextBox.prototype.__defineSetter__("pressedColor", function(val) { this._pressedColor = val; });
    glQuery.gui.TextBox.prototype.__defineSetter__("borderColor", function(val) { this._borderColor = val; });
    glQuery.gui.TextBox.prototype.__defineSetter__("borderRadius", function(val) { this._borderRadius = val; });
    glQuery.gui.TextBox.prototype.__defineSetter__("cursor", function(val) { this._cursor = val; });
    window.TextBox = glQuery.gui.TextBox;
    
    glQuery.gui.ProgressBar = function(id){
        this._type = "ProgressBar";
        this._class = [];
        this._id = undefined;
        this._left = 0;
        this._top = 0;
        this._location = {
            top:0,
            left:0
        };
        this._size = {
            width:200,
            height:30
        };
        this._borderRadius = 0;
        this._olor = "";
        this._borderColor = "";
        this._cursor = "default";
        this._font = "Font";
        this._text = "Button";
        this._i = glQuery.gui.i;
        glQuery.gui.i = glQuery.gui.i +1;
        if(!glQuery.object.existId(id) && id !=undefined){
            this._id = id;
            glQuery.gui.id[id] = this._i;
        }
        this._tooltip = null;//Coming Soon!
        this.addToolTip = function(tooltip){
            this._tooltip = tooltip;
        }
        return this;
    };
    
    glQuery.gui.ProgressBar.prototype = new glQuery.gui.Object();
    glQuery.gui.ProgressBar.prototype.constructor = glQuery.gui.ProgressBar;
    glQuery.gui.ProgressBar.prototype.__defineGetter__("borderRadius", function() { return this._borderRadius; });
    glQuery.gui.ProgressBar.prototype.__defineGetter__("text", function() { return this._text; });
    glQuery.gui.ProgressBar.prototype.__defineGetter__("font", function() { return this._font; });
    glQuery.gui.ProgressBar.prototype.__defineGetter__("color", function() { return this._color; });
    glQuery.gui.ProgressBar.prototype.__defineGetter__("borderColor", function() { return this._borderColor; });
    glQuery.gui.ProgressBar.prototype.__defineGetter__("cursor", function() { return this._cursor; });
    glQuery.gui.ProgressBar.prototype.__defineSetter__("text", function(val) { this._text = val; });
    glQuery.gui.ProgressBar.prototype.__defineSetter__("font", function(val) { this._font = val; });
    glQuery.gui.ProgressBar.prototype.__defineSetter__("color", function(val) { this._pressedColor = val; });
    glQuery.gui.ProgressBar.prototype.__defineSetter__("borderColor", function(val) { this._borderColor = val; });
    glQuery.gui.ProgressBar.prototype.__defineSetter__("borderRadius", function(val) { this._borderRadius = val; });
    glQuery.gui.ProgressBar.prototype.__defineSetter__("cursor", function(val) { this._cursor = val; });
    window.ProgressBar = glQuery.gui.ProgressBar;
})(glQuery);