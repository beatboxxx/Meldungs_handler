/**
 * Class responsibility: Provide methods for discrete wavelet transforms for
 * signals having length that is an even power of two.
 */


/**
 * forwarddwt (math-lib)
 * 
 * @param signalVector signal vector with length = even power of two
 * @param order order of the Daubechies wavelet
 * @param cScale coarsest scale
 * @return the wavelet transform
 */
/*
function forwardDwt(signalVector, order, cScale) {
	
	var n = signalVector.length;
	var dWT = deepCopyVector(signalVector);
	var log2n = parseInt((math.log(n)/math.log(2)));
	var iterations = log2n - cScale;
	var subLength = n;
	var H = getLowPass(order);
	var G = getHighPass(H);
	
	for (var i = 0; i < iterations; i++) {
		subLength = n / parseInt ((math.pow(2, i)));
		var QMF = makeQMFMatrix(subLength, H, G);
		var subResult = new Array(subLength);
		subResult = subCopy(dWT, subResult, subLength);
		var temp = multiplyMatVec(QMF, subResult);
		dWT = subCopy(temp, dWT, subLength);
	}
	return dWT;
};
*/



/**
 * forwardDWT (numeric-lib)
 * 
 * @param signalVector signal vector with length = even power of two
 * @param order order of the Daubechies wavelet
 * @param cScale coarsest scale
 * @return the wavelet transform
 */
function forwardDwt(signalVector, order, cScale) {
	
	
	
	var n = signalVector.length;
	var dWT = numeric.clone(signalVector);
	
	var log2n = parseInt((Math.log(n)/Math.log(2)));
	var iterations = log2n - cScale;

	var subLength = n;
	var H = getLowPass(order);
	var G = getHighPass(H);	
		
	for (var i = 0; i < iterations; i++) {		
		subLength = n / parseInt ((Math.pow(2, i)));
		var QMF = makeQMFMatrix(subLength, H, G);
		var subResult = new Array(subLength);
		subResult = subCopy(dWT, subResult, subLength);
		var temp = numeric.dot(QMF, subResult);
		dWT = subCopy(temp, dWT, subLength);
	}
	
	return arrayToInt16(dWT);
};



/**
 * Calculates the dwt of a vector (filterbank-approach), depth 2
 * 
 * @param signalVector signal vector with length = even power of two
 * @param wavelet daubechies 9/7 or le galle 5/3 (daub, galle)
 * 
 * @return the wavelet transform
 */
function dwt(signalVector, wavelet) {
	
	var signalLen = signalVector.length;
	var result = new Array(signalLen);
	var LP = getLowPassAnalysis(wavelet);
	var HP = getHighPassAnalysis(wavelet);
	
	var filterLenLP = LP.length;
	var filterLenHP = HP.length;
	var k = 0;
	
	
	//low pass filtering, beginning at 0.
	//index skip of 2 because of later downsampling
	for(var i = 0; i< signalVector.length; i+=2) {
		var resultValue = 0;
		for(var j = - math.floor(filterLenLP/2); j< math.ceil(filterLenLP/2); j++) {
			
			//floor necessary because of index ranges -x...+x at filters
			resultValue += signalVector[math.mod((i-j), signalLen)] * LP[j + math.floor(filterLenLP/2)];
		}
		result[k]=resultValue;
		k++;
	}
	
	
	//high pass filtering, beginning at 1.
	//index skip of 2 because of later downsampling
	for(var i = 1; i< signalVector.length; i+=2) {
		var resultValue = 0;
		for(var j = - math.floor(filterLenHP/2); j< math.ceil(filterLenHP/2); j++) {
			
			//floor necessary because of index ranges -x...+x at filters
			resultValue += signalVector[math.mod((i-j), signalLen)] * HP[j + math.floor(filterLenHP/2)];
		}
		result[k]=resultValue;
		k++;	
	}
	
	return result;
};
/**
 * Calculates the idwt of a vector (filter-bank approach), depth 2
 * 
 * @param signalVector the DWT of a vector
 * @param wavelet daubechies 9/7 or le galle 5/3 ("daub", "galle")
 * @return result the iDWT (i.e. signal)
 */
