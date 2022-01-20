import { List } from "@raycast/api";
import { groupBy, maxBy } from "lodash";
import { StateController, Work, WorkListState } from "../types";
import WorkListItem from "./WorkListItem";

export type WorkListProps = WorkListState & {
    onAction: StateController
}

export default function WorkList(props: WorkListProps): JSX.Element {
  return (
    <List isLoading={props.isLoading}>
      {groupByRecency(props.works).map(group => (
        <List.Section key={group.title} title={group.title}>
          {group.rows.map(work => <WorkListItem key={work.id} work={work} onAction={props.onAction} />)}
        </List.Section>
      ))}
    </List>
  )
}

const groupByRecency = (works: Work[]) => {
  const groupFunc = (g: { [key: string]: Work[] }) => (
    Object.keys(g).map(title => ({ title, rows: g[title] }))
  );
  const work = maxBy(works, w => w.updatedAt.unix());

  if (!work) {
    return groupFunc({ All: works });
  } else {
    const date = work.updatedAt;
    return groupFunc(groupBy(works, w => (
      date.diff(w.updatedAt, 'days') <= 1 ? 'Recent' : 'Older')
    ));
  }
}