var net = require('net');
var sockets = [];
var socketMap = {};
var idCnt = 0;

function removeByElement(array, elm) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === elm) {
            array.splice(i, 1);
        }
    }
}

var server = net.createServer(function(socket) {
    socket.id = idCnt++;
    console.log('server connected %d', socket.id );
    socketMap[socket.id] = socket;

    socket.on('end', function() {
        console.log('server disconnected');
        delete socketMap[socket.id]
    });

    socket.setTimeout(15000, function() {
        console.log('timeout %j', socket.remoteAddress);
        socket.end();
    })
    socket.write('hello\r\n');
    socket.on('data', function(buffer) {
        for (var s in socketMap) {
            if (s != socket.id) {
                socketMap[s].write(buffer);
            }
        }
    })
});

setInterval(function() {
    for (var s in socketMap) {
        socketMap[s].write('push\n');
    }
}, 3000)


server.on('error', function(e) {
    if (e.code == 'EADDRINUSE') {
        console.log('Address in use, retrying...');
        setTimeout(function() {
            server.close();
            server.listen(8000)
        }, 1000);
    }
});

server.listen(8000, function() {
    console.log('server bound');
})