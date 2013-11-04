// ==UserScript==
// @name        eR_Helper_All_In_One
// @namespace   ePunkt
// @description A context menu for the eR with often used links and some helper Functions: 1.) Fill ePunkt time tracker with default values 2.) "Speichern" und "Vorschau" Buttons oben im Stelleninseratseditor anfügen 3.) CSS Style erweitern 4.) Bewerber erstellen (create1.aspx & create2.aspx) 5.) Kunde erstellen 6.) Kundendetails ausfülen 7.) Benutzerdefinierte Felder beim Kunden befüllen
// @include     http://staging.epunkt.net/Builds/Beta/eRecruiter/*
// @include     http://staging.epunkt.net/Builds/Dev/eRecruiter/*
// @include     http://localhost:50527/*
// @include     https://er.epunkt.net/*
// @version     1.0.3 
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require		https://raw.github.com/WinniB/ePunkt_Greasemonkey_Scripts/master/HelperFunctions.js
// @require		https://raw.github.com/WinniB/ePunkt_Greasemonkey_Scripts/master/ContextMenuHelper.js
// @require		https://raw.github.com/medialize/jQuery-contextMenu/master/src/jquery.ui.position.js
// @require		https://raw.github.com/medialize/jQuery-contextMenu/master/src/jquery.contextMenu.js
// @resource 	contexMenusCss	https://raw.github.com/medialize/jQuery-contextMenu/master/src/jquery.contextMenu.css
// @resource 	ePunktCss https://raw.github.com/WinniB/ePunkt_Greasemonkey_Scripts/master/ePunktScriptStyles.css
// @updateURL 	https://raw.github.com/WinniB/ePunkt_Greasemonkey_Scripts/master/eR_Helper_All_In_One.user.js
// @downloadURL https://raw.github.com/WinniB/ePunkt_Greasemonkey_Scripts/master/eR_Helper_All_In_One.user.js
// @icon		https://er.epunkt.net/favicon.ico
// ==/UserScript==

/*
 * v 1.0.0	17.10.2013 create
 * v 1.0.1	31.10.2013 add CSS from external file and add 
 * v 1.0.2	add update and download path
 * v 1.0.3	04.11.2013 add create applicant at create1.aspx & create2.aspx, create company, fill company detail page, fill company customFields
 *
*/
var ePunktCssSource = GM_getResourceText("ePunktCss");

eR_Settings_Menu_Width = GM_getValue("settings_Menu_Width", 600);
eR_Settings_MenuShortCutKey = GM_getValue("eR_Settings_MenuShortCutKey",94); //'^'

eR_Settings_MyUserId = GM_getValue("eR_Settings_MyUserId",383);

eR_Settings_TimeTracker_InUse = GM_getValue("eR_Settings_TimeTracker_InUse",true);
eR_Settings_TimeTracker_StartHour = GM_getValue("eR_Settings_TimeTracker_StartHour",6);
eR_Settings_TimeTracker_StartMinute = GM_getValue("eR_Settings_TimeTracker_StartMinute",50);
eR_Settings_TimeTracker_EndHour = GM_getValue("eR_Settings_TimeTracker_EndHour",16);
eR_Settings_TimeTracker_EndMinute = GM_getValue("eR_Settings_TimeTracker_EndMinute",25);
eR_Settings_TimeTracker_drpBreak = GM_getValue("eR_Settings_TimeTracker_drpBreak",30);

eR_Settings_JobAdTemplateButtons_InUse = GM_getValue("eR_Settings_JobAdTemplateButtons_InUse", true);

var defaultExtendedCss = "button, html input[type='button'], input[type='reset'], input[type='submit'] { background-color: #FF9BEC !important; } button:hover, html input[type='button']:hover, input[type='reset']:hover, input[type='submit']:hover { background-color: #D1E8FF !important; }";
eR_Settings_ExtendedCss_InUse = GM_getValue("eR_Settings_ExtendedCss_InUse", false);
eR_Settings_ExtendedCss = GM_getValue("eR_Settings_ExtendedCss", defaultExtendedCss);

eR_Settings_CreateApplicantAtCreate1_InUse = GM_getValue("eR_Settings_CreateApplicantAtCreate1_InUse", true);

eR_Settings_CreateApplicantAtCreate2_InUse = GM_getValue("eR_Settings_CreateApplicantAtCreate2_InUse", true);

eR_Settings_CreateCompany_InUse = GM_getValue("eR_Settings_CreateCompany_InUse", true);

eR_Settings_FillCompanyDetail_InUse = GM_getValue("eR_Settings_FillCompanyDetail_InUse", true);

eR_Settings_FillCompanyCustomFields_InUse = GM_getValue("eR_Settings_FillCompanyCustomFields_InUse", true);


