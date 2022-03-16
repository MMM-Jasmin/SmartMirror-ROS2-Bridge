# SmartMirror-ROS2-Bridge

A module to bridge between ROS2 and the magicmirror middleware.
It can be specified which topics should be transferred.
For debugging purposes the messages are also displayed. 
Only one module can initialize the ros2 interface, set *initRosContext* if you want to enable it.

To test the ros2 connection, dummy messages can be send on the topic "mirror_test".
The messages contains "Hello ROS 3" and is counts up.


## Config Example
```
{
	module: "SmartMirror-ROS2-Bridge",
	position: "bottom_left",
	config: {
		FromROS2Topics: [
			["profiling/fps",'std_msgs/msg/UInt8'],
			["/profiling/latency",'std_msgs/msg/UInt8'],
		],
		ToROS2Topics: [
			["SmartmirrorObjectDetection",'std_msgs/msg/UInt8'],
			["SmartmirrorGestureRecognition",'std_msgs/msg/UInt8'],
			["SmartmirrorFacerecognition",'std_msgs/msg/UInt8'],
		],
		initRosContext:true,
		DummyMessage:false,
	},
},
```