function idwt(signalVector, wavelet) {
	
	var signalLen = signalVector.length;
	var result = new Array(signalLen);
	var LP = getLowPassSynthesis(wavelet);
	var HP = getHighPassSynthesis(wavelet);
	var lpVector = signalVector.slice(0, signalLen/2);
	var hpVector = signalVector.slice(signalLen/2);
	
	var resultLow = new Array(signalLen/2);
	var resultHigh = new Array(signalLen/2);
	
	var filterLenLP = LP.length;
	var filterLenHP = HP.length;
	var k = 0;
	
	
	// low pass synthesis, taking first half of signalVector
	for(var i = 0; i < signalLen; i++) {
		
		var resultValue = 0;
		for(var j = - math.floor(filterLenLP/2); j< math.ceil(filterLenLP/2); j++) {
			
			// only multiply when even numbers (vector is upsampled!)
			if(math.mod((i-j), signalLen) % 2 === 0 ) {
			resultValue += lpVector[math.mod(((i-j)/2), signalLen/2)] * LP[j + math.floor(filterLenLP/2)];
			}
			
		}
			resultLow[i] = resultValue;
	}
	
	// high pass synthesis, taking second half of signalVector
	for(var i = 0; i < signalLen; i++) {
		
		var resultValue = 0;
		for(var j = - math.floor(filterLenHP/2); j< math.ceil(filterLenHP/2); j++) {
			
			// only multiply when odd numbers (vector is upsampled!)
			if(math.mod((i-j), signalLen) % 2 === 1 ) {
			resultValue += hpVector[math.mod(((i-j)-1)/2, signalLen/2)] * HP[j + math.floor(filterLenHP/2)];
			}
			
		}
		resultHigh[i] = resultValue;
	}
	result = numeric.add(resultLow, resultHigh);
		
	return result;
};

/**
 * Performs a 2D wavelet transform of a matrix, cascading on the LL (upper-left-part)
 * until the lower value of row/cols = 2^cScale
 * 
 * @param matrix
 * @param wavelet "daub" or "galle" for daubechies 9/7 or le galle 5/3 wavelets 
 * @param cScale specifies how small the lowest LL part is (2^cScale  x  2^scale + X)
 * 		  minimum = 0
 */
function dwt2dim(matrix, wavelet, cScale) {
	
	
	var resultMatrix = padMatrixFloat(matrix);
	
	var rows = resultMatrix.length;
	var cols = resultMatrix[0].length;
	var logCols = Math.log(cols)/Math.log(2);
	var logRows = Math.log(rows)/Math.log(2);
	var minLog = Math.min(logCols, logRows);
	
	// if cScale to big => set to minimum value
	if(cScale > minLog) {
		cScale = minLog;
	}
	
	var iterations = minLog-cScale+1;
	
	
	for(var i = 0; i < iterations; i++) {
		
		// get LL part of Matrix
		
		var llMatrix = numeric.getBlock(resultMatrix, [0,0], [rows-1, cols-1]);
		
		// iterate over rows
		for(var j = 0; j < rows; j++) {
			llMatrix[j] = dwt(llMatrix[j], wavelet);
		}
		
		
		// iterate over columns
		for(var j = 0; j < cols; j++) {
			llMatrix = replaceColumn(llMatrix, j, dwt(getColumnAsVector(llMatrix, j), wavelet));
		}
		
		// save calculated dwt back to the matrix
		numeric.setBlock(resultMatrix, [0,0], [rows-1, cols-1],llMatrix);
		
		// resume on LL part of matrix
		cols = cols/2;
		rows = rows/2;
		
	}
	
	return resultMatrix;
}
	

/**
 * Calculates the inverse DWT
 * 
 * @param signalVector signal vector with length = even power of two
 * @param order order of the Daubechies wavelet
 * @param cScale coarsest scale
 * @return inverse wavelet transform
 */
/*
function inverseDwt(signalVector, order, cScale) {
	var n = signalVector.length;
	var log2n = parseInt((math.log(n)/math.log(2)));
	var subLength;
	var preserveCopy = new Array(signalVector.length);
	preserveCopy = subCopy(signalVector, preserveCopy, signalVector.length);
	var H = getLowPass(order);
	var G = getHighPass(H);
	
	for (var i = cScale + 1; i <= log2n; i++) {
		subLength = parseInt((math.pow(2, i)));
		var QMF = makeQMFMatrix(subLength, H, G);
		QMF = transpose(QMF);
		var subResult = new Array(subLength);
		subResult = subCopy(signalVector, subResult, subLength);
		subResult = multiplyMatVec(QMF, subResult);
		signalVector = subCopy(subResult, signalVector, subLength);
	}
	var iDWT = new Array(n);
	iDWT = subCopy(signalVector, iDWT, n);
	signalVector = subCopy(preserveCopy, signalVector, n);
	return iDWT;
}
*/

