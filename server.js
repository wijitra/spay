var net = require('net');
var parser = require('cmdParser.js');

var idCnt = 0;
var socketMap = {};


var server = net.createServer(function(socket) {

    socket.id = idCnt++;
    socketMap[socket.id] = socket;

    socket.on('end', function() {
        delete socketMap[socket.id]
        console.log('disconnect')
    });

    var tmpData = '';
    socket.on('data', function(buffer) {

        console.log('receive: from ' + socket.id + ':' + buffer);
        tmpData += buffer.toString().trim();


        if (tmpData.match(/#$/)) {
            var result = parser.parse(tmpData);
            console.log('parse output %j', result);
            socket.write(result.machineId);
            tmpData = ''
        }

    })

    socket.setTimeout(50000, function() {
        console.log('timeout')
        socket.end();
    });

    socket.write('hi');
});


server.listen(8000, function() {
    console.log('server bound');
})