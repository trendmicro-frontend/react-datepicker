import Dropdown from '@trendmicro/react-dropdown';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { DatePicker, DateInput } from '../../src';

export default class extends PureComponent {
    static propTypes = {
        locale: PropTypes.string
    };

    state = this.getInitialState();

    getInitialState() {
        const now = moment();

        return {
            value: moment(now).format('YYYY-MM-DD')
        };
    }
    render() {
        const { locale } = this.props;
        const { value } = this.state;

        return (
            <div>
                <h3>Dropdown Menu</h3>
                <p>{value}</p>
                <Dropdown>
                    <Dropdown.Toggle
                        btnStyle="link"
                        noCaret
                        style={{ padding: 0 }}
                    >
                        <DateInput
                            value={value}
                            onChange={value => {
                                this.setState(state => ({ value: value }));
                            }}
                        />
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ padding: 8 }}>
                        <DatePicker
                            locale={locale}
                            value={value}
                            onSelect={value => {
                                this.setState(state => ({ value: value }));
                            }}
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        );
    }
}
