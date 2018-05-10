import 'reactstrap'
import '../mainContent/mainContent.css'
import './accountModal.css'

import {
  Button,
  Form,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
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
  }

  /**
   * Open and close the modal and focus the main input when modal is opened
   */
  toggle = () => {
    this.setState({
      modal: !this.state.modal
    })
  }

  /**
   * Saves user input to component state
   */
  handleChange = event => {
    this.setState({ userInput: event.target.value })
  }

  /**
   * Grabs the input value and calls the change account function
   */
  triggerChangeAccount = () => {
    const battleTag = this.state.userInput

    this.props.changeAccount(battleTag)
  }

  render () {
    return (
      <div className='grid__tile center-inner-element icon-wrapper js--config-box' onClick={this.toggle}>
        <i className='fa fa-cog icon icon--setup' />

        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className={'modal-dialog-centered ' + this.props.className}
          autoFocus={false}
        >
          <ModalHeader toggle={this.toggle} className='header header--primary inline-text'>
            Change Battle Tag
          </ModalHeader>
          <ModalFooter>
            <Form onSubmit={this.triggerChangeAccount}>
              <InputGroup>
                <Input
                  id='accountInput'
                  className='accountInput'
                  placeholder='ExamPLE-8647'
                  onChange={this.handleChange}
                  autoFocus
                />
                <InputGroupAddon addonType='append'>
                  <Button type='submit'>Change!</Button>
                </InputGroupAddon>
              </InputGroup>
            </Form>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}

export default AccountModal
