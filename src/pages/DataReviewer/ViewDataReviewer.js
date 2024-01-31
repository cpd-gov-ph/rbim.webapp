import ViewData from './viewDetails'
import  Breadcrumb  from "../../components/Breadcrumb/index";
const ViewReviewer = () => {
  return (
    <div className="bread-title">
      <Breadcrumb breadcrumb_lists={[{heading:'Data Reviewer', link:'/data-reviewer'}, {heading:'View Details', link:''}]}/>
     <ViewData/>
    </div>
  );
};

export default ViewReviewer;