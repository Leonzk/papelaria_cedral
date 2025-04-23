"use client"

import "./page.css"
import Link from "next/link";

export default function Footer() {

    return(
    <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 border-top">

        <ul className="nav col-md-4 list-unstyled d-flex">
        <li className="ms-3"><a className="text-muted" href="#"></a></li>
        <li className="ms-3"><a className="text-muted" href="#"></a></li>
        <li className="ms-3"><a className="text-muted" href="#"></a></li>
        </ul>
        <div className="col-md-4 d-flex justify-content-end align-items-center">
            <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                
            </a>
            <span className="mb-3 mb-md-0 text-muted">© 2024 Papelaria Cedral, LTDA</span>
        </div>
    </footer>
  )}