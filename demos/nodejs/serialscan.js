/**
 * Copyright © 2011-2022 EricYangXD, All Rights Reserved.
 * 扫描端口
 */

var serialPort = require("serialport");
var serialArray = [];
// 扫描可用的串口USB
function scanCom() {
	if (serialArray.length) {
		serialArray = [];
	}
	serialPort.list(function (err, ports) {
		console.log("ports", ports);
		ports.forEach(function (port) {
			var thePort = {
				comName: port.comName,
				pnpId: port.pnpId,
				manufacturer: port.manufacturer,
			};
			if (port.comName.indexOf("usb") >= 0) {
				serialArray.push(thePort);
			}
		});
		// console.log('serialArray', serialArray);
	});
}

scanCom();

// setInterval(function() {
//     scanCom();
// }, 2000);

module.exports = function () {
	return serialArray;
};
