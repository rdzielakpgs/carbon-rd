import React from 'react';
import { DragDropContext } from 'react-dnd';
import PropTypes from 'prop-types';
import TouchBackend from 'react-dnd-touch-backend';
import ItemTargetHelper from '../../../utils/helpers/dnd/item-target';
import CustomDragLayer from '../custom-drag-layer';
import Browser from '../../../utils/helpers/browser';
// import ScrollabeParent from '../../../utils/helpers/scrollable-parent';
import ReactDOM from "react-dom";

/**
 * A draggable context component
 *
 * == How to use a draggable context in a component:
 *
 * In your file
 *
 *   import { DraggableContext, WithDrop, WithDrag } from 'carbon/lib/components/drag-and-drop'
 *
 * A draggable context is used to define an area in the page where drag and drop can be used on
 * one or more elements (you also need to use WithDrop and WithDrag):
 *
 *   <DraggableContext onDrag={ onItemMoved }>
 *     <ol>
 *       {
 *         items.map((item, index) => {
 *           return (
 *             <WithDrop index={ index }>
 *               <li>
 *                 <WithDrag><span>{ item.content }</span></WithDrag>
 *               </li>
 *             </WithDrop>
 *           );
 *         })
 *       }
 *     </ol>
 *   </DraggableContext>
 *
 * @class DraggableContext
 * @constructor
 */
class DraggableContext extends React.Component {
  static propTypes = {
    /**
     * The element(s) where you want to apply drag
     * and drop functionality
     *
     * @property children
     * @type {Object}
     */
    children: PropTypes.node.isRequired,

    /**
     * Optional CustomDragLayer to use for the ghost row when dragging & dropping
     *
     * @property customDragLayer
     * @type {Object}
     */
    customDragLayer: PropTypes.node,

    /**
     * Callback function for when an item has been dragged
     * e.g. to update data in a store
     */
    onDrag: PropTypes.func.isRequired,

    /**
     * Prop to enable/disable auto scroll on drag
     *
     * @property autoScroll
     * @type {Bool}
     */
    autoScroll: PropTypes.bool
  }

  /**
   * Defines a context object for child components of the draggable context component.
   * https://facebook.github.io/react/docs/context.html
   *
   * @property childContextTypes
   * @type {Object}
   */
  static childContextTypes = {
    dragAndDropActiveIndex: PropTypes.number, // Tracks the currently dragged index
    dragAndDropBeginDrag: PropTypes.func, // Callback for when dragging begins
    dragAndDropEndDrag: PropTypes.func, // Callback for when dragging ends
    dragAndDropHover: PropTypes.func, // Callback for when a hover is triggered
    dragAndDropOnDrag: PropTypes.func // Callback for when order is changed
  }

  static defaultProps = {
    customDragLayer: <CustomDragLayer />,
    autoScroll: false
  }

  state = {
    activeIndex: null // {Number} tracks the currently dragged index
  }

  constructor(props) {
    super(props);

    // Default speed of auto scrolling
    this.speed = 0;

    // Frame callback ref
    this.frame = null;

    // Frame callback ref
    this.dragging = false;

    // Frame callback ref
    this.element = null;
  }

  /**
   * Returns this draggable context properties to child components.
   *
   * @method getChildContext
   * @return {void}
   */
  getChildContext() {
    return {
      dragAndDropActiveIndex: this.state.activeIndex,
      dragAndDropBeginDrag: this.handleBeginDrag,
      dragAndDropEndDrag: this.handleEndDrag,
      dragAndDropHover: this.handleHover,
      dragAndDropOnDrag: this.handleDrag
    };
  }

  /**
   * A callback for when hover is triggered
   *
   * @method handleHover
   * @return {Void}
   */
  handleHover = ItemTargetHelper.onHoverUpDown

  /**
   * A callback for when auto scroll is triggered
   *
   * @method autoScroll
   * @param {Object} ev event
   * @return {void}
   */
  checkAutoScrollTrigger = (event) => {
    if (!this.state.dragging) {
      return;
    }

    // constant for the position of the mouse pointer
    // on the y axis
    const { clientY } = event;
    // constant for the threshold where the auto scroll begins
    const threshold = Math.max(140, window.innerHeight / 4);

    let speed = 0;
    if (clientY < threshold) {
      // -1 to 0 as we move from 0 to threshold
      speed = -1 + clientY / threshold;
    } else if (clientY > window.innerHeight - threshold) {
      // 0 to 1 as we move from (innerHeight - threshold) to innerHeight
      speed = 1 - (window.innerHeight - clientY) / threshold;
    } else {
      speed = 0;
    }

    if (this.speed === 0 && speed !== 0) {
      this.speed = speed;
      this.startScrolling();
    }
    this.speed = speed;
  }

  searchForScrollableParent(element) {
    if (!element) { return null; }
    const style = Browser.getWindow().getComputedStyle(element);
    const isElementScrollable = style && style.position !== 'absolute'
    && /(auto|scroll)/.test(style.overflow + style.overflowY + style.overflowX);
    if (isElementScrollable) {
      return element;
    }
    return this.searchForScrollableParent(element.parentElement);
  }

  startScrolling = () => {
    if (!this.frame) {
      this.frame = window.requestAnimationFrame(this.tick);
    }
  }

  tick = () => {
    if (!this.speed) {
      this.frame = null;
      return;
    }

    const node = ReactDOM.findDOMNode(this);
    this.element = this.searchForScrollableParent(node);

    if (this.element) this.element.scrollTop += this.speed * 10;

    window.scrollTo(0, window.scrollY + (this.speed * 10));
    this.frame = window.requestAnimationFrame(this.tick);
  }

  /**
   * A callback for when a drag is triggered.
   *
   * Stores the hoverIndex in state as activeIndex,
   * and calls this.props.onDrag only if originalIndex
   * is not undefined.
   *
   * @method handleDrag
   * @param {Number} originalIndex (the active item's original index)
   * @param {Number} hoverIndex (the active item's new index
   * @return {Void}
   */
  handleDrag = (originalIndex, hoverIndex) => {
    this.setState({ activeIndex: hoverIndex });

    if (typeof originalIndex !== 'undefined') {
      this.props.onDrag(originalIndex, hoverIndex);
    }
  }

  /**
   * A callback for when dragging begins.
   *
   * Sets state of dragging to true which
   * will trigger the start of auto scroll
   * if it is enabled.
   *
   * @method handleBeginDrag
   * @param {Object} props
   * @return {Void}
   */
  handleBeginDrag = (props) => {
    this.setState({ dragging: true });

    return {
      index: props.index,
      ...props
    };
  }

  /**
   * A callback for when a drag ends triggered.
   *
   * @method handleEndDrag
   * @return {Void}
   */
  handleEndDrag = () => {
    // dragging has ended so remove the active index
    this.setState({ activeIndex: null, dragging: false });
    this.speed = 0;
  }

  /**
   * Renders the component
   */
  render() {
    return (
      <div className='carbon-draggable-context'
        onMouseMove={ this.props.autoScroll ? this.checkAutoScrollTrigger : undefined }
      >
        { this.props.children }
        { this.props.customDragLayer }
      </div>
    );
  }
}

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(DraggableContext);
