"use client"

import "./page.css"
import Link from "next/link";
import Cabecalho from "../components/cabecalho/page";
import { useEffect, useState } from "react";
import ReactModal from 'react-modal';
import MaskedInput from 'react-text-mask';
import Footer from "../components/footer/page";
import {Button,TableBody,TableRow,TableCell, IconButton, TableFooter, TablePagination, Table,TableHead,Paper,Tooltip,Typography,CircularProgress, TextField,} from "@material-ui/core";
import { Box, Modal, Tab, Tabs } from "@mui/material";
import { AddShoppingCart } from "@mui/icons-material";
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default function Postagens(props){

    const [errorItem, seterrorItem] = useState(false)
    const [stateModal, setstateModal] = useState(false);
    const [stateItem, setStateItem] = useState()
    const [stateView, setStateView] = useState([]);
    const [stateItens, setStateItens] = useState([]);
    const [stateVendas, setStateVendas] = useState([]);
    const [stateTotal, setStateTotal] = useState(0);
    const [filtro, setFiltro] = useState("");
    useEffect(() => {
        fetch("http://localhost:5218/api/venda")
        .then(r => r.json())
        .then(r =>{
            setStateVendas(r);
            setStateTotal(r.length);
            
            console.log(r);
        });
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
        setStateItens(stateItens => stateItens.filter(item => item.id !== e));
      };

    const handleFiltrar = (event) => {
        const valor = event.target.value;
        setFiltro(valor);
    };

    async function handleModalOpen(id){
        await fetch(`http://localhost:5218/venda/${id}`)
        .then(r => r.json())
            .then(r =>{
                setStateView(r);
                console.log(r);
            });
        setstateModal(true)
    }

    function handleModalClose(){
        setstateModal(false)
    }

    async function handleVenda(){
        
        const valores = stateItens.map((item) => item);
        console.log(valores)
        var valorfinal = 0;
        for(var i=0; i<valores.length; i++){
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify({quant: valores[i].quant}),
                headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }),
            };
            valorfinal +=  (valores[i].estoque_produto.valor*valores[i].quant);
            const response = await fetch(`http://localhost:5218/api/estoque/venda/${valores[i].estoque_produto.id}`, requestOptions);
        }

            const requestOptions2 = {
                method: 'POST',
                body: JSON.stringify({valor: valorfinal}),
                headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }),
            };

            await fetch(`http://localhost:5218/api/venda/`, requestOptions2)
            .then(r => r.json())
            .then(r =>{
                
                setStateTotal(r.length);
                for(var i=0; i<valores.length; i++){
                    const requestOptions3 = {
                        method: 'POST',
                        body: JSON.stringify({id_item: valores[i].estoque_produto.id,
                            id_venda: r.id,
                            quant: valores[i].quant
                        }),
                        headers: new Headers({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                        }),
                    };

                    fetch(`http://localhost:5218/api/itemvenda/`, requestOptions3)
                }
            
            console.log(r);
        });
        

        alert("Venda Realizada Com Sucesso")
    }
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


  return (
    <div>
      <Cabecalho></Cabecalho>
      
      <div className="principal h-100">
        <br></br>
        <div className="container w-100">
            <Modal className="mx-auto" open={stateModal} onClose={() => handleModalClose()}>
                    <Box className="rounded bg-white w-50 mt-5 shadow d-flex flex-column p-3 justify-content-center mx-auto">
                        <div className=" mb-3">
                                <Divider>Itens Dentro da venda</Divider>
                        </div>
                        <div className="form-body">
                        {stateView.map((item, index) => (

                            <div className="d_flex flex-column">
                                <List className="d_flex flex-row mx-auto align-item-center">
                                    <ListItem alignItems="center">Nome = {item.item.nome}</ListItem>

                                    <ListItem alignItems="center">Quantidade = {item.quant}</ListItem>
                                </List>
                                
                                <List>
                                    <ListItem>Valor Un. = {item.item.valor}</ListItem>

                                    <ListItem>Valor Total = {(item.item.valor * item.quant)}</ListItem>
                                </List>
                                <Divider>Item {index+1}</Divider>
                            </div>
                            
                        ))}
                        </div>
                    </Box>
                </Modal>

            <div className="flexcontainer w-100">
                
                <Box sx={{width: "100%", borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab className="px-3" label="Realizar Venda" {...a11yProps(0)} />
                    <Tab className="px-3" label="Gerenciamento de Vendas" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                
                <CustomTabPanel value={value} index={0}>
                <div className="d-flex flex-row">
                    <div className="divpesquisa d-flex flex-column" style={{height: "3vh" }}>
                        <div>
                            <TextField onChange={handleFiltrar} value={filtro} type="text" id="standard-basic" label="Código de Barras" variant="standard" className="form-control"/>
                        </div>
                        <div className="mt-3">
                            <center>
                                <Button onClick={handleFiltro} className="btn mx-2" id="botao" variant="contained" color="primary">Adicionar - <AddShoppingCart/></Button>
                            </center>
                        </div>
                    </div>

                    
                    <Table className="tableresultado shadow p-5 mb-5 bg-white rounded">
                        <TableHead>
                            <TableRow>
                                <TableCell><center>ID</center></TableCell>
                                <TableCell><center>Nome</center></TableCell>
                                <TableCell><center>Cod. Barras</center></TableCell>
                                <TableCell><center>Valor</center></TableCell>
                                <TableCell><center>Quantidade</center></TableCell>
                                <TableCell><Button onClick={handleVenda} type="button" variant="contained" color="success">Realizar Venda</Button></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stateItens.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell hidden>{index}</TableCell>
                                    <TableCell><center>{item.id}</center></TableCell>
                                    <TableCell><center>{item.estoque_produto.nome}</center></TableCell>
                                    <TableCell><center>{item.estoque_produto.cod_barra}</center></TableCell>
                                    <TableCell><center>{item.estoque_produto.valor}</center></TableCell>
                                    <TableCell><center>{item.quant}</center></TableCell>
                                    <TableCell className="d-flex flex-row flex-row-reverse">
                                    <center><Button 
                                            variant="outlined"
                                            className={"mx-2"}
                                            onClick={() => handleRemoveItem(item.id)}
                                            >X</Button></center>
                                    </TableCell>
                                </TableRow>
                            ))}


                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell>Total de Itens: {stateItens.length}</TableCell>
                                <TablePagination rowsPerPage={20} page={0} count={stateItens.length}  />
                            </TableRow>
                        </TableFooter>
                    </Table>
                    
                </div>
                </CustomTabPanel>

                <CustomTabPanel value={value} index={1}>
                    <br></br>
                    <div className="input-group mb-3 w-100">
                        <TextField onChange={handleFiltrar} value={filtro} type="text" className="form-control" id="standard-basic" label="Filtro" variant="standard"   />
                        
                        <Button variant="contained" color="primary" onClick={handleFiltro} className="ml-2">Pesquisar</Button>
                    
                    </div>
                    <Table className="shadow p-5 mb-5 bg-white rounded">
                        <TableHead>
                            <TableRow>
                                <TableCell><center>Venda Id</center></TableCell>
                                <TableCell><center>Data</center></TableCell>
                                <TableCell><center>Valor</center></TableCell>
                                <TableCell className="right"><center>Ver Itens</center></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stateVendas.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell><center>{item.id}</center></TableCell>
                                    <TableCell><center>{(item.data).substring(11,19)+" | "+(item.data).substring(0,10).split('-')[2] +"/"+(item.data).substring(0,10).split('-')[1] +"/"+(item.data).substring(0,10).split('-')[0]}</center></TableCell>
                                    <TableCell><center>{item.valor}</center></TableCell>
                                    <TableCell className="d-flex flex-row flex-row-reverse">
                                    <center>
                                        <Button 
                                            variant="outlined"
                                            className={"mx-2"}
                                            onClick={() => handleModalOpen(item.id)}
                                            >🖉 Ver Itens da Venda</Button>
                                    </center>        
                                    </TableCell>
                                </TableRow>
                            ))}


                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell>Registros {stateVendas.length}/{stateTotal}</TableCell>
                                <TablePagination rowsPerPage={20} page={0} count={stateItens.length}  />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CustomTabPanel>
            </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
