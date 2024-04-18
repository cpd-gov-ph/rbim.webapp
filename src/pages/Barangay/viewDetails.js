import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getData } from '../../api';
import Loader from "../../components/Loader";
import moment from "moment";

function ViewData() {
    const [ViewDetails, setViewDetails] = useState({});
    let { id } = useParams();
    const [initLoading, setInitLoading] = useState(false);

    const GetViewDetails = useCallback(async () => {
        setInitLoading(true);
        const res = await getData("view-barangay/" + id + "/", {});
        if (res.status === 1) {
            res.data.profile.dob = moment(res.data.profile.dob).format("DD-MM-YYYY");
            setViewDetails(res.data);
            setInitLoading(false);
        }
    }, [id]);

    useEffect(() => {
        GetViewDetails(id);
    }, [GetViewDetails, id]);

    return (
        <div>
            {!initLoading && (
                <div className='view-details barangay-view-details'>
                    <div className='view-details-section'>
                        <div className='view-heading'>
                            <h3>View Barangay Official Details</h3>
                        </div>
                        <div className='view-body barangay'>
                            <div className='d-flex justify-content-between'>
                                <div className='view-left'>
                                    <p>Barangay official name</p>
                                </div>
                                <div className='view-right'>
                                    <p>{ViewDetails?.first_name}</p>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className='view-left'>
                                    <p>Assigned barangay</p>
                                </div>
                                <div className='view-right'>
                                    <p>{ViewDetails?.location?.name}</p>
                                </div>
                            </div>
                            {/* <div className='d-flex justify-content-between'>
                    <div className='view-left'>
                        <p>Population Details</p>
                    </div>
                    <div className='view-right'>
                        <p>2566</p>
                    </div>
                </div> */}
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
                                    <p>Assigned province</p>
                                </div>
                                <div className='view-right'>
                                    <p>{ViewDetails?.city?.name}</p>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className='view-left'>
                                    <p>Assigned city/municipality</p>
                                </div>
                                <div className='view-right'>
                                    <p>{ViewDetails?.municipality?.name}</p>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className='view-left'>
                                    <p>BO code</p>
                                </div>
                                <div className='view-right'>
                                    <p>{ViewDetails?.profile?.official_number}</p>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div className='view-left'>
                                    <p>Barangay hall complete address</p>
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
        </div>
    );
}

export default ViewData;