/**
 * Calculates the inverse DWT (numeric-lib)
 * 
 * @param signalVector signal vector with length = even power of two
 * @param order order of the Daubechies wavelet
 * @param cScale coarsest scale
 * @return inverse wavelet transform
 */
function inverseDwt(signalVector, order, cScale) {
	var n = signalVector.length;
	var log2n = parseInt((Math.log(n)/Math.log(2)));
	var subLength;
	var preserveCopy = new Array(signalVector.length);
	preserveCopy = subCopy(signalVector, preserveCopy, signalVector.length);
	var H = getLowPass(order);
	var G = getHighPass(H);
	
	for (var i = cScale + 1; i <= log2n; i++) {
		subLength = parseInt((Math.pow(2, i)));
		var QMF = makeQMFMatrix(subLength, H, G);
		QMF = numeric.transpose(QMF);
		var subResult = new Array(subLength);
		subResult = subCopy(signalVector, subResult, subLength);
		subResult = numeric.dot(QMF, subResult);
		signalVector = subCopy(subResult, signalVector, subLength);
	}
	var iDWT = new Array(n);
	iDWT = subCopy(signalVector, iDWT, n);
	signalVector = subCopy(preserveCopy, signalVector, n);
	return iDWT;
}

/**
 * Calculates the inverse DWT (numeric-lib)
 * 
 * @param signalVector signal vector with length = even power of two
 * @param order order of the Daubechies wavelet
 * @param cScale coarsest scale
 * @return inverse wavelet transform
 */
function inverseDwtSparse(signalVector, order, cScale) {
	var n = signalVector.length;
	var log2n = parseInt((Math.log(n)/Math.log(2)));
	var subLength;
	var preserveCopy = new Array(signalVector.length);
	preserveCopy = subCopy(signalVector, preserveCopy, signalVector.length);
	var H = getLowPass(order);
	var G = getHighPass(H);
	
	for (var i = cScale + 1; i <= log2n; i++) {
		subLength = parseInt((Math.pow(2, i)));
		var QMF = makeQMFMatrix(subLength, H, G);
		QMF = numeric.transpose(QMF);
		var subResult = new Array(subLength);
		subResult = subCopy(signalVector, subResult, subLength);
		subResult = numeric.dot(QMF, subResult);
		signalVector = subCopy(subResult, signalVector, subLength);
	}
	var iDWT = new Array(n);
	iDWT = subCopy(signalVector, iDWT, n);
	signalVector = subCopy(preserveCopy, signalVector, n);
	return iDWT;
}

/*
function dwt2D(matrix, order, cScale) {
	
	// create a copy of matrix
//	var dwt = numeric.clone(matrix);
	
	var dwt = cloneMatrix(matrix, 8);
	
	
	// pad matrix with zeros
	dwt = padMatrix(dwt);
	var rowNumber = dwt.length;
	var columnNumber = dwt[0].length;
	
	
	// iterate over rows
	
	for(var i = 0; i < rowNumber; i++) {
		var signalVector = dwt[i];
		dwt[i] = forwardDwt(signalVector, order, cScale);
	}


	// iterate over columns
	

	for(var i = 0; i < columnNumber; i++) {
		var signalVector = getColumnAsVector(dwt, i);
		signalVector = forwardDwt(signalVector, order, cScale)
		dwt = replaceColumn(dwt, i, signalVector);
	}

	return dwt;
};
*/


