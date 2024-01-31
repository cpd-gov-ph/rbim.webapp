import ViewData from './viewDetails'
import  Breadcrumb  from "../../components/Breadcrumb/index";
const ViewBarangay = () => {
  return (
    <div className="bread-title">
      <Breadcrumb breadcrumb_lists={[{heading:'Barangay', link:'/barangay'}, {heading:'View Details', link:''}]}/>
     <ViewData/>
    </div>
  );
};

export default ViewBarangay;