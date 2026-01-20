/**
 * Event emitted when a user message is edited
 */
export interface EditEvent {
  /** The original message content before editing */
  originalContent: string;
  /** The new message content after editing */
  newContent: string;
}
