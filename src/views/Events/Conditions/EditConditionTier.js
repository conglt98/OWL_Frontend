import React, { useState }  from 'react'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter
        ,Row,
        Col,
        Form,
        FormGroup,
        Label,
        Input
} from 'reactstrap'
import ComboBox from '../ComboBox'
import {connect} from 'react-redux';
import {setEditConditionTier,setDelConditionTier} from '../../../reducers/EventOptions'
import {ConditionForm} from './index'
class EditCondition extends React.Component {
    constructor(props){
        super(props)
        this.state={
            ...this.props,
            modal:false,
        }
    }

    toggle = () => this.setState({modal:!this.state.modal});
    handleEditCondition = ()=>{
      let condition = {
        id:this.props.condition.id,
        operation: this.props.comboBox["cbx-operation"]?this.props.comboBox["cbx-operation"]:"compare",
        field: this.props.comboBox["cbx-field"]?this.props.comboBox["cbx-field"]:'userid',
        fieldType: this.props.comboBox["cbx-field-type"]?this.props.comboBox["cbx-field-type"]:"STRING",
        operator: this.props.comboBox["cbx-operator"]?this.props.comboBox["cbx-operator"]:"==",
        value: this.props.comboBox["cbx-value"]?this.props.comboBox["cbx-value"]:"",
        type:this.props.type
      }

      if (condition.operation.toLowerCase()!=='compare'){
        condition.field = condition.operation.toUpperCase()+"(${"+condition.field.toLowerCase()+"})"
      }else{
        condition.field = condition.field.toLowerCase()
      }


      this.props.setEditConditionTier(condition);
      this.setState({
        modal: false,
      })
    }

    handleDeleteCondition=()=>{
        this.props.setDelConditionTier(this.props.condition.id+"$"+this.props.type+"$"+this.props.typeId)
        this.setState({
            modal:false
        })
    }
    render(){
        const {color,size,style,buttonLabel,className,condition} = this.props;
        const {modal} = this.state;
        return (
            <React.Fragment>
              <Button disabled={this.props.mode==='view'?true:false} color={color} size={size} style={style} onClick={this.toggle}>{buttonLabel}</Button>
              <Modal isOpen={modal} toggle={this.toggle} className={className}>
                <ModalHeader toggle={this.toggle}>Edit condition</ModalHeader>
                <ModalBody>
                    <ConditionForm type={this.props.type} condition={condition}></ConditionForm>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" className="mr-auto" onClick={this.handleDeleteCondition}>Delete</Button>

                  <Button color="secondary" onClick={this.toggle}>Cancel</Button>

                  <Button color="primary" onClick={this.handleEditCondition}>Save changes</Button>
                </ModalFooter>
              </Modal>
            </React.Fragment>
          );
    }
  }

  const mapStateToProps = state => ({
    comboBox: state.EventOptions.comboBoxTier,
  });
  const mapDispatchToProps = dispatch => ({
    setEditConditionTier:data=> dispatch(setEditConditionTier(data)),
    setDelConditionTier:data=> dispatch(setDelConditionTier(data)),
  });
  
  
 export default connect(mapStateToProps, mapDispatchToProps)(EditCondition);