function dwt2D(matrix, order, cScale) {
	
	
var dwt = cloneMatrix(matrix, 8);
	
	
	// pad matrix with zeros
	dwt = padMatrix(dwt);
	var rowNumber = dwt.length;
	var columnNumber = dwt[0].length;
	
	
	
	
	
	var log2nRow = parseInt((Math.log(rowNumber)/Math.log(2)));
	var iterationsRow = log2nRow - cScale;

	var log2nCol = parseInt((Math.log(columnNumber)/Math.log(2)));
	var iterationsCol = log2nCol - cScale;
	
	var H = getLowPass(order);
	var G = getHighPass(H);	
	
	
	// create QMF with size max(rowNumber,columnNumber)
	if (rowNumber> columnNumber) {
		var sizeOfQMF = rowNumber;
		var iterationsMat = iterationsRow;
	}
	
	else {
		var sizeOfQMF = columnNumber;
		var iterationsMat = iterationsCol;
	}
	
	var qmfArray = makeQMFArray(sizeOfQMF, iterationsMat, H, G)
	// iterate over rows

	
	// if less iterations at rows => start at index > 0
	var startRow = (iterationsCol - iterationsRow) * (iterationsCol > iterationsRow);
	
	var t0 = performance.now();
	for(var i = 0; i < rowNumber; i++) {
		var dWT = numeric.clone(dwt[i]);
		for (var j = startRow; j < iterationsRow + startRow; j++) {
		var QMF = qmfArray[j];
		var subLength = QMF.length;
		var subResult = new Array(subLength);
		subResult = subCopy(dWT, subResult, subLength);
		var temp = numeric.dot(QMF, subResult);
		dWT = subCopy(temp, dWT, subLength);
		
		}
		dwt[i] = arrayToInt16(dWT);
	}
	
	var t1 = performance.now();
	var t = t1-t0;

	
	// iterate over columns
	
	// if less iterations at rows => start at index > 0
	var startCol = (iterationsRow - iterationsCol) * (iterationsRow > iterationsCol);
	var zaehler = 0;
	
	var z0 = performance.now();
	for(var i = 0; i < columnNumber; i++) {
		var dWT = numeric.clone(getColumnAsVector(dwt, i));
		
		for (var j = startCol; j < iterationsCol + startCol; j++) {
			var QMF = qmfArray[j];
			var subLenth = QMF.length;
			var subResult = new Array(subLength);
			subResult = subCopy(dWT, subResult, subLength);
			var temp = numeric.dot(QMF, subResult);	
			dWT = subCopy(temp, dWT, subLength);
			zaehler++;
			}
		
		dwt = replaceColumn(dwt, i, arrayToInt16(dWT));
	}


	
	return dwt;
}



/**
 *Make a quadrature mirror matrix (math-lib)
 * 
 * @param scale 
 * @param H low pass filter (vector)
 * @param G high pass filter (vector)
 * @return QMF[scale][scale]
 */
/*
function makeQMFMatrix(scale, H, G) {
	var filterLen = H.length;
	var skip = 0;
	var QMF = math.zeros(scale, scale);
	
	for (var i = 0; i < (scale / 2); i++) {
		for (var j = 0; j < filterLen; j++) {
			var location = j + skip;
			if (location > scale - 1)// wrap
			{
				location = location - (scale);
			}
			QMF.subset(math.index(i, location), H[j]);
		}
		skip += 2;
	}
	skip = scale - 1;
	for (var i = scale - 1; i >= (scale / 2); i--) {
		for (var j = filterLen - 1; j >= 0; j--) {
			var location = -j + skip;
			if (location < 0) {
				location += scale;
			}
			QMF.subset(math.index(i, location), G[filterLen - j - 1]);
		}
		skip -= 2;
	}
	return QMF;
};


*/

///**
// *Make a quadrature mirror matrix (numeric-lib)
// * 
// * @param scale 
// * @param H low pass filter (vector)
// * @param G high pass filter (vector)
// * @return QMF[scale][scale]
// */
//function makeQMFMatrix(scale, H, G) {
//	var filterLen = H.length;
//	var skip = 0;
//	
//	// create and initialize matrix with zeros
//	var QMF = numeric.rep([scale,scale], 0)
//	
//	for (var i = 0; i < (scale / 2); i++) {
//		for (var j = 0; j < filterLen; j++) {
//			var location = j + skip;
//			if (location > scale - 1)// wrap
//			{
//				location = location - (scale);
//			}
//			QMF[i][location] = H[j];
//		}
//		skip += 2;
//	}
//	skip = scale - 1;
//	for (var i = scale - 1; i >= (scale / 2); i--) {
//		for (var j = filterLen - 1; j >= 0; j--) {
//			var location = -j + skip;
//			if (location < 0) {
//				location += scale;
//			}
//			QMF[i][location] = G[filterLen - j - 1];
//		}
//		skip -= 2;
//	}
//	return QMF;
//};


