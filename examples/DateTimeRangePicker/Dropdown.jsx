import _isInteger from 'lodash/isInteger';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import Anchor from '@trendmicro/react-anchor';
import { Button } from '@trendmicro/react-buttons';
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown';
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
    if (period === 'custom') {
        return 'Specified range';
    }

    // Only days are supported (e.g. 1, 7, '1d', or '7d')
    if (_isInteger(period) || period.match(/^\d+d$/)) {
        const days = parseInt(period, 10);
        if (days === 1) {
            return 'Today';
        }
        if (days > 1) {
            return `Last ${days} days`;
        }
    }

    return '';
};

class DateTimeRangePickerDropdown extends PureComponent {
    static propTypes = {
        locale: PropTypes.string,
        periods: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string
            ])
        ),
        period: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        defaultPeriod: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        onSelect: PropTypes.func
    };
    static defaultProps = {
        periods: ['1d', '7d', '14d', '30d', '60d'],
        defaultPeriod: '7d'
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

    handleDropdownSelect = (eventKey) => {
        const period = eventKey;

        if (period !== this.state.period) {
            const now = moment().seconds(0);
            const days = parseInt(this.props.defaultPeriod, 10) || DateTimeRangePickerDropdown.defaultProps.defaultPeriod;
            const startDate = moment(now).subtract(days, 'days').format('YYYY-MM-DD');
            const startTime = moment(now).subtract(days, 'days').format('hh:mm:ss');
            const endDate = moment(now).format('YYYY-MM-DD');
            const endTime = moment(now).format('hh:mm:ss');

            this.setState(state => ({
                period,
                startDate,
                startTime,
                endDate,
                endTime
            }));
        }

        this.setState(state => ({
            nextStartDate: state.startDate,
            nextStartTime: state.startTime,
            nextEndDate: state.endDate,
            nextEndTime: state.endTime
        }), () => {
            const { onSelect } = this.props;

            if (typeof onSelect !== 'function') {
                return;
            }

            const { period, startDate, startTime, endDate, endTime } = this.state;
            if (period === 'custom') {
                onSelect({ period, startDate, startTime, endDate, endTime });
            } else {
                onSelect({ period });
            }
        });
    };

    handleDropdownClose = () => {
        this.setState(state => ({
            open: false,

            // Restore to previous state
            nextStartDate: state.startDate,
            nextStartTime: state.startTime,
            nextEndDate: state.endDate,
            nextEndTime: state.endTime
        }));
    };

    handleDropdownToggle = (open) => {
        this.setState(state => {
            const { period } = state;
            return {
                open: open || period === 'custom'
            };
        });
    };

    handleClickApplyForSpecifiedRange = () => {
        this.setState(state => ({
            open: false,

            // Apply specified range
            startDate: state.nextStartDate,
            startTime: state.nextStartTime,
            endDate: state.nextEndDate,
            endTime: state.nextEndTime
        }), () => {
            const { onSelect } = this.props;

            if (typeof onSelect !== 'function') {
                return;
            }

            const { period, startDate, startTime, endDate, endTime } = this.state;
            if (period === 'custom') {
                onSelect({ period, startDate, startTime, endDate, endTime });
            } else {
                onSelect({ period });
            }
        });
    };

    handleClickCancelForSpecifiedRange = () => {
        this.setState(state => ({
            open: false,

            // Restore to previous state
            nextStartDate: state.startDate,
            nextStartTime: state.startTime,
            nextEndDate: state.endDate,
            nextEndTime: state.endTime
        }));
    };

    getInitialState() {
        const now = moment().seconds(0);
        const days = parseInt(this.props.defaultPeriod, 10) || DateTimeRangePickerDropdown.defaultProps.defaultPeriod;
        const startDate = moment(now).subtract(days, 'days').format('YYYY-MM-DD');
        const startTime = moment(now).subtract(days, 'days').format('hh:mm:ss');
        const endDate = moment(now).format('YYYY-MM-DD');
        const endTime = moment(now).format('hh:mm:ss');

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
            period: this.props.period
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.period !== nextProps.period) {
            this.setState({ period: nextProps.period });
        }
    }

    render() {
        const { locale, periods } = this.props;
        const {
            startDate, startTime, endDate, endTime,
            nextStartDate, nextStartTime, nextEndDate, nextEndTime
        } = this.state;
        const period = this.state.period !== undefined ? this.state.period : this.props.defaultPeriod;
        const showDateTimeRangePicker = this.state.open && (period === 'custom');

        return (
            <div>
                <h3><Anchor href="https://github.com/trendmicro-frontend/react-datepicker/blob/master/examples/DateTimeRangePicker/Dropdown.jsx" target="_blank">Dropdown</Anchor></h3>
                {period !== 'custom' &&
                <p>Selected: {mapPeriodToString(period)}</p>
                }
                {period === 'custom' &&
                <p>Selected: {startDate} {startTime} - {endDate} {endTime}</p>
                }
                <Dropdown
                    open={this.state.open}
                    onSelect={this.handleDropdownSelect}
                    onClose={this.handleDropdownClose}
                    onToggle={this.handleDropdownToggle}
                >
                    <Dropdown.Toggle>
                        {mapPeriodToString(period)}
                    </Dropdown.Toggle>
                    <Dropdown.MenuWrapper
                        style={{
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <Dropdown.Menu>
                            {periods.map(period => (
                                <MenuItem eventKey={period} key={period}>
                                    {mapPeriodToString(period)}
                                </MenuItem>
                            ))}
                            <MenuItem divider />
                            <MenuItem eventKey="custom">
                                {mapPeriodToString('custom')}
                            </MenuItem>
                        </Dropdown.Menu>
                        {showDateTimeRangePicker &&
                        <div
                            style={{
                                display: 'inline-block',
                                borderLeft: '1px solid #ddd',
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
                            <div className="clearfix">
                                <div className="pull-right">
                                    <Button
                                        btnStyle="primary"
                                        style={{ marginRight: 8 }}
                                        onClick={this.handleClickApplyForSpecifiedRange}
                                    >
                                        {'Apply'}
                                    </Button>
                                    <Button onClick={this.handleClickCancelForSpecifiedRange}>
                                        {'Cancel'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        }
                    </Dropdown.MenuWrapper>
                </Dropdown>
            </div>
        );
    }
}

export default DateTimeRangePickerDropdown;
