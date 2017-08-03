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
        focus: false
    };

    isClickEvent = false;

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
                    onChange={value => {
                        onChange(value);
                    }}
                    onFocus={() => {
                        this.setState((state) => ({
                            focus: true
                        }));
                    }}
                    onBlur={event => {
                        event.stopPropagation();

                        setTimeout(() => {
                            if (this.isClickEvent) {
                                // Focus on the input element
                                const node = ReactDOM.findDOMNode(this.dateInput);
                                if (node) {
                                    const el = node.querySelector('input');
                                    el && el.focus();
                                }
                            } else {
                                this.setState((state) => ({
                                    focus: false
                                }));
                            }

                            this.isClickEvent = false;
                        }, 0);
                    }}
                />
                <div
                    className={styles.dropdown}
                    style={{
                        display: this.state.focus ? 'block' : 'none',
                        padding: '8px 4px'
                    }}
                >
                    <DatePicker
                        locale={locale}
                        date={date}
                        onChange={(value, obj, event) => {
                            onChange(value);
                        }}
                        onClick={(event) => {
                            this.isClickEvent = true;
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default DatePickerDropdown;
