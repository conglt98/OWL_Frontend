import React, {Component} from 'react';
import {
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import {AppSwitch} from '@coreui/react'
import {updateUserRole, deleteUserRole} from '../api/role'
import {rolesListSuggest} from './suggest'
import fakeAuth from '../api/fakeAuth'
import {Select} from 'antd';
import {connect} from 'react-redux'
import {setDelRole} from '../reducers/EventOptions'
const {Option} = Select;

class UserRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalDelete: false
    }
  }

  toggleDelete = () => {
    this.setState({
      modalDelete: !this.state.modalDelete
    })
  }

  handleChangeRole = (input) => {
    let user = this.props.user;
    user.role = input
    console.log(user);
    updateUserRole(user, fakeAuth.getAccessToken())
  }

  handleChangeStatus = (e) => {
    let user = this.props.user;
    user.status = e.target.checked === true
      ? "ON"
      : "OFF";
    updateUserRole(user, fakeAuth.getAccessToken());
  }

  handleDelete = (e) => {
    console.log(this.props.user);
    deleteUserRole(this.props.user, fakeAuth.getAccessToken());
    this.setState({modalDelete: false})
    this.props.setDelRole(JSON.parse(JSON.stringify(this.props.user)));
  }

  render() {
    const user = this.props.user
    return (
      <tr key={user.username}>
        <td width="60%"><strong>{user.name} <i>({user.username})</i></strong>
          
        </td>
        <td width="30%">
          <Select
            defaultValue={user.role}
            style={{
            width: '100%'
          }}
            onChange={this.handleChangeRole}>
            {rolesListSuggest.map(ele => (
              <Option value={ele}>{ele}</Option>
            ))}
          </Select>
        </td>
        <td width="5%"><AppSwitch
          className={'float-right'}
          variant={'pill'}
          label
          color={'success'}
          checked={user.status === 'ON'
        ? true
        : false}
          onChange={this.handleChangeStatus}
          size={'md'}/></td>
        <td width="5%">
          <Badge color={'danger'} onClick={this.toggleDelete}>
            <i className="fa fa-trash-o fa-2x myBtn"></i>
          </Badge>
        </td>
        <Modal size="md" isOpen={this.state.modalDelete} toggle={this.toggleDelete}>
          <ModalHeader toggle={this.toggleDelete}>
            Delete role
          </ModalHeader>
          <ModalBody
            style={{
            'max-height': 'calc(100vh - 210px)',
            'overflow-y': 'auto'
          }}>
            Do you really want to delete this user <b>{this.props.user.username}</b>?
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggleDelete}>Cancel</Button>

            <Button color="primary" onClick={this.handleDelete}>Delete</Button>
          </ModalFooter>
        </Modal>
      </tr>
    )
  }
}

const mapStateToProps = state => ({
  });
  const mapDispatchToProps = dispatch => ({
    setDelRole:data=> dispatch(setDelRole(data))
  });


export default connect(mapStateToProps, mapDispatchToProps)(UserRow);