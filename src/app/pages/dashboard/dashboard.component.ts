import { Component, signal } from '@angular/core';
import { ITask, ITaskItem } from '../../models/interfaces/task.interface';
import { TaskRegisterComponent } from './components/task-register/task-register.component';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TaskRegisterComponent, TaskListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  tasks = signal<ITaskItem[]>([]);

  handleAddNewTask(newTask: ITask): void {
    const transformNewTask: ITaskItem = {
      ...newTask,
      showDetails: false,
      isSelected: false,
    };
    this.tasks.update((origin) => [...origin, transformNewTask]);
  }

  onUpdateTasks(newList: ITaskItem[]): void {
    // Check new data (updated list) send from task-list child & If OK then update latest data
    // Can do some check here to determine if tasks need to be updated or not
    this.tasks.set(newList);
  }
}
