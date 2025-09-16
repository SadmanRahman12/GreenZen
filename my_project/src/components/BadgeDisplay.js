import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './BadgeDisplay.css';

const BadgeDisplay = ({ badge, size = 'md', showTooltip = true }) => {
  const getBadgeSize = () => {
    switch (size) {
      case 'sm':
        return 'badge-sm';
      case 'lg':
        return 'badge-lg';
      case 'xl':
        return 'badge-xl';
      default:
        return 'badge-md';
    }
  };

  const badgeElement = (
    <div className={`badge-display ${getBadgeSize()}`}>
      <div 
        className="badge-icon"
        style={{ backgroundColor: badge.color || '#28a745' }}
      >
        <i className={badge.icon || 'fas fa-star'}></i>
      </div>
      {(size === 'lg' || size === 'xl') && (
        <div className="badge-info">
          <div className="badge-name">{badge.name}</div>
          {size === 'xl' && (
            <div className="badge-description">{badge.description}</div>
          )}
        </div>
      )}
    </div>
  );

  if (showTooltip && size !== 'xl') {
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip>
            <strong>{badge.name}</strong>
            <br />
            {badge.description}
            {badge.requirement && (
              <>
                <br />
                <small>Requirement: {badge.requirement}</small>
              </>
            )}
          </Tooltip>
        }
      >
        {badgeElement}
      </OverlayTrigger>
    );
  }

  return badgeElement;
};

export default BadgeDisplay;