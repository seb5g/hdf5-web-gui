/*global $, vis*/
'use strict';

var data = null;
var graph = null;

function custom(x, y) {
    return (Math.sin(x / 50) * Math.cos(y / 50) * 50 + 50);
}

// Called when the Visualization API is loaded.
function drawVisualization() {

    // Create and populate a data table.
    data = new vis.DataSet();

    // create some nice looking data with sin/cos
    var counter = 0;
    var steps = 50;  // number of datapoints will be steps*steps
    var axisMax = 314;
    var axisStep = axisMax / steps;
    for (var x = 0; x < axisMax; x+=axisStep) {
        for (var y = 0; y < axisMax; y+=axisStep) {
            var value = custom(x,y);
            data.add({id:counter++,x:x,y:y,z:value,style:value});
        }
    }

    // specify options
    var options = {
        width:  '600px',
        height: '600px',
        style: 'surface',
        showPerspective: true,
        showGrid: true,
        showShadow: false,
        keepAspectRatio: true,
        verticalRatio: 0.5
    };

// Instantiate our graph object.
var container = document.getElementById('mygraph');
    graph = new vis.Graph3d(container, data, options);
}

// This function fires when the page is loaded The chart is setup, and the
// first call to the data request function is made
$(document).ready(function () {

    console.log('document is ready');

    drawVisualization();
});