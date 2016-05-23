/**
 * Converts Pictures from one color model to another
 */

/**
 * @param picture
 *            Array
 * @return
 */
function rgbToYcbcr(picture) {

	var ycbcrPicture = new Array((picture.length * 3) / 4);
	for (var i = 0, j = 0; i < picture.length; i += 4, j += 3) {

		var r = picture[i];
		var g = picture[i + 1];
		var b = picture[i + 2];

		// Set y-value
		ycbcrPicture[j] = Math.round(16 + (1 / 256)
				* (65.738 * r + 129.057 * g + 25.064 * b));

		// Set cb-value
		ycbcrPicture[j + 1] = Math.round(128 + (1 / 256)
				* (-37.945 * r + (-74.494) * g + 112.439 * b));

		// Set cr-value
		ycbcrPicture[j + 2] = Math.round(128 + (1 / 256)
				* (112.439 * r + (-94.154) * g + (-18.285) * b));
	}
	return arrayToInt8(ycbcrPicture);
};

function ycbcrToRgb(picture) {
	
//	var length = picture.length;
//	var arrayLength = ((length*4)/3);
	
	
	var rgbPicture = new Array((picture.length * 4) / 3);

	for (var i = 0, j = 0; i < picture.length; i += 3, j += 4) {

		var yanteil = 298.082 * (picture[i] - 16);
		var cb = picture[i + 1];
		var cr = picture[i + 2];

		// Set red-value
		rgbPicture[j] = Math
				.round((1 / 256) * (yanteil + 408.583 * (cr - 128)));

		// Set green-value
		rgbPicture[j + 1] = Math
				.round((1 / 256)
						* (yanteil + (-100.291) * (cb - 128) + (-208.120)
								* (cr - 128)));

		// Set blue-value
		rgbPicture[j + 2] = Math.round((1 / 256)
				* (yanteil + 516.411 * (cb - 128)));

		// Set alpha to 255
		rgbPicture[j + 3] = 255;

	}
	return arrayToInt8(rgbPicture);
};

/**
 * Builds a matrix with the y-portion of the image from a canvas data array
 * (already transformed to YcBcR-space)
 * 
 * @param pictureArray
 *            canvas data array
 * @param rows
 *            rows of the result matrix (from original picture)
 * @param columns
 *            columns of the result matrix (from original picture)
 * @return matrix with y-values
 */
function getYPortion(pictureArray, rows, columns) {

	var len = pictureArray.length;
	var result = new Uint8ClampedArray(len/3);
	for (var i = 0, j = 0; i < len; i += 3, j++) {
		result[j] = pictureArray[i];
	}
	var resultMatrix = arrayToMatrix(result, rows, columns);
	return resultMatrix;
};

/**
 * Builds a matrix with the cb-portion of the image from a canvas data array
 * (already transformed to YcBcR-space)
 * 
 * @param pictureArray
 *            canvas data array
 * @param rows
 *            rows of the result matrix (from original picture)
 * @param columns
 *            columns of the result matrix (from original picture)
 * @return matrix with cb-values
 */
function getCbPortion(pictureArray, rows, columns) {

	var len = pictureArray.length;
	var result = new Uint8ClampedArray(len/3);
	for (var i = 1, j = 0; i < len; i += 3, j++) {
		result[j] = pictureArray[i];
	}
	var resultMatrix = arrayToMatrix(result, rows, columns);
	return resultMatrix;
};

/**
 * Builds a matrix with the cr-portion of the image from a canvas data array
 * (already transformed to YcBcR-space)
 * 
 * @param pictureArray
 *            canvas data array
 * @param rows
 *            rows of the result matrix (from original picture)
 * @param columns
 *            columns of the result matrix (from original picture)
 * @return matrix with cr-values
 */
function getCrPortion(pictureArray, rows, columns) {

	var len = pictureArray.length;
	var result = new Uint8ClampedArray(len/3);
	for (var i = 2, j = 0; i < len; i += 3, j++) {
		result[j] = pictureArray[i];
	}
	var resultMatrix = arrayToMatrix(result, rows, columns);
	return resultMatrix;
};

