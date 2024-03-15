import { 
  Component,
  ContentChildren,
  QueryList,
  ViewContainerRef,
  ViewChild,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input
} from '@angular/core';
import { TabItemComponent } from '../tab-item/tab-item.component';

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.css']
})
export class TabGroupComponent {
  @ContentChildren(TabItemComponent) tabList: QueryList<TabItemComponent>
  @ViewChild('containerRef', { read: ViewContainerRef }) containerRef: ViewContainerRef;
  @Output() closeTab = new EventEmitter<number>();
  // Array data for tab.
  @Input('data') dataSource: unknown[];

  constructor( private changeDetector: ChangeDetectorRef ){}

  ngOnInit(): void {}

  tabChange(tab:TabItemComponent, index: number){
    this.tabList.forEach((item, i) => {
      item.selected = false;
      if(i === index){
        item.selected = true;
      }
    })
    this.createTabView(tab);
  }

  removeTab(event: PointerEvent, index: number){
    event.stopPropagation();
    // Remove item in localstorage. If you comment the code line below, the TAB will still be removed normally on the UI when clicking the delete icon. 
    // The purpose of the line of code below is to remove the zip code from the locale
    this.closeTab.emit(index);
    // Remove item in data source.
    this.dataSource.splice(index, 1);
    setTimeout(() => {
      if(this.tabList.length){
        const arrSeletecTab = this.tabList.filter(tab => tab.selected);
        if(!arrSeletecTab.length){
          this.tabList.first.selected = true;
          this.createTabView(this.tabList.first);
        }
      }
    });
  }

  createTabView(tab: TabItemComponent) {
    this.containerRef?.clear();
    if(tab) {
      this.containerRef.createEmbeddedView(tab.templateRef);
      this.changeDetector.detectChanges();
    }
  }

  initialTab(){
    if(this.tabList.length){
      const arrSeletecTab = this.tabList.filter(tab => tab.selected);
      if(!arrSeletecTab.length){
        this.tabList.first.selected = true;
        this.createTabView(this.tabList.first);
      }
    }
  }

  ngAfterContentInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initialTab();
    });
  }

  ngOnDestroy(): void {
    
  }

}
