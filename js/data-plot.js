/*global $*/
'use strict';


// External libraries
var AJAX_SPINNER, Plotly, HANDLE_DATASET,

    // Global variables
    DATA_PLOT =
    {
        plotCanvasDiv : document.getElementById('plotCanvasDiv'),
        colorScale : 'Jet',
        plotLogValues : false,
        plotType : 'heatmap',
        displayType : '',
        initialDataValues : [],
        logOfDataValues : [],
        dataValues : [],
        resizeTimer : undefined,
        plotWidth : 550,
        plotHeight : 550,
        useDarkTheme : false,

        imageSeries : false,
        imageSeriesNodeId : undefined,
        imageSeriesTargetUrl : undefined,
        imageSeriesShapeDims : undefined,

        // Clear the plotting canvas along with whatever objects were there
        purgePlotCanvas : function () {
            Plotly.purge(DATA_PLOT.plotCanvasDiv);
        },


        // Draw an empty plot when there is no data yet selected
        drawText : function (itemTitle, itemValue, fontColor) {

            var debug = false, data, layout, options, mainDataPlot, string1,
                string2;

            DATA_PLOT.displayType = 'text';

            // Convert to strings, remove bad, bad things
            string1 = String(itemTitle);
            string2 = String(itemValue);
            string1 = string1.replace(/\$/g, '');
            string2 = string2.replace(/\$/g, '');

            // Check for empty values
            if (string2 === '') {
                string2 = '<empty value>';
            }

            if (debug) {
                console.log(itemTitle + ' --> ' + itemValue);
                console.log(string1 + ' --> ' + string2);
            }

            // Check for color choice
            fontColor = (fontColor === false ? '#ad3a3a' : fontColor);

            // Setup the empty data
            mainDataPlot = {
                z: [],
                type: 'heatmap',
                colorscale: DATA_PLOT.colorScale,
            };

            // All the data that is to be plotted
            data = [mainDataPlot];

            // The layout of the plotting canvas and axes.
            layout = {
                title: '',
                showlegend: false,
                autosize: false,
                width: DATA_PLOT.plotWidth,
                height: 300,
                paper_bgcolor : (DATA_PLOT.useDarkTheme === true ?
                        '#333333' : '#ffffff'),
                plot_bgcolor : (DATA_PLOT.useDarkTheme === true ?
                        '#333333' : '#ffffff'),

                xaxis: {
                    title: '',
                    showgrid: false,
                    zeroline: false,
                    showticklabels : false,
                    ticks : '',
                },

                yaxis: {
                    title: '',
                    showgrid: false,
                    zeroline: false,
                    showticklabels : false,
                    ticks : '',
                },

                // More annotation examples here:
                //  https://plot.ly/javascript/text-and-annotations/
                annotations: [
                    {
                        x: 0,
                        y: 0,
                        xref: 'x',
                        yref: 'y',
                        text: '<b>' + string1 + '</b>' + '<br>' + string2,
                        showarrow: false,
                        font: {
                            family: 'Courier New, monospace',
                            size: 16,
                            color: fontColor,
                        },
                        align: 'center',
                        bordercolor: fontColor,
                        borderwidth: 3,
                        borderpad: 4,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        opacity: 0.8
                    }
                ],
            };

            options = {
                staticPlot: true,
                showLink: false,
                displaylogo: false,
                modeBarButtonsToRemove: [
                    'sendDataToCloud', 'hoverCompareCartesian',
                    'hoverClosestCartesian', 'resetScale2d', 'hoverClosest3d',
                    'resetCameraLastSave3d', 'orbitRotation', 'zoomIn2d',
                    'zoomOut2d'],
                displayModeBar: false,
                showTips: false,
            };

            DATA_PLOT.purgePlotCanvas();
            Plotly.newPlot(DATA_PLOT.plotCanvasDiv, data, layout, options
                ).then(
                AJAX_SPINNER.doneLoadingData()
            );

        },

        displayingImageSeries : function (trueOrFalse) {
            DATA_PLOT.imageSeries = trueOrFalse;
            document.getElementById("inputNumberDiv").value = 0;
        },

        enableImagePlotControls : function (enableControls,
            enableImageSeriesControls) {
        // The buttons are initially disabled when the page loads, enable them
        // here

            var i, classNames = 'hidden-xs hidden-sm hidden-md hidden-lg',
                divNames = ['#plotTypeButtonDiv', '#logButtonDiv',
                    '#colorButtonDiv'],
                seriesControls = ['#inputNumberDiv', '#beginButtonDiv',
                    '#plusButtonDiv', '#endButtonDiv', '#minusButtonDiv',
                    '#sliderDiv'];

            // General plotting controls
            for (i = 0; i < divNames.length; i += 1) {
                if (enableControls) {
                    $(divNames[i]).removeClass(classNames);
                } else {
                    $(divNames[i]).addClass(classNames);
                }
            }

            // Image series controls
            for (i = 0; i < seriesControls.length; i += 1) {
                if (enableImageSeriesControls) {
                    $(seriesControls[i]).removeClass(classNames);
                } else {
                    $(seriesControls[i]).addClass(classNames);
                }
            }

        },


        displayErrorMessage : function (inputUrl) {
            DATA_PLOT.displayingImageSeries(false);
            DATA_PLOT.enableImagePlotControls(false, false);
            DATA_PLOT.drawText('I don\'t know how to handle this yet!',
                'Sorry for the inconvenience :(',
                '#ad3a74');
            console.log('inputUrl: ' + inputUrl);
        },


        drawLine : function (value, nodeTitle) {

            var data, layout, options;

            // Create data object
            data = [
                {
                    y: value,
                    mode: 'lines',
                    type: 'scatter'
                }
            ];

            // And the layout
            layout = {
                showlegend: false,
                title: nodeTitle,
                autosize: false,
                width: DATA_PLOT.plotWidth,
                height: DATA_PLOT.plotHeight,
                hovermode: 'closest',
                bargap: 0,
                paper_bgcolor : (DATA_PLOT.useDarkTheme === true ?
                        '#333333' : '#ffffff'),
                plot_bgcolor : (DATA_PLOT.useDarkTheme === true ?
                        '#333333' : '#ffffff'),
                margin: {
                    l: 65,
                    r: 50,
                    b: 65,
                    t: 90,
                },
                xaxis: {
                    title: 'array index',
                },
                yaxis: {
                    title: 'values',
                }
            };

            options = {
                staticPlot: false,
                showLink: false,
                displaylogo: false,
                modeBarButtonsToRemove: [
                    'sendDataToCloud', 'hoverCompareCartesian',
                    'hoverClosestCartesian', 'resetScale2d', 'hoverClosest3d',
                    'resetCameraLastSave3d', 'orbitRotation', 'zoomIn2d',
                    'zoomOut2d'],
                displayModeBar: true,
                showTips: false,
                scrollZoom: true,
            };
            // All options are here:
            //  https://github.com/plotly/plotly.js/blob/master/src/plot_api/
            //      plot_config.js
            //  https://github.com/plotly/plotly.js/blob/master/src/components/
            //      modebar/buttons.js

            // Present them
            DATA_PLOT.purgePlotCanvas();
            Plotly.newPlot(DATA_PLOT.plotCanvasDiv, data, layout,
                options).then(AJAX_SPINNER.doneLoadingData()
                );

        },


        draw3DPlot : function () {

            var data, layout, options;

            // Create data object
            data = [
                {
                    z: DATA_PLOT.dataValues,
                    type: DATA_PLOT.plotType,
                    colorscale: DATA_PLOT.colorScale,

                    // opacity: 0.999,
                    // autocolorscale : false,
                    // colorscale : [[0, 'rgb(0,0,255)', 1, 'rgb(255,0,0)']],
                    // cauto: false,
                    // contours : {
                    //     x : {
                    //         show : true,
                    //     },
                    //     y : {
                    //         show : true,
                    //     },
                    //     z : {
                    //         show : true,
                    //     },
                    // },

                }
            ];

            // And the layout
            layout = {
                showlegend: false,
                title: 'Title goes here',
                autosize: false,
                width: DATA_PLOT.plotWidth,
                height: DATA_PLOT.plotHeight,
                hovermode: 'closest',
                bargap: 0,
                paper_bgcolor : (DATA_PLOT.useDarkTheme === true ?
                        '#333333' : '#ffffff'),
                plot_bgcolor : (DATA_PLOT.useDarkTheme === true ?
                        '#333333' : '#ffffff'),
                margin: {
                    l: 65,
                    r: 50,
                    b: 65,
                    t: 90,
                },
                scene: {
                    xaxis: {
                        title: 'x',
                    },
                    zaxis: {
                        title: 'z blah',
                        type: 'linear',
                        // type: 'log',
                        autorange: true
                    }
                }
            };

            options = {
                staticPlot: false,
                showLink: false,
                displaylogo: false,
                modeBarButtonsToRemove: [
                    'sendDataToCloud', 'hoverCompareCartesian',
                    'hoverClosestCartesian', 'resetScale2d', 'hoverClosest3d',
                    'resetCameraLastSave3d', 'orbitRotation', 'zoomIn2d',
                    'zoomOut2d'],
                displayModeBar: true,
                showTips: false,
                scrollZoom: true,
            };
            // All options are here:
            //  https://github.com/plotly/plotly.js/blob/master/src/plot_api/
            //      plot_config.js
            //  https://github.com/plotly/plotly.js/blob/master/src/components/
            //      modebar/buttons.js

            // Present them
            DATA_PLOT.purgePlotCanvas();
            Plotly.newPlot(DATA_PLOT.plotCanvasDiv, data, layout,
                options).then(
                AJAX_SPINNER.doneLoadingData()
            );

        },


        // Fill x and y profile histograms, given the image and the dimensions
        // of the section of the image being viewed
        fillProfileHistograms : function (useFillLimitsX, xMin, xMax,
            useFillLimitsY, yMin, yMax) {

            var debug = false, i, j, useFillLimits = false, histValuesX1 = [],
                histValuesY1 = [], histValuesX2 = [], histValuesY2 = [];

            if (debug) {
                console.log('useFillLimitsX: ' + useFillLimitsX);
                console.log('xMin:           ' + xMin);
                console.log('xMax:           ' + xMax);
                console.log('useFillLimitsY: ' + useFillLimitsY);
                console.log('yMin:           ' + yMin);
                console.log('yMax:           ' + yMax);
            }

            if (useFillLimitsY || useFillLimitsX) {
                useFillLimits = true;
            }

            if (!useFillLimitsX) {
                xMin = 0;
                xMax = DATA_PLOT.dataValues[0].length;
            }

            if (!useFillLimitsY) {
                yMin = 0;
                yMax = DATA_PLOT.dataValues.length;
            }

            // Fill profile histograms
            for (i = 0; i < DATA_PLOT.dataValues.length; i += 1) {

                // The y-profile values
                histValuesX1[i] = i;
                histValuesY1[i] = 0;

                for (j = 0; j < DATA_PLOT.dataValues[i].length; j += 1) {

                    if (i === 0) {
                        // The x-profile values
                        histValuesX2[j] = j;
                        histValuesY2[j] = 0;
                    }

                    // If zooming, fill only relevant data
                    if (!useFillLimits || (useFillLimits &&
                            i >= yMin && i < yMax && j >= xMin && j < xMax)) {
                        histValuesY1[i] += DATA_PLOT.dataValues[i][j];
                        histValuesY2[j] += DATA_PLOT.dataValues[i][j];
                    }
                }
            }

            if (debug) {
                console.log('histValuesX1.length: ' + histValuesX1.length);
                console.log('histValuesY1.length: ' + histValuesY1.length);
                console.log('histValuesY1[' + yMin + ']:     ' +
                    histValuesY1[yMin]);
                console.log('histValuesX2.length: ' + histValuesX2.length);
                console.log('histValuesY2.length: ' + histValuesY2.length);
                console.log('histValuesY2[' + xMin + ']:     ' +
                    histValuesY2[xMin]);
            }

            return {
                histValuesX1 : histValuesX1,
                histValuesY1 : histValuesY1,
                histValuesX2 : histValuesX2,
                histValuesY2 : histValuesY2,
            };

        },


        draw2DPlot : function () {
        // Plot the image as a 2D heatmap along with x and y profile histograms
        // that update when zooming

            var debug = false, profiles, xProfilePlot, yProfilePlot, data,
                layout, options, mainDataPlot;

            if (debug) {
                console.log('DATA_PLOT.dataValues.length: ' +
                    DATA_PLOT.dataValues.length);
            }

            profiles = DATA_PLOT.fillProfileHistograms(false, 0, 0, false, 0,
                0);

            // The primary, 2-dimensional plot of the data - works best as a
            // 'contour' plot me thinks
            mainDataPlot = {
                z: DATA_PLOT.dataValues,
                // zmin: 0,
                // zmax: 6,
                zsmooth: false,
                // zsmooth: 'best',
                type: DATA_PLOT.plotType,
                // line: {
                //     smoothing: 0.5
                // },
                colorscale: DATA_PLOT.colorScale,
            };

            // The x-profile of the plot, displayed as a bar chart / histogram
            xProfilePlot = {
                x: profiles.histValuesX2,
                y: profiles.histValuesY2,
                name: 'x profile',
                marker: {color: 'rgb(102,0,0)'},
                yaxis: 'y2',
                type: 'bar'
            };

            // The y-profile, also displayed as a bar chart / histogram,
            // oriented horizontally
            yProfilePlot = {
                x: profiles.histValuesY1,
                y: profiles.histValuesX1,
                name: 'y profile',
                marker: {color: 'rgb(102,0,0)'},
                xaxis: 'x2',
                type: 'bar',
                orientation: 'h'
            };

            // All the data that is to be plotted
            data = [mainDataPlot, xProfilePlot, yProfilePlot];

            // The layout of the plotting canvas and axes. Note that the amount
            // of space each plot takes up is a range from 0 to 1, and follows
            // the keyword 'domain'
            layout = {
                title: 'Title goes here',
                showlegend: false,
                autosize: false,
                width: DATA_PLOT.plotWidth,
                height: DATA_PLOT.plotHeight,
                hovermode: 'closest',
                bargap: 0,
                paper_bgcolor : (DATA_PLOT.useDarkTheme === true ?
                        '#333333' : '#ffffff'),
                plot_bgcolor : (DATA_PLOT.useDarkTheme === true ?
                        '#333333' : '#ffffff'),

                xaxis: {
                    title: 'x',
                    domain: [0, 0.85],
                    showgrid: false,
                    zeroline: false
                },

                yaxis: {
                    title: 'y',
                    domain: [0, 0.85],
                    showgrid: false,
                    zeroline: false
                },

                xaxis2: {
                    domain: [0.85, 1],
                    showgrid: false,
                    zeroline: false
                },

                yaxis2: {
                    domain: [0.85, 1],
                    showgrid: false,
                    zeroline: false
                },
            };

            options = {
                staticPlot: false,
                showLink: false,
                displaylogo: false,
                modeBarButtonsToRemove: [
                    'sendDataToCloud', 'hoverCompareCartesian',
                    'hoverClosestCartesian', 'resetScale2d', 'hoverClosest3d',
                    'resetCameraLastSave3d', 'orbitRotation', 'zoomIn2d',
                    'zoomOut2d'],
                displayModeBar: true,
                showTips: false,
                scrollZoom: true,
            };
            // All options are here:
            //  https://github.com/plotly/plotly.js/blob/master/src/plot_api/
            //      plot_config.js
            //  https://github.com/plotly/plotly.js/blob/master/src/components/
            //      modebar/buttons.js

            DATA_PLOT.purgePlotCanvas();
            Plotly.newPlot(DATA_PLOT.plotCanvasDiv, data, layout,
                options).then(
                AJAX_SPINNER.doneLoadingData()
            );

            // Refill the profile histograms when a zoom event occurs
            // Why isn't this done already in the plotly library?!
            DATA_PLOT.plotCanvasDiv.on('plotly_relayout',
                function (eventdata) {

                    var useFillLimitsX = false, xMin = 0, xMax = 0,
                        useFillLimitsY = false, yMin = 0, yMax = 0;

                    if (debug) {
                        console.log('plotly_relayout ' + DATA_PLOT.plotType);
                        console.log(JSON.stringify(eventdata));
                    }

                    if (eventdata.hasOwnProperty('width') &&
                            eventdata.hasOwnProperty('height')) {

                        if (debug) {
                            console.log('Looks like a window resize event, ' +
                                'not going to refill profile histograms');
                        }

                        return;
                    }


                    if ((eventdata.hasOwnProperty('xaxis.range[0]') &&
                            eventdata.hasOwnProperty('xaxis.range[1]')) ||
                            (eventdata.hasOwnProperty('yaxis.range[0]') &&
                            eventdata.hasOwnProperty('yaxis.range[1]'))) {

                        if (debug) {
                            console.log('Looks like a plot zoom event,' +
                                ' carry on!');
                        }
                    }


                    if (eventdata.hasOwnProperty('xaxis.range[0]') &&
                            eventdata.hasOwnProperty('xaxis.range[1]')) {

                        xMin = Math.floor(eventdata['xaxis.range[0]']);
                        xMax = Math.ceil(eventdata['xaxis.range[1]']);
                        useFillLimitsX = true;
                    }
                    if (eventdata.hasOwnProperty('yaxis.range[0]') &&
                            eventdata.hasOwnProperty('yaxis.range[1]')) {

                        yMin = Math.floor(eventdata['yaxis.range[0]']);
                        yMax = Math.ceil(eventdata['yaxis.range[1]']);
                        useFillLimitsY = true;
                    }

                    if (debug) {
                        console.log('x-axis start: ' + xMin);
                        console.log('x-axis end:   ' + xMax);
                        console.log('y-axis start: ' + yMin);
                        console.log('y-axis end:   ' + xMax);
                    }

                    profiles = DATA_PLOT.fillProfileHistograms(useFillLimitsX,
                        xMin, xMax, useFillLimitsY, yMin, yMax);

                    Plotly.restyle(DATA_PLOT.plotCanvasDiv, {
                        x: [profiles.histValuesX2],
                        y: [profiles.histValuesY2],
                    }, [1]);

                    Plotly.restyle(DATA_PLOT.plotCanvasDiv, {
                        x: [profiles.histValuesY1],
                        y: [profiles.histValuesX1],
                    }, [2]);
                });
        },


        // Calculate the plot size - needs to be improved for small screens
        calculatePlotSize : function () {

            var debug = true, newPlotDivHeight, newPlotDivWidth,
                windowWidth = $(window).width(),
                windowHeight = $(window).height(),
                appWidth = $('#applicationContainer').width(),
                appHeight = $('#applicationContainer').height(),
                containerWidth = $('#plotContainer').width(),
                containerHeight = $('#plotContainer').height(),
                divWidth = $('#plotCanvasDiv').width(),
                divHeight = $('#plotCanvasDiv').height();

            newPlotDivHeight = windowHeight - 80;
            if (DATA_PLOT.imageSeries) {
                newPlotDivHeight -= 35;
            }
            newPlotDivWidth = containerWidth - 40;

            if (debug) {
                console.log('DATA_PLOT.imageSeries: ' + DATA_PLOT.imageSeries);
                console.log('appWidth:     ' + appWidth);
                console.log('appHeight:    ' + appHeight);
                console.log('windowWidth:  ' + windowWidth);
                console.log('windowHeight: ' + windowHeight);
                console.log('divWidth:     ' + divWidth);
                console.log('divHeight:    ' + divHeight);
                console.log('containerWidth:   ' + containerWidth);
                console.log('containerHeight:  ' + containerHeight);
                console.log('newPlotDivHeight: ' + newPlotDivHeight);
                console.log('newPlotDivWidth:  ' + newPlotDivWidth);
            }

            $('#plotCanvasDiv').height(newPlotDivHeight);
            DATA_PLOT.plotWidth = newPlotDivWidth;
            DATA_PLOT.plotHeight = newPlotDivHeight;
        },


        // Plot the data!
        plotLine : function (value, nodeTitle) {

            DATA_PLOT.displayType = 'line';

            DATA_PLOT.calculatePlotSize();

            DATA_PLOT.drawLine(value, nodeTitle);

        },


        // Plot the data!
        plotData : function () {

            DATA_PLOT.displayType = 'image';

            DATA_PLOT.calculatePlotSize();

            if (DATA_PLOT.plotType === 'heatmap') {
                DATA_PLOT.draw2DPlot();
            } else {
                DATA_PLOT.draw3DPlot();
            }

        },


        // Change the plot type - not all work well for large numbers of
        // points, I think that 'surface' and 'heatmap' seem to work best and
        // are useful
        changeType : function (type) {

            ///////////////////////////////////////////////////////////////////
            // Should use restyle instead of redrawing the entire plot:
            //   https://plot.ly/javascript/plotlyjs-function-reference/
            //      #plotly-restyle
            //
            // This doesn't work so well currently, but maybe if I fix things
            // up a bit?
            // Plotly.restyle(DATA_PLOT.plotCanvasDiv, {
            //     type: [type],
            // }, [0]);
            ///////////////////////////////////////////////////////////////////

            if (type !== '') {
                DATA_PLOT.purgePlotCanvas();
                AJAX_SPINNER.startLoadingData(1);
                DATA_PLOT.plotType = type;
                setTimeout(function () {
                    DATA_PLOT.plotData();
                }, 10);
            }

        },


        // Change the color map
        changeColor : function (colorscale) {

            if (colorscale !== '') {

                DATA_PLOT.colorScale = colorscale;

                Plotly.restyle(DATA_PLOT.plotCanvasDiv, {
                    colorscale: DATA_PLOT.colorScale
                }, [0]);
            }
        },


        // Switch between the use of log and non-log values
        toggleLogPlot : function (useLog) {

            var debug = true, useRestyle = false, type = 'linear';

            if (debug) {
                console.log('useLog: ' + useLog);
            }

            // Clear the plot and start the laoder, as this can take some time
            // when the plot has many points
            if (!useRestyle) {
                DATA_PLOT.purgePlotCanvas();
            }
            AJAX_SPINNER.startLoadingData(1);

            if (useLog === undefined) {
                DATA_PLOT.plotLogValues = !DATA_PLOT.plotLogValues;
            } else {
                DATA_PLOT.plotLogValues = useLog;
            }

            if (DATA_PLOT.plotLogValues) {
                if (debug) {
                    console.log('Log Plot!');
                }
                $("#logPlotButton").html('Log Plot!');
                $("#logPlotButton").addClass('btn-success');

                if (useRestyle) {
                    type = 'log';
                } else {
                    DATA_PLOT.dataValues = DATA_PLOT.logOfDataValues;
                }
            } else {
                if (debug) {
                    console.log('Log Plot?');
                }
                $("#logPlotButton").html('Log Plot?');
                $("#logPlotButton").removeClass('btn-success');

                if (useRestyle) {
                    type = 'linear';
                } else {
                    DATA_PLOT.dataValues = DATA_PLOT.initialDataValues;
                }
            }

            // I can't get this restyle command to work quite right yet with
            // log scales & colorscheme... the scale of the colorbar is all off
            // :(
            setTimeout(function () {

                if (useRestyle) {
                    // Plotly.restyle(DATA_PLOT.plotCanvasDiv, {
                    //     z: [DATA_PLOT.dataValues],
                    // }, [0]).then(
                    //     AJAX_SPINNER.doneLoadingData()
                    // );
                    Plotly.relayout(DATA_PLOT.plotCanvasDiv, {
                        scene: {
                            zaxis: {
                                type: type
                            }
                        }
                    }, [0]).then(
                        AJAX_SPINNER.doneLoadingData()
                    );
                } else {
                    DATA_PLOT.plotData();
                }
            }, 10);

        },


        // Save the image data and the log of the image data to global
        // variables
        initializeImageData : function (value) {

            var i, j, logOfValue = [];

            DATA_PLOT.initialDataValues = value;

            // Take the log of the points, save for future use - is there a
            // better way??
            for (i = 0; i < value.length; i += 1) {
                logOfValue[i] = [];
                for (j = 0; j < value[i].length; j += 1) {
                    if (value[i][j] > 0) {
                        // Interesting - log10() is much slow than log()
                        //
                        // Also, this is slow:
                        //    value[i][j] = Math.log(value[i][j]) / Math.LN10;
                        // And just dividing by a number that equals
                        // Math.log(10) makes using the array slow...:
                        //    value[i][j] = Math.log(value[i][j]) / mathLog10;

                        // This seems to be the fastest - especially with
                        // contour plots Maybe don't use contour plots??
                        // logOfValue[i][j] = Math.log(value[i][j]);
                        // But maybe log10 makes more sense to use?
                        logOfValue[i][j] = Math.log(value[i][j]) / Math.LN10;
                    } else {
                        logOfValue[i][j] = 0;
                    }
                }
            }

            // Save the log values
            DATA_PLOT.logOfDataValues = logOfValue;

            // Set the default data to use for plotting - raw values or thei
            // log
            if (DATA_PLOT.plotLogValues) {
                DATA_PLOT.dataValues = DATA_PLOT.logOfDataValues;
            } else {
                DATA_PLOT.dataValues = DATA_PLOT.initialDataValues;
            }

        },


        isNumeric : function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },


        imageSeriesInput : function (value) {

            var debug = true, min = 0,
                max = DATA_PLOT.imageSeriesShapeDims[0] - 1;

            if (debug) {
                console.log('imageSeriesInput: ' + value);
                console.log('min: ' + min);
                console.log('max: ' + max);
            }

            AJAX_SPINNER.startLoadingData(100);

            if (DATA_PLOT.isNumeric(value)) {

                if (value < min) {
                    value = min;
                    document.getElementById("inputNumberDiv").value = min;
                }

                if (value >= max) {
                    value = max;
                    document.getElementById("inputNumberDiv").value = max;
                }

                if (value >= min && value <= max) {
                    $.when(
                        HANDLE_DATASET.readImageSeries(
                            DATA_PLOT.imageSeriesTargetUrl,
                            DATA_PLOT.imageSeriesNodeId,
                            DATA_PLOT.imageSeriesShapeDims,
                            value
                        )
                    ).then(

                        function (image) {
                            DATA_PLOT.initializeImageData(image);

                            // Change the data used in the plot
                            Plotly.restyle(DATA_PLOT.plotCanvasDiv, {
                                z: [DATA_PLOT.dataValues],
                            }, [0]).then(
                                AJAX_SPINNER.doneLoadingData()
                            );
                        }

                    );
                }
            }
        },


        saveImageSeriesInfo : function (targetUrl, nodeId, shapeDims) {
            DATA_PLOT.imageSeriesNodeId = nodeId;
            DATA_PLOT.imageSeriesTargetUrl = targetUrl;
            DATA_PLOT.imageSeriesShapeDims = shapeDims;
        },


        showPlotCanvas : function () {
            // console.log('showPlotCanvas');
            document.getElementById("plotCanvasDiv").style.display = "block";


            // Look at :
            //  http://seiyria.com/bootstrap-slider/
            //  https://github.com/seiyria/bootstrap-slider
            $('#slider').slider({
                formatter: function (value) {
                    return 'Current value: ' + value;
                }
            });
            $('#slider').slider().on('slide', function (slideEvt) {
                document.getElementById("inputNumberDiv").value =
                    slideEvt.value;
                DATA_PLOT.imageSeriesInput(slideEvt.value);
            });

        },

    };


