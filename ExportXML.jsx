﻿//ExportXML.jsx//An InDesign CS6 JavaScript////Shows how to export XML.main();var globalFileName;var selectedDocument;var xmlDocument;var pageTag;var pageNameTag;var lessonTag;var lessonNameTag;var textFrameTag;var selectedDocPath;function main(){    setup();    tags = new Tags();     //   setupXMLDocument();    readData();        writeXML();}function setup(){    selectedDocument = app.activeDocument;    selectedDocPath = selectedDocument.filePath;    $.writeln("selectedDocPath: " + selectedDocPath);    globalFileName = selectedDocument.name;}function Tags(){    this.xmlDocument = app.documents.add();    this.pageTag = this.xmlDocument.xmlTags.add("page");    this.pageNameTag = this.xmlDocument.xmlTags.add("pageName");    this.lessonTag = this.xmlDocument.xmlTags.add("lesson");    this.lessonNameTag = this.xmlDocument.xmlTags.add("lessonName");    this.textFrameTag = this.xmlDocument.xmlTags.add("textFrame");	this.myRootXMLElement = this.xmlDocument.xmlElements.item(0);}function readData(){    var pages = selectedDocument.pages;    $.writeln('# of pages: ' + pages.length);    for (var x = 0; x < pages.length; x++){          page = pages.item(x);           pageName = page.name;          pageTagToAdd = addPage(pageName);          readPage(pageTagToAdd,page);    }}function readPage(pageTagToAddTo,page) {    var textFrames = page.textFrames;    $.writeln('# of textFrames: ' + textFrames.length);    for (var x = 0; x < textFrames.length; x++)    {          textFrame = textFrames.item(x);           frameName = textFrame.name;          contents = textFrame.contents;          addTextFrame(pageTagToAddTo,contents);    }}function setupXMLDocument(){	xmlDocument = app.documents.add();    pageTag = xmlDocument.xmlTags.add("page");    pageNameTag = xmlDocument.xmlTags.add("pageName");    lessonTag = xmlDocument.xmlTags.add("lesson");    lessonNameTag = xmlDocument.xmlTags.add("lessonName");    textFrameTag = xmlDocument.xmlTags.add("textFrame");	myRootXMLElement = xmlDocument.xmlElements.item(0);}function findLesson(textContent){    var pattern = /Lesson #(\d+)/;    var matchArray = pattern.exec(textContent);    if (matchArray != null && matchArray.length > 0) {        $.writeln("lastIndex: ",matchArray.lastIndex);        if (matchArray.length > 1) {          $.writeln("matchArray[1]: " + matchArray[1]);          return(matchArray[1]);           }    }    return "";}function addTextFrame(page,contents){    var lessonNum = findLesson(contents);    if (lessonNum.length) {        parentElement = page.xmlElements.add(tags.lessonTag);        var lessonNameTagLocal = parentElement.xmlElements.add(tags.lessonNameTag);   // add a name tag        lessonNameTagLocal.contents = lessonNum;    } else {        parentElement = page;    }	var myXMLElement = parentElement.xmlElements.add(tags.textFrameTag);    myXMLElement.contents = contents;}function addPage(name){	var pageTagLocal = tags.myRootXMLElement.xmlElements.add(tags.pageTag);    var pageName = pageTagLocal.xmlElements.add(tags.pageNameTag);    pageName.contents = name;    return pageTagLocal;}function writeXML(){	//<fragment>    activeDoc = app.activeDocument;    var fileName = activeDoc.name;	var myDocument = app.documents.item(0);	//Export the entire XML structure in the document.	myDocument.exportFile(ExportFormat.xml, File(selectedDocPath + "/" + globalFileName + " .xml"));	//Export a specific XML element and its child XML elements.//	var myXMLElement = myDocument.xmlElements.item(0).xmlElements.item(-1);//	myXMLElement.exportFile(ExportFormat.xml, File(Folder.desktop + "/PartialDocumentXML.xml"));	//</fragment>}function myTeardown(){}