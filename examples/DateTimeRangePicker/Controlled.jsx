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
        const startDate = normalizeDateString(date);
        const endDate = normalizeDateString(this.state.endDate);
        const startTime = normalizeTimeString(this.state.startTime);
        const endTime = normalizeTimeString(this.state.endTime);
        const isoStartDateTime = `${startDate}T${startTime}`;
        const isoEndDateTime = `${endDate}T${endTime}`;
        const isSameOrAfterEnd = moment(isoStartDateTime).isSameOrAfter(isoEndDateTime);

        this.setState({
            startDate: startDate,
            endDate: isSameOrAfterEnd ? startDate : endDate,
            startTime: startTime,
            endTime: isSameOrAfterEnd ? startTime : endTime
        });
    };
    changeEndDate = (date) => {
        if (!date) {
            return;
        }
        const startDate = normalizeDateString(this.state.startDate);
        const endDate = normalizeDateString(date);
        const startTime = normalizeTimeString(this.state.startTime);
        const endTime = normalizeTimeString(this.state.endTime);
        const isoStartDateTime = `${startDate}T${startTime}`;
        const isoEndDateTime = `${endDate}T${endTime}`;
        const isSameOrBeforeStart = moment(isoEndDateTime).isSameOrBefore(isoStartDateTime);

        this.setState({
            startDate: isSameOrBeforeStart ? endDate : startDate,
            endDate: endDate,
            startTime: isSameOrBeforeStart ? endTime : startTime,
            endTime: endTime
        });
    };
    changeStartTime = (time = '00:00:00') => {
        const startDate = normalizeDateString(this.state.startDate);
        const endDate = normalizeDateString(this.state.endDate);
        const startTime = normalizeTimeString(time);
        const endTime = normalizeTimeString(this.state.endTime);
        const isoStartDateTime = `${startDate}T${startTime}`;
        const isoEndDateTime = `${endDate}T${endTime}`;
        const isSameOrAfterEnd = moment(isoStartDateTime).isSameOrAfter(isoEndDateTime);

        this.setState({
            startTime: startTime,
            endTime: isSameOrAfterEnd ? startTime : endTime
        });
    };
    changeEndTime = (time = '00:00:00') => {
        const startDate = normalizeDateString(this.state.startDate);
        const endDate = normalizeDateString(this.state.endDate);
        const startTime = normalizeTimeString(this.state.startTime);
        const endTime = normalizeTimeString(time);
        const isoStartDateTime = `${startDate}T${startTime}`;
        const isoEndDateTime = `${endDate}T${endTime}`;
        const isSameOrBeforeStart = moment(isoEndDateTime).isSameOrBefore(isoStartDateTime);

        this.setState({
            startTime: isSameOrBeforeStart ? endTime : startTime,
            endTime: endTime
        });
    };

    getInitialState() {
        const now = moment();

        return {
            startDate: moment(now).format('YYYY-MM-DD'),
            startTime: moment(now).format('hh:mm:ss'),
            endDate: moment(now).add(7, 'days').format('YYYY-MM-DD'),
            endTime: moment(now).add(7, 'days').format('hh:mm:ss')
        };
    }
    render() {
        const { locale } = this.props;
        const { startDate, startTime, endDate, endTime } = this.state;

        return (
            <div>
                <h3><Anchor href="https://github.com/trendmicro-frontend/react-datepicker/blob/master/examples/DateTimeRangePicker/Controlled.jsx" target="_blank">Controlled Component</Anchor></h3>
                <p><b>Note:</b> This example will update invalid date/time range.</p>
                <p>Selected: {startDate} {startTime} ~ {endDate} {endTime}</p>
                <DateTimeRangePicker
                    locale={locale}
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