//Add CSS style for flat button 
GM_addStyle(".ePunktButtonFlat { background-color: #00529E; border: medium none; border-radius: 3px 3px 3px 3px; color: #FFFFFF; margin: 4px 4px 4px 4px!important; padding: 3px 7px 3px 7px;}");

// ausführen wenn die Html-Seite geladen wurde
unsafeWindow.$(document).ready(function(){
	// reagieren, wenn im Browserfenster eine Taste gedrückt wurde
	unsafeWindow.$(document).keypress(function(e) {
		// ausführen wenn Taste 'strg' + 'xxxxx' gedrückt wurde (default: '^')
		// als Zahl die Ascii-Nummer
		if (e.ctrlKey && e.which == eval(eR_Settings_MenuShortCutKey)){ //94 =>^   35 => '#'
			//show the contextMenu
			$(".TabEmpty").contextMenu({x: 500, y: 123});
		}
		
		//If the user forget his choosen key open the menu always with alt + 1
		if (e.altKey && e.which == 49){
			//show the contextMenu
			$(".TabEmpty").contextMenu({x: 500, y: 123});
		}
		
		//Shortcut for open the settings menu (alt + 3)
		if (e.altKey && e.which == 51){
			setTimeout(	function(){ createOverlay(); }, 500);
		}
	});
});
 

// CSS Pfad: html body form#aspnetForm table tbody tr td.TabEmpty img
// <img src="/Core/File.aspx?logo=1">
//alert("Hallo");

var contexCssSource = GM_getResourceText("contexMenusCss");

var allIconSelectors = "";
allIconSelectors = allIconSelectors + getIconSelector("globalTrans", "Gfx/Icons/Small/JobAd.png");
allIconSelectors = allIconSelectors + getIconSelector("clientTrans", "Gfx/Icons/Small/worker2_blue.png");
allIconSelectors = allIconSelectors + getIconSelector("mandatorSettings", "Gfx/Icons/Small/Companies.png");
allIconSelectors = allIconSelectors + getIconSelector("portalSettings", "Gfx/Icons/Small/applicant.png");
allIconSelectors = allIconSelectors + getIconSelector("companyPortalSettings", "Gfx/Icons/Small/AddInformationToHistoryFromCompany.png");
allIconSelectors = allIconSelectors + getIconSelector("administration", "Gfx/Icons/Small/Options.png");
allIconSelectors = allIconSelectors + getIconSelector("jobAd", "Gfx/Icons/Small/ApplicantAccepts.png");
allIconSelectors = allIconSelectors + getIconSelector("timeTracker", "Gfx/Icons/Small/History.png");
allIconSelectors = allIconSelectors + getIconSelector("quit", "Gfx/Icons/Small/Delete.png");
allIconSelectors = allIconSelectors + getIconSelector("myUserSettings", "Gfx/Icons/Small/worker2_green.png");
allIconSelectors = allIconSelectors + getIconSelector("settings", "favicon.ico");

//Replace an existing icon selector in the original css with our new ones
var newCssSource = contexCssSource.replace(".context-menu-item.icon-edit { background-image: url(images/page_white_edit.png); }",allIconSelectors);

//Replace all other original icon selectors to use only mine
newCssSource = newCssSource.replace(".context-menu-item.icon-cut { background-image: url(images/cut.png); }","");
newCssSource = newCssSource.replace(".context-menu-item.icon-copy { background-image: url(images/page_white_copy.png); }","");
newCssSource = newCssSource.replace(".context-menu-item.icon-paste { background-image: url(images/page_white_paste.png); }","");
newCssSource = newCssSource.replace(".context-menu-item.icon-delete { background-image: url(images/page_white_delete.png); }","");
newCssSource = newCssSource.replace(".context-menu-item.icon-add { background-image: url(images/page_white_add.png); }","");
newCssSource = newCssSource.replace(".context-menu-item.icon-quit { background-image: url(images/door.png); }","");

GM_addStyle(newCssSource);

