import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import uncontrollable from 'uncontrollable';
import DatePicker from './DatePicker';
import DateInput from './DateInput';
import TimeInput from './TimeInput';
import styles from './date-picker-pane.styl';

class DateTimePicker extends PureComponent {
    static propTypes = {
        locale: PropTypes.string,
        date: PropTypes.string,
        time: PropTypes.string,
        onChangeDate: PropTypes.func,
        onChangeTime: PropTypes.func
    };

    render() {
        const {
            locale,
            date,
            time,
            onChangeDate,
            onChangeTime
        } = this.props;

        return (
            <div className={styles.datePickerPane}>
                <div className={styles.datePickerPaneHeader}>
                    <div className={styles.dateTimeContainer}>
                        <div className={styles.inputIconGroup}>
                            <DateInput
                                value={date}
                                onChange={onChangeDate}
                            />
                        </div>
                        <div className={styles.inputIconGroup}>
                            <TimeInput
                                value={time}
                                onChange={onChangeTime}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.datePickerPaneBody}>
                    <div className={styles.datePickerPaneContainer}>
                        <DatePicker
                            locale={locale}
                            value={date}
                            onSelect={onChangeDate}
                        />
                    </div>
                </div>
                <div className={styles.datePickerPaneFooter} />
            </div>
        );
    }
}

export default uncontrollable(DateTimePicker, {
    // Define the pairs of prop/handlers you want to be uncontrollable
    date: 'onChangeDate',
    time: 'onChangeTime'
});
