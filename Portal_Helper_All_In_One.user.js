// ==UserScript==
// @name        Portal_Helper_All_In_One
// @namespace   ePunkt
// @include     http://localhost:1901/*
// @include     http://staging.epunkt.net/Builds/Beta/Portal/*
// @include     http://staging.epunkt.net/Builds/Dev/Portal/*
// @description A context menu with a settings area and some helper functions for the ePunkt applicant Portal: 1.) Log out from portal with key combination 2.)Fill Sign Up Form 3.) Fill Education Dialog 4.) Fill Publication Dialog 5.) Fill Work Experience Dialog
// @version     1.0.3  
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @require		https://raw.github.com/WinniB/ePunkt_Greasemonkey_Scripts/master/HelperFunctions.js
// @require		https://raw.github.com/WinniB/ePunkt_Greasemonkey_Scripts/master/ContextMenuHelper.js
// @require		https://raw.github.com/medialize/jQuery-contextMenu/master/src/jquery.ui.position.js
// @require		https://raw.github.com/medialize/jQuery-contextMenu/master/src/jquery.contextMenu.js
// @resource 	contexMenusCss	https://raw.github.com/medialize/jQuery-contextMenu/master/src/jquery.contextMenu.css
// @resource 	ePunktCss https://raw.github.com/WinniB/ePunkt_Greasemonkey_Scripts/master/ePunktScriptStyles.css
// @updateURL 	https://raw.github.com/WinniB/ePunkt_Greasemonkey_Scripts/master/Portal_Helper_All_In_One.user.js
// @downloadURL https://raw.github.com/WinniB/ePunkt_Greasemonkey_Scripts/master/Portal_Helper_All_In_One.user.js
// @icon		https://raw.github.com/WinniB/ePunkt_Greasemonkey_Scripts/master/PortalIcon.png
// ==/UserScript==

/*
 * v 1.0.0	18.10.2013 create
 * v 1.0.1	31.10.2013 add CSS from external file
 * v 1.0.2	add update and download path
 * v 1.0.3	04.11.2013 add icon
*/

var ePunktCssSource = GM_getResourceText("ePunktCss");

eR_Settings_Menu_Width = GM_getValue("settings_Menu_Width", 600);
eR_Settings_MenuShortCutKey = GM_getValue("eR_Settings_MenuShortCutKey",94); //'^'

eR_Settings_PortalSignUp_InUse = GM_getValue("eR_Settings_PortalSignUp_InUse",true);
eR_Settings_PortalSignUp_UseDateTime = GM_getValue("eR_Settings_PortalSignUp_UseDateTime",true);
eR_Settings_PortalSignUp_FirstName = GM_getValue("eR_Settings_PortalSignUp_FirstName","ePunkt");
eR_Settings_PortalSignUp_LastName = GM_getValue("eR_Settings_PortalSignUp_LastName","ePunkt");
eR_Settings_PortalSignUp_Phone = GM_getValue("eR_Settings_PortalSignUp_Phone","12345");
eR_Settings_PortalSignUp_Email = GM_getValue("eR_Settings_PortalSignUp_Email","ePunktUser@epunkttest.com");
eR_Settings_PortalSignUp_Email_UseRandom = GM_getValue("eR_Settings_PortalSignUp_Email_UseRandom",true);
eR_Settings_PortalSignUp_BirthDate = GM_getValue("eR_Settings_PortalSignUp_BirthDate","01.01.2000");
eR_Settings_PortalSignUp_Street = GM_getValue("eR_Settings_PortalSignUp_Street","ePunkt Plaza");
eR_Settings_PortalSignUp_ZipCode = GM_getValue("eR_Settings_PortalSignUp_ZipCode","4020");
eR_Settings_PortalSignUp_City = GM_getValue("eR_Settings_PortalSignUp_City","Linz");
eR_Settings_PortalSignUp_Country  = GM_getValue("eR_Settings_PortalSignUp_Country",13); // default: Austria
eR_Settings_PortalSignUp_Nationality = GM_getValue("eR_Settings_PortalSignUp_Nationality",14); // default: Austria
eR_Settings_PortalSignUp_UserName = GM_getValue("eR_Settings_PortalSignUp_UserName","ePunktUser");
eR_Settings_PortalSignUp_UserName_UseRandom = GM_getValue("eR_Settings_PortalSignUp_UserName_UseRandom",true);
eR_Settings_PortalSignUp_Password = GM_getValue("eR_Settings_PortalSignUp_Password","ePunkt");

