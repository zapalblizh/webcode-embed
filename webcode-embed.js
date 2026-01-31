import { createHighlighter, codeToHtml} from "shiki/bundle/web";

class WebCodeEmbed extends HTMLElement {
    static get observedAttributes() {
        return ['files', 'theme', 'langs']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'files' && newValue)
            this.files = newValue.split(' ').map(file => file.trim());
        if (name === 'theme' && newValue)
            this.theme = newValue;
        if (name === 'langs' && newValue)
            this.langs = newValue.split(' ').map(lang => lang.trim());
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.files = [];
        this.fileTypes = [];
        this.fileContents = [];
        this.activeIndex = 0;
        this.highlighter = null;
        this.theme = 'vitesse-dark';
        this.langs = ['html', 'css', 'javascript'];

        this.defaults = {
            breakpoint: '(max-width: 39.9375em)',
            codePreviewWidth: "50%",
        }
    }

    escapeHTML(str) {
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#039;');
    }

    /* Gets all files and stores into a variable */
    async processFiles() {

        // Create highlighter using shiki
        this.highlighter = await createHighlighter({
            themes: [this.theme],
            langs: this.langs,
        });

        try {
            for (let file of this.files) {
                const fileType = file.slice(file.lastIndexOf('.') + 1);
                this.fileTypes.push(fileType);

                const response = await fetch(file);
                const content = await response.text();

                /* Highlight code using shiki */
                const html = this.highlighter.codeToHtml(content, {
                    lang: fileType,
                    theme: this.theme,
                })

                this.fileContents.push(html);
            }
        } catch (e) {
            console.warn(`Error processing files: ${e.message}`)
        }
    }

    /* Creates buttons as html inside array */
    createButtons() {
        let buttons = [];

        for (let [index, type] of this.fileTypes.entries()) {
            if (index === this.activeIndex)
                buttons.push(`<button data-index="${index}" data-type="${type}" class="btn active">${type}</button>`)
            else
                buttons.push(`<button data-index="${index}" data-type="${type}" class="btn">${type}</button>`)
        }

        return buttons.join('');
    }

    /* Function to handle button clicks based on active state for button */
    toggleButton(clickedButton) {
        this.activeIndex = parseInt(clickedButton.dataset.index);

        let buttonInFileToggle = !!this.shadowRoot.querySelector('.file-buttons').contains(clickedButton);
        let buttonIsActive = clickedButton.classList.contains('active');

        if (buttonInFileToggle) {
            if (buttonIsActive) {
                clickedButton.classList.remove('active');
                this.getCodeBoxByParam(`[data-index="${this.activeIndex}"]`).classList.replace('active', 'hidden');
            }
            else {
                /* Non-active button toggle Case */
                this.shadowRoot.querySelector('.file-buttons .btn.active')?.classList.remove('active');
                clickedButton.classList.add('active');

                this.getCodeBoxByParam('.active')?.classList.replace('active', 'hidden');
                this.getCodeBoxByParam(`[data-index="${this.activeIndex}"]`).classList.replace('hidden', 'active');
            }
        }
        else {
            /* Handles result button toggle */
            let webPreviewBox = this.shadowRoot.querySelector('.preview-box');

            if (buttonIsActive) {
                clickedButton.classList.remove('active');
                webPreviewBox.classList.add('hidden');
            }
            else {
                clickedButton.classList.add('active');
                webPreviewBox.classList.remove('hidden');
            }
        }
    }

    /* Gets the current code snippet box based on parameter given */
    getCodeBoxByParam(param) {
        return this.shadowRoot.querySelector(`.code-box${param}`);
    }

    render(buttons, codeBoxes) {
        this.shadowRoot.innerHTML = `
            <style>
                /* Containers */
                .container {
                    background-color: #3e3e3e;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 1rem 0;
                }
                .button-container {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    width: 100%;
                    height: fit-content;
                }
                .file-buttons {
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    padding-left: 8px;
                    gap: 1px;
                }
                .file-buttons .btn {
                    text-transform: uppercase;
                }
                .file-buttons > :first-child {
                    border-radius: 2px 0 0 2px;
                }
                .file-buttons > :last-child {
                    border-radius: 0 2px 2px 0;
                }
                .webcode-container {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                .webcode-container > * {
                    flex: 1 1 50%;
                    min-width: 0;
                }
                .result-button-container {
                    display: flex;
                    align-items: center;
                }
                
                /* Buttons */
                .btn {
                    padding: 10px 14px;
                    background-color: #666666;
                    border: 0;
                    font-size: 14px;
                    color: #fff;
                    cursor: pointer;
                    text-decoration: none;
                    display: block;
                    font-family: Arial, sans-serif;
                    transition: 0.1s ease;
                }
                .btn:hover {
                    opacity: 0.9;
                }
                .btn:active {
                    -webkit-transform: translateY(1px);
                    transform: translateY(1px);
                }
                .btn.active {
                    box-shadow: inset 0 3px 0 #ddd;
                    background-color: #b3b3b3;
                    color: #000;
                }
                .result-button-container .btn {
                    border-radius: 2px;
                }
                
                /* Code Demo Box */
                .code-box {
                    overflow: auto;
                    height: 100%;
                    box-sizing: border-box;
                    background-color: #121212;
                }
                pre {
                    margin: 0;
                    padding: 15px;
                    min-height: 100%;
                    height: auto;
                    background: transparent !important;
                }
                code {
                    text-wrap: wrap !important;
                    white-space: pre-wrap !important;
                }
                .hidden {
                    display: none;
                }
                .active {
                    display: block;
                }

                /* Web Preview Box */
                .preview-box {
                    width: 100%;
                    height: 100%;
                }
                iframe {
                    border: 0;
                    width: 100%;
                    height: 100%;
                }
            </style>
            <div class="container" style="height: 500px">
                <div class="button-container">
                    <div class="file-buttons">
                        ${buttons}
                    </div>
                    
                    <div class="result-button-container">
                        <button type="button" class="btn active">Result</a>
                    </div>
                </div>
                
                <div class="webcode-container">
                    ${codeBoxes}
                    
                    <div class="preview-box">
                        <iframe class="preview-box" title="Experiment 2" src="example/example.html" loading="lazy" allowtransparency="true"></iframe>
                    </div>
                </div>
            </div>
        `;
    }

    async connectedCallback() {
        await this.processFiles();

        /* Creation of Buttons & Code snippets */
        const buttons = this.createButtons();
        let codeBoxes = this.fileContents.map((content, index) => `<div class="code-box hidden" data-index="${index}">${content}</div>`).join('');

        this.render(buttons, codeBoxes);

        /* Make active a code-box by activeIndex */
        this.shadowRoot.querySelector(`.code-box[data-index="${this.activeIndex}"]`).classList.replace('hidden', 'active');

        /* Event Listener to handle Button Clicks */
        this.shadowRoot.querySelector('.button-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')) {
                e.preventDefault();
                this.toggleButton(e.target);
            }
        });
    }
}

customElements.define("webcode-embed", WebCodeEmbed);