import Breadcrumb from 'react-bootstrap/Breadcrumb';
import "./style.scss"
import { Link, NavLink } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const PageBreadcrumb = ({ breadcrumb_lists, icon }) => {
  return (
    <Breadcrumb className='custom-breadcrumb'>

      {breadcrumb_lists.map(function (val, key) {
        return (
          <div className='bread-item'>
            {key !== 0 ?
              <div className='bread-slash'>/</div> : null
            }
            {val.link === "" ?
              <h4 className="page-title bread-sub-title">
                <Breadcrumb.Item active>{val.heading}</Breadcrumb.Item>
              </h4>
              :
              <h4 className="page-title">
                <NavLink activeClassName="selected" to={val.link} className="primary-color"> {icon && <span className='bread-icon me-2'><FaArrowLeft /></span>} {val.heading}</NavLink>
              </h4>
            }
          </div>
        )
      })}
    </Breadcrumb>
  );
}

export default PageBreadcrumb;