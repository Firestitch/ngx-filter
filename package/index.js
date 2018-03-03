(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("@firestitch/filter", [], factory);
	else if(typeof exports === 'object')
		exports["@firestitch/filter"] = factory();
	else
		root["@firestitch/filter"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../node_modules/resolve-url-loader/index.js?{\"sourceMap\":true}!../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!./components/fsfilter/fsfilter.component.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, ".fs-filter {\n  position: relative;\n  margin-bottom: 20px;\n}\n\n.fs-filter .inline-filter {\n  display: inline-block;\n}\n\n.fs-filter .inline-filter .filter-group {\n  display: inline-block;\n}\n\n.fs-filter .title {\n  display: none;\n}\n\n.fs-filter .results {\n  min-height: 90px;\n  position: relative;\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n\n.fs-filter .status {\n  position: relative;\n}\n\n.fs-filter .status .progress-infinite {\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n.fs-filter .full-search .filter.filter-date > span {\n  display: inline-block;\n}\n\n.fs-filter .filter-by {\n  display: none;\n}\n\n.fs-filter .menu-filter .search {\n  top: 8px;\n  position: absolute;\n  margin-left: 1px;\n  left: 0;\n}\n\n.fs-filter .menu-filter .search mat-icon {\n  -webkit-transform: scale(0.9);\n          transform: scale(0.9);\n}\n\n.fs-filter .menu-filter .backdrop {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 69;\n  outline: none;\n}\n\n.fs-filter .menu-filter .menu-filter-input {\n  position: relative;\n  /*\n      .action-filter {\n        display: none;\n        z-index: 30;\n      }\n      */\n  /*\n      TODO\n      md-datepicker-container {\n        width: 100%;\n        .md-datepicker-input-container {\n            margin-left: 0;\n        }\n      }\n      */\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions {\n  white-space: nowrap;\n  position: absolute;\n  right: 0;\n  top: 8px;\n  z-index: 50;\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions a {\n  color: rgba(0, 0, 0, .54);\n  background: #fff;\n  height: 22px;\n  margin-bottom: 5px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions a i {\n  -webkit-transform: scale(0.9);\n          transform: scale(0.9);\n  vertical-align: middle;\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions a:hover {\n  color: inherit;\n}\n\n.fs-filter .menu-filter .menu-filter-input mat-form-field {\n  width: 100%;\n}\n\n.fs-filter .menu-filter .menu-filter-input .main-filter-bar {\n  height: 40px;\n  /* Largest height between inputs, buttons, icons */\n}\n\n.fs-filter .menu-filter .menu-filter-input .main-filter-bar mat-form-field {\n  width: 100%;\n  /*\n          input {\n            padding-right: 26px;\n            padding-left: 26px;\n            position: relative;\n          }\n          */\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters {\n  position: absolute;\n  width: 100%;\n  margin-top: -4px;\n  display: none;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .wrap {\n  padding: 8px 17px 17px 17px;\n  background: #fff;\n  -webkit-box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, .2), 0px 4px 5px 0px rgba(0, 0, 0, .14), 0px 1px 10px 0px rgba(0, 0, 0, .12);\n          box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, .2), 0px 4px 5px 0px rgba(0, 0, 0, .14), 0px 1px 10px 0px rgba(0, 0, 0, .12);\n  overflow: auto;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter-group {\n  display: table-row-group;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter {\n  display: table-row;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface.interface-range input {\n  text-align: center;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface.interface-datetime fs-datetime.has-time .md-input {\n  width: 100%;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface fs-datetime-range input {\n  text-align: center;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface,\n.fs-filter .menu-filter .menu-filter-input .filters .filter .filter-label {\n  display: table-cell;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .filter-label {\n  width: 1%;\n  white-space: nowrap;\n  vertical-align: middle;\n  padding-right: 15px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters md-autocomplete-container md-input-container {\n  margin: 0;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .isolate .interface {\n  line-height: 20px;\n  padding-top: 5px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .isolate md-checkbox {\n  margin: 0 0 0 2px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .buttons {\n  padding-top: 15px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .buttons .filter-button,\n.fs-filter .menu-filter .menu-filter-input .filters .buttons .cancel-button {\n  margin: 0;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .buttons .cancel-button {\n  margin-left: 8px;\n}\n\n.fs-filter .filter {\n  margin-right: 15px;\n  display: inline-block;\n}\n\n.fs-filter .filter label {\n  white-space: nowrap;\n  color: rgba(0, 0, 0, .54);\n}\n\n.fs-filter .filter.filter-range mat-form-field {\n  min-width: 0;\n  min-width: initial;\n  width: 50px;\n}\n\n.fs-filter .filter.filter-range mat-form-field.filter-range-min {\n  margin-right: 5px;\n}\n\n.fs-filter .infinite-records {\n  color: #999;\n  font-size: 13px;\n  margin-left: 4px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: block;\n}\n\n.fs-filter .infinite-records .order-toggle {\n  cursor: pointer;\n  padding-left: 4px;\n}\n\n.fs-filter .infinite-records .saved-filters {\n  float: right;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.fs-filter .md-datepicker-calendar-pane {\n  margin-left: -10px;\n}\n\n.fs-filter .saved-filter-menu {\n  padding-top: 0;\n}\n\n.fs-filter .saved-filter-menu .my-saved-filters {\n  line-height: 50px;\n  padding: 0 10px;\n  font-weight: bold;\n}\n\n.fs-filter.filters-open .inline-actions {\n  z-index: 71;\n}\n\n.fs-filter.filters-open .main-filter-bar md-input-container input,\n.fs-filter.filters-open .menu-filter-input .filters {\n  z-index: 70;\n  display: block;\n}\n\n@media screen and (max-width: 750px) {\n  .fs-filter .saved-filters {\n    float: none;\n  }\n}\n\n@media screen and (max-width: 599px) {\n  body.fs-filters-open {\n    overflow: hidden !important;\n  }\n\n  body.fs-filters-open .inline-actions {\n    display: none;\n  }\n\n  .fs-filter {\n    margin-top: 0;\n  }\n\n  .fs-filter .title {\n    display: block;\n    /*\n      fs-heading {\n        margin: 0;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n      }\n      */\n  }\n\n  .responsive-top-actions {\n    display: block;\n  }\n\n  .filter-by {\n    margin: 10px 0;\n  }\n\n  .menu-filter .menu-filter-input .filters .wrap {\n    position: fixed;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    overflow-y: auto;\n    z-index: 999;\n  }\n\n  .menu-filter .menu-filter-input .filters .filter-group,\n  .menu-filter .menu-filter-input .filters .filter,\n  .menu-filter .menu-filter-input .filters .filter .filter-label,\n  .menu-filter .menu-filter-input .filters .filter .interface {\n    display: block;\n  }\n\n  .menu-filter .menu-filter-input .action-reload {\n    display: none;\n  }\n\n  .menu-filter .menu-filter-input .filter-group {\n    margin: 10px 0 0 0;\n  }\n\n  .menu-filter .menu-filter-input .filter-group:first-child {\n    margin: 0;\n  }\n\n  .menu-filter .menu-filter-input .filter .filter-label {\n    line-height: 21px;\n    display: block;\n    -webkit-transform: translate3d(0, 7px, 0) scale(0.75);\n    transform: translate3d(0, 7px, 0) scale(0.75);\n    -webkit-transition: cubic-bezier(0.25, 0.8, 0.25, 1) 0.25s;\n    transition: cubic-bezier(0.25, 0.8, 0.25, 1) 0.25s;\n    -webkit-transform-origin: left top;\n    transform-origin: left top;\n    color: rgba(0, 0, 0, .54);\n  }\n}\n\n", "", {"version":3,"sources":["/Users/Basters/dev/firestitch/fs-filter/src/components/fsfilter/src/components/fsfilter/fsfilter.component.scss","/Users/Basters/dev/firestitch/fs-filter/fsfilter.component.scss"],"names":[],"mappings":"AAAA;EACE,mBAAA;EACA,oBAAA;CCCD;;ADHD;EAKI,sBAAA;CCEH;;ADDG;EACE,sBAAA;CCIL;;ADAC;EACE,cAAA;CCGH;;ADAC;EACI,iBAAA;EACA,mBAAA;EACA,iBAAA;EACA,mBAAA;CCGL;;ADAC;EACE,mBAAA;CCGH;;ADDG;EACI,mBAAA;EACA,OAAA;EACA,YAAA;CCIP;;ADhCD;EAmCY,sBAAA;CCCX;;ADpCD;EAyCI,cAAA;CCDH;;ADKG;EACE,SAAA;EACA,mBAAA;EACA,iBAAA;EACA,QAAA;CCFL;;ADIK;EACI,8BAAA;UAAA,sBAAA;CCDT;;ADnDD;EAyDM,gBAAA;EACA,OAAA;EACA,UAAA;EACA,QAAA;EACA,SAAA;EACA,YAAA;EACA,cAAA;CCFL;;AD7DD;EAoEM,mBAAA;EAyBA;;;;;QCvBE;EDkCF;;;;;;;;QCzBE;CACP;;ADhFD;EAuEQ,oBAAA;EACA,mBAAA;EACA,SAAA;EACA,SAAA;EACA,YAAA;CCaP;;ADXO;EACE,0BAAA;EACA,iBAAA;EACA,aAAA;EACA,mBAAA;CCcT;;ADZS;EACI,8BAAA;UAAA,sBAAA;EACA,uBAAA;CCeb;;ADpGD;EAyFc,eAAA;CCeb;;ADxGD;EAqGQ,YAAA;CCOP;;AD5GD;EAmHQ,aAAA;EAAe,mDAAA;CCFtB;;ADjHD;EAqHU,YAAA;EACA;;;;;;YCKE;CACX;;ADIK;EACE,mBAAA;EACA,YAAA;EACA,iBAAA;EACA,cAAA;CCDP;;ADnID;EAuIU,4BAAA;EACA,iBAAA;EACA,gIAAA;UAAA,wHAAA;EACA,eAAA;CCAT;;AD1ID;EA8IU,yBAAA;CCAT;;AD9ID;EAkJU,mBAAA;CCAT;;ADlJD;EA0Jc,mBAAA;CCJb;;ADQqD;EACxC,YAAA;CCLb;;ADQ6B;EAChB,mBAAA;CCLb;;AD9JD;;EAyKY,oBAAA;CCNX;;ADnKD;EA6KY,UAAA;EACA,oBAAA;EACA,uBAAA;EACA,oBAAA;CCNX;;ADWiC;EACxB,UAAA;CCRT;;AD9KD;EA2Lc,kBAAA;EACA,iBAAA;CCTb;;ADnLD;EAgMc,kBAAA;CCTb;;ADaO;EACE,kBAAA;CCVT;;ADWS;;EAEI,UAAA;CCRb;;ADWS;EACE,iBAAA;CCRX;;ADeC;EAEE,mBAAA;EACA,sBAAA;CCbH;;ADeG;EACE,oBAAA;EACA,0BAAA;CCZL;;ADgBK;EACE,aAAA;EAAA,mBAAA;EACA,YAAA;CCbP;;ADnND;EAkOU,kBAAA;CCXT;;ADiBC;EACE,YAAA;EACA,gBAAA;EACA,iBAAA;EACA,oBAAA;EACA,iBAAA;EACA,wBAAA;EACA,eAAA;CCdH;;ADjOD;EAkPU,gBAAA;EACA,kBAAA;CCbT;;ADgBK;EACE,aAAA;EACA,qBAAA;EAAA,qBAAA;EAAA,cAAA;CCbP;;ADkBC;EACE,mBAAA;CCfH;;AD/OD;EAkQI,eAAA;CCfH;;ADnPD;EAoQM,kBAAA;EACA,gBAAA;EACA,kBAAA;CCbL;;ADzPD;EA4QM,YAAA;CCfL;;AD7PD;;EAiRS,YAAA;EACA,eAAA;CCfR;;ADoBD;EACE;IAEI,YAAA;GClBH;CACF;;ADsBD;EAEE;IACA,4BAAA;GCpBC;;EDmBD;IAIC,cAAA;GCnBA;;EDuBD;IACE,cAAA;GCpBD;;EDmBD;IAII,eAAA;IACA;;;;;;;QCbE;GACL;;EDuBD;IACE,eAAA;GCpBD;;EDuBD;IAEE,eAAA;GCrBD;;EDwBD;IAIU,gBAAA;IACA,OAAA;IACA,QAAA;IACA,UAAA;IACA,SAAA;IACA,iBAAA;IACA,aAAA;GCxBT;;EDcD;;;;IAiBU,eAAA;GCxBT;;EDgCG;IACE,cAAA;GC7BL;;EDGD;IA8BM,mBAAA;GC7BL;;ED4BG;IAII,UAAA;GC5BP;;EDiCK;IACE,kBAAA;IACA,eAAA;IACA,sDAAA;IACA,8CAAA;IACA,2DAAA;IAAA,mDAAA;IACA,mCAAA;IACA,2BAAA;IACA,0BAAA;GC9BP;CACF","file":"fsfilter.component.scss","sourcesContent":[".fs-filter {\n  position: relative;\n  margin-bottom: 20px;\n\n  .inline-filter {\n    display: inline-block;\n    .filter-group {\n      display: inline-block;\n    }\n  }\n\n  .title {\n    display: none;\n  }\n\n  .results {\n      min-height: 90px;\n      position: relative;\n      overflow-x: auto;\n      overflow-y: hidden;\n  }\n\n  .status {\n    position: relative;\n\n    .progress-infinite {\n        position: absolute;\n        top :0;\n        width: 100%;\n    }\n  }\n\n  .full-search {\n    .filter.filter-date {\n        > span {\n            display: inline-block\n        }\n    }\n  }\n\n  .filter-by {\n    display: none;\n  }\n\n  .menu-filter {\n    .search {\n      top: 8px;\n      position: absolute;\n      margin-left: 1px;\n      left: 0;\n\n      mat-icon {\n          transform: scale(.9);\n      }\n    }\n\n    .backdrop {\n      position: fixed;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n      z-index: 69;\n      outline: none;\n    }\n\n    .menu-filter-input {\n\n      position: relative;\n\n      .inline-actions {\n        white-space: nowrap;\n        position: absolute;\n        right: 0;\n        top: 8px;\n        z-index: 50;\n\n        a {\n          color: rgba(0,0,0,0.54);\n          background: #fff;\n          height: 22px;\n          margin-bottom: 5px;\n\n          i {\n              transform: scale(.9);\n              vertical-align: middle;\n          }\n\n          &:hover {\n              color: inherit;\n          }\n        }\n      }\n      /*\n      .action-filter {\n        display: none;\n        z-index: 30;\n      }\n      */\n\n      mat-form-field {\n        width: 100%;\n      }\n\n      /*\n      TODO\n      md-datepicker-container {\n        width: 100%;\n        .md-datepicker-input-container {\n            margin-left: 0;\n        }\n      }\n      */\n\n      .main-filter-bar {\n        height: 40px; /* Largest height between inputs, buttons, icons */\n        mat-form-field {\n          width: 100%;\n          /*\n          input {\n            padding-right: 26px;\n            padding-left: 26px;\n            position: relative;\n          }\n          */\n        }\n      }\n\n      .filters {\n        position: absolute;\n        width: 100%;\n        margin-top: -4px;\n        display: none;\n\n        .wrap {\n          padding: 8px 17px 17px 17px;\n          background: #fff;\n          box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);\n          overflow: auto;\n        }\n\n        .filter-group {\n          display: table-row-group;\n        }\n\n        .filter {\n          display: table-row;\n\n          .interface {\n\n            &.interface-checkbox {\n            }\n\n            &.interface-range input {\n              text-align: center;\n            }\n\n            //TODO\n            &.interface-datetime fs-datetime.has-time .md-input {\n              width: 100%;\n            }\n            //TODO\n            fs-datetime-range input {\n              text-align: center;\n            }\n          }\n\n          .interface,\n          .filter-label {\n            display: table-cell;\n          }\n\n          .filter-label {\n            width: 1%;\n            white-space: nowrap;\n            vertical-align: middle;\n            padding-right: 15px;\n          }\n        }\n\n        //TODO\n        md-autocomplete-container md-input-container {\n          margin: 0;\n        }\n\n        .isolate  {\n          .interface {\n              line-height: 20px;\n              padding-top: 5px;\n          }\n          //TODO\n          md-checkbox {\n              margin: 0 0 0 2px;\n          }\n        }\n\n        .buttons {\n          padding-top: 15px;\n          .filter-button,\n          .cancel-button {\n              margin: 0;\n          }\n\n          .cancel-button {\n            margin-left: 8px;\n          }\n        }\n      }\n    }\n  }\n\n  .filter {\n\n    margin-right: 15px;\n    display: inline-block;\n    //TODO\n    label {\n      white-space: nowrap;\n      color: rgba(0,0,0,0.54);\n    }\n\n    &.filter-range {\n      mat-form-field {\n        min-width: initial;\n        width: 50px;\n        &.filter-range-min {\n          margin-right: 5px;\n        }\n      }\n    }\n  }\n\n  .infinite-records {\n    color: #999;\n    font-size: 13px;\n    margin-left: 4px;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    display: block;\n\n      .order-toggle {\n          cursor: pointer;\n          padding-left: 4px;\n      }\n\n      .saved-filters {\n        float: right;\n        display: flex;\n      }\n  }\n\n  //TODO\n  .md-datepicker-calendar-pane {\n    margin-left: -10px;\n  }\n\n  .saved-filter-menu {\n    padding-top: 0;\n    .my-saved-filters {\n      line-height: 50px;\n      padding: 0 10px;\n      font-weight: bold;\n    }\n  }\n\n  &.filters-open {\n\t\t.inline-actions {\n\t    \tz-index: 71;\n\t    }\n\n\t    .main-filter-bar md-input-container input,\n\t    .menu-filter-input .filters {\n\t        z-index: 70;\n\t        display: block;\n\t    }\n\t}\n}\n\n@media screen and (max-width: 750px) {\n  .fs-filter {\n    .saved-filters {\n      float: none;\n    }\n  }\n}\n\n@media screen and (max-width: 599px) {\n\n  body.fs-filters-open {\n\t\toverflow: hidden !important;\n\n\t\t.inline-actions {\n\t\t\tdisplay: none;\n\t\t}\n\t}\n\n  .fs-filter {\n    margin-top: 0;\n\n    .title {\n      display: block;\n      /*\n      fs-heading {\n        margin: 0;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n      }\n      */\n    }\n  }\n\n  .responsive-top-actions {\n    display: block;\n  }\n\n  .filter-by {\n    //display: block;\n    margin: 10px 0;\n  }\n\n  .menu-filter {\n    .menu-filter-input {\n      .filters {\n          .wrap {\n            position: fixed;\n            top: 0;\n            left: 0;\n            bottom: 0;\n            right: 0;\n            overflow-y: auto;\n            z-index: 999;\n          }\n\n          .filter-group,\n          .filter,\n          .filter .filter-label,\n          .filter .interface {\n            display: block;\n          }\n      }\n\n      .action-filter {\n        //z-index: 30;\n      }\n\n      .action-reload {\n        display: none;\n      }\n\n      .filter-group {\n        margin: 10px 0 0 0;\n\n        &:first-child {\n          margin: 0;\n        }\n      }\n\n      .filter {\n        .filter-label {\n          line-height: 21px;\n          display: block;\n          -webkit-transform: translate3d(0, 7px, 0) scale(0.75);\n          transform: translate3d(0, 7px, 0) scale(0.75);\n          transition: cubic-bezier(0.25, 0.8, 0.25, 1) 0.25s;\n          -webkit-transform-origin: left top;\n          transform-origin: left top;\n          color: rgba(0, 0, 0, 0.54);\n        }\n      }\n    }\n  }\n}\n",".fs-filter {\n  position: relative;\n  margin-bottom: 20px;\n}\n\n.fs-filter .inline-filter {\n  display: inline-block;\n}\n\n.fs-filter .inline-filter .filter-group {\n  display: inline-block;\n}\n\n.fs-filter .title {\n  display: none;\n}\n\n.fs-filter .results {\n  min-height: 90px;\n  position: relative;\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n\n.fs-filter .status {\n  position: relative;\n}\n\n.fs-filter .status .progress-infinite {\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n.fs-filter .full-search .filter.filter-date > span {\n  display: inline-block;\n}\n\n.fs-filter .filter-by {\n  display: none;\n}\n\n.fs-filter .menu-filter .search {\n  top: 8px;\n  position: absolute;\n  margin-left: 1px;\n  left: 0;\n}\n\n.fs-filter .menu-filter .search mat-icon {\n  transform: scale(0.9);\n}\n\n.fs-filter .menu-filter .backdrop {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 69;\n  outline: none;\n}\n\n.fs-filter .menu-filter .menu-filter-input {\n  position: relative;\n  /*\n      .action-filter {\n        display: none;\n        z-index: 30;\n      }\n      */\n  /*\n      TODO\n      md-datepicker-container {\n        width: 100%;\n        .md-datepicker-input-container {\n            margin-left: 0;\n        }\n      }\n      */\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions {\n  white-space: nowrap;\n  position: absolute;\n  right: 0;\n  top: 8px;\n  z-index: 50;\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions a {\n  color: rgba(0, 0, 0, 0.54);\n  background: #fff;\n  height: 22px;\n  margin-bottom: 5px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions a i {\n  transform: scale(0.9);\n  vertical-align: middle;\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions a:hover {\n  color: inherit;\n}\n\n.fs-filter .menu-filter .menu-filter-input mat-form-field {\n  width: 100%;\n}\n\n.fs-filter .menu-filter .menu-filter-input .main-filter-bar {\n  height: 40px;\n  /* Largest height between inputs, buttons, icons */\n}\n\n.fs-filter .menu-filter .menu-filter-input .main-filter-bar mat-form-field {\n  width: 100%;\n  /*\n          input {\n            padding-right: 26px;\n            padding-left: 26px;\n            position: relative;\n          }\n          */\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters {\n  position: absolute;\n  width: 100%;\n  margin-top: -4px;\n  display: none;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .wrap {\n  padding: 8px 17px 17px 17px;\n  background: #fff;\n  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);\n  overflow: auto;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter-group {\n  display: table-row-group;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter {\n  display: table-row;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface.interface-range input {\n  text-align: center;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface.interface-datetime fs-datetime.has-time .md-input {\n  width: 100%;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface fs-datetime-range input {\n  text-align: center;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface,\n.fs-filter .menu-filter .menu-filter-input .filters .filter .filter-label {\n  display: table-cell;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .filter-label {\n  width: 1%;\n  white-space: nowrap;\n  vertical-align: middle;\n  padding-right: 15px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters md-autocomplete-container md-input-container {\n  margin: 0;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .isolate .interface {\n  line-height: 20px;\n  padding-top: 5px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .isolate md-checkbox {\n  margin: 0 0 0 2px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .buttons {\n  padding-top: 15px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .buttons .filter-button,\n.fs-filter .menu-filter .menu-filter-input .filters .buttons .cancel-button {\n  margin: 0;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .buttons .cancel-button {\n  margin-left: 8px;\n}\n\n.fs-filter .filter {\n  margin-right: 15px;\n  display: inline-block;\n}\n\n.fs-filter .filter label {\n  white-space: nowrap;\n  color: rgba(0, 0, 0, 0.54);\n}\n\n.fs-filter .filter.filter-range mat-form-field {\n  min-width: initial;\n  width: 50px;\n}\n\n.fs-filter .filter.filter-range mat-form-field.filter-range-min {\n  margin-right: 5px;\n}\n\n.fs-filter .infinite-records {\n  color: #999;\n  font-size: 13px;\n  margin-left: 4px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: block;\n}\n\n.fs-filter .infinite-records .order-toggle {\n  cursor: pointer;\n  padding-left: 4px;\n}\n\n.fs-filter .infinite-records .saved-filters {\n  float: right;\n  display: flex;\n}\n\n.fs-filter .md-datepicker-calendar-pane {\n  margin-left: -10px;\n}\n\n.fs-filter .saved-filter-menu {\n  padding-top: 0;\n}\n\n.fs-filter .saved-filter-menu .my-saved-filters {\n  line-height: 50px;\n  padding: 0 10px;\n  font-weight: bold;\n}\n\n.fs-filter.filters-open .inline-actions {\n  z-index: 71;\n}\n\n.fs-filter.filters-open .main-filter-bar md-input-container input,\n.fs-filter.filters-open .menu-filter-input .filters {\n  z-index: 70;\n  display: block;\n}\n\n@media screen and (max-width: 750px) {\n  .fs-filter .saved-filters {\n    float: none;\n  }\n}\n\n@media screen and (max-width: 599px) {\n  body.fs-filters-open {\n    overflow: hidden !important;\n  }\n\n  body.fs-filters-open .inline-actions {\n    display: none;\n  }\n\n  .fs-filter {\n    margin-top: 0;\n  }\n\n  .fs-filter .title {\n    display: block;\n    /*\n      fs-heading {\n        margin: 0;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n      }\n      */\n  }\n\n  .responsive-top-actions {\n    display: block;\n  }\n\n  .filter-by {\n    margin: 10px 0;\n  }\n\n  .menu-filter .menu-filter-input .filters .wrap {\n    position: fixed;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    overflow-y: auto;\n    z-index: 999;\n  }\n\n  .menu-filter .menu-filter-input .filters .filter-group,\n  .menu-filter .menu-filter-input .filters .filter,\n  .menu-filter .menu-filter-input .filters .filter .filter-label,\n  .menu-filter .menu-filter-input .filters .filter .interface {\n    display: block;\n  }\n\n  .menu-filter .menu-filter-input .action-reload {\n    display: none;\n  }\n\n  .menu-filter .menu-filter-input .filter-group {\n    margin: 10px 0 0 0;\n  }\n\n  .menu-filter .menu-filter-input .filter-group:first-child {\n    margin: 0;\n  }\n\n  .menu-filter .menu-filter-input .filter .filter-label {\n    line-height: 21px;\n    display: block;\n    -webkit-transform: translate3d(0, 7px, 0) scale(0.75);\n    transform: translate3d(0, 7px, 0) scale(0.75);\n    transition: cubic-bezier(0.25, 0.8, 0.25, 1) 0.25s;\n    -webkit-transform-origin: left top;\n    transform-origin: left top;\n    color: rgba(0, 0, 0, 0.54);\n  }\n}\n\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/lib/css-base.js":
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./classes/fsfilter.class.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var FsFilter = (function () {
    function FsFilter() {
        this.fsConfig = {
            load: true,
            persist: false,
            inline: false,
            namespace: 'filter',
            items: []
        };
    }
    return FsFilter;
}());
exports.FsFilter = FsFilter;


/***/ }),

/***/ "./classes/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./classes/fsfilter.class.ts"));


/***/ }),

/***/ "./components/fsfilter/fsfilter.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"fs-filter\" fxLayout=\"row\" fxLayoutAlign=\"start stretch\" *ngIf=\"filter.fsConfig.items.length\" [ngClass]=\"{ 'filters-open': extended_filter, loading: loading }\">\n  <div *ngIf=\"!filter.fsConfig.inline\" fxLayou=\"row\" fxLayoutAlign=\"start center\" class=\"menu-filter\" fxFlex>\n    <div class=\"menu-filter-input\" fxFlex=\"grow\">\n      <div class=\"main-filter-bar\" fxLayout=\"row\" fxLayoutAlign=\"start center\" *ngIf=\"filter.fsConfig.items.length\">\n          <mat-form-field>\n            <input matInput [(ngModel)]=\"searchinput.value\" name=\"filter-input\" (ngModelChange)=\"menuFilterChange(searchinput.value)\" (click)=\"menuFilterClick($event)\" (keydown)=\"menuFilterKeydown($event)\">\n            <mat-placeholder><mat-icon>search</mat-icon> Search</mat-placeholder>\n          </mat-form-field>\n\n          <div class=\"inline-actions\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n            <a (click)=\"menuFilterShow()\" class=\"action-filter\" [fxHide.gt-xs]=\"true\"><mat-icon>filter_list</mat-icon></a>\n            <a (click)=\"clear()\" *ngIf=\"searchinput.value\"><mat-icon>clear</mat-icon></a>\n            <a (click)=\"reload()\" class=\"action-reload\"><mat-icon>refresh</mat-icon></a>\n          </div>\n      </div>\n\n      <div class=\"filters\">\n        <div class=\"wrap\">\n          <!-- @TODO\n            Mobal version of filters\n            fs-heading\n            heading-actions\n          -->\n          <div class=\"filter-by\" fxLayout=\"row\" [fxHide.gt-xs]=\"true\"> <!-- fs-heading -->\n            <span>Filter by</span>\n          </div>\n\n          <ng-container *ngFor=\"let filterItem of filter.fsConfig.items\">\n            <ng-container *ngTemplateOutlet=\"filterTemplate; context: { localSk: filterItem }\"></ng-container>\n          </ng-container>\n\n          <div class=\"buttons\">\n              <button mat-raised-button color=\"accent\" (click)=\"filterToggle(false,true)\" class=\"filter-button\">Search</button>\n              <button mat-button color=\"accent\" (click)=\"cancel()\" class=\"cancel-button\">Cancel</button>\n          </div>\n        </div>\n      </div>\n      <div class=\"backdrop\" *ngIf=\"extended_filter\" (click)=\"filterToggle(false,true)\"></div>\n    </div>\n  </div>\n\n  <div *ngIf=\"filter.fsConfig.inline\" class=\"inline-filter\">\n    <ng-container *ngFor=\"let filterItem of filter.fsConfig.items\">\n      <ng-container *ngTemplateOutlet=\"filterTemplate; context: { localSk: filterItem }\"></ng-container>\n    </ng-container>\n  </div>\n</div>\n\n<ng-template #filterTemplate let-filterItem=\"localSk\">\n  <div class=\"filter-group\" *ngIf=\"!filterItem.disabled\">\n    <div class=\"filter filter-{{ filterItem.type }}\">\n      <div class=\"filter-label\" *ngIf=\"!filter.fsConfig.inline\">\n        <div class=\"filter-label-content\">\n          {{ filterItem.label }}\n        </div>\n      </div>\n\n      <div class=\"interface\" *ngIf=\"filterItem.type == 'text'\">\n        <mat-form-field>\n          <input matInput [(ngModel)]=\"filterItem.model\" (keyup)=\"filterKeyup(filterItem,$event)\" (change)=\"onFilterChange(filterItem, $event)\"/>\n          <mat-placeholder *ngIf=\"filter.fsConfig.inline\"><mat-icon>search</mat-icon> {{ filterItem.label }}</mat-placeholder>\n        </mat-form-field>\n      </div>\n\n      <div class=\"interface\" *ngIf=\"filterItem.type == 'select' && filterItem.values?.length > 0\">\n        <mat-form-field *ngIf=\"filterItem.multiple && !filterItem.groups\">\n          <mat-select [(ngModel)]=\"filterItem.model\" multiple=\"filterItem.multiple\" (onClose)=\"selectChange(filterItem)\" (keyup)=\"filterKeyup(filterItem,$event)\">\n            <mat-option *ngFor=\"let item of filterItem.values\" [value]=\"item.value\" [ngStyle]=\"item.style\">\n              {{ item.name }}\n            </mat-option>\n          </mat-select>\n          <mat-placeholder *ngIf=\"filter.fsConfig.inline\">{{ filterItem.label }}</mat-placeholder>\n        </mat-form-field>\n\n        <mat-form-field *ngIf=\"!filterItem.multiple && !filterItem.groups\">\n          <mat-select [(ngModel)]=\"filterItem.model\" (change)=\"selectChange(filterItem)\" (keyup)=\"filterKeyup(filterItem,$event)\">\n            <mat-option *ngFor=\"let item of filterItem.values\" [value]=\"item.value\" [ngStyle]=\"item.style\">\n              {{ item.name }}\n            </mat-option>\n          </mat-select>\n          <mat-placeholder *ngIf=\"filter.fsConfig.inline\">{{ filterItem.label }}</mat-placeholder>\n        </mat-form-field>\n\n        <!--<mat-form-field class=\"md-no-float md-no-label md-no-message\" ng-show=\"!filter.multiple && filter.groups\">\n            <mat-select ng-model=\"filter.model\" aria-label=\"select\" ng-change=\"selectChange(filter)\" ng-keyup=\"filterKeyup(filter,$event)\">\n                <md-optgroup label=\"{{group}}\" ng-repeat=\"(group, values) in filter.groups\">\n                    <md-option ng-repeat=\"item in values\" value=\"{{::item.value}}\" ng-style=\"item.style\">\n                        {{::item.name}}\n                    </md-option>\n                </md-optgroup>\n            </mat-select>\n        </mat-form-field>-->\n\n        <!--<md-input-container class=\"md-no-float md-no-label md-no-message\" ng-show=\"filter.multiple && filter.groups\">\n            <md-select ng-model=\"filter.model\" aria-label=\"select\" multiple=\"filter.multiple\" md-on-close=\"selectChange(filter)\" ng-keyup=\"filterKeyup(filter,$event)\">\n                <md-optgroup label=\"{{group}}\" ng-repeat=\"(group, values) in filter.groups\">\n                    <md-option ng-repeat=\"item in values\" value=\"{{::item.value}}\" ng-style=\"item.style\">\n                        {{::item.name}}\n                    </md-option>\n                </md-optgroup>\n            </md-select>\n        </md-input-container>-->\n      </div>\n\n      <div class=\"interface interface-range\" *ngIf=\"filterItem.type == 'range'\" >\n        <span fxLayout=\"row\">\n          <div>\n            <mat-form-field class=\"filter-range-min\">\n              <input matInput\n              [(ngModel)]=\"filterItem.model.min\"\n              (change)=\"onFilterChange(filterItem)\"\n              placeholder=\"{{ filterItem.placeholder[0] }}\">\n            </mat-form-field>\n          </div>\n          <div>\n            <mat-form-field class=\"filter-range-max\">\n              <input matInput\n              [(ngModel)]=\"filterItem.model.max\"\n              (change)=\"onFilterChange(filterItem)\"\n              placeholder=\"{{ filterItem.placeholder[1] }}\">\n            </mat-form-field>\n          </div>\n        </span>\n      </div>\n\n      <div class=\"interface\" *ngIf=\"filterItem.type == 'autocomplete'\">\n\n        <mat-form-field>\n          <input matInput type=\"text\" [(ngModel)]=\"filterItem.model\" (ngModelChange)=\"onAutocompleteChange(filterItem)\"  name=\"{{ filterItem.name }}\" [matAutocomplete]=\"autocompleteInput\">\n          <mat-autocomplete #autocompleteInput=\"matAutocomplete\" [displayWith]=\"displayAutocomplete\">\n            <mat-option *ngFor=\"let item of filterItem.values$ | async\" [value]=\"item\">{{ item.name }}</mat-option>\n          </mat-autocomplete>\n          <mat-placeholder *ngIf=\"filter.fsConfig.inline\">{{ filterItem.label }}</mat-placeholder>\n        </mat-form-field>\n      </div>\n\n      <div class=\"interface interface-date\" *ngIf=\"filterItem.type == 'date'\">\n        <mat-form-field>\n          <input matInput fsDatepicker [(ngModel)]=\"filterItem.model\" readonly (change)=\"onFilterChange(filterItem)\" name=\"{{ filterItem.name }}\">\n          <mat-placeholder *ngIf=\"filter.fsConfig.inline\">{{ filterItem.label }}</mat-placeholder>\n        </mat-form-field>\n      </div>\n\n      <div class=\"interface\" *ngIf=\"filterItem.type == 'autocompletechips'\">\n        <mat-form-field>\n            <mat-chip-list #chipList>\n                <mat-chip *ngFor=\"let item of filterItem.model\" (remove)=\"removeAutucompleteChipItem(filterItem, item)\">\n                    {{ item.name }}<mat-icon matChipRemove>cancel</mat-icon>\n                </mat-chip>\n\n                <input #chipsInput matInput [(ngModel)]=\"filterItem.selectedValue\" (ngModelChange)=\"onAutocompleteChipsChange(filterItem, chipsInput)\" type=\"text\" name=\"{{ filterItem.name }}\"\n                        [matChipInputFor]=\"chipList\"\n                        [matAutocomplete]=\"autocompleteChipsInput\">\n            </mat-chip-list>\n\n            <mat-autocomplete #autocompleteChipsInput=\"matAutocomplete\" [displayWith]=\"displayAutocomplete\" (optionSelected)=\"addAutucompleteChipItem(filterItem, $event)\">\n              <mat-option *ngFor=\"let item of filterItem.values$ | async\" [value]=\"item\">{{ item.name }}</mat-option>\n            </mat-autocomplete>\n            <mat-placeholder *ngIf=\"filter.fsConfig.inline\">{{ filterItem.label }}</mat-placeholder>\n          </mat-form-field>\n      </div>\n\n      <div class=\"interface interface-checkbox\" *ngIf=\"filterItem.type == 'checkbox'\">\n        <mat-checkbox (change)=\"onFilterChange(filterItem)\" [(ngModel)]=\"filterItem.model\">{{ filter.fsConfig.inline ? filterItem.label : '' }}</mat-checkbox>\n      </div>\n\n                  <!--\n\n                  <div class=\"interface\" ng-if=\"filter.type == 'autocompletechips'\">\n\n    <md-chips-autocomplete-container class=\"md-block\">\n        <md-chips \tng-model=\"filter.model\"\n              md-autocomplete-snap\n              md-require-match=\"false\"\n              md-on-remove=\"filterChange(filter)\"\n              md-on-add=\"filterChange(filter)\">\n            <md-autocomplete\n            md-no-cache=\"true\"\n            md-items=\"item in filter.values(filter.search, filter)\"\n            md-search-text=\"filter.search\"\n            md-item-text=\"\"\n            md-min-length=\"1\"\n            md-require-match\n            md-autoselect>\n                <span md-highlight-text=\"filter.search\">{{item.name}}</span>\n            </md-autocomplete>\n            <md-chip-template>\n                <span>\n                  {{$chip.name}}\n                </span>\n            </md-chip-template>\n        </md-chips>\n    </md-chips-autocomplete-container>\n                  </div>\n\n                  <div class=\"interface  interface-datetime\" ng-if=\"filter.type == 'datetime'\">\n                      <fs-datetime fs-class=\"md-no-label md-no-message\" fs-time=\"true\" fs-model=\"filter.model\" fs-change=\"filterChange(filter)\"></fs-datetime>\n                  </div>\n\n                  <div class=\"interface interface-daterange\" ng-if=\"filter.type == 'daterange'\">\n                      <fs-datetime-range fs-class=\"md-no-label md-no-message\" fs-from=\"filter.model['from']\" fs-to=\"filter.model['to']\" fs-change=\"filterChange(filter)\"></fs-datetime-range>\n                  </div>\n\n                  <div class=\"interface interface-datetimerange\" ng-if=\"filter.type == 'datetimerange'\">\n                      <fs-datetime-range fs-class=\"md-no-label md-no-message\" fs-from=\"filter.model['from']\" fs-to=\"filter.model['to']\" fs-change=\"filterChange(filter)\" fs-time=\"true\"></fs-datetime-range>\n                  </div>\n\n              </div>\n            -->\n    </div>\n\n    <div *ngIf=\"filterItem.isolate && !filter.fsConfig.inline\" class=\"filter isolate\">\n        <div class=\"filter-label\">{{ filterItem.isolate.label }}</div>\n        <div class=\"interface\">\n            <mat-checkbox (change)=\"isolateChange(filterItem)\" [(ngModel)]=\"filterItem.isolate.enabled\"></mat-checkbox>\n        </div>\n    </div>\n  </div>\n</ng-template>\n"

/***/ }),

