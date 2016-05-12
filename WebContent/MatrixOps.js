/**
 * Class responsibility: Provide methods for basic vector and matrix
 * computations.
 * 
 */

function Matrix(vector, rows, columns) {
	this.vector = vector;
	this.rows = rows;
	this.columns = columns;
}

function matmult(matrix1, matrix2) {
	var l = matrix1.rows;
	var m = matrix1.columns;
	var n = matrix2.columns;

	var matr1 = matrix1.vector;
	var matr2 = matrix2.vector;

	// debugger;
	// Create the result-vector, initialize with zeros
	var result = numeric.rep([ l * n ], 0);
	for (var i = 0; i < l; i++) {
		for (var j = 0; j < n; j++) {
			for (var k = 0; k < m; k++) {
				result[(j + i * n)] += (matr1[(k + i * m)] * matr2[(j + k * n)]);
			}
		}
	}

	var resultmatrix = new Matrix(result, l, n);
	return resultmatrix;

};
/**
 * Multiplies a matrix with a sparse vector
 * 
 * @param matrix matrix
 * @param vector sparse/compressed vector (many zeros)
 */
function matVecMultSparse(matrix, vector) {
//	for(var i = 0; i<matrix.length; i++) 

};

// var MatrixOps = {
/**
 * 
 * @return gives an upper bound on the relative error due to rounding in
 *         floating point arithmetic
 */
function machineEpsilonDouble() {
	double
	eps = 1.0;
	do
		eps /= 2.0;
	while ((1.0 + (eps / 2.0)) != 1.0);
	return eps;
};

/**
 * Uses the eye-function of math and creates an identity matrix
 * 
 * @param n
 *            Integer: dimension of matrix
 * @return Identity matrix I[n,n]
 */
function eye(n) {
	var eye = math.eye(n);
	return eye;
};

/**
 * Returns Column-Vector of a matrix (from math-library)
 * 
 * @param matrix
 * @return col
 */
/*
 * function getColumnAsVector(matrix, colIndex) { var m1 = math.size(matrix);
 * var m = math.subset(m1, math.index(0)); var col = new Array(m); for (var i =
 * 0; i < m; i++) { col[i] = math.subset(matrix, math.index(i, colIndex)); }
 * return col; };
 */
/**
 * Returns Column-Vector of a matrix (from numeric-library)
 * 
 * @param matrix
 * @return col
 */

 function getColumnAsVector(matrix, colIndex) {
 
 var m = matrix.length; 

 var col = new Int16Array(m);
 for (var i = 0; i < m; i++) {
	 
 col[i] = matrix[i][colIndex];


 } 
 return col; 
 };
 

/**
 * Returns Column-Vector of a matrix (own matrix-type)
 * 
 * @param matr
 * @return col
 */
 /*
	 * function getColumnAsVector(matr, colIndex) {
	 * 
	 * var values = matr.vector; var m = matr.rows; var n = matr.columns; var l =
	 * values.length;
	 * 
	 * var col = new Array(m); for (var i = 0; i < m; i++) { col[i] =
	 * values[(colIndex + i * n)]; } return col; };
	 */

/**
 * Returns Row-Vector of a matrix (with own matrix-impl.)
 * 
 * @param matrix
 * @return row-vector
 */
/*
 * function getRowAsVector(matrix, rowIndex) {
 * 
 * var values = matrix.vector; var m = matrix.rows; var n = matrix.columns; var
 * l = values.length; // Array with dimensions of the matrix
 * 
 * var row = new Array(n); for (var i = 0; i < n; i++) { row[i] = values[(i +
 * rowIndex * n)]; } return row; };
 */
/**
 * Returns Row-Vector of a matrix (numeric-lib)
 * 
 * @param matrix
 * @return row-vector
 */

 function getRowAsVector(matrix, rowIndex) {
 
 return matrix[rowIndex];
  };
 

/**
 * Converts vector to a Row Matrix
 * 
 * @param v
 *            Vector (array)
 * @return rowIndex
 */
function vectorToRowMatrix(v) {

	// determine length of vector
	var n = v.length;

	// create matrix, initially filled with zeros


	var row = math.zeros(1, n);
	for (var i = 0; i < n; i++) {
		row.subset(math.index(0, i), v[i]);
	}
	return row;
};

