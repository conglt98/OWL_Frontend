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
import {setCurrentEvent,setRuleConditions,setTierConditions,setEditConditionTier,setDelConditionTier,setComboBoxTier} from '../../../reducers/EventOptions'
import EditCondition from './EditConditionTier'
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
      <ComboBox id="cbx-field-type"  type={this.props.type} value={condition.fieldType} label="Field type" options={fieldTypeSuggest}></ComboBox>


      </Col>
    </FormGroup>
    <FormGroup row className="mb-3 align-items-center">
      <Col md={3}>
      
      <Label ><b>Operator<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
      <Col md={9}>
      <ComboBox id="cbx-operator"  type={this.props.type} value={condition.operator} label="Operator" options={operatorSuggest}></ComboBox>
        </Col>
    </FormGroup>
    <FormGroup row className="mb-3 align-items-center">
      <Col md={3}>
      
      <Label ><b>Value<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
      <Col md={9}>
      <ComboBox id="cbx-value" freeSolo={true}  type={this.props.type} value={condition.value} label="Value" options={valueSuggest}></ComboBox>
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
  if (condition.value===''||condition.value.includes(' ')){
    value='\"\"'
  }else
  {
    value = condition.value
  }
  return condition.field +" "+condition.operator+" "+value
}


class Conditions extends React.Component{
    constructor(props){
        super(props);
        let conditions =[]

        if (props.tierData && props.tierData.conditions){
          conditions=props.tierData.conditions
        }
        if (props.type==='cdt-rule'){
          conditions=props.ruleConditions
        }
        this.state={
            ...this.props,
            modal:false,
            conditions:conditions,
        }
    }

    toggle = () => this.setState({modal:!this.state.modal});

    componentWillReceiveProps = (nextProps)=>{
      let cdt = this.state.conditions;
      let newCdt = nextProps.editCondition;

      if (Object.keys(newCdt).length>0 && newCdt['type'] === nextProps.type){
        //edit condition
        cdt.map(ele=>{
          if (ele.id === newCdt.id){
            for (const property in newCdt) {
              if (property !== 'type' && newCdt[property] !== undefined){
                ele[property] = newCdt[property]
              }
            }
          }
        })

        //update event global
        if (this.props.type==="cdt-tier"){
          let listProfiles = this.props.currentEvent.data.find(ele=>ele.name===this.props.domain).listProfiles;
          listProfiles.map(ele=>{
            if (ele.id === this.props.profileId){
              ele.listTiers.map(eleTier=>{
                if (eleTier.id===this.props.tier.id){
                  eleTier.conditions = cdt;
                }
              })
            }
          })
          this.props.setCurrentEvent({
            ...this.props.currentEvent,
            listProfiles:{
              ...this.props.currentEvent.listProfiles,
              [this.props.domain]:listProfiles,
            }
          });
        }else if (this.props.type==='cdt-rule'){
          let listProfiles = this.props.currentEvent.data.find(ele=>ele.name===this.props.domain).listProfiles;
          listProfiles.map(ele=>{
            if (ele.id.toString() === this.props.profileId.toString()){
              ele.listTiers.map(eleTier=>{
                if (eleTier.id.toString()===this.props.tierId.toString()){
                  eleTier.listRules.map(eleRule=>{
                    if (eleRule.id.toString()===this.props.tierData.id.toString()){
                      eleRule.ruleConditions=cdt
                    }
                  })
                }
              })
            }
          })
          this.props.setCurrentEvent({
            ...this.props.currentEvent,
            listProfiles:{
              ...this.props.currentEvent.listProfiles,
              [this.props.domain]:listProfiles,
            }
          });
        }

        this.setState({
          conditions:cdt,
        })
        this.props.setEditCondition({})
        this.props.setComboBoxTier({})
      }

      //del condition
      let delCdtID = nextProps.delCondition.split('$')[0];
      let type = nextProps.delCondition.split('$')[1];
      let typeId = nextProps.delCondition.split('$')[2];
      
      if (delCdtID.length > 0 && nextProps.type === type && nextProps.tierData.id.toString()===typeId.toString()){
        cdt = cdt.filter(ele=>{
          return ele.id.toString() !== delCdtID.toString()
        })

        //update event global
        if (this.props.type==="cdt-tier"){
          let listProfiles = this.props.currentEvent.data.find(ele=>ele.name===this.props.domain).listProfiles;
          listProfiles.map(ele=>{
            if (ele.id === this.props.profileId){
              ele.listTiers.map(eleTier=>{
                if (eleTier.id===this.props.tier.id){
                  eleTier.conditions = cdt;
                }
              })
            }
          })
          this.props.setCurrentEvent({
            ...this.props.currentEvent,
            listProfiles:{
              ...this.props.currentEvent.listProfiles,
              [this.props.domain]:listProfiles,
            }
          });
        }else if (this.props.type==='cdt-rule'){
          let listProfiles = this.props.currentEvent.data.find(ele=>ele.name===this.props.domain).listProfiles;
          listProfiles.map(ele=>{
            if (ele.id.toString() === this.props.profileId.toString()){
              ele.listTiers.map(eleTier=>{
                if (eleTier.id.toString()===this.props.tierId.toString()){
                  eleTier.listRules.map(eleRule=>{
                    if (eleRule.id.toString()===this.props.tierData.id.toString()){
                      eleRule.ruleConditions=cdt
                    }
                  })
                }
              })
            }
          })
          this.props.setCurrentEvent({
            ...this.props.currentEvent,
            listProfiles:{
              ...this.props.currentEvent.listProfiles,
              [this.props.domain]:listProfiles,
            }
          });
        }

        this.setState({
          conditions:cdt,
        })
        this.props.setDelCondition('')
        this.props.setComboBoxTier({})
      }
    }

