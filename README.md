# JS Slider Plugin (WIP)

__current version: 0.6.0__

This is my own custom JS slider plugin - it's base on slider plugin I wrote for my web for scout course [Ficak](http://www.ficak.skauting.cz). But that version is a bit crude and I've got much better understanding of JS since that time. So I've desided do rewrite that plugin and to make it a Vanilla JS plugin in order to polish my JS skills and learn a new things in process.

Feel free to use it in your projects if you wish or leave a comments with suggestions and feedback.

My aim was to create lightweight vanilla JS plugin which can be used in most cases and can be styled easily. You can use almout any markup as a base for the slider (use `<div>`, `<ul>` or something else). Only condition is to have container with only items inside of it. Rest will be handled by the plugin itself.

FIXME - example of markup, setup, how to use it


## Features

- Lightweight with no dependency
- Compatibility with IE10+
- Responsive
- User can setup number of slides per view and to scroll separately
- Minimal styles - as the moment only core styles necessary for proper working of the plugin (without any visual styling) are avaiable. So you have full control over slider visualls
- Easy configuration


## TO-DO

- multiple objects on one page

- wrapper function - test feature compatibility (transition)
    - classList...
    - pokud neprojde feature testem - vypsat do console text s infem - možná pouze seřadit itemy a použít overflow-y pro posuvník (neřešit JS funkcionalitu)

- destroy function


### Things to add in the future

- Infinit scrolling
- Improve accessibility support
    - aria attributy
    - keyboard controls (what to do with links in slider?)?
- Make it more touch-friendly
- Add optional basic CSS template
- Possibility to add custom CSS classes to slider to separate functionality and presentation
- Maybe trigger custome events


## Known issues

- when resizing window white space may be visible (empty items) - have to reset position after resize as well
- bug during sliding - empty space after last slide
