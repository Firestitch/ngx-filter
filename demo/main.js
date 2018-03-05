webpackJsonp([2],{

/***/ "../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../node_modules/resolve-url-loader/index.js?{\"sourceMap\":true}!../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../src/components/fsfilter/fsfilter.component.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, ".fs-filter {\n  position: relative;\n  margin-bottom: 20px;\n}\n\n.fs-filter .inline-filter {\n  display: inline-block;\n}\n\n.fs-filter .inline-filter .filter-group {\n  display: inline-block;\n}\n\n.fs-filter .title {\n  display: none;\n}\n\n.fs-filter .results {\n  min-height: 90px;\n  position: relative;\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n\n.fs-filter .status {\n  position: relative;\n}\n\n.fs-filter .status .progress-infinite {\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n.fs-filter .full-search .filter.filter-date > span {\n  display: inline-block;\n}\n\n.fs-filter .filter-by {\n  display: none;\n}\n\n.fs-filter .menu-filter .search {\n  top: 8px;\n  position: absolute;\n  margin-left: 1px;\n  left: 0;\n}\n\n.fs-filter .menu-filter .search mat-icon {\n  -webkit-transform: scale(0.9);\n          transform: scale(0.9);\n}\n\n.fs-filter .menu-filter .backdrop {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 69;\n  outline: none;\n}\n\n.fs-filter .menu-filter .menu-filter-input {\n  position: relative;\n  /*\n      .action-filter {\n        display: none;\n        z-index: 30;\n      }\n      */\n  /*\n      TODO\n      md-datepicker-container {\n        width: 100%;\n        .md-datepicker-input-container {\n            margin-left: 0;\n        }\n      }\n      */\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions {\n  white-space: nowrap;\n  position: absolute;\n  right: 0;\n  top: 8px;\n  z-index: 50;\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions a {\n  color: rgba(0, 0, 0, .54);\n  background: #fff;\n  height: 22px;\n  margin-bottom: 5px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions a i {\n  -webkit-transform: scale(0.9);\n          transform: scale(0.9);\n  vertical-align: middle;\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions a:hover {\n  color: inherit;\n}\n\n.fs-filter .menu-filter .menu-filter-input mat-form-field {\n  width: 100%;\n}\n\n.fs-filter .menu-filter .menu-filter-input .main-filter-bar {\n  height: 40px;\n  /* Largest height between inputs, buttons, icons */\n}\n\n.fs-filter .menu-filter .menu-filter-input .main-filter-bar .mat-input-prefix {\n  -ms-flex-item-align: end;\n      align-self: flex-end;\n}\n\n.fs-filter .menu-filter .menu-filter-input .main-filter-bar mat-form-field {\n  width: 100%;\n  /*\n          input {\n            padding-right: 26px;\n            padding-left: 26px;\n            position: relative;\n          }\n          */\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters {\n  position: absolute;\n  width: 100%;\n  margin-top: -4px;\n  display: none;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .wrap {\n  padding: 8px 17px 17px 17px;\n  background: #fff;\n  -webkit-box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, .2), 0px 4px 5px 0px rgba(0, 0, 0, .14), 0px 1px 10px 0px rgba(0, 0, 0, .12);\n          box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, .2), 0px 4px 5px 0px rgba(0, 0, 0, .14), 0px 1px 10px 0px rgba(0, 0, 0, .12);\n  overflow: auto;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter-group {\n  display: table;\n  width: 100%;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter {\n  display: table-row;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface.interface-checkbox .checkbox-label,\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface.interface .checkbox-label {\n  display: none;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface.interface-range input {\n  text-align: center;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface.interface-datetime fs-datetime.has-time .md-input {\n  width: 100%;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface fs-datetime-range input {\n  text-align: center;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface,\n.fs-filter .menu-filter .menu-filter-input .filters .filter .filter-label {\n  display: table-cell;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .filter-label {\n  width: 1%;\n  white-space: nowrap;\n  vertical-align: middle;\n  padding-right: 15px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters md-autocomplete-container md-input-container {\n  margin: 0;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .isolate .interface {\n  line-height: 20px;\n  padding-top: 5px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .isolate md-checkbox {\n  margin: 0 0 0 2px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .buttons {\n  padding-top: 15px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .buttons .filter-button,\n.fs-filter .menu-filter .menu-filter-input .filters .buttons .cancel-button {\n  margin: 0;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .buttons .cancel-button {\n  margin-left: 8px;\n}\n\n.fs-filter .filter {\n  margin-right: 15px;\n  display: inline-block;\n}\n\n.fs-filter .filter label {\n  white-space: nowrap;\n  color: rgba(0, 0, 0, .54);\n}\n\n.fs-filter .filter.filter-range mat-form-field {\n  min-width: 0;\n  min-width: initial;\n  width: 50px;\n}\n\n.fs-filter .filter.filter-range mat-form-field.filter-range-min {\n  margin-right: 5px;\n}\n\n.fs-filter .infinite-records {\n  color: #999;\n  font-size: 13px;\n  margin-left: 4px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: block;\n}\n\n.fs-filter .infinite-records .order-toggle {\n  cursor: pointer;\n  padding-left: 4px;\n}\n\n.fs-filter .infinite-records .saved-filters {\n  float: right;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n}\n\n.fs-filter .md-datepicker-calendar-pane {\n  margin-left: -10px;\n}\n\n.fs-filter .saved-filter-menu {\n  padding-top: 0;\n}\n\n.fs-filter .saved-filter-menu .my-saved-filters {\n  line-height: 50px;\n  padding: 0 10px;\n  font-weight: bold;\n}\n\n.fs-filter.filters-open .inline-actions {\n  z-index: 71;\n}\n\n.fs-filter.filters-open .main-filter-bar md-input-container input,\n.fs-filter.filters-open .menu-filter-input .filters {\n  z-index: 70;\n  display: block;\n}\n\n@media screen and (max-width: 750px) {\n  .fs-filter .saved-filters {\n    float: none;\n  }\n}\n\n@media screen and (min-width: 600px) {\n  .mat-input-container mat-label {\n    display: none;\n  }\n\n  .inline-filter.inline .mat-input-container mat-label {\n    display: inherit;\n  }\n}\n\n@media screen and (max-width: 599px) {\n  body.fs-filters-open {\n    overflow: hidden !important;\n  }\n\n  body.fs-filters-open .inline-actions {\n    display: none;\n  }\n\n  .fs-filter {\n    margin-top: 0;\n  }\n\n  .fs-filter .title {\n    display: block;\n    /*\n      fs-heading {\n        margin: 0;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n      }\n      */\n  }\n\n  .responsive-top-actions {\n    display: block;\n  }\n\n  .filter-by {\n    margin: 10px 0;\n    font-weight: 600;\n    font-size: 16px;\n  }\n\n  .menu-filter .menu-filter-input .filters .wrap {\n    position: fixed;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    overflow-y: auto;\n    z-index: 999;\n  }\n\n  .menu-filter .menu-filter-input .filters .filter-group,\n  .menu-filter .menu-filter-input .filters .filter,\n  .menu-filter .menu-filter-input .filters .filter .filter-label,\n  .menu-filter .menu-filter-input .filters .filter .interface {\n    display: block;\n  }\n\n  .menu-filter .menu-filter-input .filters .interface-checkbox .checkbox-label,\n  .menu-filter .menu-filter-input .filters .interface .checkbox-label {\n    display: block !important;\n  }\n\n  .menu-filter .menu-filter-input .action-reload {\n    display: none;\n  }\n\n  .menu-filter .menu-filter-input .filter-group {\n    margin: 10px 0 0 0;\n  }\n\n  .menu-filter .menu-filter-input .filter-group:first-child {\n    margin: 0;\n  }\n\n  .menu-filter .menu-filter-input .filter .filter-label {\n    display: none !important;\n  }\n}\n\n", "", {"version":3,"sources":["/Users/Basters/dev/firestitch/fs-filter/src/components/fsfilter/src/components/fsfilter/fsfilter.component.scss","/Users/Basters/dev/firestitch/fs-filter/fsfilter.component.scss"],"names":[],"mappings":"AACA;EACE,mBAAA;EACA,oBAAA;CCAD;;ADEC;EACE,sBAAA;CCCH;;ADAG;EACE,sBAAA;CCGL;;ADCC;EACE,cAAA;CCEH;;ADdD;EAgBI,iBAAA;EACA,mBAAA;EACA,iBAAA;EACA,mBAAA;CCEH;;ADCC;EACE,mBAAA;CCEH;;ADAG;EACE,mBAAA;EACA,OAAA;EACA,YAAA;CCGL;;ADGO;EACA,sBAAA;CCAP;;ADnCD;EAyCI,cAAA;CCFH;;ADMG;EACE,SAAA;EACA,mBAAA;EACA,iBAAA;EACA,QAAA;CCHL;;AD9CD;EAoDQ,8BAAA;UAAA,sBAAA;CCFP;;ADMG;EACE,gBAAA;EACA,OAAA;EACA,UAAA;EACA,QAAA;EACA,SAAA;EACA,YAAA;EACA,cAAA;CCHL;;ADMG;EAEE,mBAAA;EAyBA;;;;;QCxBE;EDmCF;;;;;;;;QC1BE;CACP;;AD/ED;EAuEQ,oBAAA;EACA,mBAAA;EACA,SAAA;EACA,SAAA;EACA,YAAA;CCYP;;ADvFD;EA8EU,0BAAA;EACA,iBAAA;EACA,aAAA;EACA,mBAAA;CCaT;;AD9FD;EAoFY,8BAAA;UAAA,sBAAA;EACA,uBAAA;CCcX;;ADnGD;EAyFY,eAAA;CCcX;;ADvGD;EAqGQ,YAAA;CCMP;;ADOK;EACE,aAAA;EAAe,mDAAA;CCHtB;;ADhHD;EAsHU,yBAAA;MAAA,qBAAA;CCFT;;ADpHD;EA0HU,YAAA;EACA;;;;;;YCGE;CACX;;ADMK;EACE,mBAAA;EACA,YAAA;EACA,iBAAA;EACA,cAAA;CCHP;;ADtID;EA4IU,4BAAA;EACA,iBAAA;EACA,gIAAA;UAAA,wHAAA;EACA,eAAA;CCFT;;ADKO;EACE,eAAA;EACA,YAAA;CCFT;;ADKO;EACE,mBAAA;CCFT;;ADtJD;;EA8JgB,cAAA;CCHf;;ADO6B;EAChB,mBAAA;CCJb;;AD/JD;EAwKc,YAAA;CCLb;;ADnKD;EA4Kc,mBAAA;CCLb;;ADvKD;;EAkLY,oBAAA;CCNX;;AD5KD;EAsLY,UAAA;EACA,oBAAA;EACA,uBAAA;EACA,oBAAA;CCNX;;ADWiC;EACxB,UAAA;CCRT;;ADvLD;EAoMY,kBAAA;EACA,iBAAA;CCTX;;ADYS;EACE,kBAAA;CCTX;;ADhMD;EA8MU,kBAAA;CCVT;;ADWS;;EAEE,UAAA;CCRX;;ADWS;EACE,iBAAA;CCRX;;AD7MD;EA8NI,mBAAA;EACA,sBAAA;CCbH;;ADeG;EACE,oBAAA;EACA,0BAAA;CCZL;;ADvND;EAwOQ,aAAA;EAAA,mBAAA;EACA,YAAA;CCbP;;ADWK;EAII,kBAAA;CCXT;;ADhOD;EAkPI,YAAA;EACA,gBAAA;EACA,iBAAA;EACA,oBAAA;EACA,iBAAA;EACA,wBAAA;EACA,eAAA;CCdH;;AD1OD;EA2PM,gBAAA;EACA,kBAAA;CCbL;;ADgBG;EACE,aAAA;EACA,qBAAA;EAAA,qBAAA;EAAA,cAAA;CCbL;;ADpPD;EAuQI,mBAAA;CCfH;;ADxPD;EA2QI,eAAA;CCfH;;ADgBG;EACE,kBAAA;EACA,gBAAA;EACA,kBAAA;CCbL;;ADlQD;EAqRM,YAAA;CCfL;;ADtQD;;EA0RM,YAAA;EACA,eAAA;CCfL;;ADoBD;EAEI;IACE,YAAA;GClBH;CACF;;ADsBD;EAEI;IACE,cAAA;GCpBH;;EDuBD;IAIQ,iBAAA;GCvBP;CACF;;AD6BD;EAEE;IACE,4BAAA;GC3BD;;ED0BD;IAII,cAAA;GC1BH;;ED8BD;IACE,cAAA;GC3BD;;ED0BD;IAII,eAAA;IACA;;;;;;;QCpBE;GACL;;ED8BD;IACE,eAAA;GC3BD;;ED8BD;IAEE,eAAA;IACA,iBAAA;IACA,gBAAA;GC5BD;;ED+BD;IAIQ,gBAAA;IACA,OAAA;IACA,QAAA;IACA,UAAA;IACA,SAAA;IACA,iBAAA;IACA,aAAA;GC/BP;;EDqBD;;;;IAiBQ,eAAA;GC/BP;;EDkCO;;IACE,0BAAA;GC9BT;;EDSD;IA+BM,cAAA;GCpCL;;EDKD;IAmCM,mBAAA;GCpCL;;EDCD;IAsCQ,UAAA;GCnCP;;EDwCK;IACE,yBAAA;GCrCP;CACF","file":"fsfilter.component.scss","sourcesContent":["\n.fs-filter {\n  position: relative;\n  margin-bottom: 20px;\n\n  .inline-filter {\n    display: inline-block;\n    .filter-group {\n      display: inline-block;\n    }\n  }\n\n  .title {\n    display: none;\n  }\n\n  .results {\n    min-height: 90px;\n    position: relative;\n    overflow-x: auto;\n    overflow-y: hidden;\n  }\n\n  .status {\n    position: relative;\n\n    .progress-infinite {\n      position: absolute;\n      top: 0;\n      width: 100%;\n    }\n  }\n\n  .full-search {\n    .filter.filter-date {\n      > span {\n        display: inline-block\n      }\n    }\n  }\n\n  .filter-by {\n    display: none;\n  }\n\n  .menu-filter {\n    .search {\n      top: 8px;\n      position: absolute;\n      margin-left: 1px;\n      left: 0;\n\n      mat-icon {\n        transform: scale(.9);\n      }\n    }\n\n    .backdrop {\n      position: fixed;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n      z-index: 69;\n      outline: none;\n    }\n\n    .menu-filter-input {\n\n      position: relative;\n\n      .inline-actions {\n        white-space: nowrap;\n        position: absolute;\n        right: 0;\n        top: 8px;\n        z-index: 50;\n\n        a {\n          color: rgba(0, 0, 0, 0.54);\n          background: #fff;\n          height: 22px;\n          margin-bottom: 5px;\n\n          i {\n            transform: scale(.9);\n            vertical-align: middle;\n          }\n\n          &:hover {\n            color: inherit;\n          }\n        }\n      }\n      /*\n      .action-filter {\n        display: none;\n        z-index: 30;\n      }\n      */\n\n      mat-form-field {\n        width: 100%;\n      }\n\n      /*\n      TODO\n      md-datepicker-container {\n        width: 100%;\n        .md-datepicker-input-container {\n            margin-left: 0;\n        }\n      }\n      */\n\n      .main-filter-bar {\n        height: 40px; /* Largest height between inputs, buttons, icons */\n\n        .mat-input-prefix {\n          align-self: flex-end;\n        }\n\n        mat-form-field {\n          width: 100%;\n          /*\n          input {\n            padding-right: 26px;\n            padding-left: 26px;\n            position: relative;\n          }\n          */\n        }\n      }\n\n      .filters {\n        position: absolute;\n        width: 100%;\n        margin-top: -4px;\n        display: none;\n\n        .wrap {\n          padding: 8px 17px 17px 17px;\n          background: #fff;\n          box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);\n          overflow: auto;\n        }\n\n        .filter-group {\n          display: table;\n          width: 100%;\n        }\n\n        .filter {\n          display: table-row;\n\n          .interface {\n\n            &.interface-checkbox, &.interface {\n              .checkbox-label {\n                display: none;\n              }\n            }\n\n            &.interface-range input {\n              text-align: center;\n            }\n\n            //TODO\n            &.interface-datetime fs-datetime.has-time .md-input {\n              width: 100%;\n            }\n            //TODO\n            fs-datetime-range input {\n              text-align: center;\n            }\n          }\n\n          .interface,\n          .filter-label {\n            display: table-cell;\n          }\n\n          .filter-label {\n            width: 1%;\n            white-space: nowrap;\n            vertical-align: middle;\n            padding-right: 15px;\n          }\n        }\n\n        //TODO\n        md-autocomplete-container md-input-container {\n          margin: 0;\n        }\n\n        .isolate {\n          .interface {\n            line-height: 20px;\n            padding-top: 5px;\n          }\n          //TODO\n          md-checkbox {\n            margin: 0 0 0 2px;\n          }\n        }\n\n        .buttons {\n          padding-top: 15px;\n          .filter-button,\n          .cancel-button {\n            margin: 0;\n          }\n\n          .cancel-button {\n            margin-left: 8px;\n          }\n        }\n      }\n    }\n  }\n\n  .filter {\n\n    margin-right: 15px;\n    display: inline-block;\n    //TODO\n    label {\n      white-space: nowrap;\n      color: rgba(0, 0, 0, 0.54);\n    }\n\n    &.filter-range {\n      mat-form-field {\n        min-width: initial;\n        width: 50px;\n        &.filter-range-min {\n          margin-right: 5px;\n        }\n      }\n    }\n  }\n\n  .infinite-records {\n    color: #999;\n    font-size: 13px;\n    margin-left: 4px;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    display: block;\n\n    .order-toggle {\n      cursor: pointer;\n      padding-left: 4px;\n    }\n\n    .saved-filters {\n      float: right;\n      display: flex;\n    }\n  }\n\n  //TODO\n  .md-datepicker-calendar-pane {\n    margin-left: -10px;\n  }\n\n  .saved-filter-menu {\n    padding-top: 0;\n    .my-saved-filters {\n      line-height: 50px;\n      padding: 0 10px;\n      font-weight: bold;\n    }\n  }\n\n  &.filters-open {\n    .inline-actions {\n      z-index: 71;\n    }\n\n    .main-filter-bar md-input-container input,\n    .menu-filter-input .filters {\n      z-index: 70;\n      display: block;\n    }\n  }\n}\n\n@media screen and (max-width: 750px) {\n  .fs-filter {\n    .saved-filters {\n      float: none;\n    }\n  }\n}\n\n@media screen and (min-width: 600px) {\n  .mat-input-container {\n    mat-label {\n      display: none;\n    }\n  }\n  .inline-filter {\n    &.inline {\n      .mat-input-container {\n        mat-label {\n          display: inherit;\n        }\n      }\n    }\n  }\n}\n\n@media screen and (max-width: 599px) {\n\n  body.fs-filters-open {\n    overflow: hidden !important;\n\n    .inline-actions {\n      display: none;\n    }\n  }\n\n  .fs-filter {\n    margin-top: 0;\n\n    .title {\n      display: block;\n      /*\n      fs-heading {\n        margin: 0;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n      }\n      */\n    }\n  }\n\n  .responsive-top-actions {\n    display: block;\n  }\n\n  .filter-by {\n    //display: block;\n    margin: 10px 0;\n    font-weight: 600;\n    font-size: 16px;\n  }\n\n  .menu-filter {\n    .menu-filter-input {\n      .filters {\n        .wrap {\n          position: fixed;\n          top: 0;\n          left: 0;\n          bottom: 0;\n          right: 0;\n          overflow-y: auto;\n          z-index: 999;\n        }\n\n        .filter-group,\n        .filter,\n        .filter .filter-label,\n        .filter .interface {\n          display: block;\n        }\n        .interface-checkbox, .interface {\n          .checkbox-label {\n            display: block !important;\n          }\n        }\n      }\n\n      .action-filter {\n        //z-index: 30;\n      }\n\n      .action-reload {\n        display: none;\n      }\n\n      .filter-group {\n        margin: 10px 0 0 0;\n\n        &:first-child {\n          margin: 0;\n        }\n      }\n\n      .filter {\n        .filter-label {\n          display: none !important;\n        }\n      }\n    }\n  }\n}\n",".fs-filter {\n  position: relative;\n  margin-bottom: 20px;\n}\n\n.fs-filter .inline-filter {\n  display: inline-block;\n}\n\n.fs-filter .inline-filter .filter-group {\n  display: inline-block;\n}\n\n.fs-filter .title {\n  display: none;\n}\n\n.fs-filter .results {\n  min-height: 90px;\n  position: relative;\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n\n.fs-filter .status {\n  position: relative;\n}\n\n.fs-filter .status .progress-infinite {\n  position: absolute;\n  top: 0;\n  width: 100%;\n}\n\n.fs-filter .full-search .filter.filter-date > span {\n  display: inline-block;\n}\n\n.fs-filter .filter-by {\n  display: none;\n}\n\n.fs-filter .menu-filter .search {\n  top: 8px;\n  position: absolute;\n  margin-left: 1px;\n  left: 0;\n}\n\n.fs-filter .menu-filter .search mat-icon {\n  transform: scale(0.9);\n}\n\n.fs-filter .menu-filter .backdrop {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 69;\n  outline: none;\n}\n\n.fs-filter .menu-filter .menu-filter-input {\n  position: relative;\n  /*\n      .action-filter {\n        display: none;\n        z-index: 30;\n      }\n      */\n  /*\n      TODO\n      md-datepicker-container {\n        width: 100%;\n        .md-datepicker-input-container {\n            margin-left: 0;\n        }\n      }\n      */\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions {\n  white-space: nowrap;\n  position: absolute;\n  right: 0;\n  top: 8px;\n  z-index: 50;\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions a {\n  color: rgba(0, 0, 0, 0.54);\n  background: #fff;\n  height: 22px;\n  margin-bottom: 5px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions a i {\n  transform: scale(0.9);\n  vertical-align: middle;\n}\n\n.fs-filter .menu-filter .menu-filter-input .inline-actions a:hover {\n  color: inherit;\n}\n\n.fs-filter .menu-filter .menu-filter-input mat-form-field {\n  width: 100%;\n}\n\n.fs-filter .menu-filter .menu-filter-input .main-filter-bar {\n  height: 40px;\n  /* Largest height between inputs, buttons, icons */\n}\n\n.fs-filter .menu-filter .menu-filter-input .main-filter-bar .mat-input-prefix {\n  align-self: flex-end;\n}\n\n.fs-filter .menu-filter .menu-filter-input .main-filter-bar mat-form-field {\n  width: 100%;\n  /*\n          input {\n            padding-right: 26px;\n            padding-left: 26px;\n            position: relative;\n          }\n          */\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters {\n  position: absolute;\n  width: 100%;\n  margin-top: -4px;\n  display: none;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .wrap {\n  padding: 8px 17px 17px 17px;\n  background: #fff;\n  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);\n  overflow: auto;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter-group {\n  display: table;\n  width: 100%;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter {\n  display: table-row;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface.interface-checkbox .checkbox-label,\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface.interface .checkbox-label {\n  display: none;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface.interface-range input {\n  text-align: center;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface.interface-datetime fs-datetime.has-time .md-input {\n  width: 100%;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface fs-datetime-range input {\n  text-align: center;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .interface,\n.fs-filter .menu-filter .menu-filter-input .filters .filter .filter-label {\n  display: table-cell;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .filter .filter-label {\n  width: 1%;\n  white-space: nowrap;\n  vertical-align: middle;\n  padding-right: 15px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters md-autocomplete-container md-input-container {\n  margin: 0;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .isolate .interface {\n  line-height: 20px;\n  padding-top: 5px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .isolate md-checkbox {\n  margin: 0 0 0 2px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .buttons {\n  padding-top: 15px;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .buttons .filter-button,\n.fs-filter .menu-filter .menu-filter-input .filters .buttons .cancel-button {\n  margin: 0;\n}\n\n.fs-filter .menu-filter .menu-filter-input .filters .buttons .cancel-button {\n  margin-left: 8px;\n}\n\n.fs-filter .filter {\n  margin-right: 15px;\n  display: inline-block;\n}\n\n.fs-filter .filter label {\n  white-space: nowrap;\n  color: rgba(0, 0, 0, 0.54);\n}\n\n.fs-filter .filter.filter-range mat-form-field {\n  min-width: initial;\n  width: 50px;\n}\n\n.fs-filter .filter.filter-range mat-form-field.filter-range-min {\n  margin-right: 5px;\n}\n\n.fs-filter .infinite-records {\n  color: #999;\n  font-size: 13px;\n  margin-left: 4px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: block;\n}\n\n.fs-filter .infinite-records .order-toggle {\n  cursor: pointer;\n  padding-left: 4px;\n}\n\n.fs-filter .infinite-records .saved-filters {\n  float: right;\n  display: flex;\n}\n\n.fs-filter .md-datepicker-calendar-pane {\n  margin-left: -10px;\n}\n\n.fs-filter .saved-filter-menu {\n  padding-top: 0;\n}\n\n.fs-filter .saved-filter-menu .my-saved-filters {\n  line-height: 50px;\n  padding: 0 10px;\n  font-weight: bold;\n}\n\n.fs-filter.filters-open .inline-actions {\n  z-index: 71;\n}\n\n.fs-filter.filters-open .main-filter-bar md-input-container input,\n.fs-filter.filters-open .menu-filter-input .filters {\n  z-index: 70;\n  display: block;\n}\n\n@media screen and (max-width: 750px) {\n  .fs-filter .saved-filters {\n    float: none;\n  }\n}\n\n@media screen and (min-width: 600px) {\n  .mat-input-container mat-label {\n    display: none;\n  }\n\n  .inline-filter.inline .mat-input-container mat-label {\n    display: inherit;\n  }\n}\n\n@media screen and (max-width: 599px) {\n  body.fs-filters-open {\n    overflow: hidden !important;\n  }\n\n  body.fs-filters-open .inline-actions {\n    display: none;\n  }\n\n  .fs-filter {\n    margin-top: 0;\n  }\n\n  .fs-filter .title {\n    display: block;\n    /*\n      fs-heading {\n        margin: 0;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n      }\n      */\n  }\n\n  .responsive-top-actions {\n    display: block;\n  }\n\n  .filter-by {\n    margin: 10px 0;\n    font-weight: 600;\n    font-size: 16px;\n  }\n\n  .menu-filter .menu-filter-input .filters .wrap {\n    position: fixed;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    overflow-y: auto;\n    z-index: 999;\n  }\n\n  .menu-filter .menu-filter-input .filters .filter-group,\n  .menu-filter .menu-filter-input .filters .filter,\n  .menu-filter .menu-filter-input .filters .filter .filter-label,\n  .menu-filter .menu-filter-input .filters .filter .interface {\n    display: block;\n  }\n\n  .menu-filter .menu-filter-input .filters .interface-checkbox .checkbox-label,\n  .menu-filter .menu-filter-input .filters .interface .checkbox-label {\n    display: block !important;\n  }\n\n  .menu-filter .menu-filter-input .action-reload {\n    display: none;\n  }\n\n  .menu-filter .menu-filter-input .filter-group {\n    margin: 10px 0 0 0;\n  }\n\n  .menu-filter .menu-filter-input .filter-group:first-child {\n    margin: 0;\n  }\n\n  .menu-filter .menu-filter-input .filter .filter-label {\n    display: none !important;\n  }\n}\n\n"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../node_modules/resolve-url-loader/index.js?{\"sourceMap\":true}!./app/components/first-example/first-example.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../node_modules/css-loader/lib/css-base.js")(true);
// imports


// module
exports.push([module.i, "fs-filter {\n  display: block;\n  height: 1000px;\n}", "", {"version":3,"sources":["/Users/Basters/dev/firestitch/fs-filter/first-example.component.css"],"names":[],"mappings":"AAAA;EACI,eAAA;EACA,eAAA;CACH","file":"first-example.component.css","sourcesContent":["fs-filter {\n    display: block;\n    height: 1000px;\n}"],"sourceRoot":""}]);

// exports


/***/ }),

/***/ "../node_modules/moment/locale recursive ^\\.\\/.*$":
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": "../node_modules/moment/locale/af.js",
	"./af.js": "../node_modules/moment/locale/af.js",
	"./ar": "../node_modules/moment/locale/ar.js",
	"./ar-dz": "../node_modules/moment/locale/ar-dz.js",
	"./ar-dz.js": "../node_modules/moment/locale/ar-dz.js",
	"./ar-kw": "../node_modules/moment/locale/ar-kw.js",
	"./ar-kw.js": "../node_modules/moment/locale/ar-kw.js",
	"./ar-ly": "../node_modules/moment/locale/ar-ly.js",
	"./ar-ly.js": "../node_modules/moment/locale/ar-ly.js",
	"./ar-ma": "../node_modules/moment/locale/ar-ma.js",
	"./ar-ma.js": "../node_modules/moment/locale/ar-ma.js",
	"./ar-sa": "../node_modules/moment/locale/ar-sa.js",
	"./ar-sa.js": "../node_modules/moment/locale/ar-sa.js",
	"./ar-tn": "../node_modules/moment/locale/ar-tn.js",
	"./ar-tn.js": "../node_modules/moment/locale/ar-tn.js",
	"./ar.js": "../node_modules/moment/locale/ar.js",
	"./az": "../node_modules/moment/locale/az.js",
	"./az.js": "../node_modules/moment/locale/az.js",
	"./be": "../node_modules/moment/locale/be.js",
	"./be.js": "../node_modules/moment/locale/be.js",
	"./bg": "../node_modules/moment/locale/bg.js",
	"./bg.js": "../node_modules/moment/locale/bg.js",
	"./bm": "../node_modules/moment/locale/bm.js",
	"./bm.js": "../node_modules/moment/locale/bm.js",
	"./bn": "../node_modules/moment/locale/bn.js",
	"./bn.js": "../node_modules/moment/locale/bn.js",
	"./bo": "../node_modules/moment/locale/bo.js",
	"./bo.js": "../node_modules/moment/locale/bo.js",
	"./br": "../node_modules/moment/locale/br.js",
	"./br.js": "../node_modules/moment/locale/br.js",
	"./bs": "../node_modules/moment/locale/bs.js",
	"./bs.js": "../node_modules/moment/locale/bs.js",
	"./ca": "../node_modules/moment/locale/ca.js",
	"./ca.js": "../node_modules/moment/locale/ca.js",
	"./cs": "../node_modules/moment/locale/cs.js",
	"./cs.js": "../node_modules/moment/locale/cs.js",
	"./cv": "../node_modules/moment/locale/cv.js",
	"./cv.js": "../node_modules/moment/locale/cv.js",
	"./cy": "../node_modules/moment/locale/cy.js",
	"./cy.js": "../node_modules/moment/locale/cy.js",
	"./da": "../node_modules/moment/locale/da.js",
	"./da.js": "../node_modules/moment/locale/da.js",
	"./de": "../node_modules/moment/locale/de.js",
	"./de-at": "../node_modules/moment/locale/de-at.js",
	"./de-at.js": "../node_modules/moment/locale/de-at.js",
	"./de-ch": "../node_modules/moment/locale/de-ch.js",
	"./de-ch.js": "../node_modules/moment/locale/de-ch.js",
	"./de.js": "../node_modules/moment/locale/de.js",
	"./dv": "../node_modules/moment/locale/dv.js",
	"./dv.js": "../node_modules/moment/locale/dv.js",
	"./el": "../node_modules/moment/locale/el.js",
	"./el.js": "../node_modules/moment/locale/el.js",
	"./en-au": "../node_modules/moment/locale/en-au.js",
	"./en-au.js": "../node_modules/moment/locale/en-au.js",
	"./en-ca": "../node_modules/moment/locale/en-ca.js",
	"./en-ca.js": "../node_modules/moment/locale/en-ca.js",
	"./en-gb": "../node_modules/moment/locale/en-gb.js",
	"./en-gb.js": "../node_modules/moment/locale/en-gb.js",
	"./en-ie": "../node_modules/moment/locale/en-ie.js",
	"./en-ie.js": "../node_modules/moment/locale/en-ie.js",
	"./en-nz": "../node_modules/moment/locale/en-nz.js",
	"./en-nz.js": "../node_modules/moment/locale/en-nz.js",
	"./eo": "../node_modules/moment/locale/eo.js",
	"./eo.js": "../node_modules/moment/locale/eo.js",
	"./es": "../node_modules/moment/locale/es.js",
	"./es-do": "../node_modules/moment/locale/es-do.js",
	"./es-do.js": "../node_modules/moment/locale/es-do.js",
	"./es-us": "../node_modules/moment/locale/es-us.js",
	"./es-us.js": "../node_modules/moment/locale/es-us.js",
	"./es.js": "../node_modules/moment/locale/es.js",
	"./et": "../node_modules/moment/locale/et.js",
	"./et.js": "../node_modules/moment/locale/et.js",
	"./eu": "../node_modules/moment/locale/eu.js",
	"./eu.js": "../node_modules/moment/locale/eu.js",
	"./fa": "../node_modules/moment/locale/fa.js",
	"./fa.js": "../node_modules/moment/locale/fa.js",
	"./fi": "../node_modules/moment/locale/fi.js",
	"./fi.js": "../node_modules/moment/locale/fi.js",
	"./fo": "../node_modules/moment/locale/fo.js",
	"./fo.js": "../node_modules/moment/locale/fo.js",
	"./fr": "../node_modules/moment/locale/fr.js",
	"./fr-ca": "../node_modules/moment/locale/fr-ca.js",
	"./fr-ca.js": "../node_modules/moment/locale/fr-ca.js",
	"./fr-ch": "../node_modules/moment/locale/fr-ch.js",
	"./fr-ch.js": "../node_modules/moment/locale/fr-ch.js",
	"./fr.js": "../node_modules/moment/locale/fr.js",
	"./fy": "../node_modules/moment/locale/fy.js",
	"./fy.js": "../node_modules/moment/locale/fy.js",
	"./gd": "../node_modules/moment/locale/gd.js",
	"./gd.js": "../node_modules/moment/locale/gd.js",
	"./gl": "../node_modules/moment/locale/gl.js",
	"./gl.js": "../node_modules/moment/locale/gl.js",
	"./gom-latn": "../node_modules/moment/locale/gom-latn.js",
	"./gom-latn.js": "../node_modules/moment/locale/gom-latn.js",
	"./gu": "../node_modules/moment/locale/gu.js",
	"./gu.js": "../node_modules/moment/locale/gu.js",
	"./he": "../node_modules/moment/locale/he.js",
	"./he.js": "../node_modules/moment/locale/he.js",
	"./hi": "../node_modules/moment/locale/hi.js",
	"./hi.js": "../node_modules/moment/locale/hi.js",
	"./hr": "../node_modules/moment/locale/hr.js",
	"./hr.js": "../node_modules/moment/locale/hr.js",
	"./hu": "../node_modules/moment/locale/hu.js",
	"./hu.js": "../node_modules/moment/locale/hu.js",
	"./hy-am": "../node_modules/moment/locale/hy-am.js",
	"./hy-am.js": "../node_modules/moment/locale/hy-am.js",
	"./id": "../node_modules/moment/locale/id.js",
	"./id.js": "../node_modules/moment/locale/id.js",
	"./is": "../node_modules/moment/locale/is.js",
	"./is.js": "../node_modules/moment/locale/is.js",
	"./it": "../node_modules/moment/locale/it.js",
	"./it.js": "../node_modules/moment/locale/it.js",
	"./ja": "../node_modules/moment/locale/ja.js",
	"./ja.js": "../node_modules/moment/locale/ja.js",
	"./jv": "../node_modules/moment/locale/jv.js",
	"./jv.js": "../node_modules/moment/locale/jv.js",
	"./ka": "../node_modules/moment/locale/ka.js",
	"./ka.js": "../node_modules/moment/locale/ka.js",
	"./kk": "../node_modules/moment/locale/kk.js",
	"./kk.js": "../node_modules/moment/locale/kk.js",
	"./km": "../node_modules/moment/locale/km.js",
	"./km.js": "../node_modules/moment/locale/km.js",
	"./kn": "../node_modules/moment/locale/kn.js",
	"./kn.js": "../node_modules/moment/locale/kn.js",
	"./ko": "../node_modules/moment/locale/ko.js",
	"./ko.js": "../node_modules/moment/locale/ko.js",
	"./ky": "../node_modules/moment/locale/ky.js",
	"./ky.js": "../node_modules/moment/locale/ky.js",
	"./lb": "../node_modules/moment/locale/lb.js",
	"./lb.js": "../node_modules/moment/locale/lb.js",
	"./lo": "../node_modules/moment/locale/lo.js",
	"./lo.js": "../node_modules/moment/locale/lo.js",
	"./lt": "../node_modules/moment/locale/lt.js",
	"./lt.js": "../node_modules/moment/locale/lt.js",
	"./lv": "../node_modules/moment/locale/lv.js",
	"./lv.js": "../node_modules/moment/locale/lv.js",
	"./me": "../node_modules/moment/locale/me.js",
	"./me.js": "../node_modules/moment/locale/me.js",
	"./mi": "../node_modules/moment/locale/mi.js",
	"./mi.js": "../node_modules/moment/locale/mi.js",
	"./mk": "../node_modules/moment/locale/mk.js",
	"./mk.js": "../node_modules/moment/locale/mk.js",
	"./ml": "../node_modules/moment/locale/ml.js",
	"./ml.js": "../node_modules/moment/locale/ml.js",
	"./mr": "../node_modules/moment/locale/mr.js",
	"./mr.js": "../node_modules/moment/locale/mr.js",
	"./ms": "../node_modules/moment/locale/ms.js",
	"./ms-my": "../node_modules/moment/locale/ms-my.js",
	"./ms-my.js": "../node_modules/moment/locale/ms-my.js",
	"./ms.js": "../node_modules/moment/locale/ms.js",
	"./my": "../node_modules/moment/locale/my.js",
	"./my.js": "../node_modules/moment/locale/my.js",
	"./nb": "../node_modules/moment/locale/nb.js",
	"./nb.js": "../node_modules/moment/locale/nb.js",
	"./ne": "../node_modules/moment/locale/ne.js",
	"./ne.js": "../node_modules/moment/locale/ne.js",
	"./nl": "../node_modules/moment/locale/nl.js",
	"./nl-be": "../node_modules/moment/locale/nl-be.js",
	"./nl-be.js": "../node_modules/moment/locale/nl-be.js",
	"./nl.js": "../node_modules/moment/locale/nl.js",
	"./nn": "../node_modules/moment/locale/nn.js",
	"./nn.js": "../node_modules/moment/locale/nn.js",
	"./pa-in": "../node_modules/moment/locale/pa-in.js",
	"./pa-in.js": "../node_modules/moment/locale/pa-in.js",
	"./pl": "../node_modules/moment/locale/pl.js",
	"./pl.js": "../node_modules/moment/locale/pl.js",
	"./pt": "../node_modules/moment/locale/pt.js",
	"./pt-br": "../node_modules/moment/locale/pt-br.js",
	"./pt-br.js": "../node_modules/moment/locale/pt-br.js",
	"./pt.js": "../node_modules/moment/locale/pt.js",
	"./ro": "../node_modules/moment/locale/ro.js",
	"./ro.js": "../node_modules/moment/locale/ro.js",
	"./ru": "../node_modules/moment/locale/ru.js",
	"./ru.js": "../node_modules/moment/locale/ru.js",
	"./sd": "../node_modules/moment/locale/sd.js",
	"./sd.js": "../node_modules/moment/locale/sd.js",
	"./se": "../node_modules/moment/locale/se.js",
	"./se.js": "../node_modules/moment/locale/se.js",
	"./si": "../node_modules/moment/locale/si.js",
	"./si.js": "../node_modules/moment/locale/si.js",
	"./sk": "../node_modules/moment/locale/sk.js",
	"./sk.js": "../node_modules/moment/locale/sk.js",
	"./sl": "../node_modules/moment/locale/sl.js",
	"./sl.js": "../node_modules/moment/locale/sl.js",
	"./sq": "../node_modules/moment/locale/sq.js",
	"./sq.js": "../node_modules/moment/locale/sq.js",
	"./sr": "../node_modules/moment/locale/sr.js",
	"./sr-cyrl": "../node_modules/moment/locale/sr-cyrl.js",
	"./sr-cyrl.js": "../node_modules/moment/locale/sr-cyrl.js",
	"./sr.js": "../node_modules/moment/locale/sr.js",
	"./ss": "../node_modules/moment/locale/ss.js",
	"./ss.js": "../node_modules/moment/locale/ss.js",
	"./sv": "../node_modules/moment/locale/sv.js",
	"./sv.js": "../node_modules/moment/locale/sv.js",
	"./sw": "../node_modules/moment/locale/sw.js",
	"./sw.js": "../node_modules/moment/locale/sw.js",
	"./ta": "../node_modules/moment/locale/ta.js",
	"./ta.js": "../node_modules/moment/locale/ta.js",
	"./te": "../node_modules/moment/locale/te.js",
	"./te.js": "../node_modules/moment/locale/te.js",
	"./tet": "../node_modules/moment/locale/tet.js",
	"./tet.js": "../node_modules/moment/locale/tet.js",
	"./th": "../node_modules/moment/locale/th.js",
	"./th.js": "../node_modules/moment/locale/th.js",
	"./tl-ph": "../node_modules/moment/locale/tl-ph.js",
	"./tl-ph.js": "../node_modules/moment/locale/tl-ph.js",
	"./tlh": "../node_modules/moment/locale/tlh.js",
	"./tlh.js": "../node_modules/moment/locale/tlh.js",
	"./tr": "../node_modules/moment/locale/tr.js",
	"./tr.js": "../node_modules/moment/locale/tr.js",
	"./tzl": "../node_modules/moment/locale/tzl.js",
	"./tzl.js": "../node_modules/moment/locale/tzl.js",
	"./tzm": "../node_modules/moment/locale/tzm.js",
	"./tzm-latn": "../node_modules/moment/locale/tzm-latn.js",
	"./tzm-latn.js": "../node_modules/moment/locale/tzm-latn.js",
	"./tzm.js": "../node_modules/moment/locale/tzm.js",
	"./uk": "../node_modules/moment/locale/uk.js",
	"./uk.js": "../node_modules/moment/locale/uk.js",
	"./ur": "../node_modules/moment/locale/ur.js",
	"./ur.js": "../node_modules/moment/locale/ur.js",
	"./uz": "../node_modules/moment/locale/uz.js",
	"./uz-latn": "../node_modules/moment/locale/uz-latn.js",
	"./uz-latn.js": "../node_modules/moment/locale/uz-latn.js",
	"./uz.js": "../node_modules/moment/locale/uz.js",
	"./vi": "../node_modules/moment/locale/vi.js",
	"./vi.js": "../node_modules/moment/locale/vi.js",
	"./x-pseudo": "../node_modules/moment/locale/x-pseudo.js",
	"./x-pseudo.js": "../node_modules/moment/locale/x-pseudo.js",
	"./yo": "../node_modules/moment/locale/yo.js",
	"./yo.js": "../node_modules/moment/locale/yo.js",
	"./zh-cn": "../node_modules/moment/locale/zh-cn.js",
	"./zh-cn.js": "../node_modules/moment/locale/zh-cn.js",
	"./zh-hk": "../node_modules/moment/locale/zh-hk.js",
	"./zh-hk.js": "../node_modules/moment/locale/zh-hk.js",
	"./zh-tw": "../node_modules/moment/locale/zh-tw.js",
	"./zh-tw.js": "../node_modules/moment/locale/zh-tw.js"
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "../node_modules/moment/locale recursive ^\\.\\/.*$";

/***/ }),

/***/ "../src/classes/fsfilter.class.ts":
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

/***/ "../src/classes/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("../src/classes/fsfilter.class.ts"));


/***/ }),

/***/ "../src/components/fsfilter/fsfilter.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"fs-filter\" fxLayout=\"row\" fxLayoutAlign=\"start stretch\" *ngIf=\"filter.fsConfig.items.length\"\n     [ngClass]=\"{ 'filters-open': extendedFilter, loading: loading }\">\n  <div *ngIf=\"!filter.fsConfig.inline\" fxLayou=\"row\" fxLayoutAlign=\"start center\" class=\"menu-filter\" fxFlex>\n    <div class=\"menu-filter-input\" fxFlex=\"grow\">\n      <div class=\"main-filter-bar\" fxLayout=\"row\" fxLayoutAlign=\"start center\"\n           *ngIf=\"filter.fsConfig.items.length\">\n        <mat-form-field>\n          <mat-icon matPrefix>search</mat-icon>\n          <input matInput [(ngModel)]=\"searchinput.value\" name=\"filter-input\"\n                 (ngModelChange)=\"menuFilterChange(searchinput.value)\"\n                 (focus)=\"menuFilterShow()\"\n                 (click)=\"menuFilterClick($event)\"\n                 (keydown)=\"menuFilterKeydown($event)\">\n          <mat-placeholder>Search</mat-placeholder>\n        </mat-form-field>\n\n        <div class=\"inline-actions\" fxLayout=\"row\" fxLayoutAlign=\"start center\">\n          <a (click)=\"menuFilterShow()\" class=\"action-filter\" [fxHide.gt-xs]=\"true\">\n            <mat-icon>filter_list</mat-icon>\n          </a>\n          <a (click)=\"clear()\" *ngIf=\"searchinput.value\">\n            <mat-icon>clear</mat-icon>\n          </a>\n          <a (click)=\"reload()\" class=\"action-reload\">\n            <mat-icon>refresh</mat-icon>\n          </a>\n        </div>\n      </div>\n\n      <div class=\"filters\">\n        <div class=\"wrap\">\n          <!-- @TODO\n\t\t\t\t\t  Mobal version of filters\n\t\t\t\t\t  fs-heading\n\t\t\t\t\t  heading-actions\n\t\t\t\t\t-->\n          <div class=\"filter-by\" fxLayout=\"row\" [fxHide.gt-xs]=\"true\"> <!-- fs-heading -->\n            Refine Search\n          </div>\n\n          <ng-container *ngFor=\"let filterItem of filter.fsConfig.items\">\n            <ng-container\n              *ngTemplateOutlet=\"filterTemplate; context: { localSk: filterItem }\"></ng-container>\n          </ng-container>\n\n          <div class=\"buttons\">\n            <button mat-raised-button color=\"accent\" (click)=\"filterToggle(false,true)\"\n                    class=\"filter-button\">Search\n            </button>\n            <button mat-button color=\"accent\" (click)=\"cancel()\" class=\"cancel-button\">Cancel</button>\n          </div>\n        </div>\n      </div>\n      <div class=\"backdrop\" *ngIf=\"extendedFilter\" (click)=\"filterToggle(false,true)\"></div>\n    </div>\n  </div>\n\n  <div *ngIf=\"filter.fsConfig.inline\" class=\"inline-filter\" [ngClass]=\"{'inline': filter.fsConfig.inline}\">\n    <ng-container *ngFor=\"let filterItem of filter.fsConfig.items\">\n      <ng-container *ngTemplateOutlet=\"filterTemplate; context: { localSk: filterItem }\"></ng-container>\n    </ng-container>\n  </div>\n</div>\n\n<ng-template #filterTemplate let-filterItem=\"localSk\">\n  <div class=\"filter-group\" *ngIf=\"!filterItem.disabled\">\n    <div class=\"filter filter-{{ filterItem.type }}\">\n      <div class=\"filter-label\" *ngIf=\"!filter.fsConfig.inline\">\n        <div class=\"filter-label-content\">\n          {{ filterItem.label }}\n        </div>\n      </div>\n\n      <div class=\"interface\" *ngIf=\"filterItem.type == 'text'\">\n        <mat-form-field [floatLabel]=\"'auto'\">\n          <mat-label>{{filterItem.label}}</mat-label>\n          <input matInput [(ngModel)]=\"filterItem.model\" (keyup)=\"filterKeyup(filterItem,$event)\"\n                 (change)=\"onFilterChange(filterItem, $event)\"/>\n          <mat-placeholder *ngIf=\"filter.fsConfig.inline\">\n            <mat-icon>search</mat-icon>\n            {{ filterItem.label }}\n          </mat-placeholder>\n        </mat-form-field>\n      </div>\n\n      <div class=\"interface\" *ngIf=\"filterItem.type == 'select' && filterItem.values?.length > 0\">\n        <mat-form-field floatLabel=\"auto\" *ngIf=\"filterItem.multiple && !filterItem.groups\">\n          <mat-label>{{filterItem.label}}</mat-label>\n          <mat-select [(ngModel)]=\"filterItem.model\" multiple=\"filterItem.multiple\"\n                      (onClose)=\"selectChange(filterItem)\" (keyup)=\"filterKeyup(filterItem,$event)\">\n            <mat-option *ngFor=\"let item of filterItem.values\" [value]=\"item.value\" [ngStyle]=\"item.style\">\n              {{ item.name }}\n            </mat-option>\n          </mat-select>\n          <mat-placeholder *ngIf=\"filter.fsConfig.inline\">{{ filterItem.label }}</mat-placeholder>\n        </mat-form-field>\n\n        <mat-form-field floatLabel=\"auto\" *ngIf=\"!filterItem.multiple && !filterItem.groups\">\n          <mat-label>{{filterItem.label}}</mat-label>\n          <mat-select [(ngModel)]=\"filterItem.model\" (change)=\"selectChange(filterItem)\"\n                      (keyup)=\"filterKeyup(filterItem,$event)\">\n            <mat-option *ngFor=\"let item of filterItem.values\" [value]=\"item.value\" [ngStyle]=\"item.style\">\n              {{ item.name }}\n            </mat-option>\n          </mat-select>\n          <mat-placeholder *ngIf=\"filter.fsConfig.inline\">{{ filterItem.label }}</mat-placeholder>\n        </mat-form-field>\n\n        <!--<mat-form-field class=\"md-no-float md-no-label md-no-message\" ng-show=\"!filter.multiple && filter.groups\">\n\t\t\t\t\t<mat-select ng-model=\"filter.model\" aria-label=\"select\" ng-change=\"selectChange(filter)\" ng-keyup=\"filterKeyup(filter,$event)\">\n\t\t\t\t\t\t<md-optgroup label=\"{{group}}\" ng-repeat=\"(group, values) in filter.groups\">\n\t\t\t\t\t\t\t<md-option ng-repeat=\"item in values\" value=\"{{::item.value}}\" ng-style=\"item.style\">\n\t\t\t\t\t\t\t\t{{::item.name}}\n\t\t\t\t\t\t\t</md-option>\n\t\t\t\t\t\t</md-optgroup>\n\t\t\t\t\t</mat-select>\n\t\t\t\t</mat-form-field>-->\n\n        <!--<md-input-container class=\"md-no-float md-no-label md-no-message\" ng-show=\"filter.multiple && filter.groups\">\n\t\t\t\t\t<md-select ng-model=\"filter.model\" aria-label=\"select\" multiple=\"filter.multiple\" md-on-close=\"selectChange(filter)\" ng-keyup=\"filterKeyup(filter,$event)\">\n\t\t\t\t\t\t<md-optgroup label=\"{{group}}\" ng-repeat=\"(group, values) in filter.groups\">\n\t\t\t\t\t\t\t<md-option ng-repeat=\"item in values\" value=\"{{::item.value}}\" ng-style=\"item.style\">\n\t\t\t\t\t\t\t\t{{::item.name}}\n\t\t\t\t\t\t\t</md-option>\n\t\t\t\t\t\t</md-optgroup>\n\t\t\t\t\t</md-select>\n\t\t\t\t</md-input-container>-->\n      </div>\n\n      <div class=\"interface interface-range\" *ngIf=\"filterItem.type == 'range'\">\n        <span fxLayout=\"row\">\n          <mat-form-field class=\"filter-range-min\">\n\t\t\t  <input matInput\n               [(ngModel)]=\"filterItem.model.min\"\n               (change)=\"onFilterChange(filterItem)\">\n\t\t\t  <mat-placeholder>\n\t\t\t\t  {{filterItem.placeholder[0]}}\n\t\t\t  </mat-placeholder>\n\t\t\t</mat-form-field>\n\t\t\t<mat-form-field class=\"filter-range-max\">\n\t\t\t  <input matInput\n               [(ngModel)]=\"filterItem.model.max\"\n               (change)=\"onFilterChange(filterItem)\">\n\t\t\t\t<mat-placeholder>\n\t\t\t\t  {{filterItem.placeholder[1]}}\n\t\t\t  \t</mat-placeholder>\n\t\t\t</mat-form-field>\n        </span>\n      </div>\n\n      <div class=\"interface\" *ngIf=\"filterItem.type == 'autocomplete'\">\n\n        <mat-form-field floatLabel=\"auto\">\n          <mat-label>{{filterItem.label}}</mat-label>\n          <input matInput type=\"text\" [(ngModel)]=\"filterItem.model\"\n                 (ngModelChange)=\"onAutocompleteChange(filterItem)\" name=\"{{ filterItem.name }}\"\n                 [matAutocomplete]=\"autocompleteInput\">\n          <mat-autocomplete #autocompleteInput=\"matAutocomplete\" [displayWith]=\"displayAutocomplete\">\n            <mat-option *ngFor=\"let item of filterItem.values$ | async\" [value]=\"item\">{{ item.name }}\n            </mat-option>\n          </mat-autocomplete>\n          <mat-placeholder *ngIf=\"filter.fsConfig.inline\">{{ filterItem.label }}</mat-placeholder>\n        </mat-form-field>\n      </div>\n\n      <div class=\"interface interface-date\" *ngIf=\"filterItem.type == 'date'\">\n        <mat-form-field floatLabel=\"auto\">\n          <mat-label>{{filterItem.label}}</mat-label>\n          <input matInput fsDatepicker [(ngModel)]=\"filterItem.model\" readonly\n                 (change)=\"onFilterChange(filterItem)\" name=\"{{ filterItem.name }}\">\n          <mat-placeholder *ngIf=\"filter.fsConfig.inline\">{{ filterItem.label }}</mat-placeholder>\n        </mat-form-field>\n      </div>\n\n      <div class=\"interface\" *ngIf=\"filterItem.type == 'autocompletechips'\">\n        <mat-form-field floatLabel=\"auto\">\n          <mat-label>{{filterItem.label}}</mat-label>\n          <mat-chip-list #chipList>\n            <mat-chip *ngFor=\"let item of filterItem.model\"\n                      (remove)=\"removeAutucompleteChipItem(filterItem, item)\">\n              {{ item.name }}\n              <mat-icon matChipRemove>cancel</mat-icon>\n            </mat-chip>\n\n            <input #chipsInput matInput [(ngModel)]=\"filterItem.selectedValue\"\n                   (ngModelChange)=\"onAutocompleteChipsChange(filterItem, chipsInput)\" type=\"text\"\n                   name=\"{{ filterItem.name }}\"\n                   [matChipInputFor]=\"chipList\"\n                   [matAutocomplete]=\"autocompleteChipsInput\">\n          </mat-chip-list>\n\n          <mat-autocomplete #autocompleteChipsInput=\"matAutocomplete\" [displayWith]=\"displayAutocomplete\"\n                            (optionSelected)=\"addAutucompleteChipItem(filterItem, $event)\">\n            <mat-option *ngFor=\"let item of filterItem.values$ | async\" [value]=\"item\">{{ item.name }}\n            </mat-option>\n          </mat-autocomplete>\n          <mat-placeholder *ngIf=\"filter.fsConfig.inline\">{{ filterItem.label }}</mat-placeholder>\n        </mat-form-field>\n      </div>\n\n      <div class=\"interface interface-checkbox\" *ngIf=\"filterItem.type == 'checkbox'\">\n        <mat-checkbox (change)=\"onFilterChange(filterItem)\" [(ngModel)]=\"filterItem.model\">\n          {{ filter.fsConfig.inline ? filterItem.label : '' }}\n          <span class=\"checkbox-label\">{{filterItem.label}}</span>\n        </mat-checkbox>\n      </div>\n\n      <!--\n\n\t\t\t<div class=\"interface\" ng-if=\"filter.type == 'autocompletechips'\">\n\n<md-chips-autocomplete-container class=\"md-block\">\n  <md-chips \tng-model=\"filter.model\"\n\t\tmd-autocomplete-snap\n\t\tmd-require-match=\"false\"\n\t\tmd-on-remove=\"filterChange(filter)\"\n\t\tmd-on-add=\"filterChange(filter)\">\n\t  <md-autocomplete\n\t  md-no-cache=\"true\"\n\t  md-items=\"item in filter.values(filter.search, filter)\"\n\t  md-search-text=\"filter.search\"\n\t  md-item-text=\"\"\n\t  md-min-length=\"1\"\n\t  md-require-match\n\t  md-autoselect>\n\t\t  <span md-highlight-text=\"filter.search\">{{item.name}}</span>\n\t  </md-autocomplete>\n\t  <md-chip-template>\n\t\t  <span>\n\t\t\t{{$chip.name}}\n\t\t  </span>\n\t  </md-chip-template>\n  </md-chips>\n</md-chips-autocomplete-container>\n\t\t\t</div>\n\n\t\t\t<div class=\"interface  interface-datetime\" ng-if=\"filter.type == 'datetime'\">\n\t\t\t\t<fs-datetime fs-class=\"md-no-label md-no-message\" fs-time=\"true\" fs-model=\"filter.model\" fs-change=\"filterChange(filter)\"></fs-datetime>\n\t\t\t</div>\n\n\t\t\t<div class=\"interface interface-daterange\" ng-if=\"filter.type == 'daterange'\">\n\t\t\t\t<fs-datetime-range fs-class=\"md-no-label md-no-message\" fs-from=\"filter.model['from']\" fs-to=\"filter.model['to']\" fs-change=\"filterChange(filter)\"></fs-datetime-range>\n\t\t\t</div>\n\n\t\t\t<div class=\"interface interface-datetimerange\" ng-if=\"filter.type == 'datetimerange'\">\n\t\t\t\t<fs-datetime-range fs-class=\"md-no-label md-no-message\" fs-from=\"filter.model['from']\" fs-to=\"filter.model['to']\" fs-change=\"filterChange(filter)\" fs-time=\"true\"></fs-datetime-range>\n\t\t\t</div>\n\n\t\t</div>\n\t  -->\n    </div>\n\n    <div *ngIf=\"filterItem.isolate && !filter.fsConfig.inline\" class=\"filter isolate\">\n      <div class=\"filter-label\">{{ filterItem.isolate.label }}</div>\n      <div class=\"interface\">\n        <mat-checkbox (change)=\"isolateChange(filterItem)\" [(ngModel)]=\"filterItem.isolate.enabled\">\n          <span class=\"checkbox-label\">{{filterItem.label}}</span>\n        </mat-checkbox>\n      </div>\n    </div>\n  </div>\n</ng-template>\n"

/***/ }),

