function onRun(context) {

  // We are passed a context variable when we're run.
  // We use this to get hold of a javascript object
  // which we can use in turn to manipulate Sketch.
  var sketch = context.api();

  // Next we want to extract the selected page of the selected (front-most) document
  var document = sketch.selectedDocument;
  var page = document.selectedPage;

  // Now let's create a new text layer, using a large font, and a traditional value...
  var layer = page.newText({alignment: NSTextAlignmentCenter, systemFontSize: 36, text:"Hello World"})

  // Finally, lets center the view on our new layer
  // so that we can see where it is.
  document.centerOnLayer(layer)

  _getCurrentArtboard(context);
};

/*
* Initialize the heat map mask
* Returns the rect layer.
*/

var _initHeatMap = function(context) {
  //Make top level group called "Fat Finger Heat Map"
  var sketch = context.api();
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

  var artboardName = [targetArtboard name];

  log(artboardName);

  _getArtboardButtons(targetArtboard);
  return targetArtboard;
};

/*
* Select all components of an artboard with 'btn_' prefix
*/
var _getArtboardButtons = function(targetArtboard) {
  var allLayers = [targetArtboard layers];
  for(var i=0; i < [allLayers count]; i++){
    var targetLayer = [allLayers objectAtIndex:i];
    var layerName = [targetLayer name];
    //Check if the layer is a button, create 
  }
};


/*
* Runs actual fat finger test for all btn_ layers
* Runs with whatever error measures along edges that you specify.
*/
var _runFatFingerTest = function(allLayers, x_positiveError, x_negativeError, y_positiveError, y_negativeError) {
  //Taking each layer one by one
  for(var i=0; i < [allLayers count]; i++) {
    //For every other layer
    //check for fat-finger interactions
    //Every point along (x->x+width, y)
    for (var j=0; j < [allLayers count]; j++){
      //Skip the current layer under consideration
      if(j != i){
        //var py = y;
        //for(var px=x; px < x + width; px++){
          //Check for px, py
          //Check for px + x_positiveError, py
          //Check for px - x_negativeError, py
          //Check for px, py + y_positiveError
          //Check for px, py - y_negativeError
        }
      }
    }
    //Every point along (x->x+width, y+height)
    for (var j=0; j < [allLayers count]; j++){
      //Skip the current layer under consideration
      if(j != i){
        //var py = y+height;
        //for(var px=x; px < x + width; px++){
          //Check for px, py
          //Check for px + x_positiveError, py
          //Check for px - x_negativeError, py
          //Check for px, py + y_positiveError
          //Check for px, py - y_negativeError
        }
      }
    }
    //Every point along (x, y->y+height)
    for (var j=0; j < [allLayers count]; j++){
      //Skip the current layer under consideration
      if(j != i){
        //var px = x;
        //for(var py=y; py < y + height; py++){
          //Check for px, py
          //Check for px + x_positiveError, py
          //Check for px - x_negativeError, py
          //Check for px, py + y_positiveError
          //Check for px, py - y_negativeError
        }
      }
    }
    //Every point along (x+height, y->y+height)
    for (var j=0; j < [allLayers count]; j++){
      //Skip the current layer under consideration
      if(j != i){
        //var px = x;
        //for(var py=y; py < y + height; py++){
          //Check for px, py
          //Check for px + x_positiveError, py
          //Check for px - x_negativeError, py
          //Check for px, py + y_positiveError
          //Check for px, py - y_negativeError
        }
      }
    }
  }
}