/**
 * Merges three colourspace-matrices to one vector
 * 
 * @param ymatrix
 * @param cbmatrix
 * @param crmatrix
 */
function mergeColorMatrices(ymatrix, cbmatrix, crmatrix) {
		
		// convert matrices to array
		ymatrix = matrixToArray(ymatrix);
		cbmatrix = matrixToArray(cbmatrix);
		crmatrix = matrixToArray(crmatrix);
		
		var resultVector = new Array(ymatrix.length*3);
		
		for(var i = 0, j = 0; i < resultVector.length; i++) {
			
			if(i % 3 == 0) {
				resultVector[i] = ymatrix[j];
			}
			
			if(i % 3 == 1) {
				resultVector[i] = cbmatrix[j];
			}
			
			if(i % 3 == 2) {
				resultVector[i] = crmatrix[j];
				j++;
			}			
		}
		
		return resultVector;
}

function resizeImage(img, width, length) {

var canvas = document.createElement('canvas');
canvas.id = "canni";
canvas.width = width;
canvas.height = length;

var ctx = canvas.getContext('2d');
ctx.drawImage(img, 0, 0, width, length);



var compressed = new Image();
compressed.width = width;
compressed.height = length;
var dataURL = canvas.toDataURL();

compressed.src = dataURL;
return canvas;
}

/**
 * Returns the canvas image data-representation of an image object
 * 
 * @param img image
 * @return imageData-Array of image
 */

function getCanvasImageData(img) {
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);

	var imageData = ctx.getImageData(0, 0, img.width, img.height);

	return imageData;
}

 

/**
 * 
 * @param imageData imageData Object
 * @returns compressed compressed imageData Object
 */
