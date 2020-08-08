import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Task } from './../tasks.service';
import { AddTask, RemoveTask } from './../actions/task.actions';

export class TaskStateModel {
    tasks: Task[];
}

@State<TaskStateModel>({
    name: 'tasks',
    defaults: {
        tasks: []
    }
})
export class TaskState {
    @Selector()
    static getTasks(state: TaskStateModel) {
        return state.tasks;
    }

    static getTask(state: TaskStateModel) {
        return (taskId: string) => {
            return state.tasks.find(({ id }: Task) => id === taskId);
        }
    }

    @Action(AddTask)
    add({ getState, patchState }: StateContext<TaskStateModel>, { payload }: AddTask) {
        const state = getState();
        patchState({
            tasks: [ ...state.tasks, payload ]
        });
    }

    @Action(RemoveTask)
    remove({ getState, patchState }: StateContext<TaskStateModel>, { payload }: RemoveTask) {
        patchState({
            tasks: getState().tasks.filter(t => t.id != payload)
        });
    }
}