//This script will wait for Serial input in the form of a number of milliseconds to tell the 
//teensy to blink its light. Upload this, and then run the corresponding Python script 
//with the same name.
int interval;
String User_Data;
unsigned long previousMillis = 0;
int ledState = LOW;

#define MotorSpeed6 41
#define MotorDirection6 40
#define MotorSpeed5 39
#define MotorDirection5 38

#define MotorSpeed4 0
#define MotorDirection4 1
#define MotorSpeed3 2
#define MotorDirection3 3

#define MotorSpeed2 23
#define MotorDirection2 22
#define MotorSpeed1 21
#define MotorDirection1 20


void setup() {

  pinMode(MotorDirection6, OUTPUT);
  pinMode(MotorSpeed6, OUTPUT);
  pinMode(MotorDirection5, OUTPUT);
  pinMode(MotorSpeed5, OUTPUT);
  // 4 IS BROKEN FOR THE MOMENT
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

  if(Serial.available()>0){//read when we have something new coming through the serial
    User_Data = Serial.readString();
    interval = User_Data.toInt();
    Serial.println(interval);
  }
  //For LED Blinking
  if(interval==11){//joint 1 forward
    digitalWrite(MotorDirection1, HIGH);
    digitalWrite(MotorSpeed1, HIGH);
  }else if(interval==10){//joint 1 backward
    digitalWrite(MotorDirection1, HIGH);
    digitalWrite(MotorSpeed1, LOW);
  }else if(interval==21){//joint 2 forward
    digitalWrite(MotorDirection2, HIGH);
    digitalWrite(MotorSpeed2, HIGH);

  }else if(interval==20){//joint 2 backward
    digitalWrite(MotorDirection2, LOW);
    digitalWrite(MotorSpeed2, HIGH);

  }else if(interval==31){//joint 3 forward
    digitalWrite(MotorDirection3, HIGH);
    digitalWrite(MotorSpeed3, HIGH);

  }else if(interval==30){//joint 3 backward
    digitalWrite(MotorDirection3, LOW);
    // digitalWrite(MotorSpeed3, HIGH);

  }else if(interval==41){//joint 4 forward
    digitalWrite(MotorDirection4, HIGH);
    digitalWrite(MotorSpeed4, HIGH);

  }else if(interval==40){//joint 4 backward
    digitalWrite(MotorDirection4, HIGH);
    digitalWrite(MotorSpeed4, LOW);

  }else if(interval==51){//joint 5 forward
    digitalWrite(MotorDirection5, HIGH);
    digitalWrite(MotorSpeed5, HIGH);

  }else if(interval==50){//joint 5 backward
    digitalWrite(MotorDirection5, HIGH);
    digitalWrite(MotorSpeed5, LOW);

  }else if(interval==61){//joint 6 forward
    digitalWrite(MotorDirection6, HIGH);
    digitalWrite(MotorSpeed6, HIGH);

  }else if(interval==60){//joint 6 backward
    digitalWrite(MotorDirection6, LOW);
    digitalWrite(MotorSpeed6, HIGH);
  }else{
    digitalWrite(MotorSpeed1, LOW);
    digitalWrite(MotorSpeed4, LOW);
    digitalWrite(MotorSpeed5, LOW);
    digitalWrite(MotorSpeed6, LOW);
  }
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

  // }

}
