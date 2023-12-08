import AbstractView from "./AbstractView.js"

export default class extends AbstractView{
    constructor(params){
        super(params)
        this.setTitle('Sentence')
    }

    async fetchDataFromServer(word) {
        try {
            const response = await fetch(`/api/sentence/${word}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data from server:', error);
            throw error;
        }
    }
    
    async getHtml() {
        const word = this.params.id;
        const data = await this.fetchDataFromServer(word);
        let string =    `
                        <h1><a href="/word/${word}" data-link>${word}</a></h1>
                        <h2>example sentences:</h2><ul>
                        `;

        const content = await this.buildString(data, string);
    
        // You can then use the 'result' string as needed
        console.log(data);
    
        return content;
    }
    


async buildString(obj, content = '') {
    // Check if the input is an array
    if (Array.isArray(obj)) {
        // Use a for...of loop to wait for each asynchronous call inside the loop
        for (const item of obj) {
            content += await this.buildString(item);
        }
    } else if (typeof obj === 'object' && obj !== null) {
        // Use a for...of loop to wait for each asynchronous call inside the loop
        for (const key of Object.keys(obj)) {
            if (key === 't') {
                // Replace {it} and {/it} with <i> and </i>
                let text = obj[key].replace(/\{it\}/g, '<i>').replace(/\{\/it\}/g, '</i>');
                // Handle {wi} and {/wi}
                text = text.replace(/\{wi\}/g, '<strong>').replace(/\{\/wi\}/g, '</strong>');
                content += `<li class="sentence">${text}</li>`;
            } else {
                // Recursively call the function for non-'t' keys
                content += await this.buildString(obj[key]);
            }
        }
    }
    return content;
}

    /* async buildString(obj, content = '') {
        // Check if the input is an array
        if (Array.isArray(obj)) {
            // Use Promise.all to wait for all asynchronous calls inside the loop
            const results = await Promise.all(obj.map(item => this.buildString(item)));
            // Concatenate the results
            content += results.join('');
        } else if (typeof obj === 'object' && obj !== null) {
            // Use Promise.all to wait for all asynchronous calls inside the loop
            const results = await Promise.all(
                Object.keys(obj).map(async key => {
                    if (key === 't') {
                        // Replace {it} and {/it} with <i> and </i>
                        let text = obj[key].replace(/\{it\}/g, '<i>').replace(/\{\/it\}/g, '</i>');
                        // Handle {wi} and {/wi}
                        text = text.replace(/\{wi\}/g, '<strong>').replace(/\{\/wi\}/g, '</strong>');
                        return `<li class="sentence">${text}</li>`;
                    } else {
                        // Recursively call the function for non-'t' keys
                        return await this.buildString(obj[key]);
                    }
                })
            );
            // Concatenate the results
            content += results.join('');
        }
        content += `</ul>`;
        return content;
    } */
    
    
}