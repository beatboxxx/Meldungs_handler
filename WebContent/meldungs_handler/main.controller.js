sap.ui.controller("meldungs_handler.main", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf meldungs_handler.main
*/
//	onInit: function() {
//		this.initLoad();
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf meldungs_handler.main
*/
//	onBeforeRendering: function() {
//		this.initLoad();
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf meldungs_handler.main
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf meldungs_handler.main
*/
//	onExit: function() {
//
//	}

	handleSubmitButtonClicked: function() {
		alert("Pressed");
	},
	
	handleCompressButtonClicked: function() {
		
		
		
		//evtl oben quality-value übergeben
		var image = new Image();
        
        
        var canvas = document.createElement("canvas");
        
        var ctx = canvas.getContext("2d");
  		
        
        var currentFile = document.getElementById('fileToUpload').files[0];
        
        if(currentFile == null) {
        	alert("Choose a file first");
        	
        }
        
        else {
        
        	
       
        var fr = new FileReader();

        fr.onload = function() { // file is loaded
        	
        		//get quality value from slider
			
			var threshold = sap.ui.getCore().byId("qualitySlider").getValue();
			var resolution = sap.ui.getCore().byId("resolutionSlider").getValue();
        	
			
			
			
			var img = new Image();
          img.src = fr.result; // is the data URL because called with readAsDataURL
          document.getElementById('content2').appendChild(img);
          
         
          var compressedHeight = img.height * (resolution/100);
          var compressedWidth = img.width * (resolution/100);
          
          ctx.drawImage(img,0,0, img.width, img.height);
          
          /*
          var compressedImg = new Image();
			compressedImg.width = img.height * (resolution/100);
			compressedImg.height = img.width * (resolution/100);;
			var dataURL = canvas.toDataURL();
			
			compressedImg.src = dataURL;
			
			compressedImg.onload = function() {
			
			var ctx2 = canvas.getContext("2d");	
			
			}
			*/
			
			var compressedCanvas = document.createElement("canvas");
			compressedCanvas.width = compressedWidth;
			compressedCanvas.height = compressedHeight;
			var ctxcompr = compressedCanvas.getContext("2d")
		
			ctxcompr.drawImage(img, 0, 0, compressedWidth, compressedHeight);
			
         
          
			document.getElementById('content2').appendChild(img);
			
			var imageData = ctxcompr.getImageData(0,0,compressedWidth, compressedHeight);
			
			//var pixels  = getCanvasImageData(compressedImg);
			
			

			//start Konversion: brauche canvas mit image-data
		
			
			var compressed = compressImage(imageData, threshold);
			
			var decompressed = decompressImage(compressed,threshold);
			
			for (var i=0; i<imageData.data.length; i++) {
				imageData.data[i] = decompressed[i];
				}
			

			
			
			
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.putImageData(imageData, 0, 0);
			
			var compressed = new Image();
			compressed.width = compressedWidth;
			compressed.height = compressedHeight;
			var dataURL = compressedCanvas.toDataURL();

			compressed.src = dataURL;
			
			compressed.onload = function() {
				document.getElementById('content2').appendChild(compressed);
				var imageData = ctx.getImageData(0, 0, compressedWidth, compressedHeight);
				}
			

			
			
			
			
			
			}
			
			
          
        

        fr.readAsDataURL(currentFile);
        }
	},
	
	handleResizeButtonClicked: function() {
		
		debugger;
		var image = new Image();
        
        
        var canvas = document.createElement("canvas");
        
        var ctx = canvas.getContext("2d");
        
  		
        var currentFile2 = document.getElementById('fileToUpload').files[0];
        
        
       
       
        var fr2 = new FileReader();

        fr2.onload = function(event) { // file is loaded
            
        	alert("Bin drinnen");
			var img = new Image();
          img.src = fr.result; // is the data URL because called with readAsDataURL
         
          document.getElementById('content2').appendChild(img);
          
          var height = img.height/4
          var width = img.width/4;
          
          canvas.height = height;
          canvas.width = width;
         
          
          var compressed = new Image();
			compressed.width = height;
			compressed.height = width;
			var dataURL = canvas.toDataURL();

			compressed.src = dataURL;
			
			compressed.onload = function() {
			document.getElementById('content2').appendChild(compressed);
			var imageData = ctx.getImageData(0, 0, height, width);
          
          
          
          ctx.drawImage(img,0,0);
 
			
			document.getElementById('content2').appendChild(compressed);
          
        };

        fr2.readAsDataURL(currentFile2);
	};
	}
	
	


});