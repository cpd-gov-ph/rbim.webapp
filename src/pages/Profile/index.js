import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { getData } from '../../api';
import InputGroup from 'react-bootstrap/InputGroup';
// import "./style.scss";
const UserProfile = () => {
    const [profileObject, setProfileObject] = useState({
        email: "",
        first_name: "",
        profile: {
            address: "",
            dob: "",
            official_number: "",
            phone_no: "",
            gender: "",
        },
    });
    const getUserInfo = async () => {
        console.log('info');
        const res = await getData("token-user-view/", {});
        console.log(res);
        if (res.status === 1) {
            setProfileObject(res.data);

        }
    }
    useEffect(() => {
        getUserInfo();
    }, []);
    return (
        <div>
            <div className="profile_section">
                <h4 className="page-title">Profile</h4>
                <div className="row">
                    <div className="col-md-8">
                        <Form noValidate >
                            <div className="row">
                                <div className="col-md-12">
                                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                                        <Form.Label column sm={4}>Name</Form.Label>
                                        <Col column sm={8}>
                                            <Form.Control type="text" value={profileObject.first_name}
                                                required disabled />
                                            <Form.Control.Feedback type="invalid" >
                                                This field is required
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                                        <Form.Label column sm={4}>ID number</Form.Label>
                                        <Col column sm={8} className="position-relative">
                                            <Form.Control type="text" value={profileObject.profile.official_number}
                                                required disabled />
                                            <Form.Control.Feedback type="invalid">
                                                This field is required
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                                        <Form.Label column sm={4}>Sex at birth</Form.Label>
                                        <Col column sm={8}>
                                            <Form.Control type="text" name="reset_code" value={profileObject.profile.gender}
                                                required disabled />
                                            <Form.Control.Feedback type="invalid">
                                                This field is required
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                                        <Form.Label column sm={4}>Mobile number</Form.Label>
                                        <Col column sm={8}>
                                            <InputGroup className="phone-group profile-phone-group">
                                                <InputGroup.Text>
                                                    +63
                                                </InputGroup.Text>
                                                <Form.Control type="text" name="reset_code" value={profileObject.profile.phone_no}
                                                    required disabled />
                                                <Form.Control.Feedback type="invalid">
                                                    This field is required
                                                </Form.Control.Feedback>
                                            </InputGroup>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3" controlId="formBasicEmail">
                                        <Form.Label column sm={4}>Email ID</Form.Label>
                                        <Col column sm={8}>
                                            <Form.Control type="text" name="reset_code" value={profileObject.email}
                                                required disabled />
                                            <Form.Control.Feedback type="invalid">
                                                This field is required
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default UserProfile;
