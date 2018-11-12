import React, { Component } from 'react';
import { firebase } from '../../firebase';
import { FormField, validate } from '../ui/misc';

export default class SignIn extends Component {

  state = {
    formError: false,
    formSuccess: '',
    formData: {
      email: {
        element: 'input',
        value: '',
        config: {
          name: 'email_input',
          type: 'email',
          placeholder: 'Enter your email'
        },
        validation: {
          required: true,
          email: true
        },
        valid: false,
        validationMsg: ''
      },
      password: {
        element: 'input',
        value: '',
        config: {
          name: 'password_input',
          type: 'password',
          placeholder: 'Enter your password'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMsg: ''
      }
    } 
  }

  submitForm = (e) => {
    e.preventDefault();

    let dataToSubmit = {};
    let formIsValid = true;

    for(let key in this.state.formData) {
      dataToSubmit[key] = this.state.formData[key].value;
      formIsValid = this.state.formData[key].valid && formIsValid;
    }

    formIsValid ? 

      firebase.auth()
        .signInWithEmailAndPassword(
          dataToSubmit.email,
          dataToSubmit.password
        )
        .then(() => {
          this.props.history.push('/dashboard')
        })
        .catch((err) => {
          this.setState({
            formError: true
          })
          console.log(err)
        })
    
    : this.setState({ formError: true });
  }
  updateForm = (element) => {
    let newFormData = {
      ...this.state.formData,
    }
    let newElement = {
      ...newFormData[element.id]
    }

    newElement.value = element.e.target.value;

    let validData = validate(newElement);
    
    newElement.valid = validData[0];
    newElement.validationMsg = validData[1];
    newFormData[element.id] = newElement;

    this.setState({
      formError: false,
      formData: newFormData
    })
  }

  render() {
    return (
      <div className="container">
        <div className="signin_wrapper" style={{ margin: '100px' }}>
          <form onSubmit={(e) => this.submitForm(e)}>
            <h2>Please Login</h2>
            <FormField
                id={'email'}
                formData={this.state.formData.email}
                change={(element) => this.updateForm(element)}
            />
            <FormField
                id={'password'}
                formData={this.state.formData.password}
                change={(element) => this.updateForm(element)}
            />
            { this.state.formError ? <div className="error_label">Something is wrong. Try again.</div> : null }
            <button onClick={(e) => this.submitForm(e)}>Log in</button>
          </form>
        </div>
      </div>
    )
  }
}
