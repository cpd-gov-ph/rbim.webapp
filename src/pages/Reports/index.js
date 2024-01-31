import React, { useState, useEffect ,useRef} from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,

} from 'chart.js';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import Select, { components } from "react-select";
import Button from "../../components/Form/Button";
import "./style.scss";
import { Card, Col, Row } from "react-bootstrap";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getData, postData, postDataDownload } from "../../api";
import { toast } from "react-toastify";
import FileSaver from "file-saver";
import AsyncSelect from 'react-select/async';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels,
  {
    id: 'hideAxisX',
    afterDraw(chartInstance, arg, options) {
      if (chartInstance.config.data.datasets[0]?.total_population) {
        let ctx = chartInstance.ctx;
        let width = chartInstance.chartArea.width;
        let height = chartInstance.chartArea.height;
        let total = chartInstance.config.data.datasets[0].total_population;
        ctx.restore();
        ctx.font = "36px";
        ctx.textBaseline = "middle";
        let textX = Math.round((width - ctx.measureText(total).width) / 2),
          textY = height / 2;
          ctx.beginPath();
          ctx.arc(textX+7,textY,40,0,2*Math.PI);
          ctx.fillStyle = '#23597B';
          ctx.fill();
          ctx.lineWidth = 5;
          ctx.fillStyle = '#fff';
        ctx.fillText(total, textX, textY);
      
        ctx.save();
      }
    },
  }
);

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [selectedBarangayOptions, setSelectedBarangayOptions] = useState([]);
  const [selectedPopulationOptions, setSelectedPopulationOptions] = useState([]);
  const [nodata, setNodata] = useState(true);
  const [barangayList, setBarangayList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [reportDetails, setReportDetails] = useState([]);
  const [currentPage,setCurrentPage]=useState(1);
  const selectInputRef = useRef();
  const options = {
    responsive: true,
    tooltips: {
      enabled: true
    },
    cutout: 0,
    animation: false,
    plugins: {
      beforeDraw: (chart, args, options) => {
        let text = options.consoleText
        console.log(text)
      },
      ChartDataLabels,
      datalabels: {
        color: "#ffffff",
        font: {
          size: 18,
          weight: "bold"
        },
        formatter: function (value, context) {
          let sum = 0;
          let dataArr = context.chart.data.datasets[0].data;
          dataArr.map(data => {
            sum += Number(data);
          });
          let percentage = (value * 100 / sum).toFixed(0) + '%';
          if (value !== 0) {
            return context.chart.data.labels[context.dataIndex] + '\n' + percentage + '\n' + value;
          }
          else {
            return '';
          }

        },
      },
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 20,
          padding: 20,

        },
        onClick: function (event, legendItem) {
          return false;
        }
      },
      tooltips: {
        enabled: true
      }
    }
  }
  const normalPieChatOptions = {
    responsive: true,
    tooltips: {
      enabled: true
    },
    elements: {
      arc: {
        backgroundColor: 'red',
        borderAlign:'center',
        borderColor:'blue',
        borderWidth:3,
      },
      
    },
    cutout: 0,
    animation: false,
    plugins: {
      legend: {
        position: 'bottom',

        labels: {
          boxWidth: 20,
          padding: 20,
          font: {
            size: 15
          },

        },
        onClick: function (event, legendItem) {
          return false;
        }
      },
      datalabels: {
        formatter: function (value, context) {
          if (value !== 0) {
            return value;
          }
          else {
            return ''
          }

        },
        color: "#ffffff",
        font: {
          size: 20,
          weight: "normal"
        },
      },
    }
  }

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'index',
      intersect: false
    },
    hover: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      datalabels: {
        formatter: function (value, context) {
          if (value !== 0) {
            return '';
          }
          else {
            return '';
          }

        },
        color: '#fff',
        font: {
          size: 16,
          weight: "normal"
        },
      },
      legend: {
        display: true,
        onClick: function (event, legendItem) {
          return false;
        }
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: reportDetails[0]?.chart_response_left.x_axis_name,
          font: {
            size: 20
          },
          color: '#0086b6'
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: selectedCategoryName === 'Pregnancies of Population (Women 10-54) by Age and  Gravida' ? 'Total No.Of  Women Pregnant' : 'Total Population',
          font: {
            size: 20
          },
          color: '#0086b6'
        }

      }
    }
  };
  const barChartWithoutStackOptions = {
    responsive: true,
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        display: true
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: false,
        title: {
          display: true,
          text: reportDetails[0]?.chart_response_left.x_axis_name,
          font: {
            size: 20
          },
          color: '#0086b6'
        }
      },
      y: {
        stacked: false,
        title: {
          display: true,
          text: selectedCategoryName === 'Pregnancies of Population (Women 10-54) by Age and  Gravida' ? 'Total No.Of  Women Pregnant' : 'Total Population',
          font: {
            size: 20
          },
          color: '#0086b6'
        }
      }
    }
  };

  const InputOption = ({
    getStyles,
    Icon,
    isDisabled,
    isFocused,
    isSelected,
    children,
    innerProps,
    ...rest
  }) => {
    const [isActive, setIsActive] = useState(false);
    const onMouseDown = () => setIsActive(true);
    const onMouseUp = () => setIsActive(false);
    const onMouseLeave = () => setIsActive(false);

    // styles
    let bg = "transparent";
    if (isFocused) bg = "#eee";
    if (isActive) bg = "#B2D4FF";

    const style = {
      alignItems: "center",
      backgroundColor: bg,
      color: "inherit",
      display: "flex ",
    };

    // prop assignment
    const props = {
      ...innerProps,
      onMouseDown,
      onMouseUp,
      onMouseLeave,
      style
    };

    return (
      <components.Option
        {...rest}
        isDisabled={isDisabled}
        isFocused={isFocused}
        isSelected={isSelected}
        getStyles={getStyles}
        innerProps={props}
      >
        <input type="checkbox" checked={isSelected} onChange={handleChange} className="me-2" />
        {children}
      </components.Option>
    );
  };
  const handleChange= ()=>{

  }
  useEffect(() => {
    getBarangayList();
    getCategoryList();
  }, []);
  const getBarangayList = async () => {
    const data={
    "page":currentPage,
    "page_size":100,
    "search":null
    }
    const res = await postData("get-location-list/", {},data);
    if (res.status) {
      res.data.forEach((data) => {
        data.label = data.name;
        data.value = data.id
      });
      setCurrentPage(res.paginator.next_page);
      const loadData =[...barangayList,...res.data]
      setBarangayList(loadData);
    }
  }
  const getCategoryList = async () => {
    const res = await getData("get-report-category-list/", {});
    if (res.status) {
      res.data.forEach((data) => {
        data.label = data.category_name;
        data.value = data.id
      });
    
      setCategoryList(res.data);
    }
  }
  const clearFilter =()=>{
    selectInputRef.current.clearValue();
    setSelectedBarangayOptions([]);
    setSelectedPopulationOptions([]);
    setNodata(true);
  }
  const applyFilter = () => {
    if (selectedBarangayOptions.length !== 0 && selectedPopulationOptions.length !== 0) {

      getReportDetails();
    } else {
      //setNodata(true)

    }
  }
  const getReportDetails = async () => {
    setSelectedCategoryName(selectedPopulationOptions.category_name)
    const obj = {
      location_id: selectedBarangayOptions,
      category_id: selectedPopulationOptions.id
    }
    const res = await postData("get-report-details/", {}, obj);
    if (res.status === 1) {
      setNodata(false);
      res.data.forEach((chart_data) => {
        
        if (chart_data.chart_response_left.type === 'pie') {
          chart_data.chart_response_left.datasets[0].borderWidth =0;
          chart_data.chart_response_left.is_show = checkPieChartZeroValue(chart_data.chart_response_left.datasets[0].data);
        }
        if (chart_data?.chart_response_right?.type === 'pie') {
          chart_data.chart_response_right.datasets[0].borderWidth=0;
          chart_data.chart_response_right.is_show = checkPieChartZeroValue(chart_data.chart_response_right.datasets[0].data);
        }
       
      })
      setReportDetails(res.data);
    }
    else {
      toast.error(res.message, { theme: "colored" });
      setNodata(true)
    }
  }
  const checkPieChartZeroValue = (dataset) => {
    return dataset.some((val) => {
      return val > 0;
    })
  }

  const barChartMultiLabeloptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 14
          },
          filter: function (item, chart) {
            return item.text !== '' ? item.text : '';
          }
        },
        onClick: function (event, legendItem) {
          return false;
        }
      },
      datalabels: {
        display: true,
        align: 'bottom',
        anchor: 'start',
        color: 'black',
        padding: 10,
        formatter: function (value, context) {
          let ds = context.chart.data.datasets;
          if (ds[context.datasetIndex - 1]) {
            if (ds[context.datasetIndex - 1].stack == ds[context.datasetIndex].stack) {
              return ''
            } else {
              return ds[context.datasetIndex].stack?.charAt(0);
            }
          }
          else {
            return ds[context.datasetIndex].stack?.charAt(0);
          }

        }
      },

    },
    scales: {
      x: {
        ticks: {
          display: false,
          fontSize: 40,

        },
      },
      xAxis2: {
        type: "category",
        grid: {
          drawOnChartArea: false
        },
        gridLines: { display: false },
        ticks: {
          display: true,
          stepSize: 1,
          min: 0,
          fontSize: 12,
          padding: 15
        },
        title: {
          display: true,
          text: reportDetails[0]?.chart_response_left.x_axis_name,
          font: {
            size: 20
          },
          color: '#0086b6'
        }
      },
      y: {
        ticks: {
          beginAtZero: true,
        },

      },
      yAxis2: {
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          beginAtZero: true,
          display: false,
          gridLines: { display: false },
        },
        title: {
          display: true,
          text: selectedCategoryName === 'Currently Enrolled by Age, Sex and School Type'
            || selectedCategoryName === 'Currently Enrolled by Age, Sex and School Level' ? 'Total No.Of  Student Enrolled' : 'Total Population',
          font: {
            size: 20
          },
          color: '#0086b6'
        }
      }
    }


  }
  const barangayOnChange=(option,actionType)=>{
    if(actionType.action ==="input-change"){
      setTimeout(() => {
        searchBarangayList(option)
      }, 1000);
    }
  }
  const searchBarangayList = async (value) => {
    const data={
    "page":currentPage,
    "page_size":100,
    "search":value
    }
    const res = await postData("get-location-list/", {},data);
    if (res.status) {
      res.data.forEach((data) => {
        data.label = data.name;
        data.value = data.id
      });
      setCurrentPage(res.paginator.next_page);
      const loadData =[...barangayList,...res.data]
      setBarangayList(loadData);
    }
  }
  const handleOnScrollBottom =(e)=>{
    getBarangayList();
  }
  const downloadReport = async () => {
    const obj = {
      location_id: selectedBarangayOptions,
      category_id: selectedPopulationOptions.id
    }
    const response = await postDataDownload("get-survey-report-excel/", { responseType: 'arraybuffer' }, obj)
      .then((response) => {

        if (response.status && response.status == 400) {
          response.json()?.then((res) => {
            toast.error(res.message, { theme: "colored" });
          })

        }
        else {
          let contentDisposition = response?.headers?.get('Content-Disposition')?.split(';')[1];
          response.blob()?.then((res) => {
            const url = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', contentDisposition?.split('=')[1]);
            document.body.appendChild(link);
            link.click();
          })
        }
      });

  }

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <h3 className="page-title mb-4">Reports</h3>
        </div>
      </div>

      <Row>
        <Col md={4}>
          <Select
           ref={selectInputRef}
            onMenuScrollToBottom={(e) => handleOnScrollBottom(e)}
            defaultValue={[]}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            onInputChange={(option,e)=>barangayOnChange(option,e)}
            onChange={(options) => {
              if (Array.isArray(options)) {
                setSelectedBarangayOptions(options.map((opt) => opt.value));
              }
            }}
            options={barangayList}
            components={{
              Option: InputOption
            }}
            placeholder="Select Barangay"
          />
        </Col>
        <Col md={4}>
          <Select
        
            defaultValue={[]}
            closeMenuOnSelect={true}
            hideSelectedOptions={false}
            options={categoryList}
            onChange={(selectedOption) => setSelectedPopulationOptions(selectedOption)}
            value={selectedPopulationOptions}
            placeholder="Select report type "
          />
        </Col>
        <Col md={4}>
          <Button
            type="submit"
            disabled={loading}
            loading={loading}
            className="btn-primary button-width text-white me-3"
            onClick={applyFilter}
          >
            Apply filter
          </Button>
          <Button
            type="button"
            className="btn-secondary"
            onClick={clearFilter}
          >
            Clear filter
          </Button>
        </Col>
      </Row>
      {
        nodata ?
          <div className="text-center my-5 py-5 no-report"> Do Select the Barangay and Report Type </div>
          :
          <>
            <Row>
              <Col md={12}>
                <Row className="my-4">
                  <Col md={8}>
                    <h4 className="report-page-sub-title">{selectedCategoryName} </h4>
                  </Col>
                  <Col md={4}>
                    <div className="report-down-btn">
                      <Button className="btn-primary button-width text-white" onClick={() => downloadReport()}>Download report</Button>
                    </div>

                  </Col>
                </Row>
              </Col>
            </Row>
            {reportDetails.map((report_data) => (
              <>
                <Row className="report-chart-section">
                  <h4 className="page-sub-title">{report_data.location_name}</h4>
                  {report_data?.chart_response_left?.type === 'pie' && report_data?.chart_response_left?.is_show ? (
                    <>
                      <Col md={6}>
                        <Card className="mb-3">
                          <Card.Body>
                            <Card.Title>{report_data.chart_response_left.title}</Card.Title>
                            <Pie
                              id='hideAxisX'
                              data={report_data.chart_response_left}
                              options={normalPieChatOptions}
                            />
                          </Card.Body>
                        </Card>
                      </Col>
                    </>
                  ) : null}
                  {report_data?.chart_response_left?.type === 'pie' && !report_data?.chart_response_left?.is_show ? (
                    <>
                      <Col md={6}>
                        <Card className="h-100 mb-3">
                          <Card.Body>
                          <Card.Title>{report_data.chart_response_left.title}</Card.Title>
                          <div className="d-flex justify-content-center align-items-center">
                              <Card.Title className="mb-3">No data</Card.Title>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </>
                  ) : null}
                  {report_data?.chart_response_left?.type === 'bar' ? (
                    <>
                      <Col md={12}>
                        <Card className="pointer_none_class bar_chart_min_height mb-3">
                          <Card.Body>
                            {/* <Card.Title>Total Population by Sex</Card.Title> */}
                            {/* <div className="barchart_width"> */}
                            <Bar
                              options={selectedCategoryName === 'Marital Status of the Total Population by Sex'
                                || selectedCategoryName === 'Monthly Income of the Total Population (15+) by Age and Sex'
                                || selectedCategoryName === 'Major Source of Income of the Total Population (15+) by Age and Sex'
                                || selectedCategoryName === 'Status of Work/ Business of the Total Population (15+) by Age and Sex'
                                || selectedCategoryName === 'Currently Enrolled by Age, Sex and School Type'
                                || selectedCategoryName === 'Currently Enrolled by Age, Sex and School Level' ? barChartMultiLabeloptions : barChartOptions}
                              data={report_data.chart_response_left}
                            />
                            {/* </div> */}
                          </Card.Body>
                        </Card>
                      </Col>
                    </>
                  ) : null}
                  {report_data?.chart_response_right?.type === 'pie' && report_data?.chart_response_right?.is_show ? (
                    <>
                      <Col md={6}>
                        <Card>
                          <Card.Body>
                            <Card.Title>{report_data.chart_response_right.title}</Card.Title>

                            <Pie id="hideAxisX" data={report_data.chart_response_right} options={selectedCategoryName === 'Distribution of Households by Household Size and HH Sex'
                              || selectedCategoryName === 'Distribution of Total Population by Highest Educational Attainment and Sex' ? options : normalPieChatOptions} />

                          </Card.Body>
                        </Card>
                      </Col>
                    </>
                  ) : null}
                  {(report_data?.chart_response_right?.type === 'pie' && report_data?.chart_response_right?.labels?.length >0) && !report_data?.chart_response_right?.is_show ? (
                    <>
                      <Col md={6}>
                        <Card className="h-100">
                          <Card.Body >
                          <Card.Title>{report_data.chart_response_right.title}</Card.Title>
                            <div className="d-flex justify-content-center align-items-center">
                              <Card.Title className="mb-3">No data</Card.Title>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </>
                  ) : null}
                </Row>
              </>
            ))}

          </>
      }

      
    </div>
  );
};

export default Reports;
