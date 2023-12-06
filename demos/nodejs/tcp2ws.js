#!/usr/bin / env node
/**
 * Copyright © 2011-2022 EricYangXD, All Rights Reserved.
 * 创建tcp服务和websocket服务
 */

var that = this;
var ICP_data = {
	GazeDirection: 0,
	DriverPresence: 0,
	DrowsinessLevel: 0,
	EyesClosed: 2,
	Focus: 0,
	RecResult: 0,
	RecFailedNum: 0,
	DriverName: "",
	Distraction_lvl: 0,
	e_BCM_RRDoorAjarSt: 0, //右后门的状态，开1或者关0
	e_BCM_RLDoorAjarSt: 0, //左后门的状态，开1或者关0
	e_BCM_DriverDoorAjarSt: 0, //司机门的状态，开1或者关0
	e_BCM_PsngrDoorAjarSt: 0, //副驾门的状态，开1或者关0
	e_BCM_DriverDoorLockSt: 1, //司机门的锁状态，door unlock,开0或者关1
	e_BCM_PsngrDoorLockSt: 1, //乘客门的锁状态,开0或者关1
	e_BCM_ATWS_St: 0, //设防状态，对应 Warning Status,0:设防,1:预设防,2:解防
	e_EMS_EngSt: 0, //发动机状态，Engine Off,开1或者关0
	e_PEPS_SysPowMode: 0, //车的电源模式Power Mode Off,0:关,1:acc,2:开,3:crank
	f_BCAN_VehSpd: 0, //车速
};
var DriverAuthorizationStatus = "initial", // success:1认证成功,failed:2认证失败,initial:0初始状态
	OrderNumber = "Conti1563533804452",
	OrderStatus = "initial";
var interval = null,
	tcpInterval = null;
if (interval) {
	clearInterval(interval);
}
if (tcpInterval) {
	clearInterval(tcpInterval);
}
// TCP Client : receive data from ecal2hmi-proxy and send data to ecal2hmi-proxy
var net = require("net"); // 代表一个socket端口对象，是一个双工流（可读可写）

function createTcpServer() {
	var client = new net.Socket();
	var data = {
		DriverAuthorizationStatus: 0,
		OrderNumber: "Conti1563533804452",
		OrderStatus: "initial",
	};
	client.setEncoding("utf-8");
	client.connect(1024, "127.0.0.1", function () {
		console.log("already connected to server");
		// 将授权状态传递给Proxy
		tcpInterval = setInterval(function () {
			if (that.DriverAuthorizationStatus === "success") {
				data.DriverAuthorizationStatus = 1;
			} else if (that.DriverAuthorizationStatus === "failed") {
				data.DriverAuthorizationStatus = 2;
			} else {
				data.DriverAuthorizationStatus = 0; //initial
			}
			if (that.OrderNumber) {
				data.OrderNumber = that.OrderNumber;
			}
			if (that.OrderStatus) {
				data.OrderStatus = that.OrderStatus;
			}
			client.write(JSON.stringify(data));
			// console.log("TCP send data", JSON.stringify(data));
		}, 1000);
	});
	client.on("data", function (data) {
		console.log("TCP received data", data);

		// 接收Proxy传递的消息，赋给本地值
		if (data.indexOf("}{") < 0) {
			var _data = JSON.parse(data);
			that.ICP_data = Object.assign({}, that.ICP_data, _data);
			// console.log("TCP received ICP_data correct", that.ICP_data);
		} else {
			var _data = data.substring(0, data.indexOf("}{") + 1);
			that.ICP_data = Object.assign({}, that.ICP_data, JSON.parse(_data));
			// console.log("TCP received ICP_data handled", that.ICP_data);
		}
	});
	client.on("error", function (error) {
		console.log("TCP server error.");
	});
}

// WebSocket Server : send data to websocket client
var WebSocketServer = require("websocket").server;
var http = require("http");

function createWsServer() {
	var server = http.createServer(function (request, response) {
		console.log(new Date() + " Received request from " + request.url);
		// response.writeHead(404);
		response.end();
	});

	server.listen(9001, function () {
		console.log(new Date() + " Server is listening on port 9001");
	});

	wsServer = new WebSocketServer({
		httpServer: server,
		autoAcceptConnections: true,
	});

	wsServer.on("connect", function (connection) {
		console.log(new Date() + " Connection accepted.");
		interval = setInterval(function () {
			if (that.ICP_data) {
				connection.sendUTF(JSON.stringify(that.ICP_data));
			}
		}, 100);

		connection.on("message", function (message) {
			if (!message) {
				return;
			}
			if (message.type === "utf8") {
				console.log("WS Received Message: " + message.utf8Data);
				var msg = JSON.parse(message.utf8Data);
				that.DriverAuthorizationStatus = msg.DriverAuthorizationStatus;
				that.OrderNumber = msg.OrderNumber;
				that.OrderStatus = msg.OrderStatus;
			} else if (message.type === "binary") {
				console.log("WS Received Binary Message: " + message.binaryData);
				that.DriverAuthorizationStatus = message.binaryData;
			}
		});

		connection.on("close", function (reasonCode, description) {
			console.log(
				new Date() + " Peer " + connection.remoteAddress + " disconnected."
			);
		});
	});

	console.log("WebSocket建立完毕:9001");
}

exports.createTcpServer = createTcpServer;
exports.createWsServer = createWsServer;