$(function createMenu(){
    $.contextMenu({
        selector: '.TabEmpty', //alternativ: ".LeftPanel"
        callback: function(key, options) {
            //global callback
			//var m = "clicked: " + key;
            //window.console && console.log(m) || alert(m);
        },
        items: {
            "globalTrans": {
				name: "Global Translations",
				icon: "globalTrans",
				// superseeds "global" callback
				callback: function(key, options) {			
					var url = getFullDomainPath() + "Core/Admin/Admin/Translations/Global.aspx";
					window.open(url, '_blank');
					window.focus();	
				}
			},
			"clientTrans": {
				name: "Client Translations", 
				icon: "clientTrans",
				// superseeds "global" callback
				callback: function(key, options) {				
					var url = getFullDomainPath() + "Core/Admin/Admin/Translations/Mandator.aspx";
					window.open(url, '_blank');
					window.focus();	
				}
			},
			"mandatorSettings": {
				name: "Mandanten Einstellungen", 
				icon: "mandatorSettings",
				// superseeds "global" callback
				callback: function(key, options) {				
					var url = getFullDomainPath() + "Core/Admin/Admin/Mandator/";
					window.open(url, '_blank');
					window.focus();	
				}
			},
			"portalSettings": {
				name: "Bewerberportal Einstellungen", 
				icon: "portalSettings",
				// superseeds "global" callback
				callback: function(key, options) {				
					var url = getFullDomainPath() + "Core/Admin/Admin/PortalSettings/";
					window.open(url, '_blank');
					window.focus();	
				}
			},
			"companyPortalSettings": {
				name: "Kundenportal Einstellungen", 
				icon: "companyPortalSettings",
				// superseeds "global" callback
				callback: function(key, options) {				
					var url = getFullDomainPath() + "Core/Admin/Admin/CompanyPortalSettings/";
					window.open(url, '_blank');
					window.focus();	
				}
			},
			"myUserSettings": {
				name: "Eigenen Benutzer bearbeiten", 
				icon: "myUserSettings",
				// superseeds "global" callback
				callback: function(key, options) {				
					var url = getFullDomainPath() + "Core/Admin/User/User.aspx?Id=" + eval(eR_Settings_MyUserId);					
					window.open(url, '_blank');
					window.focus();	
				}
			},
            "sep1": "---------",
			"administration": {
				name: "Administration", 
				icon: "administration",
				// superseeds "global" callback
				callback: function(key, options) {				
					var url = getFullDomainPath() + "Core/Admin/";
					window.open(url, '_blank');
					window.focus();	
				}
			},
			"jobAd": {
				name: "Stelleninseratsvorlagen", 
				icon: "jobAd",
				// superseeds "global" callback
				callback: function(key, options) {				
					var url = getFullDomainPath() + "Core/Admin/Admin/JobAdTemplates/";
					window.open(url, '_blank');
					window.focus();	
				}
			},
			"timeTracker": {
				name: "Zeiterfassung", 
				icon: "timeTracker",
				// superseeds "global" callback
				callback: function(key, options) {				
					var url = getFullDomainPath() + "Modules/TimeTracker/";
					content.wrappedJSObject.location=url;
				}
			},
			"settings": {
				name: "Settings", 
				icon: "settings",
				// superseeds "global" callback
				callback: function(key, options) {	
					setTimeout(	function(){ createOverlay(); }, 500);	
					//jQuery.noConflict();
					//$(".context-menu-list").contextMenu("hide");
				}
			},
			"sep2": "---------",
            "quit": {name: "Quit", icon: "quit"}
        }
    });
    
    $('.TabEmpty').on('click', function(e){
        console.log('clicked', this);
    })
	
	
});

/*** Check which Buttons need to be created (depends on url) ***/
var urlPath = getUrlPath();

if(eval(eR_Settings_TimeTracker_InUse)){
	if(urlPath.indexOf("Modules/TimeTracker") != -1){
		TimeTracker_GenerateButton();
	}
}

if(eval(eR_Settings_JobAdTemplateButtons_InUse)){	
	if(urlPath.indexOf("Core/Admin/Admin/JobAdTemplates/Default.aspx?template=") != -1){
		GM_addStyle(".extraButton { background-color: #00529E; border: medium none; border-radius: 3px 3px 3px 3px; color: #FFFFFF; margin: 4px 4px 4px 4px!important; padding: 3px 7px 3px 7px;}");
		JobAdTemplateButtons_Generate();
	}
}

if(eval(eR_Settings_ExtendedCss_InUse)){
	//add this on all eR sites
	GM_addStyle(eR_Settings_ExtendedCss);
}

if(eval(eR_Settings_CreateApplicantAtCreate1_InUse)){
	if(urlPath.indexOf("Core/Applicant/Create1.aspx") != -1){
		CreateApplicantAtCreate1_GenerateButton();
	}
}

if(eval(eR_Settings_CreateApplicantAtCreate2_InUse)){
	if(urlPath.indexOf("Core/Applicant/Create2.aspx") != -1){
		CreateApplicantAtCreate2_GenerateButton();
	}
}

if(eval(eR_Settings_CreateCompany_InUse)){
	if(urlPath.indexOf("Core/Company/Create.aspx") != -1){
		CreateCompany_GenerateButton();
	}
}

if(eval(eR_Settings_FillCompanyDetail_InUse)){
	if(urlPath.indexOf("Core/Company/Company.aspx") != -1){
		FillCompanyDetail_GenerateButton();
	}
}

