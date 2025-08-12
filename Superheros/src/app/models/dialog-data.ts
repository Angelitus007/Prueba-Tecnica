import { DialogType } from "@constants/dialogs";
import { Hero } from "@models/hero";

export interface DialogData {
  dialog: DialogType;
  hero?: Hero;
  heroID?: string; // For the 'DELETE' operation
}
