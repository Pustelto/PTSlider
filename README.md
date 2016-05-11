# JS Slider Plugin (WIP)

__current version: 0.1.0__

This is my own custom JS slider plugin - it's base on slider plugin I wrote for my web for scout course [Ficak](http://www.ficak.skauting.cz). But that version is a bit crude and I've got much better understanding of JS since that time. So I've desided do rewrite that plugin and to make it a standalone JS plugin in order to polish my JS skills and learn a new things in process.

Feel free to use it in your projects if you wish (and when it's done :-))

My aim was to create lightweight vanilla JS plugin which can be used in most cases and can be styled easily. You can use almout any markup as a base for the slider (use `<div>`, `<ul>` or something else). Only condition is to have container with only items inside of it. Rest will be handled by the plugin itself.

FIXME - example of markup

## Features
- Responsive
- User can setup number of slides per view
- Infinite scrolling
- Minimal styles - uset either basic template (ADD NAME OF FILE) or only styles necessary for proper working of plugin (without any visual styling)
- Easy configuration

## How to use it

## Settings

## TO-DO

- destroy function

- trigerrovat eventy
    - init
    - beforeSlide
    - afterSlide
    - ...

- RENAME THE PLUGIN

- proper initialization - with init data attr, correct return function, based on class
- proper init wrapper and funtion (test if fce can be safely run - on.DomContentLoaded, nastavit init data attr)
- nevracet contructor, ale funkci, aby nemusel použít `new`
- wrapper function - test feature compatibility (transition)
    - classList...
    - pokud neprojde feature testem - vypsat do console text s infem - možná pouze seřadit itemy a použít overflow-y pro posuvník (neřešit JS funkcionalitu)

### Faze 2

- infinit scrolling

- accessibility
    - aria attributy
    - ovládání klávesnicí (jak to bude fungovat když item bude odkaz nebo bude odkazy obsahovat)?

- touch-friendly

- maybe IE9 an IE8 support

## BUGS:
- multiple objects on one page
- při lichám počtu itemů a sudém offsetu se špatně zvýrazňují bullety
