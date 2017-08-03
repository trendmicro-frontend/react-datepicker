import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TimeInputComponent from 'time-input';
import styles from './TimeInput.styl';

class TimeInput extends PureComponent {
    static propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func
    };
    static defaultProps = {
        value: '00:00:00',
        onChange: () => {}
    };

    render() {
        return (
            <div className={styles.timeInputContainer}>
                <TimeInputComponent
                    value={this.props.value}
                    onChange={this.props.onChange}
                    className={styles.timeInput}
                    defaultValue="00:00:00"
                    placeholder="hh:mm:ss"
                />
                <label className={styles.inputIconLabel}>
                    <i className="fa fa-clock-o" />
                </label>
            </div>
        );
    }
}

export default TimeInput;
