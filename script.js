const content = document.querySelector(".content");
const btnNew = document.querySelector(".addNote-content");

let items_db = localStorage.getItem("items_db")
  ? JSON.parse(localStorage.getItem("items_db"))
  : [];

const colors = [
  "#845EC2",
  "#008F7A",
  "#008E9B",
  "#FFC75F",
  "#FF8066",
  "#BA3CAF",
];
const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

function loadItems() {
  content.innerHTML = "";
  verifyNulls();
  let id
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
        addHTML(element, element.id);

      })
      console.log(resp)
    })



  // items_db.forEach((item, i) => {
  // });

  addEvents();
}

btnNew.onclick = () => {
  addHTML();
  addEvents();
};

function addHTML(item) {
  const div = document.createElement("div");

  div.innerHTML = `<div class="item" style="background-color: ${item?.color || randomColor()
    }">
    <span class="remove">X</span>
    <textarea>${item?.postagem || ""}</textarea>
    <button class="salvar" id="btSalvar"> salvar </button>
  </div>`;
  content.appendChild(div);
  const btSalvar = document.querySelector("#btSalvar")
  btSalvar.onclick = () => {
    fetch("https://json-server-anotacoes.onrender.com/postagens", {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "id": (item.id+1), "postagem": item.postagem
      })
    })
      .then((response) => {
        console.log(response)
      });
  };

}

function addEvents() {
  const notes = document.querySelectorAll(".item textarea");
  const remove = document.querySelectorAll(".item .remove");

  notes.forEach((item, i) => {
    item.oninput = () => {
      items_db[i] = {
        text: item.value,
        color: items_db[i]?.color || item.parentElement.style.backgroundColor,
      };




      localStorage.setItem("items_db", JSON.stringify(items_db));
    };
  });




  remove.forEach((item, i) => {
    item.onclick = () => {
      content.children[i].remove();
      fetch(`https://json-server-anotacoes.onrender.com/postagens${i}`, {
        method: "delete",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
        .then((response) => {
          console.log(response)
        })
        .catch((error)=>{
          console.log(error)
        })

      addEvents();
    };
  });


}

function verifyNulls() {
  items_db = items_db.filter((item) => item);
  localStorage.setItem("items_db", JSON.stringify(items_db));
}

loadItems();
