export const mdTemplate = [
  "# {workTitle}",
  "## Description",
  "",
  "```",
  "{workNotes}",
  "```",
  "",
  "## Stats",
  "",
  "Total duration **{workTotalDuration}** | Total sum **{workTotalSum}**",
  "",
  "---",
  "",
  "Work created by: **{workOwner}**",
  ""
].join("\n");

export default function formatTemplate(variables: { [key: string]: string | undefined }): string {
  let template = mdTemplate;

  Object.keys(variables).forEach((key) => {
    template = template.replace(`{${key}}`, variables[key] || '')
  });

  return template;
}