/***/ "../src/components/fsfilter/fsfilter.component.scss":
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__("../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../node_modules/resolve-url-loader/index.js?{\"sourceMap\":true}!../node_modules/sass-loader/lib/loader.js?{\"sourceMap\":true}!../src/components/fsfilter/fsfilter.component.scss");

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),

/***/ "../src/components/fsfilter/fsfilter.component.ts":
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
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
var lodash_1 = __webpack_require__("../node_modules/lodash/lodash.js");
var util_1 = __webpack_require__("../node_modules/@firestitch/common/util/index.js");
var array_1 = __webpack_require__("../node_modules/@firestitch/common/array/index.js");
var store_1 = __webpack_require__("../node_modules/@firestitch/store/store.umd.js");
var classes_1 = __webpack_require__("../src/classes/index.ts");
var Observable_1 = __webpack_require__("../node_modules/rxjs/Observable.js");
var router_1 = __webpack_require__("../node_modules/@angular/router/esm2015/router.js");
__webpack_require__("../node_modules/rxjs/add/observable/forkJoin.js");
var moment_timezone_1 = __webpack_require__("../node_modules/moment-timezone/index.js");
var common_1 = __webpack_require__("../node_modules/@angular/common/esm2015/common.js");
var FsFilterComponent = (function () {
    function FsFilterComponent(_store, route, location) {
        this._store = _store;
        this.route = route;
        this.location = location;
        this.filter = null;
        this.searchinput = { value: '' };
        this.extendedFilter = false;
        this.filterChange = false;
        this.primary = false;
        this.persists = null;
    }
    FsFilterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.persists = this._store.get(this.filter.fsConfig.namespace + '-persist', {});
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
            if (!this.persists[this.filter.fsConfig.persist.name] || !this.persists[this.filter.fsConfig.persist.name].data) {
                this.persists[this.filter.fsConfig.persist.name] = { data: {}, date: new Date() };
            }
            if (this.filter.fsConfig.persist.timeout) {
                var date = new Date(this.persists[this.filter.fsConfig.persist.name].date);
                if (moment_timezone_1.default(date).subtract(this.filter.fsConfig.persist.timeout, 'minutes').isAfter(moment_timezone_1.default())) {
                    this.persists[this.filter.fsConfig.persist.name] = { data: {}, date: new Date() };
                }
            }
        }
        // preload any filters which have filter.wait.
        // Once they are all loaded then proceed to load main data & rest of filters.
        var waitObservables$ = [], updateObservables$ = [];
        for (var _i = 0, _a = this.filter.fsConfig.items; _i < _a.length; _i++) {
            var filter = _a[_i];
            if (filter.name && lodash_1.isObject(filter.name)) {
                filter.names = filter.name;
                filter.name = Object.keys(filter.names).join('-');
            }
            if (this.filter.fsConfig.persist) {
                var persisted = this.persists[this.filter.fsConfig.persist.name].data;
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
                waitObservables$.push(observable$);
            }
            else {
                updateObservables$.push(observable$);
            }
        }
        Observable_1.Observable.forkJoin(waitObservables$)
            .subscribe(function () {
        }, function () {
        }, function () {
            if (_this.filter.fsConfig.load) {
                _this.reload({ filterUpdate: false });
            }
            Observable_1.Observable.forkJoin(updateObservables$)
                .subscribe(function () {
            }, function () {
            }, function () {
                if (_this.filter.fsConfig.init) {
                    _this.filter.fsConfig.init(_this);
                }
                _this.filterUpdate();
            });
        });
        console.log(this.filter.fsConfig.items);
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
            var filterMatch = match.trim().match(/\(?([^:\)]+)\)?:\(?([^)]+)/);
            if (filterMatch) {
                values[filterMatch[1].trim()] = filterMatch[2];
            }
            else {
                textSearch.push(match);
            }
        }
        this.filtersClear();
        for (var _c = 0, _d = this.filter.fsConfig.items; _c < _d.length; _c++) {
            var filter = _d[_c];
            if (filter.type == 'text' && filter.primary) {
                filter.model = textSearch.join(' ');
            }
        }
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
                        var modelValues = [];
                        for (var _e = 0, _f = modelValues[label].split(','); _e < _f.length; _e++) {
                            var value = _f[_e];
                            var item = array_1.filter(filter.values, { name: value })[0];
                            if (item) {
                                modelValues.push(item.value);
                            }
                        }
                        filter.model = modelValues;
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
        if (opts.filterUpdate !== false) {
            this.filterUpdate();
        }
        var query = this.gets({ flatten: true });
        if (this.filter.fsConfig.persist) {
            this.persists[this.filter.fsConfig.persist.name] = {
                data: this.gets({ expand: true, names: false }),
                date: new Date()
            };
            this._store.set(this.filter.fsConfig.namespace + '-persist', this.persists, {});
        }
        if (this.filter.fsConfig.change) {
            this.filter.fsConfig.change(query, this);
        }
    };
    FsFilterComponent.prototype.filterToggle = function (value, search) {
        this.extendedFilter = value;
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
        var label, formatted;
        var searches = [];
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
                            var filterItem = _d[_c];
                            if (!String(filterItem.value).localeCompare(String(item))) {
                                values.push(filterItem.name);
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
                        var filterItem = _f[_e];
                        if (!String(filterItem.value).localeCompare(String(value))) {
                            value = filterItem.name;
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
                var min = value.min;
                var max = value.max;
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
            searches.push({
                value: value,
                type: filter.type,
                formatted: formatted
            });
        }
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
                        if (filter.values.hasOwnProperty(index)) {
                            if (!filter.values[index]) {
                                continue;
                            }
                            if (filter.values[index].value == filter.isolate.value) {
                                filter.values.splice(index, 1);
                            }
                        }
                    }
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
            if (filterValues.hasOwnProperty(key)) {
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
        }
        return values;
    };
    FsFilterComponent.prototype.walkSelectNestedValues = function (filter, parentId, values, depth) {
        if (depth === void 0) { depth = 0; }
        var preppedValues = [];
        var valueField = filter.nested.value_field || 'id';
        var parentField = filter.nested.parent_field || 'parent_id';
        var nameField = filter.nested.label_field || 'name';
        for (var key in values) {
            if (values.hasOwnProperty(key)) {
                if (!values[key]) {
                    continue;
                }
                if (values[key][parentField] != parentId) {
                    continue;
                }
                var value = {
                    value: values[key][valueField],
                    name: values[key][nameField],
                    depth: depth,
                    style: { 'margin-left': (depth * 16) + 'px' }
                };
                preppedValues.push(value);
                var children = this.walkSelectNestedValues(filter, values[key][valueField], values, depth + 1);
                if (children.length > 0) {
                    Array.prototype.push.apply(preppedValues, children);
                }
            }
        }
        return preppedValues;
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
            // TODO
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
                if (lodash_1.isArray(filter.model) && filter.model.length && !opts.expand) {
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
                var from = value.from;
                var to = value.to;
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
                value = opts.expand ? filter.model : filter.model.value;
            }
            if (lodash_1.isObject(filter.names) && opts.names !== false) {
                for (var key in filter.names) {
                    if (value[filter.names[key]]) {
                        query[key] = value[filter.names[key]];
                    }
                }
            }
            else {
                query[filter.name] = value;
            }
        }
        if (opts.flatten) {
            for (var name_1 in query) {
                if (lodash_1.isArray(query[name_1])) {
                    query[name_1] = query[name_1].join(',');
                }
            }
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
    FsFilterComponent.prototype.ngOnDestroy = function () {
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", classes_1.FsFilter)
    ], FsFilterComponent.prototype, "filter", void 0);
    FsFilterComponent = __decorate([
        core_1.Component({
            selector: 'fs-filter',
            template: __webpack_require__("../src/components/fsfilter/fsfilter.component.html"),
            styles: [__webpack_require__("../src/components/fsfilter/fsfilter.component.scss")],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [store_1.FsStore, router_1.ActivatedRoute, common_1.Location])
    ], FsFilterComponent);
    return FsFilterComponent;
}());
exports.FsFilterComponent = FsFilterComponent;


