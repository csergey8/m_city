import React from 'react';
import { Link } from 'react-router-dom';


export const Tag = (props) => {
  const template = <div
      style={{
        background: props.bck,
        fontSize: props.size,
        color: props.color,
        padding: '5px',
        display: 'inline-block',
        fontFamily: 'Righteous',
        ...props.add
      }}>{props.children}</div>;

  return props.link ? (
            <Link to={props.link}>
              {template}
            </Link>
            ) : template

  /*
  if(props.link) {
    return (
      <Link to={props.link}>
        {template}
      </Link>
    )
  } else {
    return template
  }
*/
}

export const firebaseLooper = (snapshot) => {
  const data = [];
  
  snapshot.forEach((childSnapshot) => {
    data.push({
      ...childSnapshot.val(),
      id: childSnapshot.key
    })
  })

  return data
}


export const reverseArray = (array) => {
  const reversedArray = [];

  for(let i = array.length - 1; i >= 0; i--) {
    reversedArray.push(array[i]);
  }

  return reversedArray
}


export const PlayerCard = ({ number, name, lastname, bck}) => {
  return (
    <div className="player_card_wrapper">
      <div className="player_card_thmb" 
      style={{
        background: `#f2f9ff url(${bck})`
      }}></div>
      <div className="player_card_nfo">
        <div className="player_card_number">
        {number}
        </div>
        <div className="player_card_name">
          <span>{name}</span>
          <span>{lastname}</span>
        </div>
      </div>
    </div>
  );
}

export const FormField = ({ formData, id, change }) => {

    const showError = () => {
      let errorMsg = <div className="error_label">
                        {
                          formData.validation && !formData.valid ? 
                              formData.validationMsg
                          :null
                        }

                      </div>
      return errorMsg
    }

    const renderTemplate = () => {
      let formTemplate = null;

      switch(formData.element){
        case('input'):
          formTemplate = (
            <div>
              { formData.showLabel ? <div className="label_inputs">{formData.config.label}</div> : null}
              <input {...formData.config} value={formData.value} onChange={(e) => change({e, id}) }/>
              {showError()}
            </div>
          )
        break;
        case('select'):
            formTemplate = (
              <div>
                { formData.showLabel ? <div className="label_inputs">{formData.config.label}</div> : null}
                <select value={formData.value} onChange={(e) => change({e, id})}>
                 <option value="">Select one</option>
                 {
                   formData.config.options.map(item => (
                     <option key={item.key} value={item.key}>{item.value}</option>
                   ))
                 }
                </select>
                { showError() }
              </div>
            )
        break;
        default:
          formTemplate = null;
      }
       return formTemplate  
    }

    return (
      <div>
        {renderTemplate()}
      </div>
    )
}

export const validate = (element) => {
  let error = [true, ''];

  if(element.validation.email) {
    const valid = /[^@]+@[^\.]+\..+/g.test(element.value);
    const message = `${!valid ? 'Enter valid email' : null}`;
    error = !valid ? [valid, message] : [valid, message];
  }

  if(element.validation.required){
    const valid = element.value.trim() !== '';
    const message = `${!valid ? 'This field is required' : null}`;
    if(!valid) {
      error= [valid, message]
    }
  } 
  return error
}
