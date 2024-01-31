import React, { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import "./style.scss";
import { getData } from '../../api';
import Loader from "../../components/Loader";
import { Card, Col, Row } from "react-bootstrap";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const DashBoard = () => {

  const [cardDetails, setCardDetails] = useState();
  const [chartDetails, setChartDetails] = useState();
  const [loading, setLoading] = useState(false);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false,
      },
    },
  };
  const labels = chartDetails?.label;
  const data = {
    labels,
    datasets: [
      {
        data: chartDetails?.survey_count,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ],
  };

  useEffect(() => {
    getCardDetails();
    getChartDetails();
  }, []);
  const getChartDetails = async () => {
    setLoading(true);
    const res = await getData("suvery-year-reports/");
    if (res.status === 1) {
      //setCardDetails(res.data);
      setChartDetails(res.data[0])
      setLoading(false);
    }
    else if (res.status === 422) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }
  const getCardDetails = async () => {
    setLoading(true);
    const res = await getData("get-dashboard-detailes/");
    if (res.status === 1) {
      setCardDetails(res.data);
      setLoading(false);
    }
    else if (res.status === 422) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }

  return (
    <>
      {!loading && (
        <>
          <Row>
            <Col md={6}>
              <h3 className="page_title">Dashboard</h3>
            </Col>
          </Row>
          <Row className="dashboard-card">
            <Col md={12}>
              <h4 className="page_sub_title mt-4 mb-3">Overview</h4>
            </Col>
            <Col md={3} sm={6} className="mb-2">
              <Card>
                <Card.Body>
                  <Card.Title>Data Collectors</Card.Title>
                  <Card.Text>
                    {cardDetails?.dashboard_count?.data_collector}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}  className="mb-2">
              <Card>
                <Card.Body>
                  <Card.Title>Data Reviewers</Card.Title>
                  <Card.Text>
                    {cardDetails?.dashboard_count?.data_reviewer}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}  className="mb-2">
              <Card>
                <Card.Body>
                  <Card.Title>Barangay Officials</Card.Title>
                  <Card.Text>
                    {cardDetails?.dashboard_count?.barangay}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}  className="mb-2">
              <Card>
                <Card.Body>
                  <Card.Title>Total Survey Conducted</Card.Title>
                  <Card.Text>
                    {cardDetails?.dashboard_count?.survey}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={12}>
              <h4 className="page_sub_title mt-4 mb-3">Survey Count by month</h4>
              <Bar options={options} data={data} />
            </Col>
          </Row>
        </>
      )}
      {loading && <Loader />}
    </>
  );
};

export default DashBoard;
