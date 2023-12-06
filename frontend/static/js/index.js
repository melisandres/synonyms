import Home from "./views/Home.js"
import Random from "./views/Random.js"
import Word from "./views/Word.js"
import Sentence from "./views/Sentence.js"

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)")+ "$")


const router = async () =>{
    //a test
    //console.log(pathToRegex("/post/:id"))

    const routes = [
        { path: "/", view: Home},
        { path: "/sentence/:id", view: Sentence},
        { path: "/random", view: Random},
        { path: "/word/:id", view: Word},
    ]

    const getParams = match => {
        const values = match.isMatch.slice(1);
        const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(isMatch =>isMatch[1])
        //console.log(Array.from(match.route.path.matchAll(/:\w+/g)))
        return Object.fromEntries(keys.map((key, i) => {
            return [key, values[i]]
        }))
    }

    //match function
    const potentialMatches = routes.map(route =>{
        return {
            route:route,
            isMatch: location.pathname.match(pathToRegex(route.path))
        }
    })

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch)
    
    if(!match){
        match ={
            route: routes[0],
            isMatch: [location.pathname]
        }
    }
    
    //document.querySelector("#app").innerHTML = match.route.view
    const view = new match.route.view(getParams(match))
    document.querySelector("#app").innerHTML = await view.getHtml();
}

const navigateTo = url =>{
    history.pushState(null, null, url)
    router()
}

window.addEventListener("popstate", router)

document.addEventListener("DOMContentLoaded", () => {

    document.body.addEventListener('click', e => {
        if(e.target.matches("[data-link]")){
            e.preventDefault()
            navigateTo(e.target.href)
        }
    })

    document.querySelector('[data-search-word]').addEventListener('click', e =>{
            // Get the value from the input field
            const wordInput = document.getElementById('wordInput');
            const word = wordInput.value;
            wordInput.value = '';
            navigateTo("/word/" + word);
    })
    router(); //to make sure the page doesn't start as empty
})


