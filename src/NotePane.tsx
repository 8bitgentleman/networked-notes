import React, { Suspense } from "react";
import FetchNote from "./FetchNote";
import styles from "./NotePane.module.scss";
import { Pane } from "./Pane";
import { PaneStyles } from "./layout";
import ErrorBoundary from "./ErrorBoundary";

const isAnchor = (el: any): el is HTMLAnchorElement => {
  return el?.tagName === "A";
};

const getNoteId = (el: HTMLAnchorElement) => {
  return el.getAttribute("href");
};

type Props = {
  paneStyles: PaneStyles;
  noteID: string;
  onRequestNote: (noteID: string) => void;
};

export default function NotePane(props: Props) {
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    const el = e.target;
    if (!isAnchor(el)) return;

    const noteID = getNoteId(el);
    if (!noteID) return;

    e.preventDefault();
    props.onRequestNote(noteID);
  };

  return (
    <ErrorBoundary
      fallback={
        <Pane paneStyles={props.paneStyles}>
          <p>Error...</p>
        </Pane>
      }
    >
      <Suspense
        fallback={
          <Pane paneStyles={props.paneStyles}>
            <p>Loading...</p>
          </Pane>
        }
      >
        <FetchNote noteID={props.noteID}>
          {(note) => {
            return (
              <Pane paneStyles={props.paneStyles} title={note.title}>
                <div
                  className={styles.content}
                  dangerouslySetInnerHTML={{ __html: note.html }}
                  onClick={handleContentClick}
                />

                {note.backlink_note_ids.length ? (
                  <div className={styles.backlinkNotes}>
                    {note.backlink_note_ids.map((backlinkNoteID, index) => {
                      return (
                        <div
                          key={backlinkNoteID}
                          className={styles.backlinkNote}
                        >
                          <Suspense fallback={<p>Loading...</p>}>
                            <FetchNote
                              noteID={backlinkNoteID}
                              loadLinkedNotes={false}
                            >
                              {(backlinkNote) => {
                                console.log(backlinkNote.title)
                                console.log(note.backlink_note_text[index])
                                console.log(backlinkNote.id)
                                return (
                                  <div
                                    className={styles.backlinkNoteContent}
                                    dangerouslySetInnerHTML={{
                                      __html: "<h3>" + backlinkNote.title + "</h3><div>" + backlinkNote.backlink_note_text[index] + "</div>",
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      props.onRequestNote(backlinkNoteID);
                                    }}
                                  />
                                );
                              }}
                            </FetchNote>
                          </Suspense>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </Pane>
            );
          }}
        </FetchNote>
      </Suspense>
    </ErrorBoundary>
  );
}
