/**
 * Some orthogonal filters for the calculation of wavelets.
 * 
 * Source:
 * http://www.codeproject.com/Articles/825687/Discrete-Wavelet-Transforms-a-Java-Implementation
 * 
 * Coefficients from "Adapted Wavelet Analysis from Theory to Software", Victor Wickerhauser
 * 
 */


	/**
	 * @param H
	 * low pass filter for QMF pair 
	 * @ return high pass filter for QMF pair
	 */

	function getHighPass(H) {
		var sign = 1;
		var n = H.length;
		var G = new Array(n);
		for (var i = 0; i < n; i++) {
			G[n - i - 1] = H[i] * sign;
			sign *= -1;
		}
		return G;
	};

	/**
	 * Lowpass-Filter, the original version supports other wavelets (Haar,
	 * Beylkin), but this function only supports "daub"echies-Wavelets.
	 * 
	 * 
	 * @param order
	 * order of the "daub"echies-Wavelet @ return high pass filter for QMF pair
	 * @return Low Pass filter for QMF pair
	 */
	function getLowPass(order) {
		switch (order) {
		case 4: { // (Wickerhauser)
			var f = [ .482962913144534160, .836516303737807940,
					.224143868042013390, -.129409522551260370 ];
			return f;

		}
		case 6: {// (Wickerhauser)
			var f = [ 0.332670552950082630, 0.806891509311092550,
					0.459877502118491540, -0.135011020010254580,
					-0.0854412738820266580, 0.0352262918857095330 ];
			return f;

		}
		case 8: {// (Wickerhauser but order reversed)
			var f = [ 0.2303778133090, 0.7148465705530, 0.6308807679300,
					-0.02798376941700, -0.1870348117190, 0.03084138183700,
					0.032883011667, -0.01059740178500 ];

			return f;

		}
		case 10: {// (Wickerhauser but order reversed)
			var f = [ 0.160102397974, 0.603829269797, 0.724308528438,
					0.138428145901, -0.242294887066, -0.032244869585,
					0.07757149384, -0.006241490213, -0.012580751999,
					0.003335725285 ];
			return f;

		}
		case 12: {// (Wickerhauser but order reversed)
			var f = [ 0.11154074335, 0.494623890398, 0.751133908021,
					0.315250351709, -0.226264693965, -0.129766867567,
					0.097501605587, 0.02752286553, -0.031582039318,
					0.000553842201, 0.004777257511, -0.001077301085 ];
			return f;

		}
		case 14: {// (Wickerhauser but order reversed)
			var f = [ 0.077852054085, 0.396539319482, 0.729132090846,
					0.469782287405, -0.143906003929, -0.224036184994,
					0.071309219267, 0.080612609151, -0.038029936935,
					-0.016574541631, 0.012550998556, 0.000429577973,
					-0.001801640704, 0.0003537138 ];
			return f;

		}
		case 16: {// (Wickerhauser but order reversed)
			var f = [ 0.054415842243, 0.312871590914, 0.675630736297,
					0.585354683654, -0.015829105256, -0.284015542962,
					0.000472484574, 0.12874742662, -0.017369301002,
					-0.044088253931, 0.013981027917, 0.008746094047,
					-0.004870352993, -0.000391740373, 0.000675449406,
					-0.000117476784 ];
			return f;

		}
		case 18: {// (Wickerhauser but order reversed)
			var f = [ 0.038077947364, 0.243834674613, 0.60482312369,
					0.657288078051, 0.133197385825, -0.293273783279,
					-0.096840783223, 0.148540749338, 0.030725681479,
					-0.067632829061, 0.000250947115, 0.022361662124,
					-0.004723204758, -0.004281503682, 0.001847646883,
					0.000230385764, -0.000251963189, 0.00003934732 ];
			return f;

		}
		case 20: {// Wavelab src
			var f = [ 0.026670057901, 0.188176800078, 0.527201188932,
					0.688459039454, 0.281172343661, -0.249846424327,
					-0.195946274377, 0.127369340336, 0.093057364604,
					-0.071394147166, -0.029457536822, 0.033212674059,
					0.003606553567, -0.010733175483, 0.001395351747,
					0.001992405295, -0.000685856695, -0.000116466855,
					0.00009358867, -0.000013264203 ];
			return f;
		}
		}
	};
	/**
	 * Returns vector with analysis highpass filter coefficients
	 * 
	 * (source paper JPEG2000: The upcoming still image compression standard)
	 * 
	 * @param wavelet ("daub","galle") daubechies or le galle
	 * @returns vector with analysis filter coefficients
	 */
	function getHighPassAnalysis(wavelet) {
		
		if(wavelet == "galle") {
			var f = [-0.5, //position -1 
			        1,	  //position 0
			        -0.5]; //position 1
			return f;
		} else if(wavelet == "daub") {
			var f = [0.091271763114,   //-3
                     -0.057543526229,  //-2
                     -0.591271763114,  //-1
                         1.11508705,   //0
                     -0.591271763114,  //1
                     -0.057543526229,  //2
                     0.091271763114  //3
			        ];
			return f;
		} else{
			alert("wavelet must be daub or galle");
		}
		
	
		};
		
		/**
		 * Returns vector with synthesis filter highpass coefficients
		 * 
		 * (source paper JPEG2000: The upcoming still image compression standard)
		 * 
		 * @param wavelet ("daub","galle") daubechies or le galle
		 * @returns vector with synthesis highpass filter coefficients
		 */
		function getHighPassSynthesis(wavelet) {
			
			if(wavelet == "galle") {
				var f = [-0.125, //-2
                        -0.25,   //-1
                        0.75,   // 0
                        -0.25,   // 1
                       -0.125];// 2 
				return f;
			} else if(wavelet == "daub") {
				var f = [0.026748757411,   //-4
				         0.016864118443,   //-3
                         -0.078223266529,   //-2
                         -0.266864118443,   //-1
                          0.602949018236,   //0
                         -0.266864118443,   //1
                         -0.078223266529,   //2
                          0.016864118443,   //3
                          0.026748757411
				        ];
				        
				
			return f;
			} else{
				alert("wavelet must be daub or galle");
			}
			};
			
			/**
			 * Returns vector with analysis lowpass filter coefficients
			 * 
			 * (source paper JPEG2000: The upcoming still image compression standard)
			 * 
			 * @param wavelet ("daub","galle") daubechies or le galle
			 * @returns vector with synthesis highpass filter coefficients
			 */
			function getLowPassAnalysis(wavelet) {
				
				if(wavelet == "galle") {
					var f = [-0.125, //-2
	                        0.25,   //-1
	                        0.75,   // 0
	                        0.25,   // 1
	                       -0.125];// 2 
					return f;
				} else if(wavelet == "daub") {
					var f = [ 0.026748757411,  //-4
	                            -0.016864118443, //-3
	                            -0.078223266529, //-2
	                            0.266864118443,  //-1
	                            0.602949018236,  //0
	                            0.266864118443,  //1
	                            -0.078223266529, //2
	                            -0.016864118443, //3
	                            0.026748757411]; //4

					        
					
				return f;
				} else{
					alert("wavelet must be daub or galle");
				}
				};
				
				/**
				 * Returns vector with analysis lowpass filter coefficients
				 * 
				 * (source paper JPEG2000: The upcoming still image compression standard)
				 * 
				 *@param wavelet ("daub","galle") daubechies or le galle
				 * @returns vector with synthesis highpass filter coefficients
				 */
				function getLowPassSynthesis(wavelet) {
					
					if(wavelet == "galle") {
						var f = [0.5, //position -1 
						        1,	  //position 0
						        0.5]; //position 1
						return f;
					} else if(wavelet == "daub") {
						var f = [-0.091271763114,   //-3
			                     -0.057543526229,  //-2
			                     0.591271763114,  //-1
			                         1.11508705,   //0
			                     0.591271763114,  //1
			                     -0.057543526229,  //2
			                     -0.091271763114  //3
						        ];
						return f;
					} else{
						alert("wavelet must be daub or galle");
					}
					};
	
	
	

