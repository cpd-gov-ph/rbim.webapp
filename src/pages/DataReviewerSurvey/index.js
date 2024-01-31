import React, { useState, useRef, useCallback } from "react";
import { NavLink } from "react-router-dom";
import drop from '../../assets/images/drop_icon.png';
import AssignedSurvey from "./AssignedSurvey";
import OngingSurvey from "./OngingSurvey";
import RejectedSurvey from './RejectedSurvey';
import CompletedSurvey from './CompletedSurvey';
import { FileUploader } from "react-drag-drop-files";
import "./style.scss";
import Button from "../../components/Form/Button";
import FormModal from "../../components/FormModal";
import { toast } from "react-toastify";
import { postUploadData } from "../../api";

function DataReviewerSurvey() {
  const fileInputRef = useRef();
  const [newOCR, showNewOCR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [whichSurvey, setWhichSurvey] = useState("assigned");
  const [uploadFile, setUploadFile] = useState([]);
  const [refreshTable,setRefreshTable]=useState(null)
  const fileTypes = ["JPEG", "PNG", "JPG"];
  const changeSurvey = (url) => {
    setWhichSurvey(url);
  };

  const handleChange = (e) => {
    let tempFileArray = [];
    Object.keys(e).forEach(key => {
      tempFileArray.push(e[key]);
    });
    setUploadFile([...uploadFile, ...tempFileArray]);
  }
  const clearUploadedFiles=()=>{
    showNewOCR(false);
    setUploadFile([]);
  }
  const filesUpload = async () => {
    setLoading(true)
    let data = new FormData();
    data.append('census_images_count', uploadFile.length)
    uploadFile.forEach((item, i) => {
      data.append('census_images[' + i + ']', item);
    });
    const res = await postUploadData("ocr-survey-entry/", {}, data);
    if (res.status === 1) {
      setLoading(false);
      showNewOCR(false);
      setUploadFile([]);
      setRefreshTable(true)
      toast.success(res.message, { theme: "colored" });
    } else {
      setLoading(false);
      toast.error(res.message, { theme: "colored" });
    }
  }
  return (
    <div className="survey-content">
      <div className="survey-header">
        <h4 className="page-title">Survey</h4>
        <Button onClick={() => showNewOCR(true)} type="submit" className="btn-primary button-width text-white">
          New OCR Survey
        </Button>

      </div>
      <div className="survey-data-wrapper survey-tab-main">
        <ul className="nav nav-tabs custom-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${whichSurvey === "assigned" ? "active" : null
                }`}
              onClick={() => changeSurvey("assigned")}
            >
              Assigned Surveys
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${whichSurvey === "ongoing" ? "active" : null
                }`}
              onClick={() => changeSurvey("ongoing")}
            >
              Ongoing Surveys
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${whichSurvey === "rejected" ? "active" : null
                }`}
              onClick={() => changeSurvey("rejected")}
            >
              Rejected Surveys
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${whichSurvey === "completed" ? "active" : null
                }`}
              onClick={() => changeSurvey("completed")}
            >
              Completed Surveys
            </button>
          </li>
        </ul>
        <div className="tab-content bg-white">
          <div className="tab-pane active p-3">
            {whichSurvey === "assigned" && (
              <AssignedSurvey apiRelaod={refreshTable}/>
            )}
            {whichSurvey === "ongoing" && (
              <OngingSurvey />
            )}
            {whichSurvey === "rejected" && (
              <RejectedSurvey />
            )}
            {whichSurvey === "completed" && (
              <CompletedSurvey />
            )}
          </div>
        </div>
      </div>
      <FormModal show={newOCR} onClose={() => clearUploadedFiles()} heading="Add new OCR survey">
        <FileUploader
          multiple={true}
          handleChange={handleChange}
          name="file"
          label={" Drop your files here or browse."}
          types={fileTypes}
          classes="ocr-document-upload mb-3"
          maxSize="5"
        />
        <div className="d-flex uploaded_files">
          {uploadFile.map((data) => (
            <>

              <span>{data.name.length > 15 ?data.name.slice(0,15)+'...':data.name}</span>

            </>
          ))}
        </div>
        <div className="text-end">
          <Button
            type="button"
            className="btn-default text-blacksix me-3"
            onClick={() => clearUploadedFiles()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loading || uploadFile.length === 0}
            loading={loading}
            onClick={() => { filesUpload() }}
            className="btn-primary text-white"
          >
            Upload
          </Button>
        </div>
      </FormModal>
    </div>
  );
}

export default DataReviewerSurvey;
