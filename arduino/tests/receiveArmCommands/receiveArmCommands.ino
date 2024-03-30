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
      analogWrite(MotorSpeed1, motorSpeed);
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
