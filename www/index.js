var connection = new WebSocket('ws://localhost:8000');

connection.onopen = function()
{
	console.log('opened ');
};
connection.onclose = function()
{
	console.log('closed ');
};
connection.onerror = function(error)
{
	console.log('WebSocket Error ' + error);
};
connection.onmessage = function(e)
{
	console.log('Server: ' + e.data);
};