if(eval(eR_Settings_FillCompanyCustomFields_InUse)){
	if(urlPath.indexOf("Core/Company/CustomFields.aspx") != -1){
		FillCompanyCustomFields_GenerateButton();
	}
}




/*** Functions to help us ***/
function getFullDomainPath(){
	var fullPathName = window.location.href;
	var pos = fullPathName.indexOf("/Core/");
	if( pos == -1){ pos = fullPathName.indexOf("/Modules/"); }
	var pathName = fullPathName.substring(0, pos+1);
	return pathName;
}

function getUrlPath(){
	var fullPathName = window.location.href;
	var pos = fullPathName.indexOf("/Core/");
	var pathName = fullPathName.substring(pos, fullPathName.length);
	return pathName;
}

function getIconSelector(selectorName, iconFilePath){
	var iconPath = "url(" + getFullDomainPath() + iconFilePath + ")";
	var iconSelector = ".context-menu-item.icon-" + selectorName + " { background-image: " + iconPath + "; }\n";
	return iconSelector;
}


/*** START Overlay ***/
function createOverlay() {
    if(document.getElementById('bg_shadow')){
        // If shadow-box already created, just show it
        if (document.getElementById('bg_shadow').style.display == "none") {
            document.getElementById('bg_shadow').style.display = "";
        }
    }else{
        var html = "";
        // Seite abdunkeln
        html += "<div id='bg_shadow' style='width: 100%; height: 100%; background-color: #000000; position:fixed; top: 0; left: 0; opacity: 0.5; filter: alpha(opacity=50);'></div>";
        document.getElementsByTagName('body')[0].innerHTML += html;
        document.getElementById('bg_shadow').addEventListener("click", btnClose, false);
    }
  
    if(document.getElementById('erSetting_overlay') && document.getElementById('erSetting_overlay').style.display == "none"){
        // If menu already created, just show it
        document.getElementById('erSetting_overlay').style.display = "";
    }else{
        var html = "";
        var width = eval(eR_Settings_Menu_Width);
        
        //Style from external CSS file
		html += "<style>";
		html += ePunktCssSource;
		html += "</style>";

        // Overlay erstellen
        html += "<div id='erSetting_overlay' align='center'>";
        html += "<h3 class='erGM_headline'>";
        html += "eR Greasemonkey Script Settings";
        html += "</h3>";
        
        html += "Setting-Page-Width: <input class='erSetting_form' type='text' size='3' id='settings_Menu_Width' value='" + eval(eR_Settings_Menu_Width) +"'> px" + show_help("With this option you can expand the small layout. The default-value of gc.com is 450 px.") + "<br>";

		html += "<h5 class='erGM_subHeadline'>Contex menu key combination</h5>";		
		html += "Strg + : <input class='erSetting_form' type='text' size='1' id='eR_Settings_MenuShortCutKey' value='" +  String.fromCharCode(eval(eR_Settings_MenuShortCutKey)) +"'> " + show_help('Used key for key combination');
		html += "<br/>";
		html += "<br/>";
		
		
		html += "<h5 class='erGM_subHeadline'>User ID: ";
		html += inputField("eR_Settings_MyUserId", "", "", "User ID for open the correct user-permissions page") + "</h5><br/>";
		
		html += checkbox_Use_Block('eR_Settings_JobAdTemplateButtons_InUse', "Job ad template buttons", "erGM_SettingBlock_JobAdTemplateButtons");
		html += "<div id='erGM_SettingBlock_JobAdTemplateButtons' " + (eval(eR_Settings_JobAdTemplateButtons_InUse) ? "" : "class='darkClass'") + ">";
		html += "</div>";
		html += "<br/>";
		
		html += checkbox_Use_Block('eR_Settings_TimeTracker_InUse', "Time Tracker", "erGM_SettingBlock_TimeTracker");
		html += "<div id='erGM_SettingBlock_TimeTracker' " + (eval(eR_Settings_TimeTracker_InUse) ? "" : "class='darkClass'") + ">";		
		html += inputField("eR_Settings_TimeTracker_StartHour", "Start hour:", "", "") + " ";
		html += inputField("eR_Settings_TimeTracker_StartMinute", "minute:", "", "") + "<br/>";
		html += inputField("eR_Settings_TimeTracker_EndHour", "End hour:", "", "") + " ";
		html += inputField("eR_Settings_TimeTracker_EndMinute", "minute:", "", "") + "<br/>";
		html += inputField("eR_Settings_TimeTracker_drpBreak", "Break:", "", "") + "<br/>";
		html += "</div>";
		html += "<br/>";
		
		html += checkbox_Use_Block('eR_Settings_ExtendedCss_InUse', "Extended CSS", "erGM_SettingBlock_ExtendedCss");
		html += "<div id='erGM_SettingBlock_ExtendedCss' " + (eval(eR_Settings_ExtendedCss_InUse) ? "" : "class='darkClass'") + ">";
		html += textArea("eR_Settings_ExtendedCss", "Extended CSS Code:", 4, 50, "");
		html += "</div>";
		html += "<br/>";
		
		html += checkbox_Use_Block('eR_Settings_CreateApplicantAtCreate1_InUse', "Add 'Create Applicant' Button at Create1.aspx", "erGM_SettingBlock_CreateApplicantAtCreate1");
		html += "<div id='erGM_SettingBlock_CreateApplicantAtCreate1' " + (eval(eR_Settings_CreateApplicantAtCreate1_InUse) ? "" : "class='darkClass'") + ">";
		html += "</div>";	
		html += checkbox_Use_Block('eR_Settings_CreateApplicantAtCreate2_InUse', "Add 'Create Applicant' Button at Create2.aspx", "erGM_SettingBlock_CreateApplicantAtCreate2");
		html += "<div id='erGM_SettingBlock_CreateApplicantAtCreate2' " + (eval(eR_Settings_CreateApplicantAtCreate2_InUse) ? "" : "class='darkClass'") + ">";
		html += "</div>";
		html += "<br/>";
		
		html += checkbox_Use_Block('eR_Settings_CreateCompany_InUse', "Add 'Create Company' Button", "erGM_SettingBlock_CreateCompany");
		html += "<div id='erGM_SettingBlock_CreateCompany' " + (eval(eR_Settings_CreateCompany_InUse) ? "" : "class='darkClass'") + ">";
		html += "</div>";
		html += "<br/>";
		
		html += checkbox_Use_Block('eR_Settings_FillCompanyDetail_InUse', "Fill Company Details", "erGM_SettingBlock_FillCompanyDetail");
		html += "<div id='erGM_SettingBlock_FillCompanyDetail' " + (eval(eR_Settings_FillCompanyDetail_InUse) ? "" : "class='darkClass'") + ">";
		html += "</div>";
		html += "<br/>";
		
		html += checkbox_Use_Block('eR_Settings_FillCompanyCustomFields_InUse', "Fill Company Custom Fields", "erGM_SettingBlock_FillCompanyCustomFields");
		html += "<div id='erGM_SettingBlock_FillCompanyCustomFields' " + (eval(eR_Settings_FillCompanyCustomFields_InUse) ? "" : "class='darkClass'") + ">";
		html += "</div>";
		html += "<br/>";
				
		html += "<br/>";
		html += "<input class='erSetting_form' id='btn_close1' type='button' value='close'> "; 
        html += "<input class='erSetting_form' id='btn_save' type='button' value='Save'>";
		
        html += "</div>";

      document.getElementsByTagName('body')[0].innerHTML += html;
	  
	  document.getElementById("settings_Menu_Width").focus();
  
      document.getElementById('btn_close1').addEventListener("click", btnClose, false);
      document.getElementById('btn_save').addEventListener("click", btnSave, false);
    }
  }
  
  // Close the Overlays
