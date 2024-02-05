'use strict';
const NodeHelper = require('node_helper');
const rclnodejs = require('rclnodejs');

module.exports = NodeHelper.create({

	node_publisher: {},
	node_subscriber: {},
	bridge_node: undefined,

	/**
	* @function start
	* @description Logs a start message to the console.
	* @override
	*/
	start() {
		const self = this;
		console.log(`Starting module helper: ${this.name}`);
	},

	stop: function() {
		const self = this;
	},

	/**
	 * @function createROSsubber
	 * @description create the ros node to sub and pub to all given topics in the config (FromROS2Topics/ToROS2Topics)
	 */
	async createROSsubber() {
		const self = this;

		const timer = ms => new Promise(res => setTimeout(res, ms));
		var lcontext = rclnodejs.Context.defaultContext();

		if (self.config.initRosContext == false) {
			while (lcontext.isInitialized() == false)
				await timer(100);
		} else {
			if(!lcontext.isInitialized())
				await rclnodejs.init(lcontext);
		}

		if (self.bridge_node == undefined){
			self.bridge_node = new rclnodejs.Node('SmartMirror_ROS2_bridge');
			//rclnodejs.spin(node); //Deprecated!
			self.bridge_node.spin();
		}

		/* Used to test the ROS2 connection..
		Creates a test Topic and sends dumm message
		it will also be displayed in the debug info.. */
		if (self.config.DummyMessage == true) {
			const publisher = self.bridge_node.createPublisher('std_msgs/msg/String', "mirror_test");
			let counter = 0;
			setInterval(() => {
				console.log(`Publishing message: Hello ROS ${counter}`);
				publisher.publish(`Hello ROS ${counter++}`);
			}, 1000);

			console.log('[' + self.name + ']: creating bridge from ROS topic ' + "mirror_test");
			self.bridge_node.createSubscription('std_msgs/msg/String', "mirror_test", (msg) => {
				self.sendSocketNotification("mirror_test", msg['data']);
			});
		}

		self.config.ToROS2Topics.forEach(function (element) {
			if(self.node_publisher[element[0]] == undefined){
				console.log('[' + self.name + ']: creating bridge to ROS topic ' + element[0]);
				self.node_publisher[element[0]] = self.bridge_node.createPublisher(element[1], element[0]);
			}
		});

		self.config.FromROS2Topics.forEach(function (element) {
			if(self.node_subscriber[element[0]] == undefined){
				console.log('[' + self.name + ']: creating bridge from ROS topic ' + element[0]);
				self.node_subscriber[element[0]] = self.bridge_node.createSubscription(element[1], element[0], (msg) => {
					self.sendSocketNotification(element[0], msg['data']);
					//console.log('[' + self.name + ']: ' + element[0]);
				});
			}
		});
	},

	/**
	 * @function socketNotificationReceived
	 * @description handle all messages coming from above
	 *
	 * @param {string} notification - Notification name
	 * @param {*} payload - Detailed payload of the notification.
	 */
	socketNotificationReceived(notification, payload) {
		const self = this;
		if (notification === 'CONFIG') {
			self.config = payload
			self.sendSocketNotification('debug', 'starting...');
			self.createROSsubber();
			self.sendSocketNotification('debug', 'running');
		} else if(notification === 'RESTART_COMING') {
			//console.log("test")
		
		} else {

			for (var i = 0; i <self.config.ToROS2Topics.length; i++) {
				if(self.config.ToROS2Topics[i][0] == notification){
					if(self.config.ToROS2Topics[i][1] == 'std_msgs/msg/ColorRGBA'){
						console.log("send color")
						console.log(payload)

						var msg = {
							r: payload[0],
							g: payload[1],
							b: payload[2],
							a: payload[3],
						  };

						self.node_publisher[notification].publish(msg);
					}else{
						self.node_publisher[notification].publish(payload);
					}
				};
			}
		}

	}

});
