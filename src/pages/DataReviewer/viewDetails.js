import React, { useState, useEffect } from "react";
// import './dataCollector.scss';
import { useParams } from "react-router-dom";
import { getData } from '../../api';
import moment from "moment";
import Loader from "../../components/Loader";

function ViewData() {
    const [ViewDetails, setViewDetails] = useState({});
    const [initLoading, setInitLoading] = useState(false);
    let { id } = useParams();


    const GetViewDetails = async () => {
        setInitLoading(true);
        const res = await getData("view-data-reviewer/" + id + "/", {});
        if (res.status === 1) {
            res.data.profile.dob = moment(res.data.profile.dob).format("DD-MM-YYYY");
            setViewDetails(res.data);
            setInitLoading(false);
        }
    }


    useEffect(() => {
        GetViewDetails();
    }, []);

    return (
        <>
            {!initLoading && (
                <div className='view-details'>
                    <div className='view-details-section'>
                        <div className='view-heading'>
                            <h3>View Data Reviewer Details</h3>
                        </div>
                        <div className='view-body'>
                            <div className='d-flex justify-content-between'>
                                <div className='view-left'>
                                    <p>Data reviewer name</p>
                                </div>
                                <div className='view-right'>
                                    <p>{ViewDetails?.first_name}</p>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className='view-left'>
                                    <p>Date of birth</p>
                                </div>
                                <div className='view-right'>
                                    <p>{ViewDetails?.profile?.dob}</p>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className='view-left'>
                                    <p>Sex at birth</p>
                                </div>
                                <div className='view-right'>
                                    <p className="text-capitalize">{ViewDetails?.profile?.gender}</p>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className='view-left'>
                                    <p>Mobile number</p>
                                </div>
                                <div className='view-right'>
                                    <p> +63{ViewDetails?.profile?.phone_no}</p>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className='view-left'>
                                    <p>Email ID</p>
                                </div>
                                <div className='view-right'>
                                    <p>{ViewDetails?.email}</p>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className='view-left'>
                                    <p>DR code</p>
                                </div>
                                <div className='view-right'>
                                    <p>{ViewDetails?.profile?.official_number}</p>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className='view-left'>
                                    <p>Assigned barangay</p>
                                </div>
                                <div className='view-right'>
                                    <p>{ViewDetails?.barangay?.first_name}</p>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className='view-left'>
                                    <p>Address</p>
                                </div>
                                <div className='view-right address-view'>
                                    <p>{ViewDetails?.profile?.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {initLoading && <Loader />}
        </>
    );
}

export default ViewData;