/**
 *Make a quadrature mirror matrix (numeric-lib)
 * 
 * Own Version: try to optimize runtime
 * 
 * @param scale 
 * @param H low pass filter (vector)
 * @param G high pass filter (vector)
 * @return QMF[scale][scale]
 */
function makeQMFMatrix(scale, H, G) {
	var filterLen = H.length;
	var skip = 0;
	var position = 0;
	// start point for lower half of matrix
	var position2 = scale - filterLen;
	
	// create matrix and initialize with zeros
	var QMF = numeric.rep([scale,scale], 0)
	
	for (var i = 0; i < (scale / 2); i++) {
		
		arrayInArray(QMF[i], H, position);
		
		arrayInArray(QMF[scale-i-1], G, position2);
		
		position = (position+2)%scale;
		position2 = (position2-2)%scale;
		
		if(position2 < 0) {
			position2 = scale - Math.abs(position2);
		}
	}
	return QMF;
};

/**
 * Creates an array with QMF-matrices
 * 
 * @param sizeOfQMF desired size of QMF-Matrix
 * @param iterationsMat iterations (log(size) - scale)
 * @param H highpass
 * @param G lowpass	
 * @returns {Array}
 */
function makeQMFArray(sizeOfQMF, iterationsMat, H, G) {


var qmfArray = new Array(sizeOfQMF);


for (var i = 0; i < iterationsMat; i++) {
	
	var sublength = sizeOfQMF / parseInt((Math.pow(2, i)));
	qmfArray[i] = makeQMFMatrix(sublength, H, G)
}

return qmfArray;
};

/**
 * Creates an array with QMF-matrices
 * 
 * @param sizeOfQMF desired size of QMF-Matrix
 * @param iterationsMat iterations (log(size) - scale)
 * @param H highpass
 * @param G lowpass	
 * @returns {Array}
 */
function makeInverseQMFArray(start, end, H, G) {


var qmfArray = new Array(end);


for (var i = start; i <= end; i++) {
	
	var sublength = end / parseInt((Math.pow(2, i)));
	qmfArray[i] = makeQMFMatrix(sublength, H, G)
}

return qmfArray;
};


/**
 * Example: If source = {5, 6, 7}, destination = {1, 2, 3, 4}, and count = 2
 * Then result = {5, 6, 3, 4}
 * 
 * @param source source vector (array)
 * @param destionation destination vector (array)
 * @param count number of elements to be replaced
 * @return the first count elements in source overwrite the first count
 *         elements in the result.
 */
function subCopy(source, destination,
		count) {
	for (var i = 0; i < count; i++) {
		destination[i] = source[i];
	}
	return destination;
};

/**
 * Like subCopy, but result can handle sparsee matrices (sparse with position-value)
 * 
 * 
 * @param source source vector (array)
 * @param destionation destination vector (array)
 * @param count number of elements to be replaced
 * @return the first count elements in source overwrite the first count
 *         elements in the result. (sparse)
 */
//function subCopySparse(source, destination,
//		count) {
//	for (var i = 0, j = 0; i < count; i++) {
//		if(source[j] <= i) {
//			destination[j] = source[j];
//			destination[j+1] = source[j+1];
//			j +=2;
//		} else {
//		return destination;
//	}
//	
//}
//}

/**
 * Like subCopy, but result can handle compressed matrices
 * 
 * 
 * @param source source vector (array)
 * @param destionation destination vector (array)
 * @param count number of elements to be replaced
 * @return the first count elements in source overwrite the first count
 *         elements in the result. (compressed)
 */
function subCopyCompressed(source, destination,
		count) {
	for (var i = 0, j = 0; i < count; i++) {
		if(source[j] <= i) {
			destination[j] = source[j];
			destination[j+1] = source[j+1];
			j +=2;
		} else {
		return destination;
	}
	
}
}


