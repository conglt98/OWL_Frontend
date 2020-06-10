/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {connect} from 'react-redux';

import {setComboBox,setComboBoxTier} from '../../reducers/EventOptions'

const filter = createFilterOptions();

class ComboBox extends React.Component {

    constructor(props){
      super(props)
      this.state={
        ...this.props,
      }
    }

    handleChange=(event, value) => {
        let id = this.props.id;
        let data = value===null ? '':value;

        if (this.props.type === 'cdt-tier'||this.props.type === 'edit-tier'||this.props.type === 'cdt-rule'||this.props.type === 'edit-rule'){
          let object = this.props.comboBoxTier;
          object[id] = data;
          this.props.setComboBoxTier(JSON.parse(JSON.stringify(object)))
        }
        else{
          let object = this.props.comboBox;
          object[id] = data;
          this.props.setComboBox(JSON.parse(JSON.stringify(object)));
        }
        this.setState({value:value})
    }

    render(){
    return (
      <React.Fragment>

      
        <Autocomplete
          id={this.props.id}
          style={{ width: "100%" }}
          freeSolo={this.props.freeSolo?true:false}
          size="small"
          disabled={this.props.disabled?true:false}
          value={this.state.value}
          m={0}
          options={this.props.options}
          getOptionLabel={option => {
            // e.g value selected with enter, right from the input
            if (typeof option === 'string') {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option;
          }}
          renderOption={option => option}
          onInputChange={this.handleChange}
          // filterOptions={(options, params) => {
          //   const filtered = filter(options, params);

          //   if (params.inputValue !== '') {
          //     filtered.push(
          //       `Press "Enter" to confirm`
          //     );
          //   }

          //   return filtered;
          // }}

          // onChange={this.handleChange} 
          renderInput={params => (
            <TextField {...params} label={this.props.label} 
            variant="outlined" margin="normal"/>
          )}
          renderOption={(option, { inputValue }) => {
            const matches = match(option, inputValue);
            const parts = parse(option, matches);
    
            return (
              <div>
                {parts.map((part, index) => (
                  <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                    {part.text}
                  </span>
                ))}
              </div>
            );
          }}
        />
      </React.Fragment>

      );
  }
}

const mapStateToProps = state => ({
    comboBox: state.EventOptions.comboBox,
    comboBoxTier: state.EventOptions.comboBoxTier,
  });
  
  const mapDispatchToProps = dispatch => ({
    setComboBox: data => dispatch(setComboBox(data)),
    setComboBoxTier: data => dispatch(setComboBoxTier(data)),
  });

export default connect(mapStateToProps, mapDispatchToProps)(ComboBox);