/***/ }),

/***/ "../src/index.ts":
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
var common_1 = __webpack_require__("../node_modules/@angular/common/esm2015/common.js");
var forms_1 = __webpack_require__("../node_modules/@angular/forms/esm2015/forms.js");
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
var material_1 = __webpack_require__("../node_modules/@angular/material/esm2015/material.js");
var material_2 = __webpack_require__("../node_modules/@angular/material/esm2015/material.js");
var datepicker_1 = __webpack_require__("../node_modules/@firestitch/datepicker/index.js");
var common_2 = __webpack_require__("../node_modules/@firestitch/common/index.js");
var store_1 = __webpack_require__("../node_modules/@firestitch/store/store.umd.js");
var fsfilter_component_1 = __webpack_require__("../src/components/fsfilter/fsfilter.component.ts");
var flex_layout_1 = __webpack_require__("../node_modules/@angular/flex-layout/esm2015/flex-layout.js");
var fsfilter_class_1 = __webpack_require__("../src/classes/fsfilter.class.ts");
__export(__webpack_require__("../src/classes/index.ts"));
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

/***/ "../tools lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../tools lazy recursive";

/***/ }),

/***/ "../tools/assets/playground.scss":
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ "../tools/components/examples/examples.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"example-title\">{{title}}</div>\n<mat-tab-group>\n  <mat-tab label=\"Examples\">\n      <div class=\"examples-body\">\n        <ng-content></ng-content>\n      </div>\n  </mat-tab>\n  <mat-tab label=\"Docs\" *ngIf=\"loaded\">\n    <div class=\"iframe-container\">\n      <iframe class=\"iframe-example ng-star-inserted\" [src]=\"submoduleUrl\"></iframe>\n    </div>\n  </mat-tab>\n</mat-tab-group>\n"