eR_Settings_FillEducationDialog_InUse = GM_getValue("eR_Settings_FillEducationDialog_InUse",true);

eR_Settings_FillPublicationDialog_InUse = GM_getValue("eR_Settings_FillPublicationDialog_InUse",true);

eR_Settings_FillWorkExperienceDialog_InUse = GM_getValue("eR_Settings_FillWorkExperienceDialog_InUse",true);



// div für context Menü erstellen
document.getElementsByTagName('body')[0].innerHTML += "<div id='ApplicantPortalContexMenuDiv' style=''></div>";

// ausführen wenn die Html-Seite geladen wurde
unsafeWindow.$(document).ready(function(){
	// reagieren, wenn im Browserfenster eine Taste gedrückt wurde
	unsafeWindow.$(document).keypress(function(e) {
		// ausführen wenn Taste 'strg' + 'xxxxx' gedrückt wurde (default: '^')
		// als Zahl die Ascii-Nummer
		if (e.ctrlKey && e.which == eval(eR_Settings_MenuShortCutKey)){ //94 =>^   35 => '#'
			//show the contextMenu
			$("#ApplicantPortalContexMenuDiv").contextMenu({x: 500, y: 123});
		}
		
		//If the user forget his choosen key open the menu always with alt + 1
		if (e.altKey && e.which == 49){
			//show the contextMenu
			$("#ApplicantPortalContexMenuDiv").contextMenu({x: 500, y: 123});
		}
		
		//Shortcut for open the settings menu (alt + 3)
		if (e.altKey && e.which == 51){
			setTimeout(	function(){ createOverlay(); }, 500);
		}
	});
});

eR_Settings_LogOutFromPortal_InUse = GM_getValue("eR_Settings_LogOutFromPortal_InUse",true);
eR_Settings_LogOutFromPortal_Key = GM_getValue("eR_Settings_LogOutFromPortal_Key",246); //ö

var contexCssSource = GM_getResourceText("contexMenusCss");

