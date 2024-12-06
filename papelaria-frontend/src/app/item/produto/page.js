"use client"

import "./page.css"
import Link from "next/link";
import Cabecalho from "../../components/cabecalho/page";
import Footer from "../../components/footer/page";
import { useEffect, useState } from "react";
import ReactModal from 'react-modal';
import MaskedInput from 'react-text-mask';
import AppNavbar from "../../components/templates/dashboard/components/AppNavbar";

import {Button,TableBody,TableRow,TableCell, IconButton, TableFooter, TablePagination, Table,TableHead,Paper,Tooltip,Typography,CircularProgress, TextField,} from "@material-ui/core";
import { Box, Modal } from "@mui/material";

export default function Postagens(props){

    const [errorItem, seterrorItem] = useState(false)
    const [stateEditar, setStateEditar] = useState(false);
    const [stateNovo, setStateNovo] = useState(false)
    const [stateModal, setstateModal] = useState(false);
    const [stateItem, setStateItem] = useState({
        nome: "",
        cod_barra: "",
        valor: 0
    })
    const [stateItemId, setStateItemId] = useState("");
    const [stateItens, setStateItens] = useState([]);
    const [stateTotal, setStateTotal] = useState(0);
    const [filtro, setFiltro] = useState("");
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true)
        fetch("http://localhost:5218/api/item/produto")
        .then(r => r.json())
        .then(r =>{
            setStateItens(r);
            setStateTotal(r.length);
            console.log(r);
        });
    }, []);

    const cnpjmask = [/[1-9]/,/[1-9]/," ", /[1-9]/,/[1-9]/,/[1-9]/," ", /[1-9]/,/[1-9]/,/[1-9]/,"/","0","0","0","1","-",/[1-9]/,/[1-9]/];

    async function handleFiltro(){
        if(filtro!=""){
            await fetch("http://localhost:5218/api/item/produto")
            .then(r => r.json())
            .then(r =>{
                var newArray = r.filter(function (item){
                    return item.nome.includes(filtro) ||
                            item.cod_barra.includes(filtro) ||
                            item.id == filtro
                });
                console.log(newArray);
                setStateItens(newArray);
                console.log(r);
            });
        }
        else{
            await fetch("http://localhost:5218/api/item/produto")
            .then(r => r.json())
            .then(r =>{
                setStateItens(r);
                console.log(r);
            });
        }
    }

    async function handleExcluir(id){

        console.log(id);

        if(confirm("Deseja realmente excluir esta Produto?")){
            const requestOptions = {
                method: 'POST',
                body: "",
                headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }),
            };

            const response = await fetch(`http://localhost:5218/api/item/produto/deletar/${id}`, requestOptions);
            console.log(response);
        }
        else{

        }
    }

    const handleFiltrar = (event) => {
        const valor = event.target.value;
        setFiltro(valor);
    };

    async function handleEditarOpen(id){

        await fetch(`http://localhost:5218/api/item/produto/${id}`)
        .then(r => r.json())
            .then(r =>{
                setStateItem(r);
                setStateItemId(id);
                console.log(r);
            });
        setStateEditar(true)
    }

    function handleEditarClose(){
        seterrorItem(false)
        setStateEditar(false)
    }

    async function handleEditarSalvar(id){
        seterrorItem(false)
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify(stateItem),
                headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }),
            };

            const response = await fetch(`http://localhost:5218/api/item/produto/atualizar/${id}`, requestOptions);
            console.log(response);


        setStateEditar(false)
        alert("Produto Alterado Com Sucesso")
    }

    function handleNovoOpen(){
        setStateItem({
            nome: "",
            cod_barra: "",
            valor: 0
        });
        seterrorItem(false)
        setStateNovo(true)
    }

    function handleNovoClose(){
        seterrorItem(false)
        setStateNovo(false)
    }

    async function handleNovoSalvar(){
        seterrorItem(false)
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify(stateItem),
                headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }),
            };

            await fetch(`http://localhost:5218/api/item/produto/`, requestOptions)
            .then(r => r.json())
            .then(r =>{
                console.log(r)
                const requestOptions2 = {
                    method: 'POST',
                    body: JSON.stringify({quant: 0, item_id: r.id}),
                    headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                    }),
                };

                fetch(`http://localhost:5218/api/estoque/`, requestOptions2)
            });


        setStateEditar(false)
        alert("Produto Criado Com Sucesso")
    }

  return (
    <div>
      <Cabecalho></Cabecalho>
      
      <div className="principal">
        <br></br>
        <div className="container w-100">
            <div className="flexcontainer w-100">
                <Modal open={stateEditar} onClose={() => handleEditarClose()}>
                    <Box className="rounded bg-white w-50 mt-5 shadow d-flex flex-column p-3 justify-content-center mx-auto">
                    <div className="mb-3">
                        <center>
                            <h2>Atualizar Produto</h2>
                        </center>
                    </div>
                    <div className="form-body">
                        <label htmlFor="nome" className="form-label">Nome</label>
                        <div className="input-group mb-3">
                            <TextField value={stateItem.nome} onChange={(e)=> setStateItem((stateItem) => ({...stateItem, nome: e.target.value}))} type="text" className="form-control" id="nome"/>
                        </div>

                        <label htmlFor="cod_barra" className="form-label">Código de Barras</label>
                        <div className="input-group mb-3">
                            <TextField value={stateItem.cod_barra} onChange={(e)=> setStateItem((stateItem) => ({...stateItem, cod_barra: e.target.value}))} type="text" className="form-control" id="cod_barra"/>
                        </div>

                        <label htmlFor="valor" className="form-label">Valor</label>
                        <div className="input-group mb-3">
                            <TextField value={stateItem.valor} onChange={(e)=> setStateItem((stateItem) => ({...stateItem, valor: e.target.value}))} type="text" className="form-control" id="valor"/>
                        </div>
                    </div>
                    <div className="form-footer align-item-center mt-3 mb-3">
                        <center>
                        <Button onClick={() => handleEditarSalvar(stateItemId)} variant="contained" color="success" className="btn btn-primary">Alterar</Button>
                        </center>
                    </div>
                    {errorItem ?<div className="mt-3 text-danger">Formulário incorreto</div> : <></>}
                    </Box>
                </Modal>
                
                
                
                <Modal className="mx-auto" open={stateNovo} onClose={() => handleNovoClose()}>
                    <Box className="rounded bg-white w-50 mt-5 shadow d-flex flex-column p-3 justify-content-center mx-auto">
                        <div className=" mb-3">
                            <center>
                                <h2>Novo Produto</h2>
                            </center>
                        </div>
                        <div className="form-body">
                            <label htmlFor="nome" className="form-label">Nome</label>
                            <div className="input-group mb-3">
                                <TextField value={stateItem.nome} onChange={(e)=> setStateItem((stateItem) => ({...stateItem, nome: e.target.value}))} type="text" className="form-control" id="nome"/>
                            </div>

                            <label htmlFor="cod_barra" className="form-label">Código de Barras</label>
                            <div className="input-group mb-3">
                                <TextField value={stateItem.cod_barra} onChange={(e)=> setStateItem((stateItem) => ({...stateItem, cod_barra: e.target.value}))} type="text" className="form-control" id="cod_barra"/>
                            </div>

                            <label htmlFor="valor" className="form-label">Valor</label>
                            <div className="input-group mb-3">
                                <TextField value={stateItem.valor} onChange={(e)=> setStateItem((stateItem) => ({...stateItem, valor: e.target.value}))} type="numeric" className="form-control" id="valor"/>
                            </div>
                        </div>
                        <div className="form-footer align-item-center mt-3 mb-3">
                            <center>
                            <Button onClick={() => handleNovoSalvar()} variant="contained" color="success" className="btn btn-primary">Criar</Button>
                            </center>
                        </div>
                        {errorItem ?<div className="mt-3 text-danger">Formulário incorreto</div> : <></>}
                    </Box>
                </Modal>
                <div className="input-group mb-3 w-100">
                    <TextField onChange={handleFiltrar} value={filtro} type="text" className="form-control" id="standard-basic" label="Filtro" variant="standard"   />
                    
                    <Button variant="contained" color="primary" onClick={handleFiltro} className="ml-2">Pesquisar</Button>
                    
                    <Button variant="contained" color="success" onClick={handleNovoOpen} className="ml-3">Novo</Button>
                </div>
                <br></br>
                <Table className="shadow p-5 mb-5 bg-white rounded">
                    <TableHead>
                        <TableRow>
                            <TableCell><center>Produto Id</center></TableCell>
                            <TableCell><center>Nome</center></TableCell>
                            <TableCell><center>Cod.Barra</center></TableCell>
                            <TableCell><center>Valor Un.</center></TableCell>
                            <TableCell><center>Ações</center></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stateItens.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell><center>{item.id}</center></TableCell>
                                <TableCell><center>{item.nome}</center></TableCell>
                                <TableCell><center>{item.cod_barra}</center></TableCell>
                                <TableCell><center>{item.valor}</center></TableCell>
                                <TableCell className="d-flex flex-row flex-row-reverse">
                                    <Button 
                                        variant="outlined"
                                        className={"mx-2"}
                                        onClick={() => handleExcluir(item.id)}
                                        >🗑 Excluir</Button>
                                    <Button 
                                        variant="outlined"
                                        className={"mx-2"}
                                        onClick={() => handleEditarOpen(item.id)}
                                        >🖉 Editar</Button>
                                </TableCell>
                            </TableRow>
                        ))}


                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>Registros {stateItens.length}/{stateTotal}</TableCell>
                            <TablePagination rowsPerPage={20} page={0} count={stateItens.length}  />
                        </TableRow>
                    </TableFooter>
                </Table>
                {stateItens.length==0 ?<h2>Sem Resultados</h2> : <></>}
            </div>
            
        </div>
      </div>
      <Footer/>
    </div>
  );
}
