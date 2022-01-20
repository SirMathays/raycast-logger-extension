import { ActionPanel, Icon, List, OpenInBrowserAction } from "@raycast/api";
import { PushToTaskIndexAction, PushToAddTaskAction, PushToShowDetailsAction, WorkProps } from './actions'
import { loggerUrl } from "../logger";

export default function WorkListItem(props: WorkProps): JSX.Element {
  return (
    <List.Item
      icon={Icon.List}
      key={props.work.id}
      title={props.work.title}
      actions={<ActionPanel>
        <PushToTaskIndexAction key="1" work={props.work} onAction={props.onAction} />
        <PushToAddTaskAction key="2" work={props.work} onAction={props.onAction} />
        <OpenInBrowserAction key="3" title="Open in Logger" url={`${loggerUrl}/work/${props.work.id}`} />
        <PushToShowDetailsAction key="4" work={props.work} onAction={props.onAction} />
      </ActionPanel>}
    />
  )
}