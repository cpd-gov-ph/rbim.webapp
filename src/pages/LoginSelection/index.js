import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/login_selection_logo.png"
import "./style.scss";

const LoginSelection = () => {
  
    return (
      <section className="login-section p-4 position-relative">
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-md-12 text-center">
                    <div className="img mb-5 text-center">
                        <img src={logo} alt="logo" />
                        <p className="text-white">Baseline Census for the Establishment of Registry  <br></br>of Barangay Inhabitants and Migrants (RBIM)</p>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                    <div className="login-type">
                        <div className="login-head text-center">
                            <h3>Data Reviewer</h3>
                        </div>
                        <div className="login-type-body text-center">
                            <p className="mb-5">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
                                eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                            <NavLink to="/login" className="btn-primary login-selection-btn btn text-white">Sign In </NavLink>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                    <div className="login-type">
                        <div className="login-head text-center">
                            <h3>Barangay officials</h3>
                        </div>
                        <div className="login-type-body text-center">
                            <p className="mb-5">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
                                eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                            <NavLink to="/login" className="btn-primary login-selection-btn btn text-white">Sign In </NavLink>
                        </div>
                    </div>
                </div>
                <div className="col-md-8 mt-3">
                    <div className="imprint_message_section">
                        <p className="text-center">The Registry of Barangay Inhabitants and Migrants (RBIM) is a government-owned survey tool by the Commission on Population and Development (POPCOM), 
                            and supported by the Deutsche Gesellschaft für Internationale Zusammenarbeit (GIZ) GmbH through the Human Mobility in the Context of Climate Change (HMCCC) Project.</p>
                    </div>
                </div>
                 <div className="col-md-12 text-center">
                    <div className="img mt-3 text-center">
                        <p className="text-white">Sign in as a Super admin  <NavLink to="/login" className="ms-2 btn-primary super-selection-btn btn">Sign In </NavLink></p>
                    </div>
                </div>
            </div>
        </div>
        <p className="version">Web version 2.1</p>
      </section>
    );
  };
  
  export default LoginSelection;