///**
// * Perfoms a wavelet transformation on a 2D input by iterating
// * over rows and columns
// * 
// * @param matrix matrix to be transformed
// * @param order order of the wavelet
// * @param cScale coarsest scale
// */
//
//function dwt2D(matrix, order, cScale) {
//	
//	// create a copy of matrix
////	var dwt = numeric.clone(matrix);
//	
//	var dwt = cloneMatrix(matrix, 8);
//	
//	
//	// pad matrix with zeros
//	dwt = padMatrix(dwt);
//	var rowNumber = dwt.length;
//	var columnNumber = dwt[0].length;
//	
//	
//	// iterate over rows
//	
//	for(var i = 0; i < rowNumber; i++) {
//		var signalVector = dwt[i];
//		dwt[i] = forwardDwt(signalVector, order, cScale);
//	}
//
//	
//	// iterate over columns
//	
//
//	for(var i = 0; i < columnNumber; i++) {
//		var signalVector = getColumnAsVector(dwt, i);
//		signalVector = forwardDwt(signalVector, order, cScale)
//		dwt = replaceColumn(dwt, i, signalVector);
//	}
//
//	
//	return dwt;
//};


/**
 * DWT2D mit eigener Matrix-impl.
 *
 */
/*
function dwt2D(matr, order, cScale) {
	
	var valuesCopy = numeric.clone(matr.vector)
	// create a copy of matrix
	var dwt = new Matrix(valuesCopy, matr.rows, matr.columns);
	
	// pad matrix with zeros
	dwt = padMatrix(dwt);
	var rowNumber = matr.rows;
	var columnNumber = matr.columns;
	
	// iterate over rows
	
	for(var i = 0; i < rowNumber; i++) {
		var signalVector = getRowAsVector(dwt, i)
		var transformed = forwardDwt(signalVector, order, cScale)
		replaceRow(dwt, i, transformed);
	}
	
	
	// iterate over columns
		
	for(var i = 0; i < columnNumber; i++) {
		var signalVector = getColumnAsVector(dwt, i);
		signalVector = forwardDwt(signalVector, order, cScale)
		dwt = replaceColumn(dwt, i, signalVector);
	}
	return dwt;
};
*/


/**
 * Calculates the inverse DWT for a 2D input matrix
 * 
 * @param matrix matrix to be re-transformed
 * @param order order of the wavelet
 * @param cScale coarsest scale
 * @returns i-dwt of matrix
 */

/*
function idwt2D(matrix, order, cScale) {
	
	// create a copy of matrix
	var idwt = numeric.clone(matrix);
	var rowNumber = matrix.length;
	var columnNumber = matrix[1].length;
	
	
	// iterate over rows
	for(var i = 0; i < rowNumber; i++) {
		var signalVector = idwt[i];
		idwt[i] = inverseDwt(signalVector, order, cScale);
	}
	
	
	// iterate over columns
	for(var i = 0; i < columnNumber; i++) {
		var signalVector = getColumnAsVector(idwt, i);
		signalVector = inverseDwt(signalVector, order, cScale);
		idwt = replaceColumn(idwt, i, signalVector);
	}

	

	
	return idwt;
}
*/

function dwt2Dsplit(matrix, order, cScale, splitSize) {
	
	//create non-int8 version
	
	
	var matrix = numeric.clone(matrix);
	
	// desired splitSize > size of matrix
	if((matrix.length < splitSize) || (matrix[0].length < splitSize)) {
		return dwt2D(matrix, order, cScale);
	}
	
	
	
	var horNumbers = Math.ceil(matrix[0].length/splitSize);
	
	
	var vertNumbers = Math.ceil(matrix.length/splitSize);
	var iterations = vertNumbers * horNumbers;
	var xIndex = 0;
	var yIndex = 0;
	var endY;
	var endX;
	
	var widthX = horNumbers*splitSize;
	var differenceY = (vertNumbers*splitSize) - matrix.length;
	
	// pad zero-vectors at the y-site of the matrix
	for(var i = 0; i < differenceY; i++) {
		matrix.push(numeric.rep([widthX], 0));
	}

	for(var i = 0; i<iterations; i++) {
		
		
		//if block-square reaches the edge => padding with zeros later
		if(yIndex+splitSize > matrix.length) {
			endY = matrix.length-1;
		} else {
			endY = yIndex + splitSize-1;
		}
		
		if(xIndex+splitSize > matrix[0].length) {
			endX = matrix[0].length-1;
		} else {
			endX = xIndex + splitSize-1;
		}
				
		var block = numeric.getBlock(matrix, [yIndex, xIndex], [endY, endX]);
		
		// padding with zeros if required
		if(block.length != block[0].length) {
			
			var mat = numeric.rep([splitSize, splitSize], 0);
			numeric.setBlock(mat, [0,0], [block.length-1, block[0].length-1], block);
			block = mat;
		}
		
		block = dwt2D(block, order, cScale);
		
		
		
		matrix = numeric.setBlock(matrix, [yIndex, xIndex], [yIndex+splitSize-1, xIndex+splitSize-1], block);
		
		// end of line reached
		if(xIndex + splitSize >= matrix[0].length) {
			xIndex = 0;
			yIndex += splitSize;
		} else {
			xIndex += splitSize;
		}
	}
	
	var splitArray = [splitSize];
	
	 matrix.push(splitArray);
	
	matrix = matrixToInt16(matrix);
	
	return(matrix);
	

	
	
	
}