/***/ }),

/***/ "../tools/components/examples/examples.component.ts":
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
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
var platform_browser_1 = __webpack_require__("../node_modules/@angular/platform-browser/esm2015/platform-browser.js");
var FsExamplesComponent = (function () {
    function FsExamplesComponent(sanitizer) {
        this.sanitizer = sanitizer;
        this.loaded = false;
    }
    FsExamplesComponent.prototype.ngOnInit = function () {
        this._submoduleUrl = this.sanitizer
            .bypassSecurityTrustResourceUrl("https://" + this.submoduleName + ".components.firestitch.com/docs");
        this.loaded = true;
    };
    Object.defineProperty(FsExamplesComponent.prototype, "submoduleUrl", {
        get: function () {
            return this._submoduleUrl;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], FsExamplesComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input('name'),
        __metadata("design:type", String)
    ], FsExamplesComponent.prototype, "submoduleName", void 0);
    FsExamplesComponent = __decorate([
        core_1.Component({
            selector: 'fs-examples',
            template: __webpack_require__("../tools/components/examples/examples.component.html")
        }),
        __metadata("design:paramtypes", [platform_browser_1.DomSanitizer])
    ], FsExamplesComponent);
    return FsExamplesComponent;
}());
exports.FsExamplesComponent = FsExamplesComponent;


