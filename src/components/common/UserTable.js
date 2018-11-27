import PropTypes from 'prop-types';
import React from 'react';
import Link from 'react-router/lib/Link';
import { Grid } from 'react-flexbox-grid/lib';
import { FormattedMessage, injectIntl, FormattedNumber } from 'react-intl';
import messages from '../../resources/messages';
import AppButton from './AppButton';

function goToUpdate(id) {
  window.location = `/admin/users/${id}`;
}

const UserTable = (props) => {
  const { users } = props;
  const content = null;
  if (users === undefined) {
    return (
      <div>
        { content }
      </div>
    );
  }
  return (
    <div className="source-table">
      <Grid>
        <table width="100%">
          <tbody>
            <tr>
              <th><FormattedMessage {...messages.userEmail} /></th>
              <th><FormattedMessage {...messages.userFullName} /></th>
              <th><FormattedMessage {...messages.userPermissions} /></th>
              <th><FormattedMessage {...messages.edit} /></th>
            </tr>
            {users.map((user, idx) => {
              const roles = user.roles.map(r => r.role);
              return (
                <tr key={user.id} className={(idx % 2 === 0) ? 'even' : 'odd'}>
                  <td className="email">{user.email}</td>
                  <td>
                    <Link to={`/admin/users/${user.auth_users_id}`}>{user.full_name}</Link>
                  </td>
                  <td className="permissions"><FormattedNumber value={roles} /></td>
                  <td className="edit"><AppButton primary label="edit" onClick={() => goToUpdate(user.auth_users_id)} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Grid>
    </div>
  );
};

UserTable.propTypes = {
  users: PropTypes.array,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(UserTable);
