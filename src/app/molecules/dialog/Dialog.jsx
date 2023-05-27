import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import { twemojify } from '../../../util/twemojify';
import ScrollView from '../../atoms/scroll/ScrollView';

function Dialog({
  className, isOpen, title, onAfterOpen, onAfterClose,
  onRequestClose, children, invisibleScroll,
}) {

  return (
    <Modal
      show={isOpen}
      onEntered={onAfterOpen}
      onHide={onRequestClose}
      onExited={onAfterClose}
      dialogClassName={className === null ? 'modal-dialog-centered modal-dialog-scrollable' : `${className} modal-dialog-scrollable`}
    >
      <Modal.Header className='noselect' closeButton>
        <Modal.Title className='h5 emoji-size-fix'>
          {
            typeof title === 'string'
              ? twemojify(title)
              : title
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ScrollView autoHide={!invisibleScroll} invisible={invisibleScroll}>
          {children}
        </ScrollView>
      </Modal.Body>
    </Modal>
  );

}

Dialog.defaultProps = {
  className: null,
  onAfterOpen: null,
  onAfterClose: null,
  onRequestClose: null,
  invisibleScroll: false,
};

Dialog.propTypes = {
  className: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.node.isRequired,
  onAfterOpen: PropTypes.func,
  onAfterClose: PropTypes.func,
  onRequestClose: PropTypes.func,
  children: PropTypes.node.isRequired,
  invisibleScroll: PropTypes.bool,
};

export default Dialog;
