#include <Servo.h> 
String command;
//Unit Circle :)
int ipn[4] = {2, 5, 4, 3};
// pin 5 front left 
// pin 2 front right
// pin back 4 back left / middle
// pin 3 back right middle







int state[4] = {1, 0, 1, 0};
char charBuf[128];






Servo rightFrontServo;
Servo leftFrontServo;
Servo leftBackServo;
Servo rightBackServo;

size_t wheelCommandBufferSize =  1;
size_t opCodeSize = 1;

void setup() {
  for(int i = 0; i < 4; i++) {
    pinMode(ipn[i], OUTPUT);
  }
  //pin 3 front right
//pin 5 front left
//pin 6 back left
//pin 9 back right

  Serial.begin(9600);
  Serial.setTimeout(100); //in milliseconds
  rightFrontServo.attach(3);
  leftFrontServo.attach(5);
  leftBackServo.attach(6);
  rightBackServo.attach(9);
  // rightBackServo.write(150);
}

//Debugging, printing is iffy regardless, can just be safer to use Serial.write
void printBufferIntArray(uint8_t* array, size_t bufferSize){ 
  Serial.print("[");
  for(int i = 0; i < bufferSize; i++){
    Serial.print(array[i]);
    Serial.print(",");
  }
  
  Serial.print("]\n");
}

void moveLeftWheel(uint8_t speed){
  leftFrontServo.write(speed);
  leftBackServo.write(speed);

}

// uint8_t convertSpeedtoProperRange(uint8_t speed){
//   float converted = speed*180.0;
//   uint8_t result = (uint8_t) converted/255;
//   return result;
// }

void moveRightWheel(uint8_t speed){
  rightFrontServo.write(speed);
  rightBackServo.write(speed);
}

void loop() {
  
  if (Serial.available() > 0){
    uint8_t opBuffer[opCodeSize];
    Serial.readBytes(opBuffer, opCodeSize); //Reads as many bytes or until port closes
    Serial.write(opBuffer, opCodeSize); // Sends back to server to confirm correct received
    Serial.println(opBuffer[0],DEC);
    if(opBuffer[0] == 0){
        uint8_t leftWheelBuffer[wheelCommandBufferSize];
        Serial.readBytes(leftWheelBuffer, wheelCommandBufferSize); //Reads as many bytes or until port closes
        Serial.write(leftWheelBuffer, wheelCommandBufferSize); // Sends back to server to confirm correct received
        uint8_t rightWheelBuffer[wheelCommandBufferSize];
        Serial.readBytes(rightWheelBuffer, wheelCommandBufferSize); //Reads as many bytes or until port closes
        Serial.write(rightWheelBuffer, wheelCommandBufferSize); // Sends back to server to confirm correct received


        uint8_t convertedLeftSpeed = leftWheelBuffer[0]; //Temporary for testing
        uint8_t convertedRightSpeed = rightWheelBuffer[0];
        // uint8_t convertedLeftSpeed = convertSpeedToProperRange(leftWheelBuffer[0]);
        // uint8_t convertedRightSpeed = convertSpeedToProperRange(rightWheelBuffer[0]);
        moveLeftWheel(convertedLeftSpeed);
        moveRightWheel(convertedRightSpeed);
    }
    if(opBuffer[0] == 1){

      //  if (Serial.available() >= wheelCommandBufferSize) {
        uint8_t leftWheelBuffer[wheelCommandBufferSize];
        Serial.readBytes(leftWheelBuffer, wheelCommandBufferSize); //Reads as many bytes or until port closes
        Serial.write(leftWheelBuffer, wheelCommandBufferSize); // Sends back to server to confirm correct received
        


        uint8_t convertedLeftSpeed = leftWheelBuffer[0]; //Temporary for testing
        // uint8_t convertedLeftSpeed = convertSpeedToProperRange(leftWheelBuffer[0]);
        moveLeftWheel(convertedLeftSpeed);
          
      // }
    }
    if(opBuffer[0] == 2){
    
        uint8_t rightWheelBuffer[wheelCommandBufferSize];
        Serial.readBytes(rightWheelBuffer, wheelCommandBufferSize); //Reads as many bytes or until port closes
        Serial.write(rightWheelBuffer, wheelCommandBufferSize); // Sends back to server to confirm correct received


        uint8_t convertedRightSpeed = rightWheelBuffer[0];
        // uint8_t convertedLeftSpeed = convertSpeedToProperRange(leftWheelBuffer[0]);
        // uint8_t convertedRightSpeed = convertSpeedToProperRange(rightWheelBuffer[0]);
        moveRightWheel(convertedRightSpeed);
          
    }

  }
  
}
