/*
 * Copyright 2011, Jan Jansen
 * Licensed under the  GPL Version 3 licenses.
 * http://www.gnu.org/licenses/gpl-3.0.html
 * 
 *@fileOverview
 *@name glQuery.object.worker.js
 *@author Jan Jansen - farodin91@googlemail.com
 *@description Coming soon
 *
 */
var id = [];
var art = [];
var type = [];
var Object = {
    add:function(Id,Type,Art,i){
        id[Id]= i;
        if(!art[Art])
            art[Art] = [];
        art[Art][art[Art].length] = i;
        if(!type[Type])
            type[Type] = [];
        type[Type][type[Type].length] = i;
    },
    getObjects:function(view){
        if(view){
            return 2;
        }else{
            return ObjectData;
        }
    },
    getObjectById:function(Id,selector,context){
        var objs = [];
        objs[0] = id[Id];
        self.postMessage({"type":"returnObjects",object:objs,selector:selector}); 
        
    },
    getObjectByArt:function(Art,selector,context){
        self.postMessage({"type":"returnObjects",object:art[Art],selector:selector}); 
        
    },
    getObjectByType:function(Type,selector,context){
        self.postMessage({"type":"returnObjects",object:type[Type],selector:selector});        
    },
    afterFirstAdd:function(){
        self.setInterval(function(){
            self.postMessage({"type":"renderObjects",object:Object.getObjects(true)});
        },20)
    }
};
self.onmessage = function(event){
    switch (event.data.action){
        case "get":
            switch (event.data.get){
                case "arrayCollection":
                    break;
                default:
                    break;
                    
            }
            break;
        case "getObjectById":
            Object.getObjectById(event.data.get,event.data.selector)
            break;
        case "getObjectByType":
            Object.getObjectByType(event.data.get,event.data.selector)
            break;
        case "getObjectByArt":
            Object.getObjectByArt(event.data.get,event.data.selector)
            break;
        case "add":
            Object.add(event.data.id,event.data.type,event.data.art,event.data.i);
            break;
            break;
        case "init":
            break;
        default:
            break;
    }
};