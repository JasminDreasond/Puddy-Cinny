import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/Modal';
import { twemojify } from '../../../util/twemojify';
import ScrollView from '../../atoms/scroll/ScrollView';

function Dialog({
  className, isOpen, title, onAfterOpen, onAfterClose,
  contentOptions, onRequestClose, children,
  invisibleScroll,
}) {

  return (
    <Modal
      show={isOpen}
      onEntered={onAfterOpen}
      onHide={onRequestClose}
      onExited={onAfterClose}
      dialogClassName={className === null ? 'modal-dialog-centered' : `${className} `}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {
            typeof title === 'string'
              ? twemojify(title)
              : title
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {contentOptions}
        <ScrollView autoHide={!invisibleScroll} invisible={invisibleScroll}>
          <div className="dialog__content-container">
            {children}
          </div>
        </ScrollView>
      </Modal.Body>
    </Modal>
  );

}

Dialog.defaultProps = {
  className: null,
  contentOptions: null,
  onAfterOpen: null,
  onAfterClose: null,
  onRequestClose: null,
  invisibleScroll: false,
};

Dialog.propTypes = {
  className: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.node.isRequired,
  contentOptions: PropTypes.node,
  onAfterOpen: PropTypes.func,
  onAfterClose: PropTypes.func,
  onRequestClose: PropTypes.func,
  children: PropTypes.node.isRequired,
  invisibleScroll: PropTypes.bool,
};

export default Dialog;
