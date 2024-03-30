#include <Servo.h>
Servo PWMSig;
Servo PWMSig2;
int interval;
String User_Data;

void setup() {
  PWMSig.attach(9, 1000, 2000);  // attaches it to pin 9, the 1000-2000 range is pulse width
  PWMSig2.attach(8, 1000, 2000);
  Serial.begin(9600);
}

void loop() {
  if(Serial.available()>0){;//read when we have something new coming through the serial
    interval = Serial.parseInt();
    // interval = User_Data.toInt();
    Serial.println(interval);
  }
  int potIn = analogRead(A0);                     // using a pot to control all of this
  //int potValue = map(potIn, 0, 750, 1000, 2000);  // maps the pots analogIn to the signals for
  if(interval != 0){
    int potValue = map(interval, 0, 1024, 0, 180);
    PWMSig.write(potValue);
    PWMSig2.write(potValue);
  }
                                                 //  the PWM. It wil work between 1000-2000 us
  //PWMSig.writeMicroseconds(potValue);                 // Sends the signal to the PWM module
  //PWMSig2.writeMicroseconds(potValue); 
}