import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { userLogin } from '../../redux/actions/userActions';

import { MAIN_BACKGROUND_IMAGE, FOOTBALL_IMAGE } from '../../utilities/constants';

import "./login.scss";

const USER_DEFAULT_REQUIRED = 'Minimum 1 character required';
const USER_EMAIL_ADDRESS_REQUIRED = 'Minimum 1 character required';
const USER_EMAIL_ADDRESS_INVALID = 'Invalid Email address';
const USER_PASSWORD_REQUIRED = 'Minimum 8 characters required';
const USER_PASSWORD_INVALID = 'Minimum eight characters, at least one uppercase letter, one lowercase letter and one number';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            formFields: {
                userEmailAddress: '',
                userPassword: ''
            },
            formErrors: {
                userEmailAddress: '',
                userPassword: ''
            },
            submitAttempted: false,
            rememberMe: false,
        }

        console.log(this.state);
    }

    handleChange = e => {
        const {name, value} = e.target;
        const {formFields, formErrors} = this.state;

        switch (name) {
            case "userEmailAddress":
                formErrors.userEmailAddress = value.length < 1 ? USER_EMAIL_ADDRESS_REQUIRED : "";
                formErrors.userEmailAddress = value.length > 0 && !EMAIL_REGEX.test(value) ? USER_EMAIL_ADDRESS_INVALID : formErrors.userEmailAddress
                break;
            case "userPassword":
                formErrors.userPassword = value.length < 1 ? USER_PASSWORD_REQUIRED : "";
                formErrors.userPassword = value.length > 0 && !PASSWORD_REGEX.test(value) ? USER_PASSWORD_INVALID : formErrors.userPassword
                break;
            default:
                break;
        }

        this.setState({ formFields: Object.assign(formFields, {[name]: value })});
        this.setState({ formErrors }, () => console.log(this.state));
    }

    handleSubmit = (e) => {

        e.preventDefault();

        const {formFields, formErrors} = this.state;

        this.setState({ submitAttempted: true });

        Object.keys(formFields).forEach(key => {
            if (formFields[key].trim() === '') {
                this.setState({ formErrors: Object.assign(formErrors, {[key]: USER_DEFAULT_REQUIRED})})
            }
        });

        if (this.formValid()) {

            // Do something with the details
            this.props.dispatch(userLogin({ emailAddress: formFields.userEmailAddress, password: formFields.userPassword }));
            // <div className="forgotten-password"><NavLink to={'/password-reset'}>Forgotten your password?</NavLink></div>

            // Clear the form
            this.setState({ formFields: Object.assign(formFields, {userEmailAddress: '', userPassword: '' })});         
            this.setState({ formErrors: Object.assign(formErrors, {userEmailAddress: '', userPassword: '' })});
            this.setState({ submitAttempted: false });

            console.log(`
                -- SUBMITTING --
                Email Address: ${formFields.userEmailAddress}
                Password: ${formFields.userPassword}
            `);

            // Now re-route to the administration page
            this.props.history.push('\administration');

        } else {
            console.log("FORM INVALID");
        }
    }

    formValid = () => {
            let isValid = true;
            const {formFields, formErrors} = this.state;            
            Object.values(formErrors).forEach(val => { val.length > 0 && (isValid = false) });          // Validate form errors being empty            
            Object.values(formFields).forEach(val => { val.trim() === '' && (isValid = false) });       // Validate the form fields contained values
        return isValid;
    }

    render() {

        const {formFields: {userEmailAddress, userPassword}, formErrors, submitAttempted} = this.state;

        return (
            <div className="container-main-content-login">
            <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>
            <div className="container-card">
                    <header>
                        <img src={FOOTBALL_IMAGE} alt="" />
                        <h1>Log in</h1>
                        <img src={FOOTBALL_IMAGE} alt="" />                        
                    </header>

                    <div className="login">
                        <div className="main-form">
                            <form className="login-form">

                                <div className="login-form-full-width">
                                    <TextField
                                        type="text"
                                        id="userEmailAddress"
                                        name="userEmailAddress"
                                        label="Your Email address"
                                        className="form-control"
                                        required={true}
                                        fullWidth={true}
                                        value={userEmailAddress}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {submitAttempted && formErrors.userEmailAddress.length > 0 ? <div className="errorMessage">{formErrors.userEmailAddress}</div> : <div>&nbsp;</div>}

                                <div className="login-form-full-width">
                                    <TextField
                                        type="password"
                                        id="userPassword"
                                        name="userPassword"
                                        label="Your password"
                                        className="form-control"
                                        required={true}
                                        fullWidth={true}
                                        value={userPassword}
                                        onChange={this.handleChange}
                                    />        
                                </div>
                                {submitAttempted && formErrors.userPassword.length > 0 ? <div className="errorMessage">{formErrors.userPassword}</div> : <div>&nbsp;</div>}

                                <div className="remember-me">
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                className="rememberMe"
                                                checked={this.state.rememberMe}
                                                onChange={(e) => this.setState({rememberMe: e.target.checked})}
                                                value={this.state.rememberMe.toString()}
                                            />
                                        }
                                        label="Remember me"
                                    />                        
                                </div>

                            </form>

                            <div className="submit-button">
                                <Button variant="contained" color="primary" id="submit" onClick={this.handleSubmit}>Log in</Button>
                            </div>


                            { submitAttempted && !this.formValid() &&
                                <div className="invalid-form-message">
                                    <p>Invalid ... please check the details highlighted in red above</p>
                                </div>
                            }
                            
                            <div className="forgotten-password"><NavLink to={'/password-reset'}>Forgotten your password?</NavLink></div>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};


export default connect(null, null)(Login);