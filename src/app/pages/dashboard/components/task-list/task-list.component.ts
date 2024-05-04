import {
  Component,
  EventEmitter,
  OnChanges,
  Output,
  SimpleChanges,
  computed,
  input,
  signal,
} from '@angular/core';
import { ITask, ITaskItem } from '../../../../models/interfaces/task.interface';
import { TaskFormComponent } from '../task-form/task-form.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskFormComponent, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnChanges {
  @Output() updateTasks = new EventEmitter<ITaskItem[]>();

  tasks = input.required<ITaskItem[]>();

  private customTasks = signal<ITaskItem[]>([]);
  search = signal('');
  filteredTasks = computed(() => {
    return this.customTasks().filter((item: ITask) =>
      item.title.toLowerCase().includes(this.search().toLowerCase())
    );
  });

  ngOnChanges(changes: SimpleChanges) {
    if (changes[`tasks`] && changes[`tasks`].currentValue) {
      this.customTasks.set(
        this.sortTasksByDueDate(
          JSON.parse(JSON.stringify(changes[`tasks`].currentValue))
        )
      );
    }
  }

  toggleDetails(task: ITaskItem): void {
    task.showDetails = !task.showDetails;
    this.collapseOtherDetails(task);
  }

  handleFormSubmitted(formValue: ITask): void {
    const updatedTask: ITask = {
      id: formValue.id,
      title: formValue.title,
      description: formValue.description,
      dueDate: formValue.dueDate,
      priority: formValue.priority,
    };
    // Update record then notice parent to update latest data
    const updatedTasks = [...this.customTasks()];
    const taskUpdatedIdx = updatedTasks.findIndex(
      (item) => item.id === updatedTask.id
    );
    const transformUpdatedTask: ITaskItem = {
      ...updatedTask,
      showDetails: false,
      isSelected: false,
    };
    updatedTasks[taskUpdatedIdx] = transformUpdatedTask;
    this.updateTasks.emit(updatedTasks);
  }

  handleRemoveTask(task: ITask): void {
    const index = this.customTasks().findIndex((item) => item.id === task.id);
    if (index !== -1) {
      const updatedTasks = [...this.customTasks()];
      // remove record then notice parent to update latest data
      updatedTasks.splice(index, 1);
      this.updateTasks.emit(updatedTasks);
    }
  }

  handleRemoveSelectedTasks(): void {
    const noneSelectedTasks = this.customTasks().filter(
      (task) => !task.isSelected
    );
    this.updateTasks.emit(noneSelectedTasks);
  }

  get hasCheckedTasks(): boolean {
    return this.customTasks().some((task) => task.isSelected);
  }

  private collapseOtherDetails(selectedTask: ITaskItem): void {
    this.customTasks().forEach((task) => {
      if (task !== selectedTask) {
        task.showDetails = false;
      }
    });
  }

  // Method to sort tasks by due date
  private sortTasksByDueDate(tasks: ITaskItem[]): ITaskItem[] {
    return tasks.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB;
    });
  }
}
