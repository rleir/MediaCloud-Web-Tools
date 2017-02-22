import React from 'react';
import Link from 'react-router/lib/Link';
import IconButton from 'material-ui/IconButton';
import { injectIntl } from 'react-intl';
import ArrowDropDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';
import ArrowDropUpIcon from 'material-ui/svg-icons/navigation/arrow-drop-up';
import OpenInNewIcon from 'material-ui/svg-icons/action/open-in-new';
import ErrorIcon from 'material-ui/svg-icons/alert/error';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import messages from '../../resources/messages';
import ExploreIcon from './icons/ExploreIcon';
import DownloadIcon from './icons/DownloadIcon';
import HelpIcon from './icons/HelpIcon';
import DeleteIcon from './icons/DeleteIcon';
import AddIcon from './icons/AddIcon';
import EditIcon from './icons/EditIcon';
import FilledStarIcon from './icons/FilledStarIcon';
import EmptyStarIcon from './icons/EmptyStarIcon';
import SettingsIcon from './icons/SettingsIcon';
import RemoveIcon from './icons/RemoveIcon';
import CloseIcon from './icons/CloseIcon';
import MoreOptionsIcon from './icons/MoreOptionsIcon';
import ResetIcon from './icons/ResetIcon';
import FilterIcon from './icons/FilterIcon';
import { getBrandDarkColor, getBrandDarkerColor } from '../../styles/colors';

/**
 * The wrapper for our custom icons.  The idea is that you define all the SVG icons in individual
 * Components in the `icons` directory, then export wrapper instances of them here.
 */
function composeIconButton(Icon, defaultTooltipMessage, useBackgroundColor = true) {
  class AppIconButton extends React.Component {
    state = {
      backgroundColor: getBrandDarkColor(),
    };
    handleMouseEnter = () => {
      this.setState({ backgroundColor: getBrandDarkerColor() });
    }
    handleMouseLeave = () => {
      this.setState({ backgroundColor: getBrandDarkColor() });
    }
    handleClick = (event) => {
      const { onClick } = this.props;
      event.preventDefault();
      if (onClick) {
        onClick(event);
      }
    }
    render() {
      const { linkTo, onClick, color, tooltip, iconStyle, backgroundColor } = this.props;
      const { formatMessage } = this.props.intl;
      const displayTooltip = ((tooltip !== undefined) && (tooltip !== null)) ? tooltip : formatMessage(defaultTooltipMessage);
      const linkTarget = linkTo || null;
      const clickHandler = (onClick) ? this.handleClick : null;
      const otherProps = {};
      if (backgroundColor) {
        otherProps.backgroundColor = backgroundColor;
      } else if (useBackgroundColor === true) {
        otherProps.backgroundColor = this.state.backgroundColor;
      }
      return (
        <div className="icon-button">
          <Link
            to={linkTarget}
            onTouchTap={clickHandler}
            className="icon-button-link"
            name={displayTooltip}
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          >
            <IconButton
              tooltip={displayTooltip}
              iconStyle={iconStyle || {}}
              style={{ padding: 0, border: 0, width: 26, height: 26, color }}
              tooltipStyles={{ top: 20 }}
            >
              <Icon color={color} {...otherProps} />
            </IconButton>
          </Link>
        </div>
      );
    }
  }
  AppIconButton.propTypes = {
    onClick: React.PropTypes.func,
    linkTo: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object,
    ]),
    iconStyle: React.PropTypes.object,
    tooltip: React.PropTypes.string,
    intl: React.PropTypes.object.isRequired,
    color: React.PropTypes.string,
    backgroundColor: React.PropTypes.string,  // overrides everything else
  };
  return injectIntl(AppIconButton);
}

export const ExploreButton = composeIconButton(ExploreIcon, messages.explore);

export const DownloadButton = composeIconButton(DownloadIcon, messages.download);

export const HelpButton = composeIconButton(HelpIcon, messages.help);

export const DeleteButton = composeIconButton(DeleteIcon, messages.delete);

export const RemoveButton = composeIconButton(RemoveIcon, messages.remove);

export const AddButton = composeIconButton(AddIcon, messages.add);

export const FavoriteButton = composeIconButton(FilledStarIcon, messages.unfavorite);

export const FavoriteBorderButton = composeIconButton(EmptyStarIcon, messages.favorite);

export const ArrowDropDownButton = composeIconButton(ArrowDropDownIcon, messages.open, false);

export const ArrowDropUpButton = composeIconButton(ArrowDropUpIcon, messages.close, false);

export const SettingsButton = composeIconButton(SettingsIcon, messages.settings);

export const ReadItNowButton = composeIconButton(OpenInNewIcon, messages.readItNow, false);

export const EditButton = composeIconButton(EditIcon, messages.edit, false);

export const ErrorButton = composeIconButton(ErrorIcon, messages.error, false);

export const EyeButton = composeIconButton(RemoveRedEye, messages.monitored, false);

export const MoreOptionsButton = composeIconButton(MoreOptionsIcon, messages.moreOptions);

export const CloseButton = composeIconButton(CloseIcon, messages.close);

export const ResetButton = composeIconButton(ResetIcon, messages.reset);

export const FilterButton = composeIconButton(FilterIcon, messages.filter);
