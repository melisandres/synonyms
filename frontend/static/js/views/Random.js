import AbstractView from "./AbstractView.js"

export default class extends AbstractView{
    constructor(params){
        super(params)
        this.setTitle('Random')
    }

    async fetchRandomFromServer() {
        try {
            const response = await fetch(`/api/random`);
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

    async fetchDataFromServer(word) {
        try {
            const response = await fetch(`/api/word/${word}`);
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

    async getHtml(){
        const word = await this.fetchRandomFromServer();
        const data = await this.fetchDataFromServer(word);

        let content = `<h1><a href="/sentence/${word}" data-link>${word}</a></h1>`;
        // Check if the data is synonyms
        if (!data[0].meta){
            content += `<h2>words that remind us of "${word}"</h2><ul>`; 
        } 

        // Iterate through the data
        data.forEach(element => {
            // Check if the synonyms array exists
            if (element.meta && element.meta.syns) {
                // Iterate through each array of synonyms
                content += `<h2>Synonym for "${element.hwi.hw}"</h2>`;
                element.meta.syns.forEach((synonymArray, index) => {
                    // Iterate through each synonym in the array
                    content += `<ul>`;
                    synonymArray.forEach(synonym => {
                        // Extract and display each synonym
                        content += `<li><a href="/sentence/${synonym}" data-link>${synonym}</a></li>`;
                    });
                    content += `</ul>`;
                });
            } else {
                // Iterate through non-standard content
                content += `<li><a href="/sentence/${element}" data-link>${element}</a></li>`;
            }
        });
    
        return content;
    }
}