/***/ "./components/fsfilter/fsfilter.component.scss":
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__("../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../node_modules/resolve-url-loader/index.js?{\"sourceMap\":true}!../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!./components/fsfilter/fsfilter.component.scss");

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),

/***/ "./components/fsfilter/fsfilter.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("@angular/core");
var lodash_1 = __webpack_require__("lodash");
var util_1 = __webpack_require__("@firestitch/common/util");
var array_1 = __webpack_require__("@firestitch/common/array");
var store_1 = __webpack_require__("@firestitch/store");
var classes_1 = __webpack_require__("./classes/index.ts");
var Observable_1 = __webpack_require__("rxjs/Observable");
var router_1 = __webpack_require__("@angular/router");
__webpack_require__("rxjs/add/observable/forkJoin");
var moment_timezone_1 = __webpack_require__("moment-timezone");
var common_1 = __webpack_require__("@angular/common");
var FsFilterComponent = (function () {
    function FsFilterComponent(FsStore, route, location) {
        this.FsStore = FsStore;
        this.route = route;
        this.location = location;
        this.filter = null;
        this.searchinput = { value: '' };
        this.extended_filter = false;
        this.filterChange = false;
        this.primary = false;
        this.persists = null;
    }
    FsFilterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.persists = this.FsStore.get(this.filter.fsConfig.namespace + '-persist', {});
        if (this.persists === undefined) {
            this.persists = {};
        }
        if (this.filter.fsConfig.persist) {
            if (typeof this.filter.fsConfig.persist.persist !== 'object') {
                this.filter.fsConfig.persist = { name: this.filter.fsConfig.persist };
            }
            if (!this.filter.fsConfig.persist.name) {
                this.filter.fsConfig.persist.name = this.location.path();
            }
            if (!this.persists[this.filter.fsConfig.persist.name] || !this.persists[this.filter.fsConfig.persist.name]['data']) {
                this.persists[this.filter.fsConfig.persist.name] = { data: {}, date: new Date() };
            }
            if (this.filter.fsConfig.persist.timeout) {
                var date = new Date(this.persists[this.filter.fsConfig.persist.name]['date']);
                if (moment_timezone_1.default(date).subtract(this.filter.fsConfig.persist.timeout, 'minutes').isAfter(moment_timezone_1.default())) {
                    this.persists[this.filter.fsConfig.persist.name] = { data: {}, date: new Date() };
                }
            }
        }
        // preload any filters which have filter.wait.  Once they are all loaded then proceed to load main data & rest of filters.
        var wait_observables$ = [], update_observables$ = [];
        for (var _i = 0, _a = this.filter.fsConfig.items; _i < _a.length; _i++) {
            var filter = _a[_i];
            if (filter.name && lodash_1.isObject(filter.name)) {
                filter.names = filter.name;
                filter.name = Object.keys(filter.names).join('-');
            }
            if (this.filter.fsConfig.persist) {
                var persisted = this.persists[this.filter.fsConfig.persist.name]['data'];
                if (persisted[filter.name]) {
                    var value = persisted[filter.name];
                    if (value) {
                        if (filter.type == 'daterange' || filter.type == 'datetimerange') {
                            value.from = value.from ? moment_timezone_1.default.utc(value.from) : null;
                            value.to = value.to ? moment_timezone_1.default.utc(value.to) : null;
                        }
                        else if (filter.type.match(/^date/)) {
                            value = moment_timezone_1.default(value);
                        }
                    }
                    filter.model = value;
                }
            }
            if (filter.query) {
                var query = this.route.snapshot.queryParams[filter.query];
                if (query !== undefined) {
                    query += '';
                    filter.model = query;
                    if (!query.length) {
                        filter.model = undefined;
                    }
                    else if (filter.type == 'select' && filter.multiple) {
                        filter.model = filter.model.split(',');
                    }
                    else if (filter.type == 'daterange' || filter.type == 'datetimerange') {
                        var parts = filter.model.split(',');
                        filter.model = { from: moment_timezone_1.default(parts[0]), to: moment_timezone_1.default(parts[1]) };
                    }
                    else if (filter.type == 'range') {
                        var parts = filter.model.split(',');
                        filter.model = { min: parts[0], max: parts[1] };
                    }
                }
            }
            if (typeof filter.values == 'function' && !filter.type.match(/^autocomplete/)) {
                filter.values = filter.values();
            }
            var observable$ = this.sanitizeFilter(filter);
            if (filter.wait || (filter.type == 'select' && filter.isolate && filter.wait === undefined)) {
                wait_observables$.push(observable$);
            }
            else {
                update_observables$.push(observable$);
            }
        }
        ;
        Observable_1.Observable.forkJoin(wait_observables$)
            .subscribe(function () { }, function () { }, function () {
            if (_this.filter.fsConfig.load) {
                _this.reload({ filterUpdate: false });
            }
            Observable_1.Observable.forkJoin(update_observables$)
                .subscribe(function () { }, function () { }, function () {
                if (_this.filter.fsConfig.init) {
                    _this.filter.fsConfig.init(_this);
                }
                _this.filterUpdate();
            });
        });
    };
    FsFilterComponent.prototype.menuFilterChange = function (search) {
        var text = '';
        for (var _i = 0, _a = this.filter.fsConfig.items; _i < _a.length; _i++) {
            var filter = _a[_i];
            if (filter.type == 'text') {
                text = search.match(new RegExp('(' + filter.label + ':$)', 'i'));
                if (text) {
                    search = search.replace(text[1], '');
                }
                // Wrap text with spaces in brackets
                text = search.match(new RegExp(filter.label + ':([^:\(\)]+)($|\s[\(\w\s]+:)', 'i'));
                if (text) {
                    search = search.replace(text[1], '(' + text[1] + ')');
                }
            }
        }
        var matches = search.match(/(\([^\)]+\):\([^\)]+\)|\([^\)]+\):[^\s]+|[^:]+:\([^\)]+\)|[^\s]+)/g) || [];
        var values = {};
        var textSearch = [];
        for (var _b = 0, matches_1 = matches; _b < matches_1.length; _b++) {
            var match = matches_1[_b];
            var filter_match = match.trim().match(/\(?([^:\)]+)\)?:\(?([^)]+)/);
            if (filter_match) {
                values[filter_match[1].trim()] = filter_match[2];
            }
            else {
                textSearch.push(match);
            }
        }
        ;
        this.filtersClear();
        for (var _c = 0, _d = this.filter.fsConfig.items; _c < _d.length; _c++) {
            var filter = _d[_c];
            if (filter.type == 'text' && filter.primary) {
                filter.model = textSearch.join(' ');
            }
        }
        ;
        for (var label in values) {
            if (!values[label]) {
                continue;
            }
            var filter = array_1.filter(this.filter.fsConfig.items, { label: label })[0];
            if (filter) {
                if (filter.type == 'date' || filter.type == 'datetime') {
                    var date = Date.parse(values[label]);
                    if (date) {
                        filter.model = moment_timezone_1.default(date);
                    }
                }
                else if (filter.type == 'daterange') {
                    var parts = values[label].split(/\s+to\s+/);
                    var from = Date.parse(parts[0]);
                    var to = Date.parse(parts[1]);
                    filter.model = {};
                    if (from) {
                        filter.model.from = from;
                    }
                    if (to) {
                        filter.model.to = to;
                    }
                }
                else if (filter.type == 'range') {
                    var parts = values[label].split(',');
                    filter.model = { min: parts[0], max: parts[1] };
                }
                else if (filter.type == 'select') {
                    if (filter.multiple) {
                        var values_1 = [];
                        for (var _e = 0, _f = values_1[label].split(','); _e < _f.length; _e++) {
                            var value = _f[_e];
                            var item = array_1.filter(filter.values, { name: value })[0];
                            if (item) {
                                values_1.push(item.value);
                            }
                        }
                        ;
                        filter.model = values_1;
                    }
                    else {
                        var item = array_1.filter(filter.values, { name: values[label] })[0];
                        if (item) {
                            filter.model = item.value;
                        }
                    }
                }
                else if (filter.type == 'checkbox') {
                    filter.model = (values[label] == 'Yes') ? filter.checked : filter.unchecked;
                }
                else {
                    filter.model = values[label];
                }
            }
        }
        ;
        this.reload({ filterUpdate: false });
    };
    FsFilterComponent.prototype.filtersClear = function () {
        for (var _i = 0, _a = this.filter.fsConfig.items; _i < _a.length; _i++) {
            var filter = _a[_i];
            filter.model = undefined;
            if (filter.type == 'autocomplete') {
                filter.model = null;
                filter.search = '';
            }
            else if (filter.type == 'autocompletechips') {
                filter.model = [];
                filter.search = '';
            }
            else if (filter.type == 'select' && filter.isolate) {
                filter.model = null;
                filter.isolate.enabled = false;
            }
            else if (filter.type == 'checkbox') {
                filter.model = filter.unchecked;
            }
            else if (filter.type == 'range') {
                filter.model = {};
            }
        }
        ;
    };
    FsFilterComponent.prototype.menuFilterClick = function ($event) {
        if (window.innerWidth >= 600) {
            this.filterUpdate();
            if (window.getSelection && window.getSelection().toString()) {
                var selected_1 = window.getSelection().toString();
                if (selected_1) {
                    setTimeout(function () {
                        var index = $event.target.value.indexOf(selected_1);
                        if (index >= 0) {
                            $event.target.setSelectionRange(index, index + selected_1.length);
                        }
                    });
                }
            }
            this.menuFilterShow();
        }
    };
    FsFilterComponent.prototype.menuFilterKeydown = function ($event) {
        this.filterToggle($event.keyCode !== 13);
    };
    FsFilterComponent.prototype.menuFilterShow = function () {
        this.filterToggle(true);
    };
    FsFilterComponent.prototype.clear = function () {
        this.filtersClear();
        this.filterUpdate();
    };
    FsFilterComponent.prototype.reload = function (opts) {
        return this.load(Object.assign({}, { clear: true }, opts));
    };
    FsFilterComponent.prototype.load = function (opts) {
        if (opts === void 0) { opts = {}; }
        if (opts['filterUpdate'] !== false) {
            this.filterUpdate();
        }
        var query = this.gets({ flatten: true });
        if (this.filter.fsConfig.persist) {
            this.persists[this.filter.fsConfig.persist.name] = { data: this.gets({ expand: true, names: false }), date: new Date() };
            this.FsStore.set(this.filter.fsConfig.namespace + '-persist', this.persists, {});
        }
        if (this.filter.fsConfig.change) {
            this.filter.fsConfig.change(query, this);
        }
    };
    FsFilterComponent.prototype.filterToggle = function (value, search) {
        this.extended_filter = value;
        setTimeout(function () {
            var body = document.body;
            value ? body.classList.add('fs-filters-open') : body.classList.remove('fs-filters-open');
        });
        if (search && !value && this.filterChange) {
            this.reload();
        }
        if (value) {
            this.filterChange = false;
        }
        this.filterUpdate();
    };
    FsFilterComponent.prototype.onFilterChange = function (filter, $event) {
        this.filterChange = true;
        if (this.filter.fsConfig.inline) {
            this.load();
        }
    };
    FsFilterComponent.prototype.onAutocompleteChange = function (filter, $event) {
        if (lodash_1.isObject(filter.model)) {
            this.onFilterChange(filter);
        }
        else {
            filter.values$ = filter.values(filter.model);
        }
    };
    FsFilterComponent.prototype.onAutocompleteChipsChange = function (filter, input) {
        if (!lodash_1.isObject(filter.selectedValue)) {
            filter.values$ = filter.values(filter.selectedValue)
                .map(function (values) {
                var selected = array_1.list(filter.model, 'value');
                return array_1.filter(values, function (value) {
                    return selected.indexOf(value.value) === -1;
                });
            });
        }
        else {
            input.value = '';
        }
    };
    FsFilterComponent.prototype.removeAutucompleteChipItem = function (filter, item) {
        array_1.remove(filter.model, { value: item.value });
        this.onFilterChange(filter);
    };
    FsFilterComponent.prototype.addAutucompleteChipItem = function (filter, $event) {
        filter.model.push($event.option.value);
        this.onFilterChange(filter);
    };
    FsFilterComponent.prototype.filterKeyup = function (filter, $event) {
        if (filter.type == 'text' || filter.type == 'select') {
            if ($event.keyCode == 13) {
                setTimeout(function () {
                    this.onFilterChange(filter);
                    this.filterToggle(false, true);
                });
            }
        }
    };
    FsFilterComponent.prototype.filterUpdate = function () {
        var label, formatted, searches = [];
        for (var _i = 0, _a = this.filter.fsConfig.items; _i < _a.length; _i++) {
            var filter = _a[_i];
            var value = this.copy(filter.model);
            if (filter.type === 'select') {
                if (filter.multiple) {
                    if (!lodash_1.isArray(value) || !value.length) {
                        continue;
                    }
                    var values = [];
                    for (var _b = 0, value_1 = value; _b < value_1.length; _b++) {
                        var item = value_1[_b];
                        for (var _c = 0, _d = filter.values; _c < _d.length; _c++) {
                            var filter_item = _d[_c];
                            if (!String(filter_item.value).localeCompare(String(item))) {
                                values.push(filter_item.name);
                            }
                        }
                    }
                    value = values.join(',');
                }
                else {
                    if (value == '__all' || value === null || value === undefined) {
                        continue;
                    }
                    for (var _e = 0, _f = filter.values; _e < _f.length; _e++) {
                        var filter_item = _f[_e];
                        if (!String(filter_item.value).localeCompare(String(value))) {
                            value = filter_item.name;
                        }
                    }
                }
                if (filter.isolate) {
                    if (filter.isolate.enabled) {
                        value = filter.isolate.label;
                    }
                }
            }
            if (util_1.isEmpty(value, { zero: true })) {
                continue;
            }
            if (filter.type == 'autocomplete') {
                value = filter.model.name;
            }
            else if (filter.type == 'autocompletechips') {
                if (!lodash_1.isArray(filter.model) || !filter.model.length) {
                    continue;
                }
                var values = [];
                for (var _g = 0, _h = filter.model; _g < _h.length; _g++) {
                    var item = _h[_g];
                    values.push(item.name);
                }
                value = values.join(',');
            }
            else if (filter.type == 'date' || filter.type == 'datetime') {
                var format = 'MMM D, YYYY';
                if (filter.type == 'datetime') {
                    format += ' h:mm a';
                }
                value = moment_timezone_1.default(value);
                if (!value) {
                    continue;
                }
                value = value.format(format);
            }
            else if (filter.type == 'daterange' || filter.type == 'datetimerange') {
                if (value) {
                    var from = moment_timezone_1.default(value.from);
                    var to = moment_timezone_1.default(value.to);
                    var format = filter.type == 'datetimerange' ? 'MMM D, YYYY h:mm a' : 'MMM D, YYYY';
                    value = [];
                    if (from) {
                        value.push(from.format(format));
                    }
                    if (to) {
                        value.push(to.format(format));
                    }
                    value = value.join(' to ');
                }
            }
            else if (filter.type == 'checkbox') {
                if (filter.model == filter.unchecked) {
                    return;
                }
                else {
                    value = 'Yes';
                }
            }
            else if (filter.type == 'range') {
                var min = value['min'];
                var max = value['max'];
                var parts = [];
                if (min) {
                    parts.push(min);
                }
                if (max) {
                    parts.push(max);
                }
                value = parts;
            }
            value = String(value);
            if (filter.alias) {
                label = filter.alias.match(/\s/) ? '(' + filter.alias + ')' : filter.alias;
            }
            else {
                label = filter.label.match(/\s/) ? '(' + filter.label + ')' : filter.label;
            }
            formatted = label + ':' + (value.match(/\s/) ? '(' + value + ')' : value);
            searches.push({ value: value,
                type: filter.type,
                formatted: formatted });
        }
        ;
        this.searchinput.value = '';
        if (searches.length === 1 && searches[0].type == 'text') {
            this.searchinput.value = searches[0].value;
        }
        else {
            for (var _j = 0, searches_1 = searches; _j < searches_1.length; _j++) {
                var search = searches_1[_j];
                this.searchinput.value += search.formatted + ' ';
            }
            this.searchinput.value = this.searchinput.value.trim();
        }
    };
    FsFilterComponent.prototype.sanitizeFilter = function (filter) {
        var _this = this;
        var observable$ = new Observable_1.Observable(function (observer) {
            if (filter.values && typeof filter.values == 'object' && filter.values instanceof Observable_1.Observable) {
                filter.values.subscribe(function (values) {
                    observer.next(values);
                    observer.complete();
                });
            }
            else {
                observer.next(filter.values);
                observer.complete();
            }
        });
        var $subscriber = observable$.subscribe(function (values) {
            if (filter.primary) {
                _this.primary = true;
            }
            else {
                filter.primary = false;
            }
            if (filter.type == 'checkbox') {
                filter.checked = lodash_1.toString(filter.checked);
                filter.unchecked = lodash_1.toString(filter.unchecked);
                filter.default = filter.default === undefined ? filter.unchecked : lodash_1.toString(filter.default);
            }
            else if (filter.type == 'text') {
                if (!_this.primary) {
                    filter.primary = _this.primary = true;
                }
            }
            else if (filter.type == 'range') {
                if (!filter.placeholder) {
                    filter.placeholder = ['Min', 'Max'];
                }
                if (!filter.model) {
                    filter.model = {};
                }
            }
            else if (filter.type == 'select') {
                filter.values = values;
                filter.groups = null;
                var data = [];
                if (filter.nested) {
                    // generate a list of values from objects that have not been nested.
                    if (!filter.multiple) {
                        data.push({ value: '__all', name: 'All', depth: 0 });
                    }
                    Array.prototype.push.apply(data, _this.walkSelectNestedValues(filter, null, filter.values));
                }
                else {
                    data = _this.walkSelectValues(filter, filter.values);
                }
                filter.values = data;
                if (filter.isolate) {
                    for (var index in filter.values) {
                        if (!filter.values[index]) {
                            continue;
                        }
                        if (filter.values[index].value == filter.isolate.value) {
                            filter.values.splice(index, 1);
                        }
                    }
                    ;
                    if (lodash_1.isArray(filter.model)) {
                        if (filter.model.length == filter.values.length) {
                            filter.model = null;
                            filter.isolate.enabled = false;
                        }
                        else if (filter.model[0] == filter.isolate.value) {
                            filter.isolate.enabled = true;
                        }
                    }
                }
                for (var _i = 0, _a = filter.values; _i < _a.length; _i++) {
                    var value = _a[_i];
                    if (value.group) {
                        if (!filter.groups) {
                            filter.groups = {};
                        }
                        if (!filter.groups[value.group]) {
                            filter.groups[value.group] = [];
                        }
                        filter.groups[value.group].push(value);
                    }
                }
                ;
            }
            if (filter.model === undefined) {
                filter.model = filter.default;
            }
            if (filter.model === undefined) {
                if (filter.type == 'checkbox') {
                    filter.model = filter.unchecked;
                }
                else if (filter.type == 'select') {
                    if (filter.multiple) {
                        if (!Array.isArray(filter.default)) {
                            filter.model = [];
                        }
                    }
                    else {
                        if (filter.default === undefined) {
                            filter.model = '__all';
                        }
                    }
                }
                else if (filter.type == 'autocompletechips') {
                    filter.model = [];
                }
            }
            if (filter.change) {
                filter.change = filter.change.apply(filter, _this);
                // filter.change = angular.bind(filter,filter.change, options.instance);
            }
        });
        return observable$;
    };
    FsFilterComponent.prototype.walkSelectValues = function (filter, filterValues) {
        var values = [];
        for (var key in filterValues) {
            if (!filterValues[key]) {
                continue;
            }
            var value = { value: key, name: filterValues[key] };
            if (typeof filterValues[key] == 'object') {
                value = filterValues[key];
            }
            if (value.value === null) {
                value.value = 'null';
            }
            values.push(value);
        }
        ;
        return values;
    };
    FsFilterComponent.prototype.walkSelectNestedValues = function (filter, parent_id, values, depth) {
        if (depth === void 0) { depth = 0; }
        var prepped_values = [];
        var value_field = filter.nested.value_field || 'id';
        var parent_field = filter.nested.parent_field || 'parent_id';
        var name_field = filter.nested.label_field || 'name';
        for (var key in values) {
            if (!values[key]) {
                continue;
            }
            if (values[key][parent_field] != parent_id) {
                continue;
            }
            var value = {
                value: values[key][value_field],
                name: values[key][name_field],
                depth: depth,
                style: { 'margin-left': (depth * 16) + 'px' }
            };
            prepped_values.push(value);
            var children = this.walkSelectNestedValues(filter, values[key][value_field], values, depth + 1);
            if (children.length > 0) {
                Array.prototype.push.apply(prepped_values, children);
            }
        }
        ;
        return prepped_values;
    };
    FsFilterComponent.prototype.selectChange = function (filter) {
        if (filter.isolate) {
            filter.isolate.enabled = false;
            if (filter.multiple && lodash_1.isArray(filter.model)) {
                var index = filter.model.indexOf(filter.isolate.value);
                if (index > -1) {
                    filter.model.splice(index, 1);
                }
            }
        }
        this.onFilterChange(filter);
    };
    FsFilterComponent.prototype.isolateChange = function (filter) {
        if (filter.isolate.enabled) {
            filter.model = filter.multiple ? [filter.isolate.value] : filter.isolate.value;
        }
        else {
            filter.model = null;
        }
        this.onFilterChange(filter);
    };
    FsFilterComponent.prototype.cancel = function () {
        this.clear();
        this.filterChange = true;
        this.filterToggle(false, true);
    };
    FsFilterComponent.prototype.displayAutocomplete = function (data) {
        return data ? data.name : data;
    };
    FsFilterComponent.prototype.gets = function (opts) {
        if (opts === void 0) { opts = {}; }
        var query = {};
        for (var _i = 0, _a = this.filter.fsConfig.items; _i < _a.length; _i++) {
            var filter = _a[_i];
            //@TODO
            var value = this.copy(filter.model);
            if (filter.type == 'select') {
                if (filter.multiple) {
                    if (filter.isolate) {
                        if (!lodash_1.isArray(filter.model) || !filter.model.length) {
                            value = array_1.list(filter.values, 'value');
                        }
                    }
                }
                else {
                    if (filter.isolate) {
                        if (filter.model == '__all') {
                            value = array_1.list(filter.values, 'value');
                        }
                    }
                    else {
                        if (filter.model == '__all') {
                            value = null;
                        }
                    }
                }
            }
            else if (filter.type == 'autocompletechips') {
                if (lodash_1.isArray(filter.model) && filter.model.length && !opts['expand']) {
                    value = array_1.list(filter.model, 'value');
                }
            }
            // @TODO
            if (util_1.isEmpty(value, { zero: true })) {
                continue;
            }
            if (filter.type == 'date' || filter.type == 'datetime') {
                if (value) {
                    value = moment_timezone_1.default(value).format();
                }
            }
            else if (filter.type == 'daterange' || filter.type == 'datetimerange') {
                var from = value['from'];
                var to = value['to'];
                value = {};
                if (from) {
                    value.from = moment_timezone_1.default(from).format();
                }
                if (to) {
                    value.to = moment_timezone_1.default(to).format();
                }
            }
            else if (filter.type == 'autocomplete') {
                if (util_1.isEmpty(filter.model.value, { zero: true })) {
                    continue;
                }
                value = opts['expand'] ? filter.model : filter.model.value;
            }
            if (lodash_1.isObject(filter.names) && opts['names'] !== false) {
                for (var key in filter.names) {
                    if (value[filter.names[key]]) {
                        query[key] = value[filter.names[key]];
                    }
                }
                ;
            }
            else {
                query[filter.name] = value;
            }
        }
        ;
        if (opts['flatten']) {
            for (var name_1 in query) {
                if (lodash_1.isArray(query[name_1])) {
                    query[name_1] = query[name_1].join(',');
                }
            }
            ;
        }
        return query;
    };
    /**
     * @TODO Temp solution
     */
    FsFilterComponent.prototype.copy = function (data) {
        if (lodash_1.isObject(data)) {
            return Object.assign({}, data);
        }
        else if (lodash_1.isArray(data)) {
            return data.slice();
        }
        else {
            return data;
        }
    };
    FsFilterComponent.prototype.ngOnDestroy = function () { };
    __decorate([
        core_1.Input(),
        __metadata("design:type", classes_1.FsFilter)
    ], FsFilterComponent.prototype, "filter", void 0);
    FsFilterComponent = __decorate([
        core_1.Component({
            selector: 'fs-filter',
            template: __webpack_require__("./components/fsfilter/fsfilter.component.html"),
            styles: [__webpack_require__("./components/fsfilter/fsfilter.component.scss")],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [store_1.FsStore, router_1.ActivatedRoute, common_1.Location])
    ], FsFilterComponent);
    return FsFilterComponent;
}());
exports.FsFilterComponent = FsFilterComponent;


