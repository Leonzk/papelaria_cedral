"use client"

import "./page.css"
import Link from "next/link";
import Cabecalho from "../components/cabecalho/page";
import Footer from "../components/footer/page";
import { useEffect, useState } from "react";
import ReactModal from 'react-modal';
import MaskedInput from 'react-text-mask';
import {Button,TableBody,TableRow,TableCell, IconButton, TableFooter, TablePagination, Table,TableHead,Paper,Tooltip,Typography,CircularProgress, TextField,} from "@material-ui/core";
import { Box, Modal } from "@mui/material";
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Postagens(props){

    const [loading, setLoading] = useState(true);
    const [errorItem, seterrorItem] = useState(false)
    const [stateEditar, setStateEditar] = useState(false);
    const [stateNovo, setStateNovo] = useState(false)
    const [stateModal, setstateModal] = useState(false);
    const [stateItem, setStateItem] = useState({
        quant: 0
    })
    const [stateItemId, setStateItemId] = useState("");
    const [stateItens, setStateItens] = useState([]);
    const [stateTotal, setStateTotal] = useState(0);
    const [filtro, setFiltro] = useState("");
    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:5218/api/estoque")
        .then(r => r.json())
        .then(r =>{
            setStateItens(r);
            setStateTotal(r.length);
            
            console.log(r);
            setLoading(false);
        });
    }, []);

    const cnpjmask = [/[1-9]/,/[1-9]/," ", /[1-9]/,/[1-9]/,/[1-9]/," ", /[1-9]/,/[1-9]/,/[1-9]/,"/","0","0","0","1","-",/[1-9]/,/[1-9]/];

    async function handleFiltro(){
        if(filtro!=""){
            await fetch("http://localhost:5218/api/estoque")
            .then(r => r.json())
            .then(r =>{
                var newArray = r.filter(function (item){
                    return item.estoque_produto.nome.includes(filtro) ||
                            item.estoque_produto.cod_barra.includes(filtro) ||
                            item.estoque_produto.id == filtro ||
                            item.quant == filtro
                });
                console.log(newArray);
                setStateItens(newArray);
                console.log(r);
            });
        }
        else{
            await fetch("http://localhost:5218/api/estoque")
            .then(r => r.json())
            .then(r =>{
                setStateItens(r);
                console.log(r);
            });
        }
    }

    const handleFiltrar = (event) => {
        const valor = event.target.value;
        setFiltro(valor);
    };

    async function handleEditarOpen(id){

        await fetch(`http://localhost:5218/api/estoque/${id}`)
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

    async function handleEditarSalvar(id) {
    seterrorItem(false);
    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ quant: parseInt(stateItem.quant) }),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }),
    };

    const response = await fetch(`http://localhost:5218/api/estoque/atualizar/${id}`, requestOptions);
    if (response.ok) {
        toast.success("Estoque atualizado com sucesso!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        // Recarrega os estoques
        fetch("http://localhost:5218/api/estoque")
            .then(r => r.json())
            .then(r => {
                setStateItens(r);
                setStateTotal(r.length);
            });
    } else {
        toast.error("Erro ao atualizar estoque!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
        setStateEditar(false);
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

            const response = await fetch(`http://localhost:5218/api/item/estoque/`, requestOptions);
            console.log(response);


        setStateEditar(false)
        alert("Estoque Criado Com Sucesso")
    }

  return (
    <div>
      <Cabecalho></Cabecalho>
      <ToastContainer />
      <div className="principal">
        <br></br>
        <div className="container w-100">
        {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                        <CircularProgress />
                    </div>
                    ) : (
            <div className="flexcontainer w-100">
                <Modal className="mx-auto"
                    open={stateEditar}
                    onClose={handleEditarClose}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(2px)',
                        
                    }}
                >
                    <Box className="p-3"
                    sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 3,
                        boxShadow: 24,
                        minWidth: 350,
                        maxWidth: 400,
                        mx: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                        <Divider sx={{ width: '100%', mb: 2 }}>
                            <b style={{ fontSize: 18, color: '#1976d2' }}>Atualizar Estoque</b>
                        </Divider>
                        <List className="d-flex flex-column mx-auto align-items-center" sx={{ width: '100%' }}>
                            <ListItem>
                                <label htmlFor="quant" className="form-label" style={{ fontWeight: 500 }}>Quantidade</label>
                            </ListItem>
                            <ListItem>
                                <TextField
                                    value={stateItem.quant}
                                    onChange={(e) =>
                                        setStateItem((stateItem) => ({
                                            ...stateItem,
                                            quant: e.target.value,
                                        }))
                                    }
                                    type="number"
                                    className="form-control"
                                    id="quant"
                                    variant="outlined"
                                    size="small"
                                    sx={{ width: '100%' }}
                                />
                            </ListItem>
                        </List>
                        <div className="form-footer mt-3 d-flex justify-content-center" style={{ width: '100%' }}>
                            <Button
                                onClick={async () => {
                                    if (window.confirm("Tem certeza que deseja alterar a quantidade em estoque?")) {
                                        await handleEditarSalvar(stateItemId);
                                    }
                                }}
                                type="button"
                                variant="contained"
                                color="primary"
                                sx={{ width: '100%', fontWeight: 600, fontSize: 16, py: 1.2 }}
                            >
                                Alterar
                            </Button>
                        </div>
                        {errorItem && (
                            <p className="mt-3 text-danger text-center">Formulário incorreto</p>
                        )}
                    </Box>
                </Modal>

                <div className="input-group mb-3 w-100">
                    <TextField onChange={handleFiltrar} value={filtro} type="text" className="form-control" id="standard-basic" label="Filtro" variant="standard"   />
                    
                    <Button variant="contained" color="primary" onClick={handleFiltro} className="ml-2">Pesquisar</Button>
                
                </div>
                <div>Registros {stateItens.length}/{stateTotal}</div>
                <Table className="shadow p-5 mb-5 bg-white rounded">
                    <TableHead>
                        <TableRow>
                            <TableCell><center>Produto Id</center></TableCell>
                            <TableCell><center>Nome</center></TableCell>
                            <TableCell><center>Codigo de Barras</center></TableCell>
                            <TableCell><center>Quantidade em Estoque</center></TableCell>
                            <TableCell className="right"><center>Atualizar</center></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stateItens.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell><center>{item.estoque_produto.id}</center></TableCell>
                                <TableCell><center>{item.estoque_produto.nome}</center></TableCell>
                                <TableCell><center>{item.estoque_produto.cod_barra}</center></TableCell>
                                <TableCell><center>{item.quant}</center></TableCell>
                                <TableCell className="d-flex flex-row flex-row-reverse">
                                <center>
                                    <Button 
                                        variant="outlined"
                                        className={"mx-2"}
                                        onClick={() => handleEditarOpen(item.estoque_produto.id)}
                                        >🖉 Atualizar Estoque</Button>
                                </center>        
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
        )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