/**
 * Deep copies a vector (creates new vector with the same values)
 * 
 * @param vector
 *            vector to be copied (array)
 * @return copy of the vector
 * 
 */
function deepCopyVector(vector) {
	var n = vector.length;
	var copy = new Array(n);
	for (var j = 0; j < n; j++) {
		copy[j] = vector[j];
	}
	return copy;
};

/**

 * Converts an array to int16
 * 



 * @param array array to be converted
 * @return converted array
 */

function arrayToInt16(array) {

	// determine number of rows and columns



	var len = array.length;


	var int16array = new Int16Array(len);
	
	for (var i = 0; i < len; i++) {




		int16array[i] = array[i];
		}
	return int16array;
	}

/**
 * Converts a matrix to int16
 * 
 * @param matrix matrix to be converted
 * @return converted matrix
 */
function matrixToInt16(matrix) {
	
	var len = matrix.length;
	
	var int16matrix = numeric.clone(matrix);
	
	for (var i = 0; i<len; i++) {
		int16matrix[i] = arrayToInt16(matrix[i]);
		
	}
	return int16matrix;

}

/**
 * Converts an array to int8
 * 
 * @param array array to be converted
 * @return converted array
 */
function arrayToInt8(array) {

	// determine number of rows and columns
	var len = array.length;

	var int8array = new Uint8ClampedArray(len);
	
	for (var i = 0; i < len; i++) {
		int8array[i] = array[i];
		}
	return int8array;
	}

/**
 * Converts a matrix to int16
 * 
 * @param matrix matrix to be converted
 * @return converted matrix
 */
function matrixToInt8(matrix) {
	
	var len = matrix.length;
	
	var int8matrix = numeric.clone(matrix);
	
	for (var i = 0; i<len; i++) {
		int8matrix[i] = arrayToInt8(matrix[i]);
	}
	return int8matrix;
}

/**
 * Clones 8 oder 16 bit array
 * 
 * @param array cloned array
 * @param int 8 or 16 bit array
 */
function cloneArray(array, int) {
	var len = array.length;
	debugger;
	
	if(int == 8) {
		var clone = new Uint8ClampedArray(len);
	}
	
	else{
		var clone = new Int16Array(len);
	}
			
	for(var i = 0; i<len; i++) {
		clone[i] = array[i];
	}
	
	return clone;
}
/**
 * Clones 8 or 16 bit matrix
 * 
 * @param matrix
 * @param int
 * @returns {Array} cloned matrix
 */
function cloneMatrix(matrix, int) {
	
	
	//Matrix-klon bei Tiefe 1 noch nicht möglich -> fixen
	
	var len = matrix.length;
	var clone = new Array(matrix.length);
	
	if(int == 16) {
	for(var i = 0; i < len; i++ ) {
		
		clone[i] = arrayToInt16(matrix[i]);
		
		}	
	}
	else{
		for(var i = 0; i < len; i++ ) {
			clone[i] = arrayToInt8(matrix[i]);
			
		}
	}
	return clone;
	}	
	






/**
 * Transposes a matrix
 * 
 * @param matrix
 *            matrix to be transposed
 * @return transposed matrix
 */

/*
 * function transpose(matrix) { // determine number of rows and columns var m1 =
 * math.size(matrix); var m = math.subset(m1, math.index(0)); var n =
 * math.subset(m1, math.index(1));
 * 
 * var transposed = math.zeros(n, m); for (var i = 0; i < n; i++) { for (var j =
 * 0; j < m; j++) { transposed.subset(math.index(i, j), math.subset(matrix,
 * math.index( j, i))); } } return transposed; };
 */
/**
 * 
 */

/*
 * function transpose(matr) {
 * 
 * var m = matr.rows; var n = matr.columns; var values = matr.vector;
 * 
 * var transformedValues = new Array(values.length); var transformed = new
 * Matrix(transformedValues, n, m);
 * 
 * for (var i = 0; i < n; i++) { for (var j = 0; j < m; j++) {
 * transformedValues[(j + i * m)] = values[(i + j * n)]; } }
 * 
 * return transformed; }
 */
/**
 * 
 * Multiplies vector with matrix (ensures that the result is an array)
 * 
 * @param A
 *            matrix
 * @param B
 *            vector
 */