/***/ }),

/***/ "./app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<fs-examples title=\"Filter Component\">\n    <fs-example title=\"First Example\" componentName=\"first-example\">\n        <first-example></first-example>\n    </fs-example>\n</fs-examples>\n"

/***/ }),

/***/ "./app/app.component.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            template: __webpack_require__("./app/app.component.html")
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;


/***/ }),

/***/ "./app/components/first-example/first-example.component.css":
/***/ (function(module, exports, __webpack_require__) {


        var result = __webpack_require__("../node_modules/css-loader/index.js?{\"sourceMap\":true}!../node_modules/postcss-loader/lib/index.js?{\"sourceMap\":true}!../node_modules/resolve-url-loader/index.js?{\"sourceMap\":true}!./app/components/first-example/first-example.component.css");

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),

/***/ "./app/components/first-example/first-example.component.html":
/***/ (function(module, exports) {

module.exports = "<fs-filter [(filter)]=\"filter\"></fs-filter>\n"

/***/ }),

/***/ "./app/components/first-example/first-example.component.ts":
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
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
var BehaviorSubject_1 = __webpack_require__("../node_modules/rxjs/BehaviorSubject.js");
var src_1 = __webpack_require__("../src/index.ts");
var common_1 = __webpack_require__("../node_modules/@firestitch/common/index.js");
__webpack_require__("../node_modules/rxjs/add/operator/map.js");
var FirstExampleComponent = (function () {
    function FirstExampleComponent(fsArray) {
        var _this = this;
        this.fsArray = fsArray;
        this.filter = new src_1.FsFilter();
        this.users = [
            { id: 1, name: 'John Doe' },
            { id: 2, name: 'Jane Doe' },
            { id: 3, name: 'Bob Tom' }
        ];
        this.filter.fsConfig = {
            persist: 'filter',
            inline: false,
            items: [
                {
                    name: 'keyword',
                    type: 'text',
                    label: 'Search',
                    query: 'keyword'
                },
                {
                    name: 'simple_select',
                    type: 'select',
                    label: 'Simple Select',
                    values: function () {
                        return [
                            { name: 'All', value: '__all' },
                            { name: 'Option 1', value: 1 },
                            { name: 'Option 2', value: 2 },
                            { name: 'Option 3', value: 3 }
                        ];
                    }
                },
                {
                    name: 'range',
                    type: 'range',
                    label: 'Range',
                    placeholder: ['Min', 'Max']
                },
                {
                    name: 'simple_select',
                    type: 'select',
                    label: 'Observable Select',
                    values: function () {
                        return new BehaviorSubject_1.BehaviorSubject(_this.users)
                            .map(function (users) { return _this.fsArray.nameValue(users, 'name', 'id'); });
                    }
                },
                {
                    name: 'autocomplete_user_id',
                    label: 'Autocomplete User',
                    type: 'autocomplete',
                    values: function (keyword) {
                        return new BehaviorSubject_1.BehaviorSubject(_this.users)
                            .map(function (users) { return _this.fsArray.filter(users, function (user) {
                            return user.name.toLowerCase().match(new RegExp("" + keyword));
                        }); })
                            .map(function (users) { return _this.fsArray.nameValue(users, 'name', 'id'); });
                    }
                },
                {
                    name: 'autocompletechips_user_id',
                    label: 'Autocomplete Chips User',
                    type: 'autocompletechips',
                    values: function (keyword) {
                        return new BehaviorSubject_1.BehaviorSubject(_this.users)
                            .map(function (users) { return _this.fsArray.filter(users, function (user) {
                            return user.name.toLowerCase().match(new RegExp("" + keyword));
                        }); })
                            .map(function (users) { return _this.fsArray.nameValue(users, 'name', 'id'); });
                    }
                },
                {
                    name: 'date',
                    type: 'date',
                    label: 'Date'
                },
                {
                    name: 'checkbox',
                    type: 'checkbox',
                    label: 'Checkbox'
                },
                {
                    name: 'state',
                    type: 'select',
                    label: 'Status',
                    multiple: true,
                    values: [
                        { name: 'Active', value: 'active' },
                        { name: 'Pending', value: 'pending' },
                        { name: 'Deleted', value: 'deleted' }
                    ],
                    isolate: { label: 'Show Deleted', value: 'deleted' }
                }
            ],
            init: function (instance) {
                console.log('Init', instance.gets({ flatten: true }));
            },
            change: function (query, instance) {
                console.log('Change', query);
            }
        };
    }
    FirstExampleComponent = __decorate([
        core_1.Component({
            selector: 'first-example',
            template: __webpack_require__("./app/components/first-example/first-example.component.html"),
            styles: [__webpack_require__("./app/components/first-example/first-example.component.css")]
        }),
        __metadata("design:paramtypes", [common_1.FsArray])
    ], FirstExampleComponent);
    return FirstExampleComponent;
}());
exports.FirstExampleComponent = FirstExampleComponent;


/***/ }),

