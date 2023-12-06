import AbstractView from "./AbstractView.js"

export default class extends AbstractView{
    constructor(params){
        super(params)
        this.setTitle('Home')
    }

    async getHtml(){
        return  `
                <h1>Welcome to our synonymizor</h1>
                <p>We let you swim in synonyms!</a>
                `
    }
}