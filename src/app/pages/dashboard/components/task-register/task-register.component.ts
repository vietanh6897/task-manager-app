import { Component, EventEmitter, Output } from '@angular/core';
import { TaskFormComponent } from '../task-form/task-form.component';
import { ITask } from '../../../../models/interfaces/task.interface';

@Component({
  selector: 'app-task-register',
  standalone: true,
  imports: [TaskFormComponent],
  templateUrl: './task-register.component.html',
  styleUrl: './task-register.component.css',
})
export class TaskRegisterComponent {
  @Output() addNewTask = new EventEmitter<ITask>();

  handleFormSubmitted(formValue: ITask): void {
    const newTask: ITask = {
      id: this.generateUniqueId(),
      title: formValue.title,
      description: formValue.description,
      dueDate: formValue.dueDate,
      priority: formValue.priority,
    };

    this.addNewTask.emit(newTask);
  }

  private generateUniqueId(): string {
    // Generate a unique ID (e.g., using timestamp)
    return Date.now().toString();
  }
}
