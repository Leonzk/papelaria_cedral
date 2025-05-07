"use client"

import "./page.css"
import Link from "next/link";
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
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
    <nav style={{height: "7%"}} className="navbar navbar-expand-md navbarcolor navbar-dark shadow">
      <div className="w-100 d-flex justify-content-between">
        <div>
            <Link className="nav-link navbar-brand" href="/">Papelaria Cedral</Link>
        </div>
        <List className="navbar-nav ml-auto">

            
            <ListItem className={`nav-item ${activeButton === 'home' ? 'active' : ''}`}>
              <ListItemButton onClick={() => handleButtonClick('home')}  className="nav-link" href="/">
                <div className="d-flex flex-row">
                <HomeIcon/>
                <div><span className="sr-only">(current)</span>Home</div>
                </div>
                
                
              </ListItemButton>
            </ListItem>
            <ListItem>
              <div>|</div>
            </ListItem>
            <ListItem className={`nav-item ${activeButton === 'produto' ? 'active' : ''}`}>
              <ListItemButton onClick={() => handleButtonClick('produto')} className="nav-link" href="/item/produto">
              <div className="d-flex flex-row">
              <CategoryIcon/>
              <div>Produto<span></span></div>
              </div>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <div>|</div>
            </ListItem>
            <ListItem className={`nav-item ${activeButton === 'estoque' ? 'active' : ''}`}>
              <ListItemButton onClick={() => handleButtonClick('estoque')} className="nav-link" href="/estoque">
              <div className="d-flex flex-row">
              <Inventory2Icon/> 
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
                <PointOfSaleIcon/> 
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
                <PointOfSaleIcon/> 
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