function multiplyMatVec(matrix, vector) {

	var m1 = math.size(matrix);
	var m = math.subset(m1, math.index(0));
	var p = math.subset(m1, math.index(1));
	var n = vector.length;

	var C = new Array(n);

	// Initialize array with zeros
	for (var i = 0; i < n; i++) {
		C[i] = 0;
	}

	for (var i = 0; i < n; i++) {
		for (var j = 0; j < p; j++) {
			C[i] = C[i] + (math.subset(matrix, math.index(i, j)) * vector[j]);
		}
	}
	return C;
};

/**
 * Pads zeros to a vector with size != power of 2
 * 
 * @param array
 * @returns padded vector
 */
function padVector(array) {
	var size = array.length;
	var log2N = math.log(size) / math.log(2);
	var ceil = math.ceil(log2N);

	// create copy of array
	arrayCopy = array.slice(0, size);

	// No padding required?
	if (log2N == ceil) {
		return arrayCopy;
	}

	var sizePad = math.pow(2, ceil);

	// Number of zeros to be padded
	var paddingSize = sizePad - size;

	for (var i = 0; i < paddingSize; i++) {
		arrayCopy.push(0);
	}
	return arrayCopy;
};

/**
 * 
 * @param matrix
 * @returns
 */

  function padMatrix(matrix) {
  
		var height = matrix.length;
		var width = matrix[0].length;

		var log2Nheight = Math.log(height) / Math.log(2);
		var log2Nwidth = Math.log(width) / Math.log(2);
		var ceilHeight = Math.ceil(log2Nheight);
		var ceilWidth = Math.ceil(log2Nwidth);

		var matrixCopy = numeric.clone(matrix);
		
//		var matrixCopy = cloneMatrix(matrix, 8);

		
		// var preserveCopy = matrixCopy.slice();

		var sizePadHeight = Math.pow(2, ceilHeight);
		var sizePadWidth = Math.pow(2, ceilWidth);

		// Number of zeros to be padded
		var paddingSizeHeight = sizePadHeight - height;
		var paddingSizeWidth = sizePadWidth - width;

		var zeroVector = [ 0 ];



		var paddingNeededRow = paddingSizeWidth != 0;
		var paddingNeededColumn = paddingSizeHeight != 0;

		// No padding required at all?
		if (!paddingNeededRow && !paddingNeededColumn) {
			return matrixCopy;
		}




		// pad zeros to each row if required
		if (paddingNeededRow) {
			for (var i = 0; i < height; i++) {



				for (var j = 0; j < paddingSizeWidth; j++) {
					matrixCopy[i].push(0);
				}



			}
		}

		// Create Zero-Vectors for the last rows of the matrix and
		// append them to the matrix if required
		if (paddingNeededColumn) {



			for (var i = 0; i < sizePadWidth - 1; i++) {
				zeroVector.push(0);
			}

			for (var i = 0; i < paddingSizeHeight; i++) {
				matrixCopy.push(zeroVector);
			}
		}

		// matrix = preserveCopy;
		return matrixToInt8(matrixCopy);
  };

/**
 * Pad Matrix with own Matrix-impl.
 * 
 * @param matrix
 * @returns
 */
		/*
function padMatrix(matrix) {

	var height = matrix.rows;
	var width = matrix.columns;
	var values = matrix.vector;

	var log2Nheight = Math.log(height) / Math.log(2);
	var log2Nwidth = Math.log(width) / Math.log(2);
	var ceilHeight = Math.ceil(log2Nheight);
	var ceilWidth = Math.ceil(log2Nwidth);

	// var preserveCopy = matrixCopy.slice();

	var sizePadHeight = Math.pow(2, ceilHeight);
	var sizePadWidth = Math.pow(2, ceilWidth);

	var valuesCopy = numeric.clone(values);
	var matrixCopy = new Matrix(values, sizePadHeight, sizePadWidth);

	// Number of zeros to be padded
	var paddingSizeHeight = sizePadHeight - height;
	var paddingSizeWidth = sizePadWidth - width;

	var zeroVector = [ 0 ];

	var paddingNeededRow = paddingSizeWidth != 0;
	var paddingNeededColumn = paddingSizeHeight != 0;

	// No padding required at all?
	if (!paddingNeededRow && !paddingNeededColumn) {
		return matrixCopy;
	}

	// pad zeros to each row if required
	if (paddingNeededRow) {
		for (var i = 0, k = 0; i < height; i ++) {

			for (var j = 0; j < paddingSizeWidth; j++) {
				valuesCopy.splice(k+width, 0, 0);
				
			}
			k += (paddingSizeWidth+width);
		}
	}

	
	if (paddingNeededColumn) {
		for (var i = 0; i < paddingSizeHeight * sizePadWidth; i++)
		valuesCopy.push(0);
	}
	matrixCopy.vector = valuesCopy;
	return matrixCopy;
};
*/

  /**
   * Crops the matrix to the specified size
   * 
   * @param matrix
   * @param rows
   * @param columns
   */
  function unpadMatrix(matrix, rows, columns) {

  	height = matrix.length;
  	width = matrix[0].length;

  	var matrixCopy = matrix.slice();
  	var preserveCopy = matrix.slice();



  	// delete zeros in each row
  	for (var i = 0; i < rows; i++) {
  		for (var j = 0; j < width - columns; j++) {
  			matrixCopy[i].pop();
  		}
  	}

  	for (var i = 0; i < height - rows; i++) {
  		matrixCopy.pop();
  	}
  	
  	matrix = preserveCopy;
  	return matrixCopy;

  	// maybe build in error-handler for wrong values of rows, columns
  };
 

