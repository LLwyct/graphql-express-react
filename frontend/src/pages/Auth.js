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
                let { token, userId, tokenExpiration } = data?.data?.login?.token;
                this.context.login(
                    token,
                    userId,
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
                <form action="" className="auth-form" onSubmit={ this.submitHandler }>
                    <div className="form-control">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" ref={this.emailEl} />
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" ref={this.passwordEl} />
                    </div>
                    <div className="form-action">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={this.swithHandler}>
                            swith to {this.state.isLoginMode ? "Signup" : "Signin"}
                        </button>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

export default AuthPage;