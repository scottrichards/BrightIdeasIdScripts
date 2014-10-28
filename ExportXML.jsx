﻿//ExportXML.jsx//An InDesign CS6 JavaScript////Shows how to export XML.//=============================================================// Global Objects//=============================================================var docData;var scriptSettings;main();function main(){    if (displaySettingsDialog()) {        docData = new DocumentData();         tags = new Tags();           // AFTER this point we have setup the new indd XML Document we will populate with data        styles = new Styles();        readData();            writeXML();        exportGraphicFiles();    }}// returns the name of the .indd file without the file extensionfunction getFileNameWithoutExtension(fileName){    var pattern = /(.+)\.indd/;    var matchArray = pattern.exec(fileName);    if (matchArray != null && matchArray.length > 1) {        return matchArray[1];    } else {        return fileName;    }}//=============================================================// User Interface//=============================================================function displaySettingsDialog(){    scriptSettings = new ScriptSettings();    var myDialog = app.dialogs.add({name:"Export Settings",canCancel:true}); //Add a dialog column.     with(myDialog.dialogColumns.add())    {        staticTexts.add({staticLabel:"Image Export Resolution (1-2400):"});        //Create a number (real) entry field.        exportResolution = integerEditboxes.add({editValue:400});    }    //Show the dialog box.    var myResult = myDialog.show();    //If the user clicked OK, display one message;    //if they clicked Cancel, display a different message.     if (myResult == true){        scriptSettings.exportResolution = exportResolution.editValue;        myDialog.destroy();        $.writeln("export Resolution: " + scriptSettings.exportResolution);        return true;    }    else {        myDialog.destroy();        return false;    }}//=============================================================// Data Structures//=============================================================function ScriptSettings(){}// stuff global document Data in the docData instance of this objectfunction DocumentData(){    this.selectedDocument = app.activeDocument;      // save away the selected source inDesign Document    if (this.selectedDocument.saved)        this.selectedDocPath = this.selectedDocument.filePath;    else        this.selectedDocPath = Folder.myDocuments.fullName;     // selectedDocPath = filePath to the source in Design document we are reading from        $.writeln("selectedDocPath: " + this.selectedDocPath);    this.selectedDocFileName = getFileNameWithoutExtension(this.selectedDocument.name);    this.outputFolder = new Folder(Folder.myDocuments.fullName + "/BIP/" + this.selectedDocFileName);    this.imagesFolder = new Folder(Folder.myDocuments.fullName + "/BIP/" + this.selectedDocFileName + "/images");    $.writeln("image folder: " + this.imagesFolder);    this.inDesignFileCopy = new File(this.outputFolder.fullName + "/" + this.selectedDocument.name);    $.writeln("copy path: " + this.inDesignFileCopy.fullName);    this.imagesFolder.create();     // save a copy of the indd document in the output folder don't try and open it yet    this.selectedDocument.saveACopy(this.inDesignFileCopy); //   docData.inDesignDocumentCopy = app.open(docData.inDesignFileCopy, true);    this.globalFileName = this.selectedDocument.name;    // xmlDocument = Create a new document where we are going to write out xml data, images etc then do Export To XML    this.xmlDocument = app.documents.add();}// setup XML tagsfunction Tags(){    this.pageTag = docData.xmlDocument.xmlTags.add("page");    this.pageNameTag = docData.xmlDocument.xmlTags.add("pageName");    this.lessonTag = docData.xmlDocument.xmlTags.add("lesson");    this.questionTag = docData.xmlDocument.xmlTags.add("question");    this.questionNumberTag = docData.xmlDocument.xmlTags.add("questionNumber");    this.questionContentTag = docData.xmlDocument.xmlTags.add("questionContent");    this.lessonNameTag = docData.xmlDocument.xmlTags.add("lessonName");    this.textFrameTag = docData.xmlDocument.xmlTags.add("textFrame");    this.layerTag = docData.xmlDocument.xmlTags.add("layer");    this.layerNameTag = docData.xmlDocument.xmlTags.add("layerName");    this.graphicTag = docData.xmlDocument.xmlTags.add("graphic");    this.graphicNameTag = docData.xmlDocument.xmlTags.add("graphicName");    this.graphicLinkTag = docData.xmlDocument.xmlTags.add("graphicLink");    this.imageLinkTag = docData.xmlDocument.xmlTags.add("imageLink");    this.myRootXMLElement = docData.xmlDocument.xmlElements.item(0);}function Styles(){     //Create a series of paragraph styles.    this.myHeading1Style = docData.xmlDocument.paragraphStyles.add();    this.myHeading1Style.name = "heading 1";    this.myHeading1Style.pointSize = 18;    this.myHeading2Style = docData.xmlDocument.paragraphStyles.add();    this.myHeading2Style.name = "heading 2";    this.myHeading2Style.pointSize = 16;    this.myPara1Style = docData.xmlDocument.paragraphStyles.add();    this.myPara1Style.name = "para 1";    this.myPara1Style.pointSize = 14;    this.myBodyTextStyle = docData.xmlDocument.paragraphStyles.add();    this.myBodyTextStyle.name = "body text";    this.myBodyTextStyle.pointSize = 10;}function QuestionData(index,contents){    this.index = index;    this.contents = contents;}// Iterate through all the pages get the page name, add a page, call readPage to read the pagefunction readData(){    var pages = docData.selectedDocument.pages;    $.writeln('# of pages: ' + pages.length);    for (var x = 0; x < pages.length; x++){        page = pages.item(x);         pageName = page.name;        $.writeln("Page: " + pageName);        pageTagToAdd = addPage(pageName);        readPage(pageTagToAdd,page);        exportGraphicLinks(pageTagToAdd,page);    }}// iterate through the textFrames in a page function readPage(pageTagToAddTo,page) {    docData.xmlDocument.pages.add();    var textFrames = page.textFrames;    $.writeln('# of textFrames: ' + textFrames.length);    for (var x = 0; x < textFrames.length; x++)    {          textFrame = textFrames.item(x);           frameName = textFrame.name;          contents = textFrame.contents;          addTextFrame(pageTagToAddTo,contents);    }}// call findLesson to search for lessons function addTextFrame(page,contents){    var lessonNum = findLesson(contents);    if (lessonNum.length) {        parentElement = page.xmlElements.add(tags.lessonTag);   // add lesson tag        var lessonNameTagLocal = parentElement.xmlElements.add(tags.lessonNameTag);   // add a name tag                  lessonNameTagLocal.contents = lessonNum;        lessonNameTagLocal.insertTextAsContent("Lesson: ", XMLElementPosition.beforeElement);        lessonNameTagLocal.insertTextAsContent("\r\r", XMLElementPosition.afterElement);        findQuestions(parentElement,contents);    } else {        parentElement = page;        findQuestions(parentElement,contents);    }	//var myXMLElement = parentElement.xmlElements.add(tags.textFrameTag);    //myXMLElement.contents = contents;}// pageNumber -> the number of the page being added//// returns the xml tag representing the page root nodefunction addPage(pageNumber){    var pageTagLocal = tags.myRootXMLElement.xmlElements.add(tags.pageTag);    var pageName = pageTagLocal.xmlElements.add(tags.pageNameTag);    pageName.contents = pageNumber;    return pageTagLocal;}// Not currently using this function everything is in a single Layer so not very useful//~ function exportLayers(parentElement)//~ {//~     var layers = selectedDocument.layers;//~     for (var x = 0; x < layers.length; x++){//~       layer = layers.item(x); //~       layerName = layer.name;//~       $.writeln("layer name: " + layerName); //~       var layerElement = parentElement.xmlElements.add(tags.layerTag);//~       var layerNameTag = layerElement.xmlElements.add(tags.layerNameTag);//~       layerNameTag.contents = layerName;//~     }//~ }// Export the links to graphics for the page// parentElement -> the tag to append to in the output XML InDesign Document// page -> the page that we are exporting the graphics from function exportGraphicLinks(parentElement,page){  $.writeln("exportGraphicLinks parentElement: " + parentElement);  var graphics = page.allGraphics;  for (var y = 0; y < graphics.length; y++){    graphic = graphics[y];     var graphicTag = parentElement.xmlElements.add(tags.graphicTag);    var graphicNameTag = graphicTag.xmlElements.add(tags.graphicNameTag);    if (graphic.itemLink != null) {         graphicNameTag.contents = graphic.itemLink.name;        graphicLinkTag = graphicTag.xmlElements.add(tags.graphicLinkTag);        graphicLinkTag.contents = graphic.itemLink.filePath;        // add a reference to the image        imageLinkTag = graphicTag.xmlElements.add(tags.imageLinkTag);        imageLinkTag.contents = "images/" + graphic.itemLink.name + ".png";    }  }}// Export all of the graphics images into a folder in your Documents folder /BIP/InDesign Source File/images folderfunction exportGraphicFiles(){  var graphics = docData.selectedDocument.allGraphics;  $.writeln("exportResolution Default: " + app.pngExportPreferences.exportResolution);  app.pngExportPreferences.pngQuality = PNGQualityEnum.MAXIMUM; // set MAXIMUM Resolution  app.pngExportPreferences.exportResolution = scriptSettings.exportResolution;    $.writeln("exportResolution setTo: " + app.pngExportPreferences.exportResolution);  for (var y = 0; y < graphics.length; y++){    graphic = graphics[y];         if (graphic.itemLink != null) {        var exportFile = new File(docData.imagesFolder + "/" + graphic.itemLink.name + ".png");        $.writeln("export to: " + exportFile.fullName);        graphic.exportFile(ExportFormat.PNG_FORMAT,exportFile);    }  }}function findLesson(textContent){    var pattern = /Lesson #(\d+)/;    var matchArray = pattern.exec(textContent);    if (matchArray != null && matchArray.length > 0) { //       $.writeln("lastIndex: ",matchArray.lastIndex);        if (matchArray.length > 1) { //         $.writeln("matchArray[1]: " + matchArray[1]);          return(matchArray[1]);           }    }    return "";}function findQuestions(parentElement,contents){    var pattern = /^\s*(\d+)\./gm;    var patternTwo = /^\s*(\d+)\./gm;    do {        var matchArray = pattern.exec(contents);        var lastMatchedIndex = -1;        if (matchArray != null && matchArray.length > 0) { //           $.writeln("question lastIndex: ",pattern.lastIndex);            lastMatchedIndex = pattern.lastIndex;            var questionContent = "";            if (matchArray.length > 1) { //             $.writeln("matchArray[1]: " + matchArray[1]);              var questionNumber = matchArray[1]; //             $.writeln("questionNumber: " + questionNumber);              patternTwo.lastIndex = pattern.lastIndex;              var nextMatch = patternTwo.exec(contents);              if (nextMatch != null && nextMatch.length > 0) {                if (nextMatch.length > 1) {                    questionContent = contents.substring(lastMatchedIndex,nextMatch.index);                } else {                    questionContent = contents.substring(lastMatchedIndex);                }              } else {                questionContent = contents.substring(lastMatchedIndex);              }            } else {                questionContent = contents.substring(lastMatchedIndex);            }            var questionElement = parentElement.xmlElements.add(tags.questionTag);            var questionNumberTag = questionElement.xmlElements.add(tags.questionNumberTag);            questionNumberTag.contents = questionNumber;            var questionContentTag = questionElement.xmlElements.add(tags.questionContentTag);            questionContentTag.contents = questionContent;        }    } while (matchArray != null);    var myDocument = app.activeDocument;    var myPage = app.activeWindow.activePage;    // Add Question nodes to the textFrame    // create the textFrame to put the questions into    var myTextFrame = myPage.textFrames.add({geometricBounds:myGetBounds(myDocument, myPage)});    var myStory = myTextFrame.parentStory; //   myTextFrame.parentStory.insertionPoints.item(-1).contents = "Page: ";    myStory.placeXML(parentElement);    // insert the xml    return "";}function myGetBounds(myDocument, myPage){	var myPageWidth = myDocument.documentPreferences.pageWidth;	var myPageHeight = myDocument.documentPreferences.pageHeight	if(myPage.side == PageSideOptions.leftHand){		var myX2 = myPage.marginPreferences.left;		var myX1 = myPage.marginPreferences.right;	}	else{		var myX1 = myPage.marginPreferences.left;		var myX2 = myPage.marginPreferences.right;	}	var myY1 = myPage.marginPreferences.top;	var myX2 = myPageWidth - myX2;	var myY2 = myPageHeight - myPage.marginPreferences.bottom;	return [myY1, myX1, myY2, myX2];}// Export XML to a separate file and function writeXML(){	//<fragment>    activeDoc = app.activeDocument;    var fileName = activeDoc.name;	var myDocument = app.documents.item(0);    if (!docData.selectedDocument.saved) {        $.writeln("doc is NOT saved");    }	//Export the entire XML structure in the document. //   myDocument.exportFile(ExportFormat.xml, File(selectedDocument.fullName + ".xml"));    myDocument.exportFile(ExportFormat.xml, File(docData.outputFolder.fullName + "/" + docData.selectedDocFileName + ".xml"));}function myTeardown(){}