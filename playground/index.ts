import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FsFilterModule, FsFilter }  from '@firestitch/filter';
import { FsArray }  from '@firestitch/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'template.html',
  styleUrls: [ 'styles.css' ],
  encapsulation: ViewEncapsulation.None
})
class AppComponent {
  filter = new FsFilter();
  
    users = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'Bob Tom' }
    ];
  
  constructor(private fsArray: FsArray) { 
    this.filter.fsConfig = {
      persist: 'filter',
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
          values: () => {
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
          values: () => {
            return new BehaviorSubject(this.users)
            .map(users => this.fsArray.nameValue(users, 'name', 'id'));
          }
        },
        {
          name: 'autocomplete_user_id',
          label: 'Autocomplete User',
          type: 'autocomplete',
          values: (keyword) => {
            return new BehaviorSubject(this.users)
            .map(users => this.fsArray.filter(users, (user) => {
              return user.name.toLowerCase().match(new RegExp(`${ keyword }`));
            }))
            .map(users => this.fsArray.nameValue(users, 'name', 'id'));
          }
        },
        {
          name: 'autocompletechips_user_id',
          label: 'Autocomplete Chips User',
          type: 'autocompletechips',
          values: (keyword) => {
            return new BehaviorSubject(this.users)
            .map(users => this.fsArray.filter(users, (user) => {
              return user.name.toLowerCase().match(new RegExp(`${ keyword }`));
            }))
            .map(users => this.fsArray.nameValue(users, 'name', 'id'));
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
      init: (instance) => {
        console.log('Init', instance.gets({ flatten: true }));
      },
      change: (query, instance) => {
        console.log('Change', query);
      }
    };  
  
  

  }
  
  

  ngOnInit() {  
  }
}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [  BrowserModule,
              FsFilterModule,
              BrowserAnimationsModule,
              RouterModule.forRoot([]) ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
