"use client";

import "./page.css";
import Link from "next/link";
import Cabecalho from "../components/cabecalho/page";
import CabecalhoNovo from "../components/cabecalhonovo/page"
import Footer from "../components/footer/page";
import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Divider, Modal, TextField, Tabs, Tab } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import PropTypes from "prop-types";

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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Postagens() {
  const [loading, setLoading] = useState(false);
  const [caixaAberto, setCaixaAberto] = useState(false);
  const [valorInicial, setValorInicial] = useState("");
  const [valorFinal, setValorFinal] = useState("");
  const [historicoCaixa, setHistoricoCaixa] = useState([]);
  const [stateModal, setStateModal] = useState(false);
  const [value, setValue] = useState(0);

  const dataHoje = new Date().toISOString().split("T")[0]; // Data de hoje no formato YYYY-MM-DD

  useEffect(() => {
    // Simula a busca do histórico de caixas
    setLoading(true);
    fetch("http://localhost:5218/api/caixa/historico")
      .then((r) => r.json())
      .then((r) => {
        setHistoricoCaixa(r);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAbrirCaixa = () => {
    if (!valorInicial || isNaN(valorInicial)) {
      toast.error("Insira um valor inicial válido!");
      return;
    }

    // Simula a abertura do caixa
    fetch("http://localhost:5218/api/caixa/abrir", {
      method: "POST",
      body: JSON.stringify({ data: dataHoje, valorInicial: parseFloat(valorInicial) }),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then(() => {
        setCaixaAberto(true);
        toast.success("Caixa aberto com sucesso!");
      })
      .catch(() => toast.error("Erro ao abrir o caixa."));
  };

  const handleFecharCaixa = () => {
    if (!valorFinal || isNaN(valorFinal)) {
      toast.error("Insira um valor final válido!");
      return;
    }

    // Simula o fechamento do caixa
    fetch("http://localhost:5218/api/caixa/fechar", {
      method: "POST",
      body: JSON.stringify({ data: dataHoje, valorFinal: parseFloat(valorFinal) }),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then(() => {
        setCaixaAberto(false);
        toast.success("Caixa fechado com sucesso!");
      })
      .catch(() => toast.error("Erro ao fechar o caixa."));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <CabecalhoNovo />
      <div className="principal h-100">
        <br />
        <div className="container w-100">
          <ToastContainer />
          <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab className="px-3" label="Gerenciar Caixa" {...a11yProps(0)} />
              <Tab className="px-3" label="Histórico de Caixas" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <div className="d-flex flex-column align-items-center">
              {caixaAberto ? (
                <div className="d-flex flex-column align-items-center">
                  <h3>Caixa Aberto</h3>
                  <TextField
                    label="Valor Final"
                    variant="outlined"
                    type="number"
                    value={valorFinal}
                    onChange={(e) => setValorFinal(e.target.value)}
                    className="mb-3"
                  />
                  <Button variant="contained" color="error" onClick={handleFecharCaixa}>
                    Fechar Caixa
                  </Button>
                </div>
              ) : (
                <div className="d-flex flex-column align-items-center">
                  <h3>Caixa Fechado</h3>
                  <TextField
                    label="Valor Inicial"
                    variant="outlined"
                    type="number"
                    value={valorInicial}
                    onChange={(e) => setValorInicial(e.target.value)}
                    className="mb-3"
                  />
                  <Button variant="contained" color="primary" onClick={handleAbrirCaixa}>
                    Abrir Caixa
                  </Button>
                </div>
              )}
            </div>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <CircularProgress />
              </div>
            ) : (
              <div>
                <h3>Histórico de Caixas</h3>
                <ul>
                  {historicoCaixa.map((caixa, index) => (
                    <li key={index}>
                      Data: {caixa.data} | Valor Inicial: {caixa.valorInicial} | Valor Final: {caixa.valorFinal}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CustomTabPanel>
        </div>
      </div>
      <Footer />
    </div>
  );
}