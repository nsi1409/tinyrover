//This script will wait for Serial input in the form of a number of milliseconds to tell the 
//teensy to blink its light. Upload this, and then run the corresponding Python script 
//with the same name.
uint interval;
String User_Data;
unsigned long previousMillis = 0;
int ledState = LOW;


void setup() {

  Serial.begin(9600);
  pinMode(LED_BUILTIN, OUTPUT);
  interval = 1000;

}


void loop() {
  if(Serial.available()>0){//read when we have something new coming through the serial
    User_Data = Serial.readString();
    interval = User_Data.toInt();
    Serial.println(interval);
  }
  //For LED Blinking
  unsigned long currentMillis = millis();
  if(currentMillis - previousMillis >= interval){
    previousMillis = currentMillis;//save off m

    //if LEED is off, turn on and vice versa
    if (ledState ==LOW){
      ledState = HIGH;
    }else{
      ledState = LOW;
    }
    //set LED with ledstate of the variable
    digitalWrite(LED_BUILTIN, ledState);

  }

}
