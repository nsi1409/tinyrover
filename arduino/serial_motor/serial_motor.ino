#include <Servo.h>

#define MAX_PULSE 2000
#define MIN_PULSE 1000
#define OFF_PULSE 1500

String command;

int leftTargetSpeed;
int leftCurrentSpeed;
int rightTargetSpeed;
int rightCurrentSpeed;
int updateSpeedTimer;

int state[4] = {1, 0, 1, 0};
char charBuf[128];

Servo rightFrontServo;
Servo leftFrontServo;
Servo leftBackServo;
Servo rightBackServo;

size_t wheelCommandBufferSize = 1;
size_t opCodeSize = 1;
// Unit Circle :)
int ipn[4] = {3, 5, 6, 9};
// pin 3 front right
// pin 5 front left
// pin 6 back left
// pin 9 back right

void setup() {
	for (int i = 0; i < 4; i++) {
		pinMode(ipn[i], OUTPUT);
	}

	leftTargetSpeed = OFF_PULSE;
	leftCurrentSpeed = OFF_PULSE;
	rightTargetSpeed = OFF_PULSE;
	rightCurrentSpeed = OFF_PULSE;
	updateSpeedTimer = 0;

	Serial.begin(9600);
	Serial.setTimeout(100); // in milliseconds
	// rightFrontServo.attach(3);
	// leftFrontServo.attach(5);
	// leftBackServo.attach(6);
	// rightBackServo.attach(9);
  	rightFrontServo.attach(3, MIN_PULSE, MAX_PULSE);
	leftFrontServo.attach(5, MIN_PULSE, MAX_PULSE);
	leftBackServo.attach(6, MIN_PULSE, MAX_PULSE);
	rightBackServo.attach(9, MIN_PULSE, MAX_PULSE);
}

// Debugging, printing is iffy regardless, can just be safer to use Serial.write
//  void printBufferIntArray(uint8_t* array, size_t bufferSize){
//    Serial.print("[");
//    for(int i = 0; i < bufferSize; i++){
//      Serial.print(array[i]);
//      Serial.print(",");
//    }

//   Serial.print("]\n");
// }

void moveLeftWheel(int speed) {
	leftFrontServo.writeMicroseconds(speed);
	leftBackServo.writeMicroseconds(speed);
  // leftFrontServo.write(speed);
	// leftBackServo.write(speed);
}

int convertSpeedToProperRange(uint8_t speed) {
	int converted = ((float)speed) / 180 * (MAX_PULSE - MIN_PULSE);
	int result = converted + MIN_PULSE;
	return result;

  // return speed;
}

void moveRightWheel(int speed) {
	// rightFrontServo.write(speed);
	// rightBackServo.write(speed);
  
  	rightFrontServo.writeMicroseconds(speed);
	rightBackServo.writeMicroseconds(speed);
}

void loop() {
	// THIS IS HARDWARE DEPENDENT FOR THE SPEED CHANGE UNLESS A TIMER IS ADDED
	if (updateSpeedTimer > 1000) {
		if (leftCurrentSpeed != leftTargetSpeed) {
			if (leftCurrentSpeed < leftTargetSpeed) {
				leftCurrentSpeed = leftCurrentSpeed + 1;
			} else {
				leftCurrentSpeed = leftCurrentSpeed - 1;
			}
			moveLeftWheel(leftCurrentSpeed);
			//
		}

		if (rightCurrentSpeed != rightTargetSpeed) {
			if (rightCurrentSpeed < rightTargetSpeed) {
				rightCurrentSpeed = rightCurrentSpeed + 1;
			} else {
				rightCurrentSpeed = rightCurrentSpeed - 1;
			}
			moveRightWheel(rightCurrentSpeed);
		}
		updateSpeedTimer = 0;
	}
	updateSpeedTimer = updateSpeedTimer + 1;

	if (Serial.available() > 0) {
		uint8_t opBuffer[opCodeSize];
		Serial.readBytes(
			opBuffer,
			opCodeSize); // Reads as many bytes or until port closes
		if (opBuffer[0] == 0) {
			// if(Serial.available() > wheelCommandBufferSize){
			uint8_t leftWheelBuffer[wheelCommandBufferSize];
			Serial.readBytes(leftWheelBuffer,
							 wheelCommandBufferSize); // Reads as many bytes or
													  // until port closes

			uint8_t rightWheelBuffer[wheelCommandBufferSize];
			Serial.readBytes(rightWheelBuffer,
							 wheelCommandBufferSize); // Reads as many bytes or
													  // until port closes

			leftTargetSpeed = convertSpeedToProperRange(leftWheelBuffer[0]);
			rightTargetSpeed = convertSpeedToProperRange(rightWheelBuffer[0]);
			// }
		} else if (opBuffer[0] == 1) {
			//  if (Serial.available() > wheelCommandBufferSize -1) {
			uint8_t leftWheelBuffer[wheelCommandBufferSize];
			Serial.readBytes(leftWheelBuffer,
							 wheelCommandBufferSize); // Reads as many bytes or
													  // until port closes

			leftTargetSpeed = convertSpeedToProperRange(leftWheelBuffer[0]);

			// }
		} else if (opBuffer[0] == 2) {
			// if (Serial.available() > wheelCommandBufferSize -1) {
			uint8_t rightWheelBuffer[wheelCommandBufferSize];
			Serial.readBytes(rightWheelBuffer,
							 wheelCommandBufferSize); // Reads as many bytes or
													  // until port closes

			rightTargetSpeed = convertSpeedToProperRange(rightWheelBuffer[0]);
			// }
		} else {
			Serial.flush();
		}
	}
}
