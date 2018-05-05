import 'reactstrap'
import '../mainContent/mainContent.css'
import './accountModal.css'

import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap'

import React from 'react'

class AccountModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modal: false
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle () {
    this.setState({
      modal: !this.state.modal
    })
  }

  // onClick={this.changeAccount}
  render () {
    return (
      <div className='grid__tile center-inner-element icon-wrapper js--config-box' onClick={this.toggle}>
        <i className='fa fa-cog icon icon--setup' />

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={'modal-dialog-centered ' + this.props.className}
        >
          <ModalHeader toggle={this.toggle} className='header header--primary inline-text'>
            Change Battle Tag
          </ModalHeader>
          <ModalFooter>
            <InputGroup>
              <Input id='accountInput' placeholder='ExamPLE-8647' />
              <InputGroupAddon addonType='append'><Button onClick={this.toggle}>Change!</Button></InputGroupAddon>
            </InputGroup>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default AccountModal
