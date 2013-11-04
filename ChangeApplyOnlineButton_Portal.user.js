// ==UserScript==
// @name        ChangeApplyOnlineButton_Portal
// @namespace   ePunkt
// @description Tauscht bei den "Online bewerben" Links die URL aus damit man sich nicht versehentlich am Live-System bewirbt
// @include     http://localhost:1901/Jobs/Job*
// @include     http://staging.epunkt.net/Builds/Beta/Portal/Jobs/Job*
// @include     http://staging.epunkt.net/Builds/Dev/Portal/Jobs/Job*
// @version     1.1.0
// @updateURL 	https://raw.github.com/WinniB/ePunkt_Greasemonkey_Scripts/master/ChangeApplyOnlineButton_Portal.user.js
// @downloadURL https://raw.github.com/WinniB/ePunkt_Greasemonkey_Scripts/master/ChangeApplyOnlineButton_Portal.user.js
// ==/UserScript==


/*
 * v 1.0.0	19.03.2013 create
 * v 1.0.1	20.03.2013 add new customer urls
 * v 1.0.2	20.03.2013 add new customer urls
 * v 1.0.3	24.09.2013 add new customer urls
 * v 1.1.0	04.11.2013 move to github, add update and install path
 *
*/

var listOfUrls2Change = [];
var len = 0;
len = listOfUrls2Change.push("http://jobs.epunkt.net/?Job=");
len = listOfUrls2Change.push("http://epunkt.bewerberportal.at/?Job=");
len = listOfUrls2Change.push("http://stellenangebote.gasteig.de/?Job=");
len = listOfUrls2Change.push("http://atlas.epunkt.net/?Job=");
len = listOfUrls2Change.push("http://bacher.bewerberportal.at/?Job=");
len = listOfUrls2Change.push("http://bankaustria_movement_management_jobs.bewerberportal.at/?Job=");
len = listOfUrls2Change.push("http://bewerbung.vorarlberg.at/?Job=");
len = listOfUrls2Change.push("http://brauunion.bewerberportal.at/?Job=");
len = listOfUrls2Change.push("http://diakonie-de-la-tour.epunkt.net/?Job=");
len = listOfUrls2Change.push("http://ferialpraktikum-wkw.wko.at/?Job=");
len = listOfUrls2Change.push("http://hainzl.epunkt.net/?Job=");
len = listOfUrls2Change.push("http://isotec.bewerberportal.at/?Job=");
len = listOfUrls2Change.push("http://job.atlas-personal.com/?Job=");
len = listOfUrls2Change.push("http://jobs.bawagpsk.com/?Job=");
len = listOfUrls2Change.push("http://jobs.buwog.at/?Job=");
len = listOfUrls2Change.push("http://jobs.chsh.com/?Job=");
len = listOfUrls2Change.push("http://jobs.csc.at/?Job=");
len = listOfUrls2Change.push("http://jobs.de.epunkt.net/?Job=");
len = listOfUrls2Change.push("http://jobs.diakonie-delatour.at/?Job=");
len = listOfUrls2Change.push("http://jobs.hainzl.at/?Job=");
len = listOfUrls2Change.push("http://jobs.herold.at/?Job=");
len = listOfUrls2Change.push("http://jobs.immofinanz.com/?Job=");
len = listOfUrls2Change.push("http://jobs.issworld.at/?Job=");
len = listOfUrls2Change.push("http://jobs.kappa-fs.com/?Job=");
len = listOfUrls2Change.push("http://jobs.kern-partner.at und/?Job=");
len = listOfUrls2Change.push("http://jobs.miba.com/?Job=");
len = listOfUrls2Change.push("http://jobs.mth-retailgroup.com/?Job=");
len = listOfUrls2Change.push("http://jobs.oberoesterreich-tourismus.at/?Job=");
len = listOfUrls2Change.push("http://jobs.rechberger.com/?Job=");
len = listOfUrls2Change.push("http://jobs.rlbooe.at/?Job=");
len = listOfUrls2Change.push("http://jobs.schachermayer.com/?Job=");
len = listOfUrls2Change.push("http://jobs.urano.de/?Job=");
len = listOfUrls2Change.push("http://jobs.viking.at/?Job=");
len = listOfUrls2Change.push("http://jobs.volksbank.com/?Job=");
len = listOfUrls2Change.push("http://karriere.ffg.at/?Job=");
len = listOfUrls2Change.push("http://karriere.oenb.at/?Job=");
len = listOfUrls2Change.push("http://karriere.resch-frisch.com/?Job=");
len = listOfUrls2Change.push("http://karriere.squadra.at/?Job=");
len = listOfUrls2Change.push("http://karriere.tuv.at/?Job=");
len = listOfUrls2Change.push("http://karriere-stmk.wko.at/?Job=");
len = listOfUrls2Change.push("http://karriere-tirol.wko.at/?Job=");
len = listOfUrls2Change.push("http://karriere-wkw.wko.at/?Job=");
len = listOfUrls2Change.push("http://kern-partner.epunkt.net/?Job=");
len = listOfUrls2Change.push("http://landooe.epunkt.net/?Job=");
len = listOfUrls2Change.push("http://libro-pagro.epunkt.net/?Job=");
len = listOfUrls2Change.push("http://megasoftware.kandidatenportal.eu/?Job=");
len = listOfUrls2Change.push("http://miba.bewerberportal.at/?Job=");
len = listOfUrls2Change.push("http://mitarbeiter-wkw.wko.at/?Job=");
len = listOfUrls2Change.push("http://moveup.bewerberportal.at/?Job=");
len = listOfUrls2Change.push("http://ottobock.bewerberportal.at/?Job=");
len = listOfUrls2Change.push("http://pres.epunkt.net/?Job=");
len = listOfUrls2Change.push("http://pres-at.epunkt.net/?Job=");
len = listOfUrls2Change.push("http://resch-frisch.bewerberportal.at/?Job=");
len = listOfUrls2Change.push("http://rlb.epunkt.net/?Job=");
len = listOfUrls2Change.push("http://sintec.bewerberportal.at/?Job=");
len = listOfUrls2Change.push("http://staudigl.bewerberportal.at/?Job=");
len = listOfUrls2Change.push("http://stellenangebote.ortenaukreis.de/?Job=");
len = listOfUrls2Change.push("http://talentor.bewerberportal.at/?Job=");
len = listOfUrls2Change.push("http://twa.epunkt.net/?Job=");
len = listOfUrls2Change.push("http://unycom.epunkt.net/?Job=");
len = listOfUrls2Change.push("http://wirtschaftsagentur.bewerberportal.at/?Job=");
len = listOfUrls2Change.push("http://www.jobs.rlbooe.at/?Job=");
len = listOfUrls2Change.push("https://engel.epunkt.net/?Job=");
len = listOfUrls2Change.push("https://inditex.bewerberportal.at/?Job=");
len = listOfUrls2Change.push("https://jobs.appelrath.com/?Job=");
len = listOfUrls2Change.push("https://jobs.buch.de/?Job=");
len = listOfUrls2Change.push("https://jobs.cargo-partner.com/?Job=");
len = listOfUrls2Change.push("https://jobs.douglas-karriere.de/?Job=");
len = listOfUrls2Change.push("https://jobs.hussel.de/?Job=");
len = listOfUrls2Change.push("https://jobs.keba.com/?Job=");
len = listOfUrls2Change.push("https://jobs.owd-gruppe.at/?Job=");
len = listOfUrls2Change.push("https://jobs.roseninspection.net/?Job=");
len = listOfUrls2Change.push("https://jobs.solutionproviders.com/?Job=");
len = listOfUrls2Change.push("https://jobs.thalia.eu/?Job=");
len = listOfUrls2Change.push("https://oenb.epunkt.net/?Job=");
len = listOfUrls2Change.push("http://jobs.recruitingservices.at/?Job=");
len = listOfUrls2Change.push("http://jobs.deloitte.at/?Job=");
len = listOfUrls2Change.push("http://jobs.tiger-coatings.com/?Job=");
len = listOfUrls2Change.push("https://jobs.kapsch.net/?Job=");
len = listOfUrls2Change.push("https://stellenangebote.vorarlberg.at/?Job=");
len = listOfUrls2Change.push("https://stellenangeboteintern.vorarlberg.at/?Job=");
len = listOfUrls2Change.push("https://career.holyfashiongroup.com/?Job=");
len = listOfUrls2Change.push("http://careers.selecta.ch/?Job=");
len = listOfUrls2Change.push("https://vpv.bewerberportal.at/?Job=");


for (var i=0;i<len;i++){
	$("div.epunkt-content a[href^='" + listOfUrls2Change[i] + "']").each(function () {
		var actualLocation = window.location.toString();;
		var newUrl = actualLocation.replace("/Jobs/Job?Job=","/?Job=");
		this.href = newUrl;

		//alert(this.href);
	});
}

//alert("END");