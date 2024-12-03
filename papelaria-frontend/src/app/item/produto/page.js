"use client"

import "./page.css"
import Link from "next/link";
import Cabecalho from "../../components/cabecalho/page";
import { useEffect, useState } from "react";
import ReactModal from 'react-modal';
import MaskedInput from 'react-text-mask';

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
    useEffect(() => {
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

            const response = await fetch(`http://localhost:5218/api/item/produto/`, requestOptions);
            console.log(response);


        setStateEditar(false)
        alert("Produto Criado Com Sucesso")
    }

  return (
    <div>
      <Cabecalho></Cabecalho>
      
      <div className="principal">
        <h2 className="pb-3 ml-5 mb-3 mr-5">Gerenciamento de Produtos</h2>
        <div className="container w-100">
            <div className="flexcontainer w-100">
                <ReactModal ariaHideApp={false} isOpen={stateEditar}>
                    <div className="w-100 d-flex justify-content-between mb-3 w-50">
                        <h2>Atualizar Produto</h2>
                        <button 
                            type="button"
                            className={"btn btn-outline-secondary mx-2 "}
                            onClick={() => handleEditarClose()}
                            >X Fechar</button>
                    </div>
                    <div className="form-body">
                        <label htmlFor="nome" className="form-label">Nome</label>
                        <div className="input-group mb-3">
                            <input value={stateItem.nome} onChange={(e)=> setStateItem((stateItem) => ({...stateItem, nome: e.target.value}))} type="text" className="form-control" id="nome"/>
                        </div>

                        <label htmlFor="cod_barra" className="form-label">Código de Barras</label>
                        <div className="input-group mb-3">
                            <input value={stateItem.cod_barra} onChange={(e)=> setStateItem((stateItem) => ({...stateItem, cod_barra: e.target.value}))} type="text" className="form-control" id="cod_barra"/>
                        </div>

                        <label htmlFor="valor" className="form-label">Valor</label>
                        <div className="input-group mb-3">
                            <input value={stateItem.valor} onChange={(e)=> setStateItem((stateItem) => ({...stateItem, valor: e.target.value}))} type="text" className="form-control" id="valor"/>
                        </div>
                    </div>
                    <div className="form-footer">
                        <button onClick={() => handleEditarSalvar(stateItemId)} type="button" className="btn btn-primary">Alterar</button>
                    </div>
                    {errorItem ?<p className="mt-3 text-danger">Formulário incorreto</p> : <></>}
                </ReactModal>

                <ReactModal ariaHideApp={false} isOpen={stateNovo}>
                    <div className="w-100 d-flex justify-content-between mb-3 w-50">
                        <h2>Novo Produto</h2>
                        <button 
                            type="button"
                            className={"btn btn-outline-secondary mx-2 "}
                            onClick={() => handleNovoClose()}
                            >X Fechar</button>
                    </div>
                    <div className="form-body">
                        <label htmlFor="nome" className="form-label">Nome</label>
                        <div className="input-group mb-3">
                            <input value={stateItem.nome} onChange={(e)=> setStateItem((stateItem) => ({...stateItem, nome: e.target.value}))} type="text" className="form-control" id="nome"/>
                        </div>

                        <label htmlFor="cod_barra" className="form-label">Código de Barras</label>
                        <div className="input-group mb-3">
                            <input value={stateItem.cod_barra} onChange={(e)=> setStateItem((stateItem) => ({...stateItem, cod_barra: e.target.value}))} type="text" className="form-control" id="cod_barra"/>
                        </div>

                        <label htmlFor="valor" className="form-label">Valor</label>
                        <div className="input-group mb-3">
                            <input value={stateItem.valor} onChange={(e)=> setStateItem((stateItem) => ({...stateItem, valor: e.target.value}))} type="numeric" className="form-control" id="valor"/>
                        </div>
                    </div>
                    <div className="form-footer">
                        <button onClick={() => handleNovoSalvar()} type="button" className="btn btn-primary">Criar</button>
                    </div>
                    {errorItem ?<p className="mt-3 text-danger">Formulário incorreto</p> : <></>}
                </ReactModal>
                <div className="input-group mb-3 w-100">
                    <input onChange={handleFiltrar} value={filtro} type="text" className="form-control" placeholder="Pesquisar"/>
                    <div className="">
                        <button onClick={handleFiltro}className="btn mx-2" type="button">Pesquisar</button>
                    </div>
                    <button onClick={handleNovoOpen} type="button" className="btn btn-success ml-3">Novo</button>
                </div>
                <div>Registros {stateItens.length}/{stateTotal}</div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Produto Id</th>
                            <th>Nome</th>
                            <th>Cod.Barra</th>
                            <th>Valor Un.</th>
                        </tr>
                    </thead>
                    <tbody className="tablebody">
                        {stateItens.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.nome}</td>
                                <td>{item.cod_barra}</td>
                                <td>{item.valor}</td>
                                <th className="d-flex flex-row flex-row-reverse">
                                    <button 
                                        type="button"
                                        className={"btn btn-outline-secondary mx-2 "}
                                        onClick={() => handleExcluir(item.id)}
                                        >🗑 Excluir</button>
                                    <button 
                                        type="button"
                                        className={"btn btn-outline-secondary mx-2 "}
                                        onClick={() => handleEditarOpen(item.id)}
                                        >🖉 Editar</button>
                                </th>
                            </tr>
                        ))}


                    </tbody>
                </table>
                {stateItens.length==0 ?<h2>Sem Resultados</h2> : <></>}
            </div>
            
        </div>
      </div>
      
    </div>
  );
}
