import {
    Plugin,
    openTab
} from "siyuan";
import "@/index.scss";
import { createElement } from "./func";


export default class PluginTestTemplate extends Plugin {

    onload(): void {
        this.addTopBar({
            icon: "iconMarkdown",
            title: this.i18n.name,
            callback: () => {
                this.openTab();
            }
        });
    }

    openTab() {
        //random string
        const id = Math.random().toString(36).substring(7);
        this.addTab({
            'type': id,
            init() {
                this.element.style.display = 'flex';
                this.element.appendChild(createElement());
            }
        });
        openTab({
            app: this.app,
            custom: {
                title: 'TestTemplate',
                icon: 'iconMarkdown',
                id: this.name + id,
            }
        });
    }

    onunload(): void {

    }
}