/***/ }),

/***/ "./index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = __webpack_require__("@angular/common");
var forms_1 = __webpack_require__("@angular/forms");
var core_1 = __webpack_require__("@angular/core");
var material_1 = __webpack_require__("@angular/material");
var material_2 = __webpack_require__("@angular/material");
var datepicker_1 = __webpack_require__("@firestitch/datepicker");
var common_2 = __webpack_require__("@firestitch/common");
var store_1 = __webpack_require__("@firestitch/store");
var fsfilter_component_1 = __webpack_require__("./components/fsfilter/fsfilter.component.ts");
var flex_layout_1 = __webpack_require__("@angular/flex-layout");
var fsfilter_class_1 = __webpack_require__("./classes/fsfilter.class.ts");
__export(__webpack_require__("./classes/index.ts"));
var FsFilterModule = (function () {
    function FsFilterModule() {
    }
    FsFilterModule_1 = FsFilterModule;
    FsFilterModule.forRoot = function () {
        return {
            ngModule: FsFilterModule_1,
            providers: []
        };
    };
    FsFilterModule = FsFilterModule_1 = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                common_2.FsCommonModule,
                store_1.FsStoreModule,
                datepicker_1.FsDatepickerModule,
                material_2.MatIconModule,
                material_2.MatInputModule,
                material_2.MatSelectModule,
                material_2.MatChipsModule,
                material_2.MatCheckboxModule,
                material_2.MatAutocompleteModule,
                material_2.MatButtonModule,
                flex_layout_1.FlexLayoutModule
            ],
            declarations: [
                fsfilter_component_1.FsFilterComponent
            ],
            providers: [
                fsfilter_class_1.FsFilter,
                { provide: material_1.MAT_PLACEHOLDER_GLOBAL_OPTIONS, useValue: { float: 'never' } }
            ],
            exports: [
                fsfilter_component_1.FsFilterComponent
            ]
        })
    ], FsFilterModule);
    return FsFilterModule;
    var FsFilterModule_1;
}());
exports.FsFilterModule = FsFilterModule;


