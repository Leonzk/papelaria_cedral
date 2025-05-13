"use client"

import "./page.css"
import Link from "next/link";
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PrintIcon from '@mui/icons-material/Print';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ListItemButton, ListItemIcon } from "@mui/material";
import { useState } from "react";

export default function Cabecalho() {

  const [activeButton, setActiveButton] = useState('');

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };
  
  return (
    <nav style={{height: "8vh"}} className="navbar navbar-expand-md navbarcolor navbar-dark shadow">
      <div className="w-100 d-flex justify-content-between">
        <div>
            <Link className="nav-link navbar-brand" href="/">Papelaria Cedral</Link>
        </div>
        <List className="navbar-nav ml-auto">

            
            <ListItem className={`nav-item ${activeButton === 'servico' ? 'active' : ''}`}>
              <ListItemButton onClick={() => handleButtonClick('servico')}  className="nav-link" href="/item/servico">
                <div className="d-flex flex-row">
                <PrintIcon style={{ marginRight: "8px" }}/>
                <div><span className="sr-only"></span>Serviço</div>
                </div>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <div>|</div>
            </ListItem>
            <ListItem className={`nav-item ${activeButton === 'produto' ? 'active' : ''}`}>
              <ListItemButton onClick={() => handleButtonClick('produto')} className="nav-link" href="/item/produto">
              <div className="d-flex flex-row">
              <StorefrontIcon style={{ marginRight: "8px" }}/>
              <div><span className="sr-only"></span>Produto</div>
              </div>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <div>|</div>
            </ListItem>
            <ListItem className={`nav-item ${activeButton === 'estoque' ? 'active' : ''}`}>
              <ListItemButton onClick={() => handleButtonClick('estoque')} className="nav-link" href="/estoque">
              <div className="d-flex flex-row">
              <WarehouseIcon style={{ marginRight: "8px" }}/> 
              <div>Estoque<span></span></div>
              </div>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <div>|</div>
            </ListItem>
            <ListItem className={`nav-item ${activeButton === 'venda' ? 'active' : ''}`}>
              <ListItemButton onClick={() => handleButtonClick('venda')} className="nav-link" href="/venda">
              <div className="d-flex flex-row">
                <ShoppingCartIcon style={{ marginRight: "8px" }}/> 
                <div>Venda<span>
                  </span></div>
              </div>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <div>|</div>
            </ListItem>
            <ListItem className={`nav-item ${activeButton === 'caixa' ? 'active' : ''}`}>
              <ListItemButton onClick={() => handleButtonClick('caixa')} className="nav-link" href="/caixa">
              <div className="d-flex flex-row">
                <PointOfSaleIcon style={{ marginRight: "8px" }}/> 
                <div>Caixa<span>
                  </span></div>
              </div>
              </ListItemButton>
            </ListItem>
          </List>
      </div>
      
    </nav>
  );
}
