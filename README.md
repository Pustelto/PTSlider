# JS Slider Plugin (WIP)

__current version: 0.8.0__

This is my own custom JS slider plugin - it's base on slider plugin I wrote for my web for scout course [Ficak](http://www.ficak.skauting.cz). But that version is a bit crude and I've got much better understanding of JS since that time. So I've desided do rewrite that plugin and to make it a Vanilla JS plugin in order to polish my JS skills and learn a new things in process.

Feel free to use it in your projects if you wish or leave a comments with suggestions and feedback.

My aim was to create lightweight vanilla JS plugin which can be used in most cases and can be styled easily. You can use almout any markup as a base for the slider (use `<div>`, `<ul>` or something else). Only condition is to have container with only items inside of it. Rest will be handled by the plugin itself.


## Features

- Lightweight with no dependency
- Compatibility with IE10+
- Responsive
- User can setup number of slides per view and to scroll separately
- Minimal styles - as the moment only core styles necessary for proper working of the plugin (without any visual styling) are avaiable. So you have full control over slider visualls
- Easy configuration


## TO-DO
- Fix event listeners to be able to remove them - need to refactor entire wrapper function (remove prototype inheritance, do proper module patern)
- Destroy function

- Wrapper function - test feature compatibility (transition)
    - classList...
    - if feature test fail - console.log info text about fail, maybe order items and use overflow-y to make content accessible

- Documentation, README.md


### Things to add in the future

- Infinit scrolling
- Improve accessibility support
    - aria attributes
    - keyboard controls (what to do with links in slider?)?
- Make it more touch-friendly
- Add optional basic CSS template
- Possibility to add custom CSS classes to slider to separate functionality and presentation
- Maybe trigger custome events
- Clean and refactor code base (for optimalization and performance)


## Known issues

1. when resizing window white space may be visible (empty items) - have to reset position after resize as well
3. responsive - during init is number of slides decreased only by one, not to number corresponding with screen size


zjistit jestli nepřetékám (nevzniká volné místo) při resizu - korekce indexu - ???

zjistit podle šířky slideru a počtu zobrazovaných itemů správny počet itemů pro zobrazení - udělat fce místo detectbreakpoint - fce se bude volat i na začátku v setupu - nemusím takp o initu vše znovu přepočítávat. (fix pro 3)

