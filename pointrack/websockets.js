var socket = null;
var WEBSCK_ADDY = "ws://localhost:8000/camtest";
var POINTS = {};
POINTS.x = 0;
POINTS.y = 0;

function send(val) {
  if (!socket) {console.log('Not connected'); return;}
  socket.send(val);
  console.log('> ' + val);
}

function connect() {
  if ('WebSocket' in window) {
    socket = new WebSocket(WEBSCK_ADDY);
  } else if ('MozWebSocket' in window) {
    socket = new MozWebSocket(WEBSCK_ADDY);
  } else {
    return;
  }

  socket.onopen = function () {
    console.log('Opened');
  };
  socket.onmessage = function (event) {
    var pts = $.parseJSON(event.data);
    if (pts["B"].length > 0) {
        POINTS.x = pts["B"][0][0];
        POINTS.y = pts["B"][0][1];
    }
    console.log(pts);
  };
  socket.onerror = function () {
    console.log('Error');
  };
  socket.onclose = function (event) {
    var logMessage = 'Closed (';
    if ((arguments.length == 1) && ('CloseEvent' in window) &&
        (event instanceof CloseEvent)) {
      logMessage += 'wasClean = ' + event.wasClean;
      // code and reason are present only for
      // draft-ietf-hybi-thewebsocketprotocol-06 and later
      if ('code' in event) {
        logMessage += ', code = ' + event.code;
      }
      if ('reason' in event) {
        logMessage += ', reason = ' + event.reason;
      }
    } else {
      logMessage += 'CloseEvent is not available';
    }
    console.log(logMessage + ')');
  };
}

function closeSocket() {
  if (!socket) {console.log('Not connected'); return;}
  socket.close();
}

function websocket_init() {
  if ('MozWebSocket' in window) {
    console.log('Use MozWebSocket');
  } else if (!('WebSocket' in window)) {
    console.log('WebSocket is not available');
  }
  connect();
}