function dwt2dimSplit(matrix, wavelet, cScale, splitSize) {
	
	//create non-int8 version
	
	
	var matrix = numeric.clone(matrix);
	
	// desired splitSize > size of matrix
	if((matrix.length < splitSize) || (matrix[0].length < splitSize)) {
		return dwt2dim(matrix, wavelet, cScale);
	}
	
	
	
	var horNumbers = Math.ceil(matrix[0].length/splitSize);
	
	
	var vertNumbers = Math.ceil(matrix.length/splitSize);
	var iterations = vertNumbers * horNumbers;
	var xIndex = 0;
	var yIndex = 0;
	var endY;
	var endX;
	
	var widthX = horNumbers*splitSize;
	var differenceY = (vertNumbers*splitSize) - matrix.length;
	
	// pad zero-vectors at the y-site of the matrix
	for(var i = 0; i < differenceY; i++) {
		matrix.push(numeric.rep([widthX], 0));
	}

	for(var i = 0; i<iterations; i++) {
		
		
		//if block-square reaches the edge => padding with zeros later
		if(yIndex+splitSize > matrix.length) {
			endY = matrix.length-1;
		} else {
			endY = yIndex + splitSize-1;
		}
		
		if(xIndex+splitSize > matrix[0].length) {
			endX = matrix[0].length-1;
		} else {
			endX = xIndex + splitSize-1;
		}
				
		var block = numeric.getBlock(matrix, [yIndex, xIndex], [endY, endX]);
		
		// padding with zeros if required
		if(block.length != block[0].length) {
			
			var mat = numeric.rep([splitSize, splitSize], 0);
			numeric.setBlock(mat, [0,0], [block.length-1, block[0].length-1], block);
			block = mat;
		}
		
		block = dwt2dim(block, wavelet, cScale);
		
		
		
		matrix = numeric.setBlock(matrix, [yIndex, xIndex], [yIndex+splitSize-1, xIndex+splitSize-1], block);
		
		// end of line reached
		if(xIndex + splitSize >= matrix[0].length) {
			xIndex = 0;
			yIndex += splitSize;
		} else {
			xIndex += splitSize;
		}
	}
	
	var splitArray = [splitSize];
	
	matrix.push(splitArray);
	
//	matrix = matrixToInt16(matrix);
	
	return(matrix);
	
	
	
}

function idwt2Dsplit(matrix, order, cScale) {
	
	//create non-int8 version
	
	
	var matrix = numeric.clone(matrix);
	
	var splitSizeArray = matrix.pop();
	var splitSize = splitSizeArray[0];
	
	
	
	// desired splitSize > size of matrix
	if((matrix.length < splitSize) || (matrix[0].length < splitSize)) {
		return idwt2D(matrix, order, cScale);
	}
	
	
	
	var horNumbers = Math.ceil(matrix[0].length/splitSize);
	
	
	var vertNumbers = Math.ceil(matrix.length/splitSize)+1;
	var iterations = vertNumbers * horNumbers;
	var xIndex = 0;
	var yIndex = 0;
	var endY;
	var endX;
	
	var widthX = horNumbers*splitSize;
	var differenceY = (vertNumbers*splitSize) - matrix.length;
	
	// pad zero-vectors at the y-site of the matrix
	for(var i = 0; i < differenceY; i++) {
		matrix.push(numeric.rep([widthX], 0));
	}

	for(var i = 0; i<iterations; i++) {
		
		
		//if block-square reaches the edge => padding with zeros later
		if(yIndex+splitSize > matrix.length) {
			endY = matrix.length-1;
		} else {
			endY = yIndex + splitSize-1;
		}
		
		if(xIndex+splitSize > matrix[0].length) {
			endX = matrix[0].length-1;
		} else {
			endX = xIndex + splitSize-1;
		}
				
		var block = numeric.getBlock(matrix, [yIndex, xIndex], [endY, endX]);
		
		// padding with zeros if required
		if(block.length != block[0].length) {
			
			var mat = numeric.rep([splitSize, splitSize], 0);
			numeric.setBlock(mat, [0,0], [block.length-1, block[0].length-1], block);
			block = mat;
		}
		
		block = idwt2D(block, order, cScale);
		
		
		
		matrix = numeric.setBlock(matrix, [yIndex, xIndex], [yIndex+splitSize-1, xIndex+splitSize-1], block);
		
		// end of line reached
		if(xIndex + splitSize >= matrix[0].length) {
			xIndex = 0;
			yIndex += splitSize;
		} else {
			xIndex += splitSize;
		}
	}
		
	return matrix;
	
	
	
}


