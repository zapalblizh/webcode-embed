import { createHighlighter} from "shiki/bundle/web";

class WebCodeEmbed extends HTMLElement {
    static get observedAttributes() {
        return ['files', 'theme', 'langs', 'start-index', 'breakpoint']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'files' && newValue)
            this.config.files = newValue.split(' ').map(file => file.trim());
        if (name === 'theme' && newValue)
            this.shikiConfig.theme = newValue;
        if (name === 'langs' && newValue)
            this.shikiConfig.langs = newValue.split(' ').map(lang => lang.trim());
        if (name === 'start-index' && newValue)
            this.config.activeIndex = parseInt(newValue);
        if (name === 'breakpoint' && newValue)
            this.attrs.breakpoint = newValue;
        if (name === 'height' && newValue)
            this.attrs.height = newValue;
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shikiConfig = {
            theme: 'vitesse-dark',
            langs: ['html', 'css', 'javascript'],
        }

        this.config = {
            files: [],
            fileTypes: [],
            fileContents: [],
            previewSrc: '',
            activeIndex: 0,
        }

        this.attrs = {
            breakpoint: '39.9375em',
            height: '500px',
        }
    }

    // escapeHTML(str) {
    //     return str.replace(/&/g, '&amp;')
    //         .replace(/</g, '&lt;')
    //         .replace(/>/g, '&gt;')
    //         .replace(/"/g, '&quot;')
    //         .replace(/'/g, '&#039;');
    // }

    // Gets all files and stores into a variable
    async processFiles() {

        // Create highlighter using shiki
        this.highlighter = await createHighlighter({
            themes: [this.shikiConfig.theme],
            langs: this.shikiConfig.langs,
        });

        try {
            for (let file of this.config.files) {
                const fileType = file.slice(file.lastIndexOf('.') + 1);

                // Get html file for iframe (previewBox)
                if (fileType === 'html')
                    this.config.previewSrc = file;

                this.config.fileTypes.push(fileType);

                const response = await fetch(file);
                const content = await response.text();

                // Highlight code using shiki
                const html = this.highlighter.codeToHtml(content, {
                    lang: fileType,
                    theme: this.shikiConfig.theme,
                })

                this.config.fileContents.push(html);
            }
        } catch (e) {
            console.warn(`Error processing files: ${e.message}`)
        }
    }

    /*
    * - Creates buttons per file submitted
    * - Uses data-index to provide an identifier for active state enabling
    * - Returns html string of buttons
    * */
    createButtons() {
        let buttons = [];

        for (let [index, type] of this.config.fileTypes.entries()) {
            if (index === this.config.activeIndex)
                buttons.push(`<button data-index="${index}" class="btn active">${type}</button>`)
            else
                buttons.push(`<button data-index="${index}" class="btn">${type}</button>`)
        }

        return buttons.join('');
    }

    /*
     * Handles button clicks for file and result buttons
     *
     * Mobile: Clicking a button hides the other panel (only one visible at a time)
     * Desktop: Buttons toggle independently, but at least one panel stays visible
     */
    toggleButton(clickedButton) {
        this.config.activeIndex = parseInt(clickedButton.dataset.index);

        const buttonInFileToggle = !!this.shadowRoot.querySelector('.file-buttons').contains(clickedButton);
        const buttonIsActive = clickedButton.classList.contains('active');
        const isMobile = !window.matchMedia(`(min-width: ${this.attrs.breakpoint})`).matches;
        const totalActiveButtons = this.shadowRoot.querySelectorAll('.btn.active').length;

        if (buttonInFileToggle) {
            // File button clicked - only switch if not already active
            if (!buttonIsActive) {
                // Switch to codeBox tied to toggled button
                this.shadowRoot.querySelector('.file-buttons .btn.active')?.classList.remove('active');
                clickedButton.classList.add('active');

                this.getCodeBoxByParam('.active')?.classList.replace('active', 'hidden');
                this.getCodeBoxByParam(`[data-index="${this.config.activeIndex}"]`).classList.replace('hidden', 'active');
            }
            else if (!isMobile && totalActiveButtons === 2){
                clickedButton.classList.remove('active');
                this.getCodeBoxByParam(`[data-index="${this.config.activeIndex}"]`).classList.replace('active', 'hidden');
            }
        }
        else {
            const previewBox = this.shadowRoot.querySelector('.preview-box');

            // Result button clicked - only show if not already active
            if (!buttonIsActive) {
                clickedButton.classList.add('active');
                previewBox.classList.remove('hidden');
            }
            else if (!isMobile && totalActiveButtons === 2){
                clickedButton.classList.remove('active');
                previewBox.classList.add('hidden');
            }
        }

        // Mobile Version (only one box visible at a time)
        if (isMobile && !buttonIsActive) {
            if (buttonInFileToggle) {
                // Hide previewBox when button tied to file is toggled
                this.shadowRoot.querySelector('.frame-button-container .btn').classList.remove('active');
                this.shadowRoot.querySelector('.preview-box').classList.add('hidden');
            } else {
                // Hide codeBox when result button is toggled
                this.shadowRoot.querySelector('.file-buttons .btn.active')?.classList.remove('active');
                this.getCodeBoxByParam('.active')?.classList.replace('active', 'hidden');
            }
        }
    }

    // Get active code box based on a parameter
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
                    height: ${this.attrs.height};
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding: 1rem 0;
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
                    flex-direction: column;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }
                .button-container {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }
                @media (min-width: ${this.attrs.breakpoint}) {
                    .webcode-container {
                        flex-direction: row;
                    }
                    .webcode-container > * {
                        flex: 1 1 50%;
                        min-width: 0;
                    }
                    .button-container {
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        width: 100%;
                        gap: 0;
                        height: fit-content;
                    }
                }
                .frame-button-container {
                    display: flex;
                    align-items: center;
                    padding-right: 8px;
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
                .frame-button-container .btn {
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
            <div class="container">
                <div class="button-container">
                    <div class="file-buttons">
                        ${buttons}
                    </div>
                    
                    <div class="frame-button-container">
                        <button type="button" class="btn active">Result</button>
                    </div>
                </div>
                
                <div class="webcode-container">
                    ${codeBoxes}
                    
                    <div class="preview-box">
                        <iframe class="preview-box" title="Experiment 2" src="${this.config.previewSrc}" loading="lazy" allowtransparency="true"></iframe>
                    </div>
                </div>
            </div>
        `;
    }

    async connectedCallback() {
        await this.processFiles();

        // Creation of Buttons & Code snippets
        const buttons = this.createButtons();
        let codeBoxes = this.config.fileContents.map((content, index) => `<div class="code-box hidden" data-index="${index}">${content}</div>`).join('');

        this.render(buttons, codeBoxes);

        // Define result button state by screen size
        const isMobile = !window.matchMedia(`(min-width: ${this.attrs.breakpoint})`).matches;

        // When mobile, hide code and keep preview box displayed
        if (isMobile)
            this.shadowRoot.querySelector('.file-buttons button.active').classList.remove('active');

        // Make active a code-box by activeIndex
        else
            this.shadowRoot.querySelector(`.code-box[data-index="${this.config.activeIndex}"]`).classList.replace('hidden', 'active');

        // Event Listener to handle Button Clicks
        this.shadowRoot.querySelector('.button-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('btn')) {
                e.preventDefault();
                this.toggleButton(e.target);
            }
        });
    }
}

customElements.define("webcode-embed", WebCodeEmbed);