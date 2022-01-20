import { Form, ActionPanel, SubmitFormAction, ToastStyle, Icon, Toast, useNavigation } from "@raycast/api";
import { convertToDuration, humanizeDuration } from '../duration';
import { loggerApi } from "../logger";
import { Ids, Task, Work } from '../types';
import { TaskFormProps, PushToShowDetailsAction, DeleteTaskAction } from "./actions";

export interface TaskForm {
  duration: string,
  rate?: string,
  description: string,
  timestamp?: Date,
}

export type AddTaskProps = TaskFormProps & { navigationTitle?: string }

export default function AddTask(props: AddTaskProps): JSX.Element {
  const { pop } = useNavigation();

  function handleSubmit(form: TaskForm) {
    submitTask(props.work, props.task, form)
      .then((ids) => {
        props.onAction(ids);
        setTimeout(() => pop(), 100);
      });
  }

  return (
    <Form
      navigationTitle={props.navigationTitle || 'Add a Task'}
      actions={<ActionPanel>
        <ActionPanel.Section>
          <SubmitFormAction icon={Icon.Plus} onSubmit={handleSubmit} />
        </ActionPanel.Section>
        <ActionPanel.Section>
          <PushToShowDetailsAction work={props.work} onAction={props.onAction} />
          {props.task && <DeleteTaskAction
            task={props.task}
            onAction={() => { props.onAction(); setTimeout(() => pop(), 100); }}
          />}
        </ActionPanel.Section>
      </ActionPanel>}
    >
      <Form.TextField id="description" title="Description" defaultValue={props.task?.description} />
      {props.work.isDayLogging
        ? <FormDurationDropdownField task={props.task} />
        : <FormDurationTextField task={props.task} />
      }
      <Form.Separator />
      <Form.TextField id="rate" title="Rate" defaultValue={(props.task?.rate || props.work.rate).toString()} />
      <Form.DatePicker id="timestamp" title="Date" defaultValue={props.task?.timestamp.toDate()} />
    </Form>
  );
}

const FormDurationTextField = (props: { task?: Task }) => {
  const duration = props.task ? humanizeDuration(props.task?.duration) : '';

  return <Form.TextField id="duration" title="Duration" defaultValue={duration} />
}

const FormDurationDropdownField = (props: { task?: Task }) => {
  const duration = props.task?.duration.toString() || '';

  return <Form.Dropdown id="duration" title="Duration" defaultValue={duration}>
    <Form.Dropdown.Item key="full" title="Full day" value="86400" />
    <Form.Dropdown.Item key="three-quarters" title="3/4 day" value="64800" />
    <Form.Dropdown.Item key="half" title="Half a day (1/2)" value="43200" />
    <Form.Dropdown.Item key="quarter" title="Quarter of a day (1/4)" value="21600" />
  </Form.Dropdown>
}


export function submitTask(work: Work, task: Task | undefined, form: TaskForm): Promise<Ids> {
  const { isDayLogging, id } = work;
  const payload = { ...form, duration: isDayLogging ? form.duration : convertToDuration(form.duration) }
  const toast = new Toast({ title: 'Submit Task', style: ToastStyle.Animated });
  toast.show();

  const result = !(task && task.id)
    ? loggerApi.post(`api/works/${id}/tasks`, payload)
    : loggerApi.put(`api/tasks/${task.id}`, payload);

  return new Promise(resolve => {
    result.then(response => {
      toast.style = ToastStyle.Success;
      toast.message = response.data.message;

      const ids: Ids = response.data.data;
      resolve(ids);
    }).catch(error => {
      toast.style = ToastStyle.Failure;
      toast.title = 'Submit Failed';

      if (error.data.errors != undefined) {
        const errors: { [key: string]: string[] } = error.data.errors;
        toast.message = Object.values(errors)[0][0];
      } else {
        toast.message = 'Validation failed';
      }
    })
  })
}