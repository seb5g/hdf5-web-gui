# PRESENT STATUS

## JUST STARTED

This is a web GUI for viewing HDF5 files.

The HDF Group  [made their own web ui](http://data.hdfgroup.org/),
which was the inspiration for this project, but I wanted to use different tools
for the interface than what they had chosen, namely to make something
responsive and to use a different plotting library.

This project makes use of the
[HDF5 file server](https://github.com/HDFGroup/h5serv) backend created by The
HDF Group, modified a bit in places (need to make this available!).

This web GUI is written in javascript, sprinkled with a bit of jquery, and
makes use of the [plotly](https://plot.ly/javascript/) graphing libraries.

This GUI and the REST server backend both have some ~~bugs~~ issues at this
point, hopefully they will be fixed soon :)

## SCREENSHOTS
3-dimensional, rotatable, zoomable plots of data can be made. Here's a
screenshot:

![3D surface plot](screenshots/screenshot-3d-plot.png)

Here's a screenshot of a 2-dimensional zoomable contour plot from a series of
images,  with x and y profile histograms that match the zoomed-in area:

![2D density plot](screenshots/screenshot-image-stack.png)

And here is a view the application when displayed on a mobile device, the hidden
menu has been clicked, which can then be hidden to just display the plot:

![Mobile view](screenshots/screenshot-mobile-view.png)
