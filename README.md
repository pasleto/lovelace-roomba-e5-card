<h1 align="center">
    Lovelace iRobot Roomba E5 Card
</h1>

HA Lovelace Card for iRobot Roomba e5 Vacuum Cleaner leveraging the local rest980 API

Please refer my [roomba-e5-setup] GitHub Repository for detailed instructions for using this card.

<p align="center">
    <img src="https://raw.githubusercontent.com/pasleto/hassio-roomba-e5-setup/master/example/card_example.png" alt="Idle"/>
</p>

## Setup

Install using [HACS][hacs] using the following custom plugin repository ```https://github.com/pasleto/lovelace-roomba-e5-card```
```yaml
resources:
  - url: /hacsfiles/lovelace-roomba-e5-card/lovelace-roomba-e5-card.js
    type: module
```

OR 

Manually add [lovelace-roomba-e5-card.js] and [vacuum.png]
to your `<config>/www/` folder and add the following to your `ui-lovelace.yaml` file:
```yaml
resources:
  - type: module
    url: /local/lovelace-roomba-e5-card.js
```



README update coming soon ...




[roomba-e5-setup]: https://github.com/pasleto/hassio-roomba-e5-setup
[hacs]: https://github.com/custom-components/hacs
[lovelace-roomba-e5-card.js]: https://raw.githubusercontent.com/pasleto/lovelace-roomba-e5-card/master/dist/lovelace-roomba-e5-card.js
[vacuum.png]: https://raw.githubusercontent.com/pasleto/lovelace-roomba-e5-card/master/dist/vacuum.png