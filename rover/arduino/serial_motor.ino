String command;
int ipn[4] = {5, 6, 10, 11};
int state[4] = {1, 0, 1, 0};
char charBuf[128];

void setup() {
  for(int i = 0; i < 4; i++) {
    pinMode(ipn[i], OUTPUT);
  }
  Serial.begin(9600);
}

void loop() {
  if (Serial.available()) {
    command = Serial.readStringUntil('\n');
    Serial.println(command);
    command.toCharArray(charBuf, 128);
    int inpt = atoi(charBuf);
    analogWrite(ipn[0], 255 & inpt);
    analogWrite(ipn[1], inpt >> 8);
  }
  /*//digitalWrite(ipn[0], state[0]);
  //digitalWrite(ipn[1], state[1]);
  digitalWrite(ipn[1], 0);
  for(int i = 0; i < 256; i++) {
    analogWrite(ipn[0], i);
    delay(10);
  }
  digitalWrite(ipn[0], 0);
  for(int i = 0; i < 256; i++) {
    analogWrite(ipn[1], i);
    delay(10);
  }*/
  /*for(int i = 0; i < 4; i++) {
    state[i] ^= 1;
  }
  delay(2000);*/
}
