import 'trendmicro-ui/dist/css/trendmicro-ui.css';
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import Navbar from './Navbar';
import Section from './Section';
import * as DatePickerExample from './DatePicker';
import * as DateTimePickerExample from './DateTimePicker';
import * as DateTimeRangePickerExample from './DateTimeRangePicker';

class App extends PureComponent {
    state = {
        locale: 'en'
    };

    changeLocale = (locale) => {
        this.setState({ locale });
    };

    getInitialState() {
        return {
            locale: 'en'
        };
    }
    render() {
        const name = 'React DatePicker';
        const url = 'https://github.com/trendmicro-frontend/react-datepicker';
        const { locale } = this.state;

        return (
            <div>
                <Navbar
                    name={name}
                    url={url}
                    locale={locale}
                    changeLocale={this.changeLocale}
                />
                <div className="container-fluid" style={{ padding: '20px 20px 0' }}>
                    <div className="row">
                        <div className="col-md-12">
                            <Section className="row-md-14">
                                <h2>DatePicker</h2>
                                <div className="row">
                                    <div className="col-md-6 col-lg-4">
                                        <DatePickerExample.Controlled locale={locale} />
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <DatePickerExample.Uncontrolled locale={locale} />
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <DatePickerExample.Selectable locale={locale} />
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <DatePickerExample.Dropdown locale={locale} />
                                    </div>
                                </div>
                            </Section>
                        </div>
                        <div className="col-md-12">
                            <Section className="row-md-8">
                                <h2>DateTimePicker</h2>
                                <div className="row">
                                    <div className="col-md-6 col-lg-4">
                                        <DateTimePickerExample.Controlled locale={locale} />
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <DateTimePickerExample.Uncontrolled locale={locale} />
                                    </div>
                                </div>
                            </Section>
                        </div>
                        <div className="col-md-12">
                            <Section className="row-md-15">
                                <h2>DateTimeRangePicker</h2>
                                <div className="row">
                                    <div className="col-md-12 col-lg-6">
                                        <DateTimeRangePickerExample.Controlled locale={locale} />
                                    </div>
                                    <div className="col-md-12 col-lg-6">
                                        <DateTimeRangePickerExample.Uncontrolled locale={locale} />
                                    </div>
                                    <div className="col-md-12">
                                        <DateTimeRangePickerExample.Dropdown locale={locale} />
                                    </div>
                                </div>
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