var allIconSelectors = "";
allIconSelectors = allIconSelectors + getIconSelector("jobs", "http://icons.iconarchive.com/icons/custom-icon-design/pretty-office-11/16/number-1-icon.png");
allIconSelectors = allIconSelectors + getIconSelector("signUp", "http://icons.iconarchive.com/icons/custom-icon-design/pretty-office-11/16/number-2-icon.png");
allIconSelectors = allIconSelectors + getIconSelector("overview", "http://icons.iconarchive.com/icons/iconarchive/red-orb-alphabet/16/Number-1-icon.png");
allIconSelectors = allIconSelectors + getIconSelector("baseData", "http://icons.iconarchive.com/icons/iconarchive/red-orb-alphabet/16/Number-2-icon.png");
allIconSelectors = allIconSelectors + getIconSelector("jobProfiles", "http://icons.iconarchive.com/icons/iconarchive/red-orb-alphabet/16/Number-3-icon.png");
allIconSelectors = allIconSelectors + getIconSelector("jobRequirements", "http://icons.iconarchive.com/icons/iconarchive/red-orb-alphabet/16/Number-4-icon.png");
allIconSelectors = allIconSelectors + getIconSelector("experience", "http://icons.iconarchive.com/icons/iconarchive/red-orb-alphabet/16/Number-5-icon.png");
allIconSelectors = allIconSelectors + getIconSelector("education", "http://icons.iconarchive.com/icons/iconarchive/red-orb-alphabet/16/Number-6-icon.png");
allIconSelectors = allIconSelectors + getIconSelector("additionalInformation", "http://icons.iconarchive.com/icons/iconarchive/red-orb-alphabet/16/Number-7-icon.png");
allIconSelectors = allIconSelectors + getIconSelector("accounts", "http://icons.iconarchive.com/icons/iconarchive/red-orb-alphabet/16/Number-8-icon.png");
allIconSelectors = allIconSelectors + getIconSelector("settings", "https://er.epunkt.net/favicon.ico");
allIconSelectors = allIconSelectors + getIconSelector("quit", "https://er.epunkt.net/Gfx/Icons/Small/Delete.png");

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
        selector: '#ApplicantPortalContexMenuDiv',
		//selector: '#logOff',
        callback: function(key, options) {
            //global callback
			//var m = "clicked: " + key;
            //window.console && console.log(m) || alert(m);
        },
        items: {
            "jobs": {
				name: "Jobs",
				icon: "jobs",
				// superseeds "global" callback
				callback: function(key, options) {	
					var url = getHostAndPort() + "/jobs";
					window.open(url, '_blank');
					window.focus();	
				}
			},
            "signUp": {
				name: "Anmelden",
				icon: "signUp",
				// superseeds "global" callback
				callback: function(key, options) {			
					var url = getHostAndPort() + "/signUp";
					window.open(url, '_blank');
					window.focus();	
				}
			},
			"sep1": "---------",
            "overview": {
				name: "Übersicht",
				icon: "overview",
				// superseeds "global" callback
				callback: function(key, options) {			
					var url = getHostAndPort() + "/Applicants/Index";
					window.open(url, '_blank');
					window.focus();	
				}
			},
			"baseData": {
				name: "Persönliche Daten", 
				icon: "baseData",
				// superseeds "global" callback
				callback: function(key, options) {				
					var url = getHostAndPort() + "/Applicants/BaseData";
					window.open(url, '_blank');
					window.focus();	
				}
			},
			"jobProfiles": {
				name: "Berufsprofile", 
				icon: "jobProfiles",
				// superseeds "global" callback
				callback: function(key, options) {				
					var url = getHostAndPort() + "/Applicants/JobProfiles";
					window.open(url, '_blank');
					window.focus();	
				}
			},
			"jobRequirements": {
				name: "Berufl. Anforderungen", 
				icon: "jobRequirements",
				// superseeds "global" callback
				callback: function(key, options) {				
					var url = getHostAndPort() + "/Applicants/JobRequirements";
					window.open(url, '_blank');
					window.focus();	
				}
			},
			"experience": {
				name: "Berufserfahrung", 
				icon: "experience",
				// superseeds "global" callback
				callback: function(key, options) {				
					var url = getHostAndPort() + "/Applicants/Experience";
					window.open(url, '_blank');
					window.focus();	
				}
			},
			"education": {
				name: "Ausbildung", 
				icon: "education",
				// superseeds "global" callback
				callback: function(key, options) {				
					var url = getHostAndPort() + "/Applicants/Education";					
					window.open(url, '_blank');
					window.focus();	
				}
			},
			"additionalInformation": {
				name: "Zusatzinformationen", 
				icon: "additionalInformation",
				// superseeds "global" callback
				callback: function(key, options) {				
					var url = getHostAndPort() + "/Applicants/AdditionalInformation";					
					window.open(url, '_blank');
					window.focus();	
				}
			},
			"accounts": {
				name: "Externe Profile", 
				icon: "accounts",
				// superseeds "global" callback
				callback: function(key, options) {				
					var url = getHostAndPort() + "/Applicants/Account";					
					window.open(url, '_blank');
					window.focus();	
				}
			},
            "sep2": "---------",
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
			"sep3": "---------",
            "quit": {name: "Quit", icon: "quit"}
        }
    });
    
    $('.TabEmpty').on('click', function(e){
        console.log('clicked', this);
    })
	
	
});

/*** Check which Buttons/Functions need to be created (depends on url) ***/
var urlPath = getUrlPath();
var fullPathName = window.location.href;

if(eval(eR_Settings_LogOutFromPortal_InUse)){	
	if( (fullPathName.indexOf("http://localhost:1901/Applicants/Index") != -1) || (fullPathName.indexOf("http://localhost:1901/Jobs/Index") != -1) || (fullPathName.indexOf("http://localhost:1901/SignUp/") != -1) ){
		LogOutFromPortal();
	}
}

if(eval(eR_Settings_PortalSignUp_InUse)){	
	if( (fullPathName.indexOf("/SignUp") != -1) || (fullPathName.indexOf("SignUp/Index") != -1) ){
		PortalSignUp_GenerateButton();
	}
}

if(eval(eR_Settings_FillEducationDialog_InUse)){	
	if( fullPathName.indexOf("/Applicants/Education") != -1 ){
		FillEducationDialog_GenerateButton();
	}
}

if(eval(eR_Settings_FillPublicationDialog_InUse)){	
	if( (fullPathName.indexOf("/Applicants/AdditionalInformation") != -1) || (fullPathName.indexOf("/Applicants/JobRequirements") != -1) || (fullPathName.indexOf("/Applicants/JobProfiles") != -1) ){
		FillPublicationDialog_GenerateButton();
	}
}

