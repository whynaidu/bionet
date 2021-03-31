var express = require('express');
var appObj = express();
var apiObj = require("./api");
var viewObj = require("./loadView");
var loadViewPort = 8801;
var apiPort = 8802;

apiObj.api(appObj, apiPort);
viewObj.loadView(appObj, loadViewPort, apiPort);    