var _agDefaultLatest = {gx:0,gy:0,gz:0,ax:0,ay:0,az:0,cx:32268,cy:32268,cz:32268,acx:32268,acy:32268,acz:32268};
var latest = _agDefaultLatest;
var _agAjax = null;

var _agXb = 43008 + 1;
var _agYb = 9472 + 1;
var _agZb = 34816 + 1;

var _agXm = 15358;
var _agYm = 15614;
var _agZm = 24830;

var _agTopVal = 65536;


function getData(callback) {
	if (_agAjax == null) {
		_agAjax = $.ajax({
			url: '/data', // JSON_URL is a global variable
			dataType: 'json',
			error: function(xhr, status, error) {
				console.log('arduino-graph data error:', xhr, status, error);
				latest = _agDefaultLatest;
			},
			success: function(xhr_data, status, xhr) {
				if (xhr_data.err) {
					latest = _agDefaultLatest;
				} else {
					latest = xhr_data;
					latest.acx = calcCompassNormal(latest.cx, _agXb, _agXm);
					latest.acy = calcCompassNormal(latest.cy, _agYb, _agYm);
					latest.acz = calcCompassNormal(latest.cz, _agZb, _agZm);
				}
			},
			complete: function(xhr, status) {
				_agAjax = null;
				if (callback) {
					callback();
				}
			},
			contentType: 'application/json'
		});
	}
}

var _agTimeout;

function pollData() {
	getData();
	_agTimeout = setTimeout(pollData, 100);
}

function stopPollData() {
	clearTimeout(_agTimeout);
}

function calcCompassNormal(v, b, m) {
	// v is the latest compass value
	// b is the baseline, above
	// m is the minimum value, above
	// r is the result
	var r = v - b;
	r = r < 0 ? r + _agTopVal : r;
	r = r - m; // take it to 0 based (not _agTopVal based)
	r = r / (_agTopVal - m) * _agTopVal;
	r = Math.round(r);
	return r;
}

function calcCompassDegrees(x, y, domain) {
	var mid = (domain[1] - domain[0])/2;
	var deg = Math.round(Math.atan((x-mid)/(y-mid)) * (180/Math.PI));
	
	//console.log(x, y, mid, deg);
	if (y > mid) { return deg < 0 ? deg + 360 : deg; }
	if (y <= mid) { return deg + 180; }
}



