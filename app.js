const http = require( 'http' );
const fs = require( 'fs' );

const notes = [];

const server = http.createServer( (req, res ) => {
	const URL = req.url;
	const METHOD = req.method;

	console.log( `HTTP request received: url=${URL}, method=${METHOD}` );

	const FRAME = `
	<html>
	<head>
		<meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
        <title>MEMO APPI</title>
	</head>
	<body>
		###CONTENT###
	</body>
	</html
	`;

	res.setHeader( 'Charset', 'UTF-8' );
	if( METHOD == 'GET' )
		res.setHeader( 'Content-Type', 'text/html;charset=UTF-8' );

	if( URL == '/' )
	{
		let form = `
			<form action="add-note" method="POST" accept-charset="UTF-8">
				<input type="text" name="note" value="###NOTE###">
				<button type="submit">Add</button>
			</form>
			<h3>Notet:</h3>
			<ul>
			###NOTES###
			</ul>
		`;
		let temp = '';
		notes.map((item, index) => {
			temp += '<li>'+item+'</li>';
		});
		form = form.replace( '###NOTES###', temp );
		form = form.replace( '###NOTE###', '' );
		res.write( FRAME.replace( '###CONTENT###', form ) );
		res.end();
	}
	else if( URL == '/add-note' && METHOD == 'POST' )
	{
		let body = [];
		req.on('data', (chunk) => {
		  body.push(chunk);
		}).on('end', () => {
		  body = Buffer.concat(body).toString();
		  body = body.split( '=' );
		  notes.push( body[1] );
		  console.log( body );
		  res.statusCode = 303;
		  res.statusMessage = 'Redirect';
		  res.setHeader( 'Location', '/' );
		  res.end();
		});
	}
	else
	{
		console.log( `${URL} not found` );
		res.setHeader( 'Content-Type', 'text/html;charset=UTF-8' );
		res.statusCode = 404;
		res.statusMessage = 'Not found';
		res.write( res.statusMessage );
		res.end(); 
	}
});

server.listen( 8000 );