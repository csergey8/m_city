import React, { Component } from 'react';
import AdminLayout from '../../../hoc/AdminLayout';
import Fireuploader from '../../ui/fileuploader';

import { FormField, validate } from '../../ui/misc';

import { firebasePlayers, firebaseDB, firebase } from '../../../firebase';
import Fileuploader from '../../ui/fileuploader';


export default class AddEditPlayers extends Component {

  state = {
    playerId: '',
    formType: '',
    formError: false,
    formSuccess: '',
    defaultImg: '',
    formData: {
      name: {
        element: 'input',
        value: '',
        config: {
          label: 'Player Name',
          name: 'name_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMsg: '',
        showLabel: true
      },
      lastname: {
        element: 'input',
        value: '',
        config: {
          label: 'Player Last Name',
          name: 'lastname_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMsg: '',
        showLabel: true
      },
      number: {
        element: 'input',
        value: '',
        config: {
          label: 'Player Number',
          name: 'number_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMsg: '',
        showLabel: true
      },
      position: {
        element: 'select',
        value: '',
        config: {
          label: 'Player Position',
          name: 'select_position',
          type: 'select',
          options: [
            {key: "Keeper", value: "Keeper"},
            {key: "Defence", value: "Defence"},
            {key: "Midfield", value: "Midfield"},
            {key: "Striker", value: "Striker"},
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        validationMsg: '',
        showLabel: true
      },
      image: {
        element: 'image',
        value: '',
        validation: {
          required: true
        },
        valid: true
      }      
    }
  }

  componentDidMount() {
    const playerId = this.props.match.params.id;
    console.log(playerId)

    if(!playerId) {
      this.setState({
        formType: 'Add Player'
      })
    } else {
      firebaseDB.ref(`players/${playerId}`).once('value')
        .then(snap => {
          const playerData = snap.val();
          console.log(playerData)

          firebase.storage().ref('players')
            .child(playerData.image).getDownloadURL()
            .then(url => {
              this.updateFields(playerData, playerId, 'Edit player', url);
            })
            .catch(err => {
              this.updateFields({
                ...playerData,
                image: ''
              }, playerId, 'Edit player', '')
            })

        })
    }
  }

  updateFields = (player, playerId, formType, defaultImg) => {
    const newFormData = {...this.state.formData};
    for (let key in newFormData) {
      newFormData[key].value = player[key];
      newFormData[key].valid = true
    }

    this.setState({
      playerId,
      defaultImg,
      formType,
      formData: newFormData
    })
  }

  updateForm = (element, content = '') => {
    let newFormData = {
      ...this.state.formData,
    }
    let newElement = {
      ...newFormData[element.id]
    }

    if(content === ''){
      newElement.value = element.e.target.value;
    } else {
      newElement.value = content;
    }

    

    let validData = validate(newElement);
    
    newElement.valid = validData[0];
    newElement.validationMsg = validData[1];
    newFormData[element.id] = newElement;

    this.setState({
      formError: false,
      formData: newFormData
    })
  }

  successForm = (msg) => {
    this.setState({
      formSuccess: msg
    })

    setTimeout(() => {
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

    

    if(formIsValid) {
      if(this.state.formType === 'Edit player') {
        firebaseDB.ref(`players/${this.state.playerId}`)
          .update(dataToSubmit)
          .then(() => {
            this.successForm('Update correctly')
          })
          .catch(err => {
            this.setState({
              formError: true
            })
          })
      } else {
        firebasePlayers.push(dataToSubmit)
          .then(() => {
            this.props.history.push('/admin_players')
          })
          .catch(err => {

          })
      }
    } else {
      this.setState({
        formError: true
      })
    }
  }

  resetImage = () => {
    const newFormData = {...this.state.formData};

    newFormData['image'].value = '';
    newFormData['image'].valid = false;
    this.setState({
      defaultImg: '',
      formData: newFormData
    })
  }

  storeFilename = (filename) => {
    this.updateForm({ id: 'image'}, filename)
  } 

  render() {
    return (
      <AdminLayout>
        <div className="editplayers_dialog_wrapper">
          <h2>{this.state.formType}</h2>
          <div>
            <form onSubmit={(e) => this.submitForm(e)}>
              <Fileuploader
                dir="players"
                tag={"Player image"}
                defaultImg={this.state.defaultImg}
                defaultImgName={this.state.formData.image.value}
                resetImage={() => this.resetImage()}
                filename={(filename) => this.storeFilename(filename)}
              />
              <FormField
                id={'name'}
                formData={this.state.formData.name}
                change={(element) => this.updateForm(element)}
              />
              <FormField
                id={'lastname'}
                formData={this.state.formData.lastname}
                change={(element) => this.updateForm(element)}
              />
              <FormField
                id={'number'}
                formData={this.state.formData.number}
                change={(element) => this.updateForm(element)}
              />
              <FormField
                id={'position'}
                formData={this.state.formData.position}
                change={(element) => this.updateForm(element)}
              />
              <div className="success_label">{this.state.formSuccess}</div>
              { this.state.formError ? <div className="error_label">Something is wrong</div>: null}

              <div className="admin_submit">
                <button onClick={(e) => this.submitForm(e)}>
                    { this.state.formType}
                </button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    )
  }
}
