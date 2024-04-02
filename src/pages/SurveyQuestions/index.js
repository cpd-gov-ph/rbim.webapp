import { useEffect, useState } from "react";
import { getData } from "../../api";
import ClientSideTable from "../../components/ClientSideTable";
//scss
import "./style.scss";
import {  useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const SurveyQuestion = () => {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);

  //action column
  const actionButton = (cell, row) => {
    return (
      <>
        <div className="action-buttons">
          <button className="btn btn-link " onClick={() => ViewClick(row)}>
            <i className="fa fa-eye" aria-hidden="true"></i>
          </button>
        </div>
      </>
    );
  };

  const columns = [
    {
      accessorKey: "position",
      header: "S.no"
    },
    {
      accessorKey: "category_name",
      header: "Questions Subheading",
    },
    {
      accessorKey: "action",
      header: "Action",
      headerStyle: { width: "15%", textAlign: "center" },
      formatter: actionButton,
      style: { textAlign: "center" },
    },
  ];

  const getQuestionList = async () => {
    setLoading(true)
    const res = await getData("get-survey-master/", {});
    console.log(res);
    if (res.status === 1) {
      setQuestionList(res.data);
      setLoading(false)
    }
  };

  useEffect(() => {
    document.body.classList.remove('adminSurveyQusView');
    getQuestionList();
  }, []);


  //View question 
  const ViewClick = (row) => {
    document.body.classList.add('adminSurveyQusView');
    navigate("/survey-question/view/" + row.id);
  };

  return (
    <>
      {!loading && (
        <div>
          <h4 className="page-title">Survey Questions</h4>
          <div className="client-side-table mt-4 survey-table">
            <ClientSideTable columns={columns} data={questionList} sizePerPage={20} />
          </div>
        </div>
      )}
      {loading && <Loader />}
    </>
  );
};

export default SurveyQuestion;