// Handle increment click events
$('.btn-number').click(function (e) {

    var fieldName, type, input, currentVal;

    e.preventDefault();

    fieldName = $(this).attr('data-field');
    type = $(this).attr('data-type');
    input = $("input[name='" + fieldName + "']");
    currentVal = parseInt(input.val(), 10);

    if (!isNaN(currentVal)) {
        if (type === 'minus') {

            if (currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            }
            if (currentVal === input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if (type === 'plus') {

            if (currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
            if (currentVal === input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
});


// This function fires when the browser window is resized
$(window).resize(function () {

    var debug = false, plotHeight = DATA_PLOT.plotHeight;

    if (debug) {
        console.log('wait for it...');
    }


    // During a window resize event, the resize function will be called several
    // times per second, on the order of 15! Best to wait a bit try to just
    // resize once, as it's a bit costly for plotly to execute relyout
    clearTimeout(DATA_PLOT.resizeTimer);

    DATA_PLOT.resizeTimer = setTimeout(function () {

        if (debug) {
            console.log('about to run Plotly.relayout');
        }

        // Calculate the plot dimensions and save them
        DATA_PLOT.calculatePlotSize();

        // Use smaller canvas when displaying text instead of images
        if (DATA_PLOT.displayType === 'text') {
            plotHeight = 300;
        } else {
            plotHeight = DATA_PLOT.plotHeight;
        }

        Plotly.relayout(DATA_PLOT.plotCanvasDiv, {
            width: DATA_PLOT.plotWidth,
            height: plotHeight,
        });

    }, 200);
});


// This function fires when the page is loaded
$(document).ready(function () {

    var debug = false;

    if (debug) {
        console.log('document is ready');
        $("#plotCanvasDiv").addClass('debugRed');
        $("#plotControls").addClass('debugBlue');
    }

    // Calculate the plot dimensions and save them
    DATA_PLOT.calculatePlotSize();

    DATA_PLOT.showPlotCanvas();
});