/***/ }),

/***/ "@angular/common":
/***/ (function(module, exports) {

module.exports = require("@angular/common");

/***/ }),

/***/ "@angular/core":
/***/ (function(module, exports) {

module.exports = require("@angular/core");

/***/ }),

/***/ "@angular/flex-layout":
/***/ (function(module, exports) {

module.exports = require("@angular/flex-layout");

/***/ }),

/***/ "@angular/forms":
/***/ (function(module, exports) {

module.exports = require("@angular/forms");

/***/ }),

/***/ "@angular/material":
/***/ (function(module, exports) {

module.exports = require("@angular/material");

/***/ }),

/***/ "@angular/router":
/***/ (function(module, exports) {

module.exports = require("@angular/router");

/***/ }),

/***/ "@firestitch/common":
/***/ (function(module, exports) {

module.exports = require("@firestitch/common");

/***/ }),

/***/ "@firestitch/common/array":
/***/ (function(module, exports) {

module.exports = require("@firestitch/common/array");

/***/ }),

/***/ "@firestitch/common/util":
/***/ (function(module, exports) {

module.exports = require("@firestitch/common/util");

/***/ }),

/***/ "@firestitch/datepicker":
/***/ (function(module, exports) {

module.exports = require("@firestitch/datepicker");

/***/ }),

/***/ "@firestitch/store":
/***/ (function(module, exports) {

module.exports = require("@firestitch/store");

/***/ }),

/***/ "lodash":
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "moment-timezone":
/***/ (function(module, exports) {

module.exports = require("moment-timezone");

/***/ }),

/***/ "rxjs/Observable":
/***/ (function(module, exports) {

module.exports = require("rxjs/Observable");

/***/ }),

/***/ "rxjs/add/observable/forkJoin":
/***/ (function(module, exports) {

module.exports = require("rxjs/add/observable/forkJoin");

/***/ })

/******/ });
});
//# sourceMappingURL=index.map