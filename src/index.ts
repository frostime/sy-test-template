import {
    Plugin,
} from "siyuan";
import "@/index.scss";
import { showDialog } from "./func";


export default class PluginTestTemplate extends Plugin {

    onload(): void {
        this.addTopBar({
            icon: "iconMarkdown",
            title: this.i18n.name,
            callback: () => {
                showDialog();
            }
        });
    }

    onunload(): void {

    }
}
