var Hapi = require('hapi');

exports.startServer = function( config, callback ) {
  var port = process.env.PORT || config.server.port,
      server = new Hapi.Server('localhost', port);

  server.route({
    method: 'GET',
    path: '/',
    handler: function( req, res ) {
      res.file('public/index.html');
      //res.view('index');
    }
  });

  server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: 'public',
        listing: true
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/message',
    handler: function( req, res ) {
      res({
        "message": "Hello from Server!"
      });
    }
  });

  server.start(function() {
    console.log('Server running at:', server.info.uri);
  });

  callback(server.listener);
};