/**
 * Crops the matrix to the specified size
 * 
 * @param matrix
 * @param rows
 * @param columns
 */
 /*
function unpadMatrix(matrix, rows, columns) {

	var height = matrix.rows;
	var width = matrix.columns;
	var values = matrix.vector;

	var valuesCopy = numeric.clone(values);
	

	// delete zeros in each row
	for (var i = 0, k = 0; i < rows; i++) {
		
			valuesCopy.splice(k+columns, width-columns);
			k += columns;
		
	}

	valuesCopy.splice(rows*columns, (height-rows)*width);

	
	var matrixCopy = new Matrix(valuesCopy, rows, columns);
	return matrixCopy;

	// maybe build in error-handler for wrong values of rows, columns
};
*/
 

	/**
	 * Replaces the column of a matrix with a vector
	 * 
	 * @param matrix
	 * @param colIndex
	 * @param vector
	 */
	function replaceColumn(matrix, colIndex, vector) {
		var n = matrix.length;

		for (var i = 0; i < n; i++) {
			matrix[i][colIndex] = vector[i];
		}
		return matrix;
	};


/**
 * Replaces the column of a matrix with a vector (own matrix-impl)
 * 
 * @param matrix
 * @param colIndex
 * @param vector
 */
	/*
function replaceColumn(matrix, colIndex, vector) {
	
	var valuesCopy = numeric.clone(matrix.vector);
	var n = matrix.rows;

	for (var i = 0; i < n; i++) {

		valuesCopy[colIndex+i*matrix.columns] = vector[i];
	}
	
	resultMatrix = new Matrix(valuesCopy, n, matrix.columns);
	return resultMatrix;
};
*/


/**
 * Replaces the row of a matrix (own matrix-impl)
 * 
 * @param matrix
 * @param rowIndex
 * @param vector
 * @returns {Matrix}
 */
function replaceRow(matrix, rowIndex, vector) {
	
	var valuesCopy = numeric.clone(matrix.vector)
	var n = matrix.columns;
	
	
	for (var i = 0; i < n; i++) {
		valuesCopy[i+matrix.columns*rowIndex] = vector[i];
	}
	
	resultMatrix = new Matrix(valuesCopy, matrix.rows, matrix.columns);
	return resultMatrix;
}

/**
 * Converts an array with ycbcr-Values to a Matrix (math-lib)
 * 
 * @param array
 *            array with ycbcr-VAlues
 * @param width
 *            width of the original picture
 * @param height
 *            height of the original picture
 * @returns matrix
 */
/*
 * function arrayToMatrix(array, height, width) {
 * 
 * var resultMatrix = math.zeros(height, width); // debugger; // Row-Index var j =
 * 0; // Column-Index var k = 0;
 * 
 * for (var i = 0; i < array.length; i++) { // Reset Column-Index and Row-Index,
 * after width is reached if (k == width) { k = 0; j = j + 1; }
 * 
 * resultMatrix.subset(math.index(j, k), array[i]); k = k + 1; }
 * 
 * return resultMatrix.toArray(); };
 */