function idwt2D(matrix, order, cScale) {
	
	matrix.pop();
	
	var idwt = numeric.clone(matrix);
	var rowNumber = matrix.length;
	var columnNumber = matrix[1].length;
	
	
	
	
	var log2nRow = parseInt((Math.log(rowNumber)/Math.log(2)));
	var iterationsRow = log2nRow - cScale;

	var log2nCol = parseInt((Math.log(columnNumber)/Math.log(2)));
	var iterationsCol = log2nCol - cScale;
	
	var H = getLowPass(order);
	var G = getHighPass(H);	
	
	
	// create QMF with size max(rowNumber,columnNumber)
	if (rowNumber> columnNumber) {
		var sizeOfQMF = rowNumber;
		var iterationsMat = iterationsRow;
	}
	
	else {
		var sizeOfQMF = columnNumber;
		var iterationsMat = iterationsCol;
	}
	
	var qmfArray = makeQMFArray(sizeOfQMF, iterationsMat, H, G);
	
	// iterate over rows
	var startRow = (iterationsCol - iterationsRow) * (iterationsCol > iterationsRow);
	
	for(var j = 0; j<rowNumber; j++) {
	
	var signalVector = idwt[j];
	var n = signalVector.length;
	var log2n = parseInt((Math.log(n)/Math.log(2)));
	var subLength;
	var preserveCopy = new Array(signalVector.length);
	preserveCopy = subCopy(signalVector, preserveCopy, signalVector.length);
	

	
	for (var i = cScale + 1, k = iterationsMat-1; i <= log2n; i++,k--) {
		subLength = parseInt((Math.pow(2, i)));
		
		var QMF = numeric.transpose(qmfArray[k]);
		var subResult = new Array(subLength);
		subResult = subCopy(signalVector, subResult, subLength);
		subResult = numeric.dot(QMF, subResult);
		signalVector = subCopy(subResult, signalVector, subLength);
	}
	var result = new Array(n);
	result = subCopy(signalVector, result, n);
	signalVector = subCopy(preserveCopy, signalVector, n);
	idwt[j] = result;
	}
	
	// iterate over columns
	
	for(var j = 0; j<columnNumber; j++) {
		
		var signalVector = getColumnAsVector(idwt,j);
		var n = signalVector.length;
		var log2n = parseInt((Math.log(n)/Math.log(2)));
		var subLength;
		var preserveCopy = new Array(signalVector.length);
		preserveCopy = subCopy(signalVector, preserveCopy, signalVector.length);
		
		
		for (var i = cScale + 1, k = iterationsMat-1; i <= log2n; i++,k--) {
			subLength = parseInt((Math.pow(2, i)));
			
			var QMF = numeric.transpose(qmfArray[k]);
			var subResult = new Array(subLength);
			subResult = subCopy(signalVector, subResult, subLength);
			subResult = numeric.dot(QMF, subResult);
			signalVector = subCopy(subResult, signalVector, subLength);
		}
		var result = new Array(n);
		result = subCopy(signalVector, result, n);
		signalVector = subCopy(preserveCopy, signalVector, n);
		idwt = replaceColumn(idwt, j, result);
		}
	
		return idwt;
	
	 
}




