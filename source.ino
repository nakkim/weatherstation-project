// working http post request version 9.7.2016

#include <Ethernet.h>
#include "DHT.h"
#include <SPI.h>
#include <HttpClient.h>
#include <SFE_BMP180.h>
#include <Wire.h>


/* defines and pins */

SFE_BMP180 pressure;

byte mac[] = { 0x90, 0xA2, 0xDA, 0x0F, 0x43, 0xB4  };   // shield mac
byte ip[] = { 192, 168, 0, 106 };                       // shield ip
char serverName[] = "www.nakkim.org";               // test web page server
EthernetClient client;

int light_pin = A0;           // analog pin 0
#define DHTPIN 2              // PIN data of DHT22
#define DHTTYPE DHT22         // DHT 22  (AM230
#define ALTITUDE 30.0         // altitude
DHT dht(DHTPIN, DHTTYPE);

float t = 0;
float dew = 0;
float rh = 0;
int light = 0;
float P = 0;
String data = "";

int measureInterval = 600;     // measurement interval in seconds


/* pressure function */

float getPressure(){
  char status;
  double T,P,p0,a;
  status = pressure.startTemperature();

  // Initialize the sensor (it is important to get calibration values stored on the device).
  Serial.print("Initializing BMP180 sensor... ");
  if (pressure.begin())
    Serial.println("completed");
  else
  {
    // Oops, something went wrong, this is usually a connection problem,
    // see the comments at the top of this sketch for the proper connections.
    Serial.println("failed");
    Serial.println("BMP180 initialization failed");
    while(1); // Pause forever.
  }
  
  if (status != 0)
  {
    // Wait for the measurement to complete:
    delay(status);
    
    // Retrieve the completed temperature measurement:
    // Note that the measurement is stored in the variable T.
    // Function returns 1 if successful, 0 if failure.

    status = pressure.getTemperature(T);
    if (status != 0)
    {
      // Start a pressure measurement:
      // The parameter is the oversampling setting, from 0 to 3 (highest res, longest wait).
      // If request is successful, the number of ms to wait is returned.
      // If request is unsuccessful, 0 is returned.
      Serial.print("Start pressure measurement...");
      status = pressure.startPressure(3);
      if (status != 0)
      {
        // Wait for the measurement to complete:
        delay(status);

        // Retrieve the completed pressure measurement:
        // Note that the measurement is stored in the variable P.
        // Note also that the function requires the previous temperature measurement (T).
        // (If temperature is stable, you can do one temperature measurement for a number of pressure measurements.)
        // Function returns 1 if successful, 0 if failure.

        status = pressure.getPressure(P,T);
        Serial.println("completed");
        return P;
        
     }
    
    }
  } 
}


/* setup loop */
void setup() {
  
  dht.begin();
  Serial.begin(115200);

  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    // no point in carrying on, so do nothing forevermore:
    while(true);
  }
  
}


/* main loop */

void loop() {

  Ethernet.begin(mac);

  Serial.println("New measurements");

  rh = dht.readHumidity();
  t = dht.readTemperature();
  dew = t - (100-rh)/5;
  light = 1024 - analogRead(light_pin);
  float P = getPressure();
  data = "data=" + String(t)+ "," + String(dew) + "," + String(rh) + "," + String(P) + "," + String(light);
  Serial.println(data);

  if (client.connect(serverName, 80)) {
    Serial.println("Connected");
    Serial.print("Sending data... ");
    client.println("POST /testipenkki/saasema2.0/add.php HTTP/1.1");
    client.println("Host: www.nakkim.org");
    client.println("Content-Type: application/x-www-form-urlencoded");
    client.print("Content-Length: ");
    client.println(data.length());
    client.println("");
    client.println(data);
    Serial.println("data sent");
    Serial.println(data);
    Serial.println("");
  }   
  
  if (client.available()) {
    char c = client.read();
    Serial.print(c);
  }

  if(!client.connected()){
    Serial.println("Connection failed, disconnecting.");
    Serial.print("Error code: ");
    Serial.println((client.connect(serverName, 80)));
    Serial.println();
    client.stop();
  }
  
  delay(300000);

}



