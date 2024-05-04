import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { TaskPriority } from '../../../../models/enums/task-priority.enum';
import { ITask } from '../../../../models/interfaces/task.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css',
})
export class TaskFormComponent implements OnChanges {
  @Output() formSubmitted = new EventEmitter<ITask>();
  @Input() initialFormValues: ITask = {
    title: '',
    description: '',
    dueDate: '',
    priority: TaskPriority.NORMAL,
  };

  today: string;
  taskPriority = TaskPriority;
  taskForm!: FormGroup;

  constructor() {
    this.today = this.getFormattedDate(new Date());
    this.initialFormValues.dueDate = this.today;
    this.initForm(this.initialFormValues);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes[`initialFormValues`] &&
      changes[`initialFormValues`].currentValue
    ) {
      this.initForm(changes[`initialFormValues`].currentValue);
    }
  }

  initForm(initValues: ITask): void {
    this.taskForm = new FormGroup({
      id: new FormControl(initValues.id),
      title: new FormControl(initValues.title, [Validators.required]),
      description: new FormControl(initValues.description),
      dueDate: new FormControl(initValues.dueDate),
      priority: new FormControl(initValues.priority),
    });
  }

  onSubmit() {
    // Process form submission here
    this.formSubmitted.emit(this.taskForm.value);
    // Reset the form after submission
    this.taskForm.patchValue(this.initialFormValues);
  }

  private getFormattedDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    return `${year}-${month}-${day}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}
