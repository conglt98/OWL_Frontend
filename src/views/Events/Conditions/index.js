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
import {setDelProfile,setCurrentEvent,setDelDomain,setEditCondition,setDelCondition,setComboBox} from '../../../reducers/EventOptions'
import EditCondition from './EditCondition'
import uuid from 'react-uuid'
import { operationSuggest,fieldSuggest,fieldTypeSuggest,operatorSuggest,valueSuggest} from '../Suggest'
const iconStyle = {
    'margin-right' :'5px'
}

export class ConditionForm extends React.Component{
  constructor(props){
    super(props);
    this.state={
      ...props,
    }
  }
  render(){
    const {condition} = JSON.parse(JSON.stringify(this.state));
    if (condition.field && condition.field.split("(").length>1){
      condition.operation = condition.field.split("(")[0]
      condition.field = condition.field.split("(")[1].split("{")[1]
      condition.field = condition.field.substring(0,condition.field.length-2)
    }
    return(<Row className="justify-content-md-center">
    <Col md={12}>
    <Form>
    <FormGroup row className="mb-3 align-items-center">
      <Col md={3}>
      <Label ><b>Operation<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
      <Col md={9}>
      <ComboBox value={condition.operation} type={this.props.type} id="cbx-operation" label="Operation" options={operationSuggest}></ComboBox>

      </Col>
    </FormGroup>
    <FormGroup row className="mb-3 align-items-center">
      <Col md={3}>
      <Label ><b>Field<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
      <Col md={9}>
      <ComboBox id="cbx-field" freeSolo={true} label="Field" type={this.props.type} value={condition.field} options={fieldSuggest}></ComboBox>
      </Col>
    </FormGroup>
    <FormGroup row className="mb-3 align-items-center">
      <Col md={3}>
      <Label ><b>Field type<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
      <Col md={9}>
      <ComboBox id="cbx-field-type" type={this.props.type} value={condition.fieldType} label="Field type" options={fieldTypeSuggest}></ComboBox>


      </Col>
    </FormGroup>
    <FormGroup row className="mb-3 align-items-center">
      <Col md={3}>
      
      <Label ><b>Operator<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
      <Col md={9}>
      <ComboBox id="cbx-operator" type={this.props.type} value={condition.operator} label="Operator" options={operatorSuggest}></ComboBox>
        </Col>
    </FormGroup>
    <FormGroup row className="mb-3 align-items-center">
      <Col md={3}>
      
      <Label ><b>Value<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
      <Col md={9}>
      <ComboBox id="cbx-value" freeSolo={true} type={this.props.type} value={condition.value} label="Value" options={valueSuggest}></ComboBox>
        </Col>
    </FormGroup>
  </Form>
    </Col>
  </Row>
)
  }
}



const displayCondition = (condition)=>{
  let value = '';
  if (condition.value===''||(condition.value!==undefined&&condition.value.includes(' '))){
    value='\"\"'
  }else
  {
    value = condition.value
  }
  return condition.field +" "+condition.operator+" "+value;
}


class Conditions extends React.Component{
    constructor(props){
        super(props);
        let conditionData=[];
        if (props.conditionData){
          conditionData=props.conditionData
        }
        this.state={
            ...this.props,
            modal:false,
            conditions:conditionData
        }
    }

    toggle = () => this.setState({modal:!this.state.modal});

    componentWillReceiveProps = (nextProps)=>{
      let cdt = this.state.conditions;
      let newCdt = nextProps.editCondition;

      if (Object.keys(newCdt).length>0){
        //edit condition
        cdt.map(ele=>{
          if (ele.id === newCdt.id){
            for (const property in newCdt) {
              if (newCdt[property] !== undefined){
                ele[property] = newCdt[property]
              }
            }
          }
        })

        //update event global
      let {domain, currentEvent} = this.props;
      let listProfiles = currentEvent.data.find(ele=>ele.name===domain).listProfiles;
      listProfiles=listProfiles?listProfiles:[]
      listProfiles.map(ele=>{
      if (ele.id === this.props.profileId){
        ele.conditions = cdt
      }
      })

      currentEvent = {
        ...currentEvent,
        listProfiles:
          {
            ...currentEvent.listProfiles,
            [this.props.domain]:listProfiles
          }
      }
      this.props.setCurrentEvent(currentEvent)

        this.setState({
          conditions:cdt,
        })
        this.props.setEditCondition({})
        this.props.setComboBox({})
      }

      //del condition
      let delCdtID = nextProps.delCondition;
      if (delCdtID.length > 0){
        delCdtID = JSON.parse(delCdtID)
        if (delCdtID.profileId.toString()!==this.props.profileId.toString()){
          return;
        }

        cdt = cdt.filter(ele=>{
          return ele.id.toString() !== delCdtID.id.toString()
        })
        //update event global
        let {currentEvent} = this.props;
        let listProfiles = this.props.currentEvent.data.find(domain=>domain.name===delCdtID.domain).listProfiles;
        listProfiles = listProfiles?listProfiles:[];
        listProfiles.map(ele=>{
        if (ele.id.toString() === delCdtID.profileId.toString()){
          ele.conditions = cdt
        }
        })

        currentEvent.data.find(domain=>domain.name===delCdtID.domain).listProfiles=listProfiles
        this.props.setCurrentEvent(currentEvent)

          this.setState({
            conditions:cdt,
          })
          this.props.setDelCondition('')
          this.props.setComboBox({})
        }
    }

