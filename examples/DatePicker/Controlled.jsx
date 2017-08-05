import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { DatePicker } from '../../src';

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
                <h3>Controlled Component</h3>
                <p>{value}</p>
                <DatePicker
                    locale={locale}
                    value={value}
                    onSelect={value => {
                        this.setState(state => ({ value: value }));
                    }}
                />
            </div>
        );
    }
}
