import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent implements OnInit {
  @Input() text: string;
  @Output() type = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  sendText(text: string) {
    this.type.emit(text);
  }
}
