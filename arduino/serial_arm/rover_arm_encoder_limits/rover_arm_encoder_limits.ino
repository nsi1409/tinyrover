int abs_pin = 38;

// values were found through manual testing
int joint1_lower_limit = 200; // actual: 130
int joint1_upper_limit = 650; // actual: 660
int joint2_lower_limit = 150; // actual: 145
int joint2_upper_limit = 310; // actual: 320
int joint3_lower_limit = 635; // actual: 630
int joint3_upper_limit = 850; // actual: 871
int joint4_lower_limit = 50; // actual: 0
int joint4_upper_limit = 490; // actual: 500
int joint5_lower_limit = 375; // actual: 350
int joint5_upper_limit = 930; // actual: 950
// int joint6_lower_limit = 850; // actual:
// int joint6_upper_limit = 850; // actual:

// int pin = 7;
unsigned long duration;

void setup() {
  Serial.begin(9600);
  pinMode(abs_pin, INPUT);
}

void loop() {
  duration = pulseIn(abs_pin, HIGH);
  Serial.println(duration);
}

// void setup() {
//   // put your setup code here, to run once:
//   Serial.begin(9600);
//   pinMode(abs_pin, INPUT);
// }

// void loop() {
//   // put your main code here, to run repeatedly:
//   int val = digitalRead(abs_pin);
//   Serial.println(val);
// }