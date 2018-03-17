function _printPageHeader(doc, date) {
	doc.setFontSize(32);
	doc.text(4, 12, 'Data McDataface');
	doc.setFontSize(12);
	var dy = 5;
	texts = ['Exported', 'on ' + new Date().toDateString(),
		'Data updated as of', date.toDateString(),
		'', 'For inquiries', 'info@geogecko.com'];
	texts.forEach(function (text, index) {
		doc.text(text, 205, 6 + index * dy, 'right');
	})
}

function _printFilter(doc, filter, x, y) {
	doc.setFontSize(8);
	doc.text(x, y, 'Filters Applied');
	doc.setFontSize(12);
	doc.text(x, y + 5, filter.name);
}

function makeRectangularCanvas(oldCanvas, callback) {
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	var imageObj = new Image();
	dx = oldCanvas.width - oldCanvas.height;

	canvas.width = oldCanvas.height;
	canvas.height = oldCanvas.height;

	imageObj.src = oldCanvas.toDataURL('image/png');
	imageObj.onload = function () {
		// draw cropped image
		var sourceX = dx / 2;
		var sourceY = 0;
		var sourceWidth = oldCanvas.width - dx;
		var sourceHeight = oldCanvas.height;
		var destWidth = sourceWidth;
		var destHeight = sourceHeight;
		var destX = canvas.width / 2 - destWidth / 2;
		var destY = canvas.height / 2 - destHeight / 2;

		context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

		callback(canvas);
	};
}


function _makeMapImage(map,transx,transy,scalex,scaley,sw,sh, callback) { 
	// Generate map image first
	leafletImage(map, function (err, canvas) { 
		var svg = document.querySelector('.leaflet-pane > svg');
		console.log(svg)
		var context = canvas.getContext('2d');
		// Make png from SVG D3 map
                deduct = 0;
                if (scalex  < 1)
                   {
                    deduct = -50;
                   }   
		svgAsPngUri(svg, {left:0,top:deduct}, function (uri) {
			var drawing = new Image();
			drawing.src = uri;top
			drawing.onload = function () { 
                                context.scale(parseFloat(scalex),parseFloat(scaley));
                                if (scalex  < 1)
                                   {
                                    context.drawImage(drawing,0,0,sw,sh,(transx*(1/scalex))-35, (transy*(1/scaley))-60,sw,sh)
                                   }
                                else 
                                   {
                                    context.drawImage(drawing,0,0,sw,sh,(transx*(1/scalex))+48, (transy*(1/scaley)),sw,sh)
                                   }
//                                  context.drawImage(drawing,(transx*(1/scalex)), (transy*(1/scaley)));
//                                context.drawImage(drawing, (parseFloat(canvas.width)-parseFloat(sw))/2, (parseFloat(canvas.height)-parseFloat(sh))/2)
//                                context.drawImage(drawing, (transx*(1/scalex)), (transy*(1/scaley)),parseFloat(sw),parseFloat(sh),(transx*(1/scalex)), (transy*(1/scaley)),parseFloat(sw),parseFloat(sh));
//                                context.drawImage(drawing, parseFloat(canvas.width)/2, parseFloat(canvas.height)/2);
//                                context.drawImage(drawing, 0,0,parseFloat(canvas.width),parseFloat(canvas.height),(transx*(1/scalex)), (transy*(1/scaley)),parseFloat(sw),parseFloat(sh));
				var imageEl = document.createElement('image');
				imageEl.style.position = 'absolute';
				imageEl.style.display = 'block';
				imageEl.style.width = '100%';
				imageEl.style.height = '100%';
				imageEl.style.top = 0;
				imageEl.style.left = 0;
				imageEl.style.zIndex = -10000;
				imageEl.setAttribute('src', canvas.toDataURL('image/png'));
				document.body.appendChild(imageEl);
				makeRectangularCanvas(canvas, function (canvas) {
					var legend = document.querySelector('.menu-panel > svg');
					svgAsPngUri(legend, {}, function (legendUri) {
						callback(canvas, legendUri);
					});
				});
			};
		});
	});
}

var right = 0;
var left = 0;

function generatePdf(map, dataset, filters, lastModified,transx,transy, scalex,scaley,sw,sh, callback) {
	var IMAGE_SIZE = 170;
	var DOC_WIDTH = 210;
    var img1;
    var img2;
    right = $(".right-panel").css("right");
    left = $(".left-panel").css("left");
    $(".right-panel").css("right",0)
    $(".left-panel").css("left",0)
    var toPrint = document.getElementsByClassName('right-panel');
    var toPrint1 = document.getElementsByClassName('left-panel');
    html2canvas(toPrint, {
        useCORS: true,
        allowTaint: true,
//        transform: scale(2, 2),
        onrendered: function( canvas ) {
           var ctx = canvas.getContext('2d');
           ctx.webkitImageSmoothingEnabled = false;
           ctx.mozImageSmoothingEnabled = false;
           ctx.imageSmoothingEnabled = false;
            img1 = canvas.toDataURL('image/png');
            $(".right-panel").css("right",right)
        }
    });
    html2canvas(toPrint1, {
        useCORS: true,
        allowTaint: true,
//        transform: scale(2, 2),
        onrendered: function( canvas ) {
           var ctx = canvas.getContext('2d');
           ctx.webkitImageSmoothingEnabled = false;
           ctx.mozImageSmoothingEnabled = false;
           ctx.imageSmoothingEnabled = false;
           img2 = canvas.toDataURL('image/png');
           $(".left-panel").css("left",left)

        }
    });


    _makeMapImage(map,transx,transy,scalex,scaley,sw,sh, function (canvas, legendUri) {
		var doc = new jsPDF();
		var ratio = canvas.height / canvas.width;

		_printPageHeader(doc, lastModified);

		var image = canvas.toDataURL('image/png');
		var x = (DOC_WIDTH - IMAGE_SIZE)/2;
		var y = 50;
		var width = IMAGE_SIZE;
		var height = IMAGE_SIZE * ratio;
		doc.addImage(image, 'PNG', x, y, width, height, 'map', 'fast');

		filters.forEach(function (filter, index) {
			_printFilter(doc, filter, 5 + index * 50, 230);
		});

		doc.addPage();
        doc.addImage(img1, 'PNG', x, y, width/2 , height, 'legend', 'fast');
        doc.addPage();
        doc.addImage(img2, 'PNG', x, y, width , height*2, 'legend1', 'fast');


		/*var columns = [
			{ title: 'District Name', dataKey: 'District' },
			{ title: 'Actor Name', dataKey: 'Actor Name' },
			{ title: 'Settlement Name', dataKey: 'Settlement Name' },
			{ title: 'Sector', dataKey: 'Sector' },
		];

		doc.autoTable(columns, dataset, {
			margin: { top: 60 },
			addPageContent: function (data) {
				_printPageHeader(doc, lastModified);
			}
		});
*/
		callback();
		doc.save();
	})
}

