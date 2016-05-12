sap.ui.jsview("meldungs_handler.main", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf meldungs_handler.main
	*/ 
	getControllerName : function() {
		return "meldungs_handler.main";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf meldungs_handler.main
	*/ 
	createContent : function(oController) {
		

 		
 		//Matrix-Layout mit einer Spalte für die beiden Labels
 		var oLayout = new sap.ui.commons.layout.MatrixLayout({
 			layoutFixed: false,
 			columns : 2
 		});
 		
 		var oSubjectLabel = new sap.ui.commons.Label("subjectLabel", {
 			text: "Subject"
 		});
 		
 		//TextField for the subject of the report
 		var oSubject = new sap.ui.commons.TextField("subject", {
 			width : "400px"
 			
 			
 		});
 		
 		var oReportLabel = new sap.ui.commons.Label("reportLabel", {
 			text: "Report"
 		});
 		
 		var oReport = new sap.ui.commons.TextArea("report", {
 			width : "400px",
 			height : "200px"
 		});
 		
 		/*
 		var oImageUploadLabel = new sap.ui.commons.Label("uploadLabel", {
 			text: "Upload Image"
 		});
 	
 		var ImageUploader = new sap.ui.unified.FileUploader("imageUploader", {
 			fileType : "jpg",
 			width: "400px",
 			
 			//Upload only when submit button is pressed
 			uploadOnChange : false,
 		});
 		*/
 		
 		var qualitySlider = new sap.ui.commons.Slider({
 			id : "qualitySlider",
 			tooltip: "Quality of image compression",
 			width : "40%",
 			totalUnits: 10,
 			min: 1,
 			max: 10,
 			value: 5,
 			smallStepWidth: 1,
 			totalUnits: 1,
 			stepLabels: true,
 			change: function(){oInput.setValue(qualitySlider.getValue());}
 		});
 		
 		var resolutionSlider = new sap.ui.commons.Slider({
 			id : "resolutionSlider",
 			tooltip: "Resolution of result image (Percentage of original)",
 			width : "40%",
 			min: 10,
 			max: 100,
 			value: 100,
 			smallStepWidth: 1,
 			totalUnits: 1,
 			stepLabels: true,
 			change: function(){oInput2.setValue(resolutionSlider.getValue());}
 			
 		});
 		
 		var qualityLabel = new sap.ui.commons.Label({
 			text: "Quality"
 		});
 		
 		var resolutionLabel = new sap.ui.commons.Label({
 			text: "Resolution (%)"
 		});
 		
 		
 		var oInput = new sap.ui.commons.TextField({
 			id : 'input1',
 			value : qualitySlider.getValue(),
 			width: '3em',
 			change : function(){qualitySlider.setValue(parseInt(oInput.getValue(),10));}
 			});
 		
		var oInput2 = new sap.ui.commons.TextField({
 			id : 'input2',
 			value : resolutionSlider.getValue(),
 			width: '3em',
 			change : function(){resolutionSlider.setValue(parseInt(oInput2.getValue(),10));}
 			});
 		
 		var compressButton = new sap.ui.commons.Button({
			text : "Compress",
			tooltip: "Compress picture",
			press : oController.handleCompressButtonClicked
		});
 		
 		var resizeButton = new sap.ui.commons.Button({
			text : "Resize",
			tooltip: "Resize",
			press : oController.handleResizeButtonClicked
		});
 		
 		var submitButton = new sap.ui.commons.Button("submit", {
 			text : "Submit",
 			height : "40px",
 			width : "100px",
 			press: oController.handleSubmitButtonClicked
 		});
 		
 		
 		//Fill Matrix with elements
 		
 		oLayout.createRow(qualityLabel);
 		
 		var oCell0 = new sap.ui.commons.layout.MatrixLayoutCell();
 		oCell0.addContent(qualitySlider);
 		oCell0.addContent(oInput);	
 		var oRow0 = new sap.ui.commons.layout.MatrixLayoutRow();
 		oLayout.addRow(oRow0);
 		oRow0.addCell(oCell0);
 		
 		oLayout.createRow(resolutionLabel);
 		
 		var oCell1 = new sap.ui.commons.layout.MatrixLayoutCell();
 		
 		oCell1.addContent(resolutionSlider);
 		oCell1.addContent(oInput2);
 		
 		
 		var oRow1 = new sap.ui.commons.layout.MatrixLayoutRow();
 		oLayout.addRow(oRow1);
 		oRow1.addCell(oCell1);
 		
 		
 		var oCell = new sap.ui.commons.layout.MatrixLayoutCell();
 	
 		
 		oCell.addContent(compressButton);
 		oCell.addContent(resizeButton);
 		
 		
 		var oRow = new sap.ui.commons.layout.MatrixLayoutRow();
 		oLayout.addRow(oRow);
 		oRow.addCell(oCell);
 		// oLayout.createRow(compressButton, resizeButton);
 		
 		oLayout.createRow(oSubjectLabel);
 		oLayout.createRow(oSubject);
 		oLayout.createRow(oReportLabel);
 		oLayout.createRow(oReport);
 		
// 		oLayout.createRow(oImageUploadLabel);
// 		oLayout.createRow(ImageUploader);
 		oLayout.createRow(submitButton);
 		
 		
 		
 		return oLayout;
 		
	}

});