/***/ "./app/material.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var material_1 = __webpack_require__("../node_modules/@angular/material/esm2015/material.js");
//import { FlexLayoutModule } from '@angular/flex-layout';
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
var table_1 = __webpack_require__("../node_modules/@angular/cdk/esm2015/table.js");
var AppMaterialModule = (function () {
    function AppMaterialModule() {
    }
    AppMaterialModule = __decorate([
        core_1.NgModule({
            exports: [
                table_1.CdkTableModule,
                material_1.MatAutocompleteModule,
                material_1.MatButtonModule,
                material_1.MatButtonToggleModule,
                material_1.MatCardModule,
                material_1.MatCheckboxModule,
                material_1.MatChipsModule,
                material_1.MatStepperModule,
                material_1.MatDatepickerModule,
                material_1.MatDialogModule,
                material_1.MatExpansionModule,
                material_1.MatGridListModule,
                material_1.MatIconModule,
                material_1.MatInputModule,
                material_1.MatListModule,
                material_1.MatMenuModule,
                material_1.MatNativeDateModule,
                material_1.MatPaginatorModule,
                material_1.MatProgressBarModule,
                material_1.MatProgressSpinnerModule,
                material_1.MatRadioModule,
                material_1.MatRippleModule,
                material_1.MatSelectModule,
                material_1.MatSidenavModule,
                material_1.MatSliderModule,
                material_1.MatSlideToggleModule,
                material_1.MatSnackBarModule,
                material_1.MatSortModule,
                material_1.MatTableModule,
                material_1.MatTabsModule,
                material_1.MatToolbarModule,
                material_1.MatTooltipModule,
            ]
        })
    ], AppMaterialModule);
    return AppMaterialModule;
}());
exports.AppMaterialModule = AppMaterialModule;


