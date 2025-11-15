import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Injector, OnInit, StaticProvider } from '@angular/core';

import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { FsChipModule } from '@firestitch/chip';

import { fromEvent } from 'rxjs';

import { ItemType } from '../../enums';
import { FILTER_DRAWER_DATA } from '../../injectors';
import { IFilterConfigItem } from '../../interfaces';
import { BaseItem } from '../../models/items/base-item';
import { FilterController } from '../../services/filter-controller.service';
import { FilterItemDialogComponent } from '../filter-item-dialog';


@Component({
  selector: 'fs-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    AsyncPipe,
    FsChipModule,
    JsonPipe,
    MatIcon,
    MatButtonModule,
  ],
})
export class FsFilterChipsComponent implements OnInit {

  public ItemType = ItemType;

  private _filterController = inject(FilterController);
  private _injector = inject(Injector);
  private _overlay = inject(Overlay);
  private _overlayRef: OverlayRef;

  public get items() {
    return this._filterController.items
      .filter((item) => !item.isTypeKeyword);
  }

  public ngOnInit(): void {
    fromEvent(document, 'click')
      .subscribe((event: MouseEvent) => {
        const elements = document.elementsFromPoint(event.clientX, event.clientY);
        
        const item1 = elements.some((element) => {
          return !!this.getNestedElement(element, 'cdk-overlay-pane');
        });

        const item2 = elements.some((element) => {
          return !!this.getNestedElement(element, 'filter-chip');
        });

        if(!item1 && !item2) {
          this._destroyOverlay();
        }
      });
  }

  public clear() {
    this.items
      .filter((item) => item.clearable)
      .forEach((item) => {
        item.clear(false);
      });

    this._filterController.change();
  }

  public click(item: BaseItem<IFilterConfigItem>, name: string, el: any) {
    this._destroyOverlay();
    el = this.getNestedElement(el, 'filter-chip');

    const positions: ConnectedPosition[] = [
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'top',
        offsetX: 0,
        offsetY: el.offsetHeight + 2,
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
      },
    ];

    const strategy = this._overlay
      .position()
      .flexibleConnectedTo(el)
      .withPositions(positions);
    
    const overlayConfig = new OverlayConfig({
      positionStrategy: strategy,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      disposeOnNavigation: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      panelClass: 'fs-sidenav-menu-overlay-pane',
    });

    if(this._overlayRef) {
      this._destroyOverlay();
    }

    this._overlayRef = this._overlay.create(overlayConfig);
    this._attachContainer(this._overlayRef, item, name);
  }

  public getNestedElement(el: any, className: string) {
    if(el) {
      if(el.classList.contains(className)) {
        return el;
      }

      return this.getNestedElement(el.parentElement, className);
    }

    return null;
  }

  public _destroyOverlay() {
    if(this._overlayRef) {
      this._overlayRef.detachBackdrop();
      this._overlayRef.detach();
      this._overlayRef.dispose();
    }
  }

  public remove(
    item: BaseItem<IFilterConfigItem>, 
    chip: { name?: string, value: string, label: string },
  ) {
    if(chip.name) {
      item.clearByName(chip.name);
    } else {
      item.clear();
    }
  }

  private _attachContainer(overlayRef: OverlayRef, item: BaseItem<IFilterConfigItem>, name: string) {
    const injector = this._createInjector(item, name);
    const containerPortal = new ComponentPortal(FilterItemDialogComponent, undefined, injector);
    const containerRef = overlayRef.attach<FilterItemDialogComponent>(containerPortal);

    return containerRef.instance;
  }

  private _createInjector(item: BaseItem<IFilterConfigItem>, name: string): Injector {
    const providers: StaticProvider[] = [
      { provide: FILTER_DRAWER_DATA, useValue: { item, name } },
    ];
  
    return Injector.create({
      providers,
      parent: this._injector,
    });
  }


}
