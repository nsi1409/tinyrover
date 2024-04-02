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
#define joint1_lower_limit 200; // actual: 130
#define joint1_upper_limit 650; // actual: 660
#define joint2_lower_limit 150; // actual: 145
#define joint2_upper_limit 310; // actual: 320
#define joint3_lower_limit 635; // actual: 630
#define joint3_upper_limit 850; // actual: 871
#define joint4_lower_limit 50; // actual: 0
#define joint4_upper_limit 490; // actual: 500
#define joint5_lower_limit 375; // actual: 350
#define joint5_upper_limit 930; // actual: 950
// #define joint6_lower_limit 850; // actual:
// #define joint6_upper_limit 850; // actual:

#define j1_encoder 1;
#define j2_encoder 2;
#define j3_encoder 3;
#define j4_encoder 4;
#define j5_encoder 5;

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
      if () {
        analogWrite(MotorSpeed1, motorSpeed);
      }
      else {
        analogWrite(MotorSpeed1, 0);
      }
      break;
    case 10:
      digitalWrite(MotorDirection1, LOW);
      analogWrite(MotorSpeed1, motorSpeed);
      break;
    case 21:
      digitalWrite(MotorDirection2, HIGH);
      analogWrite(MotorSpeed2, 3*motorSpeed);
      break;
    case 20:
      digitalWrite(MotorDirection2, LOW);
      analogWrite(MotorSpeed2, 3*motorSpeed);
      break;
    case 31:
      digitalWrite(MotorDirection3, HIGH);
      analogWrite(MotorSpeed3, 3*motorSpeed);
      break;
    case 30:
      digitalWrite(MotorDirection3, LOW);
      analogWrite(MotorSpeed3, 3*motorSpeed);
      break;
    case 41:
      digitalWrite(MotorDirection4, HIGH);
      analogWrite(MotorSpeed4, motorSpeed);
      break;
    case 40:
      digitalWrite(MotorDirection4, LOW);
      analogWrite(MotorSpeed4, motorSpeed);
      break;
    case 51:
      digitalWrite(MotorDirection5, HIGH);
      analogWrite(MotorSpeed5, 1.5*motorSpeed);
      break;
    case 50:
      digitalWrite(MotorDirection5, LOW);
      analogWrite(MotorSpeed5, 1.5*motorSpeed);
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
  //For LED Blinking
 
  // else{
  //   // digitalWrite(MotorDirection6, LOW);
  //   // digitalWrite(MotorDirection6, LOW);
  //   // digitalWrite(MotorDirection6, LOW);
  //   // digitalWrite(MotorDirection6, LOW);
  //   // digitalWrite(MotorDirection6, LOW);
  //   // digitalWrite(MotorDirection6, LOW);
  // }
  // unsigned long currentMillis = millis();
  // if(currentMillis - previousMillis >= interval){
  //   previousMillis = currentMillis;//save off m

  //   //if LEED is off, turn on and vice versa
  //   if (ledState ==LOW){
  //     ledState = HIGH;
  //   }else{
  //     ledState = LOW;
  //   }
  //   //set LED with ledstate of the variable
  //   digitalWrite(LED_BUILTIN, ledState);

  

}
