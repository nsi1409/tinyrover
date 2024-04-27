// #include <Servo.h>
#include <TimerOne.h>
#define MotorSpeed6 40
#define MotorDirection6 41
#define MotorSpeed5 38
#define MotorDirection5 39

#define MotorSpeed4 0
#define MotorDirection4 1
#define MotorSpeed3 2
#define MotorDirection3 3

#define MotorSpeed2 23
#define MotorDirection2 22
#define MotorSpeed1 21
#define MotorDirection1 20

// String command;

// int state[4] = {1, 0, 1, 0};
// char charBuf[128];
// size_t armCommandBufferSize = 1;
// size_t opCodeSize = 1;
// int updateSpeedTimer;
// int leftTargetSpeed;
// int leftCurrentSpeed;


void setup() {
  // put your setup code here, to run once:
  pinMode(MotorDirection6, OUTPUT);
  pinMode(MotorSpeed6, OUTPUT);
  pinMode(MotorDirection5, OUTPUT);
  pinMode(MotorSpeed5, OUTPUT);
  // 4 IS BROKEN FOR THE MOMENT
  // pinMode(MotorDirection4, OUTPUT);
  // pinMode(MotorSpeed4, OUTPUT);
  pinMode(MotorDirection3, OUTPUT);
  pinMode(MotorSpeed3, OUTPUT);
  pinMode(MotorDirection2, OUTPUT);
  pinMode(MotorSpeed2, OUTPUT);
  pinMode(MotorDirection1, OUTPUT);
  pinMode(MotorSpeed1, OUTPUT);

  Serial.begin(57600);
	Serial.setTimeout(100); // in milliseconds
  
  //Blink Example
  pinMode(LED_BUILTIN, OUTPUT);
}

void blinkTeensy(){
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}

void moveJoint2(int direction, int speed) {
	digitalWrite(MotorDirection2, direction);
  digitalWrite(MotorSpeed2, speed);
}

bool running = true;

void loop() {
  if (Serial.available() > 0) {
    Serial.println("Button is not pressed...");
  }
    // moveJoint2(LOW, HIGH);
	// 	uint8_t opBuffer[opCodeSize];
	// 	Serial.readBytes(
	// 		opBuffer,
	// 		opCodeSize); // Reads as many bytes or until port closes
	// 	if (opBuffer[0] == 0) {
	// 		// if(Serial.available() > wheelCommandBufferSize){
	// 		uint8_t leftWheelBuffer[armCommandBufferSize];
	// 		Serial.readBytes(leftWheelBuffer,
	// 						 armCommandBufferSize); // Reads as many bytes or
	// 												  // until port closes

	// 		// }
	// 	} else if (opBuffer[0] == 1) {
	// 		//  if (Serial.available() > wheelCommandBufferSize -1) {
	// 		uint8_t leftWheelBuffer[armCommandBufferSize];
	// 		Serial.readBytes(leftWheelBuffer,
	// 						 armCommandBufferSize); // Reads as many bytes or
	// 												  // until port closes

  //     moveJoint2(leftWheelBuffer[0], leftWheelBuffer[0]);

	// 		// }
	// 	} else {
	// 		Serial.flush();
	// 	}
	// }
  // put your main code here, to run repeatedly:
  // digitalWrite(MotorDirection2, LOW);
  // digitalWrite(MotorSpeed2, HIGH);

  // digitalWrite(MotorDirection6, LOW);
  // digitalWrite(MotorSpeed6, 10);
  // delay(500);
  // digitalWrite(MotorDirection6, HIGH);
  // digitalWrite(MotorSpeed6, 10);

  ////Joint1
  // digitalWrite(MotorDirection1, LOW);
  // digitalWrite(MotorSpeed1, 50);
  // delay(2000);
  // digitalWrite(MotorSpeed1, LOW);

  // digitalWrite(MotorDirection2, HIGH);
  // digitalWrite(MotorSpeed2, HIGH);
  // if(running){
  //   // digitalWrite(MotorDirection6, LOW);
  //   // digitalWrite(MotorSpeed6, 10);
  //   digitalWrite(MotorDirection6, HIGH);
  //   digitalWrite(MotorSpeed6, 10);
  //   running = false;
  // }
  // delay(500);
  // digitalWrite(MotorDirection6, HIGH);
  // digitalWrite(MotorSpeed6, 10);

  // digitalWrite(MotorDirection1, HIGH);
  // digitalWrite(MotorSpeed1, 50);
  // delay(2000);
  // digitalWrite(MotorSpeed1, LOW);
  
  // delay(5000);

  // blinkTeensy();

}
