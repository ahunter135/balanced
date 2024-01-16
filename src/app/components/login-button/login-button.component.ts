import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.scss'],
})
export class LoginButtonComponent  implements OnInit {
  @Input() text: string;
  @Output() buttonClick = new EventEmitter();

  constructor() { }

  ngOnInit() {}

}
