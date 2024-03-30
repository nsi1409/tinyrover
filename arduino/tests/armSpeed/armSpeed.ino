int interval;
String User_Data;

#define MotorSpeed4 25
#define MotorDirection4 24

#define MotorSpeed6 A0
#define MotorDirection6 13

int motorSpeed;


void setup() {
  // put your setup code here, to run once:
  pinMode(MotorDirection6, OUTPUT);
  pinMode(MotorSpeed6, OUTPUT);
  pinMode(MotorDirection4, OUTPUT);
  pinMode(MotorSpeed4, OUTPUT);

  motorSpeed = 80;
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  if(Serial.available()>0){//read when we have something new coming through the serial
    User_Data = Serial.readString();
    interval = User_Data.toInt();
    Serial.println(interval);
  }
  if(interval==41){//joint 6 forward
    digitalWrite(MotorDirection4, HIGH);
    analogWrite(MotorSpeed4, motorSpeed);

  }else if(interval==40){//joint 6 backward
    digitalWrite(MotorDirection4, LOW);
    analogWrite(MotorSpeed4, motorSpeed);
  }if(interval==61){//joint 6 forward
    digitalWrite(MotorDirection6, HIGH);
    analogWrite(MotorSpeed6, motorSpeed);

  }else if(interval==60){//joint 6 backward
    digitalWrite(MotorDirection6, LOW);
    analogWrite(MotorSpeed6, motorSpeed);
    
  }else{
    analogWrite(MotorSpeed6, 0);
    analogWrite(MotorSpeed4, 0);
  }
}