/**
 * Converts an array with  to a Matrix (numeric-lib)
 * 
 * @param array
 *            array Alues
 * @param width
 *            width of the desired matrix
 * @param height
 *            height of the desired matrix
 * @returns matrix
 */
function arrayToMatrix(array, height, width) {

	// create a Matrix with zeros
	var resultMatrix = numeric.rep([height, width], 0);
	
	
	// Row-Index
	var j = 0;

	// Column-Index
	var k = 0;



	for (var i = 0; i < array.length; i++) {

		// Reset Column-Index and Row-Index, after width is reached
		if (k == width) {
			k = 0;
			j = j + 1;
		}
		resultMatrix[j][k] = array[i];
		k = k + 1;
	}

	return matrixToInt8(resultMatrix);

};


/**
 * Converts an array with  to a Matrix with Int16-Values (numeric-lib)
 * 
 * @param array
 *            array Alues
 * @param width
 *            width of the desired matrix
 * @param height
 *            height of the desired matrix
 * @returns matrix
 */
function arrayToMatrix16(array, height, width) {

	// create a Matrix with zeros
	var resultMatrix = numeric.rep([height, width], 0);
	
	
	// Row-Index
	var j = 0;

	// Column-Index
	var k = 0;



	for (var i = 0; i < array.length; i++) {

		// Reset Column-Index and Row-Index, after width is reached
		if (k == width) {
			k = 0;
			j = j + 1;
		}
		
		
		resultMatrix[j][k] = array[i];
		k = k + 1;
	}

	return matrixToInt16(resultMatrix);

};


/**
 * Converts an array with to a Matrix (own matrix-impl)
 * 
 * @param array
 *            array Alues
 * @param width
 *            width of the desired matrix
 * @param height
 *            height of the desired matrix
 * @returns matrix
 */

/*
function arrayToMatrix(array, height, width) {


	
	return new Matrix(array, height, width);

};
*/

function matrixToArray(matrix) {

	var resultVector = [];


	for (var i = 0; i < matrix.length; i++) {
		for (var j = 0; j < matrix[i].length; j++) {
			resultVector.push(matrix[i][j]);
		}
	}

	return resultVector;
};


///**
// * 
// * Compresses a matrix by grouping low values
// * 
// * @param matrix matrix to be compressed
// * @param threshold all values <= threshold are grouped
// */
//function compressMatrix(matrix, threshold) {
//	
//	var compressed = numeric.clone(matrix);
//	var n = matrix.length;
//	
//	for (var i = 0; i < n; i++ ) {	
//	var zerocount = 0;
//		
//		for(var j = 0; j < matrix[i].length; j++) {
//			
//			
//			/*
//			if(i==2) {
//				debugger;
//			}
//			*/
//			
//			if(Math.abs(compressed[i][j]) <= threshold) {
//				zerocount++;
//				
//				// end of line reached
//				if(j == (matrix[i].length - 1)) {
//					compressed[i].splice(j-zerocount+1, zerocount, zerocount/1000);
//				}
//			}
//			else {
//				
//				// only grouping, if at least one zero
//				if(zerocount != 0) {
//				compressed[i].splice(j-zerocount, zerocount, zerocount/1000);
//				j -= (zerocount-1);
//				zerocount = 0;
//
//				}
//				
//			}
//		}
//	}
//	return compressed;
//};

function isZero(element, index, array) {
	  return element = 10;
	}

function compressHigh(matrix, quality) {
	threshold = thresholdValue(matrix, quality)
	
	//TODO: wenn LL-Teil nur Nullen: auch komprimieren!!
	
	var rows = matrix.length;
	var split = rows/2;
	
	var rowSplit = matrix[0].length/2
	
	// to preserve LL spectrum of picture compress the upper right quadrant of the matrix	
	for(var i = 0; i<split; i++) {
		
		
		
		
		var secondHalf = createSparseVector(matrix[i], rowSplit, threshold);
		
		// first half only zeroes => store only second half
		if(matrix[i].subarray(0, rowSplit).every(isZero)){
			matrix[i] = secondHalf;
		}
		
		else{
		// create new row vector with first half = original, second half = sparse vector
		var newRowVector = new Int16Array(rowSplit + secondHalf.length);
		newRowVector.set(matrix[i].slice(0, rowSplit));
		newRowVector.set(secondHalf, rowSplit);
		matrix[i] = newRowVector;
		}
	}
	
	// compress both lower quadrants of the matrix
	for(var i = split; i<rows; i++ ) {	
		
		var newRowVector = createSparseVector(matrix[i], 0, threshold);
		matrix[i] = newRowVector;
	}
	debugger;
	return matrix;
	
}


