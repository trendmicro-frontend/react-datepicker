import cx from 'classnames';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TimeInputComponent from 'time-input';
import styles from './TimeInput.styl';

class TimeInput extends PureComponent {
    static propTypes = {
        value: PropTypes.string,
        onChange: PropTypes.func,
        rendeIcon: PropTypes.func
    };
    static defaultProps = {
        value: '00:00:00',
        onChange: () => {},
        renderIcon: (props) => (
            <label className={props.className}>
                {props.children}
            </label>
        )
    };

    render() {
        const { className } = this.props;

        return (
            <div className={cx(className, styles.timeInputContainer)}>
                <TimeInputComponent
                    value={this.props.value}
                    onChange={this.props.onChange}
                    className={styles.timeInput}
                />
                {this.props.renderIcon({
                    className: styles.timeInputIcon,
                    children: <i className="fa fa-clock-o" />
                })}
            </div>
        );
    }
}

export default TimeInput;
