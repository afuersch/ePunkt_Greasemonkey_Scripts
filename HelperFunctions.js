/* HELPER Functions */

function addLeadingZeros(countOfZeros, digits, input){
    var output = '';
        
        for (var i = 0; i <= countOfZeros; i++){
                output = output + '0';
        }
        output = output + input;
        output = output.slice((digits*(-1)));
        return output;
}

function randomText(wordCount){
        var maxWordLength = 15;
        var text = "";
        for(var x=0;x<wordCount;x++){
                var randomWordLength = randNumMinMax(1,maxWordLength);
                var word = randomWord(randomWordLength) + " ";
                text += word;
        }
   return text;
}

function randomWord(length){
   var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
   var word = "";

   for(var x=0;x<length;x++) {
      var i = Math.floor(Math.random() * 62);
      word += chars.charAt(i);
   }
   return word;
}

function randNum(limit){
        return Math.floor(Math.random()*limit)+1;
}

function randNumMinMax(min,max){
        return Math.round(Math.random() * (max - min)) + min;
}

function randBool(){
        var ran_number = !! Math.round(Math.random() * 1);

        if (!ran_number) {
                return true;
        } else {
                return false;
        }
}

function selectItemByValue(elmnt, value){
    for(var i=0; i < elmnt.options.length; i++)
    {
      if(elmnt.options[i].value == value)
        elmnt.selectedIndex = i;
    }
}

function createInputButtonElement(text, id, className, fontSize) {
    //Set default size
    fontSize = typeof fontSize !== 'undefined' ? fontSize : '12px';
        
    if( text != "" && text != null && id != "" && id != null){
        var input = document.createElement('INPUT');
        input.type = 'button';
        input.value = text;
        input.id = id;
        input.className= className;
        input.style.marginBottom = "5px";
        input.style.marginTop = "5px";
        input.style.backgroundColor = "#D20032";
        input.style.fontWeight = "bolder";
        input.style.fontSize = fontSize;
        input.style.color = "white";
    
        return input;
    }else{
        return null;
    }
}

//Insert a node after anoder node
function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

//returns a string of actual date and time
function actualDateTimeString(){        
        var now = new Date();
        var day = addLeadingZeros(1,2,now.getDate());
        var month = now.getMonth();
        month += 1;
        month = addLeadingZeros(1,2,month);
        
        var hour = addLeadingZeros(1,2,now.getHours());
        var min = addLeadingZeros(1,2,now.getMinutes());
        
        return actualDateTime = day + '-' + month + ' ' + hour + ':' + min;
}

function addValueById(elementId, elementValue){
	if(document.getElementById(elementId)){
		document.getElementById(elementId).value = elementValue;
	}
}

function selectElementByIndex(elementId, elementIndex){
	if(document.getElementById(elementId)){
		document.getElementById(elementId).selectedIndex = elementIndex; 
	}
}		

function selectElementByValue(elementId, elementValue){
	var elmnt = document.getElementById(elementId);
	if(elmnt){
		for(var i=0; i < elmnt.options.length; i++)
		{
		  if(elmnt.options[i].value.toLowerCase() == elementValue.toString().toLowerCase())
			elmnt.selectedIndex = i;
		}
	}
}	

function checkElementByValue(elementId, elementValue){
	if(document.getElementById(elementId)){
		document.getElementById(elementId).checked = elementValue;
	}
}

/* Create a button with bootstrap class */
function createBootstrapButtonElement(text, id, className) {
    //Set default class name
    className = typeof className !== 'undefined' ? className : 'btn btn-danger';
        
    if( text != "" && text != null && id != "" && id != null){
		var input = document.createElement('INPUT');
        input.type = 'button';
        input.value = text;
        input.id = id;
        input.className = className;
		input.style.marginLeft = "20px";
        return input;
    }else{
        return null;
    }
}

/* Select a random index of a select list */
function selectRandomElement(elementId){
	var elmnt = document.getElementById(elementId);
	if(elmnt){
		var randomIndex = randNum(elmnt.options.length);
		selectElementByIndex(elementId, randomIndex);
	}
}