/**
 * Transforms a vector into a sparse vector, beginning at start.
 * Non zero-values are stored as a tuple with (position, value),
 * tuples are two sequent values
 * 
 * @param vector vector to be compressed
 * @param start start-index
 * @param threshold : all values <= threshold are discarded and regarded as zeroes
 */
function createSparseVector(vector, start, threshold) {
	
	var resultVector = new Array();
	var j = 0;
	
	for(var i = start; i < vector.length; i++){
		if(Math.abs(vector[i]) > threshold) {
			
			// push position + value of significant value
			resultVector.push(i);
			resultVector.push(vector[i]);
		}
	}
		return Int16Array.from(resultVector);

}


/**
 * 
 * Compresses a matrix by grouping low values 
 * 
 * @param matrix matrix to be compressed (int16 arrays)
 * @param all values <= threshold are grouped
 */
function compressMatrix(matrix, quality) {
	
	threshold = thresholdValue(matrix, quality)
	
	var compressed = numeric.clone(matrix);
	var n = matrix.length;
	
	
	// only vector to compress
	if (matrix[0].length == undefined) {
	var zerocount = 0;
		
		for(var j = 0; j < n ; j++) {
			
			
			/*
			if(i==2) {
				debugger;
			}
			*/
			
			if(Math.abs(compressed[j]) <= threshold) {
				zerocount++;
				
			}
			else {
				
				// only grouping, if at least one zero
				if(zerocount != 0) {
				compressed.splice(j-zerocount, zerocount, 25000+zerocount);
				j -= (zerocount-1);
				zerocount = 0;
				}
					
			}
		}
		return compressed;
	}
	
	
	for (var i = 0; i < n; i++ ) {	
	var zerocount = 0;
		
		for(var j = 0; j < matrix[i].length; j++) {
			
			
			/*
			if(i==2) {
				debugger;
			}
			*/
			
			if(Math.abs(compressed[i][j]) <= threshold) {
				zerocount++;
				
				// end of line reached
				if(j == (matrix[i].length - 1)) {
					compressed[i].splice(j-zerocount+1, zerocount, 25000+zerocount);
				}
			}
			else {
				
				// only grouping, if at least one zero
				if(zerocount != 0) {
				compressed[i].splice(j-zerocount, zerocount, 25000+zerocount);
				j -= (zerocount-1);
				zerocount = 0;

				}	
			}
		}
	}
	return compressed;
};

///**
// * Decrompresses a matrix by inserting grouped zeros
// * 
// * @param matrix matrix to be decompressed
// */
//function decompressMatrix(matrix, threshold) {
//	
//	var decompressed = numeric.clone(matrix);
//	var n = decompressed.length;
//	
//	for(var i = 0; i < n; i++) {
//		
//		for(var j = 0; j < decompressed[i].length; j++) {
//			 
//			if(Math.abs(decompressed[i][j]) <= threshold && decompressed[i][j] != 0) {
//				
//				var zeronumbers = decompressed[i][j]*1000;
//		//		debugger;
//				// delete grouped zero-element (0.0x)
//				decompressed[i].splice(j, 1);
//				
//				
//				
//				// insert zeros
//				for(var k = 0; k < zeronumbers; k++) {
//					decompressed[i].splice(j, 0, 0);
//				}
//			}
//		}
//	}
//	return decompressed;
//	
//};


/**
 * Decrompresses a matrix by inserting grouped zeros
 * 
 * @param matrix matrix to be decompressed
 */
