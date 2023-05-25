import React from 'react';
import PropTypes from 'prop-types';

import TextareaAutosize from 'react-autosize-textarea';

function Input({
  id, label, name, value, placeholder,
  required, type, onChange, forwardRef,
  resizable, minHeight, onResize, state,
  onKeyDown, disabled, autoFocus,
}) {
  return (
    <div>

      {label !== '' && <label className="small text-gray" htmlFor={id}>{label}</label>}

      {resizable
        ? (
          <TextareaAutosize
            dir="auto"
            style={{ minHeight: `${minHeight}px` }}
            name={name}
            id={id}
            className={`form-control ${state !== 'normal' ? ` form-control-${state}` : 'form-control-bg'}`}
            ref={forwardRef}
            type={type}
            placeholder={placeholder}
            required={required}
            defaultValue={value}
            autoComplete="off"
            onChange={onChange}
            onResize={onResize}
            onKeyDown={onKeyDown}
            disabled={disabled}
            autoFocus={autoFocus}
          />
        ) : (
          <input
            dir="auto"
            ref={forwardRef}
            id={id}
            name={name}
            className={`form-control ${state !== 'normal' ? ` form-control-${state}` : 'form-control-bg'}`}
            type={type}
            placeholder={placeholder}
            required={required}
            defaultValue={value}
            autoComplete="off"
            onChange={onChange}
            onKeyDown={onKeyDown}
            disabled={disabled}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus}
          />
        )}

    </div>
  );
}

Input.defaultProps = {
  id: null,
  name: '',
  label: '',
  value: '',
  placeholder: '',
  type: 'text',
  required: false,
  onChange: null,
  forwardRef: null,
  resizable: false,
  minHeight: 46,
  onResize: null,
  state: 'normal',
  onKeyDown: null,
  disabled: false,
  autoFocus: false,
};

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
  onChange: PropTypes.func,
  forwardRef: PropTypes.shape({}),
  resizable: PropTypes.bool,
  minHeight: PropTypes.number,
  onResize: PropTypes.func,
  state: PropTypes.oneOf(['normal', 'success', 'error']),
  onKeyDown: PropTypes.func,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
};

export default Input;
