/*
 * Copyright 2013, Jan Jansen
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
var Objects = {
    add:function(Id,Type,Art,i){
        id[Id]= i;
        self.postMessage({"type":"debug",info:id}); 
        if(!art[Art]){
            art[Art] = [];
        }
        art[Art][art[Art].length] = i;
        if(!type[Type]){
            type[Type] = [];
        }
        type[Type][type[Type].length] = i;
    },
    getObjects:function(view){
        if(view){
            return 2;
        }
    },
    getObjectById:function(Id,selector){//context
        var objs = [];
        objs[0] = id[Id];
        self.postMessage(
            {
                "type":"returnObjects",
                object:objs,
                selector:selector
            });
    },
    getObjectByArt:function(Art,selector){
        self.postMessage(
            {
                "type":"returnObjects",
                object:art[Art],
                selector:selector
            });
    },
    getObjectByType:function(Type,selector){
        self.postMessage(
            {
                "type":"returnObjects",
                object:type[Type],
                selector:selector
            });     
    },
    afterFirstAdd:function(){
        self.setInterval(function(){
            self.postMessage(
                {
                    "type":"renderObjects",
                    object:Objects.getObjects(true)
                });
        },20);
    }
};
self.onmessage = function(event){
    switch (event.data.action){
        case "get":
            /*switch (event.data.get){
                case "arrayCollection":
                    break;
                default:
                    break;
                    
            }*/
            break;
        case "getObjectById":
            Objects.getObjectById(event.data.get,event.data.selector);
            break;
        case "getObjectByType":
            Objects.getObjectByType(event.data.get,event.data.selector);
            break;
        case "getObjectByArt":
            Objects.getObjectByArt(event.data.get,event.data.selector);
            break;
        case "add":
            Objects.add(event.data.id,event.data.type,event.data.art,event.data.i);
            break;
        case "init":
            break;
        default:
            break;
    }
};