"use client";

import "./page.css";
import Cabecalho from "../../components/cabecalho/page";
import Footer from "../../components/footer/page";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
import {
    Button,
    TableBody,
    TableRow,
    TableCell,
    TableFooter,
    TablePagination,
    Table,
    TableHead,
    CircularProgress,
    TextField,
} from "@material-ui/core";
import { Box, Modal } from "@mui/material";

export default function Servicos() {
    const [loading, setLoading] = useState(true);
    const [stateEditar, setStateEditar] = useState(false);
    const [stateNovo, setStateNovo] = useState(false);
    const [stateServico, setStateServico] = useState({
        nome: "",
        valor: 0,
        disponivel: 1,
    });
    const [stateServicoId, setStateServicoId] = useState("");
    const [stateServicos, setStateServicos] = useState([]);
    const [stateTotal, setStateTotal] = useState(0);
    const [filtro, setFiltro] = useState("");

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:5218/api/item/servico")
            .then((r) => r.json())
            .then((r) => {
                setStateServicos(r);
                setStateTotal(r.length);
                setLoading(false);
            });
    }, []);

    async function handleFiltro() {
        if (filtro !== "") {
            await fetch("http://localhost:5218/api/item/servico")
                .then((r) => r.json())
                .then((r) => {
                    const newArray = r.filter(
                        (item) =>
                            item.nome.includes(filtro) ||
                            item.id == filtro
                    );
                    setStateServicos(newArray);
                });
        } else {
            await fetch("http://localhost:5218/api/item/servico")
                .then((r) => r.json())
                .then((r) => {
                    setStateServicos(r);
                });
        }
    }

    async function handleExcluir(id) {
        if (confirm("Deseja realmente excluir este Serviço?")) {
            const requestOptions = {
                method: "POST",
                body: "",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }),
            };

            const response = await fetch(
                `http://localhost:5218/api/item/servico/deletar/${id}`,
                requestOptions
            );
            toast.success("Serviço Excluído com Sucesso", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            await fetch("http://localhost:5218/api/item/servico")
                .then((r) => r.json())
                .then((r) => {
                    setStateServicos(r);
                });
        }
    }

    async function handleEditarOpen(id) {
        await fetch(`http://localhost:5218/api/item/servico/${id}`)
            .then((r) => r.json())
            .then((r) => {
                setStateServico(r);
                setStateServicoId(id);
            });
        setStateEditar(true);
    }

    function handleEditarClose() {
        setStateEditar(false);
    }

    async function handleEditarSalvar(id) {
        const requestOptions = {
            method: "POST",
            body: JSON.stringify(stateServico),
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        };

        await fetch(
            `http://localhost:5218/api/item/servico/atualizar/${id}`,
            requestOptions
        );

        setStateEditar(false);
        toast.success("Serviço Alterado com Sucesso", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });

        await fetch("http://localhost:5218/api/item/servico")
            .then((r) => r.json())
            .then((r) => {
                setStateServicos(r);
            });
    }

    function handleNovoOpen() {
        setStateServico({
            nome: "",
            valor: 0,
            disponivel: 1,
        });
        setStateNovo(true);
    }

    function handleNovoClose() {
        setStateNovo(false);
    }

    async function handleNovoSalvar() {
        const requestOptions = {
            method: "POST",
            body: JSON.stringify(stateServico),
            headers: new Headers({
                "Content-Type": "application/json",
                Accept: "application/json",
            }),
        };

        await fetch(`http://localhost:5218/api/item/servico`, requestOptions)
            .then((r) => r.json())
            .then((r) => {
                if (r.status === 400 || r.status === 422 || r.status === 409) {
                    toast.error("Serviço Já Cadastrado", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                } else {
                    toast.success("Serviço Cadastrado com Sucesso", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });

                    setStateServico({
                        nome: "",
                        valor: 0,
                        disponivel: 1,
                    });

                    fetch("http://localhost:5218/api/item/servico")
                        .then((r) => r.json())
                        .then((r) => {
                            setStateServicos(r);
                        });
                }
            });

        setStateNovo(false);
    }

    const handleFiltrar = (event) => {
        const valor = event.target.value;
        setFiltro(valor);
    };

    return (
        <div>
            <Cabecalho></Cabecalho>

            <div className="principal">
                <br></br>
                <div className="container w-100">
                    {loading ? (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ height: "50vh" }}
                        >
                            <CircularProgress />
                        </div>
                    ) : (
                        <div className="flexcontainer w-100">
                            <ToastContainer />
                            <Modal
                                open={stateEditar}
                                onClose={() => handleEditarClose()}
                            >
                                <Box className="modal-container">
                                    <div className="modal-header">
                                        <h2>Atualizar Serviço</h2>
                                    </div>
                                    <div className="modal-body">
                                        <label
                                            htmlFor="nome"
                                            className="form-label"
                                        >
                                            Nome
                                        </label>
                                        <div className="input-group">
                                            <TextField
                                                value={stateServico.nome}
                                                onChange={(e) =>
                                                    setStateServico(
                                                        (stateServico) => ({
                                                            ...stateServico,
                                                            nome: e.target.value,
                                                        })
                                                    )
                                                }
                                                type="text"
                                                className="form-control"
                                                id="nome"
                                            />
                                        </div>

                                        <label
                                            htmlFor="valor"
                                            className="form-label"
                                        >
                                            Valor
                                        </label>
                                        <div className="input-group">
                                            <NumericFormat
                                                value={stateServico.valor}
                                                onValueChange={(values) => {
                                                    const { value } = values; // Valor numérico sem formatação
                                                    setStateServico((stateServico) => ({ ...stateServico, valor: value }));
                                                }}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                prefix="R$ "
                                                className="form-control"
                                                id="valor"
                                                allowNegative={false}
                                            />
                                        </div>

                                        <label htmlFor="disponivel" className="form-label">
                                            Disponível
                                        </label>
                                        <div className="input-group col-4">
                                            <select
                                                value={stateServico.disponivel}
                                                onChange={(e) =>
                                                    setStateServico((stateServico) => ({
                                                        ...stateServico,
                                                        disponivel: parseInt(e.target.value), // Converte para número
                                                    }))
                                                }
                                                className="form-control"
                                                id="disponivel"
                                            >
                                                <option value={1}>Sim</option>
                                                <option value={0}>Não</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <Button
                                            onClick={() =>
                                                handleEditarSalvar(
                                                    stateServicoId
                                                )
                                            }
                                            variant="contained"
                                            color="success"
                                            className="btn btn-primary"
                                        >
                                            Alterar
                                        </Button>
                                    </div>
                                </Box>
                            </Modal>

                            <Modal
                                className="mx-auto"
                                open={stateNovo}
                                onClose={() => handleNovoClose()}
                            >
                                <Box className="modal-container">
                                    <div className="modal-header">
                                        <h2>Novo Serviço</h2>
                                    </div>
                                    <div className="modal-body">
                                        <label
                                            htmlFor="nome"
                                            className="form-label"
                                        >
                                            Nome
                                        </label>
                                        <div className="input-group">
                                            <TextField
                                                value={stateServico.nome}
                                                onChange={(e) =>
                                                    setStateServico(
                                                        (stateServico) => ({
                                                            ...stateServico,
                                                            nome: e.target.value,
                                                        })
                                                    )
                                                }
                                                type="text"
                                                className="form-control"
                                                id="nome"
                                            />
                                        </div>

                                        <label
                                            htmlFor="valor"
                                            className="form-label"
                                        >
                                            Valor
                                        </label>
                                        <div className="input-group">
                                            <NumericFormat
                                                value={stateServico.valor}
                                                onValueChange={(values) => {
                                                    const { value } = values; // Valor numérico sem formatação
                                                    setStateServico((stateServico) => ({ ...stateServico, valor: value }));
                                                }}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                prefix="R$ "
                                                className="form-control"
                                                id="valor"
                                                allowNegative={false}
                                            />
                                        </div>

                                        <label htmlFor="disponivel" className="form-label">
                                            Disponível
                                        </label>
                                        <div className="input-group col-4">
                                            <select
                                                value={stateServico.disponivel}
                                                onChange={(e) =>
                                                    setStateServico((stateServico) => ({
                                                        ...stateServico,
                                                        disponivel: parseInt(e.target.value), // Converte para número
                                                    }))
                                                }
                                                className="form-control"
                                                id="disponivel"
                                            >
                                                <option value={1}>Sim</option>
                                                <option value={0}>Não</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <Button
                                            onClick={() => handleNovoSalvar()}
                                            variant="contained"
                                            color="success"
                                            className="btn btn-primary"
                                        >
                                            Criar
                                        </Button>
                                    </div>
                                </Box>
                            </Modal>
                            <div className="input-group mb-3 w-100">
                                <TextField
                                    onChange={handleFiltrar}
                                    value={filtro}
                                    type="text"
                                    className="form-control"
                                    id="standard-basic"
                                    label="Filtro"
                                    variant="standard"
                                />

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleFiltro}
                                    className="ml-2"
                                >
                                    Pesquisar
                                </Button>

                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={handleNovoOpen}
                                    className="ml-3"
                                >
                                    Novo
                                </Button>
                            </div>
                            <br></br>
                            <Table className="shadow p-5 mb-5 bg-white rounded">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <center>Serviço Id</center>
                                        </TableCell>
                                        <TableCell>
                                            <center>Nome</center>
                                        </TableCell>
                                        <TableCell>
                                            <center>Valor</center>
                                        </TableCell>
                                        <TableCell>
                                            <center>Disponível</center>
                                        </TableCell>
                                        <TableCell>
                                            <center>Ações</center>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stateServicos.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <center>{item.id}</center>
                                            </TableCell>
                                            <TableCell>
                                                <center>{item.nome}</center>
                                            </TableCell>
                                            <TableCell>
                                                <center>
                                                    {new Intl.NumberFormat(
                                                        "pt-BR",
                                                        {
                                                            style: "currency",
                                                            currency: "BRL",
                                                        }
                                                    ).format(item.valor)}
                                                </center>
                                            </TableCell>
                                            <TableCell>
                                                <center>
                                                    {item.disponivel === 1
                                                        ? "Sim"
                                                        : "Não"}
                                                </center>
                                            </TableCell>
                                            <TableCell className="d-flex flex-row flex-row-reverse">
                                                <Button
                                                    variant="outlined"
                                                    className={"mx-2"}
                                                    onClick={() =>
                                                        handleExcluir(item.id)
                                                    }
                                                >
                                                    🗑 Excluir
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    className={"mx-2"}
                                                    onClick={() =>
                                                        handleEditarOpen(
                                                            item.id
                                                        )
                                                    }
                                                >
                                                    🖉 Editar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TableCell>
                                            Registros {stateServicos.length}/
                                            {stateTotal}
                                        </TableCell>
                                        <TablePagination
                                            rowsPerPage={20}
                                            page={0}
                                            count={stateServicos.length}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                            {stateServicos.length === 0 ? (
                                <h2>Sem Resultados</h2>
                            ) : (
                                <></>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}