function compressImage(imageData, threshold) {
	

	// get height + width and remove values from array
	var height = imageData.height;
	var width = imageData.width;;
	 
	var imageDataArray = imageData.data;

	var imageDataArrayTransformed = rgbToYcbcr(imageDataArray);
	
	
	var yMatrix = getYPortion(imageDataArrayTransformed, height, width);

	var cbMatrix = getCbPortion(imageDataArrayTransformed, height, width);
	var crMatrix = getCrPortion(imageDataArrayTransformed, height, width);
	
	
	
	
//	var z0 = performance.now();
//	var dwtY11 = dwt2D(yMatrix, 4, 1);
//	var z11 = performance.now();
//	var dwtY = dwt2Dsplit(yMatrix, 4, 1, 128);
	
//	var z1 = performance.now();
//	var dwtLustig = dwt2dim(yMatrix, "galle", 0);
	var z2 = performance.now();
	
	var dwtY = dwt2dimSplit(yMatrix, "galle", 0, 128);
	var z3 = performance.now();
	
//	var dwtCb = dwt2D(cbMatrix, 4, 4);
	var dwtCb = dwt2dimSplit(cbMatrix, "galle", 0, 128);
	var z4 = performance.now();
	
//	var dwtCr = dwt2D(crMatrix, 4, 4);
	var dwtCr = dwt2dimSplit(crMatrix, "galle", 0, 128);
	var z5 = performance.now();
//	console.log("dwt alte variante: " +(z11-z0));
//	console.log("dwt tiling: " +(z1-z11));
//	console.log("dwt ohne qmf: " +(z2-z1));
//	console.log("dwt split ohne qmf: " + (z3-z2));
	
	console.log("DWT1 split: " + (z3-z2));
	console.log("DWT2 split: " + (z4-z3));
	console.log("DWT3 split: " + (z5-z4));
	

	
	var dwtYArray = matrixToArray(dwtY);
	var dwtCbArray = matrixToArray(dwtCb);
	var dwtCrArray = matrixToArray(dwtCr);
	
	
	var maxValue = numeric.norminf(dwtY);
	var maxValue2 = numeric.norminf(dwtCb);
	var maxValue3 = numeric.norminf(dwtCr);
	
	
	var y0 = performance.now();
	var compressedY = compressMatrix(dwtYArray, threshold);
	var sizeOfY = getSizeOfMatrix(compressedY, 16);
	var y1 = performance.now();
	
	var compressedYLustig = compressHigh(dwtY, threshold);

	var y2 = performance.now();
	
	var compressedY3 = createSparseMatrix(dwtY, threshold);
	var sizeOfY3 = getSizeOfMatrix(compressedY3, 16);
	
	var y3 = performance.now();
	
	console.log("compression alt: " + (y1-y0));
	console.log("compression neu: " + (y2-y1));
	console.log("compression sparse: " +(y3-y2));
	debugger;
	var compressedCb = compressMatrix(dwtCbArray, threshold-1);
	var compressedCr = compressMatrix(dwtCrArray, threshold-1);
	
	
	// compressMatrices
	
	var compressedYMatrix0 = compressMatrix(dwtY, threshold);
	var compressedCbMatrix0 =compressMatrix(dwtCb, threshold);
	var compressedCrMatrix0 = compressMatrix(dwtCr, threshold);
	
	var compressedYMatrix = matrixToInt16(compressedYMatrix0);
	var compressedCbMatrix = matrixToInt16(compressedCbMatrix0);
	var compressedCrMatrix = matrixToInt16(compressedCrMatrix0);
	
	/*
	
	var compressedY = compressMatrix(dwtY, threshold);
	var compressedCb = compressMatrix(dwtCb, threshold-3);
	var compressedCr = compressMatrix(dwtCr, threshold-3);
	
	
	compressedY = matrixToArray(compressedY);
	compressedCb = matrixToArray(compressedCb);
	compressedCr = matrixToArray(compressedCr);
	*/
	
	
	

	
	
	var sizeY = getSizeOfMatrix(compressedY, 16);
	var sizeCb = getSizeOfMatrix(compressedCb, 16);
	var sizeCr = getSizeOfMatrix(compressedCr, 16);
	
	
	
	
	var compressedMatrix = new Array(7);
	
	
	compressedMatrix[0] = arrayToInt16(compressedY);
	compressedMatrix[1] = arrayToInt16(compressedCb);
	compressedMatrix[2] = arrayToInt16(compressedCr);
	
	
	compressedMatrix[3] = dwtCb[0].length;
	compressedMatrix[4] = dwtCb.length;
	compressedMatrix[5] = width; 
	compressedMatrix[6] = height;
	
	compressedMatrix.push(compressedYMatrix);
	compressedMatrix.push(compressedCbMatrix);
	compressedMatrix.push(compressedCrMatrix);
	
	
	// Insert length of color parts at the end of the array
	/*

	var yLength = compressedY.length;
	var CbLength = compressedCb.length;
	var CrLength = compressedCr.length;
	
	
	

	
	// push padded size at the end of the array
	compressedMatrix.push(dwtCb[0].length);
	compressedMatrix.push(dwtCb.length);
	
	
	// Insert width+height at the end of the array
	compressedMatrix.push(width);
	compressedMatrix.push(height);
	
	if(yLength < 32768 ) {
		compressedMatrix.push(yLength);
	}
	
	//value is to big for int16 => split into several values
	
	else{
		var parts = parseInt(yLength/32767)
		compressedMatrix.push(parts);
		compressedMatrix.push(yLength % 32767);
	
	}
	
	
	if(CbLength < 32768 ) {
		compressedMatrix.push(CbLength);
	}
	
	//value is to big for int16 => split into several values
	
	else{
		var parts = parseInt(CbLength/32767)
		compressedMatrix.push(parts);
		compressedMatrix.push(CbLength % 32767);
	
	}
	
	if(CrLength < 32768 ) {
		compressedMatrix.push(CrLength);
	}
	
	//value is to big for int16 => split into several values
	
	else{
		var parts = parseInt(CrLength/32767)
		compressedMatrix.push(parts);
		compressedMatrix.push(CrLength % 32767);
	
	}
	*/
	

	

	
	return compressedMatrix;
	
	
}

