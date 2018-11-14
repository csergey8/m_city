import React, { Component } from 'react';
import AdminLayout from '../../../hoc/AdminLayout';

import { FormField, validate } from '../../ui/misc';

import { firebaseTeams, firebaseDB, firebaseMatches } from '../../../firebase';
import { firebaseLooper } from '../../ui/misc';


export default class AddEditMatch extends Component {

  state = {
    matchId: '',
    formType: '',
    formError: false,
    formSuccess: '',
    teams: [],
    formData: {
      date: {
        element: 'input',
        value: '',
        config: {
          label: 'Event date',
          name: 'date_input',
          type: 'date'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMsg: '',
        showLabel: true 
      },
      local: {
        element: 'select',
        value: '',
        config: {
          label: 'Select local team',
          name: 'select_local',
          type: 'select',
          options: []
        },
        validation: {
          required: true
        },
        valid: false,
        validationMsg: '',
        showLabel: false
      },
      resultLocal: {
        element: 'input',
        value: '',
        config: {
          label: 'Result Local',
          name: 'result_local_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMsg: '',
        showLabel: false
      },
      away: {
        element: 'select',
        value: '',
        config: {
          label: 'Select away team',
          name: 'select_away',
          type: 'select',
          options: []
        },
        validation: {
          required: true
        },
        valid: false,
        validationMsg: '',
        showLabel: false
      },
      resultAway: {
        element: 'input',
        value: '',
        config: {
          label: 'Result Away',
          name: 'result_away_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMsg: '',
        showLabel: false
      },
      referee: {
        element: 'input',
        value: '',
        config: {
          label: 'Referee',
          name: 'referee_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMsg: '',
        showLabel: true 
      },
      stadium: {
        element: 'input',
        value: '',
        config: {
          label: 'Stadium',
          name: 'stadium_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMsg: '',
        showLabel: true 
      },
      result: {
        element: 'select',
        value: '',
        config: {
          label: 'Select result',
          name: 'select_result',
          type: 'select',
          options: [
            {key: 'W', value: 'W'},
            {key: 'D', value: 'D'},
            {key: 'L', value: 'L'},
            {key: 'n/a', value: 'n/a'},
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        validationMsg: '',
        showLabel: true
      },
      final: {
        element: 'select',
        value: '',
        config: {
          label: 'Game played ?',
          name: 'select_played',
          type: 'select',
          options: [
            {key: 'Yes', value: 'Yes'},
            {key: 'No', value: 'No'}
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        validationMsg: '',
        showLabel: true
      }

    }
  }

  successForm = (msg) => {
    this.setState({
      formSuccess: msg
    })

    setTimeout(() => {
      this.setState({
        formSuccess: ''
      })
    }, 3000)
  }

  submitForm = (e) => {
    e.preventDefault();

    let dataToSubmit = {};
    let formIsValid = true;

    for(let key in this.state.formData) {
      dataToSubmit[key] = this.state.formData[key].value;
      formIsValid = this.state.formData[key].valid && formIsValid;
    }

    this.state.teams.forEach((team) => {
      if(team.shortName === dataToSubmit.local) {
        dataToSubmit['localThmb'] = team.thmb
      }
      if(team.shortName === dataToSubmit.away) {
        dataToSubmit['awayThmb'] = team.thmb
      }
    })

    if(formIsValid) {
      if(this.state.formType === 'Edit Match') {
        firebaseDB.ref(`matches/${this.state.matchId}`).update(dataToSubmit)
          .then(res => {
            this.successForm('Update Correctly');
          })
          .catch(err => {
            this.setState({
              formError: true
            })
          })
      } else {
        firebaseMatches.push(dataToSubmit)
          .then(res => {
            this.props.history.push('/admin_matches')
          })
          .catch(err => {
            this.setState({
              formError: true
            })
            console.log(err);
          })
      }
    } else {
      this.setState({
        formError: true
      })
    }
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

  updateFields = (match, teamOptions, teams, type, matchId) => {
    const newFormData = {
      ...this.state.formData
    }
    for(let key in newFormData) {
      if(match) {
        newFormData[key].value = match[key];
        newFormData[key].valid = true; 
      }
      if(key === 'local' || key === 'away') {
        newFormData[key].config.options = teamOptions
      }
    }

    this.setState({
      matchId,
      formType: type,
      formData: newFormData,
      teams
    })
  }

  componentDidMount() {
    const matchId = this.props.match.params.id;
    const getTeams = (match, type) => {
      firebaseTeams.once('value').then(snap => {
        const teams = firebaseLooper(snap);
        const teamOptions = []
        snap.forEach((childSnapshot) => {
          teamOptions.push({
            key: childSnapshot.val().shortName,
            value: childSnapshot.val().shortName
          })
        })
        this.updateFields(match, teamOptions, teams, type, matchId);
      })
    }

    if(!matchId) {
       getTeams(false, 'Add Match');
    } else {
      firebaseDB.ref(`matches/${matchId}`).once('value')
        .then(snap => {
          const match = snap.val();
          getTeams(match, 'Edit Match');
        })
    }
  }

  render() {
    return (
      <AdminLayout>
        <div className="editmatch_dialog_wrapper">
          <h2>{this.state.formType}</h2>
          <div>
            <form onSubmit={(e) => this.submitForm(e)}>
              <FormField
                id={'date'}
                formData={this.state.formData.date }
                change={(element) => this.updateForm(element)}
              />

              <div className="select_team_layout">
                <div className="label_inputs">Local</div>
                <div className="wrapper">
                  <div className="left">
                    <FormField
                      id={'local'}
                      formData={this.state.formData.local }
                      change={(element) => this.updateForm(element)}
                    />
                  </div>
                  <div>
                  <FormField
                    id={'resultLocal'}
                    formData={this.state.formData.resultLocal }
                    change={(element) => this.updateForm(element)}
                  />
                  </div>
                </div>
              </div>

              <div className="select_team_layout">
                <div className="label_inputs">Away</div>
                <div className="wrapper">
                  <div className="left">
                    <FormField
                      id={'away'}
                      formData={this.state.formData.away }
                      change={(element) => this.updateForm(element)}
                    />
                  </div>
                  <div>
                  <FormField
                    id={'resultAway'}
                    formData={this.state.formData.resultAway }
                    change={(element) => this.updateForm(element)}
                  />
                  </div>
                </div>
              </div>

              <div className="split_fields">
                <FormField
                  id={'referee'}
                  formData={this.state.formData.referee }
                  change={(element) => this.updateForm(element)}
                />
                <FormField
                  id={'stadium'}
                  formData={this.state.formData.stadium }
                  change={(element) => this.updateForm(element)}
                />
              </div>

              <div className="split_fields last">
                <FormField
                  id={'result'}
                  formData={this.state.formData.result }
                  change={(element) => this.updateForm(element)}
                />
                <FormField
                  id={'final'}
                  formData={this.state.formData.final }
                  change={(element) => this.updateForm(element)}
                />
              </div>

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