    handleAddNewCondition = () =>{
      let condition = {
        id:uuid(),
        conditionType:"profile",
        conditionTypeId:this.props.profileId,
        operation: this.props.comboBox["cbx-operation"]?this.props.comboBox["cbx-operation"]:"compare",
        field: this.props.comboBox["cbx-field"]?this.props.comboBox["cbx-field"]:'userid',
        fieldType: this.props.comboBox["cbx-field-type"]?this.props.comboBox["cbx-field-type"]:"STRING",
        operator: this.props.comboBox["cbx-operator"]?this.props.comboBox["cbx-operator"]:"==",
        value: this.props.comboBox["cbx-value"]?this.props.comboBox["cbx-value"]:"",
      }

      if (condition.operation.toLowerCase()!=='compare'){
        condition.field = condition.operation.toUpperCase()+"(${"+condition.field.toLowerCase()+"})"
      }else{
        condition.field = condition.field.toLowerCase()
      }

      let {profile, filter} = this.props;

      let listProfiles = this.props.currentEvent.data.find(ele=>ele.name===this.props.domain).listProfiles;
      listProfiles.map(ele=>{
        if (ele.id === this.props.profileId){
          ele.conditions = JSON.parse(JSON.stringify(this.state.conditions))
          ele.conditions.push(condition)
        }
      })

      let currentEvent = {
        ...this.props.currentEvent,
        listProfiles:
          {
            ...this.props.currentEvent.listProfiles,
            [this.props.domain]:listProfiles
          }
      }
      
      let cdt = JSON.parse(JSON.stringify(this.state.conditions))
      cdt.push(condition)
      this.setState({
        conditions:cdt,
        modal:false,
      })
      this.props.setCurrentEvent(currentEvent)
      this.props.setComboBox({})
    }

    render(){
        const {conditions,modal} = this.state;
        return (
            <React.Fragment>
                {this.props.mode==='view'&&conditions.length===0?'None':conditions.map((condition,index)=>
                    (<EditCondition domain={this.props.domain} profileId={this.props.profileId} mode={this.props.mode} key={index} type={this.props.type} buttonLabel={displayCondition(condition)} condition={condition} size= "sm" style={iconStyle} color="secondary" className={displayCondition(condition)}></EditCondition>)
                )}
                {this.props.mode==='view'?<span></span>:
                <Button color="secondary" size="sm" outline onClick={this.toggle}>+</Button>}
                <Modal isOpen={modal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>Add new condition</ModalHeader>
                <ModalBody>
                    <ConditionForm key={this.props.key} type={this.props.type} condition={{}}></ConditionForm>
                </ModalBody>
                <ModalFooter>

                  <Button color="secondary" onClick={this.toggle}>Cancel</Button>

                  <Button color="primary" onClick={this.handleAddNewCondition}>Save changes</Button>
                </ModalFooter>
              </Modal>
            </React.Fragment>
        );
    }
}


const mapStateToProps = state => ({
  comboBox: state.EventOptions.comboBox,
  delProfile: state.EventOptions.delProfile,
  currentEvent: state.EventOptions.currentEvent,
  editCondition:state.EventOptions.editCondition,
  delCondition:state.EventOptions.delCondition,
});
const mapDispatchToProps = dispatch => ({
  setDelProfile:data=> dispatch(setDelProfile(data)),
  setCurrentEvent:data=> dispatch(setCurrentEvent(data)),
  setDelDomain:data=> dispatch(setDelDomain(data)),
  setEditCondition:data=> dispatch(setEditCondition(data)),
  setDelCondition:data=> dispatch(setDelCondition(data)),
  setComboBox:data=> dispatch(setComboBox(data)),

});

export default connect(mapStateToProps, mapDispatchToProps)(Conditions);