/**
 * Decompresses Image 
 * 
 * @param compressedMatrix compressed Matrix, least values containing width, height + padded width,height
 * @param threshold	threshold value for regarding values as zeros
 * 			(e.g. 10 => all values <=  +-10 are regarded as zeros)
 * 
 * @returns {Uint8ClampedArray} decompressed colorArray for canvas
 */
function decompressImage(compressedMatrix, threshold) {
	
	

	

	/*
	var startPositionCb;
	var startPositionCr;
	debugger;
	
	if(!(Array.isArray(compressedMatrix[length-3]))) {
		startPositionCb = compressedMatrix[length-3];
	} else {
		startPositionCb = compressedMatrix[length-3][0]*32767 + compressedMatrix[length-3][1];
	}
	
	
	// var startPositionCb = compressedArray[length-3];
	
	if(!(Array.isArray(compressedMatrix[length-2]))) {
		var startPositionCr = startPositionCb + compressedMatrix[length-2];
	} else {
		var startPositionCr = startPositionCb + compressedMatrix[length-2][0]*32767 + compressedMatrix[length-2][1];
	}
	
	// var startPositionCr = compressedArray[length-3]+compressedArray[length-2];
	

	// extract color-parts of compressedArray
	
	var compressedYPart = compressedMatrix.subarray(0, startPositionCb);
	var compressedCbPart = compressedMatrix.subarray(startPositionCb, startPositionCr);
	var compressedCrPart = compressedMatrix.subarray(startPositionCr, length-3);
	
	
	
	
	var length = compressedMatrix.length-4;
	*/
	
	// get height + width and remove values from array

	
	var width = compressedMatrix[5];
	var height = compressedMatrix[6];
	
	var paddedWidth = compressedMatrix[3]
	var paddedHeight = compressedMatrix[4];
	
	
	var t0=performance.now();
	var decompressedY = decompressMatrix(compressedMatrix[0]);
	
	
	
	var decompressedCb = decompressMatrix(compressedMatrix[1]);
	var decompressedCr = decompressMatrix(compressedMatrix[2]);
	var t1 = performance.now();
	console.log("Decompression of matrices: "+ (t1-t0));
	
	
	var compressedYPart = compressedMatrix[7];
	var compressedCbPart = compressedMatrix[8];
	var compressedCrPart = compressedMatrix[9];
	
	var f0 = performance.now();
	var decompressedYPart = decompressMatrix(compressedYPart);
	var f1 = performance.now();
	var decompressedYPart2 = decompressMatrixFill(compressedYPart, paddedHeight, paddedWidth);
	var f2 = performance.now();
	
	console.log("decompress normal: " + (f1-f0));
	console.log("decompress fill: " + (f2-f1));
	debugger;
	
	

	

	var z0 = performance.now();
//	 var idwtY = numeric.round(idwt2D(decompressedYPart, 4, 4));
	var idwtY = numeric.round(idwt2Dsplit(decompressedYPart, 4, 4))
	
	idwtY = unpadMatrix(idwtY, height, width);
	var z1 = performance.now();
	
	
//	var idwtCb = numeric.round( idwt2D(decompressedCbPart, 4, 4));
	var idwtCb = numeric.round(idwt2Dsplit(decompressedCbPart, 4, 4))
	idwtCb = unpadMatrix(idwtCb, height, width);
	
	var z2 = performance.now();
	
//	var idwtCr = numeric.round((idwt2D(decompressedCrPart, 4, 4)));
	var idwtCr = numeric.round(idwt2Dsplit(decompressedCrPart, 4, 4))
	idwtCr = unpadMatrix(idwtCr, height, width);
	var z3 = performance.now();
	
	console.log("iDWT1: " +(z1-z0));
	console.log("iDWT2: " +(z2-z1));
	console.log("iDWT3: " +(z3-z2));

	
	// var colorArray = mergeColorMatrices(idwtY, idwtCb, idwtCr);
	
	var p0 = performance.now();
	
	var colorArray = mergeColorMatrices(idwtY, idwtCb, idwtCr);
	
	colorArray = ycbcrToRgb(colorArray);
	
	var p1 = performance.now();
	
	console.log("merging+ to rgb: " +(p1-p0));
	
	return colorArray;
}