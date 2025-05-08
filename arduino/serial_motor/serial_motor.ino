#include <Servo.h>
#include <TimerOne.h>
// https://hobbymania.com.ua/file/FlyColor_boat_ESC.pdf

#define MAX_PULSE 2000
#define MIN_PULSE 1000
#define OFF_PULSE 1500
#define TIME_TO_LIVE_MS 500

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

// Unit circle orientation starting at front right
const int ipn[6] = {6, 11, 10, 9, 3, 5};  // new mega
// pin 11 front left
// pin 6 front right
// pin 10 middle left
// pin 9 middle right
// pin 3 back left
// pin 5 back right
const int configPin = 12;
unsigned long received_time;
unsigned long current_time;

void setup() {
  for (int pin : ipn) {
    pinMode(pin, OUTPUT);
  }
  pinMode(configPin, INPUT);

  leftTargetSpeed = OFF_PULSE;
  leftCurrentSpeed = OFF_PULSE;
  rightTargetSpeed = OFF_PULSE;
  rightCurrentSpeed = OFF_PULSE;

  updateSpeedTimer = 0;

  Serial.begin(9600);
  Serial.setTimeout(100);  // in milliseconds

  initializeMotors();

  Timer1.initialize(3000);               // Start timer to have 3000 MICROseconds period
  Timer1.attachInterrupt(updateMotors);  // Attach function to run every time period completion
}

void initializeMotors() {
  leftFrontServo.attach(ipn[1], MIN_PULSE, MAX_PULSE);
  rightFrontServo.attach(ipn[0], MIN_PULSE, MAX_PULSE);
  leftMiddleServo.attach(ipn[2], MIN_PULSE, MAX_PULSE);
  rightMiddleServo.attach(ipn[5], MIN_PULSE, MAX_PULSE);
  leftBackServo.attach(ipn[3], MIN_PULSE, MAX_PULSE);
  rightBackServo.attach(ipn[4], MIN_PULSE, MAX_PULSE);

  // ONLY UNCOMMENT ONE OF THESE SETUP FUNCTIONS AT A TIME

  // Set throttle range
  //  resetThrottleRangeForMotors();

  // Change motor to drive forwards and backwards
  // setMotorsToForwardsAndBackwards();

  // Already setup, normal working mode
  normalWorkingMode();

  if (digitalRead(configPin) == HIGH) {
    resetThrottleRangeForMotors();
  } else {
    normalWorkingMode();
  }
}

void normalWorkingMode() {
  moveAllWheels(OFF_PULSE);
}

void setMotorsToForwardsAndBackwards() {
  moveAllWheels(MAX_PULSE);

  delay(9000);

  moveAllWheels(OFF_PULSE);

  delay(7000);

  moveAllWheels(MAX_PULSE);

  delay(2000);

  moveAllWheels(OFF_PULSE);
}

void resetThrottleRangeForMotors() {
  moveAllWheels(1600);

  delay(5000);

  moveAllWheels(OFF_PULSE);
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

void moveAllWheels(int speed) {
  leftFrontServo.writeMicroseconds(speed);
  rightFrontServo.writeMicroseconds(speed);
  leftMiddleServo.writeMicroseconds(speed);
  rightMiddleServo.writeMicroseconds(speed);
  leftBackServo.writeMicroseconds(speed);
  rightBackServo.writeMicroseconds(speed);
}

void moveLeftWheel(int speed) {
  // Flip orientation as we consider the right wheels the dominant speed
  int difference_from_middle = speed - OFF_PULSE;
  int corrected_speed = speed - (2 * difference_from_middle);
  // int corrected_speed=speed;

  leftFrontServo.writeMicroseconds(corrected_speed);
  leftBackServo.writeMicroseconds(corrected_speed);
  leftMiddleServo.writeMicroseconds(corrected_speed);
  // leftFrontServo.write(speed);
  // leftMiddleServo.write(speed);
  // leftBackServo.write(speed);
}

int convertSpeedToProperRange(uint8_t speed) {
  // For write microseconds
  float conv_speed = (float)speed;
  int converted = (conv_speed) / 180 * (MAX_PULSE - MIN_PULSE);
  int result = converted + MIN_PULSE;
  return result;

  // For write
  //  return speed;
}

void moveRightWheel(int speed) {
  // rightFrontServo.write(speed);
  // rightMiddleServo.write(speed);
  // rightBackServo.write(speed);

  rightFrontServo.writeMicroseconds(speed);
  rightMiddleServo.writeMicroseconds(speed);
  rightBackServo.writeMicroseconds(speed);
}

void updateMotors() {
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
  current_time = millis();
  if (Serial.available() > 0) {
    received_time = millis();
    uint8_t opBuffer[opCodeSize];
    Serial.readBytes(opBuffer, opCodeSize);  // Reads as many bytes or until port closes
    if (opBuffer[0] == 0) {
      uint8_t leftWheelBuffer[wheelCommandBufferSize];
      Serial.readBytes(leftWheelBuffer, wheelCommandBufferSize);

      uint8_t rightWheelBuffer[wheelCommandBufferSize];
      Serial.readBytes(rightWheelBuffer, wheelCommandBufferSize);

      leftTargetSpeed = convertSpeedToProperRange(leftWheelBuffer[0]);
      rightTargetSpeed = convertSpeedToProperRange(rightWheelBuffer[0]);
    } else if (opBuffer[0] == 1) {
      uint8_t leftWheelBuffer[wheelCommandBufferSize];
      Serial.readBytes(leftWheelBuffer, wheelCommandBufferSize);

      leftTargetSpeed = convertSpeedToProperRange(leftWheelBuffer[0]);
    } else if (opBuffer[0] == 2) {
      uint8_t rightWheelBuffer[wheelCommandBufferSize];
      Serial.readBytes(rightWheelBuffer, wheelCommandBufferSize);

      rightTargetSpeed = convertSpeedToProperRange(rightWheelBuffer[0]);
    } else {
      Serial.flush();
    }
  }
  if (current_time - received_time >= TIME_TO_LIVE_MS) {
    leftTargetSpeed = convertSpeedToProperRange(90);
    rightTargetSpeed = convertSpeedToProperRange(90);
  }
}
