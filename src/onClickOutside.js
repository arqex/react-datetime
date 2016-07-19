'use strict';

// This is extracted from https://github.com/Pomax/react-onclickoutside
// And modified to support react 0.13 and react 0.14

var React = require('react'),
	version = React.version && React.version.split('.')
;

if ( version && ( version[0] > 0 || version[1] > 13 ) )
	React = require('react-dom');

// Use a parallel array because we can't use
// objects as keys, they get toString-coerced
var registeredComponents = [];
var handlers = [];

var IGNORE_CLASS = 'ignore-react-onclickoutside';

var isSourceFound = function(source, localNode) {
 if (source === localNode) {
   return true;
 }
 // SVG <use/> elements do not technically reside in the rendered DOM, so
 // they do not have classList directly, but they offer a link to their
 // corresponding element, which can have classList. This extra check is for
 // that case.
 // See: http://www.w3.org/TR/SVG11/struct.html#InterfaceSVGUseElement
 // Discussion: https://github.com/Pomax/react-onclickoutside/pull/17
 if (source.correspondingElement) {
   return source.correspondingElement.classList.contains(IGNORE_CLASS);
 }
 return source.classList.contains(IGNORE_CLASS);
};

module.exports = {
 componentDidMount: function() {
   if (typeof this.handleClickOutside !== 'function')
     throw new Error('Component lacks a handleClickOutside(event) function for processing outside click events.');

   var fn = this.__outsideClickHandler = (function(localNode, eventHandler) {
     return function(evt) {
       evt.stopPropagation();
       var source = evt.target;
       var found = false;
       // If source=local then this event came from "somewhere"
       // inside and should be ignored. We could handle this with
       // a layered approach, too, but that requires going back to
       // thinking in terms of Dom node nesting, running counter
       // to React's "you shouldn't care about the DOM" philosophy.
       while (source.parentNode) {
         found = isSourceFound(source, localNode);
         if (found) return;
         source = source.parentNode;
       }
       eventHandler(evt);
     };
   }(React.findDOMNode(this), this.handleClickOutside));

   var pos = registeredComponents.length;
   registeredComponents.push(this);
   handlers[pos] = fn;

   // If there is a truthy disableOnClickOutside property for this
   // component, don't immediately start listening for outside events.
   if (!this.props.disableOnClickOutside) {
     this.enableOnClickOutside();
   }
 },

 componentWillUnmount: function() {
   this.disableOnClickOutside();
   this.__outsideClickHandler = false;
   var pos = registeredComponents.indexOf(this);
   if ( pos>-1) {
     if (handlers[pos]) {
       // clean up so we don't leak memory
       handlers.splice(pos, 1);
       registeredComponents.splice(pos, 1);
     }
   }
 },

 /**
  * Can be called to explicitly enable event listening
  * for clicks and touches outside of this element.
  */
 enableOnClickOutside: function() {
   var fn = this.__outsideClickHandler;
   document.addEventListener('mousedown', fn);
   document.addEventListener('touchstart', fn);
 },

 /**
  * Can be called to explicitly disable event listening
  * for clicks and touches outside of this element.
  */
 disableOnClickOutside: function() {
   var fn = this.__outsideClickHandler;
   document.removeEventListener('mousedown', fn);
   document.removeEventListener('touchstart', fn);
 }
};
