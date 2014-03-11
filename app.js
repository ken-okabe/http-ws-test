var httpServer = function(dir)
{
	var http = require('http');
	var fs = require('fs');
	var path = require("path");
	var url = require('url');

	var mimeTypes = {
		"html": "text/html",
		"jpeg": "image/jpeg",
		"jpg": "image/jpeg",
		"png": "image/png",
		"js": "text/javascript",
		"css": "text/css"
	};

	return http.createServer(function(req, res)
	{
		var uri = url.parse(req.url)
			.pathname;
		var filename = path.join(dir, unescape(uri));
		var indexFilename = path.join(dir, unescape('index.html'));
		var stats;

		console.log(filename);

		try
		{
			stats = fs.lstatSync(filename); // throws if path doesn't exist
		}
		catch (e)
		{
			res.writeHead(404,
			{
				'Content-Type': 'text/plain'
			});
			res.write('404 Not Found\n');
			res.end();
			return;
		}
		var fileStream;

		if (stats.isFile())
		{
			// path exists, is a file
			var mimeType = mimeTypes[path.extname(filename)
				.split(".")[1]];
			res.writeHead(200,
			{
				'Content-Type': mimeType
			});

			fileStream =
				fs.createReadStream(filename)
				.pipe(res);
		}
		else if (stats.isDirectory())
		{
			// path exists, is a directory
			res.writeHead(200,
			{
				'Content-Type': "text/html"
			});
			fileStream =
				fs.createReadStream(indexFilename)
				.pipe(res);
		}
		else
		{
			// Symbolic link, other?
			// TODO: follow symlinks?  security?
			res.writeHead(500,
			{
				'Content-Type': 'text/plain'
			});
			res.write('500 Internal server error\n');
			res.end();
		}

	});
};

var HTTPserver =
	httpServer(require('path')
		.join(__dirname, 'www'));


HTTPserver
	.on('listening', function()
	{
		console.log('HTTP listening:');
		//---------------
		var WebSocket = require('ws');
		var webSocketServer =
			new WebSocket.Server(
			{
				server: HTTPserver
			});
		webSocketServer
			.on('connection',
				function(ws)
				{
					console.log('client connected');
					setTimeout(function()
					{
						console.log('trying to close webSocketserver');
						webSocketServer.close();
						setTimeout(function()
						{
							console.log('trying to close HTTPserver');
							HTTPserver.close();
						}, 1000);

					}, 1000);

				});
	})
	.on('close', function()
	{
		console.log('server closed'); // never happens
	})
	.on('error', function()
	{
		console.log('server error');
	})
	.listen(8000);

// this works when no Client Connection
/*
setTimeout(function()
{
	HTTPserver.close();
}, 3000);
*/