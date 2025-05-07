"use client"

import "./page.css"
import Link from "next/link";
import Cabecalho from "../components/cabecalho/page";
import { useEffect, useState } from "react";
import ReactModal from 'react-modal';
import MaskedInput from 'react-text-mask';
import Footer from "../components/footer/page";
import {Button,TableBody,TableRow,TableCell, IconButton, TableFooter, TablePagination, Table,TableHead,Paper,Typography,CircularProgress, TextField,} from "@material-ui/core";
import { Box, Modal, Tab, Tabs } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import { AddShoppingCart } from "@mui/icons-material";
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

    const [loading, setLoading] = useState(true);
    const [sugestoes, setSugestoes] = useState([]);
    const [errorItem, seterrorItem] = useState(false)
    const [stateModal, setstateModal] = useState(false);
    const [stateItem, setStateItem] = useState()
    const [stateView, setStateView] = useState([]);
    const [stateItens, setStateItens] = useState([]);
    const [stateVendas, setStateVendas] = useState([]);
    const [stateTotal, setStateTotal] = useState(0);
    const [filtro, setFiltro] = useState("");
    
    const [topItems, setTopItems] = useState([]);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    const fetchTopItems = () => {
        fetch(`http://localhost:5218/api/venda/grafico/itens?dataInicio=${dataInicio}&dataFim=${dataFim}`)
            .then((r) => r.json())
            .then((data) => {
                setTopItems(data);
            })
            .catch((err) => console.error("Erro ao buscar dados para gráficos:", err));
    };

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:5218/api/venda")
        .then(r => r.json())
        .then(r =>{
            setStateVendas(r);
            setStateTotal(r.length);
            
            console.log(r);

            setLoading(false);
        })
        .catch(() => setLoading(false));
        const hoje = new Date();
        const inicioPadrao = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split("T")[0];
        const fimPadrao = hoje.toISOString().split("T")[0];
        setDataInicio(inicioPadrao);
        setDataFim(fimPadrao);
        fetchTopItems();
    }, []);

    const cnpjmask = [/[1-9]/,/[1-9]/," ", /[1-9]/,/[1-9]/,/[1-9]/," ", /[1-9]/,/[1-9]/,/[1-9]/,"/","0","0","0","1","-",/[1-9]/,/[1-9]/];

    const topItemsData = {
        labels: Array.isArray(topItems) ? topItems.map((item) => item.itemNome) : [], // Meses no eixo X
        datasets: [
            {
                label: "Quantidade Vendida",
                data: Array.isArray(topItems) ? topItems.map((item) => item.quantidadeVendida) : [], // Quantidade no eixo Y
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };
    
    const optionstopItems = {
        indexAxis: "x", // Configura o gráfico para barras verticais (eixo X = meses, eixo Y = quantidade)
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Itens Mais Vendidos por Mês",
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Mês",
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Quantidade Vendida",
                },
            },
        },
    };

    async function handleGetGraficos(){
        if (dataInicio && dataFim) {
            fetchTopItems(); // Faz o fetch dos gráficos com as datas selecionadas
        } else {
            toast.error("Por favor, selecione as datas de início e fim.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }
    async function handleFiltro(){
        console.log(filtro);
        if(filtro!=""){
            await fetch(`http://localhost:5218/api/estoque/codbarra/${filtro}`)
            .then(r => r.json())
            .then(r =>{
                console.log(r);
                console.log(r.status)
                if(r.status == 400 || r.status == 404){
                    console.log(stateItens);
                    toast.error('Produto Não Encontrado', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        });
                }
                else{
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

    const handleFiltrar = async (event) => {
        const valor = event.target.value;
        setFiltro(valor);
    
        if (valor.length > 3) {
            try {
                await fetch("http://localhost:5218/api/item/produto")
                .then(r => r.json())
                .then(r =>{
                    var newArray = r.filter(function (item){
                        return item.nome.includes(valor) ||
                                item.cod_barra.includes(valor) ||
                                item.id == valor
                    });
                    console.log(newArray);
                    setSugestoes(newArray);
                    console.log(r);
                });
            } catch (error) {
                console.error("Erro ao buscar sugestões:", error);
            }
        } else {
            setSugestoes([]); // Limpa as sugestões se o valor for menor que 3 caracteres
        }
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

                console.log(r)
                if(r.status == 400 || r.status == 422){
                    toast.error('Venda Não Realizada', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        });
                }
                else{
                    toast.success('Venda Realizada Com Sucesso', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });

                    setStateItens([]);
                    fetch("http://localhost:5218/api/venda")
                    .then(r => r.json())
                    .then(r =>{
                        setStateVendas(r);
                        setStateTotal(r.length);
                        
                        console.log(r);
                    });
                }
            }).catch((e) => {
                console.log(e);
                toast.error('Venda Não Realizada', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
            });
        

        
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
                                <Divider></Divider>
                                <List className="d_flex flex-row mx-auto align-item-center">
                                    <ListItem alignItems="center">Nome Item = {item.item.nome}</ListItem>

                                    <ListItem alignItems="center">Quantidade Item = {item.quant}</ListItem>
                                </List>
                                <List>
                                    <ListItem>Valor Unitário = {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.item.valor)}</ListItem>

                                    <ListItem>Valor Total = {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.item.valor * item.quant)}</ListItem>
                                </List>
                                <Divider>Item {index+1}</Divider>
                            </div>
                            
                        ))}
                        </div>
                    </Box>
                </Modal>
                {loading ? (
                        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                            <CircularProgress />
                        </div>
                    ) : (
            <div className="flexcontainer w-100">
                <ToastContainer />
                <Box sx={{width: "100%", borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab className="px-3" label="Realizar Venda" {...a11yProps(0)} />
                    <Tab className="px-3" label="Gerenciamento de Vendas" {...a11yProps(1)} />
                    <Tab className="px-3" label="Graficos de Vendas" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                
                <CustomTabPanel value={value} index={0}>
                <div className="d-flex flex-row">
                    <div className="divpesquisa d-flex flex-column" style={{height: "3vh" }}>
                        <div>
                            <TextField onPaste={handleFiltro} onChange={handleFiltrar} value={filtro} type="text" id="standard-basic" label="Nome (ou) Código de Barras" variant="standard" className="form-control"/>
                        </div>
                        <div className="mt-3">
                            <center>
                                <Button onClick={handleFiltro} className="btn mx-2" id="botao" variant="contained" color="primary">Adicionar  <AddShoppingCart/></Button>
                            </center>
                        </div>

                        {sugestoes.length > 0 && (
                            <Table className="tableresultado shadow p-3 mb-3 bg-white rounded">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><center>ID</center></TableCell>
                                        <TableCell><center>Nome</center></TableCell>
                                        <TableCell><center>Cod. Barras</center></TableCell>
                                        <TableCell><center>Valor</center></TableCell>
                                        <TableCell><center>Ação</center></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {sugestoes.map((produto, index) => (
                                        <TableRow key={index}>
                                            <TableCell><center>{produto.id}</center></TableCell>
                                            <TableCell><center>{produto.nome}</center></TableCell>
                                            <TableCell><center>{produto.cod_barra}</center></TableCell>
                                            <TableCell>
                                                <center>
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.valor)}
                                                </center>
                                            </TableCell>
                                            <TableCell>
                                                <center>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={() => {
                                                            const existingItem = stateItens.find(item => item.estoque_produto.id === produto.id);
                                                            if (existingItem) {
                                                                // Atualiza a quantidade do item existente
                                                                setStateItens(stateItens.map(item =>
                                                                    item.estoque_produto.id === produto.id
                                                                        ? { ...item, quant: item.quant + 1 }
                                                                        : item
                                                                ));
                                                            } else {
                                                                // Adiciona o novo item
                                                                setStateItens([...stateItens, { estoque_produto: produto, quant: 1 }]);
                                                            }
                                                        }}
                                                    >
                                                        Adicionar
                                                    </Button>
                                                </center>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
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
                                    <TableCell><center>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.estoque_produto.valor)}</center></TableCell>
                                    <TableCell>
                                        <center className="d-flex align-items-center justify-content-center">
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                size="small"
                                                style={{ minWidth: '30px', padding: '2px 5px' }}
                                                onClick={() => {
                                                    if (item.quant > 1) {
                                                        setStateItens(stateItens.map((currentItem) =>
                                                            currentItem.estoque_produto.id === item.estoque_produto.id
                                                                ? { ...currentItem, quant: currentItem.quant - 1 }
                                                                : currentItem
                                                        ));
                                                    }
                                                }}
                                            >
                                                -
                                            </Button>
                                            <span style={{ margin: "0 10px" }}>{item.quant}</span>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                style={{ minWidth: '30px', padding: '2px 5px' }}
                                                onClick={() => {
                                                    setStateItens(stateItens.map((currentItem) =>
                                                        currentItem.estoque_produto.id === item.estoque_produto.id
                                                            ? { ...currentItem, quant: currentItem.quant + 1 }
                                                            : currentItem
                                                    ));
                                                }}
                                            >
                                                +
                                            </Button>
                                        </center>
                                    </TableCell>
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
                                <TableCell colSpan={6} align="right">
                                    Preço Total: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                        stateItens.reduce((total, item) => total + item.estoque_produto.valor * item.quant, 0)
                                    )}
                                </TableCell>
                                {/* <TablePagination rowsPerPage={20} page={0} count={stateItens.length}  /> */}
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
                                    <TableCell>
                                        <center>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)}
                                        </center>
                                    </TableCell>
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

                <CustomTabPanel value={value} index={2}>
                    <div>
                        <div className="d-flex flex-column align-items-center">
                            <br></br>
                            <h3>Itens Mais Vendidos</h3>
                            <br></br>
                            <div className="d-flex mb-3 align-items-center">
                                <TextField
                                    type="date"
                                    label="Data Inicial"
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    className="mr-3 styled-date-field"
                                    variant="outlined"
                                    size="small"
                                />
                                <TextField
                                    type="date"
                                    label="Data Final"
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    className="mr-3 styled-date-field"
                                    variant="outlined"
                                    size="small"
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleGetGraficos}
                                    className="styled-filter-button"
                                >
                                    Filtrar
                                </Button>
                            </div>
                            <Bar data={topItemsData} options={optionstopItems} />
                        </div>
                    </div>
                </CustomTabPanel>
            </div>
            )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
