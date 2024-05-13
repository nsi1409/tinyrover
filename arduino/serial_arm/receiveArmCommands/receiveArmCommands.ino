//This script will wait for Serial input in the form of a number of milliseconds to tell the 
//teensy to blink its light. Upload this, and then run the corresponding Python script 
//with the same name.
int interval;
String User_Data;
int motorSpeed = 50;

#define MotorSpeed6 A0
#define MotorDirection6 13
#define MotorSpeed5 A1
#define MotorDirection5 16

#define MotorSpeed4 A11
#define MotorDirection4 27
#define MotorSpeed3 2
#define MotorDirection3 3

#define MotorSpeed2 23
#define MotorDirection2 22
#define MotorSpeed1 A5
#define MotorDirection1 18

//from rover_arm_encoder_limits
// values were found through manual testing
#define joint1_lower_limit 200 // actual: 130
#define joint1_upper_limit 650 // actual: 660
#define joint2_lower_limit 150 // actual: 145
#define joint2_upper_limit 310 // actual: 320
#define joint3_lower_limit 635 // actual: 630
#define joint3_upper_limit 850 // actual: 871
#define joint4_lower_limit 50 // actual: 0
#define joint4_upper_limit 490 // actual: 500
#define joint5_lower_limit 375 // actual: 350
#define joint5_upper_limit 930 // actual: 950
// #define joint6_lower_limit 850; // actual:
// #define joint6_upper_limit 850; // actual:

#define j1_encoder 1
#define j2_encoder 2
#define j3_encoder 38
#define j4_encoder 4
#define j5_encoder 5

void setup() {

  pinMode(MotorDirection6, OUTPUT);
  pinMode(MotorSpeed6, OUTPUT);
  pinMode(MotorDirection5, OUTPUT);
  pinMode(MotorSpeed5, OUTPUT);
  pinMode(MotorDirection4, OUTPUT);
  pinMode(MotorSpeed4, OUTPUT);
  pinMode(MotorDirection3, OUTPUT);
  pinMode(MotorSpeed3, OUTPUT);
  pinMode(MotorDirection2, OUTPUT);
  pinMode(MotorSpeed2, OUTPUT);
  pinMode(MotorDirection1, OUTPUT);
  pinMode(MotorSpeed1, OUTPUT);

  pinMode(j1_encoder, INPUT);
  pinMode(j2_encoder, INPUT);
  pinMode(j3_encoder, INPUT);
  pinMode(j4_encoder, INPUT);
  pinMode(j5_encoder, INPUT);

  Serial.begin(9600);

}


void loop() {

  if(Serial.available()>0){;//read when we have something new coming through the serial
    interval = Serial.parseInt();
    // interval = User_Data.toInt();
    Serial.println(interval);
  }
  switch(interval){
    case 11:
      digitalWrite(MotorDirection1, HIGH);
      if (joint1_lower_limit>j1_encoder && joint1_upper_limit<j1_encoder) {
        analogWrite(MotorSpeed1, motorSpeed);
      }
      else {
        analogWrite(MotorSpeed1, 0);
      }
      break;
    case 10:
      digitalWrite(MotorDirection1, LOW);
      if (joint1_lower_limit>j1_encoder && joint1_upper_limit<j1_encoder) {
        analogWrite(MotorSpeed1, motorSpeed);
      }
      else {
        analogWrite(MotorSpeed1, 0);
      }
      break;
    case 21:
      digitalWrite(MotorDirection2, HIGH);
      if (joint2_lower_limit>j2_encoder && joint2_upper_limit<j2_encoder) {
        analogWrite(MotorSpeed2, 3*motorSpeed);
      }
      else {
        analogWrite(MotorSpeed2, 0);
      }
      break;
    case 20:
      digitalWrite(MotorDirection2, LOW);
      if (joint2_lower_limit>j2_encoder && joint2_upper_limit<j2_encoder) {
        analogWrite(MotorSpeed2, 3*motorSpeed);
      }
      else {
        analogWrite(MotorSpeed2, 0);
      }
      break;
    case 31:
      digitalWrite(MotorDirection3, HIGH);
      if (joint3_lower_limit<pulseIn(j3_encoder, HIGH)) {
        analogWrite(MotorSpeed3, 3*motorSpeed);
      }
      else {
        analogWrite(MotorSpeed3, 0);
      }
      break;
    case 30:
      Serial.println(pulseIn(j3_encoder, HIGH));
      digitalWrite(MotorDirection3, LOW);
      if (joint3_upper_limit>pulseIn(j3_encoder, HIGH)) {
        analogWrite(MotorSpeed3, 3*motorSpeed);
      }
      else {
        analogWrite(MotorSpeed3, 0);
      }
      break;
    case 41:
      digitalWrite(MotorDirection4, HIGH);
      if (joint4_lower_limit>j4_encoder && joint4_upper_limit<j4_encoder) {
        analogWrite(MotorSpeed4, motorSpeed);
      }
      else {
        analogWrite(MotorSpeed4, 0);
      }
      break;
    case 40:
      digitalWrite(MotorDirection4, LOW);
      if (joint4_lower_limit>j4_encoder && joint4_upper_limit<j4_encoder) {
        analogWrite(MotorSpeed4, motorSpeed);
      }
      else {
        analogWrite(MotorSpeed4, 0);
      }
      break;
    case 51:
      digitalWrite(MotorDirection5, HIGH);
      if (joint5_lower_limit>j5_encoder && joint5_upper_limit<j5_encoder) {
        analogWrite(MotorSpeed5, 1.5*motorSpeed);
      }
      else {
        analogWrite(MotorSpeed5, 0);
      }
      break;
    case 50:
      digitalWrite(MotorDirection5, LOW);
      if (joint5_lower_limit>j5_encoder && joint5_upper_limit<j5_encoder) {
        analogWrite(MotorSpeed5, 1.5*motorSpeed);
      }
      else {
        analogWrite(MotorSpeed5, 0);
      }
      break;
    case 61:
      digitalWrite(MotorDirection6, HIGH);
      analogWrite(MotorSpeed6, motorSpeed);
      break;
    case 60:
      digitalWrite(MotorDirection6, LOW);
      analogWrite(MotorSpeed6, motorSpeed);
      break;
    case 0:
      analogWrite(MotorSpeed1, 0);
      analogWrite(MotorSpeed2, 0);
      analogWrite(MotorSpeed3, 0);
      analogWrite(MotorSpeed4, 0);
      analogWrite(MotorSpeed5, 0);
      analogWrite(MotorSpeed6, 0);
      break;
  }

}
