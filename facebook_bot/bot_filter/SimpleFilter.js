"use strict";
var util = require("./../utilities");
var _ = require("underscore");

class SimpleFilter {
    constructor(inputText, output){
        this._inputText = inputText;
        this._output = output;
    }
    process(input) {}
    setOutput(output) {
        this._output = output;
    }
    isMatch(input) {
        input = util.removeUnicode(input);
        // var n = input.indexOf(this._inputText);
        // return n>-1;
        return _.some(this._inputText, function(t) {
            return input.indexOf(t) > -1;
        });
    }
    reply(input) {
        return new Promise((resolve, reject) =>
            resolve(this._output)); 
    }
}
module.exports = SimpleFilter;