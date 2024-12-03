"use client"

import "./page.css"
import Link from "next/link";

export default function Cabecalho() {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <Link className="nav-link navbar-brand" href="/">Papelaria Cedral</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarsExampleDefault">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" href="/">Home <span className="sr-only">(current)</span></Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/item/produto">Produto</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/estoque">Estoque</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" href="/venda">Venda</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
