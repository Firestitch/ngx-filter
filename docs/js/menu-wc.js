'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Application documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/FsFilterModule.html" data-type="entity-link">FsFilterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-FsFilterModule-08f697124c9b95351678e079e1f35280"' : 'data-target="#xs-components-links-module-FsFilterModule-08f697124c9b95351678e079e1f35280"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-FsFilterModule-08f697124c9b95351678e079e1f35280"' :
                                            'id="xs-components-links-module-FsFilterModule-08f697124c9b95351678e079e1f35280"' }>
                                            <li class="link">
                                                <a href="components/AutocompleteComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AutocompleteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AutocompletechipsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AutocompletechipsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BaseItemComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BaseItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CheckboxComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CheckboxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FilterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FilterItemComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterItemComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FiltersListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FiltersListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RangeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RangeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SelectComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SelectComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TextComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TextComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/FilterConfig.html" data-type="entity-link">FilterConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FilterConfigItem.html" data-type="entity-link">FilterConfigItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFilterConfigItem.html" data-type="entity-link">IFilterConfigItem</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});