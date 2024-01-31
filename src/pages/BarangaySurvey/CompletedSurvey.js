import { useEffect, useState, useRef } from "react";
import { postData, postDataDownload } from "../../api";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import './style.scss'
import moment from "moment";
import Badge from 'react-bootstrap/Badge';
import { Form, Col, Row } from "react-bootstrap";
import Button from "../../components/Form/Button";
import FileSaver from "file-saver";
import CheckedTable from "../../components/ServerSideTable/checkedTable";

const CompletedSurvey = () => {

  const [initLoading, setInitLoading] = useState(false);
  const [surveyList, setSurveyList] = useState([]);
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizeperPage] = useState(10);
  const [totalSize, setTotalSize] = useState(0);
  const [selectRowId, setSelectRowId] = useState([])
  const [selectAll, setSelectAll] = useState(false);

  // const [selectedRow, setSelectedRow] = useState([]);

  const tableRef = useRef(null);

  useEffect(() => {
    getSurveyList(page, sizePerPage, "",true);
  }, []);


  const getSurveyList = async (page, sizePerPage, search,loading) => {
    setInitLoading(loading);
    let obj = {
      page: page,
      page_size: sizePerPage,
      search: search ? search : "",
      status: "survey_completed",
    };

    const res = await postData("get-survey-list/", {}, obj);
    if (res.status === 1) {
      if (selectAll === true) {
        res.data.forEach((item) => {
          setSelectRowId((prev) => [...prev, item.id]);
        });
      }
      else {
        setSelectRowId([]);
      }
      setTotalSize(res.paginator.total_records);
      setSurveyList(res.data)
      setInitLoading(false);
    } else {
      setInitLoading(false);
      toast.error(res.message, { theme: "colored" });
    }
  }

  const surveyIDFormatter = (cell, row) => {
    return (
      <>
        <div className="survey-id">Survey ID - {row.survey_number}</div>
      </>
    )
  }

  const surveyDateFormatter = (cell, row) => {
    return (
      <>
        <div className="survey-date"><span> Date Submitted - </span>{moment(row.survey_completed_on).format("DD/MM/YYYY")} </div>
      </>
    )
  }

  const surveyCollectorIdFormatter = (cell, row) => {
    return (
      <>
        <div className="survey-date"><span> Data Reviewer ID  - </span> {row.data_reviewer.official_number} </div>
      </>
    )
  }

  const surveyStatusFormatter = (cell, row) => {
    return (
      <>
        <Badge pill bg="secondary" className="survey-status">  {row.survey_type === 'ocr' ? "OCR" : row.survey_type} </Badge>
      </>
    )
  }

  const columns = [

    {
      dataField: "survey_number",
      headerStyle: { width: "15%", textAlign: "left" },
      style: { textAlign: "left" },
      formatter: surveyIDFormatter,
    },
    {
      dataField: "assigned_date",
      headerStyle: { width: "20%", textAlign: "left" },
      style: { textAlign: "left" },
      formatter: surveyDateFormatter,
    },
    {
      dataField: "data_collector.official_number",
      headerStyle: { width: "20%", textAlign: "left" },
      style: { textAlign: "left" },
      formatter: surveyCollectorIdFormatter,
    },
    {
      dataField: "survey_type",
      headerStyle: { width: "20%", textAlign: "left" },
      style: { textAlign: "left" },
      formatter: surveyStatusFormatter,
    },
  ];

  const onFilter = (page, sizePerPage, search) => {
    setPage(page);
    setSizeperPage(sizePerPage);
    getSurveyList(page, sizePerPage, search,false);
  };


  // const getSelectedRow = (data) => {
  //  // setSelectedRow(data);
  // };

  const handleSelect = (e) => {

    if (e.target.checked === true) {
      setSelectAll(true);
      setSelectRowId([])
      surveyList.forEach((item) => {
        setSelectRowId((prev) => [...prev, item.id]);
      });

    }
    else {
      setSelectRowId([])
      setSelectAll(false);
    }
    
  }
  const downloadReport = async () => {
    
    const data = {
      is_select_all: selectAll,
      survey_entry_ids:selectAll !==true? selectRowId:[]
    }
    const res = await postDataDownload("barangay-completed-survey-reports/", {}, data).then((response) => {

      var contentDisposition = response?.headers?.get('Content-Disposition').split(';')[1];
      response.blob()?.then((res)=>{
      const url = window.URL.createObjectURL(new Blob([res],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', contentDisposition.split('=')[1]);
      document.body.appendChild(link);
      link.click();
      })
    });


  }
  const selectRows = {
    mode: "checkbox",
    selected: selectRowId,
    nonSelectable: selectAll === true ? selectRowId : [],
    style: { background: "#eee" },
    onSelect: ( row, isSelect) => {
   
      if (isSelect) {
        setSelectRowId((prev) => [...prev, row.id]);
      } else {
        var index = selectRowId.indexOf(row.id);
        if (index !== -1) {
          const dup = [...selectRowId];
          dup.splice(index, 1);
          setSelectRowId([...dup]);
        }
      }

    },
    onSelectAll: (isSelect, rows, e) => {
      if (isSelect) {
        rows.forEach((item) => {
          setSelectRowId((prev) => [...prev, item.id]);
        });
      } else {
        setSelectRowId([]);
      }
    },
  };
  const resetSelectRow = () => {
    setSelectRowId([]);
  }
  return (
    <>
      {!initLoading && (
        <div className="reviewer-survey-list">
          <div className="complete-select-all">
            <Row>
              <Col md={2} className="align-self-center">
                <Form.Group className="d-flex" controlId="formBasicCheckbox">
                  <Form.Check
                    inline
                    type="checkbox"
                    name="selectall"
                    label="Select All"
                    checked={selectAll}
                    onChange={(e) => handleSelect(e)}
                  />
                </Form.Group>
              </Col>
              <Col md={10}>
                <div className="complete-report-down-btn">
                  <Button className="btn-primary button-width text-white" onClick={() => downloadReport()}>Download report</Button>
                </div>
              </Col>
            </Row>
          </div>

          <CheckedTable
            columns={columns}
            clickSelect={true}
            data={surveyList}
            page={page}
            sizePerPage={sizePerPage}
            totalSize={totalSize}
            onFilter={onFilter}
            loading={initLoading}
            selectRow={selectRows}
            resetSelectRow={resetSelectRow}
          >
          </CheckedTable>

        </div>
      )}
      {initLoading && <Loader />}
    </>

  );
};

export default CompletedSurvey;
