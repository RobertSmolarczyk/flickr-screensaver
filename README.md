This little tool allows you to download a bundle of images from flickr.

##Installation

Create a directory where the images should be saved (I placed a folder named ``Flickr-Screensaver`` in my Pictures directory).

Checkout the project somewhere on your disc and run ``npm install`` (for this you need [node.js](http://nodejs.org/)).

Then rename the ``config_example.json`` to ``config.json`` and replace the given parameters in the file.

After that just run the script with ``node .``

Don't be scared. The first time you run the script it will download some flickr API stuff (fetching method signatures).

If it works, you will see some success messages like this:

```
The file 15117600501.jpg was saved!
The file 14933904919.jpg was saved!
The file 14933945550.jpg was saved!
The file 15117602481.jpg was saved!
[...]
```

