/**
 * @file smartmirror-speechrecongnition.js
 *
 * @author nkucza
 * @license MIT
 *
 * @see 
 */

//const rosnodejs = require('rosnodejs');

Module.register('SmartMirror-ROS2-Bridge', {


	Debug_infos: {},

	defaults: {
		FromROS2Topics: [],
		ToROS2Topics: [],
		initRosContext: true,
		DummyMessage: true,
	},

	/**
	* @function start
	* @description Sets mode to initialising.
	*/
	start() {
		var self = this;
		this.sendSocketNotification('CONFIG', this.config);
	},

	/**
	 * CREATE DOM
	 * shows debug information in the this.Debug_infos[key] dictionary
	 */
	getDom() {
		var self = this;
		self.data.header = 'ROS2 Debug Informations'

		var myTableDiv = document.createElement("DebugTable");
		myTableDiv.className = "DebugTablexsmall";


		var table = document.createElement('TABLE');
		//table.border = '1';
		table.className = "DebugTablexsmall";

		var tableBody = document.createElement('TBODY');
		table.appendChild(tableBody);

		for (var key in self.Debug_infos) {
			var tr = document.createElement('TR');
			tr.className = "DebugTablexsmall";
			tableBody.appendChild(tr);
			var td = document.createElement('TD');
			td.appendChild(document.createTextNode(key));
			td.className = "DebugTablexsmall";
			//td.width = '70px';
			tr.appendChild(td);
			var td = document.createElement('TD');
			//td.width = '50';
			td.appendChild(document.createTextNode(self.Debug_infos[key]));
			td.width = '70px';
			tr.appendChild(td);


		}

		myTableDiv.appendChild(table);

		return myTableDiv;
	},


	/**
	 * @function socketNotificationReceived
	 * @description Handles incoming messages from node_helper.
		 *
	 * @param {string} notification - Notification name
	 * @param {*} payload - Detailed payload of the notification.
	 */
	socketNotificationReceived(notification, payload) {
		const self = this;
		self.Debug_infos[notification] = payload;
		self.updateDom();
		this.sendNotification(notification, payload);
	},

	/**
	 * @function notificationReceived
	 * @description Handles incoming messages from other modules.
	 *
	 * @param {string} notification - Notification name
	 * @param {*} payload - Detailed payload of the notification.
	 */
	notificationReceived: function (notification, payload, sender) {
		const self = this;


	}
});