    handleAddNewCondition = () =>{
      let condition = {
        id:uuid(),
        conditionType:this.props.type==='cdt-tier'?"tier":"rule",
        conditionTypeId:this.props.type==='cdt-tier'?this.props.tierData.id:this.props.tierData.latestVersion.id,
        operation: this.props.comboBoxTier["cbx-operation"]?this.props.comboBoxTier["cbx-operation"]:"compare",
        field: this.props.comboBoxTier["cbx-field"]?this.props.comboBoxTier["cbx-field"]:'userid',
        fieldType: this.props.comboBoxTier["cbx-field-type"]?this.props.comboBoxTier["cbx-field-type"]:"STRING",
        operator: this.props.comboBoxTier["cbx-operator"]?this.props.comboBoxTier["cbx-operator"]:"==",
        value: this.props.comboBoxTier["cbx-value"]?this.props.comboBoxTier["cbx-value"]:"",
      }

      if (condition.operation.toLowerCase()!=='compare'){
        condition.field = condition.operation.toUpperCase()+"(${"+condition.field.toLowerCase()+"})"
      }else{
        condition.field = condition.field.toLowerCase()
      }


      this.props.setComboBoxTier({})
      let cdt = JSON.parse(JSON.stringify(this.state.conditions))
      cdt.push(condition)
      this.setState({
        conditions:cdt,
        modal:false,
      })
      
      if (this.props.type === 'cdt-rule')
      {
        let listProfiles = this.props.currentEvent.data.find(ele=>ele.name===this.props.domain).listProfiles;
        listProfiles.map(ele=>{
          if (ele.id.toString() === this.props.profileId.toString()){
            ele.listTiers.map(eleTier=>{
              if (eleTier.id.toString()===this.props.tierId.toString()){
                eleTier.listRules.map(eleRule=>{
                  if (eleRule.id.toString()===this.props.tierData.id.toString()){
                    eleRule.ruleConditions=cdt
                  }
                })
              }
            })
          }
        })
        this.props.setCurrentEvent({
          ...this.props.currentEvent,
          listProfiles:{
            ...this.props.currentEvent.listProfiles,
            [this.props.domain]:listProfiles,
          }
        });
      }
      else if (this.props.type === 'cdt-tier'){
        let listProfiles = this.props.currentEvent.data.find(ele=>ele.name===this.props.domain).listProfiles;
        listProfiles.map(ele=>{
          if (ele.id === this.props.profileId){
            ele.listTiers.map(eleTier=>{
              if (eleTier.id===this.props.tier.id){
                eleTier.conditions = cdt;
              }
            })
          }
        })
        this.props.setCurrentEvent({
          ...this.props.currentEvent,
          listProfiles:{
            ...this.props.currentEvent.listProfiles,
            [this.props.domain]:listProfiles,
          }
        });

      }
    }

    render(){
        let {conditions,modal} = this.state;
        if (this.props.type==='cdt-rule'){
          conditions = this.props.ruleConditions
        }
        return (
            <React.Fragment>
                
                {this.props.mode==='view'&&conditions.length===0?'None':conditions.map((condition,index)=>
                    (<EditCondition mode={this.props.mode} key={index} type = {this.props.type} typeId = {this.props.tierData.id} buttonLabel={displayCondition(condition)} condition={condition} size= "sm" style={iconStyle} color="secondary" className={displayCondition(condition)}></EditCondition>)
                )}
                {this.props.mode==='view'?<span></span>:
                <Button color="secondary" size="sm" outline onClick={this.toggle}>+</Button>}
                <Modal isOpen={modal} toggle={this.toggle}>
                <ModalHeader toggle={this.toggle}>Add new condition</ModalHeader>
                <ModalBody>
                    <ConditionForm key={this.props.key} type = {this.props.type} condition={{}}></ConditionForm>
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
  comboBoxTier: state.EventOptions.comboBoxTier,
  currentEvent: state.EventOptions.currentEvent,
  editCondition:state.EventOptions.editConditionTier,
  delCondition:state.EventOptions.delConditionTier,
});
const mapDispatchToProps = dispatch => ({
  setComboBoxTier:data=> dispatch(setComboBoxTier(data)),
  setCurrentEvent:data=> dispatch(setCurrentEvent(data)),
  setEditCondition:data=> dispatch(setEditConditionTier(data)),
  setDelCondition:data=> dispatch(setDelConditionTier(data)),
  setRuleConditions:data=> dispatch(setRuleConditions(data)),
  setTierConditions:data=> dispatch(setTierConditions(data)),

});

export default connect(mapStateToProps, mapDispatchToProps)(Conditions);