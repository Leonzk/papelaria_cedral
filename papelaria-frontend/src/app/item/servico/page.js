"use client"

import "./page.css"
import Link from "next/link";
import Cabecalho from "../../cabecalho/page";
import { useEffect, useState } from "react";
import ReactModal from 'react-modal';
import MaskedInput from 'react-text-mask';

export default function Postagens() {

    const [errorItem, seterrorItem] = useState(false)
    const [stateEditar, setStateEditar] = useState(false);
    const [stateModal, setstateModal] = useState(false);
    const [stateVinc, setstateVinc] = useState([]);
    const [stateItem, setStateItem] = useState({
        razao_social: "",
        nome_fantasia: "",
        cnpj: ""
    })
    const [stateItemId, setStateItemId] = useState("");
    const [stateItens, setStateItens] = useState([]);
    const [stateTotal, setStateTotal] = useState(0);
    const [filtro, setFiltro] = useState("");
    useEffect(() => {
        fetch("http://localhost:5064/api/empresa")
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
            await fetch("http://localhost:5064/api/empresa")
            .then(r => r.json())
            .then(r =>{
                var newArray = r.filter(function (item){
                    return item.razao_social.includes(filtro) ||
                            item.nome_fantasia.includes(filtro) ||
                            item.cnpj.includes(filtro) ||
                            item.id == filtro
                });
                console.log(newArray);
                setStateItens(newArray);
                console.log(r);
            });
        }
        else{
            await fetch("http://localhost:5064/api/empresa")
            .then(r => r.json())
            .then(r =>{
                setStateItens(r);
                console.log(r);
            });
        }
    }

    async function handleExcluir(id){

        console.log(id);

        if(confirm("Deseja realmente excluir esta empresa?")){
            const requestOptions = {
                method: 'POST',
                body: "",
                headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }),
            };

            const response = await fetch(`http://localhost:5064/api/empresa/delete/${id}`, requestOptions);
            console.log(response);
        }
        else{

        }
    }

    const handleFiltrar = (event) => {
        const valor = event.target.value;
        setFiltro(valor);
    };

    const backurl = "/empresas";

    function handleOpen(id){
        setstateModal(true);

        fetch(`http://localhost:5064/api/getvincempresas/${id}`)
        .then(r => r.json())
        .then(r =>{
            setstateVinc(r);
            console.log(r);
        });

    }

    function handleClose(){
        setstateModal(false)
    }

    async function handleEditarOpen(id){

        await fetch(`http://localhost:5064/api/empresa/${id}`)
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

            const response = await fetch(`http://localhost:5064/api/empresa/atualizar/${id}`, requestOptions);
            console.log(response);


        setStateEditar(false)
        alert("Empresa Alterada Com Sucesso")
    }

  return (
    <div>
      <Cabecalho></Cabecalho>
      
      <div className="principal">
        <h1 className="border-bottom pb-3 ml-5 mb-3 mr-5">Gerenciamento de Empresas</h1>
        <div className="container w-100">
            <div className="flexcontainer w-100">
                <ReactModal isOpen={stateEditar}>
                    <div className="w-100 d-flex justify-content-between mb-3 w-50">
                        <h2>Atualizar Empresa</h2>
                        <button 
                            type="button"
                            className={"btn btn-outline-secondary mx-2 "}
                            onClick={() => handleEditarClose()}
                            >X Fechar</button>
                    </div>
                    <div className="form-body">
                        <label for="razao_social" className="form-label">Razao Social</label>
                        <div className="input-group mb-3">
                            <input value={stateItem.razao_social} onChange={(e)=> setStateItem((stateItem) => ({...stateItem, razao_social: e.target.value}))} type="text" className="form-control" id="razao_social"/>
                        </div>

                        <label for="nome_fantasia" className="form-label">Nome Fantasia</label>
                        <div className="input-group mb-3">
                            <input value={stateItem.nome_fantasia} onChange={(e)=> setStateItem((stateItem) => ({...stateItem, nome_fantasia: e.target.value}))} type="text" className="form-control" id="nome_fantasia"/>
                        </div>

                        <label for="cnpj" className="form-label">CNPJ</label>
                        <div className="input-group mb-3">
                            <MaskedInput mask={cnpjmask} value={stateItem.cnpj} onChange={(e)=> setStateItem((stateItem) => ({...stateItem, cnpj: e.target.value}))} type="text" className="form-control" id="cnpj"/>
                        </div>
                    </div>
                    <div className="form-footer">
                        <button onClick={() => handleEditarSalvar(stateItemId)} type="button" className="btn btn-primary">Alterar</button>
                    </div>
                    {errorItem ?<p className="mt-3 text-danger">Formulário incorreto</p> : <></>}
                </ReactModal>
                <ReactModal isOpen={stateModal}
                 style={{
                    overlay: {
                      backgroundColor: 'rgba(255, 255, 255, 0.75)'
                    },
                    content: {
                      position: 'absolute',
                      top: '10%',
                      left: '40px',
                      right: '40px',
                      bottom: '40px',
                      border: '1px solid #ccc',
                      background: '#fff',
                      overflow: 'auto',
                      WebkitOverflowScrolling: 'touch',
                      borderRadius: '4px',
                      outline: 'none',
                      padding: '20px'
                    }
                  }}
                >
                    <div className="w-100 d-flex justify-content-between mb-3 w-50">
                        <h2>Setores da empresa</h2>
                        <button 
                            type="button"
                            className={"btn btn-outline-secondary mx-2 "}
                            onClick={() => handleClose()}
                            >X Fechar</button>
                    </div>
                    
                    <table className="table">
                    <thead>
                        <tr>
                            <th>Setor Id</th>
                            <th>Descricao do Setor</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {stateVinc.map(item => (
                            <tr>
                                <td>{item.setor.id}</td>
                                <td>{item.setor.descricao}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </ReactModal>
                <div className="input-group mb-3 w-100">
                    <input onChange={handleFiltrar} value={filtro} type="text" className="form-control" placeholder="Pesquisar"/>
                    <div className="">
                        <button onClick={handleFiltro}className="btn mx-2" type="button">Pesquisar</button>
                    </div>
                    <Link href={"./empresas/novo"}><button type="button" className="btn btn-success ml-3">Novo</button></Link>
                </div>
                <div>Registros {stateItens.length}/{stateTotal}</div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Empresa Id</th>
                            <th>Razao Social</th>
                            <th>Nome Fantasia</th>
                            <th>CNPJ    </th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {stateItens.map(item => (
                            <tr>
                                <td>{item.id}</td>
                                <td>{item.razao_social}</td>
                                <td>{item.nome_fantasia}</td>
                                <td>{item.cnpj}</td>
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
                                    
                                    <button 
                                        type="button"
                                        className={"btn btn-outline-secondary mx-2 "}
                                        onClick={() => handleOpen(item.id)}
                                        >▶ Ver Setores</button>
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