function decompressMatrix(matrix) {
	
	
	
	var decompressed = numeric.clone(matrix);
	
	// only vector to decompress
	if(matrix[0].length == undefined) {
		
		// decompress vector
		for(var i = 0; i < decompressed.length; i++) {
			 
			if(decompressed[i] > 25000) {
				
				var zeronumbers = decompressed[i] - 25000;
				
				// delete grouped zero-element (25.000 + x)
				decompressed.splice(i, 1);
				
				

				// insert zeros
				for(var k = 0; k < zeronumbers; k++) {
					decompressed.splice(i, 0, 0);
				}
			}
		}
		
		return arrayToInt16(decompressed);
		
	}
	
	// var decompressed = cloneMatrix(matrix, 16);
	
	
	var n = decompressed.length;
	for(var i = 0; i < n; i++) {
		
		for(var j = 0; j < decompressed[i].length; j++) {
			 
			if(decompressed[i][j] > 25000) {
				
				var zeronumbers = decompressed[i][j] - 25000;
				
				// delete grouped zero-element (50.000 + x)
				decompressed[i].splice(j, 1);
				
				

				// insert zeros
				for(var k = 0; k < zeronumbers; k++) {
					decompressed[i].splice(j, 0, 0);
				}
			}
		}
	}
	
	return matrixToInt16(decompressed);
};

function getCompressionRate(matrix1, matrix2) {
	
	var values = 0;
	var n = matrix1.length;
	
	// sum up values
	for (var i = 0; i < n; i++) {
		values += matrix1[i].length;
	}
	
	
	var compressionRate = values / (matrix2.length*matrix2[0].length);
	return compressionRate;
};


function getMaximumValue(matrix) {
	var maximumValue = 0;
	var rows = matrix.length;
	var columns = matrix[0].length;
	
	for(var i = 0; i < rows; i++) {
		for(var j = 0; j< columns; j++) {
			if (matrix[i][j] > maximumValue){
				maximumValue = matrix[i][j];
			}
		}
	}
	return maximumValue;
}

/**
 * Calculates the approximate size of a matrix
 * 
 * @param matrix
 * @param ints Ints (e.g. 8 for Uint8 or 16 for int 16) of the Values in the matrix
 */

function getSizeOfMatrix(matrix, ints) {
	
	var len = matrix.length;
	var valueCount = 0;
	
	if(matrix[0].length == undefined) {
		valueCount = matrix.length;
	}
	else {
	for(var i = 0; i < len; i++) {
		valueCount += matrix[i].length;
			
		}
	}
	
	if(ints == 8) {
		
		// 1 byte per Value at Uint8Clamped
		return valueCount; 
	}
	
	else if(ints == 16) {
		return valueCount*2
	}
	
	else {
		return valueCount*8
	}
}

/**
 * Copys array2 in array1, starting at startposition. 
 * Method is able to copy "around the end"
 * 
 * @param array1 array to be filled
 * @param array2 array to fill in
 * @param startPosition
 */
function arrayInArray(array1, array2, startPosition) {
	
	var len = array2.length;
	var location = startPosition;
	
	for(var i = 0; i < len; i++ ) {
		array1[location] = array2[i];
		
		location = ((location+1)%array1.length);
	}
	
	return array1;
}
	
	


// };


/**
 * 
 * Returns the threshold of the compression algorithm by sorting
 * matrix and discarding a certain percentage of lowest absolute values
 * 
 * @param matrix 
 * @param quality (1-10) 
 * @return threshold-value
 */
function thresholdValue(matrix, quality) {
	var array = [];
	if(matrix[0].length == undefined) {
		array = numeric.clone(matrix);
	}
	else{
	// sort matrix by the highest absolute values
	array = matrixToArray(matrix);
	}
	
	var sorted = array.sort(function(a, b){return Math.abs(a) - Math.abs(b)});
	var percentage;
	
	switch(quality) {
	
	case -3:
		percentage = 99;
		break;
	case -2:
		percentage = 99;
		break;
	case -1:
		percentage = 99;
		break;
	case 0:
		percentage = 98;
		break;
	case 1:
		percentage = 98;
		break;
	case 2:
		percentage = 95;
		break;
	case 3:
		percentage = 92;
		break;
	case 4:
		percentage = 88;
		break;
	case 5: 
		percentage = 85; 
		break;
	case 6: 
		percentage = 82;
		break;
	case 7: 
		percentage = 79;
		break;
	case 8: 
		percentage = 76;
		break;
	case 9: 
		percentage = 65;
		break;
	case 10: 
		percentage = 50;
		break;
	}
	
	
	
	
	var index = parseInt(sorted.length * (percentage/100));
	var thresholdValue = sorted[index];
	

	
	return Math.abs(thresholdValue);
	
	
}
	
	


// };
