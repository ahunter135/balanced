import { Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-form-item',
  templateUrl: './form-item.component.html',
  styleUrls: ['./form-item.component.scss'],
  animations: [
    trigger('icon', [
      state('focused', style({color: '#00eabb'})),
      state('blurred', style({color: 'black'})),
      transition('focused <=> blurred', [
        animate('0.1s'),
      ]),
    ]),
  ],
})
export class FormItemComponent  implements OnInit {
  @Input() label: string;
  @Input() model: any;
  @Input() property: string;
  @Input() iconName: string;
  @Input() type?: string = 'text';
  @Input() placeholder?: string;

  isFocused: boolean = false;

  constructor() { }

  ngOnInit() {}

}
