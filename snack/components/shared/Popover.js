/* @flow */

import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';

import colors from '../../configs/colors';

const { PureComponent, Children, cloneElement } = React;

type Props = {
  children?: React.Node,
  content: any,
};

type State = {
  popoverVisible: boolean,
};

export default class Popover extends PureComponent<Props, State> {
  state = {
    popoverVisible: false,
  };

  componentDidMount() {
    document.addEventListener('click', this._handleDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this._handleDocumentClick);
  }

  _handleDocumentClick = (e: any) => {
    if (
      this.state.popoverVisible &&
      (e.target === this._anchor ||
        e.target === this._popover ||
        (this._popover && this._popover.contains(e.target)))
    ) {
      return;
    }

    this._hidePopover();
  };

  _togglePopover = () => {
    if (!this.state.popoverVisible) {
      const popover = (this._popover && this._popover.getBoundingClientRect()) || {};
      const anchor = (this._anchor && this._anchor.getBoundingClientRect()) || {};
      const diff = (popover.width - 10) / 2 - anchor.left;

      if (this._popover && this._arrow) {
        if (diff > 0) {
          this._popover.style.left = `${diff + 5}px`;
          this._arrow.style.left = `${anchor.left - anchor.width / 2 + 10}px`;
        } else {
          this._popover.style.left = '5px';
          this._arrow.style.left = '50%';
        }
      }
    }

    this.setState(state => ({ popoverVisible: !state.popoverVisible }));
  };

  _hidePopover = () => this.setState({ popoverVisible: false });

  _setRef = (c: HTMLElement) => (this._anchor = c);

  _anchor: ?HTMLElement;
  _arrow: ?HTMLElement;
  _popover: ?HTMLElement;

  render() {
    const { children, content } = this.props;

    return (
      <div className={css(styles.container)}>
        {cloneElement(Children.only(children), {
          ref: this._setRef,
          onClick: this._togglePopover,
        })}
        <div
          ref={c => (this._popover = c)}
          className={css(
            styles.popover,
            this.state.popoverVisible ? styles.visible : styles.hidden
          )}>
          <span ref={c => (this._arrow = c)} className={css(styles.arrow)} />
          {content}
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'inherit',
  },

  popover: {
    position: 'absolute',
    top: '100%',
    margin: 12,
    padding: 16,
    width: '18em',
    border: `1px solid ${colors.border}`,
    borderRadius: 3,
    zIndex: 99,
    backgroundColor: 'inherit',
    color: 'inherit',
    transition: 'transform .2s, opacity .2s',
  },

  arrow: {
    position: 'absolute',
    height: 16,
    width: 16,
    top: -9,
    transform: 'translateX(-50%) rotate(45deg)',
    backgroundColor: 'inherit',
    borderColor: colors.border,
    borderWidth: '1px 0 0 1px',
    borderStyle: 'solid',
    borderTopLeftRadius: 4,
  },

  visible: {
    opacity: 1,
    transform: 'translateX(-50%) translateY(0)',
  },

  hidden: {
    opacity: 0,
    pointerEvents: 'none',
    transform: 'translateX(-50%) translateY(-.5em)',
  },
});
