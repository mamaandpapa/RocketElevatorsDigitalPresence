
var Building_Type  = ""   // Element changes ( For Dropbox SELECT BUILDING ) 
var Service_Type   = ""   // Element changes ( For Radios  SELECT SERVICE ) 

var doorVal     = ""
var floorVal    = ""
var basementVal = ""
var parkingVal  = ""
var occupantVal = ""
var activityVal = ""
var floorVal    = ""

// ***  DOCUMENT.READY *** \\ 
$(document).ready(function(){	

	Case_Building_Type() //must be here to hide all inputs.
		
	$('#mainForm').on('change', function(){
			
		Building_Type = $('#selectBuilding option:selected').text();
		Service_Type = $("input[name='serviceQuality']:checked"). val();
				
		Case_Building_Type()   // step 1
		Calcul_Nb_Elevators()  // step 2
		Give_Red_Warning();    // step 3
		Calcul_Price()		   // step 4					
		
	});

	$('input').on('keyup', function(){
		Case_Building_Type()   // step 1
		Calcul_Nb_Elevators()  // step 2
		Give_Red_Warning();    // step 3
		Calcul_Price()		   // step 4
	});

});
// ***  / DOCUMENT.READY *** \\ 


function Case_Building_Type() {
	
	$(".inputDiv").hide(); // Hide all

	$('#floorLbl').html('Number of floors *');
	$('#basementLbl').html('Number of basements *');
	$('#parkingLbl').html('Number of parkings *');
	$('#elevatorLbl').html('Number of elevators *');
	$('#occupantLbl').html('Number Max. of occupants per floor *');
	$('#activityLbl').html('Number of hours of activity in the building *');
			
	switch(Building_Type) {
		case "Residential":
					$('#doorNum, #floorNum, #basementNum').show();
					$('#doorLbl').html('Number of apartments *'); // Change label		
			break;
		case "Commercial":
					$('#doorNum , #floorNum , #basementNum , #parkingNum , #elevatorNum').show();
					$('#doorLbl').html('Number of stores *');	// Change label			
			break;
		case "Corporate":
					$('#doorNum , #floorNum , #basementNum , #parkingNum , #occupantNum').show();
					$('#doorLbl').html('Number of tenant compagnies *');// Change label		
			break;
		case "Hybrid":
					$('#doorNum , #floorNum , #basementNum , #parkingNum , #occupantNum , #activityNum').show();
					$('#doorLbl').html('Number of stores *');	// Change label					
			break;
		default:
					$(".inputDiv").hide();	
		};
		
};
function Calcul_Nb_Elevators() {
	
	$('#elevatorQuantity').val(0); // Always reset

	dorVal = parseInt($('#doorVal').val()); // Doors (Appart - Store or tenantbusiniss)
	flrVal = parseInt($('#floorVal').val()); // Foors
	bstVal = parseInt($('#basementVal').val()); // Basement
	pkgVal = parseInt($('#parkingVal').val()); // Parking
	elvVal = parseInt($('#elevatorVal').val()); // Elevators
	maxOccupVal = parseInt($('#occupantVal').val()); // Max occupacy
	actVal = parseInt($('#activityVal').val()); // Hour of activity

	switch(Building_Type) {
		
		case "Commercial":
			nbAscTot = elvVal;
		break;
		
		case "Residential":	
				var avrgDoor = (dorVal / flrVal); 	///////////////// Moyenne de logement per floor
				var TotalElevator = (Math.ceil(avrgDoor / 6));  //////////////// le besoin QTY d'ascensseur per floor
				var FloorAllTotal = (flrVal + bstVal);  ///////////// Nombre total de floors and basement.
				var ElPerColone = (Math.ceil(FloorAllTotal / 20)); /// Nombre total de colonne
				var nbAscTot = (ElPerColone * TotalElevator);						
		break;
		
		default: // "Corporatif" and "Hybrid"
						
				var FloorAllTotal = parseInt(flrVal) + parseInt(bstVal);
				var NbPersTotalCorp = (FloorAllTotal * maxOccupVal);
				var NbElCorp = Math.ceil(NbPersTotalCorp / 1000);
				
				var NbColoneCorp = Math.ceil(FloorAllTotal / 20);
				var ElPerColone = Math.ceil(NbElCorp / NbColoneCorp);
				var nbAscTot = NbColoneCorp * ElPerColone;					
	};

	if (isNaN(nbAscTot)){ // is value null
		nbAscTot = 0
	} else {
		$('#elevatorQuantity').val(nbAscTot);
	}; 	
};
function Give_Red_Warning() {
	
	var Warning_Msg = false
	$.each($('input[type=number]:visible'),function(){	
		if (isNaN(parseInt(this.value))){ // is value null
			Warning_Msg = true;
		}; 
	});
		if (Warning_Msg == false) {;
			$('#msg').html(""); 
		} else {
			$('#msg').html("All required fields must be filled!");
		};
};
function Calcul_Price() {

	$('#totalPrice').val("");
	
		switch(Service_Type) {
			case "standard":	
				var pourcentage = 7565
				var installation = 1.10		
			break;
			case "premium":
				pourcentage = 12345
				installation = 1.13
			break;
			case "excelium":
				pourcentage = 15400
				installation = 1.16
			break;	
		};
		
	var nbElev = $('#elevatorQuantity').val()
	var subPrice = nbElev * pourcentage
	
	$('#totalPrice').val((subPrice * installation).toFixed(2));
};
