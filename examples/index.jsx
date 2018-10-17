import 'trendmicro-ui/dist/css/trendmicro-ui.css';
import qs from 'qs';
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import toRenderProps from 'recompose/toRenderProps';
import withStateHandlers from 'recompose/withStateHandlers';
import Navbar from './Navbar';
import Section from './Section';
import * as DatePickerExample from './DatePicker';
import * as DateTimePickerExample from './DateTimePicker';
import * as DateTimeRangePickerExample from './DateTimeRangePicker';

const q = qs.parse(window.location.search, { ignoreQueryPrefix: true });
const locale = q.locale || 'en';

const Enhanced = toRenderProps(withStateHandlers(
    { // state
        period: '7d'
    },
    { // handlers
        onSelect: () => ({ period }) => ({
            period
        })
    }
));

class App extends PureComponent {
    state = {
        locale: locale
    };

    changeLocale = (locale) => {
        window.location.search = `locale=${locale}`;
    };

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
                            <Section className="row-md-24">
                                <h2>DateTimeRangePicker</h2>
                                <div className="row">
                                    <div className="col-md-12 col-lg-6">
                                        <DateTimeRangePickerExample.Controlled locale={locale} />
                                    </div>
                                    <div className="col-md-12 col-lg-6">
                                        <DateTimeRangePickerExample.Uncontrolled locale={locale} />
                                    </div>
                                    <div className="col-md-12" style={{ height: 540 }}>
                                        <Enhanced locale={locale}>
                                            {({ locale, period, onSelect }) => (
                                                <DateTimeRangePickerExample.Dropdown
                                                    locale={locale}
                                                    period={period}
                                                    onSelect={onSelect}
                                                />
                                            )}
                                        </Enhanced>
                                    </div>
                                    <div className="col-md-12" style={{ height: 540 }}>
                                        <DateTimeRangePickerExample.DropdownRight locale={locale} />
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
