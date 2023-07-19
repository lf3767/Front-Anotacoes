const content = document.querySelector(".content");
const btnNew = document.querySelector(".addNote-content");
const colors = [
    "#845EC2",
    "#008F7A",
    "#008E9B",
    "#FFC75F",
    "#FF8066",
    "#BA3CAF",
];
const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

btnNew.onclick = () => {
    addHTML();
};
function addHTML() {
    const div = document.createElement("div");
    div.classList.add("item")
    div.style.backgroundColor = randomColor()
    content.appendChild(div);
    const btSalvar = document.createElement("button")
    btSalvar.setAttribute('id','salvar')
    div.append(btSalvar)
    // btSalvar.setAttribute('id', element.id)
    btSalvar.textContent = 'Salvar'
    const textArea = document.createElement('textarea')
    div.append(textArea)
    
    

    btSalvar.onclick = () => {
        const postagem = textArea.value
        fetch("https://json-server-anotacoes.onrender.com/postagens", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "id": (id+1), "postagem": postagem
            })
        })
            .then((response) => {
                console.log(response)
                loadItems()
            });
    };
}



let id

function loadItems() {
    content.innerHTML = "";
    var myHeaders = new Headers();
    var myInit = {
        method: 'GET',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default'
    };
    fetch('https://json-server-anotacoes.onrender.com/postagens', myInit)
        .then(function (response) {
            return (response.json())
        })
        .then(function (resp) {
            resp.map((element, index, array) => {
                id = element.id

                const div = document.createElement("div");
                div.classList.add("item")
                div.style.backgroundColor = randomColor()
                content.appendChild(div);
                const btApagar = document.createElement("button")
                btApagar.setAttribute('id','apagar')
                div.append(btApagar)
                // btApagar.setAttribute('id', element.id)
                btApagar.textContent = 'Apagar'
                const textArea = document.createElement('textarea')
                div.append(textArea)
                textArea.innerHTML = element.postagem
                const postagem = textArea.innerHTML
                btApagar.addEventListener('click', () => {
                    fetch(`https://json-server-anotacoes.onrender.com/postagens/${id}`, {
                        method: "delete",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                    })
                        .then((response) => {
                            console.log(response)
                            loadItems()
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                })

            })
            console.log(resp)
        })
        .catch((error) => {
            console.log(error)
        })
}
loadItems();