function btnClose(){
  if(document.getElementById('bg_shadow')) document.getElementById('bg_shadow').style.display = "none";
  if (document.getElementById('erSetting_overlay')) document.getElementById('erSetting_overlay').style.display = "none";
  
  //Reload Page because contex menu won't work otherwise (2DO=>Fix it)
  setTimeout(	function(){  content.wrappedJSObject.location=window.location.href; }, 500);	
}

// Save Button
function btnSave(){
	GM_setValue("eR_Settings_MyUserId", document.getElementById('eR_Settings_MyUserId').value);
	
	GM_setValue("eR_Settings_TimeTracker_StartHour", document.getElementById('eR_Settings_TimeTracker_StartHour').value);
	GM_setValue("eR_Settings_TimeTracker_StartMinute", document.getElementById('eR_Settings_TimeTracker_StartMinute').value);
	GM_setValue("eR_Settings_TimeTracker_EndHour", document.getElementById('eR_Settings_TimeTracker_EndHour').value);
	GM_setValue("eR_Settings_TimeTracker_EndMinute", document.getElementById('eR_Settings_TimeTracker_EndMinute').value);
	GM_setValue("eR_Settings_TimeTracker_drpBreak", document.getElementById('eR_Settings_TimeTracker_drpBreak').value);
	GM_setValue("eR_Settings_ExtendedCss", document.getElementById('eR_Settings_ExtendedCss').value);

	GM_setValue("settings_Menu_Width", document.getElementById('settings_Menu_Width').value);

    //Save Checkboxes
    var checkboxes = new Array(
	  'eR_Settings_TimeTracker_InUse',
	  'eR_Settings_JobAdTemplateButtons_InUse',
	  'eR_Settings_ExtendedCss_InUse',
	  'eR_Settings_CreateApplicantAtCreate1_InUse',
	  'eR_Settings_CreateApplicantAtCreate2_InUse',
	  'eR_Settings_CreateCompany_InUse',
	  'eR_Settings_FillCompanyDetail_InUse',
	  'eR_Settings_FillCompanyCustomFields_InUse'
    );

    for (var i = 0; i < checkboxes.length; i++) {
        GM_setValue(checkboxes[i], document.getElementById(checkboxes[i]).checked);
    }
	alert('Settings saved!');
}

