import { Component, ViewChild, TemplateRef, Input } from '@angular/core';

@Component({
  selector: 'app-tab-item',
  templateUrl: './tab-item.component.html',
  styleUrls: ['./tab-item.component.css']
})
export class TabItemComponent {
  @Input() label: string;
  @Input() selected: boolean;

  @ViewChild('tabTemplate', { static: true }) templateRef: TemplateRef<unknown>;
}