if(eval(eR_Settings_FillWorkExperienceDialog_InUse)){
	if( fullPathName.indexOf("/Applicants/Experience") != -1 ){
		FillWorkExperienceDialog_GenerateButton();
	}
}

/*** Functions to help us ***/
function getHostAndPort(){
	return window.location.origin;
}

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
        html += "Applicant portal Greasemonkey Script Settings";
        html += "</h3>";
        
        html += "Setting-Page-Width: <input class='erSetting_form' type='text' size='3' id='settings_Menu_Width' value='" + eval(eR_Settings_Menu_Width) +"'> px" + show_help("With this option you can expand the small layout. The default-value of gc.com is 450 px.") + "<br>";
		
		html += "<h5 class='erGM_subHeadline'>Contex menu key combination</h5>";		
		html += "Strg + : <input class='erSetting_form' type='text' size='1' id='eR_Settings_MenuShortCutKey' value='" +  String.fromCharCode(eval(eR_Settings_MenuShortCutKey)) +"'> " + show_help('Used key for key combination');
		html += "<br/>";
		html += "<br/>";
		
		html += checkbox_Use_Block('eR_Settings_LogOutFromPortal_InUse', "Log out from portal with key combination", "erGM_SettingBlock_LogOutFromPortal");
		html += "<div id='erGM_SettingBlock_LogOutFromPortal' " + (eval(eR_Settings_LogOutFromPortal_InUse) ? "" : "class='darkClass'") + ">";	
		html += "Strg + : <input class='erSetting_form' type='text' size='1' id='eR_Settings_LogOutFromPortal_Key' value='" +  String.fromCharCode(eval(eR_Settings_LogOutFromPortal_Key)) +"'> " + show_help('Used key for key combination');
		html += "</div>";
		html += "<br/>";
		
		html += checkbox_Use_Block('eR_Settings_PortalSignUp_InUse', "Portal sign up", "erGM_SettingBlock_PortalSignUp");
		html += "<div id='erGM_SettingBlock_PortalSignUp' " + (eval(eR_Settings_PortalSignUp_InUse) ? "" : "class='darkClass'") + ">";	
		html += checkbox('eR_Settings_PortalSignUp_UseDateTime', "Use date and time after last name") + show_help("Should the last name be extended by current date and time?") + "<br/>";		
		html += inputField("eR_Settings_PortalSignUp_FirstName", "First name: ", "", "", 30) + " &nbsp;&nbsp;&nbsp;&nbsp;";	
		html += inputField("eR_Settings_PortalSignUp_LastName", "Last name: ", "", "", 30) + "<br/>";	
		html += inputField("eR_Settings_PortalSignUp_Phone", "Phone: ", "", "", 20) + "<br/>";	
		html += checkbox('eR_Settings_PortalSignUp_Email_UseRandom', "Use random generated email: ") + show_help("Should the email be generated randomly?")+ " ";	
		html += inputField("eR_Settings_PortalSignUp_Email", "Email: ", "", "", 30) + "<br/>";			
		html += inputField("eR_Settings_PortalSignUp_BirthDate", "Bith date: ", "", "", 10) + "<br/>";	
		html += inputField("eR_Settings_PortalSignUp_Street", "Street: ", "", "", 20) + "<br/>";	
		html += inputField("eR_Settings_PortalSignUp_ZipCode", "Zip code: ", "", "", 10) + " ";	
		html += inputField("eR_Settings_PortalSignUp_City", "City: ", "", "", 20) + "<br/>";	
		html += inputField("eR_Settings_PortalSignUp_Country", "Country: ", "", "Id of the country") + " &nbsp;&nbsp;&nbsp;&nbsp;";	
		html += inputField("eR_Settings_PortalSignUp_Nationality", "Nationality: ", "", "Id of the nationality") + "<br/>";	
		html += checkbox('eR_Settings_PortalSignUp_UserName_UseRandom', "Use random generated username: ") + show_help("Should the username be generated randomly?") + "<br/>";	
		html += inputField("eR_Settings_PortalSignUp_UserName", "UserName: ", "", "", 20) + " &nbsp;&nbsp;&nbsp;&nbsp;";	
		html += inputField("eR_Settings_PortalSignUp_Password", "Password: ", "", "", 20) + "<br/>";	
		html += "</div>";
		html += "<br/>";	
		
		html += checkbox_Use_Block('eR_Settings_FillEducationDialog_InUse', "Fill education dialog", "erGM_SettingBlock_FillEducationDialog");
		html += "<div id='erGM_SettingBlock_FillEducationDialog' " + (eval(eR_Settings_FillEducationDialog_InUse) ? "" : "class='darkClass'") + ">";	
		html += "</div>";
		html += "<br/>";
				
		html += checkbox_Use_Block('eR_Settings_FillPublicationDialog_InUse', "Fill publication dialog", "erGM_SettingBlock_FillPublicationDialog");
		html += "<div id='erGM_SettingBlock_FillPublicationDialog' " + (eval(eR_Settings_FillPublicationDialog_InUse) ? "" : "class='darkClass'") + ">";	
		html += "</div>";
		html += "<br/>";
		
		html += checkbox_Use_Block('eR_Settings_FillWorkExperienceDialog_InUse', "Fill work experience dialog", "erGM_SettingBlock_FillWorkExperienceDialog");
		html += "<div id='erGM_SettingBlock_FillWorkExperienceDialog' " + (eval(eR_Settings_FillWorkExperienceDialog_InUse) ? "" : "class='darkClass'") + ">";	
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
    GM_setValue("eR_Settings_LogOutFromPortal_Key", (document.getElementById('eR_Settings_LogOutFromPortal_Key').value).charCodeAt(0));
	GM_setValue("eR_Settings_MenuShortCutKey", (document.getElementById('eR_Settings_MenuShortCutKey').value).charCodeAt(0));
	
	GM_setValue("settings_Menu_Width", document.getElementById('settings_Menu_Width').value);
	GM_setValue("eR_Settings_PortalSignUp_FirstName", document.getElementById('eR_Settings_PortalSignUp_FirstName').value);
	GM_setValue("eR_Settings_PortalSignUp_LastName", document.getElementById('eR_Settings_PortalSignUp_LastName').value);
	GM_setValue("eR_Settings_PortalSignUp_Phone", document.getElementById('eR_Settings_PortalSignUp_Phone').value);
	GM_setValue("eR_Settings_PortalSignUp_Email", document.getElementById('eR_Settings_PortalSignUp_Email').value);
	
	GM_setValue("eR_Settings_PortalSignUp_BirthDate", document.getElementById('eR_Settings_PortalSignUp_BirthDate').value);
	GM_setValue("eR_Settings_PortalSignUp_Street", document.getElementById('eR_Settings_PortalSignUp_Street').value);
	GM_setValue("eR_Settings_PortalSignUp_ZipCode", document.getElementById('eR_Settings_PortalSignUp_ZipCode').value);
	GM_setValue("eR_Settings_PortalSignUp_City", document.getElementById('eR_Settings_PortalSignUp_City').value);
	GM_setValue("eR_Settings_PortalSignUp_Country", document.getElementById('eR_Settings_PortalSignUp_Country').value);
	
	GM_setValue("eR_Settings_PortalSignUp_Nationality", document.getElementById('eR_Settings_PortalSignUp_Nationality').value);
	GM_setValue("eR_Settings_PortalSignUp_UserName", document.getElementById('eR_Settings_PortalSignUp_UserName').value);
	GM_setValue("eR_Settings_PortalSignUp_Street", document.getElementById('eR_Settings_PortalSignUp_Street').value);
	GM_setValue("eR_Settings_PortalSignUp_Password", document.getElementById('eR_Settings_PortalSignUp_Password').value);
    
    //Save Checkboxes
    var checkboxes = new Array(
	  'eR_Settings_LogOutFromPortal_InUse',
	  'eR_Settings_PortalSignUp_InUse',
	  'eR_Settings_PortalSignUp_UseDateTime',
	  'eR_Settings_PortalSignUp_Email_UseRandom',
	  'eR_Settings_PortalSignUp_UserName_UseRandom',
	  'eR_Settings_FillEducationDialog_InUse',
	  'eR_Settings_FillPublicationDialog_InUse',
	  'eR_Settings_FillWorkExperienceDialog_InUse'
    );
	
    for (var i = 0; i < checkboxes.length; i++) {
        GM_setValue(checkboxes[i], document.getElementById(checkboxes[i]).checked);
    }	
	alert('Settings saved!');
}

