import React from 'react';
import PropTypes from 'prop-types';
import './button.css'; //

export default function Button({
  variant = 'default',
  className = '',
  type = 'button',
  children,
  ...props
}) {
  const styles = {
    default: 'btn',
    primary: 'btn btn-primary',
    danger: 'btn btn-danger',
    ghost: 'btn btn-ghost',
  };

  return (
    <button
      type={type}
      className={`${styles[variant] || styles.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['default', 'primary', 'danger', 'ghost']),
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};
