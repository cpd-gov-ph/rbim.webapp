import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from "../../components/Form/Button";
import ClientSideTable from "../../components/ClientSideTable";
// import './dataCollector.scss';
import { useParams } from "react-router-dom";
import { postData } from '../../api';
import { toast } from "react-toastify";
import ViewTaskModal from './viewTaskModal';
import DeleteTaskModal from './deleteTaskModal';

function ViewAssignedTask() {
  let { id } = useParams();
  const [validated, setValidated] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [viewTaskShowModal, setviewTaskModal] = useState(false);
  const [deleteTaskShowModal, setDeleteTaskShowModal] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState('');
  const [taskObject, setTaskObject] = useState({
    title: "",
    description: ""
  });


  const handleInput = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setTaskObject((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    if (form.checkValidity() === true) {
      saveAssignedTask();
    }
  };

  const saveAssignedTask = async () => {
    taskObject['data_collector'] = id;
    const res = await postData("create-task/", {}, taskObject);
    if (res.status === 1) {
      toast.success(res.message, { theme: "colored" });
      setTaskObject({ title: "", description: "" });
      setValidated(false);
      getListTask();
    }
    else {
      toast.error(res.message, { theme: "colored" });
    }
  }


  useEffect(() => {
    getListTask();
  }, []);

  //View task 
  const ViewClick = (row) => {
    console.log(row);
    setSelectedRow(row);
    setviewTaskModal(true);
  };

  // delete task
  const DeleteClick = (row) => {
    setDeleteTaskId(row.id);
    setDeleteTaskShowModal(true);
  };

  const viewTaskModalClose = () => {
    setviewTaskModal(false);
  };

  const actionButton = (row) => {
    return (
      <>
        <div className="action-buttons">
          {/* <button className="btn btn-link me-3"  onClick={() => EditClick(row)}>
                <i className="fa fa-pencil"></i>
              </button> */}
          <button className="btn btn-link me-3" onClick={() => DeleteClick(row)}>
            <i className="fa fa-solid fa-trash"></i>
          </button>
          <button className="btn btn-link " onClick={() => ViewClick(row)}>
            <i className="fa fa-eye" aria-hidden="true"></i>
          </button>
        </div>
      </>
    );
  };

  const columns = [
    {
      accessorKey: "task_no",
      header: "Task No",
    },
    {
      accessorKey: "title",
      header: "Location allocated",
    },
    {
      accessorKey: "description",
      header: "Notes",
      headerStyle: { width: "30%" },
      style: { whiteSpace: 'pre-wrap', width: "30%",  overflowWrap:'anywhere'},
    },
    {
      accessorKey: "action",
      header: "Action",
      headerStyle: { width: "15%", textAlign: "center" },
      cell: (props) => actionButton(props.row.original),
      style: { textAlign: "center" },
    },
  ];

  const getListTask = async () => {
    const listObject = {
      "page": 1,
      "page_size": 10,
      "search": "",
      "data_collector_id": id
    }
    const res = await postData("data-collector-task-list/", {}, listObject);
    if (res && res.status === 1) {
      setTaskList(res.data);
    }
  };

  return (
    <div className='view-details'>
      <div className='view-details-section'>
        <div className='view-heading'>
          <h3>Assign Task</h3>
        </div>
        <div className='assign-view-body p-4'>

          <Form noValidate validated={validated} onSubmit={handleSubmit} autoComplete="off">
            <div className="row">
              <div className="col-md-9">
                <div className="row">
                  <div className="col-md-12">
                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                      <Form.Label column="true" sm={4} className="required">Locality name</Form.Label>
                      <Col column="true" sm={8}>
                        <Form.Control type="text"
                          name="title"
                          value={taskObject.title}
                          onChange={handleInput}
                          required />
                        <Form.Control.Feedback type="invalid" >
                          This field is required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                      <Form.Label column="true" sm={4} className="required">Notes</Form.Label>
                      <Col column="true" sm={8} className="position-relative">
                        <Form.Control
                          type="text"
                          as="textarea"
                          name="description"
                          value={taskObject.description}
                          onChange={handleInput}
                          required rows={5}
                          maxLength="200" />
                        <small className="float-right mt-1">
                          *Remaining character{" "}
                          {taskObject &&
                            taskObject.description === null
                            ? 200
                            : 200 -
                            parseInt(
                              taskObject.description?.length
                            )}
                        </small>
                        <Form.Control.Feedback type="invalid">
                          This field is required
                        </Form.Control.Feedback>
                      </Col>
                    </Form.Group>
                  </div>
                </div>
              </div>
              <div className="col-md-12 text-end">
                <Button
                  type="button"
                  className="btn-secondary button-width me-2"
                  onClick={() => setTaskObject({ title: "", description: "" })}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={false}
                  loading={false}
                  className="btn-primary button-width text-white"
                >
                  Assign
                </Button>
              </div>
            </div>
          </Form>
        </div>
        <div className="assigned-task-list mt-4">
          <div className='view-heading'>
            <h3>Assigned Tasks</h3>
          </div>
          <div className="p-4">
            <div className="client-side-table">
              <ClientSideTable columns={columns} data={taskList} sizePerPage={20} />
            </div>
          </div>
        </div>
      </div>
      {viewTaskShowModal && <ViewTaskModal selectedRow={selectedRow} show={viewTaskShowModal} onClose={viewTaskModalClose} />}
      {deleteTaskShowModal && (<DeleteTaskModal show={deleteTaskShowModal} deleteTaskId={deleteTaskId} getListTask={getListTask} onClose={() => setDeleteTaskShowModal(false)} />)}
    </div>
  );
}

export default ViewAssignedTask;