/*** END Overlay ***/


/*** START Log Out from Portal ***/
function LogOutFromPortal(){
	// ausführen wenn die Html-Seite geladen wurde
	unsafeWindow.$(document).ready(function(){
		myform=document.createElement("form");
		myform.setAttribute("id", "logOffWithShortcut");
		myform.setAttribute("method", "post");
		myform.setAttribute("action", "/Home/LogOff");
		var contentByClass = document.getElementsByClassName('epunkt-content')[0];
		contentByClass.appendChild( myform );
		// reagieren, wenn im Browserfenster eine Taste gedrückt wurde
		// 'e' ist die gedrückte Taste...
		unsafeWindow.$(document).keypress(function(e) {
			// ausführen wenn Taste 'strg' + 'ö' gedrückt wurde (ö wie 'öff')
			// als Zahl die Ascii-Nummer
			if (e.ctrlKey && e.which == eval(eR_Settings_LogOutFromPortal_Key)){
				if (confirm('Jetzt vom Berwerberportal abgemelden?')) {
					unsafeWindow.$('#logOffWithShortcut').submit();
				} else {
					// Do nothing!
				}
			}
		});
	});
}
/*** END Log Out from Portal ***/


/*** START Portal Sign Up ***/
function PortalSignUp_GenerateButton(){
	var clickEvent = function (e) {
		PortalSignUp_FillForm();
	}
	
	var input = createInputButtonElement('Fill Form', 'PortalSignUp_FillButton', 'epunkt-button', '11px');
	input.onclick = clickEvent;	
	
	var parent = document.getElementById('save').parentNode;
	parent.insertBefore(input, parent.firstChild);
}

