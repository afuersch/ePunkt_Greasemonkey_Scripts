/* 	HELPER Functions to deal with 
 *	the medialize jQuery-contextMenu
*/

function inputField(setting_id, label, unit, help_text, size) {
	//Set default size
	size = typeof size !== 'undefined' ? size : 3;

	var inputField = label + " <input class='erSetting_form' type='text' size='" + size + "' id='" + setting_id + "' value='" +  eval(setting_id) +"'> " + unit;
	var help = "";
	if(help_text){
		help = show_help(help_text);
	}
	return inputField + help;
}

function checkbox(setting_id, label) {
    return "<input type='checkbox' " + (eval(setting_id) ? "checked='checked'" : "") + " id='" + setting_id + "'> " + label;
}

function checkbox_Use_Block(setting_id, label, divId) {
	var html = "";
	html += "<h5 class='erGM_subHeadline'>";
	html += "<input type=\"checkbox\" " + (eval(setting_id) ? "checked=\"checked\"" : "") + " id=\"" + setting_id + "\" onClick=\"$('#" + divId + "').toggleClass( 'darkClass' );\"> ";
	html += label + "</h5>";
	return html;
}

function show_help(text) {
    return " <a class='eR_Setting_info' href='javascript:void(0);'><b>?</b><span class='eR_Setting_span'>" + text + "</span></a>";
}

function textArea(setting_id, label, rows, cols, help_text) {
	var textArea = label + " <textarea id='" + setting_id + "'rows='" + rows + "' cols='" + cols + "'>" +  eval(setting_id) + "</textarea>";
	var help = "";
	if(help_text){
		help = show_help(help_text);
	}
	return textArea + help;
}