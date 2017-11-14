import React from 'react';
import PropTypes from 'prop-types';
import Component from 'react-class';
import { Button as ButtonDefault } from '@trendmicro/react-buttons';


import assign from 'object-assign';

import joinFunctions from './joinFunctions';
import join from './join';

import styles from './Footer.styl';

const SPACER = <div />;


const preventDefault = e => e.preventDefault();

export const Button = (props) => {
    const className = styles.button;

    return (<ButtonDefault
        {...props}
        className={className}
    />);
};

export default class Footer extends Component {
    render() {
        const props = this.p = assign({}, this.props);

        const className = join(props.className, styles.footer);

        const todayButton = this.renderTodayButton();
        const clearButton = this.renderClearButton();

        const okButton = this.renderOkButton();
        const cancelButton = this.renderCancelButton();

        if (!todayButton && !clearButton && !okButton && !cancelButton) {
            return null;
        }

        const middleSpacer = (okButton || cancelButton) ? SPACER : null;

        const spacer = !props.centerButtons ?
            middleSpacer :
            null;

        let children = [
            todayButton,
            clearButton,

            spacer,

            okButton,
            props.centerButtons && SPACER
        ];

        if (props.renderChildren) {
            children = props.renderChildren(children, props);
        }

        return (<div
            className={className}
        >{children}</div>);
    }

    renderTodayButton() {
        if (!this.props.todayButton) {
            return null;
        }
        return this.renderButton(this.props.todayButtonText, this.props.onTodayClick);
    }

    renderClearButton() {
        if (!this.props.clearButton) {
            return null;
        }

        return this.renderButton({
            children: this.props.clearButtonText,
            disabled: this.props.clearDate === undefined
        }, this.props.onClearClick);
    }

    renderOkButton() {
        if (!this.props.okButton) {
            return null;
        }
        return this.renderButton(this.props.okButtonText, this.props.onOkClick);
    }

    renderCancelButton() {
        if (!this.props.cancelButton) {
            return null;
        }
        return this.renderButton(this.props.cancelButtonText, this.props.onCancelClick);
    }

    renderButton(props, fn) {
        let text = props.children;
        let p = props;

        if (typeof props === 'string') {
            p = {};
            text = props;
        }

        if (typeof fn === 'function' && !p.onClick && !p.disabled) {
            p.onClick = fn;
        }

        const Factory = this.props.buttonFactory;

        const onMouseDown = p.onMouseDown ?
            joinFunctions(p.onMouseDown, preventDefault) :
            preventDefault;

        return <Factory tabIndex={0} {...p} onMouseDown={onMouseDown}>{text}</Factory>;
    }
}

Footer.defaultProps = {
    actionEvent: 'onClick',
    theme: 'default',

    buttonFactory: Button,

    todayButton: true,
    clearButton: true,
    okButton: true,
    cancelButton: true,

    todayButtonText: 'Today',
    clearButtonText: 'Clear',
    okButtonText: 'Apply',
    cancelButtonText: 'Cancel',

    isDatePickerFooter: true
};

Footer.propTypes = {
    theme: PropTypes.string,
    centerButtons: PropTypes.bool,

    cokButtonText: PropTypes.node,
    clearButtonText: PropTypes.node,
    cancelButtonText: PropTypes.node,
    todayButtonText: PropTypes.node,

    onTodayClick: PropTypes.func,
    onClearClick: PropTypes.func,
    onOkClick: PropTypes.func,
    onCancelClick: PropTypes.func
};
