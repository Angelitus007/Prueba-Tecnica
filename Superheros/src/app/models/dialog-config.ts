import { DialogType } from "@constants/dialogs";
import { Hero } from "@models/hero";

export interface DialogConfig {
  dialogToShow: DialogType;
  hero?: Hero;
}
