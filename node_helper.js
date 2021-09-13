
const NodeHelper = require('node_helper');

const rclnodejs = require('rclnodejs');

module.exports = NodeHelper.create({

	/**
	* @function start
	* @description Logs a start message to the console.
	* @override
	*/
	start() {
		const self = this;
		console.log(`Starting module helper: ${this.name}`);
		
		

		
 		


	},

	createROSsubber() {
		const self = this;

		rclnodejs.init().then(() => {
  			const node = rclnodejs.createNode('publisher_example_node');
  			const publisher = node.createPublisher('std_msgs/msg/String', 'mirror_test');

 			let counter = 0;
  			setInterval(() => {
    				console.log(`Publishing message: Hello ROS ${counter}`);
   				publisher.publish(`Hello ROS ${counter++}`);
  			}, 1000);

			self.config.FromROS2Topics.forEach(function(element) {
				node.createSubscription('std_msgs/msg/String', element, (msg) => {
					self.sendSocketNotification(element, msg['data']);
  				});

			});

  			rclnodejs.spin(node);
		}); 

	},

	socketNotificationReceived(notification, payload) {
		const self = this;
		if(notification === 'CONFIG') {
			self.config = payload
			self.sendSocketNotification('debug', 'starting...');
			self.createROSsubber();
		}

	}

});