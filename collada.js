var Collada = function( xmlObj, rootElem, control )
{
	this.x = xmlObj;
	this.vertices = [];
	this.faces = [];
	this.name = "";
	this.rootElem = rootElem;
	this.control = control;
	this.scaleFactor = 15;
	this.light = new Vector( 0.96, -0.28, 0 );
	this.showWireframe = document.forms[0].elements["wireframe"].checked;
	this.enableCulling = document.forms[0].elements["culling"].checked;
	this.enableZFlatShading = document.forms[0].elements["zFlatShading"].checked;
	this.enableFlatShading = document.forms[0].elements["flatShading"].checked;

	this.index = document.all ? 0 : 1;

	this.getGeometry = function()
	{
		var docRoot = ( this.x.firstChild.nodeName == "xml" ) ? this.x.childNodes[ 1 ] : this.x.firstChild;
		var libGeom = xmlUtil.getChildByNodeName( docRoot, "library_geometries" );
		var geom = libGeom.childNodes[ this.index ];
		this.name = geom.getAttribute( "name" );
		var triangles = xmlUtil.getChildByNodeName( geom.childNodes[ this.index ], "triangles" );
		var vertSemantic = xmlUtil.getChildByNodeAndAttribute( triangles, "input", "semantic", "VERTEX" );
		var vertexSource = vertSemantic.getAttribute( "source" ).split( "#" )[ 1 ];
		var vertexOffset = vertSemantic.getAttribute( "offset" );
		
		var vertices =  xmlUtil.getChildByNodeName( geom.childNodes[ this.index ], "vertices" );
		var posSemantic = xmlUtil.getChildByNodeAndAttribute( vertices, "input", "semantic", "POSITION" );
		var positions = posSemantic.getAttribute( "source" ).split( "#" )[ 1 ];
		var posSource = xmlUtil.getChildByNodeAndAttribute( geom.childNodes[ this.index ], "source", "id", positions );
		var techCommon = xmlUtil.getChildByNodeName( posSource, "technique_common" );
		var accessor = xmlUtil.getChildByNodeName( techCommon, "accessor" );
		var accSource = accessor.getAttribute( "source" ).split( "#" )[ 1 ];
		var posFloats = xmlUtil.getChildByNodeAndAttribute( posSource, "float_array", "id", accSource );
		var floats = "";
		var psLen = posFloats.childNodes.length;
		
		for( var i=0; i<psLen; i++ )
		{
			floats += posFloats.childNodes[ i ].nodeValue;
		}
		posFloats = floats.split( " " );

		len = posFloats.length;
		
		// -- vertices

		for( i=0; i<len; i+=3 )
		{
			this.vertices.push(
				new Vertex( 
					posFloats[ i ] * this.scaleFactor * -1, 
					posFloats[ i+1 ] * this.scaleFactor * -1,
					posFloats[ i+2 ] * this.scaleFactor
				)
			);
		}

		// -- faces
		
		var indices = xmlUtil.getChildByNodeName( triangles, "p" );

		indices = this.getIndicesByOffset( 
			indices,
			parseInt( vertexOffset ),
			parseInt( this.getMaxOffset( triangles ) )
		);
		
		var len = indices.length;

		for( var i=0; i<len; i+=3 )
		{
			this.faces.push( [
				this.vertices[ indices[ i ] ],
				this.vertices[ indices[ i + 1 ] ],
				this.vertices[ indices[ i + 2 ] ]
			] );
		}
	};
	
	this.getIndicesByOffset = function( indices, offset, maxOffset  )
	{
		var len = indices.childNodes.length;
		var out = [];
		var str = "";
		
		for( var i=0; i<len; i++ )
		{
			str += indices.childNodes[ i ].nodeValue;
		}

		str = str.split( " " );
		len = str.length;

		for( i=offset; i<len; i += ( maxOffset + 1 ) )
		{
			out.push( str[ i ] );
		}

		return out;
	};
	
	this.getMaxOffset = function( triangles )
	{
		var len = triangles.childNodes.length;
		var maxOffset = 0;
		
		for( var i=0; i<len; i++ )
		{
			if( triangles.childNodes[ i ].nodeName == "input" )
				if( parseInt( triangles.childNodes[ i ].getAttribute( "offset" ) ) > maxOffset )
					maxOffset = parseInt( triangles.childNodes[ i ].getAttribute( "offset" ) );
		}
		
		return maxOffset;
	};
	
	this.render = function()
	{
		this.showWireframe = document.forms[0].elements["wireframe"].checked;
		this.enableCulling = document.forms[0].elements["culling"].checked;
		this.enableZFlatShading = document.forms[0].elements["zFlatShading"].checked;
		this.enableFlatShading = document.forms[0].elements["flatShading"].checked;
		
		var len = this.faces.length;
		
		this.rootElem.children.clear();
		
		for (var i = 0; i < len; i++) {
			var point1 = this.project2D(this.faces[i][0]);
			var point2 = this.project2D(this.faces[i][1]);
			var point3 = this.project2D(this.faces[i][2]);
			
			if (this.enableCulling) {
				var normalDir = this.getFaceNormalDir(point1, point2, point3);
				if (normalDir < 0) 
					continue;
			}
			
			var red = 255;
			var fillColor = null;
			var strokeWidth = 0.5;
			var strokeColor = "#ff000000";
			
			if (this.enableZFlatShading) {
				var z = 1 - Math.abs(this.faces[i][0].z + this.faces[i][1].z + this.faces[i][2].z) / 3000
				z = Math.min(1, z);
				z = Math.max(0.2, z);
				red = parseInt(z * 255);
			}
			else if (this.enableFlatShading) {
				// -- flat shading
				var normal = this.getFaceNormal(this.faces[i][0], this.faces[i][1], this.faces[i][2]);
				var dot = this.dotProduct(normal, this.light);
				dot = (dot + 1) / 2;
				dot = Math.min(1, dot);
				dot = Math.max(0.2, dot);
				red = parseInt(dot * 255);
			}
			
			if (this.enableZFlatShading || this.enableFlatShading) {
				strokeWidth = 1;
				fillColor = "#ff" + red.toString(16) + "0000";
				strokeColor = fillColor;
			}
			if (this.showWireFrame) 
			{
				strokeWidth = 0.5;
				fillColor = null;
			}
			this.drawLine( fillColor, strokeWidth, strokeColor, point1, point2, point3 );
		}		
	};
	
	this.drawLine = function( fillColor, strokeWidth, strokeColor, point1, point2, point3 )
	{
		var xamlString = '<Path Stroke="' +strokeColor+ '" StrokeThickness="' +strokeWidth+ '" StrokeLineJoin="Miter" StrokeMiterLimit="0" '
		if( fillColor != null )
			xamlString += 'Fill="' +fillColor+ '" ';
		
		xamlString += 'Data="M' + point1.x +','+ ( point1.y + 500 ) +
			' L' + point2.x +','+ ( point2.y + 500 ) +
			' ' + point3.x +','+ ( point3.y + 500 ) +
			' z"/>';
		
		var line = this.control.content.CreateFromXaml( xamlString );
		this.rootElem.children.add( line );
	};
	
	this.project2D = function( vertex )
	{
		var plane = 512;
		var centerX = 300;
		var centerY = 20;
		var point = new Point();
		
		var z = Math.abs( parseInt( vertex.z * 10000 ) ) / 10000;
		if( z == 0 ) z = plane;
		point.x = vertex.x * plane / z;
		point.y = vertex.y * plane / z;
		
		point.x /= 15;
		point.y /= 15;
		
		point.x += centerX;
		point.y += centerY;

		return point;
	};
	
	this.getFaceNormal = function( vertex1, vertex2, vertex3 )
	{
		var u = new Vector(
			vertex3.x - vertex2.x,
			vertex3.y - vertex2.y,
			vertex3.z - vertex2.z
		);
		var v = new Vector(
			vertex3.x - vertex1.x,
			vertex3.y - vertex1.y,
			vertex3.z - vertex1.z
		);
		var n = new Vector(
			( u.y * v.z - u.z * v.y ),
			( u.z * v.x - u.x * v.z ),
			( u.x * v.y - u.y * v.x )
		);
		// -- normalizer
		var nLen = Math.sqrt( n.x * n.x + n.y * n.y + n.z * n.z );
		n.x = n.x / nLen;
		n.y = n.y / nLen;
		n.z = n.z / nLen;
		
		return n;
	};
	
	this.getFaceNormalDir = function( point1, point2, point3 )
	{
		var direction1 = new Point();
		var direction2 = new Point();
		
		direction1.x = point3.x - point1.x
		direction1.y = point3.y - point1.y
		direction2.x = point3.x - point2.x
		direction2.y = point3.y - point2.y
		
		return (direction1.x * direction2.y) - (direction1.y * direction2.x);
	};
	
	this.dotProduct = function( vector1, vector2 )
	{
		return vector1.x * vector2.x + vector1.y * vector1.y + vector1.z * vector2.z;
	};
	
	this.getGeometry();
	
	this.render();
}

var Point = function()
{
	this.x = 0;
	this.y = 0;
};

var Vertex = function( x, y, z )
{
	this.x = x;
	this.y = y;
	this.z = z;
};

var Vector = function( x, y, z )
{
	this.x = x;
	this.y = y;
	this.z = z;
};