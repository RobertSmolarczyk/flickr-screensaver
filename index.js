var fs            = require('fs'),
	request       = require('request'),
	forEachAsync  = require('forEachAsync').forEachAsync,
	Flickr        = require('flickrapi'),
	options       = require('./config.json'),
    flickrOptions = {
      api_key: options.flickr.api_key,
      secret: options.flickr.secret
    };

/**
 * Constructor for FlickrScreensaver
 * @constructor
 */
function FlickrScreensaver() {
	this.images = [];

	//Group Id
	this.group_id  = options.flickr.group_id || '63277308@N00';

	//Place where the Screensaver images will be saved
	this.directory = options.targetDiretory;

	//Global Options
	this.options = {
		cleanDirectory: options.cleanDirectory || false,
		limit: options.limit || 100
	};
}

/**
 * Builder for the Screensaver tool. Starts delete and save methods
 */
FlickrScreensaver.prototype.build = function() {
	var self     = this,
		options  = this.options;

	if(!this.directory) {
		console.error('ERROR: Missing parameter "targetDiretory" in config.json');
		return false;
	}

    fs.exists(this.directory, function(exists) {
        if(exists) {
            Flickr.tokenOnly(flickrOptions, function(error, flickr) {
                flickr.groups.pools.getPhotos({
                    group_id: self.group_id,
                    per_page: options.limit,
                    extras: ['url_n', 'url_z', 'url_c', 'url_l']
                }, function(err, result) {
                    var images    = result.photos.photo || null;

                    if(images) {
                        self.images = images;

                        if(options.cleanDirectory) {
                            self.cleanDirectory();
                        }

                        self.downloadImages();
                    }
                });
            });
        } else {
            console.error('ERROR: The directory ' +  this.directory + ' doesn\'t exist!');
        }
    });

};

/**
 * Runs through the list and looks for given image
 */
FlickrScreensaver.prototype.downloadImages = function() {
	var self = this,
		images = this.images;

	forEachAsync(images, function(next, image, index){

		var imagePath = null;

		if(image.url_l) {
			imagePath = image.url_l;
		} else if(image.url_c) {
			imagePath = image.url_c;
		} else if(image.url_z) {
			imagePath = image.url_z;
		} else if(image.url_n) {
			imagePath = image.url_n;
		}
       	
       	if(imagePath) {
       		self.saveImage(imagePath, image.id, next);
       	}
     });
};

/**
 *
 *
 * @param url {string}
 * @param fileName {string}
 * @param cb {function}
 */
FlickrScreensaver.prototype.saveImage = function(url, fileName, cb) {
	var target = this.directory;

	if(!fileName) {
		return;
	}

	request.get({url: url, encoding: 'binary'}, function (err, response, body) {
		fs.writeFile(target + fileName + '.jpg', body, 'binary', function(err) {
		if(err)
			console.log(err);
		else
			console.log('The file ' + fileName + '.jpg was saved!');
		});

		//Run next
		cb();
	});
};

/**
 * Delets all elements in the directory
 */
FlickrScreensaver.prototype.cleanDirectory = function() {
	var target = this.directory;

	fs.readdir(target, function(err, files) {
		if(files.length) {
		files.forEach(function(file){
			fs.unlink(target + file, function (err) {
				if (err) throw err;
				console.log(file + ' was deleted');
			});
		});
		}
	});
};

/* Let's start */
var screensaver = new FlickrScreensaver();
    screensaver.build();