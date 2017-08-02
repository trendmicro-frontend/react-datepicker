import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button } from '@trendmicro/react-buttons';
import Dropdown, { MenuItem } from '@trendmicro/react-dropdown';
import styles from './Navbar.styl';

const locales = [
    'en',
    'cs',
    'de',
    'es',
    'fr',
    'it',
    'ja',
    'pt-br',
    'ru',
    'zh-cn',
    'zh-tw'
];

const mapLocaleToString = (locale) => {
    return {
        'en': 'English',
        'cs': 'Czech',
        'de': 'German',
        'es': 'Spanish',
        'fr': 'French',
        'it': 'Italian',
        'ja': 'Japanese',
        'pt-br': 'Portuguese',
        'ru': 'Russian',
        'zh-cn': 'Simplified Chinese',
        'zh-tw': 'Traditional Chinese'
    }[locale];
};

export default class extends Component {
    static propTypes = {
        name: PropTypes.string,
        url: PropTypes.string,
        locale: PropTypes.string,
        changeLocale: PropTypes.func
    };

    state = {
        collapseIn: false
    };

    render() {
        const { name, url } = this.props;

        return (
            <nav
                className={classNames(styles.navbar, styles.navbarDefault)}
                style={{ borderRadius: 0 }}
            >
                <div className={styles.containerFluid}>
                    <div className={styles.navbarHeader}>
                        <button
                            type="button"
                            className={classNames(styles.navbarToggle, styles.collapsed)}
                            onClick={() => {
                                this.setState({ collapseIn: !this.state.collapseIn });
                            }}
                        >
                            <span className={styles.srOnly}>Toggle navigation</span>
                            <span className={styles.iconBar} />
                            <span className={styles.iconBar} />
                            <span className={styles.iconBar} />
                        </button>
                        <a href="#" className={styles.navbarBrand}>{name}</a>
                    </div>
                    <div
                        className={classNames(
                            styles.collapse,
                            styles.navbarCollapse,
                            { [styles.in]: this.state.collapseIn }
                        )}
                    >
                        <Button
                            className={classNames(styles.navbarBtn, styles.navbarRight)}
                            btnStyle="flat"
                            onClick={() => {
                                window.location = url;
                            }}
                        >
                            <i className="fa fa-github" />
                            GitHub
                        </Button>
                        <Dropdown
                            className={classNames(
                                styles.navbarBtn,
                                styles.navbarRight
                            )}
                            style={{ marginRight: 5 }}
                            onSelect={eventKey => {
                                const locale = eventKey;
                                this.props.changeLocale(locale);
                            }}
                        >
                            <Dropdown.Toggle
                                btnStyle="flat"
                            >
                                {mapLocaleToString(this.props.locale)}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {locales.map(locale => (
                                    <MenuItem
                                        key={locale}
                                        eventKey={locale}
                                        active={locale === this.props.locale}
                                    >
                                        {mapLocaleToString(locale)}
                                    </MenuItem>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </nav>
        );
    }
}