function PortalSignUp_FillForm(){
	var LastName = eR_Settings_PortalSignUp_LastName;

	if(eR_Settings_PortalSignUp_UseDateTime){
		LastName = LastName + ' ' + actualDateTimeString();
	}
	
	var randWord = randomWord(10);

	var Email = eR_Settings_PortalSignUp_Email;
	if(eR_Settings_PortalSignUp_Email_UseRandom || !eR_Settings_PortalSignUp_Email){
		Email = randWord + '@epunkttest.com';
	}

	var UserName = eR_Settings_PortalSignUp_UserName;
	if(eR_Settings_PortalSignUp_UserName_UseRandom || !eR_Settings_PortalSignUp_UserName){
		UserName = randWord;
	}	
	
	addValueById("FirstName", eR_Settings_PortalSignUp_FirstName);
	addValueById("LastName", LastName);
	addValueById("Phone", eR_Settings_PortalSignUp_Phone);
	addValueById("Email", Email);
	addValueById("BirthDate", eR_Settings_PortalSignUp_BirthDate);
	addValueById("Street", eR_Settings_PortalSignUp_Street);
	addValueById("ZipCode", eR_Settings_PortalSignUp_ZipCode);
	addValueById("City", eR_Settings_PortalSignUp_City);
	selectElementByIndex("Country", eR_Settings_PortalSignUp_Country);
	selectElementByIndex("Nationality", eR_Settings_PortalSignUp_Nationality);
	addValueById("UserName", UserName);
	addValueById("Password", eR_Settings_PortalSignUp_Password);
	addValueById("RepeatPassword", eR_Settings_PortalSignUp_Password);

	if(document.getElementById("agreement1")){
		document.getElementById("agreement1").checked = true;
	}

	//var logText = "User: " + UserName + " \tPassword: " + Password + " \tEmail: " + Email;
	//console.log(logText);
}
/*** END Portal Sign Up ***/


/*** START Fill Education Dialog ***/
function FillEducationDialog_GenerateButton(){
	var clickEvent = function (e) {
		EducationDialog_FillForm();
	}

	var input = createInputButtonElement('Fill Education Form', 'Education_FillButton', 'epunkt-button', '11px');
	input.onclick = clickEvent;

	document.getElementById('educationDialog').appendChild( input );
}

