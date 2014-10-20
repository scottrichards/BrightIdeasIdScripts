﻿//ExportXML.jsx//An InDesign CS6 JavaScript////Shows how to export XML.main();var globalFileName;var selectedDocument;var xmlDocument;var selectedDocPath;function main(){    setup();    tags = new Tags();        readData();        writeXML();}function setup(){    selectedDocument = app.activeDocument;    if (selectedDocument.saved)        selectedDocPath = selectedDocument.filePath; //   $.writeln("selectedDocPath: " + selectedDocPath);    globalFileName = selectedDocument.name;}function Tags(){    this.xmlDocument = app.documents.add();    this.pageTag = this.xmlDocument.xmlTags.add("page");    this.pageNameTag = this.xmlDocument.xmlTags.add("pageName");    this.lessonTag = this.xmlDocument.xmlTags.add("lesson");    this.questionTag = this.xmlDocument.xmlTags.add("question");    this.questionNumberTag = this.xmlDocument.xmlTags.add("questionNumber");    this.questionContentTag = this.xmlDocument.xmlTags.add("questionContent");    this.lessonNameTag = this.xmlDocument.xmlTags.add("lessonName");    this.textFrameTag = this.xmlDocument.xmlTags.add("textFrame");    this.layerTag = this.xmlDocument.xmlTags.add("layer");    this.layerNameTag = this.xmlDocument.xmlTags.add("layerName");    this.graphicTag = this.xmlDocument.xmlTags.add("graphic");    this.graphicNameTag = this.xmlDocument.xmlTags.add("graphicName");    this.graphicLinkTag = this.xmlDocument.xmlTags.add("graphicLink");    this.myRootXMLElement = this.xmlDocument.xmlElements.item(0);}function QuestionData(index,contents){    this.index = index;    this.contents = contents;}function readData(){    var pages = selectedDocument.pages;    $.writeln('# of pages: ' + pages.length);    for (var x = 0; x < pages.length; x++){          page = pages.item(x);           pageName = page.name;          pageTagToAdd = addPage(pageName);          readPage(pageTagToAdd,page);    }}function readPage(pageTagToAddTo,page) {    var textFrames = page.textFrames;    $.writeln('# of textFrames: ' + textFrames.length);    for (var x = 0; x < textFrames.length; x++)    {          textFrame = textFrames.item(x);           frameName = textFrame.name;          contents = textFrame.contents;          addTextFrame(pageTagToAddTo,contents);          exportGraphics(pageTagToAddTo,page);    }}function exportLayers(parentElement){    var layers = selectedDocument.layers;    for (var x = 0; x < layers.length; x++){          layer = layers.item(x);           layerName = layer.name;          $.writeln("layer name: " + layerName);           var layerElement = parentElement.xmlElements.add(tags.layerTag);          var layerNameTag = layerElement.xmlElements.add(tags.layerNameTag);          layerNameTag.contents = layerName;  /*        var graphics = layer.allGraphics;          for (var y = 0; y < graphics.length; y++){            graphic = graphics[y];             var graphicTag = layerElement.xmlElements.add(tags.graphicTag);            var graphicNameTag = graphicTag.xmlElements.add(tags.graphicNameTag);            if (graphic.itemLink != null) {                 graphicNameTag.contents = graphic.itemLink.name;                graphicLinkTag = graphicTag.xmlElements.add(tags.graphicLinkTag);                graphicLinkTag.contents = graphic.itemLink.filePath;            }          }          */    }}function exportGraphics(parentElement,page){  var graphics = page.allGraphics;  for (var y = 0; y < graphics.length; y++){    graphic = graphics[y];     var graphicTag = parentElement.xmlElements.add(tags.graphicTag);    var graphicNameTag = graphicTag.xmlElements.add(tags.graphicNameTag);    if (graphic.itemLink != null) {         graphicNameTag.contents = graphic.itemLink.name;        graphicLinkTag = graphicTag.xmlElements.add(tags.graphicLinkTag);        graphicLinkTag.contents = graphic.itemLink.filePath;    }  }}function findLesson(textContent){    var pattern = /Lesson #(\d+)/;    var matchArray = pattern.exec(textContent);    if (matchArray != null && matchArray.length > 0) {        $.writeln("lastIndex: ",matchArray.lastIndex);        if (matchArray.length > 1) {          $.writeln("matchArray[1]: " + matchArray[1]);          return(matchArray[1]);           }    }    return "";}function findQuestions(parentElement,contents){    var pattern = /^\t(\d+)\./gm;    var patternTwo = /^\t(\d+)\./gm;    do {        var matchArray = pattern.exec(contents);        var lastMatchedIndex = -1;        if (matchArray != null && matchArray.length > 0) {            $.writeln("question lastIndex: ",pattern.lastIndex);            lastMatchedIndex = pattern.lastIndex;            var questionContent = "";            if (matchArray.length > 1) {              $.writeln("matchArray[1]: " + matchArray[1]);              var questionNumber = matchArray[1];              $.writeln("questionNumber: " + questionNumber);              patternTwo.lastIndex = pattern.lastIndex;              var nextMatch = patternTwo.exec(contents);              if (nextMatch != null && nextMatch.length > 0) {                if (nextMatch.length > 1) {                    questionContent = contents.substring(lastMatchedIndex,nextMatch.index);                } else {                    questionContent = contents.substring(lastMatchedIndex);                }              }            } else {                    questionContent = contents.substring(lastMatchedIndex);            }            var questionElement = parentElement.xmlElements.add(tags.questionTag);            var questionNumberTag = questionElement.xmlElements.add(tags.questionNumberTag);            questionNumberTag.contents = questionNumber;            var questionContentTag = questionElement.xmlElements.add(tags.questionContentTag);            questionContentTag.contents = questionContent;        }    } while (matchArray != null);    return "";}function addTextFrame(page,contents){    var lessonNum = findLesson(contents);    if (lessonNum.length) {        parentElement = page.xmlElements.add(tags.lessonTag);        var lessonNameTagLocal = parentElement.xmlElements.add(tags.lessonNameTag);   // add a name tag //       exportLayers(parentElement);        lessonNameTagLocal.contents = lessonNum;        findQuestions(parentElement,contents);    } else {        parentElement = page;    }	var myXMLElement = parentElement.xmlElements.add(tags.textFrameTag);    myXMLElement.contents = contents;}function addPage(name){	var pageTagLocal = tags.myRootXMLElement.xmlElements.add(tags.pageTag);    var pageName = pageTagLocal.xmlElements.add(tags.pageNameTag);    pageName.contents = name;    return pageTagLocal;}function writeXML(){	//<fragment>    activeDoc = app.activeDocument;    var fileName = activeDoc.name;	var myDocument = app.documents.item(0);    if (!selectedDocument.saved) {        $.writeln("doc is NOT saved");    }	//Export the entire XML structure in the document.//	myDocument.exportFile(ExportFormat.xml, File(selectedDocPath + "/" + globalFileName + " .xml"));    myDocument.exportFile(ExportFormat.xml, File(selectedDocument.fullName + " .xml"));}function myTeardown(){}