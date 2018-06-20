import Anchor from '@trendmicro/react-anchor';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import DateTimeRangePicker from './DateTimeRangePicker';

const normalizeDateString = (dateString) => {
    let m = moment(dateString);
    if (!m.isValid()) {
        m = moment();
    }
    return m.format('YYYY-MM-DD');
};

const normalizeTimeString = (timeString) => {
    let [hh = '00', mm = '00', ss = '00'] = timeString.split(':');
    hh = Number(hh) || 0;
    mm = Number(mm) || 0;
    ss = Number(ss) || 0;
    hh = (hh < 0 || hh > 23) ? '00' : ('0' + hh).slice(-2);
    mm = (mm < 0 || mm > 59) ? '00' : ('0' + mm).slice(-2);
    ss = (ss < 0 || ss > 59) ? '00' : ('0' + ss).slice(-2);
    return `${hh}:${mm}:${ss}`;
};

export default class extends PureComponent {
    static propTypes = {
        locale: PropTypes.string
    };

    state = this.getInitialState();

    changeStartDate = (date) => {
        if (!date) {
            return;
        }

        this.setState(state => {
            const startDate = normalizeDateString(date);
            const endDate = normalizeDateString(state.endDate);
            const startTime = normalizeTimeString(state.startTime);
            const endTime = normalizeTimeString(state.endTime);
            const isoStartDateTime = `${startDate}T${startTime}`;
            const isoEndDateTime = `${endDate}T${endTime}`;
            const isEndDateAfterMaxDate = state.maxDate && moment(endDate).isAfter(moment(state.maxDate).endOf('day'));
            const isSameOrAfterEnd = moment(isoStartDateTime).isSameOrAfter(isoEndDateTime);

            let nextEndDate = endDate;
            if (isEndDateAfterMaxDate) {
                nextEndDate = normalizeDateString(state.maxDate);
            } else if (isSameOrAfterEnd) {
                nextEndDate = startDate;
            }

            return {
                startDate: startDate,
                endDate: nextEndDate,
                startTime: startTime,
                endTime: isSameOrAfterEnd ? startTime : endTime
            };
        });
    };

    changeEndDate = (date) => {
        if (!date) {
            return;
        }

        this.setState(state => {
            const startDate = normalizeDateString(state.startDate);
            const endDate = normalizeDateString(date);
            const startTime = normalizeTimeString(state.startTime);
            const endTime = normalizeTimeString(state.endTime);
            const isoStartDateTime = `${startDate}T${startTime}`;
            const isoEndDateTime = `${endDate}T${endTime}`;
            const isStartDateBeforeMinDate = state.minDate && moment(startDate).isBefore(moment(state.minDate).startOf('day'));
            const isSameOrBeforeStart = moment(isoEndDateTime).isSameOrBefore(isoStartDateTime);

            let nextStartDate = startDate;
            if (isStartDateBeforeMinDate) {
                nextStartDate = normalizeDateString(state.minDate);
            } else if (isSameOrBeforeStart) {
                nextStartDate = endDate;
            }

            return {
                startDate: nextStartDate,
                endDate: endDate,
                startTime: isSameOrBeforeStart ? endTime : startTime,
                endTime: endTime
            };
        });
    };

    changeStartTime = (time = '00:00:00') => {
        this.setState(state => {
            const startDate = normalizeDateString(state.startDate);
            const endDate = normalizeDateString(state.endDate);
            const startTime = normalizeTimeString(time);
            const endTime = normalizeTimeString(state.endTime);
            const isoStartDateTime = `${startDate}T${startTime}`;
            const isoEndDateTime = `${endDate}T${endTime}`;
            const isSameOrAfterEnd = moment(isoStartDateTime).isSameOrAfter(isoEndDateTime);

            return {
                startTime: startTime,
                endTime: isSameOrAfterEnd ? startTime : endTime
            };
        });
    };

    changeEndTime = (time = '00:00:00') => {
        this.setState(state => {
            const startDate = normalizeDateString(state.startDate);
            const endDate = normalizeDateString(state.endDate);
            const startTime = normalizeTimeString(state.startTime);
            const endTime = normalizeTimeString(time);
            const isoStartDateTime = `${startDate}T${startTime}`;
            const isoEndDateTime = `${endDate}T${endTime}`;
            const isSameOrBeforeStart = moment(isoEndDateTime).isSameOrBefore(isoStartDateTime);

            return {
                startTime: isSameOrBeforeStart ? endTime : startTime,
                endTime: endTime
            };
        });
    };

    getInitialState() {
        const now = moment();

        return {
            minDate: '2000-01-01',
            maxDate: moment(now).format('YYYY-MM-DD'),
            startDate: moment(now).format('YYYY-MM-DD'),
            startTime: moment(now).format('hh:mm:ss'),
            endDate: moment(now).add(7, 'days').format('YYYY-MM-DD'),
            endTime: moment(now).add(7, 'days').format('hh:mm:ss')
        };
    }
    render() {
        const { locale } = this.props;
        const { minDate, maxDate, startDate, startTime, endDate, endTime } = this.state;

        return (
            <div>
                <h3><Anchor href="https://github.com/trendmicro-frontend/react-datepicker/blob/master/examples/DateTimeRangePicker/Controlled.jsx" target="_blank">Controlled Component</Anchor></h3>
                <p><b>Note:</b> This example will update invalid date/time range.</p>
                <ul>
                    <li>Minimum: {minDate}</li>
                    <li>Maximum: {maxDate}</li>
                    <li>Range: {startDate} {startTime} ~ {endDate} {endTime}</li>
                </ul>
                <DateTimeRangePicker
                    locale={locale}
                    minDate={minDate}
                    maxDate={maxDate}
                    startDate={startDate}
                    startTime={startTime}
                    endDate={endDate}
                    endTime={endTime}
                    onChangeStartDate={this.changeStartDate}
                    onChangeStartTime={this.changeStartTime}
                    onChangeEndDate={this.changeEndDate}
                    onChangeEndTime={this.changeEndTime}
                />
            </div>
        );
    }
}