/*** END Overlay ***/











/*** START TimeTracker ***/
function TimeTracker_GenerateButton(){
	var clickEvent = function (e) {
		TimeTracker_FillForm();
	}

	var input = createInputButtonElement('Fill with default values', 'TimeTracker_FillButton', 'epunkt-button');
	input.onclick = clickEvent;	
	
	document.getElementById('tblWork').appendChild( input );
}

function TimeTracker_FillForm(){
	selectItemByValue(document.getElementById("ctl00_Main_drpStartHour"), eval(eR_Settings_TimeTracker_StartHour)); 	
	selectItemByValue(document.getElementById("ctl00_Main_drpStartMinute"), eval(eR_Settings_TimeTracker_StartMinute)); 
	selectItemByValue(document.getElementById("ctl00_Main_drpEndHour"), eval(eR_Settings_TimeTracker_EndHour)); 
	selectItemByValue(document.getElementById("ctl00_Main_drpEndMinute"), eval(eR_Settings_TimeTracker_EndMinute)); 
	selectItemByValue(document.getElementById("ctl00_Main_drpBreak"), eval(eR_Settings_TimeTracker_drpBreak)); 
}
/*** END TimeTracker ***/


/*** START JobAdTemplateButtons ***/
function JobAdTemplateButtons_Generate(){
	//Preview Button
	var clickEventPreview = function (e) {
		JobAdTemplateButtons_ClickPreview();
	}
	
	var input = createInputButtonElement('Vorschau', 'GM_PreviewButton', 'extraButton');
	input.onclick = clickEventPreview;
	
	var parent = document.getElementById('ctl00_Main_txtName').parentNode;
	insertAfter(parent, input);
	
	//Save Button
	var clickEventSave = function (e) {
		$("#ctl00_Main_btnUpdate").click();
	}
	
	var inputSave = createInputButtonElement('Speichern', 'GM_SaveButton', 'extraButton');
	inputSave.onclick = clickEventSave;
	
	var parentSave = document.getElementById('ctl00_Main_txtName').parentNode;
	insertAfter(parentSave, inputSave);
}

function JobAdTemplateButtons_ClickPreview(){
	$("#preview").click();
}
/*** END JobAdTemplateButtons ***/

/*** START CreateApplicantAtCreate1 ***/
function CreateApplicantAtCreate1_GenerateButton(){
	var clickEvent = function (e) {
		CreateApplicantAtCreate1_FillForm();
	}

	var input = createInputButtonElement('Without CV Parser', 'CreateApplicantAtCreate1_FillButton', 'ePunktButtonFlat');
	input.onclick = clickEvent;	
	
	var parent = document.getElementById('ctl00_Main_btnCvParser').parentNode;
	parent.insertBefore(input, parent.firstChild);
}

function CreateApplicantAtCreate1_FillForm(){
	//alert('In function "fillForm"');
	if(document.getElementById("ctl00_Main_drpCvParser")){
		document.getElementById("ctl00_Main_drpCvParser").selectedIndex = 0; 
	}
	document.getElementById("ctl00_Main_btnCvParser").click();
}
/*** END CreateApplicantAtCreate1 ***/

/*** START CreateApplicantAtCreate2 ***/
function CreateApplicantAtCreate2_GenerateButton(){
	var clickEvent = function (e) {
		CreateApplicantAtCreate2_FillForm();
	}

	var input = createInputButtonElement('Fill Applicants Data', 'CreateApplicantAtCreate2_FillButton', 'ePunktButtonFlat');
	input.onclick = clickEvent;

	var parent = document.getElementById('ctl00_Main_btnSave').parentNode;
	parent.insertBefore(input, parent.firstChild);
}

