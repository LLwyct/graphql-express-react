import React, { Component } from 'react';
import './Auth.css';
import AuthContext from '../context/auth-context';

class AuthPage extends Component  {

    static contextType = AuthContext;

    constructor (props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();

        this.state = {
            isLoginMode: true
        }
    }

    submitHandler = async (event) => {
        event.preventDefault();
        let email = this.emailEl.current.value;
        let password = this.passwordEl.current.value;
        if (email.trim() === "" || password.trim() === "") {
            return false;
        }
        const requestBody = {
            query: `
            mutation {
                createUser(userInput: {email: "${email}", password: "${password}"}) {
                    _id
                    email
                }
            }
            `
        };

        if (this.state.isLoginMode) {
            requestBody.query = `
                query {
                    login(email: "${email}", password: "${password}") {
                        _id
                        token
                        tokenExpiration
                    }
                }
                `;
        }
        let response, data;
        try {
            response = await fetch(`http://localhost:3030/graphql`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            });
            data = await response.json();
            if (data?.data?.login?.token) {
                let { token, _id, tokenExpiration } = data?.data?.login;
                this.context.login(
                    token,
                    _id,
                    tokenExpiration
                )
            }
        } catch (error) {
            throw error;
        }
    }

    swithHandler = () => {
        this.setState(prevState => {
            return {
                isLoginMode: !prevState.isLoginMode
            };
        })
    }
    

    render () {
        return (
            <React.Fragment>
                <h1>The Auth Page</h1>
                <form action="" onSubmit={this.submitHandler} className="auth-form">
                    <div class="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" class="form-control" ref={this.emailEl} />
                        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div class="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" class="form-control" ref={this.passwordEl} />
                    </div>
                    <div class="form-group" style={{display: 'flex', justifyContent: 'space-between'}}>
                        <button type="submit" class="btn btn-primary">Submit</button>
                        <button type="button" class="btn btn-light" onClick={this.swithHandler}>
                            swith to {this.state.isLoginMode ? "Signup" : "Signin"}
                        </button>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

export default AuthPage;