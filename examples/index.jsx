import 'trendmicro-ui/dist/css/trendmicro-ui.css';
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import moment from 'moment';
import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './Navbar';
import Section from './Section';
import DateTimeRangePicker from './DateTimeRangePicker';
import {
    DatePicker
} from '../src';

class App extends React.Component {
    state = this.getInitialState();

    changeLocale = (locale) => {
        this.setState({ locale });
    };
    changeStartDate = (date) => {
        this.setState({ startDate: date });
    };
    changeEndDate = (date) => {
        this.setState({ endDate: date });
    };
    changeStartTime = (time) => {
        let [h, m, s] = time.split(':');
        h = Number(h) || 0;
        if (h < 0 || h > 23) {
            h = '00';
        } else {
            h = ('0' + h).slice(-2);
        }
        time = [h, m, s].join(':');
        this.setState({ startTime: time });
    };
    changeEndTime = (time) => {
        let [h, m, s] = time.split(':');
        h = Number(h) || 0;
        if (h < 0 || h > 23) {
            h = '00';
        } else {
            h = ('0' + h).slice(-2);
        }
        time = [h, m, s].join(':');
        this.setState({ endTime: time });
    };

    getInitialState() {
        const now = moment();
        const date = `${now.year()}-${now.month() + 1}-${now.date()}`;

        return {
            locale: 'en',
            startDate: date,
            endDate: date,
            startTime: '00:00:00',
            endTime: '00:00:00'
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
                        <div className="col-md-12">
                            <Section className="row-md-6">
                                <h2>Inline</h2>
                                <DatePicker
                                    locale={this.state.locale}
                                    date={this.state.startDate}
                                    onChange={this.changeStartDate}
                                />
                            </Section>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
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
