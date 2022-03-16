# SmartMirror-ROS2-Bridge



## Config Example
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
