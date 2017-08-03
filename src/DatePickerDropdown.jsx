import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import DateInput from './DateInput';
import DatePicker from './DatePicker';
import styles from './index.styl';

class DatePickerDropdown extends PureComponent {
    static propTypes = {
        locale: PropTypes.string,
        date: PropTypes.string,
        onChange: PropTypes.func
    };

    state = {
        focused: false
    };
    isDateInputOnBlur = false;
    isDatePickerOnClick = false;

    render() {
        const {
            locale,
            date,
            onChange
        } = this.props;

        return (
            <div style={{ position: 'relative' }}>
                <DateInput
                    ref={node => {
                        this.dateInput = node;
                    }}
                    value={date}
                    onChange={onChange}
                    onFocus={() => {
                        this.setState((state) => ({
                            focused: true
                        }));
                    }}
                    onBlur={event => {
                        event.stopPropagation();
                        this.isDateInputOnBlur = true;

                        setTimeout(() => {
                            if (this.isDatePickerOnClick) {
                                // Focus on the input element
                                const node = ReactDOM.findDOMNode(this.dateInput);
                                if (node) {
                                    const el = node.querySelector('input');
                                    el && el.focus();
                                }
                            } else {
                                this.setState(state => ({
                                    focused: false
                                }));
                            }

                            this.isDateInputOnBlur = false;
                            this.isDatePickerOnClick = false;
                        }, 0);
                    }}
                />
                <div
                    className={styles.dropdown}
                    style={{
                        display: this.state.focused ? 'block' : 'none',
                        padding: '8px 4px'
                    }}
                >
                    <DatePicker
                        locale={locale}
                        date={date}
                        onChange={onChange}
                        onClick={event => {
                            if (this.isDateInputOnBlur) {
                                this.isDatePickerOnClick = true;
                            }
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default DatePickerDropdown;