function CreateApplicantAtCreate2_FillForm(){
	var FirstName = 'ePunkt';
	var LastName = 'ePunkt eR ' + actualDateTimeString();
	
	var Title = randNum(7);
	var TitleAfterName = randNum(9); 
	
	var BirthDate = '01.01.2000';
	
	var Street = 'ePunkt Plaza';
	var ZipCode = '4020';
	
	var City = 'Linz';
	var Country = 14; //Austria
	
	var Gender = randNum(2);
	var Nationality = 14; //Austria
	
	var randWord = randomWord(10);
	var Email = randWord + '@mailsendbox.net';
	
	var Phone = '12345';
	var PhoneTime = randNum(4);
	
	var Tags = "C#, GreaseMonkey generated";
	var Referrer = randNum(29) + 1;
	
	var Classification = randNum(4);
	
	addValueById("ctl00_Main_PersonalData_txtFirstName", FirstName);
	addValueById("ctl00_Main_PersonalData_txtLastName", LastName);
	selectElementByIndex("ctl00_Main_PersonalData_drpTitle", Title);
	selectElementByIndex("ctl00_Main_PersonalData_drpTitleAfterName", TitleAfterName);
	addValueById("ctl00_Main_PersonalData_txtBirthdate", BirthDate);
	addValueById("ctl00_Main_PersonalData_txtStreet", Street);
	addValueById("ctl00_Main_PersonalData_txtZipCode", ZipCode);
	addValueById("ctl00_Main_PersonalData_txtCity", City);
	selectElementByIndex("ctl00_Main_PersonalData_drpCountry", Country);
	selectElementByIndex("ctl00_Main_PersonalData_drpGender", Gender);
	selectElementByIndex("ctl00_Main_PersonalData_drpNationality", Nationality);
	addValueById("ctl00_Main_PersonalData_txtEmail", Email);
	addValueById("ctl00_Main_PersonalData_txtPhone", Phone);
	addValueById("ctl00_Main_PersonalData_drpPhoneTime", PhoneTime);
	addValueById("ctl00_Main_Tags_txtTags", Tags);
	selectElementByIndex("ctl00_Main_Referrer_drpReferrer", Referrer);
	selectElementByIndex("ctl00_Main_Classification_drpClassification", Classification);

	//var logText = "Applicant: " + FirstName + ' ' + LastName + "\tEmail: " + Email;
	//console.log(logText);
}
/*** END CreateApplicantAtCreate2 ***/

/*** START CreateCompany ***/
function CreateCompany_GenerateButton(){
	var clickEvent = function (e) {
		CreateCompany_FillForm();
	}
	var input = createInputButtonElement('Fill Company Data', 'CreateCompany_FillButton', 'ePunktButtonFlat');
	input.onclick = clickEvent;

	var parent = document.getElementById('ctl00_Main_btnSave').parentNode;
	parent.insertBefore(input, parent.firstChild);
}

function CreateCompany_FillForm(){
	/*Kunde*/
	var Name = 'Mars Express ' + actualDateTimeString();
	var Street = 'Fifth Avenue 99';
	var ZipCode = '6666';
	var City = 'Lost Paradise';
	var Website = 'www.TheFifthElement.zorg';
	
	addValueById("ctl00_Main_txtName", Name);
	addValueById("ctl00_Main_txtStreet", Street);
	addValueById("ctl00_Main_txtZipCode", ZipCode);
	addValueById("ctl00_Main_txtCity", City);
	addValueById("ctl00_Main_txtUrl", Website);

	/*Ansprechpartner*/
	var Gender = randNumMinMax(0,1);
	var Title = 'Mr.';
	var FirstName = 'Korben';
	var LastName = 'Dallas eR ' + actualDateTimeString();
	var Position = 'Taxi Driver';
	var Phone = '0900 121 232';
	var randWord = randomWord(10);
	var Email = randWord + '@TheFifthElement.zorg';	

	selectElementByIndex("ctl00_Main_drpGender", Gender);
	addValueById("ctl00_Main_txtTitle", Title);
	addValueById("ctl00_Main_txtFirstName", FirstName);
	addValueById("ctl00_Main_txtLastName", LastName);
	addValueById("ctl00_Main_txtPosition", Position);
	addValueById("ctl00_Main_txtPhone", Phone);
	addValueById("ctl00_Main_txtEmail", Email);
	addValueById("ctl00_Main_txtTitle", Title);
	
	//var logText = "Company: " + Name + "\tEmail: " + Email;
	//console.log(logText);
}
/*** END CreateCompany ***/




/*** START FillCompanyDetail ***/
function FillCompanyDetail_GenerateButton(){
	var clickEvent = function (e) {
		FillCompanyDetail_FillForm();
	}
	var input = createInputButtonElement('Fill Company Details', 'FillCompanyDetail_FillButton', 'ePunktButtonFlat');
	input.onclick = clickEvent;

	var parent = document.getElementById('ctl00_Main_btnSave').parentNode;
	parent.insertBefore(input, parent.firstChild);
}

