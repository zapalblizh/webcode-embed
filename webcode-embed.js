class WebCodeEmbed extends HTMLElement {
    constructor() {
        super();

        this.attrs = {
            breakpoint: "breakpoint",
            codeCollection: "code-collection",
            htmlPreview: "html-preview",
            height: "height",
            width: "width",
            csp: "csp",
            ratio: "ratio",
            loading: "loading"
        }

        this.defaults = {
            breakpoint: '(max-width: 39.9375em)',
            ratio: "1:1"
        }
    }

    render() {
        this.innerHTML = `
            <style>
                .container {
                    padding: 1rem;
                    background-color: #2e2e2e;
                }
                .file-previews {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1px;
                }
                .file-previews > :first-child {
                    border-radius: 2px 0 0 2px;
                }
                .file-previews > :last-child {
                    border-radius: 0 2px 2px 0;
                }
                .btn {
                    padding: 10px 14px;
                    background-color: #666666;
                    border: 0;
                    font-size: 14px;
                    color: #fff;
                    cursor: pointer;
                    text-decoration: none;
                    text-transform: uppercase;
                }
               .btn:hover {
                    opacity: 0.9;
               }
               .btn:active {
                    box-shadow: inset 0 4px 0 #ddd;
                    background-color: #b3b3b3;
                    color: #000;
               }
            </style>
            <div class="container">
                <div class="selections">
                    <div class="file-previews">
                        <a href="#" class="btn">HTML</a>
                        <a href="#" class="btn">CSS</a>
                        <a href="#" class="btn">JS</a>
                    </div>
                    <iframe src=""></iframe>
                    <iframe src=""></iframe>
                    <div>
                        <a href="#" class="btn">CSS</a>
                    </div>
                </div>
            </div>
        `;
    }
    connectedCallback() {
        this.render();
    }

}

if("customElements" in window) {
    window.customElements.define("webcode-embed", WebCodeEmbed);
}

export { WebCodeEmbed }