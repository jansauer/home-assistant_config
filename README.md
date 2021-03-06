# 🏡 My Home Assistant Config

My [Home Assistant](https://www.home-assistant.io/) Config.

## Getting started

```
$ gunzip hassos_rpi3-1.13.img.gz
$ diskutil list
$ diskutil unmountDisk /dev/disk2
$ sudo dd bs=1M if=hassos_rpi3-1.13.img of=/dev/rdisk2
$ diskutil eject /dev/disk2

# insert and take an nap until it is started up 💤
open http://hassio.local:8123/

# flush my config
$ scp -r config/* hassio:/config

# pull backups
$ scp -r hassio:/backup ./
```

## Addons

* [SSH server](https://www.home-assistant.io/addons/ssh/)
* [Duck DNS page](https://www.home-assistant.io/addons/duckdns/)

## Third Party Account

* [Dark Sky API](https://darksky.net/dev)

## Other good examples

- https://github.com/Danielhiversen/home-assistant_config
- https://github.com/arsaboo/homeassistant-config
- https://github.com/JamesMcCarthy79/Home-Assistant-Config
- https://github.com/stanvx/Home-Assistant-Configuration
- https://github.com/brianjking/homeassistant-config
- https://github.com/nickmomrik/home-assistant-config
