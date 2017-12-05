import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Anchor from '@trendmicro/react-anchor';
import { Button } from '@trendmicro/react-buttons';
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown'; // @trendmicro/react-dropdown@0.7.0 or above is required
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

const mapPeriodToString = (period) => {
    return {
        '1d': 'Last 24 hours',
        '7d': 'Last 7 days',
        '30d': 'Last 30 days',
        '90d': 'Last 90 days',
        'custom': 'Custom range'
    }[period];
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
        const endDate = normalizeDateString(this.state.nextEndDate);
        const startTime = normalizeTimeString(this.state.nextStartTime);
        const endTime = normalizeTimeString(this.state.nextEndTime);
        const isoStartDateTime = `${startDate}T${startTime}`;
        const isoEndDateTime = `${endDate}T${endTime}`;
        const isSameOrAfterEnd = moment(isoStartDateTime).isSameOrAfter(isoEndDateTime);

        this.setState({
            nextStartDate: startDate,
            nextEndDate: isSameOrAfterEnd ? startDate : endDate,
            nextStartTime: startTime,
            nextEndTime: isSameOrAfterEnd ? startTime : endTime
        });
    };
    changeEndDate = (date) => {
        if (!date) {
            return;
        }
        const startDate = normalizeDateString(this.state.nextStartDate);
        const endDate = normalizeDateString(date);
        const startTime = normalizeTimeString(this.state.nextStartTime);
        const endTime = normalizeTimeString(this.state.nextEndTime);
        const isoStartDateTime = `${startDate}T${startTime}`;
        const isoEndDateTime = `${endDate}T${endTime}`;
        const isSameOrBeforeStart = moment(isoEndDateTime).isSameOrBefore(isoStartDateTime);

        this.setState({
            nextStartDate: isSameOrBeforeStart ? endDate : startDate,
            nextEndDate: endDate,
            nextStartTime: isSameOrBeforeStart ? endTime : startTime,
            nextEndTime: endTime
        });
    };
    changeStartTime = (time = '00:00:00') => {
        const startDate = normalizeDateString(this.state.nextStartDate);
        const endDate = normalizeDateString(this.state.nextEndDate);
        const startTime = normalizeTimeString(time);
        const endTime = normalizeTimeString(this.state.nextEndTime);
        const isoStartDateTime = `${startDate}T${startTime}`;
        const isoEndDateTime = `${endDate}T${endTime}`;
        const isSameOrAfterEnd = moment(isoStartDateTime).isSameOrAfter(isoEndDateTime);

        this.setState({
            nextStartTime: startTime,
            nextEndTime: isSameOrAfterEnd ? startTime : endTime
        });
    };
    changeEndTime = (time = '00:00:00') => {
        const startDate = normalizeDateString(this.state.nextStartDate);
        const endDate = normalizeDateString(this.state.nextEndDate);
        const startTime = normalizeTimeString(this.state.nextStartTime);
        const endTime = normalizeTimeString(time);
        const isoStartDateTime = `${startDate}T${startTime}`;
        const isoEndDateTime = `${endDate}T${endTime}`;
        const isSameOrBeforeStart = moment(isoEndDateTime).isSameOrBefore(isoStartDateTime);

        this.setState({
            nextStartTime: isSameOrBeforeStart ? endTime : startTime,
            nextEndTime: endTime
        });
    };

    getInitialState() {
        const now = moment();
        const startDate = moment(now).format('YYYY-MM-DD');
        const startTime = moment(now).format('hh:mm:ss');
        const endDate = moment(now).add(7, 'days').format('YYYY-MM-DD');
        const endTime = moment(now).add(7, 'days').format('hh:mm:ss');

        return {
            // prev
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,

            // next
            nextStartDate: startDate,
            nextStartTime: startTime,
            nextEndDate: endDate,
            nextEndTime: endTime,

            // Dropdown
            open: false,
            period: '1d',
            showDateTimeRangePicker: false
        };
    }
    render() {
        const { locale } = this.props;
        const {
            startDate, startTime, endDate, endTime,
            nextStartDate, nextStartTime, nextEndDate, nextEndTime,
            period
        } = this.state;

        return (
            <div>
                <h3><Anchor href="https://github.com/trendmicro-frontend/react-datepicker/blob/master/examples/DateTimeRangePicker/Dropdown.jsx" target="_blank">Right Align Dropdown</Anchor></h3>
                {period !== 'custom' &&
                <p>Selected: {mapPeriodToString(period)}</p>
                }
                {period === 'custom' &&
                <p>Selected: {startDate} {startTime} - {endDate} {endTime}</p>
                }
                <Dropdown
                    style={{ width: '100%' }}
                    pullRight
                    open={this.state.open}
                    onSelect={eventKey => {
                        this.setState(state => ({
                            period: eventKey,
                            showDateTimeRangePicker: eventKey === 'custom',
                            nextStartDate: state.startDate,
                            nextStartTime: state.startTime,
                            nextEndDate: state.endDate,
                            nextEndTime: state.endTime
                        }));
                    }}
                    onClose={() => {
                        this.setState(state => ({
                            open: false,
                            showDateTimeRangePicker: false
                        }));
                    }}
                    onToggle={open => {
                        this.setState(state => {
                            const { period } = state;
                            return {
                                open: open || period === 'custom'
                            };
                        });
                    }}
                >
                    <Dropdown.Toggle style={{ float: 'right' }}>
                        {mapPeriodToString(period)}
                    </Dropdown.Toggle>
                    <Dropdown.MenuWrapper style={{ left: 'auto', right: 0 }}>
                        <Dropdown.Menu style={{ left: 'auto', right: 0, float: 'right' }}>
                            <MenuItem eventKey="1d">{mapPeriodToString('1d')}</MenuItem>
                            <MenuItem eventKey="7d">{mapPeriodToString('7d')}</MenuItem>
                            <MenuItem eventKey="30d">{mapPeriodToString('30d')}</MenuItem>
                            <MenuItem eventKey="90d">{mapPeriodToString('90d')}</MenuItem>
                            <MenuItem eventKey="custom">
                                {mapPeriodToString('custom')}
                            </MenuItem>
                        </Dropdown.Menu>
                        {(this.state.showDateTimeRangePicker || this.state.period === 'custom') &&
                        <div
                            style={{
                                display: 'inline-block',
                                borderRight: '1px solid #ddd',
                                padding: 12
                            }}
                        >
                            <DateTimeRangePicker
                                locale={locale}
                                startDate={nextStartDate}
                                startTime={nextStartTime}
                                endDate={nextEndDate}
                                endTime={nextEndTime}
                                onChangeStartDate={this.changeStartDate}
                                onChangeStartTime={this.changeStartTime}
                                onChangeEndDate={this.changeEndDate}
                                onChangeEndTime={this.changeEndTime}
                            />
                            <div>
                                <Button
                                    btnStyle="primary"
                                    style={{ marginRight: 8 }}
                                    onClick={() => {
                                        this.setState(state => ({
                                            open: false,
                                            showDateTimeRangePicker: false,

                                            // Apply date/time range
                                            startDate: nextStartDate,
                                            startTime: nextStartTime,
                                            endDate: nextEndDate,
                                            endTime: nextEndTime
                                        }));
                                    }}
                                >
                                    Apply
                                </Button>
                                <Button
                                    onClick={() => {
                                        this.setState(state => ({
                                            open: false,
                                            showDateTimeRangePicker: false
                                        }));
                                    }}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                        }
                    </Dropdown.MenuWrapper>
                </Dropdown>
            </div>
        );
    }
}
