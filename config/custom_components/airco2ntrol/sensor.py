"""
Home Assistant support for the TFA Dostmann: CO2 Monitor AIRCO2NTROL MINI sensor.

Date:     2018-12-04
Homepage: https://github.com/jansauer/home-assistant_config/tree/master/config/custom_components/airco2ntrol
Author:   Jan Sauer

"""
import fcntl
import logging

from homeassistant.components.sensor import PLATFORM_SCHEMA
from homeassistant.const import (DEVICE_CLASS_TEMPERATURE, TEMP_CELSIUS)
from homeassistant.helpers.entity import Entity

_LOGGER = logging.getLogger(__name__)

DEFAULT_DEVICE = '/dev/hidraw0'

def setup_platform(hass, config, add_entities, discovery_info=None):
    """Set up the AirCO2ntrol component."""
    state = AirCO2ntrolReader(DEFAULT_DEVICE)
    add_entities([
      AirCO2ntrolCarbonDioxideSensor(state),
      AirCO2ntrolTemperatureSensor(state)
    ])
    return True

class AirCO2ntrolReader():
    """A AirCO2ntrol sensor reader."""

    def __init__(self, device):
        """Initialize the reader."""
        self.carbonDioxide = None
        self.temperature = None
        self._fp = open(device, 'ab+', 0)
        key = [0xc4, 0xc6, 0xc0, 0x92, 0x40, 0x23, 0xdc, 0x96]
        set_report = bin(0x00) + "".join(chr(e) for e in key)
        HIDIOCSFEATURE_9 = 0xC0094806
        fcntl.ioctl(self._fp, HIDIOCSFEATURE_9, bytearray.fromhex('00 c4 c6 c0 92 40 23 dc 96'))
        
    def update(self):
        """Poll latest sensor data."""
        for retry in range(10):              
            values = self.__poll()
            if 0x42 in values or 0x50 in values:
                if 0x42 in values:
                    self.temperature = f'{(values[0x42]/16.0-273.15):.2f}'
                if 0x50 in values:
                    self.carbonDioxide = values[0x50]
                break
    
    def __poll(self):
        data = list(e for e in self._fp.read(8))
        # print(data)
        key = [0xc4, 0xc6, 0xc0, 0x92, 0x40, 0x23, 0xdc, 0x96]
        decrypted = self.__decrypt(key, data)
        # print(decrypted)
        if decrypted[4] != 0x0d or (sum(decrypted[:3]) & 0xff) != decrypted[3]:
            _LOGGER.info("Checksum error")
        else:
            op = decrypted[0]
            val = decrypted[1] << 8 | decrypted[2]
            return {op: val}

    def __decrypt(self, key, data):
        cstate = [0x48,  0x74,  0x65,  0x6D,  0x70,  0x39,  0x39,  0x65]
        shuffle = [2, 4, 0, 7, 1, 6, 5, 3]
        phase1 = [0] * 8
        for i, o in enumerate(shuffle):
            phase1[o] = data[i]
        phase2 = [0] * 8
        for i in range(8):
            phase2[i] = phase1[i] ^ key[i]
        phase3 = [0] * 8
        for i in range(8):
            phase3[i] = ( (phase2[i] >> 3) | (phase2[ (i-1+8)%8 ] << 5) ) & 0xff
        ctmp = [0] * 8
        for i in range(8):
            ctmp[i] = ( (cstate[i] >> 4) | (cstate[i]<<4) ) & 0xff
        out = [0] * 8
        for i in range(8):
            out[i] = (0x100 + phase3[i] - ctmp[i]) & 0xff	
        return out

class AirCO2ntrolCarbonDioxideSensor(Entity):
    """A AirCO2ntrol carbon dioxide sensor."""

    def __init__(self, state):
        """Initialize the sensor."""
        self._state = state

    @property
    def name(self):
        """Return the name of the sensor."""
        return 'AirCO2ntrol Carbon Dioxide'

    @property
    def state(self):
        """Return the state of the sensor."""
        return self._state.carbonDioxide

    @property
    def unit_of_measurement(self):
        """Return the units of measurement."""
        return "ppm"

    @property
    def device_class(self):
        """Return the class of this sensor."""
        return 'co2'

    @property
    def icon(self):
        """Return the icon of device based on its type."""
        return 'mdi:molecule-co2'

    def update(self):
        """Get the latest data and updates the state."""
        _LOGGER.debug("Updating airco2ntrol for carbon dioxide")
        self._state.update()
      
class AirCO2ntrolTemperatureSensor(Entity):
    """A AirCO2ntrol temperature sensor."""

    def __init__(self, state):
        """Initialize the sensor."""
        self._state = state

    @property
    def name(self):
        """Return the name of the sensor."""
        return 'AirCO2ntrol Temperature'

    @property
    def state(self):
        """Return the state of the sensor."""
        return self._state.temperature

    @property
    def unit_of_measurement(self):
        """Return the units of measurement."""
        return TEMP_CELSIUS

    @property
    def device_class(self):
        """Return the class of this sensor."""
        return DEVICE_CLASS_TEMPERATURE

    @property
    def icon(self):
        """Return the icon of device based on its type."""
        return 'mdi:thermometer'

    def update(self):
        """Get the latest data and updates the state."""
        _LOGGER.debug("Updating airco2ntrol for temperature")
        self._state.update()
