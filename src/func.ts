/*
 * Copyright (c) 2024 by frostime. All Rights Reserved.
 * @Author       : frostime
 * @Date         : 2024-04-20 00:45:45
 * @FilePath     : /src/func.ts
 * @LastEditTime : 2024-04-26 11:42:08
 * @Description  : 
 */
import { Dialog } from "siyuan";

import { enableTabToIndent } from "@/libs/indent-textarea";
import * as api from "@/api";

// 找到 .action{ .*? } ，转换成 {{ .*? }}
const toSprig = (template: string) => {
    return template.replace(/\.action{\s*(.*?)\s*}/g, '{{ $1 }}');
}

// 找到 {{ .*? }} ，转换成 .action{ .*? }
const toAction = (template: string) => {
    return template.replace(/{{\s*(.*?)\s*}}/g, '.action{ $1 }');
}

const render = async (sprig: string) => {
    let res = '';
    try {
        res = await api.renderSprig(sprig);
    } catch (e) {
        res = e.toString();
    }
    return res;
}

function preprocessTemplateRegion(template: string): string {
    // Regular expression to find text between .startaction and .endaction
    const pattern = /\.startaction(.*?)\.endaction/gs;

    // Replace the matched groups
    return template.replace(pattern, (_, group1: string) => {
        // Split the group into lines and transform each line
        const lines = group1.split('\n').filter(line => line.trim() !== '');
        const transformedLines = lines.map(line => `.action{ ${line.trim()} }`);
        return transformedLines.join('\n');
    });
}

let templateText = '';

//UI, 上面一行按钮，「转换」，「渲染」，下面并列两个框，左边是原始文本，右边是转换后的文本
const uiTemplate = `
<section style="display: flex; flex-direction: column; flex: 1; margin: 15px;">
  <div style="display: flex; justify-content: flex-start; margin-bottom: 10px; gap: 10px;">
    <button id="insertregion" class="b3-button" >Insert Region</button>
    <span style="display: inline; width: 1px; background-color: var(--b3-border-color);"></span>
    <button id="tosprig" class="b3-button" >To {{ }}</button>
    <button id="toaction" class="b3-button" >To .action{ }</button>
    <span class="fn__flex-1"></span>
    <button id="translateregion" class="b3-button" >Translate Region</button>
    <button id="render" class="b3-button">Render</button>
  </div>
  <div style="display: flex; flex: 1; gap: 10px;">
    <textarea class="b3-text-field fn__block" id="original" placeholder="Template" style="flex: 3;font-family: var(--b3-font-family-code); resize: none; font-size: 20px; line-height: 25px;" spellcheck="false"></textarea>
    <textarea class="b3-text-field fn__block" id="converted" placeholder="Rendered" style="flex: 2; font-family: var(--b3-font-family-code); resize: none; font-size: 20px; line-height: 25px;" spellcheck="false"></textarea>
  </div>
</section>
`;

export const showDialog = () => {
    let dialog = new Dialog({
        title: 'Test Template',
        content: uiTemplate,
        width: "70%",
        height: "70%",
        destroyCallback: () => {
            templateText = original.value;
        }
    });
    const original = dialog.element.querySelector('#original') as HTMLTextAreaElement;
    original.value = templateText;
    enableTabToIndent(original);

    dialog.element.querySelector('#insertregion').addEventListener('click', () => {
        original.value = original.value + '\n.startaction\n\n.endaction';
        //set cursor
        original.focus();
        original.selectionStart = original.value.length - 11;
        original.selectionEnd = original.value.length - 11;
    })
    dialog.element.querySelector('#translateregion').addEventListener('click', () => {

        original.value = preprocessTemplateRegion(original.value);
    })
    dialog.element.querySelector('#tosprig').addEventListener('click', () => {

        original.value = toSprig(original.value);
    });
    dialog.element.querySelector('#toaction').addEventListener('click', () => {

        original.value = toAction(original.value);
    });
    dialog.element.querySelector('#render').addEventListener('click', async () => {
        let converted = dialog.element.querySelector('#converted') as HTMLTextAreaElement;

        let template = toSprig(preprocessTemplateRegion(original.value))
        converted.value = await render(template);
    });
}

