export type Note = {
  id: string;
  html: string;
  title: string;
  backlink_note_ids: string[];
  backlink_note_text: string[]
  linked_note_ids: string[];
};
