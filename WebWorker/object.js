var ID = [];
var Class = [];
var Namespace = {};
var i = 0;
var ObjectData = [];
var gl = null;
var Object = {
    add:function(){},
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
                case "position":
                    break;
                case "arrayCollection":
                    break;
                default:
                    break;
            }
            break;
        case "add":
            break;
        case "move":
        case "rotate":
            break;
        case "animate":
            break;
        case "init":
            gl = event.data.gl;
            break;
        default:
            break;
    }
};