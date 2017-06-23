function onRun(context) {

  // We are passed a context variable when we're run.
  // We use this to get hold of a javascript object
  // which we can use in turn to manipulate Sketch.
  var sketch = context.api();

  // Next we want to extract the selected page of the selected (front-most) document
  var document = sketch.selectedDocument;
  var page = document.selectedPage;

  // Now let's create a new text layer, using a large font, and a traditional value...
  //var layer = page.newText({alignment: NSTextAlignmentCenter, systemFontSize: 36, text:"Hello World"})

  // Finally, lets center the view on our new layer
  // so that we can see where it is.

  var artboard = _getCurrentArtboard(context);
  var allBtnLayers = _getArtboardButtons(artboard);
  var heatMapGroup = _initHeatMap(context, page, artboard);
  _runFatFingerTest(context, allBtnLayers, 6, 6, 6, 6, heatMapGroup);
  document.centerOnLayer(heatMapGroup)
};

/*
* Initialize the heat map mask
* Returns the heat map group layer.
*/

var _initHeatMap = function(context, page, targetArtboard) {
  var sketch = context.api();
  //Make top level group called "Fat Finger Heat Map"
  var heatMapGroup = page.newGroup({frame: new sketch.Rectangle(
                      targetArtboard.frame().x(),
                      targetArtboard.frame().y(),
                      targetArtboard.frame().width(),
                      targetArtboard.frame().height()),
  name:"Fat Finger Heat Map"});
    var oStyle = new sketch.Style();
    oStyle.fills = ['#FFFFFF4F'];
    oStyle.borders = [];
  var heatMapBaseLayer = heatMapGroup.newShape({frame: new sketch.Rectangle(0, 0, targetArtboard.frame().width(), targetArtboard.frame().height()), style: oStyle, name:"HeatMap_Base"});
  //var style = heatMapBaseLayer.style.addStylePartOfType(0);
  //log(style);
  return heatMapGroup;
}
  
/*
* First get the selected artboard
*/
var _getCurrentArtboard = function(context) {
  var targetArtboard;
  var document = context.document;
  var selection = context.selection;
  if([selection count] != 0) {
    targetArtboard = selection[0];
  } else {
    targetArtboard = [[[document currentPage] artboards] firstObject];
  }
  //Get the highest level artboard element
  while(targetArtboard.parentGroup() != [document currentPage]) {
    targetArtboard = targetArtboard.parentGroup();
  }
  return targetArtboard;
};

/*
* To check if given point (px,py) lies within the confines of the layer
*/
var _checkPointInside = function(px, py) {
  if(px >= this.x && px <= (this.x + this.width)) {
    if(py >= this.y && py <= (this.y + this.height)) {
      return true;
    }
  }
  return false;
}

/*
* Select all components of an artboard with 'btn_' prefix
*/
var _getArtboardButtons = function(targetArtboard) {
  //Array that will be returned.
  var buttonLayers = [];
  var allLayers = [targetArtboard layers];
  for(var i=0; i < [allLayers count]; i++){
    var targetLayer = [allLayers objectAtIndex:i];
    var layerName = [targetLayer name];
    //Check if the layer is a button, create an object and add to array
    if(layerName.split("_")[0] == "btn") {
      var button = {
        buttonName :layerName,
        x : targetLayer.frame().x(),
        y : targetLayer.frame().y(),
        width : targetLayer.frame().width(),
        height : targetLayer.frame().height(),
        checkPointInside : _checkPointInside
      };
      buttonLayers.push(button);
    }
  }
  return buttonLayers;
};