function FillCompanyDetail_FillForm(){
	//Kundenstatus
	var companySatus = {
		eRecruiter: randNumMinMax(0,8), //Index to select
		ItConsulting: randNumMinMax(0,8), //Index to select,
		Personalberatung: randNumMinMax(0,8), //Index to select
		Talentor: randNumMinMax(0,8) //Index to select
	}

	//Fälligkeitsdatum
	selectElementByIndex("ctl00_Main_companyStatiRepeater_ctl01_drpCompanyStatus", companySatus.eRecruiter);
	selectElementByIndex("ctl00_Main_companyStatiRepeater_ctl02_drpCompanyStatus", companySatus.ItConsulting);
	selectElementByIndex("ctl00_Main_companyStatiRepeater_ctl03_drpCompanyStatus", companySatus.Personalberatung);
	selectElementByIndex("ctl00_Main_companyStatiRepeater_ctl04_drpCompanyStatus", companySatus.Talentor);
	
	//Informationen zur Rechnungslegung
	var UID = randomWord(randNumMinMax(1,9));
	var TermOfPayment = randNumMinMax(1, 99);
	
	addValueById("ctl00_Main_txtUid", UID);
	addValueById("ctl00_Main_txtTermOfPayment", TermOfPayment);
}
/*** END FillCompanyDetail ***/


/*** START FillCompanyCustomFields ***/
function FillCompanyCustomFields_GenerateButton(){
	var clickEvent = function (e) {
		FillCompanyCustomFields_FillForm();
	}
	var input = createInputButtonElement('Fill Custom Fields', 'FillCompanyCustomFields_FillButton', 'ePunktButtonFlat');
	input.onclick = clickEvent;

	var parent = document.getElementById('ctl00_Main_btnSave').parentNode;
	parent.insertBefore(input, parent.firstChild);
}

function FillCompanyCustomFields_FillForm(){
	var now = new Date();
	var day = addLeadingZeros(1,2,now.getDate());
	var month = now.getMonth();
	month += 1;
	month = addLeadingZeros(1,2,month);
	
	var hour = addLeadingZeros(1,2,now.getHours());
	var min = addLeadingZeros(1,2,now.getMinutes());
	
	//Anmerkungen
	var comments = randomText(43);
	
	//Benefits
	var benefits = {
		Vorsorge: randBool(),
		Erreichbarkeit: randBool(),
		Arbeitszeit: randBool(),
		Essen: randBool(),
		Handy: randBool(),
		Parkplatz: randBool(),
		Firmenauto: randBool(),
		Gesundheit: randBool(),
		HomeOffice: randBool(),
		Laptop: randBool(),
		Weiterbildung: randBool(),
		Mitarbeiterrabatte: randBool(),
		Obst: randBool(),
		OEffi: randBool()
	}

	//Bevorzugte Qualifikationen
	var qualifications = randomText(15);
	
	//Geplante Einstellungen
	var planedHire = randomWord(randNumMinMax(5,25));
	//Geschäftskontakt/Partner
	var partner = randNumMinMax(0,5); //ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl04_drpValue
	//Gründungsjahr
	var established = randNumMinMax(1900,2013);
	//Mitarbeiter
	var employees = randNumMinMax(0,6);
	//Mögliche Positionen
	var possiblePos = randomText(22);
	
	//Zahlungsmodalitäten
	var paymentTerms = randomText(9);
	
	addValueById("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl00_txtValue", comments);
	checkElementByValue("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl01_lstValue_0", benefits.Vorsorge);
	checkElementByValue("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl01_lstValue_1", benefits.Erreichbarkeit);
	checkElementByValue("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl01_lstValue_2", benefits.Arbeitszeit);
	checkElementByValue("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl01_lstValue_3", benefits.Essen);
	checkElementByValue("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl01_lstValue_4", benefits.Handy);
	checkElementByValue("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl01_lstValue_5", benefits.Parkplatz);
	checkElementByValue("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl01_lstValue_6", benefits.Firmenauto);
	checkElementByValue("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl01_lstValue_7", benefits.Gesundheit);
	checkElementByValue("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl01_lstValue_8", benefits.HomeOffice);
	checkElementByValue("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl01_lstValue_9", benefits.Laptop);
	checkElementByValue("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl01_lstValue_10", benefits.Weiterbildung);
	checkElementByValue("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl01_lstValue_11", benefits.Mitarbeiterrabatte);
	checkElementByValue("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl01_lstValue_12", benefits.Obst);
	checkElementByValue("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl01_lstValue_13", benefits.OEffi);
	addValueById("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl02_txtValue", qualifications);	
	addValueById("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl03_txtValue", planedHire);
	selectElementByIndex("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl04_drpValue", partner);
	addValueById("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl05_txtValue", established);
	selectElementByIndex("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl06_drpValue", employees);
	addValueById("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl07_txtValue", possiblePos);
	addValueById("ctl00_Main_customFields_groupRepeater_ctl00_repeater_ctl08_txtValue", paymentTerms);
}
/*** END FillCompanyCustomFields ***/