#!/usr/bin/python3

#import board
#import digitalio
import logging
import busio
import time
import requests
import Adafruit_DHT
import RPi.GPIO as GPIO

from bmp180 import bmp180
from logging.handlers import RotatingFileHandler

dht_sensor = Adafruit_DHT.DHT22
dht_pin = 4
ldr_pin = 12

filepath = '/home/pi/Desktop/weatherstation/'
file = 'log'

logging.basicConfig(handlers=[RotatingFileHandler(filename=filepath+file, mode='w', maxBytes=512000, backupCount=4)],
                    format='%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s',
                    datefmt='%H:%M:%S',
                    level=logging.DEBUG)


def measureDHT():
    """ Get temperature and humidity values from DHT22 sensor """

    humidity, temperature = Adafruit_DHT.read_retry(dht_sensor, dht_pin)
    if humidity is not None and temperature is not None:
        return [temperature, humidity]
    else:
        return false

def measureBMP180():
    """ Get pressure observations from BMP180 sensor """
    pressure = bmp180(0x77).get_pressure()/100

    return pressure

def measureLDR(pin):

    GPIO.setmode(GPIO.BOARD)
    
    count = 0    
    #Output on the pin for
    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, GPIO.LOW)
    time.sleep(0.1)
    
    #Change the pin back to input
    GPIO.setup(pin, GPIO.IN)
    
    #Count until the pin goes high
    while (GPIO.input(pin) == GPIO.LOW):
        count += 1
        if(count >= 10000):
            break
        
    return  (( (10000-count)/100 ) / 100) * 100

    
def postData(values):
    """ Send data to database """

    response = requests.post('https://arduino-weatherstation.now.sh/data',
                             json={
                                 'temperature':'{0:0.2f}'.format(values[0]),
                                 'humidity':'{0:0.2f}'.format(values[1]),
                                 'pressure':'{0:0.2f}'.format(values[2]),
                                 'light':'{0:0.2f}'.format(values[3])
                             })
    
    logging.info(response.json())
    print(response.json())


if __name__ == '__main__':

    observations = measureDHT()
    observations.append(measureBMP180())
    observations.append(measureLDR(ldr_pin))

    logging.info("Measurements:"+str(observations))
    print("Measurements:"+str(observations))
    postData(observations)
