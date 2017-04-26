import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { LEVEL_INFO, LEVEL_WARNING, LEVEL_ERROR, ErrorNotice, InfoNotice, WarningNotice } from '../Notice';

const localMessages = {
  internalError: { id: 'errors.internal', defaultMessage: 'Internal Error' },
  notLoggedIn: { id: 'errors.notLoggedIn', defaultMessage: 'You need to login' },
  details: { id: 'errors.internal.details', defaultMessage: 'details' },
};

class AppNotice extends React.Component {

  state = {
    showDetails: false,
  };

  render() {
    const { message, htmlMessage, level, details } = this.props.info;
    const { formatMessage } = this.props.intl;
    let messageContent;
    let detailsContent = details;
    if (message) {
      let stringMessage;
      if (typeof message === 'object') {
        stringMessage = formatMessage(message);
      } else {
        stringMessage = message;
      }
      const isLowLevelError = (stringMessage.includes('.pm')) || (stringMessage.includes('.py'));  // ie. does it include a stack trace
      messageContent = stringMessage;
      if ((details === undefined) || (details === null)) {
        if (isLowLevelError) {
          if (stringMessage.includes('Invalid API key or authentication cookie')) {
            messageContent = <FormattedMessage {...localMessages.notLoggedIn} />;
          } else {
            messageContent = <FormattedMessage {...localMessages.internalError} />;
          }
          detailsContent = stringMessage;
        }
      }
    } else if (htmlMessage) {
      messageContent = (<span dangerouslySetInnerHTML={{ __html: htmlMessage }} />);
    }
    let content = null;
    switch (level) {
      case LEVEL_INFO:
        content = (
          <InfoNotice details={detailsContent}>
            {messageContent}
          </InfoNotice>
        );
        break;
      case LEVEL_WARNING:
        content = (
          <WarningNotice details={detailsContent}>
            {messageContent}
          </WarningNotice>
        );
        break;
      case LEVEL_ERROR:
      default:
        content = (
          <ErrorNotice details={detailsContent}>
            {messageContent}
          </ErrorNotice>
        );
        break;
    }
    return (content);
  }

}

AppNotice.propTypes = {
  intl: React.PropTypes.object.isRequired,
  info: React.PropTypes.object.isRequired,
};

export default
  injectIntl(
    AppNotice
  );
