import React, { Component } from 'react';
import { FormField, validate } from '../../ui/misc';
import { Fade } from 'react-reveal';
import { firebasePromotions } from '../../../firebase';

export default class Enroll extends Component {

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
      }
    } 
  }

  resetFormSuccess = (type) => {
    const newFormData = {...this.state.formData}

    for(let key in newFormData) {
      newFormData[key].value = '';
      newFormData[key].valid = false; 
      newFormData[key].validationMsg = '';
    }

    this.setState({
      formError: false,
      formData: newFormData,
      formSuccess: type ? 'Congratulations' : 'The email is already in database'
    })

    this.clearSuccessMsg();
  }

  clearSuccessMsg = () => {
    setTimeout(()=> {
      this.setState({
        formSuccess: ''
      })
    }, 2000)
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

      firebasePromotions.orderByChild('email').equalTo(dataToSubmit.email).once('value')
          .then((snapshot) => {
            if(snapshot.val() === null){
              firebasePromotions.push(dataToSubmit);
              this.resetFormSuccess(true)
            } else {
              this.resetFormSuccess(false)
            }
            snapshot.val()
          })
          .catch(err => console.log(err))

    
    //this.resetFormSuccess()
    
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
      <Fade>
        <div className="enroll_wrapper">
          <form onSubmit={(e) => this.submitForm(e)}>
            <div className="enroll_title">
              Enter your email
            </div>
            <div className="enroll_input">
              <FormField
                id={'email'}
                formData={this.state.formData.email}
                change={(element) => this.updateForm(element)}
              />
              { this.state.formError ? <div className="error_label">Something is wrong. Try again.</div> : null }
              <div className="success_label">
                {
                  this.state.formSuccess
                }
              </div>
              <button onClick={(e) => this.submitForm(e)}>Enroll</button>
              <div className="enroll_discl">
              Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. 
              </div>
            </div>
          </form>
        </div>
      </Fade>
    )
  }
}