/*
* Checks for point presence and draws circle on true cases
*/
_checkAndMark = function(context, btnLayer, px, py, x_positiveError, x_negativeError, y_positiveError, y_negativeError, heatMapGroup) {
  var gotHit = false;
  //Check for px, py
  if(btnLayer.checkPointInside(px, py)) {
    gotHit = true;
    //Draw a circle at (px, py)
    _markAsFatFingerError(context, px, py, 20, heatMapGroup);
  }
  //Check for px + x_positiveError, py
  if(btnLayer.checkPointInside(px + x_positiveError, py)) {
    gotHit = true;
    //Draw a circle at (px, py)
    _markAsFatFingerError(context, px, py, 20, heatMapGroup);
  }
  //Check for px - x_negativeError, py
  if(btnLayer.checkPointInside(px - x_negativeError, py)) {
    gotHit = true;
    //Draw a circle at (px, py)
    _markAsFatFingerError(context, px, py, 20, heatMapGroup);
  }
  //Check for px, py + y_positiveError
  if(btnLayer.checkPointInside(px, py + y_positiveError)) {
    gotHit = true;
    //Draw a circle at (px, py)
    _markAsFatFingerError(context, px, py, 20, heatMapGroup);
  }
  //Check for px, py - y_negativeError
  if(btnLayer.checkPointInside(px - x_negativeError, py)) {
    gotHit = true;
    //Draw a circle at (px, py)
    _markAsFatFingerError(context, px, py, 20, heatMapGroup);
  }
}

/*
* Actually draws a circle given a center and radius
*/
_markAsFatFingerError = function(context, px, py, radius, heatMapGroup) {
  log("error " + px + " " + py);
  var sketch = context.api();
  var doc = context.document;
  var oStyle = new sketch.Style();
  oStyle.fills = ['#FF000022'];
  oStyle.borders = [];
  var ovalShape = MSOvalShape.alloc().init();
  ovalShape.frame = MSRect.rectWithRect(NSMakeRect(px-radius,py-radius,radius*2,radius*2));
  var shapeGroup=MSShapeGroup.shapeWithPath(ovalShape);
  heatMapGroup._addWrappedLayerWithProperties(shapeGroup,{style: oStyle},"Shape");
}

/*
* Runs actual fat finger test for all btn_ layers
* Runs with whatever error measures along edges that you specify.
*/
var _runFatFingerTest = function(context, allLayers, x_positiveError, x_negativeError, y_positiveError, y_negativeError, heatMapGroup) {
  //Taking each layer one by one
  for(var i=0; i < allLayers.length; i++) {
    var x = allLayers[i].x;
    var y = allLayers[i].y;
    var width = allLayers[i].width;
    var height = allLayers[i].height;
    //For every other layer
    //check for fat-finger interactions
    //Every point along (x->x+width, y)
    for (var j=0; j < allLayers.length; j++){
      //Skip the current layer under consideration
      if(j != i){
        var py = y;
        for(var px=x; px <= x + width; px = px+2){
          _checkAndMark(context, allLayers[j], px, py, x_positiveError, x_negativeError, y_positiveError, y_negativeError, heatMapGroup);
        }
      }
    }
    //Every point along (x->x+width, y+height)
    for (var j=0; j < allLayers.length; j++)){
      //Skip the current layer under consideration
      if(j != i){
        var py = y+height;
        for(var px=x; px < x + width; px = px+2){
          _checkAndMark(context, allLayers[j], px, py, x_positiveError, x_negativeError, y_positiveError, y_negativeError, heatMapGroup);
        }
      }
    }
    //Every point along (x, y->y+height)
    for (var j=0; j < allLayers.length; j++)){
      //Skip the current layer under consideration
      if(j != i){
        var px = x;
        for(var py=y; py < y + height; py = py+2){
          _checkAndMark(context, allLayers[j], px, py, x_positiveError, x_negativeError, y_positiveError, y_negativeError, heatMapGroup);
        }
      }
    }
    //Every point along (x+height, y->y+height)
    for (var j=0; j < allLayers.length; j++){
      //Skip the current layer under consideration
      if(j != i){
        var px = x;
        for(var py=y; py < y + height; py = py+2){
          _checkAndMark(context, allLayers[j], px, py, x_positiveError, x_negativeError, y_positiveError, y_negativeError, heatMapGroup);
        }
      }
    }
  }
}
