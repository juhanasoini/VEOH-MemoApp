const http = require( 'http' );
const fs = require( 'fs' );

const notes = [];

const server = http.createServer( (req, res ) => {
	const URL = req.url;
	const URL_ARR =URL.split( '/' );
	URL_ARR.splice( 0, 1);

	const METHOD = req.method;

	console.log( `HTTP request received: url=${URL}, method=${METHOD}` );

	const FRAME = `
	<html>
	<head>
		<meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
        <title>MEMO APPI</title>
        <link rel="stylesheet" type="text/css" href="static/style.css">
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
			<form action="add-note" method="POST">
				<input type="text" name="note" value="###NOTE###" tabindex="0" autofocus>
				<button type="submit">Add</button>
			</form>
			<form action="delete-note" method="POST">
				<input type="number" name="index" min="0" max="`+(notes.length-1)+`">
				<button type="submit">Delete</button>
			</form>
			<h3>Notet:</h3>
			<form action="delete-note" method="POST">
			<ul>
			###NOTES###
			</ul>
			</form>
		`;
		let temp = '';
		notes.map((item, index) => {
			temp += `<li>${index}: ${item} <button type="submit" value="${index}" name="index">Delete</button></li>`;
		});
		form = form.replace( '###NOTES###', temp );
		form = form.replace( '###NOTE###', '' );
		res.write( FRAME.replace( '###CONTENT###', form ) );
		res.end();
		return;
	}
	else if( URL_ARR[0] == 'static' || URL == '/favicon.ico' )
	{
		fs.readFile('.'+URL, (err, data) => {
			if( err )
			{
				console.log(err);
				res.statusCode = 404;
				res.end();
				return;
			}

            res.write(data);
            res.end();
        });
        return;
	}
	else if( URL == '/delete-note' && METHOD == 'POST' )
	{
		let body = [];
		req.on('data', (chunk) => {
		  body.push(chunk);
		}).on('end', () => {
		  body = Buffer.concat(body).toString();
		  body = body.split( '=' );
		  let index = body[1];
		  notes.splice(index, 1);
		  res.statusCode = 303;
		  res.statusMessage = 'Redirect';
		  res.setHeader( 'Location', '/' );
		  res.end();
		});
		return;
	}
	else if( URL == '/add-note' && METHOD == 'POST' )
	{
		let body = [];
		req.on('data', (chunk) => {
		  body.push(chunk);
		}).on('end', () => {
		  body = Buffer.concat(body).toString();
		  body = decodeURIComponent(body);
		  body = body.split( '=' );
		  notes.push( body[1] );
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