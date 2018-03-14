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
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var core_1 = require("@angular/core");
var material_1 = require("@angular/material");
var material_2 = require("@angular/material");
var datepicker_1 = require("@firestitch/datepicker");
var common_2 = require("@firestitch/common");
var store_1 = require("@firestitch/store");
var fsfilter_component_1 = require("./components/fsfilter/fsfilter.component");
var flex_layout_1 = require("@angular/flex-layout");
var fsfilter_class_1 = require("./classes/fsfilter.class");
__export(require("./classes"));
var ɵ0 = { float: 'never' };
exports.ɵ0 = ɵ0;
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
                router_1.RouterModule,
                forms_1.FormsModule,
                common_2.FsCommonModule,
                store_1.FsStoreModule,
                datepicker_1.FsDatePickerModule,
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
                { provide: material_1.MAT_PLACEHOLDER_GLOBAL_OPTIONS, useValue: ɵ0 }
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
//# sourceMappingURL=fs-filter.module.js.map