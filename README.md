# tinyrover
A tiny rover software implementation

The main design philosophy that has driven development decisions is, that most of the functions of the rover can be handled by lightweight apis with parallelization handled at the process level.

The directory structure of the reposistory is desgined to reflect the fact that building a robot that is capable of remote operation is a distributed systems problem. The directories within the repository are each contain code that runs on a specific system with the exception of hardware/ which is used to store hardware designs primarily contributed to by the electrical engineering sub team.

# Main systems
- user/: This directory contains software that will run on the base station. Including but not limited to sending human input from a controller to the rover and displaying the livestream from the rover.
- rover/: This directory contains software that will run on the rover specifically the Jetson Nano. Including but not limited to receiving GPS data, networking with the base station and issueing commands to the arduino.
- arduino/: This directory also contains software that will be run on the rover but on an Arduino instead of the Jetson Nano. Including but not limited to manipulating motor speed and direction control.

# Communications between systems
- user/ <-> rover/: tcp/udp (primarily Flask and ffmpeg livestreaming)
- rover/ <-> arduino/: serial communications (see pyserial for an example)

# Init System
This year we should move away from launching code on rover/ through ssh and instead move to systemd services. This will make development more convenient and will help make services function more robustly in field.

# Examples
### Wheels as an api
#### Javascript fetch
    line 1 of code
    line 2 of code
    line 3 of code

#### Python Requests
todo

### Wheels as a library
#### Python
    line 1 of code
    line 2 of code
    line 3 of code
