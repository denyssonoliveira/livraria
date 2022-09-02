const express = require("express");
const app = express();
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

//INICIAR SERVIDOR
app.listen(3000,()=>{
    console.log("Servidor Online!");
});

app.use(cors());

//RECEBE E TRADUZ OS DADOS ENVIADOS DE UMA PAGINA
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//INDICA PARA O EXPRESS O VIEW ENGINE
app.set("view engine", "ejs");

//ARQUIVOS ESTATICOS
app.use(express.static('public'));
app.use(express.static('node_modules'));

//ROTAS

//VITRINE
app.get("/", (req, res)=>{
    let busca = req.body.busca;

    axios.all([
        axios.get("https://bibliapp.herokuapp.com/api/books/", ),
        axios.get("https://bibliapp.herokuapp.com/api/authors/")
    ]).then(axios.spread((booksresponse, authorresponse) =>{
        let livros = booksresponse.data;
        let authors = authorresponse.data;

        res.render("vitrine", {
            livros: livros,
            authors: authors
        });
    })).catch(error =>{
        res.render("vitrine", {
            erro: "Houve um erro."
        });
    })
});

//LISTAR LIVROS
app.get("/lista", (req, res)=>{
    axios.all([
        axios.get("https://bibliapp.herokuapp.com/api/books"),
        axios.get("https://bibliapp.herokuapp.com/api/authors")
    ]).then(axios.spread((booksresponse, authorresponse) =>{
        let livros = booksresponse.data;
        let authors = authorresponse.data;

        res.render("lista", {
            livros: livros,
            authors: authors
        });
    })).catch(error =>{
        res.render("lista", {
            erro: "Houve um erro."
        });
    })
});

//CADASTRAR LIVROS
app.post("/cadastrarlivro", (req, res) =>{
    let title = req.body.nomelivro;
    let isbn = req.body.isbnlivro;
    let authorId = parseInt(req.body.authorlivro);

    axios({
        method: 'post',
        responseType: 'json',
        url: "https://bibliapp.herokuapp.com/api/books",
        data: {
            title: title,
            isbn: isbn,
            authorId: authorId
        }
    }).then(response =>{
        if(response.status == 200){
            res.redirect("/lista");
        }
    }).catch(error =>{
        console.log(error.data);
    })
});

//DELETAR LIVROS
app.post("/deletarlivro", (req, res) =>{
    let idLivro = parseInt(req.body.idLivro);

    axios.delete(`https://bibliapp.herokuapp.com/api/books/${idLivro}`).then(response =>{
        if(response.status == 200){
            res.redirect("/lista");
        }
    }).catch(error =>{
        console.log(error.data);
    })
});

//EDITAR LIVROS
app.post("/editarlivro", (req, res) =>{
    let title = req.body.edtnomelivro;
    let isbn = req.body.edtisbnlivro;
    let authorId = parseInt(req.body.edtauthorlivro);
    let idLivro = parseInt(req.body.edtidLivro);
    
    axios({
        method: 'put',
        responseType: 'json',
        url: `https://bibliapp.herokuapp.com/api/books/${idLivro}`,
        data: {
            title: title,
            isbn: isbn,
            authorId: authorId
        }
    }).then(response =>{
        if(response.status == 200){
            res.redirect("/lista");
        }
    }).catch(error =>{
        console.log(error.data);
    })
});

