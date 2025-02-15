import {
  DIALOG,
  CANCEL_BUTTON,
  CONFIRM_BUTTON,
  DIALOG_SUBTITLE,
} from "./locators";

// component preview locators
export const dialogPreview = () => cy.get(DIALOG);
export const dialogSubtitle = () => cy.get(DIALOG_SUBTITLE);
export const confirmButton = () => cy.get(CONFIRM_BUTTON);
export const cancelButton = () => cy.get(CANCEL_BUTTON);