/***/ }),

/***/ "./main.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var playground_module_1 = __webpack_require__("./playground.module.ts");
var platform_browser_dynamic_1 = __webpack_require__("../node_modules/@angular/platform-browser-dynamic/esm2015/platform-browser-dynamic.js");
var platform_browser_1 = __webpack_require__("../node_modules/@angular/platform-browser/esm2015/platform-browser.js");
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
/**
 * Bootstrap our Angular app with a top level NgModule
 */
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic()
        .bootstrapModule(playground_module_1.PlaygroundModule)
        .then(decorateModuleRef)
        .catch(function (err) { return console.error(err); });
}
exports.main = main;
/**
 * Needed for hmr
 * in prod this is replace for document ready
 */
switch (document.readyState) {
    case 'loading':
        document.addEventListener('DOMContentLoaded', _domReadyHandler, false);
        break;
    case 'interactive':
    case 'complete':
    default:
        main();
}
function _domReadyHandler() {
    document.removeEventListener('DOMContentLoaded', _domReadyHandler, false);
    main();
}
function decorateModuleRef(modRef) {
    var appRef = modRef.injector.get(core_1.ApplicationRef);
    var cmpRef = appRef.components[0];
    var _ng = window.ng;
    platform_browser_1.enableDebugTools(cmpRef);
    window.ng.probe = _ng.probe;
    window.ng.coreTokens = _ng.coreTokens;
    return modRef;
}


