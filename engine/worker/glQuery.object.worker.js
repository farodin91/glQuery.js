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
var ID = [];
var Class = [];
var Namespace = {};
var Object = {
    add:function(){
        
    },
    getObjects:function(view){
        if(view){
            return 2;
        }else{
            return ObjectData;
        }
    },
    afterFirstAdd:function(){
        self.setInterval(function(){
            self.postMessage({type:"renderObjects",object:Object.getObjects(true)});
        },20)
    }
};
self.onmessage = function(event){
    switch (event.data.type){
        case "get":
            switch (event.data.get){
                case "arrayCollection":
                    break;
                default:
                    break;
                    
            }
            break;
        case "add":
            Object.add(event.data.id,event.data.namespace,event.data.Class,event.data.indiez);
            break;
            break;
        case "init":
            break;
        default:
            break;
    }
};