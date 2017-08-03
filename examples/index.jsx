import 'trendmicro-ui/dist/css/trendmicro-ui.css';
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import moment from 'moment';
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import Navbar from './Navbar';
import Section from './Section';
import {
    DateTimePicker,
    DateTimeRangePicker
} from './components';
import {
    DatePicker
} from '../src';

const normalizeDateString = (dateString) => {
    let m = moment(dateString);
    if (!m.isValid()) {
        m = moment();
    }
    const year = m.year();
    const month = ('0' + (m.month() + 1)).slice(-2);
    const date = ('0' + m.date()).slice(-2);
    return `${year}-${month}-${date}`;
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

class App extends PureComponent {
    state = this.getInitialState();

    changeLocale = (locale) => {
        this.setState({ locale });
    };
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
            locale: 'en',
            startDate: normalizeDateString(now),
            endDate: normalizeDateString(now),
            startTime: normalizeTimeString('00:00:00'),
            endTime: normalizeTimeString('00:00:00')
        };
    }
    render() {
        const name = 'React DatePicker';
        const url = 'https://github.com/trendmicro-frontend/react-datepicker';

        return (
            <div>
                <Navbar
                    name={name}
                    url={url}
                    locale={this.state.locale}
                    changeLocale={this.changeLocale}
                />
                <div className="container-fluid" style={{ padding: '20px 20px 0' }}>
                    <div className="row">
                        <div className="col-lg-6 col-md-12">
                            <Section className="row-md-6">
                                <h2>Inline</h2>
                                <DatePicker
                                    locale={this.state.locale}
                                    date={this.state.startDate}
                                    onChange={this.changeStartDate}
                                />
                            </Section>
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <Section className="row-md-6">
                                <h2>Dropdown</h2>
                            </Section>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-12">
                            <Section className="row-md-8">
                                <h2>Date/Time Picker</h2>
                                <DateTimePicker
                                    locale={this.state.locale}
                                    date={this.state.startDate}
                                    time={this.state.startTime}
                                    onChangeDate={this.changeStartDate}
                                    onChangeTime={this.changeStartTime}
                                />
                            </Section>
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <Section className="row-md-8">
                                <h2>Date/Time Range Picker</h2>
                                <DateTimeRangePicker
                                    locale={this.state.locale}
                                    startDate={this.state.startDate}
                                    startTime={this.state.startTime}
                                    endDate={this.state.endDate}
                                    endTime={this.state.endTime}
                                    onChangeStartDate={this.changeStartDate}
                                    onChangeStartTime={this.changeStartTime}
                                    onChangeEndDate={this.changeEndDate}
                                    onChangeEndTime={this.changeEndTime}
                                />
                            </Section>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('container')
);
