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
export default function Cabecalho() {

  return (
    <nav className="navbar navbar-expand-md navbarcolor navbar-dark fixed-top shadow">
      <div className="w-100 d-flex justify-content-between">
        <div>
            <Link className="nav-link navbar-brand" href="/">Papelaria Cedral</Link>
        </div>
        <List className="navbar-nav ml-auto">

            
            <ListItem className="nav-item active">
              <ListItemButton  className="nav-link" href="/">
                <HomeIcon/>Home <span className="sr-only">(current)</span>
                
              </ListItemButton>
            </ListItem>
            <ListItem>
              <div>|</div>
            </ListItem>
            <ListItem className="nav-item">
              <ListItemButton className="nav-link" href="/item/produto">
              <CategoryIcon/>Produto<span></span>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <div>|</div>
            </ListItem>
            <ListItem className="nav-item">
              
              <ListItemButton className="nav-link" href="/estoque"><Inventory2Icon/> Estoque
              
              </ListItemButton>
            </ListItem>
            <ListItem>
              <div>|</div>
            </ListItem>
            <ListItem className="nav-item">
              <ListItemButton className="nav-link" href="/venda"> <PointOfSaleIcon/> Venda
             
              </ListItemButton>
            </ListItem>
          </List>
      </div>
      
    </nav>
  );
}
