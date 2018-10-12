import React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import ShortTextIcon from '@material-ui/icons/ShortText';
import LocationIcon from '@material-ui/icons/LocationOn';
import DateRangeIcon from '@material-ui/icons/DateRange';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import MultiSelector from '../layout/MultiSelector';

class TaskTypeSelector extends React.Component {
  state = {};

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSelect = (selected) => {
    this.handleClose();
    if (this.props.onSelect) {
      this.props.onSelect(selected);
    }
  };

  render() {
    const { anchorEl } = this.state;
    const options = [
      {
        label: 'Short Text',
        value: 'free_text',
        icon: <ShortTextIcon />,
      },
      {
        label: 'Location',
        value: 'geolocation',
        icon: <LocationIcon />,
      },
      {
        label: 'Datetime',
        value: 'datetime',
        icon: <DateRangeIcon />,
      },
      {
        label: 'Single Choice',
        value: 'single_choice',
        icon: <RadioButtonCheckedIcon />,
      },
      {
        label: 'Choose multiple',
        value: 'multiple_choice',
        icon: <CheckBoxIcon />,
      },
    ];

    return (
      <div>
        <Button onClick={this.handleClick} variant="outlined">
          {this.props.selected.length ?
            <FormattedMessage
              id="taskTypeSelector.numTypes"
              defaultMessage="{length, number} selected"
              values={{ length: this.props.selected.length }}
            /> :
            <FormattedMessage id="taskTypeSelector.allTypes" defaultMessage="All tasks" />
          }
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MultiSelector
            allowSearch={false}
            options={options}
            selected={this.props.selected}
            onDismiss={this.handleClose}
            onSubmit={this.handleSelect}
          />
        </Menu>
      </div>
    );
  }
}

export default TaskTypeSelector;