function EducationDialog_FillForm(){
	var EduType = parseInt( randNumMinMax(1,4) );
	var MonthStart = randNum(12); //startMonth
	var MonthEnd = randNum(12);	//endMonth
	var YearStart = parseInt( randNumMinMax(1980,2012) );	//startYear
	var YearEnd = randNumMinMax(1980,2012);	//endYear

	if(YearStart > YearEnd){
		var temp = YearEnd; 
		YearEnd = YearStart;
		YearStart = temp;
	}
	
	var specialization = 'Spez '+randomWord(3);
	var location = 'Loc '+randomWord(3);
	
	var finished = true;
	if(randNum(2)%2 == 0){
		finished = false;
	}
	
	selectItemByValue(document.getElementById("type"), EduType); 
	selectItemByValue(document.getElementById("startMonth"), MonthStart);   
	selectItemByValue(document.getElementById("endMonth"), MonthEnd);    
	selectItemByValue(document.getElementById("startYear"), YearStart)
	selectItemByValue(document.getElementById("endYear"), YearEnd);
	
	document.getElementById("specialization").value = specialization; 
	document.getElementById("location").value = location; 
	document.getElementById("finished").selectedIndex = finished; 
}
/*** END Fill Education Dialog ***/


/*** START Fill Publication Dialog ***/
function FillPublicationDialog_GenerateButton(){
	var clickEvent = function (e) {
		PublicationDialog_FillForm();
	}

	var input = createInputButtonElement('Fill Publication Form', 'Publication_FillButton', 'epunkt-button', '11px');
	input.onclick = clickEvent;

	document.getElementById('publicationDialog').appendChild( input );
}

function PublicationDialog_FillForm(){
	var PublicationType = parseInt( randNumMinMax(1,3) );
	var title = 'Titel '+randomWord(9);
	var description = 'Beschreibung '+randomWord(20);

	selectItemByValue(document.getElementById("typeId"), PublicationType); 	
	
	var parent = document.getElementById("typeId").parentNode.parentNode.parentNode;
	var parentInputs = parent.getElementsByTagName("input");
	parentInputs[0].value = title;

	document.getElementById("text").value = description; 
}
/*** END Fill Publication Dialog ***/


/*** START Fill WorkExperience Dialog ***/
function FillWorkExperienceDialog_GenerateButton(){
	var clickEvent = function (e) {
		WorkExperienceDialog_FillForm();
	}

	var input = createInputButtonElement('Fill Work Experience Form', 'WorkExperience_FillButton', 'epunkt-button', '11px');
	input.onclick = clickEvent;
	
	var element = document.getElementById("quitReason").parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
	element.appendChild( input );
}


function WorkExperienceDialog_FillForm(){
	var name = 'Unternehmen '+randomWord(9);
	
	var MonthStart = randNum(12); //startMonth
	var MonthEnd = randNum(12);	//endMonth
	var YearStart = parseInt( randNumMinMax(1980,2012) );	//startYear
	var YearEnd = randNumMinMax(1980,2012);	//endYear
	
	if(YearStart > YearEnd){
		var temp = YearEnd; 
		YearEnd = YearStart;
		YearStart = temp;
	}
	
	var careerLevel = parseInt( randNumMinMax(0,4) );

	var position = 'Position '+randomWord(8);
	var tasks = 'Aufgaben '+randomWord(8);
    for(var i=0; i < 8; i++)    {
      tasks += randomWord(randNumMinMax(4,20));
	  tasks += ' ';
    }
	
	var quitReason = 'Austrittsgrung '+randomWord(4);
	for(var i=0; i < 5; i++)    {
      quitReason += randomWord(randNumMinMax(4,10));
	  quitReason += ' ';
    }
	var optionsCareerLevel = new Array();

	$('select#careerLevel option').each(function(idx, val){
		//$(val).html(); // here's the display text
		optionsCareerLevel[idx] = $(val).val(); // here's the value
	});
	
	var parent = document.getElementById("careerLevel").parentNode.parentNode.parentNode;
	var parentInputs = parent.getElementsByTagName("input");
	parentInputs[0].value = name;

	selectItemByValue(document.getElementById("startMonth"), MonthStart);   
	selectItemByValue(document.getElementById("endMonth"), MonthEnd);    
	selectItemByValue(document.getElementById("startYear"), YearStart)
	selectItemByValue(document.getElementById("endYear"), YearEnd);
	
	selectItemByValue(document.getElementById("careerLevel"), optionsCareerLevel[careerLevel]); 
	
	addValueById("position", position);
	addValueById("tasks", tasks);
	addValueById("quitReason", quitReason); 
}
/*** END Fill WorkExperience Dialog ***/