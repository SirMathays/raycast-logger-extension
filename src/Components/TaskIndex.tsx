import { List } from "@raycast/api";
import { useState, useEffect } from 'react'
import { groupBy as _groupBy } from 'lodash';
import { loggerApi } from "../logger";
import { WorkId, Task, RawTask, TaskListState, Ids } from "../types";
import dayjs from "dayjs";
import { WorkProps } from "./actions";
import AddTaskListItem from "./AddTaskListItem";
import TaskListItem from "./TaskListItem";

export default function TaskIndex(props: WorkProps): JSX.Element {
  const [state, setState] = useState<TaskListState>({
    isLoading: true,
    tasks: [],
  });

  useEffect(() => {
    if (!state.isLoading) {
      return;
    }

    if (state.updated !== undefined) {
      setTimeout(() => { setState((oldState) => (
        { ...oldState, updated: undefined }
      ))}, 4000)
    }

    getTasks(props.work.id)
      .then(tasks => {
        setState((oldState) => ({ ...oldState, isLoading: false, tasks }))
      });
  }, [state]);

  return (
    <List isLoading={state.isLoading} navigationTitle="List Tasks">
      <List.Section key="new">
        <AddTaskListItem
          work={props.work}
          onAction={(ids?: Ids) => setState((oldState) => {
            return { ...oldState, isLoading: true, updated: ids }
          })} />
      </List.Section>
      {groupedTasks(state.tasks).map(group => (
        <List.Section key={group.title} title={group.title}>
          {group.rows.map(task => <TaskListItem
            key={task.id}
            task={task}
            work={props.work}
            highlight={state.updated?.taskId == task.id}
            onAction={(ids?: Ids) => setState((oldState) => {
              return { ...oldState, isLoading: true, updated: ids }
            })}
          />)}
        </List.Section>
      ))}
    </List>
  );
}

const groupedTasks = (tasks: Task[]) => {
  const grouped = _groupBy([...tasks], (task) => (
    task.timestamp.format('YYYY-MM-DD')
  ));

  return Object.keys(grouped).map(title => ({
    title, rows: grouped[title]
  }));
}

export async function getTasks(work: WorkId, params?: { status: string, limit: string }): Promise<Task[]> {
  const result = await loggerApi.get(`api/works/${work}/tasks`, { params })
  const mapResult = async (task: RawTask): Promise<Task> => ({
    description: task.description,
    duration: task.duration,
    id: task.id,
    isOwner: task.isOwner,
    rate: task.rate,
    timestamp: dayjs(task.timestamp),
    user: { ...task.user },
  });

  return result.data && result.data.length > 0 ? Promise.all(result.data.map(mapResult)) : [];
}

// export function confirmDeleteTask(task: Task): Toast {
//     return new Toast({
//         title: "Delete Task",
//         message: `Do you really want to delete task '${task.description}'?`,
//         style: ToastStyle.Success,
//         primaryAction: {
//             title: 'Yes',
//             shortcut: { modifiers: ['cmd'], key: 'y' },
//             onAction: async () => await deleteTask(task.id)
//         },
//         secondaryAction: {
//             title: 'No',
//             shortcut: { modifiers: ['cmd'], key: 'n' },
//             onAction: async () => 'hide'
//         }
//     })
// }