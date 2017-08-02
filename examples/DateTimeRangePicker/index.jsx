import { Button } from '@trendmicro/react-buttons';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import TimeInput from 'time-input';
import {
    DateField,
    DatePicker
} from '../../src';
import styles from './index.styl';

class DateTimeRangePicker extends PureComponent {
    static propTypes = {
        locale: PropTypes.string,
        startDate: PropTypes.string,
        startTime: PropTypes.string,
        endDate: PropTypes.string,
        endTime: PropTypes.string,
        onChangeStartDate: PropTypes.func,
        onChangeStartTime: PropTypes.func,
        onChangeEndDate: PropTypes.func,
        onChangeEndTime: PropTypes.func
    };

    render() {
        const {
            locale,
            startDate,
            startTime,
            endDate,
            endTime,
            onChangeStartDate,
            onChangeStartTime,
            onChangeEndDate,
            onChangeEndTime
        } = this.props;

        return (
            <div className={styles.datePickerPane}>
                <div className={styles.datePickerPaneHeader}>
                    <div className={styles.simpleDateTimeContainer}>
                        <div className={styles.inputIconGroup}>
                            <DateField
                                value={startDate}
                                onChange={onChangeStartDate}
                            />
                        </div>
                        <div className={styles.inputIconGroup}>
                            <TimeInput
                                value={startTime}
                                onChange={onChangeStartTime}
                                className={styles.timeInput}
                                defaultValue="12:00:00"
                                placeholder="hh:mm:ss"
                            />
                            <label className={styles.inputIconLabel}>
                                <i className="fa fa-clock-o" />
                            </label>
                        </div>
                    </div>
                    <div className={styles.tilde}>~</div>
                    <div className={styles.simpleDateTimeContainer}>
                        <div className={styles.inputIconGroup}>
                            <DateField
                                value={endDate}
                                onChange={onChangeEndDate}
                            />
                        </div>
                        <div className={styles.inputIconGroup}>
                            <TimeInput
                                value={endTime}
                                onChange={onChangeEndTime}
                                className={styles.timeInput}
                                defaultValue="12:00:00"
                                placeholder="hh:mm:ss"
                            />
                            <label className={styles.inputIconLabel}>
                                <i className="fa fa-clock-o" />
                            </label>
                        </div>
                    </div>
                </div>
                <div className={styles.datePickerPaneBody}>
                    <div className={styles.datePickerPaneContainer}>
                        <DatePicker
                            locale={locale}
                            date={startDate}
                            onChange={onChangeStartDate}
                            style={{ width: 248 }}
                        />
                    </div>
                    <div className={styles.datePickerPaneContainer}>
                        <DatePicker
                            locale={locale}
                            date={endDate}
                            onChange={onChangeEndDate}
                            style={{ width: 248 }}
                        />
                    </div>
                </div>
                <div className={styles.datePickerPaneFooter}>
                    <Button btnStyle="primary">Apply</Button>
                    <Button>Cancel</Button>
                </div>
            </div>
        );
    }
}

export default DateTimeRangePicker;

