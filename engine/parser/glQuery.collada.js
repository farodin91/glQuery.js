/*
 *@fileOverview
 *@name glQuery.collada.js
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

    glQuery.collada = {
        getFile :function(url,id,callback){
            var self = this;
            var call = callback;
            $.ajax({
                url:url,
                dataType:"xml",
                error:function(){},
                success:function(data){
                    var type = "geometry";
                    var parsed = self.parseCollada(data,type,id)
                    call(parsed);
                }
            })
        },
        getObject:function(){},
        getGeometry:function(){},
        getTextures:function(){},
        getLight:function(){},
        getAnimation:function(){},
        getCamera:function(){},
        parseCollada:function(data,type,id){
            var up_axis = true;
           
            data = $(data)
            
            if(data.find("up_axis").text() != "Y_UP"){
                up_axis = false;
                if(data.find("up_axis").text() == "X-UP"){
                    return false;
                }
            }
            
            if(id != ""){
                
            }else{
                
            }
                
            var CO = {};
            
            
            CO.Vertex = {};
            CO.Vertex.Positions = this.getVertices(data,id,up_axis);
            CO.Vertex.Normals = this.getNormals(data, id, up_axis);
            CO.Vertex.Index = this.getIndices(data, id); 
            
            CO.textures = {};
            return CO;
        
        },
        getIndices:function(data,id){
            var indices = [];
            var polylist=data.find("geometry#"+id+"-mesh polylist");
            
            var faces=this.parseIntArray(polylist.find("p").text());
            var vcount=this.parseIntArray(polylist.find("vcount").text());
            
            var inputcount = polylist.find("input");
            var maxoffset=0;
            for(n=0;n<inputcount.length;n++) maxoffset=Math.max(maxoffset,inputcount[n].getAttribute("offset"));
            var offset = 0;
            for(var i=0;i<inputcount.length;i++){
                offset = parseInt(inputcount[i].getAttribute("offset"));
                var semantic  = inputcount[i].getAttribute("semantic");
                indices[semantic] = [];
                var z = 0;
                for(var k = 0;k<vcount.length;k++){
                    if(vcount[k]<3){
                        return false;
                    }else if(vcount[k]>3){
                        tri = [];
                        for(var j=0;j<vcount[k];j++){
                            tri[j] = faces[(j*(maxoffset+1))+offset+z];
                        }
                        tri = this.createTriganlesFormIndices(tri);
                        for(var j=0;j<tri.length;j++){
                            indices[semantic][z+j]= tri[j];
                        }
                    }else{
                        for(var j = 0;j<vcount[k];j++){
                            indices[semantic][z+j] = faces[(j*(maxoffset+1))+offset+z];
                        }
                    }
                    z += z+vcount[k];
                }
            }
            
            return indices;
            
        },
        createTriganlesFormIndices:function(indices){
            var indi = []
            for(var m=0;m<(indices.length-2);m++){
                indi[m*3] = indices[0];
                indi[m*3+1] = indices[1+m];
                indi[m*3+2] = indices[2+m];
            }
            return indi;
        },
        getNormals:function(data,id,up_axis){
            var normalObj = data.find("#"+id+"-mesh-normals-array").text();
            array = this.parseFloatArray(normalObj);
            num = array.length / 3;
            
            if(!up_axis){
                for(var i =0;i < num; i++){
                    array[(i*3) + 0] = array[(i*3) + 0];
                    array[(i*3) + 1] = array[(i*3) + 2];
                    array[(i*3) + 2] = ((-1)*array[(i*3) + 1]);
                    
                }
            }
            return {
                array:array,
                num:num
            };
        },
        getVertices:function(data,id,up_axis){
            var vertexObj = data.find("#"+id+"-mesh-positions-array").text();
            array = this.parseFloatArray(vertexObj);
            num = array.length / 3;
            
            if(!up_axis){
                for(var i =0;i < num; i++){
                    array[(i*3) + 0] = array[(i*3) + 0];
                    array[(i*3) + 1] = array[(i*3) + 2];
                    array[(i*3) + 2] = ((-1)*array[(i*3) + 1]);
                    
                }
            }
            
            return {
                array:array,
                num:num
            };
        },
        getYUPVektorForZUP:function(x,y,z){
            return {
                x:x,
                y:z,
                z:(-(y))
            };
        },
        getElementById:function(xmldoc, id) {
            return xmldoc.evaluate("//*[@id=\"" + id + "\"]", xmldoc, null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
        },
        parseIntArray:function(s){
            s = jQuery.trim(s);
            if (s == "")
                return [];

            // this is horrible
            var ss = s.split(/\s+/);

            var res = Array(ss.length);
            for (var i = 0, j = 0; i < ss.length; i++) {
                if (ss[i].length == 0)
                    continue;
                if(ss[i] !=  null)
                    res[j++] = parseInt(ss[i]);
            }
            return res;
        },
        parseFloatArray:function(s){
            if (s == "")
                return [];

            // this is horrible
            var ss = s.split(/\s+/);
            var res = Array(ss.length);
            for (var i = 0, j = 0; i < ss.length; i++) {
                if (ss[i].length == 0)
                    continue;
                res[j++] = parseFloat(ss[i]);
            }          
            return res;
        }
    };
})(glQuery );