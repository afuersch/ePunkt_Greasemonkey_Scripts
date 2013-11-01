// ==UserScript==
// @name        eR_Helper_All_In_One
// @namespace   ePunkt
// @description A context menu for the eR with often used links and some helper Functions: 1.) Fill ePunkt time tracker with default values<br/> 2.) "Speichern" und "Vorschau" Buttons oben im Stelleninseratseditor anfügen 3.) CSS Style erweitern
// @include     http://staging.epunkt.net/Builds/Beta/eRecruiter/*
// @include     http://staging.epunkt.net/Builds/Dev/eRecruiter/*
// @include     https://er.epunkt.net/*
// @version     1.0.2 
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
 *
 * TODO: add updateURL parameter to meta data to check vor updates automatically
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
 

 
 // div für context Menü erstellen
document.getElementsByTagName('body')[0].innerHTML += "<div id='eRContexMenuDiv' style=''></div>";

// ausführen wenn die Html-Seite geladen wurde
unsafeWindow.$(document).ready(function(){
	// reagieren, wenn im Browserfenster eine Taste gedrückt wurde
	unsafeWindow.$(document).keypress(function(e) {
		// ausführen wenn Taste 'strg' + 'xxxxx' gedrückt wurde (default: '^')
		// als Zahl die Ascii-Nummer
		if (e.ctrlKey && e.which == eval(eR_Settings_MenuShortCutKey)){ //94 =>^   35 => '#'
			//show the contextMenu
			$("#eRContexMenuDiv").contextMenu({x: 500, y: 123});
		}
		
		//If the user forget his choosen key open the menu always with alt + 1
		if (e.altKey && e.which == 49){
			//show the contextMenu
			$("#eRContexMenuDiv").contextMenu({x: 500, y: 123});
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
	  'eR_Settings_ExtendedCss_InUse'
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
