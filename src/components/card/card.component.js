import React from "react";
import PropTypes from "prop-types";
import styledSystemPropTypes from "@styled-system/prop-types";

import { filterStyledSystemMarginProps } from "../../style/utils";
import StyledCard from "./card.style";
import Icon from "../icon";
import CardRow from "./card-row/card-row.component";
import CardFooter from "./card-footer/card-footer.component";

const marginPropTypes = filterStyledSystemMarginProps(
  styledSystemPropTypes.space
);

const Card = ({
  action,
  children,
  cardWidth,
  interactive,
  draggable,
  spacing,
  dataRole,
  ...rest
}) => {
  const handleClick = (ev) => {
    if (!draggable && action) {
      action(ev);
    }
  };

  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      if (child.type === CardRow || child.type === CardFooter) {
        if (index === 0) {
          const childProps = {
            spacing,
            ...child.props,
          };

          if (child.type !== CardFooter) {
            const pad =
              React.Children.toArray(children).filter(
                (row) => row.type === CardRow
              ).length === 1
                ? "pt"
                : "py";

            childProps[pad] = 0;
          }
          return React.cloneElement(child, childProps);
        }
        return React.cloneElement(child, { spacing });
      }
      return child;
    });
  };

  const onClickHandler = interactive ? handleClick : null;

  const interactiveProps = interactive
    ? {
        tabIndex: 0,
        type: "button",
      }
    : undefined;

  return (
    <StyledCard
      data-component="card"
      cardWidth={cardWidth}
      interactive={interactive}
      draggable={draggable}
      spacing={spacing}
      onClick={onClickHandler}
      data-role={dataRole}
      {...interactiveProps}
      {...rest}
    >
      {draggable && <Icon type="drag" />}
      {renderChildren()}
    </StyledCard>
  );
};
Card.defaultProps = {
  spacing: "medium",
};

Card.propTypes = {
  ...marginPropTypes,
  /** action to be executed when card is clicked or enter pressed */
  action: PropTypes.func,
  children: PropTypes.node.isRequired,
  /** style value for width of card */
  cardWidth: PropTypes.string,
  /** flag to indicate if card is interactive */
  interactive: PropTypes.bool,
  /** flag to indicate if card is draggable */
  draggable: PropTypes.bool,
  /** size of card for applying padding (small | medium | large) */
  spacing: PropTypes.oneOf(["small", "medium", "large"]),
  dataRole: PropTypes.string,
};

export default Card;
