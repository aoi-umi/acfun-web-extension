import { AcLiveExt } from "@/live";
import { AcMainExt } from "@/index";

declare global {
  interface Window {
    acLiveExt: AcLiveExt
    acMainExt: AcMainExt
  }
}