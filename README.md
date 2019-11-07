# node-red-contrib-valetudo

[Valetudo](https://github.com/Hypfer/Valetudo) is a self-contained control webinterface for rooted xiaomi vacuum robots.

## valetudo-map-png

A node to convert Valetudo map_data (JSON string) to a png image which can be send to a dashboard template node.

Input should be an mqtt node from topic `valetudo/rockrobo/map_data`.

Output is an png image as buffer which can be send (base64 encoded) to a dashboard template node.

Sample flow:
![sample flow](https://raw.githubusercontent.com/alexkn/node-red-contrib-valetudo/master/docs/map-png-sample-flow.png)

HTML for template node: 
```HTML
<div>
    <img src="data:image/png;base64,{{msg.payload}}" style="width: 100%;height: auto" />
</div>
```

## valetudo-parse-binmap

A node to convert Valetudo binary map data to a JSON string which can be send to the map-png node.

Binary map data is currently only sent by [Valetudo RE](https://github.com/rand256/valetudo).