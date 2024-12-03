"use client"

//import "./page.css"
import Link from "next/link";
import Cabecalho from "../components/cabecalho/page";
import { useEffect, useState } from "react";
import ReactModal from 'react-modal';
import MaskedInput from 'react-text-mask';

export default function Postagens(props){

    const [errorItem, seterrorItem] = useState(false)
    const [stateEditar, setStateEditar] = useState(false);
    const [stateNovo, setStateNovo] = useState(false)
    const [stateModal, setstateModal] = useState(false);
    const [stateItem, setStateItem] = useState()
    const [stateItemId, setStateItemId] = useState("");
    const [stateItens, setStateItens] = useState([]);
    const [stateTotal, setStateTotal] = useState(0);
    const [filtro, setFiltro] = useState("");
    useEffect(() => {
        
    }, []);

    const cnpjmask = [/[1-9]/,/[1-9]/," ", /[1-9]/,/[1-9]/,/[1-9]/," ", /[1-9]/,/[1-9]/,/[1-9]/,"/","0","0","0","1","-",/[1-9]/,/[1-9]/];

    async function handleFiltro(){
        if(filtro!=""){
            await fetch(`http://localhost:5218/api/estoque/codbarra/${filtro}`)
            .then(r => r.json())
            .then(r =>{
                
                console.log(r);
                var tamanho = stateItens.length
                
                var log = stateItens.find((item) => item.estoque_produto.id === r.estoque_produto.id)
                if(!log){
                    setStateItens(stateItens => [...stateItens, {...r, quant: 1}]);
                }
                else{
                    const itemAtualizado = stateItens.find((item) => item.estoque_produto.id === r.estoque_produto.id);
                    const itensFiltrados = stateItens.filter((item) => item.estoque_produto.id !== r.estoque_produto.id);

                    if (itemAtualizado) {
                        // Atualiza o valor do item e reinserimos na lista
                        setStateItens([...itensFiltrados, { ...itemAtualizado, quant: itemAtualizado.quant+1 }]);
                      }
                }
                   
            });
        }
        else{
            
        }
    }

    const handleRemoveItem = (e) => {
        console.log(e)
        const log = stateItens.filter(item => item.id !== e)
        console.log(log)
        setStateItens(stateItens => stateItens.filter(item => item.index !== e));
      };

    const handleFiltrar = (event) => {
        const valor = event.target.value;
        setFiltro(valor);
    };

    async function handleVenda(){
        
        const valores = stateItens.map((item) => item);
        console.log(valores)

        for(var i=0; i<valores.length; i++){
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify({quant: valores[i].quant}),
                headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }),
            };

            const response = fetch(`http://localhost:5218/api/estoque/venda/${valores[i].estoque_produto.id}`, requestOptions);
            console.log(response);
        }

        alert("Venda Realizada Com Sucesso")
    }

  return (
    <div>
      <Cabecalho></Cabecalho>
      
      <div className="principal">
        <h2 className="pb-3 ml-5 mb-3 mr-5">Venda</h2>
        <div className="container w-100">
            <div className="flexcontainer w-100">

                <div>Total de Itens: {stateItens.length}</div>
                <div className="d-flex flex-row">
                    <div className="input-group mb-3 w-100" style={{height: "3vh" }}>
                        <br></br>
                        <input onChange={handleFiltrar} value={filtro} type="text" className="form-control" placeholder="Digite o Código de Barra"/>
                        <div className="">
                            <button onClick={handleFiltro}className="btn mx-2" id="botao" type="button">Adicionar</button>
                        </div>
                    </div>
                    
                    <table className="table">
                        <thead>
                            <tr>
                                <th><center>Produto Id</center></th>
                                <th><center>Nome</center></th>
                                <th><center>Cod. Barras</center></th>
                                <th><center>Valor</center></th>
                                <th><center>Quantidade</center></th>
                                <th><button onClick={handleVenda} type="button" className="btn btn-success">Realizar Venda</button></th>
                            </tr>
                        </thead>
                        <tbody className="tablebody">
                            {stateItens.map((item, index) => (
                                <tr key={index}>
                                    <td hidden>{index}</td>
                                    <td>{item.id}</td>
                                    <td>{item.estoque_produto.nome}</td>
                                    <td>{item.estoque_produto.cod_barra}</td>
                                    <td>{item.estoque_produto.valor}</td>
                                    <td>{item.quant}</td>
                                    <th className="d-flex flex-row flex-row-reverse">
                                        <button 
                                            type="button"
                                            className={"btn btn-outline-secondary mx-2 "}
                                            onClick={() => handleRemoveItem(index)}
                                            >X</button>
                                    </th>
                                </tr>
                            ))}


                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                    
                </div>
            </div>
        </div>
      </div>
      
    </div>
  );
}
