"use client";

import "./page.css";
import Cabecalho from "../components/cabecalho/page";
import Footer from "../components/footer/page";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Modal,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import PropTypes from "prop-types";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

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

export default function CaixaPage() {
  const [loading, setLoading] = useState(false);
  const [historicoCaixa, setHistoricoCaixa] = useState([]);
  const [value, setValue] = useState(0);
  const [detalheCaixa, setDetalheCaixa] = useState(null);
  const [modalDetalhe, setModalDetalhe] = useState(false);

  const dataHoje = new Date().toISOString().split("T")[0];

  // Carrega histórico de caixas
  const carregarHistorico = () => {
    setLoading(true);
    fetch("http://localhost:5218/api/caixa/")
      .then((r) => r.json())
      .then((r) => {
        setHistoricoCaixa(r);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  const handleFecharCaixa = () => {
    setLoading(true);
    fetch("http://localhost:5218/api/caixa/fechar", {
      method: "POST",
      body: JSON.stringify({ data: dataHoje }),
      headers: { "Content-Type": "application/json" },
    })
      .then((r) => r.json())
      .then((r) => {
        toast.success("Caixa fechado com sucesso!");
        carregarHistorico();
        setLoading(false);
      })
      .catch(() => {
        toast.error("Erro ao fechar o caixa.");
        setLoading(false);
      });
  };

  // Detalhar caixa
  const handleDetalharCaixa = (caixa) => {
    setLoading(true);
    fetch(`http://localhost:5218/api/caixa/${caixa.id}`)
      .then((r) => r.json())
      .then((r) => {
        setDetalheCaixa(r);
        setModalDetalhe(true);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Cabecalho />
      <div className="principal h-100" style={{ background: "#f5f7fa", minHeight: "100vh" }}>
        <br />
        <div className="container w-100">
          <ToastContainer />
          <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab className="px-3" label="Fechar Caixa do Dia" {...a11yProps(0)} />
              <Tab className="px-3" label="Histórico de Caixas" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <Card className="mx-auto mt-3 p-3" sx={{ maxWidth: 400, mx: "auto", mt: 3, boxShadow: 3 }}>
              <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <ReceiptLongIcon color="primary" sx={{ fontSize: 50 }} />
                <Typography variant="h5" fontWeight={600}>
                  Fechar o caixa do dia
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Clique abaixo para fechar o caixa de hoje.
                </Typography>
                <Button className="p-2 rounded"
                  variant="contained"
                  color="success"
                  onClick={handleFecharCaixa}
                  disabled={loading}
                  sx={{ mt: 2, fontWeight: 600, fontSize: 16, px: 4, py: 1.5 }}
                >
                  Fechar Caixa de Hoje ({dataHoje})
                </Button>
              </CardContent>
            </Card>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <CircularProgress />
              </div>
            ) : (
              <Card className="mx-auto mt-3 shadow p-3" sx={{ maxWidth: 700, mx: "auto", mt: 3, boxShadow: 3 }}>
                <CardContent class>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Histórico de Caixas
                  </Typography>
                  <List>
                    {historicoCaixa.map((caixa, index) => (
                      <ListItem className="p-3 ml-2 mt-1"
                        key={index}
                        secondaryAction={
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleDetalharCaixa(caixa)}
                            sx={{ ml: 2 }}
                          >
                            Detalhar
                          </Button>
                        }
                        sx={{
                          borderRadius: 2,
                          mb: 1,
                          bgcolor: "#f9fafb",
                          boxShadow: 1,
                        }}
                      >
                        <ListItemIcon>
                          {caixa.status ? (
                            <Tooltip title="Fechado">
                              <CheckCircleIcon color="success" />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Aberto">
                              <HourglassEmptyIcon color="warning" />
                            </Tooltip>
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <span>
                              <b>Data:</b> {new Date(caixa.data).toLocaleDateString()}{" "}
                              <b>Status:</b> {caixa.status ? "Fechado" : "Aberto"}
                            </span>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </CustomTabPanel>

          {/* Modal de Detalhe do Caixa */}
          <Modal
            open={modalDetalhe}
            onClose={() => setModalDetalhe(false)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(2px)",
            }}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: 3,
                boxShadow: 24,
                p: 4,
                minWidth: 350,
                maxWidth: 500,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Detalhes do Caixa
              </Typography>
              {detalheCaixa ? (
                <>
                  <Typography variant="body1">
                    <b>Data:</b> {new Date(detalheCaixa.data).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1">
                    <b>Status:</b> {detalheCaixa.status ? "Fechado" : "Aberto"}
                  </Typography>
                  <Divider sx={{ width: "100%", my: 2 }} />
                  <Typography variant="h6" fontWeight={500} gutterBottom>
                    Vendas do Caixa
                  </Typography>
                  {detalheCaixa.vendas && detalheCaixa.vendas.length > 0 ? (
                    <List>
                      {detalheCaixa.vendas.map((venda, idx) => (
                        <ListItem key={idx} sx={{ px: 0 }}>
                          <ListItemIcon>
                            <ReceiptLongIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <span>
                                <b>Venda #{venda.id}</b> | Valor: R$ {venda.valor?.toFixed(2)} | Data:{" "}
                                {new Date(venda.data).toLocaleString()}
                              </span>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography color="text.secondary">Nenhuma venda encontrada para este caixa.</Typography>
                  )}
                </>
              ) : (
                <div>Carregando...</div>
              )}
            </Box>
          </Modal>
        </div>
      </div>
      <Footer />
    </div>
  );
}