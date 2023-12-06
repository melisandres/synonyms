export default class{
    constructor(params){
        this.params = params
        //console.log(this.params)
        //console.log(this.params.id)
    }
    setTitle(title){
        document.title = title
    }

    async getHtml(){
        return ""
    }

}