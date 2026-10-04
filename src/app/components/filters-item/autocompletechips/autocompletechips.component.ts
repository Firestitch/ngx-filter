import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPseudoCheckbox } from '@angular/material/core';

import { FsAutocompleteChipsComponent, FsAutocompleteChipsModule } from '@firestitch/autocomplete-chips';
import { FsFormModule } from '@firestitch/form';

import { filter, Observable, tap } from 'rxjs';

import { FocusToItemDirective } from '../../../directives/focus-to-item.directive';
import { AutocompleteChipsItem } from '../../../models/items/autocomplete-chips-item';
import { FilterComponent } from '../../filter/filter.component';
import { BaseItemComponent } from '../base-item/base-item.component';


@Component({
  selector: 'filter-item-autocompletechips',
  templateUrl: './autocompletechips.component.html',
  styleUrls: ['./autocompletechips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsAutocompleteChipsModule,
    FocusToItemDirective,
    FormsModule,
    FsFormModule,
    MatPseudoCheckbox,
  ],
})
export class AutocompletechipsComponent 
  extends BaseItemComponent<AutocompleteChipsItem> 
  implements OnInit, AfterViewInit {

  @ViewChild(FsAutocompleteChipsComponent)
  public autocompleteChips: FsAutocompleteChipsComponent;

  @ViewChild('panelNoteRow')
  public panelNoteRow: TemplateRef<unknown>;

  @Input() public autofocus: boolean = false;
  @Input() public floatLabel: 'auto' | 'always' = 'auto';

  // The panel note's row reads these: shown while the note has text, never pickable.
  public showPanelNote = (): boolean => !!this.item.panelNote?.();
  public disablePanelNote = (): boolean => true;
  
  private _injector = inject(Injector);

  public ngAfterViewInit(): void {
    if(this.item.excludable) {
      this._listenExcludeToggle();
    }
  }

  public panelClosed() {
    this.item.setSelected(this.value);
  }

  /**
   * A single select is done as soon as something is picked, so apply it and close the
   * popup the way the single autocomplete filter does. A clear arrives here as a null —
   * closing on that would eject the user before they can type a replacement.
   *
   * A multi select keeps collecting, so it waits for the panel to close instead.
   */
  public modelChange() {
    if(this.item.multiple) {
      return;
    }

    this.item.setSelected(this.value);

    if(this.value) {
      this.close();
    }
  }

  public removed() {
    if(!this.autocompleteChips.panelOpen) {
      this.item.setSelected(this.value);
    }
  }

  public clear() {
    this.item.clear();
    this.close();
  }

  public fetch = (keyword): Observable<any> => {
    const values$ = this.item.valuesFn(keyword, this.item.filter) as Observable<any>;

    return this.item.panelNote ? values$.pipe(tap(() => this._updatePanelNote())) : values$;
  };

  public compareItems(item1, item2): boolean {
    return item1?.value === item2?.value;
  }

  public actionClick(action: any) {
    const filterComponent = this._injector.get(FilterComponent);
    action.click(filterComponent);
  }

  /**
   * Applies the picks in the list along with the new mode. The list closes on the click,
   * and panelClosed then finds nothing left to apply.
   */
  public toggleExclude() {
    this.item.setExclude(!this.item.exclude, this.value);
  }

  /**
   * The exclude row is a static option with no value, so the list itself ignores its
   * selection. A click and Enter on the active row both select it, and both land here.
   */
  private _listenExcludeToggle(): void {
    this.autocompleteChips.autocomplete.optionSelected
      .pipe(
        filter((event: MatAutocompleteSelectedEvent) => {
          return !!event.option._getHostElement().querySelector('.exclude-toggle');
        }),
        tap(() => this.toggleExclude()),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe();
  }

  /**
   * The list decides whether a row shows only on open and on each keystroke, before the
   * options arrive, so a note that depends on them (a cut-off list) is read again here.
   * The library has no hook for this, so the row's public isShow is set directly. This
   * runs inside fetch, before the list takes the options and marks itself for check
   * (autocomplete-chips 18.0.x, _listenFetch), so that check renders it.
   */
  private _updatePanelNote() {
    const row = this.autocompleteChips?.staticDirectives
      ?.find((staticDirective) => staticDirective.templateRef === this.panelNoteRow);

    if(row) {
      row.isShow = this.showPanelNote();
    }
  }
}
