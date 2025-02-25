import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AuthRequest.scss';

import initMatrix from '../../../client/initMatrix';
import { openReusableDialog } from '../../../client/action/navigation';

import Text from '../../atoms/text/Text';
import Button from '../../atoms/button/Button';
import Input from '../../atoms/input/Input';
import Spinner from '../../atoms/spinner/Spinner';

import { useStore } from '../../hooks/useStore';

let lastUsedPassword;
const getAuthId = (password) => ({
  type: 'm.login.password',
  password,
  identifier: {
    type: 'm.id.user',
    user: initMatrix.matrixClient.getUserId(),
  },
});

function AuthRequest({ onComplete, makeRequest }) {
  const [status, setStatus] = useState(false);
  const mountStore = useStore();

  const handleForm = async (e) => {
    mountStore.setItem(true);
    e.preventDefault();
    const password = e.target.password.value;
    if (password.trim() === '') return;
    try {
      setStatus({ ongoing: true });
      await makeRequest(getAuthId(password));
      lastUsedPassword = password;
      if (!mountStore.getItem()) return;
      onComplete(true);
    } catch (err) {
      lastUsedPassword = undefined;
      if (!mountStore.getItem()) return;
      if (err.errcode === 'M_FORBIDDEN') {
        setStatus({ error: 'Wrong password. Please enter correct password.' });
        return;
      }
      setStatus({ error: 'Request failed!' });
    }
  };

  const handleChange = () => {
    setStatus(false);
  };

  return (
    <div className="auth-request">
      <form onSubmit={handleForm}>
        <div>
          <Input
            name="password"
            label="Account password"
            type="password"
            onChange={handleChange}
            required
          />
        </div>
        {status.ongoing && <Spinner size="small" />}
        {status.error && <div className="very-small text-gray">{status.error}</div>}
        {(status === false || status.error) && <Button variant="primary" type="submit" disabled={!!status.error}>Continue</Button>}
      </form>
    </div>
  );
}
AuthRequest.propTypes = {
  onComplete: PropTypes.func.isRequired,
  makeRequest: PropTypes.func.isRequired,
};

/**
 * @param {string} title Title of dialog
 * @param {(auth) => void} makeRequest request to make
 * @returns {Promise<boolean>} whether the request succeed or not.
 */
export const authRequest = async (title, makeRequest) => {
  try {
    const auth = lastUsedPassword ? getAuthId(lastUsedPassword) : undefined;
    await makeRequest(auth);
    return true;
  } catch (e) {
    lastUsedPassword = undefined;
    if (e.httpStatus !== 401 || e.data?.flows === undefined) return false;

    const { flows } = e.data;
    const canUsePassword = flows.find((f) => f.stages.includes('m.login.password'));
    if (!canUsePassword) return false;

    return new Promise((resolve) => {
      let isCompleted = false;
      openReusableDialog(
        <Text variant="s1" weight="medium">{title}</Text>,
        (requestClose) => (
          <AuthRequest
            onComplete={(done) => {
              isCompleted = true;
              resolve(done);
              requestClose();
            }}
            makeRequest={makeRequest}
          />
        ),
        () => {
          if (!isCompleted) resolve(false);
        },
      );
    });
  }
};

export default AuthRequest;
