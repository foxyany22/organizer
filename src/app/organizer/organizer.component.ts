import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';
import { AddTask, RemoveTask } from './../shared/actions/task.actions';
import { Observable } from 'rxjs';
import { TaskState } from './../shared/state/task.state';
import { TasksService, Task } from './../shared/tasks.service';
import { DateService } from './../shared/date.service';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {

  public form: FormGroup;
  public tasks: Task[] = [];
  
  @Select(TaskState.getTasks) tasks$: Observable<Task[]>;

  constructor(
    public dateService: DateService,
    private taskService: TasksService,
    private store: Store
  ) {
  }

  ngOnInit(): void {
    this.dateService.date.pipe(
      switchMap((value) => this.taskService.load(value))
    ).subscribe((tasks) => {
      this.tasks = tasks;
    });

    this.form = new FormGroup({
      title: new FormControl('', Validators.required)
    });
  }

  submit() {
    const { title } = this.form.value;

    const task: Task = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY'),
    };

    this.taskService.create(task).subscribe((task: Task) => {
      this.tasks.push(task);
      this.form.reset();
    }, (err) => console.error(err));

    this.saveTaskToLocalStore(task);
  }

  saveTaskToLocalStore(task: Task) {
    this.store.dispatch(new AddTask(task));
  }

  remove(task: Task) {
    this.taskService.remove(task).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    }, (err) => console.error(err));
    this.removeTaskFromLocalStore(task);
  }

  removeTaskFromLocalStore(task: Task) {
    this.store.dispatch(new RemoveTask(task.id));
  }
}
