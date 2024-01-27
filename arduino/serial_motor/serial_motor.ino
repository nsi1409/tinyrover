#include <Servo.h>
#include <TimerOne.h>
//https://hobbymania.com.ua/file/FlyColor_boat_ESC.pdf

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
Servo leftMiddleServo;
Servo rightMiddleServo;

size_t wheelCommandBufferSize = 1;
size_t opCodeSize = 1;

//Unit cicle orientation starting at front right
int ipn[6] = {9, 6, 5, 4, 7, 3};
// pin 6 front left
// pin 9 front right
// pin 5 middle left
// pin 3 middle right
// pin 4 back left
// pin 7 back right

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
	leftFrontServo.attach(6, MIN_PULSE, MAX_PULSE);
  rightFrontServo.attach(9, MIN_PULSE, MAX_PULSE);
	leftMiddleServo.attach(5, MIN_PULSE, MAX_PULSE);
	rightMiddleServo.attach(3, MIN_PULSE, MAX_PULSE);
	leftBackServo.attach(4, MIN_PULSE, MAX_PULSE);
	rightBackServo.attach(7, MIN_PULSE, MAX_PULSE);

  //ONLY UNCOMMENT ONE OF THESE SETUP FUNCTIONS AT A TIME

  //Set throttle range
  // resetThrottleRangeForMotors();

  // Change motor to drive forwards and backwards
  // setMotorsToForwardsAndBackwards();

  //Already setup, normal working mode
  normalWorkingMode();



  Timer1.initialize(3000); //Start timer to have 3000 MICROseconds period
  Timer1.attachInterrupt(updateMotors); //Attach function to run every time period completion
}

void normalWorkingMode(){
  leftFrontServo.writeMicroseconds(OFF_PULSE);
  rightFrontServo.writeMicroseconds(OFF_PULSE);
  leftMiddleServo.writeMicroseconds(OFF_PULSE);
  rightMiddleServo.writeMicroseconds(OFF_PULSE);
  leftBackServo.writeMicroseconds(OFF_PULSE);
  rightBackServo.writeMicroseconds(OFF_PULSE);
}

void setMotorsToForwardsAndBackwards(){
  leftFrontServo.writeMicroseconds(MAX_PULSE);
  rightFrontServo.writeMicroseconds(MAX_PULSE);
  leftMiddleServo.writeMicroseconds(MAX_PULSE);
  rightMiddleServo.writeMicroseconds(MAX_PULSE);
  leftBackServo.writeMicroseconds(MAX_PULSE);
  rightBackServo.writeMicroseconds(MAX_PULSE);

  delay(9000);

  leftFrontServo.writeMicroseconds(OFF_PULSE);
  rightFrontServo.writeMicroseconds(OFF_PULSE);
  leftMiddleServo.writeMicroseconds(OFF_PULSE);
  rightMiddleServo.writeMicroseconds(OFF_PULSE);
  leftBackServo.writeMicroseconds(OFF_PULSE);
  rightBackServo.writeMicroseconds(OFF_PULSE);

  delay(7000);

  leftFrontServo.writeMicroseconds(MAX_PULSE);
  rightFrontServo.writeMicroseconds(MAX_PULSE);
  leftMiddleServo.writeMicroseconds(MAX_PULSE);
  rightMiddleServo.writeMicroseconds(MAX_PULSE);
  leftBackServo.writeMicroseconds(MAX_PULSE);
  rightBackServo.writeMicroseconds(MAX_PULSE);

  delay(2000);

  leftFrontServo.writeMicroseconds(OFF_PULSE);
  rightFrontServo.writeMicroseconds(OFF_PULSE);
  leftMiddleServo.writeMicroseconds(OFF_PULSE);
  rightMiddleServo.writeMicroseconds(OFF_PULSE);
  leftBackServo.writeMicroseconds(OFF_PULSE);
  rightBackServo.writeMicroseconds(OFF_PULSE);
}

void resetThrottleRangeForMotors(){
  leftFrontServo.writeMicroseconds(MAX_PULSE);
  rightFrontServo.writeMicroseconds(MAX_PULSE);
  leftMiddleServo.writeMicroseconds(MAX_PULSE);
  rightMiddleServo.writeMicroseconds(MAX_PULSE);
  leftBackServo.writeMicroseconds(MAX_PULSE);
  rightBackServo.writeMicroseconds(MAX_PULSE);

  delay(5000);

  leftFrontServo.writeMicroseconds(OFF_PULSE);
  rightFrontServo.writeMicroseconds(OFF_PULSE);
  leftMiddleServo.writeMicroseconds(OFF_PULSE);
  rightMiddleServo.writeMicroseconds(OFF_PULSE);
  leftBackServo.writeMicroseconds(OFF_PULSE);
  rightBackServo.writeMicroseconds(OFF_PULSE);
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
  //Flip orientation as we consider the right wheels the dominant speed
  // int difference_from_middle = speed - OFF_PULSE;
  // int corrected_speed = speed - (2*difference_from_middle);
  int corrected_speed=speed;


	leftFrontServo.writeMicroseconds(corrected_speed);
	leftBackServo.writeMicroseconds(corrected_speed);
  leftMiddleServo.writeMicroseconds(corrected_speed);
  // leftFrontServo.write(speed);
	// leftMiddleServo.write(speed);
	// leftBackServo.write(speed);

}

int convertSpeedToProperRange(uint8_t speed) {
  //For write microseconds
  float conv_speed = (float) speed;
	int converted = (conv_speed) / 180 * (MAX_PULSE - MIN_PULSE);
	int result = converted + MIN_PULSE;
	return result;

  //For write 
	// return speed;
}

void moveRightWheel(int speed) {
	// rightFrontServo.write(speed);
	// rightMiddleServo.write(speed);
	// rightBackServo.write(speed);
  
  rightFrontServo.writeMicroseconds(speed);
  rightMiddleServo.writeMicroseconds(speed);
	rightBackServo.writeMicroseconds(speed);
}

void updateMotors(){

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

}

void loop() {
	// THIS IS HARDWARE DEPENDENT FOR THE SPEED CHANGE UNLESS A TIMER IS ADDED
	// if (updateSpeedTimer > 1000) {
	// 	if (leftCurrentSpeed != leftTargetSpeed) {
	// 		if (leftCurrentSpeed < leftTargetSpeed) {
	// 			leftCurrentSpeed = leftCurrentSpeed + 1;
	// 		} else {
	// 			leftCurrentSpeed = leftCurrentSpeed - 1;
	// 		}
	// 		moveLeftWheel(leftCurrentSpeed);
	// 		//
	// 	}

	// 	if (rightCurrentSpeed != rightTargetSpeed) {
	// 		if (rightCurrentSpeed < rightTargetSpeed) {
	// 			rightCurrentSpeed = rightCurrentSpeed + 1;
	// 		} else {
	// 			rightCurrentSpeed = rightCurrentSpeed - 1;
	// 		}
	// 		moveRightWheel(rightCurrentSpeed);
	// 	}
	// 	updateSpeedTimer = 0;
	// }
	// updateSpeedTimer = updateSpeedTimer + 1;

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