/***/ }),

/***/ "./playground.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__("../tools/assets/playground.scss");
var core_1 = __webpack_require__("../node_modules/@angular/core/esm2015/core.js");
var forms_1 = __webpack_require__("../node_modules/@angular/forms/esm2015/forms.js");
var app_component_1 = __webpack_require__("./app/app.component.ts");
var platform_browser_1 = __webpack_require__("../node_modules/@angular/platform-browser/esm2015/platform-browser.js");
var src_1 = __webpack_require__("../src/index.ts");
var animations_1 = __webpack_require__("../node_modules/@angular/platform-browser/esm2015/animations.js");
var material_module_1 = __webpack_require__("./app/material.module.ts");
var router_1 = __webpack_require__("../node_modules/@angular/router/esm2015/router.js");
var example_1 = __webpack_require__("../node_modules/@firestitch/example/package/index.js");
var examples_component_1 = __webpack_require__("../tools/components/examples/examples.component.ts");
var first_example_component_1 = __webpack_require__("./app/components/first-example/first-example.component.ts");
var PlaygroundModule = (function () {
    function PlaygroundModule() {
    }
    PlaygroundModule = __decorate([
        core_1.NgModule({
            bootstrap: [app_component_1.AppComponent],
            imports: [
                platform_browser_1.BrowserModule,
                src_1.FsFilterModule,
                animations_1.BrowserAnimationsModule,
                material_module_1.AppMaterialModule,
                forms_1.FormsModule,
                example_1.FsExampleModule,
                router_1.RouterModule.forRoot([
                    { path: '', component: app_component_1.AppComponent }
                ])
            ],
            entryComponents: [],
            declarations: [
                app_component_1.AppComponent,
                examples_component_1.FsExamplesComponent,
                first_example_component_1.FirstExampleComponent
            ],
            providers: [],
        })
    ], PlaygroundModule);
    return PlaygroundModule;
}());
exports.PlaygroundModule = PlaygroundModule;


/***/ })

},["./main.ts"]);
//# sourceMappingURL=main.map