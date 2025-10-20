import React from 'react';
import PropTypes from 'prop-types';

export default function Card({
  as: Tag = 'div',
  className = '',
  children,
  ...props
}) {
  return (
    <Tag className={`card ${className}`} {...props}>
      {children}
    </Tag>
  );
}

Card.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  children: PropTypes.node,
};
