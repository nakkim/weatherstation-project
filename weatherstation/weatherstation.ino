/*

  This example connects to an unencrypted Wifi network.
  Then it prints the  MAC address of the Wifi module,
  the IP address obtained, and other network details.

  created 13 July 2010
  by dlf (Metodo2 srl)
  modified 31 May 2012
  by Tom Igoe
*/

#include <SPI.h>
#include <WiFiNINA.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <SFE_BMP180.h>
#include <Ethernet.h>

// define DHT related stuff
#define DHTPIN 2          // PIN data of DHT22
#define DHTTYPE DHT22     // DHT 22  (AM230
#define ALTITUDE 30.0     // altitude

WiFiClient client;
DHT dht(DHTPIN, DHTTYPE);
SFE_BMP180 pressure;

#include "secrets.h"
#include "networkfunctions.h"
#include "pressure.h"

//const IPAddress server(194,32,77,146);
byte server[] = { 194,32,77,146 };
//char server[] = "smartmet.tuulikartta.dy.fi";

// initialize data parameters and data output string
float t = 0;
float dew = 0;
float rh = 0;
float P = 0;
String data = "";

// leds
int greenled = 11;
int redled = 12;

int photocellPin = 0;
int photocell;

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
int status = WL_IDLE_STATUS;

void setup() {

  pinMode(redled, OUTPUT);
  pinMode(greenled, OUTPUT);

  Serial.begin(9600);
  while (!Serial) {
    ; // wait for serial port to connect.
  }

  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);
    delay(5000);
  }

  Serial.print("");
  Serial.print("You're connected to the network");
  printCurrentNet();
  printWifiData();

  // initialize DHT22 sensor
  dht.begin();

  // Initialize the bmp180 prssure sensor.
  Serial.println("");
  Serial.println("Initializing BMP180 sensor... ");
  if (pressure.begin()) {
    Serial.println("completed");
  } else {
    Serial.println("failed");
    Serial.println("BMP180 initialization failed");
    while(1); // Pause forever.
  }
}


void loop() {

  delay(60000);

  Serial.println("");
  Serial.println("New measurements");
  rh = dht.readHumidity();
  t = dht.readTemperature();
  dew = t - (100-rh)/5;
  float P = getPressure();
  photocell = analogRead(photocellPin);
  data = "data=" + String(t)+ "," + String(dew) + "," + String(rh) + "," + String(P) + "," + String(photocell);
  Serial.println(data);

  Serial.println("");
  
  Serial.println("Connecting HTTP client...");
  if (client.connect(server,80)) {
    Serial.println("Connected");
    digitalWrite(greenled, HIGH);
    Serial.println("Sending data... ");
    
    client.println("POST /weather-station/add.php HTTP/1.1");
    client.println("Host: smartmet.dy.fi");
    client.println("Content-Type: application/x-www-form-urlencoded");
    client.print("Content-Length: ");
    client.println(data.length());
    client.println("");
    client.println(data);
    Serial.println("data sent");
    Serial.println(data);
    Serial.println("");
    delay(2000);
    digitalWrite(greenled, LOW);
 
  } else {
    digitalWrite(redled, HIGH);
    Serial.println("Connection failed, disconnecting.");
    Serial.print("Error code: ");
    Serial.println(client.connect(server,80));
    Serial.println();
    client.stop();
    delay(2000);
    digitalWrite(redled, LOW);
  }  

  if (client.available()) {
    char c = client.read();
    Serial.print(c);
  }
  
  Serial.println(".......................................");
  
}
